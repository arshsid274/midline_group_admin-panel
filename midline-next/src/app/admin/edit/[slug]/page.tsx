import { notFound } from 'next/navigation'
import { MIDLINE_SECTORS, companySlug, getCompanyBySlug } from '@/lib/data'
import { readManifest } from '@/lib/mediaManifest'
import { readPreservation } from '@/lib/mediaPreservation'
import { getAllCompaniesForAdmin } from '@/lib/mediaSlots'
import EditorClient from './EditorClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function VisualEditorPage({ params }: Props) {
  const { slug } = await params
  const found = getCompanyBySlug(slug)
  if (!found) notFound()

  const [manifest, preservation] = await Promise.all([readManifest(), readPreservation()])
  const companies = getAllCompaniesForAdmin()

  // Per-slot fallbacks (for empty previews) — same shape as the main admin page.
  const fallbacks: Record<string, string> = {}
  for (const [, sector] of Object.entries(MIDLINE_SECTORS)) {
    for (const c of sector.companies) {
      const s = companySlug(c.name)
      if (c.logo) fallbacks[`company:${s}:logo`] = c.logo
      if (c.photo) fallbacks[`company:${s}:hero-bg`] = c.photo
      if (c.photos?.[0]) fallbacks[`company:${s}:card-photo-1`] = c.photos[0]
      else if (c.photo) fallbacks[`company:${s}:card-photo-1`] = c.photo
      if (c.photos?.[1]) fallbacks[`company:${s}:card-photo-2`] = c.photos[1]
      if (c.photos?.[2]) fallbacks[`company:${s}:card-photo-3`] = c.photos[2]
      if (c.video) fallbacks[`company:${s}:quality-video`] = c.video
      if (c.photo) fallbacks[`company:${s}:quality-poster`] = c.photo
    }
  }

  const sectors = Object.entries(MIDLINE_SECTORS).map(([s, sec]) => ({
    slug: s,
    title: sec.title.replace(/<[^>]*>/g, ''),
  }))

  return (
    <EditorClient
      slug={slug}
      company={found.company}
      sectorSlug={found.sectorSlug}
      sectorTitle={found.sectorTitle}
      initialManifest={manifest}
      initialPreservedAt={preservation.preservedAt}
      sectors={sectors}
      companies={companies}
      fallbacks={fallbacks}
    />
  )
}
