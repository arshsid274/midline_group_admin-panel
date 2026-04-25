import { MIDLINE_SECTORS, companySlug } from './data'

export type SlotKind = 'photo' | 'video' | 'image-or-video'

export interface SlotDef {
  id: string
  label: string
  kind: SlotKind
  group: string
}

export const SECTOR_SLUGS = Object.keys(MIDLINE_SECTORS)

export const SECTOR_SLOTS: SlotDef[] = SECTOR_SLUGS.flatMap((slug) => [
  { id: `sector:${slug}:photo`, label: 'Sector hero — main photo', kind: 'photo', group: slug },
  { id: `sector:${slug}:video`, label: 'Sector hero — main video', kind: 'video', group: slug },
])

export function getCompanySlots(slug: string): SlotDef[] {
  const p = (id: string) => `company:${slug}:${id}`
  const slots: SlotDef[] = [
    // Sector-page card stack — the 3 media tiles shown on the sector listing page.
    // Convention (matches data.ts entries): #1 large photo, #2 small photo, #3 short looping video.
    { id: p('card-photo-1'), label: 'Card image #1 (large background photo)', kind: 'photo', group: 'card-stack' },
    { id: p('card-photo-2'), label: 'Card image #2 (small overlay photo)', kind: 'photo', group: 'card-stack' },
    { id: p('card-photo-3'), label: 'Card video #3 (corner looping video)', kind: 'video', group: 'card-stack' },

    { id: p('hero-bg'), label: 'Page banner — top background photo', kind: 'photo', group: 'hero-logo' },
    { id: p('logo'), label: 'Company logo', kind: 'photo', group: 'hero-logo' },
    { id: p('logo-circle-video'), label: 'Logo circle — background video', kind: 'video', group: 'hero-logo' },

    { id: p('quality-video'), label: 'Showcase — main video', kind: 'video', group: 'quality' },
    { id: p('quality-poster'), label: 'Showcase — video thumbnail (poster)', kind: 'photo', group: 'quality' },
  ]

  for (let n = 1; n <= 4; n++) {
    slots.push({ id: p(`quality-left-${n}`), label: `Side photo — left column #${n}`, kind: 'photo', group: 'quality' })
  }
  for (let n = 1; n <= 4; n++) {
    slots.push({ id: p(`quality-right-${n}`), label: `Side photo — right column #${n}`, kind: 'photo', group: 'quality' })
  }

  for (let n = 1; n <= 3; n++) {
    slots.push({ id: p(`rolling-${n}`), label: `Rotating title image #${n}`, kind: 'photo', group: 'rolling' })
  }

  for (let n = 1; n <= 5; n++) {
    slots.push({ id: p(`portfolio-${n}`), label: `Highlight card #${n} — photo`, kind: 'photo', group: 'portfolio' })
  }

  return slots
}

export interface CompanyAdminEntry {
  slug: string
  name: string
  sectorSlug: string
  sectorTitle: string
  slots: SlotDef[]
}

export function getAllCompaniesForAdmin(): CompanyAdminEntry[] {
  const out: CompanyAdminEntry[] = []
  for (const [sectorSlug, sector] of Object.entries(MIDLINE_SECTORS)) {
    const sectorTitle = sector.title.replace(/<[^>]*>/g, '')
    for (const company of sector.companies) {
      const slug = companySlug(company.name)
      out.push({
        slug,
        name: company.name,
        sectorSlug,
        sectorTitle,
        slots: getCompanySlots(slug),
      })
    }
  }
  return out
}

const ALL_VALID_IDS = new Set<string>()
for (const s of SECTOR_SLOTS) ALL_VALID_IDS.add(s.id)
for (const c of getAllCompaniesForAdmin()) for (const s of c.slots) ALL_VALID_IDS.add(s.id)

export function isValidSlotId(id: string): boolean {
  return ALL_VALID_IDS.has(id)
}

export function sanitizeSlotIdForFilename(id: string): string {
  return id.replace(/[^a-z0-9._-]+/gi, '_')
}

/**
 * Where on disk this slot's uploaded file should live, relative to
 * /public/uploads, plus the human-friendly filename base.
 *
 * Layout (matches the admin's mental model — sector cards vs company info):
 *   sector-hero/<sector-slug>/photo|video/<sector-slug>-<kind>-<ts>.<ext>
 *   sector/<company-slug>/photo|video/<company-slug>-<n>-<ts>.<ext>
 *   company-info/<company-slug>/images|video/<company-slug>-<layout>-<ts>.<ext>
 */
export function getSlotStoragePath(slotId: string): { dir: string; filenameBase: string } {
  const safe = (s: string) => s.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
  const parts = slotId.split(':')

  if (parts.length === 3) {
    const [scope, slug, layoutName] = parts
    const safeSlug = safe(slug)
    const safeLayout = safe(layoutName)

    if (scope === 'sector') {
      const isVideo = layoutName === 'video'
      return {
        dir: `sector-hero/${safeSlug}/${isVideo ? 'video' : 'photo'}`,
        filenameBase: `${safeSlug}-${safeLayout}`,
      }
    }

    if (scope === 'company') {
      // Sector-card slots (rendered on the sector listing page).
      if (layoutName.startsWith('card-photo-')) {
        const n = layoutName.replace('card-photo-', '')
        const isVideo = layoutName === 'card-photo-3'
        return {
          dir: `sector/${safeSlug}/${isVideo ? 'video' : 'photo'}`,
          filenameBase: `${safeSlug}-${safe(n)}`,
        }
      }

      // Everything else lives on the company detail page.
      const isVideo = layoutName === 'logo-circle-video' || layoutName === 'quality-video'
      return {
        dir: `company-info/${safeSlug}/${isVideo ? 'video' : 'images'}`,
        filenameBase: `${safeSlug}-${safeLayout}`,
      }
    }
  }

  return { dir: '', filenameBase: sanitizeSlotIdForFilename(slotId) }
}
