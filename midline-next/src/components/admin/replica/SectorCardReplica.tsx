'use client'

import { Layers } from 'lucide-react'
import type { Company } from '@/lib/data'
import SlotOverlay from './SlotOverlay'

type Manifest = Record<string, string>

interface Props {
  slug: string
  company: Company
  manifest: Manifest
  fallbacks: Record<string, string>
  onManifestChange: (m: Manifest) => void
  onToast?: (kind: 'success' | 'error', message: string) => void
  locked?: boolean
}

/**
 * Schematic mini of how this company appears as a card on its sector page
 * (mirrors the 3-tile media stack rendered by CompanyElicaStack: large
 * background photo + small overlay photo + corner looping video).
 *
 * Layout intentionally NOT a pixel copy of the production card — it's a
 * legible miniature so a non-technical editor can see exactly which photo
 * lands where before uploading.
 */
export default function SectorCardReplica({ slug, company, manifest, fallbacks, onManifestChange, onToast, locked }: Props) {
  const p = (id: string) => `company:${slug}:${id}`

  const slotProps = (id: string) => ({
    slotId: p(id),
    currentUrl: manifest[p(id)],
    fallbackUrl: fallbacks[p(id)],
    onManifestChange,
    onToast,
    locked,
  })

  return (
    <div className="rounded-2xl bg-white border border-[#053F6E]/10 shadow-[0_1px_2px_rgba(5,63,110,0.04)] overflow-hidden">
      <header className="px-5 py-4 border-b border-[#053F6E]/5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#053F6E]/5 text-[#053F6E] flex-shrink-0">
            <Layers className="w-4 h-4" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#053F6E]/55" style={{ fontFamily: 'var(--font-mono)' }}>
              Section 01 — Sector page
            </p>
            <h2 className="text-xl font-light text-[#053F6E] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              How this company appears on the sector listing
            </h2>
            <p className="mt-1 text-[12.5px] text-[#053F6E]/65 max-w-xl">
              The card visitors see while scrolling /sectors/&lt;sector&gt;. Three media tiles + the company logo. Click or drop a file on any tile.
            </p>
          </div>
        </div>
      </header>

      <div className="px-5 py-6 sm:p-8 bg-gradient-to-br from-[#F0FAFF]/50 to-white">
        {/* The card miniature */}
        <div className="mx-auto w-full max-w-[640px]">
          <div className="relative rounded-3xl bg-white border border-[#053F6E]/10 shadow-[0_8px_24px_rgba(5,63,110,0.08)] overflow-hidden aspect-[5/4]">
            {/* Top: eyebrow + logo + name */}
            <div className="absolute top-0 left-0 right-0 z-20 px-5 sm:px-6 pt-5 sm:pt-6 flex items-start gap-3">
              <SlotOverlay
                {...slotProps('logo')}
                label="Company logo"
                kind="photo"
                pin="Logo"
                square
                hideKindBadge
                className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 bg-white"
              >
                {(manifest[p('logo')] ?? fallbacks[p('logo')] ?? company.logo) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={manifest[p('logo')] ?? fallbacks[p('logo')] ?? company.logo}
                    alt=""
                    className="w-full h-full object-contain p-1.5"
                  />
                ) : null}
              </SlotOverlay>
              <div className="min-w-0 mt-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#053F6E]/55" style={{ fontFamily: 'var(--font-mono)' }}>
                  {company.type}
                </p>
                <h3 className="text-lg sm:text-2xl font-light text-[#053F6E] leading-tight truncate" style={{ fontFamily: 'var(--font-display)' }}>
                  {company.name}
                </h3>
              </div>
            </div>

            {/* Bottom: 3-layer media stack */}
            <div className="absolute inset-x-0 bottom-0 h-[58%] sm:h-[55%]">
              {/* #1 — large background photo */}
              <SlotOverlay
                {...slotProps('card-photo-1')}
                label="Card image #1 — large background"
                kind="photo"
                pin="#1"
                className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-8 h-[88%]"
              />
              {/* #2 — small overlay photo top-right */}
              <SlotOverlay
                {...slotProps('card-photo-2')}
                label="Card image #2 — small overlay"
                kind="photo"
                pin="#2"
                className="absolute right-8 sm:right-12 top-2 sm:top-4 w-[32%] aspect-[4/3]"
              />
              {/* #3 — corner looping video */}
              <SlotOverlay
                {...slotProps('card-photo-3')}
                label="Card video #3 — corner clip"
                kind="video"
                pin="#3"
                className="absolute right-3 sm:right-5 bottom-2 sm:bottom-4 w-[34%] aspect-[4/3]"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[640px] mx-auto">
          <Legend pin="#1" label="Large background photo" tone="photo" />
          <Legend pin="#2" label="Small overlay photo" tone="photo" />
          <Legend pin="#3" label="Corner looping video" tone="video" />
        </div>
      </div>
    </div>
  )
}

function Legend({ pin, label, tone }: { pin: string; label: string; tone: 'photo' | 'video' }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-[#053F6E]/75 bg-white border border-[#053F6E]/10 rounded-lg px-2.5 py-2">
      <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#053F6E] text-white text-[10px] font-medium tabular-nums">
        {pin}
      </span>
      <span className="truncate">{label}</span>
      <span className={`ml-auto text-[9.5px] uppercase tracking-wider px-1.5 py-0.5 rounded ${tone === 'video' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-sky-50 text-sky-700 border border-sky-100'}`} style={{ fontFamily: 'var(--font-mono)' }}>
        {tone}
      </span>
    </div>
  )
}
