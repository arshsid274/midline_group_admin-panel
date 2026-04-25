import { NextResponse } from 'next/server'
import { preserveNow, readPreservation, unlockEditing } from '@/lib/mediaPreservation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  const state = await readPreservation()
  return NextResponse.json(state)
}

export async function POST(): Promise<Response> {
  const state = await preserveNow()
  return NextResponse.json(state)
}

export async function DELETE(): Promise<Response> {
  const state = await unlockEditing()
  return NextResponse.json(state)
}
