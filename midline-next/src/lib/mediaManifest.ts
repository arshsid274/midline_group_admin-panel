import 'server-only'
import { promises as fs, createWriteStream } from 'node:fs'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { ReadableStream as NodeReadableStream } from 'node:stream/web'
import path from 'node:path'
import { getSlotStoragePath } from './mediaSlots'

const MANIFEST_PATH = path.join(process.cwd(), 'public', 'media-overrides.json')
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')

export type Manifest = Record<string, string>

export async function readManifest(): Promise<Manifest> {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Manifest
    }
    return {}
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return {}
    throw err
  }
}

async function writeManifestAtomic(m: Manifest): Promise<void> {
  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true })
  const tmp = MANIFEST_PATH + '.tmp-' + Date.now()
  await fs.writeFile(tmp, JSON.stringify(m, null, 2), 'utf8')
  await fs.rename(tmp, MANIFEST_PATH)
}

export async function setEntry(slotId: string, publicUrl: string): Promise<Manifest> {
  const m = await readManifest()
  const previous = m[slotId]
  m[slotId] = publicUrl
  await writeManifestAtomic(m)
  if (previous && previous !== publicUrl) await unlinkPublicFile(previous)
  return m
}

export async function removeEntry(slotId: string): Promise<Manifest> {
  const m = await readManifest()
  const previous = m[slotId]
  if (!(slotId in m)) return m
  delete m[slotId]
  await writeManifestAtomic(m)
  if (previous) await unlinkPublicFile(previous)
  return m
}

export async function clearAll(): Promise<Manifest> {
  const m = await readManifest()
  const urls = Object.values(m)
  await writeManifestAtomic({})
  await Promise.all(urls.map(unlinkPublicFile))
  return {}
}

async function unlinkPublicFile(publicUrl: string): Promise<void> {
  if (!publicUrl.startsWith('/uploads/')) return
  const abs = path.join(process.cwd(), 'public', publicUrl.replace(/^\//, ''))
  await unlinkOne(abs)

  // For transcoded videos the manifest stores the .webm and the .mp4 / .jpg
  // siblings live next to it under the same basename. Sweep them on delete.
  const m = abs.match(/^(.*)\.([^./]+)$/)
  if (m) {
    const [, base, ext] = m
    const e = ext.toLowerCase()
    const siblings: string[] = []
    if (e === 'webm') siblings.push(`${base}.mp4`, `${base}.jpg`)
    else if (e === 'mp4') siblings.push(`${base}.webm`, `${base}.jpg`)
    await Promise.all(siblings.map(unlinkOne))
  }
}

async function unlinkOne(abs: string): Promise<void> {
  try {
    await fs.unlink(abs)
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn('[mediaManifest] failed to unlink', abs, err)
    }
  }
}

export interface SavedUpload {
  /** Public URL of the saved file, e.g. /uploads/sector/foo/photo/foo-1-1234.png */
  url: string
  /** Absolute filesystem path to the saved file. */
  absPath: string
  /** Public folder URL prefix (no trailing slash), e.g. /uploads/sector/foo/photo */
  publicDir: string
  /** Absolute folder path containing the file. */
  absDir: string
  /** Filename without extension, e.g. "foo-1-1234". */
  basename: string
  /** Extension including the dot, e.g. ".png" / ".mov". */
  ext: string
}

export async function saveUpload(slotId: string, file: File): Promise<SavedUpload> {
  const { dir, filenameBase } = getSlotStoragePath(slotId)
  const absDir = dir ? path.join(UPLOADS_DIR, dir) : UPLOADS_DIR
  await fs.mkdir(absDir, { recursive: true })
  const ext = inferExt(file)
  const basename = `${filenameBase}-${Date.now()}`
  const filename = `${basename}${ext}`
  const absPath = path.join(absDir, filename)

  // Stream the upload directly to disk instead of buffering it in memory.
  // Lets the admin accept arbitrarily large videos without OOM-ing the
  // dev server.
  const webStream = file.stream() as unknown as NodeReadableStream<Uint8Array>
  await pipeline(Readable.fromWeb(webStream), createWriteStream(absPath))

  const publicDir = dir ? `/uploads/${dir}` : '/uploads'
  return {
    url: `${publicDir}/${filename}`,
    absPath,
    publicDir,
    absDir,
    basename,
    ext,
  }
}

function inferExt(file: File): string {
  const fromName = path.extname(file.name)
  if (fromName) return fromName.toLowerCase()
  const t = file.type
  if (t === 'image/jpeg') return '.jpg'
  if (t === 'image/png') return '.png'
  if (t === 'image/webp') return '.webp'
  if (t === 'image/gif') return '.gif'
  if (t === 'image/avif') return '.avif'
  if (t === 'video/mp4') return '.mp4'
  if (t === 'video/quicktime') return '.mov'
  if (t === 'video/webm') return '.webm'
  return ''
}
