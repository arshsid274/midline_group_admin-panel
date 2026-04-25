import { readManifest } from '@/lib/mediaManifest'
import { readPreservation } from '@/lib/mediaPreservation'
import { SECTOR_SLOTS, getAllCompaniesForAdmin } from '@/lib/mediaSlots'
import { MIDLINE_SECTORS, companySlug } from '@/lib/data'
import { getSectorMedia } from '@/lib/companyContent'
import AdminClient from './AdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [manifest, preservation] = await Promise.all([readManifest(), readPreservation()])
  const companies = getAllCompaniesForAdmin()

  const sectorFallbacks: Record<string, string> = {}
  for (const slug of Object.keys(MIDLINE_SECTORS)) {
    const m = getSectorMedia(slug)
    sectorFallbacks[`sector:${slug}:photo`] = m.photo
    sectorFallbacks[`sector:${slug}:video`] = m.video
  }

  const companyFallbacks: Record<string, string> = {}
  for (const [sectorSlug, sector] of Object.entries(MIDLINE_SECTORS)) {
    void sectorSlug
    for (const company of sector.companies) {
      const slug = companySlug(company.name)
      if (company.logo) companyFallbacks[`company:${slug}:logo`] = company.logo
      if (company.photo) companyFallbacks[`company:${slug}:hero-bg`] = company.photo
      if (company.photos?.[0]) companyFallbacks[`company:${slug}:card-photo-1`] = company.photos[0]
      else if (company.photo) companyFallbacks[`company:${slug}:card-photo-1`] = company.photo
      if (company.photos?.[1]) companyFallbacks[`company:${slug}:card-photo-2`] = company.photos[1]
      if (company.photos?.[2]) companyFallbacks[`company:${slug}:card-photo-3`] = company.photos[2]
      if (company.video) companyFallbacks[`company:${slug}:quality-video`] = company.video
      if (company.photo) companyFallbacks[`company:${slug}:quality-poster`] = company.photo
    }
  }

  return (
    <AdminClient
      initialManifest={manifest}
      initialPreservedAt={preservation.preservedAt}
      sectorSlots={SECTOR_SLOTS}
      sectors={Object.entries(MIDLINE_SECTORS).map(([slug, s]) => ({
        slug,
        title: s.title.replace(/<[^>]*>/g, ''),
      }))}
      companies={companies}
      fallbacks={{ ...sectorFallbacks, ...companyFallbacks }}
    />
  )
}
