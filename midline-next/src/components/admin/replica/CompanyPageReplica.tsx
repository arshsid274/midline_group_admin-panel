'use client'

import { Building2 } from 'lucide-react'
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
 * Schematic miniature of the company detail page (/companies/[slug]) showing
 * every photo and video region in its real spatial position. Each region is
 * an interactive SlotOverlay — click or drop a file to replace it. The
 * production page (CompanyInfoPages.tsx) is NOT modified.
 */
export default function CompanyPageReplica({ slug, company, manifest, fallbacks, onManifestChange, onToast, locked }: Props) {
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
      <header className="px-5 py-4 border-b border-[#053F6E]/5 flex items-start gap-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#053F6E]/5 text-[#053F6E] flex-shrink-0">
          <Building2 className="w-4 h-4" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#053F6E]/55" style={{ fontFamily: 'var(--font-mono)' }}>
            Section 02 — Company page
          </p>
          <h2 className="text-xl font-light text-[#053F6E] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            How the company detail page is laid out
          </h2>
          <p className="mt-1 text-[12.5px] text-[#053F6E]/65 max-w-2xl">
            A miniature of the live page sections, top to bottom. Each tile here marks a real photo or video on /companies/{slug}. Click or drop a file on any tile.
          </p>
        </div>
      </header>

      <div className="p-5 sm:p-8 bg-gradient-to-br from-[#F0FAFF]/50 to-white space-y-6">
        {/* Mini browser frame */}
        <div className="mx-auto w-full max-w-[820px] rounded-2xl bg-white border border-[#053F6E]/10 shadow-[0_8px_24px_rgba(5,63,110,0.06)] overflow-hidden">
          {/* Faux browser chrome */}
          <div className="px-3 py-2 bg-[#F0FAFF]/70 border-b border-[#053F6E]/10 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-300/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300/70" />
            <span className="ml-3 text-[10.5px] text-[#053F6E]/55 truncate" style={{ fontFamily: 'var(--font-mono)' }}>
              /companies/{slug}
            </span>
          </div>

          <div className="p-4 sm:p-6 space-y-5">

            {/* ── Section: Hero banner ────────────────────────────── */}
            <SectionHeader number="1" title="Hero banner" subtitle="Top of the page — full-width photo behind the page title." />
            <SlotOverlay
              {...slotProps('hero-bg')}
              label="Hero banner — top background photo"
              kind="photo"
              className="block w-full aspect-[16/6]"
            />

            {/* ── Section: Logo + circle video ────────────────────── */}
            <SectionHeader number="2" title="Logo & circle video" subtitle="The round logo badge with a looping video behind it, plus the brand logo image." />
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-12 sm:col-span-5 flex items-center gap-3">
                <SlotOverlay
                  {...slotProps('logo')}
                  label="Company logo"
                  kind="photo"
                  className="w-20 h-20 flex-shrink-0 bg-white rounded-xl"
                  hideKindBadge
                >
                  {(manifest[p('logo')] ?? fallbacks[p('logo')] ?? company.logo) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={manifest[p('logo')] ?? fallbacks[p('logo')] ?? company.logo}
                      alt=""
                      className="w-full h-full object-contain p-2"
                    />
                  ) : null}
                </SlotOverlay>
                <div className="text-[12px] text-[#053F6E]/65 leading-snug">
                  Brand logo shown next to the company name on the page.
                </div>
              </div>
              <div className="col-span-12 sm:col-span-7 flex items-center gap-3">
                <SlotOverlay
                  {...slotProps('logo-circle-video')}
                  label="Logo circle — background video"
                  kind="video"
                  className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-full"
                />
                <div className="text-[12px] text-[#053F6E]/65 leading-snug">
                  The looping video clipped inside the round logo badge.
                </div>
              </div>
            </div>

            {/* ── Section: Quality showcase ───────────────────────── */}
            <SectionHeader number="3" title="Showcase section" subtitle="Big featured video with 4 small side photos to its left and 4 to its right." />
            <div className="grid grid-cols-12 gap-2">
              {/* Left column */}
              <div className="col-span-3 grid grid-rows-4 gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <SlotOverlay
                    key={`L${n}`}
                    {...slotProps(`quality-left-${n}`)}
                    label={`Side photo — left column #${n}`}
                    kind="photo"
                    pin={`L${n}`}
                    className="block w-full aspect-square"
                  />
                ))}
              </div>
              {/* Center video */}
              <div className="col-span-6 flex items-center">
                <SlotOverlay
                  {...slotProps('quality-video')}
                  label="Showcase main video"
                  kind="video"
                  pin="Main"
                  className="block w-full aspect-[4/5]"
                />
              </div>
              {/* Right column */}
              <div className="col-span-3 grid grid-rows-4 gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <SlotOverlay
                    key={`R${n}`}
                    {...slotProps(`quality-right-${n}`)}
                    label={`Side photo — right column #${n}`}
                    kind="photo"
                    pin={`R${n}`}
                    className="block w-full aspect-square"
                  />
                ))}
              </div>
            </div>
            <SlotOverlay
              {...slotProps('quality-poster')}
              label="Showcase video — thumbnail (poster)"
              kind="photo"
              className="block w-full max-w-[260px] aspect-[16/9] mx-auto"
            >
              <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-wider text-[#053F6E]/45" style={{ fontFamily: 'var(--font-mono)' }}>
                Video poster · 16:9
              </div>
            </SlotOverlay>

            {/* ── Section: Rotating title images ──────────────────── */}
            <SectionHeader number="4" title="Rotating title images" subtitle='3 images that auto-rotate inside the heading "Do You Know That?"' />
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <SlotOverlay
                  key={`Roll${n}`}
                  {...slotProps(`rolling-${n}`)}
                  label={`Rotating title image #${n}`}
                  kind="photo"
                  pin={`#${n}`}
                  className="block w-full aspect-[4/3]"
                />
              ))}
            </div>

            {/* ── Section: Highlight cards ────────────────────────── */}
            <SectionHeader number="5" title="Highlight cards" subtitle="The 5 stacked cards that scroll past beneath the rotating title." />
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <SlotOverlay
                  key={`Card${n}`}
                  {...slotProps(`portfolio-${n}`)}
                  label={`Highlight card #${n} — photo`}
                  kind="photo"
                  pin={`#${n}`}
                  className="block w-full aspect-[4/5]"
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-baseline gap-3 pt-2">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#053F6E] text-white text-[10px] font-medium tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>
        {number}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="text-[14px] font-medium text-[#053F6E] leading-tight">{title}</h3>
        <p className="text-[11.5px] text-[#053F6E]/60 leading-snug">{subtitle}</p>
      </div>
      <span className="hidden sm:block flex-1 h-px bg-[#053F6E]/10" />
    </div>
  )
}
