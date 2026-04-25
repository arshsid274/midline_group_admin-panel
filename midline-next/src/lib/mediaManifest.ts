import 'server-only'
import { promises as fs } from 'node:fs'
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
  try {
    await fs.unlink(abs)
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn('[mediaManifest] failed to unlink', abs, err)
    }
  }
}

export async function saveUpload(slotId: string, file: File): Promise<string> {
  const { dir, filenameBase } = getSlotStoragePath(slotId)
  const targetDir = dir ? path.join(UPLOADS_DIR, dir) : UPLOADS_DIR
  await fs.mkdir(targetDir, { recursive: true })
  const ext = inferExt(file)
  const filename = `${filenameBase}-${Date.now()}${ext}`
  const abs = path.join(targetDir, filename)
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(abs, buffer)
  const publicPath = dir ? `${dir}/${filename}` : filename
  return `/uploads/${publicPath}`
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
