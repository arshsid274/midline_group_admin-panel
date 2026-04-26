import { promises as fs } from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { isValidSlotId } from '@/lib/mediaSlots'
import { readManifest, removeEntry, saveUpload, setEntry } from '@/lib/mediaManifest'
import { isLocked } from '@/lib/mediaPreservation'
import { transcodeVideo } from '@/lib/mediaTranscode'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// ffmpeg transcoding for hero-sized videos can take well over 60s; let
// Vercel know we want extended runtime if this ever runs there. (In
// practice this route only runs locally — Vercel's filesystem is
// read-only — but the directive is harmless on platforms that ignore it.)
export const maxDuration = 300

const MAX_BYTES = 200 * 1024 * 1024 // 200 MB
const LOCKED_MSG = 'Changes are preserved — click "Unlock to edit" before uploading or deleting.'

export async function POST(req: Request): Promise<Response> {
  if (await isLocked()) {
    return NextResponse.json({ error: LOCKED_MSG }, { status: 423 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data body' }, { status: 400 })
  }

  const slotId = String(form.get('slotId') ?? '')
  const file = form.get('file')

  if (!slotId || !isValidSlotId(slotId)) {
    return NextResponse.json({ error: `Unknown slotId: ${slotId}` }, { status: 400 })
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: `File exceeds ${MAX_BYTES} bytes` }, { status: 413 })
  }
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    return NextResponse.json({ error: `Unsupported MIME: ${file.type}` }, { status: 415 })
  }

  const saved = await saveUpload(slotId, file)
  let publicUrl = saved.url
  let transcoded: { webm: string; mp4: string; poster: string } | undefined

  if (file.type.startsWith('video/')) {
    // ffmpeg refuses to read and write the same path. Rename the upload
    // to a `.input<ext>` sibling so the WebM/MP4/JPG outputs use the
    // canonical basename.
    const tempInputPath = path.join(saved.absDir, `${saved.basename}.input${saved.ext}`)
    await fs.rename(saved.absPath, tempInputPath)

    try {
      await transcodeVideo(tempInputPath, saved.absDir, saved.basename)
    } catch (err: unknown) {
      // Roll back: drop the temp input AND any partial outputs.
      await Promise.all([
        fs.unlink(tempInputPath).catch(() => {}),
        fs.unlink(path.join(saved.absDir, `${saved.basename}.webm`)).catch(() => {}),
        fs.unlink(path.join(saved.absDir, `${saved.basename}.mp4`)).catch(() => {}),
        fs.unlink(path.join(saved.absDir, `${saved.basename}.jpg`)).catch(() => {}),
      ])
      const msg = err instanceof Error ? err.message : String(err)
      return NextResponse.json({ error: `Transcode failed: ${msg}` }, { status: 500 })
    }

    await fs.unlink(tempInputPath).catch(() => {})

    // Manifest stores the WebM URL; the public site derives MP4 + JPG
    // siblings by extension swap (LazyVideo handles this).
    publicUrl = `${saved.publicDir}/${saved.basename}.webm`
    transcoded = {
      webm: `${saved.publicDir}/${saved.basename}.webm`,
      mp4: `${saved.publicDir}/${saved.basename}.mp4`,
      poster: `${saved.publicDir}/${saved.basename}.jpg`,
    }
  }

  const manifest = await setEntry(slotId, publicUrl)
  return NextResponse.json({ slotId, url: publicUrl, manifest, transcoded })
}

export async function DELETE(req: Request): Promise<Response> {
  if (await isLocked()) {
    return NextResponse.json({ error: LOCKED_MSG }, { status: 423 })
  }
  const url = new URL(req.url)
  const slotId = url.searchParams.get('slotId') ?? ''
  if (!slotId || !isValidSlotId(slotId)) {
    return NextResponse.json({ error: `Unknown slotId: ${slotId}` }, { status: 400 })
  }
  const manifest = await removeEntry(slotId)
  return NextResponse.json({ slotId, manifest })
}

export async function GET(): Promise<Response> {
  const manifest = await readManifest()
  return NextResponse.json({ manifest })
}
