import { NextResponse } from 'next/server'
import { isValidSlotId } from '@/lib/mediaSlots'
import { readManifest, removeEntry, saveUpload, setEntry } from '@/lib/mediaManifest'
import { isLocked } from '@/lib/mediaPreservation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

  const publicUrl = await saveUpload(slotId, file)
  const manifest = await setEntry(slotId, publicUrl)

  return NextResponse.json({ slotId, url: publicUrl, manifest })
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
