import { NextResponse } from 'next/server'
import { clearAll, readManifest } from '@/lib/mediaManifest'
import { isLocked } from '@/lib/mediaPreservation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const manifest = await readManifest()
  return NextResponse.json({ manifest })
}

export async function DELETE(): Promise<Response> {
  if (await isLocked()) {
    return NextResponse.json(
      { error: 'Changes are preserved — click "Unlock to edit" first.' },
      { status: 423 },
    )
  }
  const manifest = await clearAll()
  return NextResponse.json({ manifest })
}
