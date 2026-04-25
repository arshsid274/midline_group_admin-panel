import 'server-only'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const PRESERVATION_PATH = path.join(process.cwd(), 'public', 'media-preservation.json')

export interface PreservationState {
  preservedAt: string | null
}

export async function readPreservation(): Promise<PreservationState> {
  try {
    const raw = await fs.readFile(PRESERVATION_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      const v = (parsed as { preservedAt?: unknown }).preservedAt
      return { preservedAt: typeof v === 'string' && v.length > 0 ? v : null }
    }
    return { preservedAt: null }
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return { preservedAt: null }
    throw err
  }
}

async function writePreservationAtomic(state: PreservationState): Promise<void> {
  await fs.mkdir(path.dirname(PRESERVATION_PATH), { recursive: true })
  const tmp = PRESERVATION_PATH + '.tmp-' + Date.now()
  await fs.writeFile(tmp, JSON.stringify(state, null, 2), 'utf8')
  await fs.rename(tmp, PRESERVATION_PATH)
}

export async function preserveNow(): Promise<PreservationState> {
  const state = { preservedAt: new Date().toISOString() }
  await writePreservationAtomic(state)
  return state
}

export async function unlockEditing(): Promise<PreservationState> {
  const state = { preservedAt: null }
  await writePreservationAtomic(state)
  return state
}

export async function isLocked(): Promise<boolean> {
  return !!(await readPreservation()).preservedAt
}
