'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  X,
  Trash2,
  ExternalLink,
  ChevronDown,
  Layers,
  Building2,
  ImageIcon,
  Filter,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
  MousePointerClick,
  UploadCloud,
  Eye,
  LayoutPanelTop,
  Lock,
  Unlock,
  ShieldCheck,
} from 'lucide-react'
import type { CompanyAdminEntry, SlotDef } from '@/lib/mediaSlots'
import UploadSlot from '@/components/admin/UploadSlot'

type Manifest = Record<string, string>

interface SectorRef {
  slug: string
  title: string
}

interface Props {
  initialManifest: Manifest
  initialPreservedAt: string | null
  sectorSlots: SlotDef[]
  sectors: SectorRef[]
  companies: CompanyAdminEntry[]
  fallbacks: Record<string, string>
}

interface GroupMeta {
  label: string
  description: string
  where: string
}

const COMPANY_GROUP_META: Record<string, GroupMeta> = {
  'card-stack': {
    label: 'Sector page card',
    description: 'The 3 media tiles shown on the sector listing page when this company appears in the stack.',
    where: 'Visible on /sectors/<sector-name>',
  },
  'hero-logo': {
    label: 'Top of the company page',
    description: 'Banner photo, company logo, and the looping video inside the round logo badge at the top of the page.',
    where: 'Top of /companies/<company-name>',
  },
  'quality': {
    label: 'Showcase section',
    description: 'The big featured video, its thumbnail, and the 8 smaller side photos (4 left + 4 right) that surround it.',
    where: '"For The Best Quality" section',
  },
  'rolling': {
    label: 'Rotating title images',
    description: 'The 3 images that auto-rotate inside the heading "Do You Know That?" further down the page.',
    where: '"Do You Know That?" section',
  },
  'portfolio': {
    label: 'Highlight cards',
    description: 'The 5 stacked cards that scroll past beneath the rotating title.',
    where: 'Highlight cards beneath "Do You Know That?"',
  },
}

const COMPANY_GROUP_ORDER = ['card-stack', 'hero-logo', 'quality', 'rolling', 'portfolio']

type FilterMode = 'all' | 'overridden'
type Toast = { id: number; kind: 'success' | 'error'; message: string }

export default function AdminClient({
  initialManifest,
  initialPreservedAt,
  sectorSlots,
  sectors,
  companies,
  fallbacks,
}: Props) {
  const [manifest, setManifest] = useState<Manifest>(initialManifest)
  const [preservedAt, setPreservedAt] = useState<string | null>(initialPreservedAt)
  const [openSector, setOpenSector] = useState<string | null>(null)
  const [openCompany, setOpenCompany] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [toasts, setToasts] = useState<Toast[]>([])
  const locked = !!preservedAt

  const overrideCount = Object.keys(manifest).length
  const totalSlots = sectorSlots.length + companies.reduce((acc, c) => acc + c.slots.length, 0)

  const pushToast = useCallback((kind: 'success' | 'error', message: string) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, kind, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3600)
  }, [])

  const sectorSlotsBySlug = useMemo(() => {
    const map: Record<string, SlotDef[]> = {}
    for (const s of sectorSlots) {
      ;(map[s.group] ??= []).push(s)
    }
    return map
  }, [sectorSlots])

  const companiesBySector = useMemo(() => {
    const map: Record<string, CompanyAdminEntry[]> = {}
    for (const c of companies) {
      ;(map[c.sectorSlug] ??= []).push(c)
    }
    return map
  }, [companies])

  const q = query.trim().toLowerCase()
  const matchesQuery = useCallback(
    (text: string) => !q || text.toLowerCase().includes(q),
    [q],
  )

  const sectorMatches = useCallback(
    (sectorSlug: string, sectorTitle: string) => {
      if (!q && filterMode === 'all') return true
      const slots = sectorSlotsBySlug[sectorSlug] ?? []
      const haystack = [sectorTitle, sectorSlug, ...slots.map((s) => s.label), ...slots.map((s) => s.id)].join(' ')
      const queryHit = matchesQuery(haystack)
      if (filterMode === 'overridden') {
        return queryHit && slots.some((s) => manifest[s.id])
      }
      return queryHit
    },
    [filterMode, manifest, matchesQuery, q, sectorSlotsBySlug],
  )

  const companyMatches = useCallback(
    (company: CompanyAdminEntry) => {
      if (!q && filterMode === 'all') return true
      const haystack = [
        company.name,
        company.slug,
        company.sectorTitle,
        ...company.slots.map((s) => s.label),
        ...company.slots.map((s) => s.id),
      ].join(' ')
      const queryHit = matchesQuery(haystack)
      if (filterMode === 'overridden') {
        return queryHit && company.slots.some((s) => manifest[s.id])
      }
      return queryHit
    },
    [filterMode, manifest, matchesQuery, q],
  )

  const visibleSectors = sectors.filter((s) => sectorMatches(s.slug, s.title))
  const visibleCompanies = companies.filter(companyMatches)
  const isEmpty = visibleSectors.length === 0 && visibleCompanies.length === 0

  async function clearAll() {
    if (locked) {
      pushToast('error', 'Unlock to edit before clearing')
      return
    }
    if (!confirm('Clear ALL media overrides? Uploaded files will be deleted from disk. This cannot be undone.')) return
    try {
      const res = await fetch('/api/admin/manifest', { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setManifest(json.manifest)
      pushToast('success', 'All overrides cleared')
    } catch (e: unknown) {
      pushToast('error', e instanceof Error ? e.message : String(e))
    }
  }

  async function preserveChanges() {
    if (overrideCount === 0) {
      pushToast('error', 'Nothing to preserve yet — upload a file first')
      return
    }
    try {
      const res = await fetch('/api/admin/preserve', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setPreservedAt(json.preservedAt)
      pushToast('success', 'Changes preserved — slots are now locked')
    } catch (e: unknown) {
      pushToast('error', e instanceof Error ? e.message : String(e))
    }
  }

  async function unlockChanges() {
    if (!confirm('Unlock to edit? You will be able to upload, replace and delete files again.')) return
    try {
      const res = await fetch('/api/admin/preserve', { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setPreservedAt(json.preservedAt)
      pushToast('success', 'Editing unlocked')
    } catch (e: unknown) {
      pushToast('error', e instanceof Error ? e.message : String(e))
    }
  }

  function expandAll() {
    setOpenSector('__all__')
    setOpenCompany('__all__')
  }
  function collapseAll() {
    setOpenSector(null)
    setOpenCompany(null)
  }

  const isSectorOpen = (slug: string) => openSector === '__all__' || openSector === slug || (!!q && sectorMatches(slug, sectors.find((s) => s.slug === slug)?.title ?? ''))
  const isCompanyOpen = (slug: string) => openCompany === '__all__' || openCompany === slug || (!!q && !!companies.find((c) => c.slug === slug && companyMatches(c)))

  return (
    <div className="min-h-screen bg-[#F0FAFF] text-[#053F6E]" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Toast stack */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-2 rounded-lg border px-3.5 py-2.5 shadow-lg backdrop-blur-md animate-[slide-in_220ms_ease-out] ${
              t.kind === 'success'
                ? 'bg-white/95 border-emerald-200 text-emerald-900'
                : 'bg-white/95 border-rose-200 text-rose-900'
            }`}
          >
            {t.kind === 'success' ? (
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" strokeWidth={2} aria-hidden="true" />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600" strokeWidth={2} aria-hidden="true" />
            )}
            <span className="text-sm leading-snug">{t.message}</span>
          </div>
        ))}
      </div>

      {/* ── Sticky Toolbar ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/85 border-b border-[#053F6E]/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#053F6E] text-white">
                <Sparkles className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#053F6E]/55" style={{ fontFamily: 'var(--font-mono)' }}>
                  Midline Investment
                </p>
                <h1 className="text-[22px] font-light text-[#053F6E]" style={{ fontFamily: 'var(--font-display)' }}>
                  Media Admin
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#053F6E]/5 border border-[#053F6E]/10 px-3 py-1 text-xs text-[#053F6E]/80">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {overrideCount} / {totalSlots} overrides
              </span>

              {locked ? (
                <button
                  type="button"
                  onClick={unlockChanges}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-amber-800 hover:bg-amber-100 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                  title="Unlock to edit"
                >
                  <Unlock className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" /> Unlock to edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={preserveChanges}
                  disabled={overrideCount === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#053F6E] px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-[#0A63A8] transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E] focus-visible:ring-offset-2"
                  title={overrideCount === 0 ? 'Upload at least one file first' : 'Lock current uploads'}
                >
                  <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" /> Preserve changes
                </button>
              )}

              <button
                type="button"
                onClick={clearAll}
                disabled={overrideCount === 0 || locked}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#053F6E]/80 hover:text-rose-700 hover:bg-rose-50 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#053F6E]/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" /> Clear all
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#053F6E]/20 px-3 py-1.5 text-xs font-medium text-[#053F6E] hover:bg-white transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E] focus-visible:ring-offset-2"
              >
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" /> View site
              </a>
            </div>
          </div>

          {locked && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-700 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
              <p className="text-[12.5px] text-amber-900 leading-snug flex-1">
                <span className="font-medium">Changes preserved.</span> All slots are read-only — uploads, replacements, and deletes are disabled until you unlock.
              </p>
              <button
                type="button"
                onClick={unlockChanges}
                className="text-[11px] font-medium uppercase tracking-wider text-amber-800 hover:text-amber-900 underline underline-offset-2 cursor-pointer"
              >
                Unlock to edit
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#053F6E]/45" strokeWidth={2} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a sector, company, or slot description…"
                className="w-full rounded-xl border border-[#053F6E]/15 bg-white/80 pl-9 pr-9 py-2.5 text-sm text-[#053F6E] placeholder:text-[#053F6E]/40 focus:outline-none focus:bg-white focus:border-[#053F6E]/40 focus:ring-2 focus:ring-[#053F6E]/15 transition-colors duration-150"
                aria-label="Search slots"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-7 h-7 rounded-md text-[#053F6E]/55 hover:text-[#053F6E] hover:bg-[#053F6E]/5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E]"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex rounded-xl bg-[#053F6E]/5 p-1 border border-[#053F6E]/10">
                <FilterPill active={filterMode === 'all'} onClick={() => setFilterMode('all')}>
                  <Filter className="w-3 h-3" strokeWidth={2.25} aria-hidden="true" /> All
                </FilterPill>
                <FilterPill active={filterMode === 'overridden'} onClick={() => setFilterMode('overridden')}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" /> With overrides
                </FilterPill>
              </div>
              <div className="inline-flex rounded-xl bg-[#053F6E]/5 p-1 border border-[#053F6E]/10">
                <button
                  type="button"
                  onClick={expandAll}
                  className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[#053F6E]/75 hover:text-[#053F6E] cursor-pointer rounded-lg transition-colors"
                >
                  Expand
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[#053F6E]/75 hover:text-[#053F6E] cursor-pointer rounded-lg transition-colors"
                >
                  Collapse
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10 space-y-12">
        {/* How it works */}
        <section className="rounded-2xl bg-white border border-[#053F6E]/10 p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#053F6E]/5 text-[#053F6E] flex-shrink-0">
              <HelpCircle className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-light text-[#053F6E]" style={{ fontFamily: 'var(--font-display)' }}>
                How this works
              </h2>
              <p className="text-sm text-[#053F6E]/70 mt-0.5">
                Replace any photo or video on the live website. Your uploads stay on this server and are visible to visitors right away.
              </p>
            </div>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <HowStep
              step="1"
              icon={<MousePointerClick className="w-4 h-4" strokeWidth={2} aria-hidden="true" />}
              title="Pick a section"
              body="Open a sector or company below to reveal the photos and videos used on that page."
            />
            <HowStep
              step="2"
              icon={<UploadCloud className="w-4 h-4" strokeWidth={2} aria-hidden="true" />}
              title="Drop or click a slot"
              body="Each slot accepts one file — drag from your computer or click the thumbnail to choose."
            />
            <HowStep
              step="3"
              icon={<Eye className="w-4 h-4" strokeWidth={2} aria-hidden="true" />}
              title="Visit the page"
              body="Click 'View site' (top right) — your replacement appears immediately. Use 'Reset' on a slot to restore the original."
            />
          </ol>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Sectors" value={sectors.length} icon={<Layers className="w-3.5 h-3.5" strokeWidth={2} />} />
          <StatCard label="Companies" value={companies.length} icon={<Building2 className="w-3.5 h-3.5" strokeWidth={2} />} />
          <StatCard label="Total slots" value={totalSlots} icon={<ImageIcon className="w-3.5 h-3.5" strokeWidth={2} />} />
          <StatCard label="Active overrides" value={overrideCount} accent icon={<Sparkles className="w-3.5 h-3.5" strokeWidth={2} />} />
        </section>

        {isEmpty ? (
          <EmptyState query={query} onClear={() => { setQuery(''); setFilterMode('all') }} />
        ) : (
          <>
            {/* ── Sectors ─────────────────────────────────────────── */}
            {visibleSectors.length > 0 && (
              <section>
                <SectionHeader
                  eyebrow="01"
                  title="Sectors"
                  count={visibleSectors.length}
                  total={sectors.length}
                  description="Hero photo and video shown on each /sectors/[slug] page."
                />
                <div className="space-y-3">
                  {visibleSectors.map((sector) => {
                    const slots = sectorSlotsBySlug[sector.slug] ?? []
                    const open = isSectorOpen(sector.slug)
                    const count = slots.filter((s) => manifest[s.id]).length
                    const heroPreview = manifest[`sector:${sector.slug}:photo`] ?? fallbacks[`sector:${sector.slug}:photo`]
                    return (
                      <article key={sector.slug} className="rounded-2xl border border-[#053F6E]/10 bg-white shadow-[0_1px_2px_rgba(5,63,110,0.04)] overflow-hidden transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(5,63,110,0.06)]">
                        <button
                          type="button"
                          onClick={() => setOpenSector(open && openSector !== '__all__' ? null : sector.slug)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E] focus-visible:ring-inset"
                          aria-expanded={open}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#F0FAFF] to-[#E1F1FB] border border-[#053F6E]/10">
                              {heroPreview ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={heroPreview} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Layers className="absolute inset-0 m-auto w-5 h-5 text-[#053F6E]/40" strokeWidth={1.5} aria-hidden="true" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-lg font-light text-[#053F6E] truncate" style={{ fontFamily: 'var(--font-display)' }}>
                                {sector.title}
                              </h3>
                              <p className="text-[11px] text-[#053F6E]/55 truncate" style={{ fontFamily: 'var(--font-mono)' }}>
                                /sectors/{sector.slug}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {count > 0 && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-wider text-emerald-700">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {count}/{slots.length}
                              </span>
                            )}
                            <ChevronDown
                              className={`w-4 h-4 text-[#053F6E]/55 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </div>
                        </button>
                        {open && (
                          <div className="px-5 pb-5 pt-1 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-[#053F6E]/5">
                            {slots.map((slot) => (
                              <UploadSlot
                                key={slot.id}
                                slotId={slot.id}
                                label={slot.label}
                                kind={slot.kind}
                                currentUrl={manifest[slot.id]}
                                fallbackUrl={fallbacks[slot.id]}
                                onManifestChange={setManifest}
                                onToast={pushToast}
                                locked={locked}
                              />
                            ))}
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              </section>
            )}

            {/* ── Companies ───────────────────────────────────────── */}
            {visibleCompanies.length > 0 && (
              <section>
                <SectionHeader
                  eyebrow="02"
                  title="Companies"
                  count={visibleCompanies.length}
                  total={companies.length}
                  description="Every photo and video section on each /companies/[slug] page — grouped by area."
                />
                <div className="space-y-8">
                  {sectors.map((sector) => {
                    const list = (companiesBySector[sector.slug] ?? []).filter((c) => visibleCompanies.includes(c))
                    if (!list.length) return null
                    return (
                      <div key={sector.slug}>
                        <h3
                          className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-[#053F6E]/55"
                          style={{ fontFamily: 'var(--font-mono)' }}
                        >
                          {sector.title}
                        </h3>
                        <div className="space-y-3">
                          {list.map((company) => {
                            const open = isCompanyOpen(company.slug)
                            const count = company.slots.filter((s) => manifest[s.id]).length
                            const logo = manifest[`company:${company.slug}:logo`] ?? fallbacks[`company:${company.slug}:logo`]
                            return (
                              <article key={company.slug} className="rounded-2xl border border-[#053F6E]/10 bg-white shadow-[0_1px_2px_rgba(5,63,110,0.04)] overflow-hidden transition-shadow duration-200 hover:shadow-[0_4px_12px_rgba(5,63,110,0.06)]">
                                <button
                                  type="button"
                                  onClick={() => setOpenCompany(open && openCompany !== '__all__' ? null : company.slug)}
                                  className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E] focus-visible:ring-inset"
                                  aria-expanded={open}
                                >
                                  <div className="flex items-center gap-4 min-w-0">
                                    <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#F0FAFF] to-[#E1F1FB] border border-[#053F6E]/10 flex items-center justify-center">
                                      {logo ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={logo} alt="" className="w-full h-full object-contain p-1.5" />
                                      ) : (
                                        <Building2 className="w-4 h-4 text-[#053F6E]/40" strokeWidth={1.5} aria-hidden="true" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <h4 className="text-[15px] font-medium text-[#053F6E] truncate">{company.name}</h4>
                                      <p className="text-[11px] text-[#053F6E]/55 truncate" style={{ fontFamily: 'var(--font-mono)' }}>
                                        /companies/{company.slug}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    {count > 0 && (
                                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-wider text-emerald-700">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        {count}/{company.slots.length}
                                      </span>
                                    )}
                                    <ChevronDown
                                      className={`w-4 h-4 text-[#053F6E]/55 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                                      strokeWidth={2}
                                      aria-hidden="true"
                                    />
                                  </div>
                                </button>
                                {open && (
                                  <div className="px-5 pb-5 pt-1 space-y-7 border-t border-[#053F6E]/5">
                                    {/* Visual-editor CTA */}
                                    <Link
                                      href={`/admin/edit/${company.slug}`}
                                      className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#053F6E] text-white px-4 py-3 hover:bg-[#0A63A8] transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E] focus-visible:ring-offset-2"
                                    >
                                      <div className="flex items-center gap-3 min-w-0">
                                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 flex-shrink-0">
                                          <LayoutPanelTop className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0">
                                          <p className="text-[10px] uppercase tracking-[0.22em] text-white/70" style={{ fontFamily: 'var(--font-mono)' }}>
                                            Recommended
                                          </p>
                                          <p className="text-sm font-medium leading-tight">
                                            Open the visual editor for {company.name}
                                          </p>
                                          <p className="text-[11.5px] text-white/75 leading-snug mt-0.5">
                                            See exactly where each photo and video appears on the live page — drop files straight onto the layout.
                                          </p>
                                        </div>
                                      </div>
                                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-white/85">
                                        Open <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                                      </span>
                                    </Link>

                                    {COMPANY_GROUP_ORDER.map((group) => {
                                      const groupSlots = company.slots.filter((s) => s.group === group)
                                      if (!groupSlots.length) return null
                                      const groupOverrideCount = groupSlots.filter((s) => manifest[s.id]).length
                                      const meta = COMPANY_GROUP_META[group]
                                      return (
                                        <div key={group}>
                                          <div className="pt-4 mb-3">
                                            <div className="flex items-start justify-between gap-3">
                                              <div className="min-w-0">
                                                <h5 className="text-[15px] font-medium text-[#053F6E] leading-tight">
                                                  {meta?.label ?? group}
                                                </h5>
                                                {meta?.description && (
                                                  <p className="mt-1 text-[12.5px] text-[#053F6E]/65 leading-snug">
                                                    {meta.description}
                                                  </p>
                                                )}
                                                {meta?.where && (
                                                  <p className="mt-1 inline-flex items-center gap-1 text-[10.5px] uppercase tracking-[0.14em] text-[#053F6E]/50" style={{ fontFamily: 'var(--font-mono)' }}>
                                                    <Eye className="w-3 h-3" strokeWidth={2} aria-hidden="true" />
                                                    {meta.where}
                                                  </p>
                                                )}
                                              </div>
                                              <span className="flex-shrink-0 text-[11px] tabular-nums text-[#053F6E]/55" style={{ fontFamily: 'var(--font-mono)' }}>
                                                {groupOverrideCount > 0
                                                  ? `${groupOverrideCount}/${groupSlots.length} replaced`
                                                  : `${groupSlots.length} slot${groupSlots.length === 1 ? '' : 's'}`}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {groupSlots.map((slot) => (
                                              <UploadSlot
                                                key={slot.id}
                                                slotId={slot.id}
                                                label={slot.label}
                                                kind={slot.kind}
                                                currentUrl={manifest[slot.id]}
                                                fallbackUrl={fallbacks[slot.id]}
                                                onManifestChange={setManifest}
                                                onToast={pushToast}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </article>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </>
        )}

        <footer className="pt-8 pb-2 border-t border-[#053F6E]/5 text-center">
          <p className="text-[11px] text-[#053F6E]/55">
            Replacements stay until you press Reset (per slot) or Clear all (top right). Drag and drop is supported on every slot.
          </p>
        </footer>
      </main>

      {/* Local keyframes for toast slide-in (Tailwind v4 lets us keep this inline-safe) */}
      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateY(-8px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Small subcomponents ───────────────────────────────────────── */

function HowStep({
  step,
  icon,
  title,
  body,
}: {
  step: string
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <li className="rounded-xl bg-[#F0FAFF]/70 border border-[#053F6E]/10 px-4 py-3.5">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#053F6E] text-white text-[10px] font-medium tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>
          {step}
        </span>
        <span className="text-[#053F6E]/70">{icon}</span>
        <span className="text-[13px] font-medium text-[#053F6E]">{title}</span>
      </div>
      <p className="text-[12.5px] text-[#053F6E]/65 leading-snug">{body}</p>
    </li>
  )
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E] focus-visible:ring-offset-2 ${
        active
          ? 'bg-white text-[#053F6E] shadow-sm'
          : 'text-[#053F6E]/60 hover:text-[#053F6E]'
      }`}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string
  value: number
  icon: React.ReactNode
  accent?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3.5 transition-colors duration-200 ${
        accent
          ? 'bg-[#053F6E] border-[#053F6E] text-white'
          : 'bg-white border-[#053F6E]/10 text-[#053F6E] hover:border-[#053F6E]/25'
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className={accent ? 'text-white/70' : 'text-[#053F6E]/55'}>{icon}</span>
        <span
          className={`text-[10px] uppercase tracking-[0.18em] ${accent ? 'text-white/70' : 'text-[#053F6E]/55'}`}
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {label}
        </span>
      </div>
      <p
        className={`text-3xl font-light tabular-nums ${accent ? 'text-white' : 'text-[#053F6E]'}`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {value}
      </p>
    </div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  count,
  total,
  description,
}: {
  eyebrow: string
  title: string
  count: number
  total: number
  description: string
}) {
  return (
    <div className="mb-5 flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#053F6E]/55" style={{ fontFamily: 'var(--font-mono)' }}>
          {eyebrow}
        </span>
        <span className="h-px flex-1 bg-[#053F6E]/10" />
        <span className="text-[11px] text-[#053F6E]/55 tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>
          {count === total ? `${total}` : `${count} / ${total}`}
        </span>
      </div>
      <h2 className="text-[28px] sm:text-[32px] font-light text-[#053F6E] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h2>
      <p className="text-sm text-[#053F6E]/65 max-w-2xl">{description}</p>
    </div>
  )
}

function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#053F6E]/20 bg-white/40 px-6 py-16 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#053F6E]/5 mb-4">
        <Search className="w-5 h-5 text-[#053F6E]/55" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <h3 className="text-2xl font-light text-[#053F6E] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
        Nothing matches
      </h3>
      <p className="text-sm text-[#053F6E]/65 max-w-md mx-auto mb-5">
        {query ? (
          <>No sectors or companies found for <span className="font-medium text-[#053F6E]">&ldquo;{query}&rdquo;</span>. Try a different keyword or clear the filter.</>
        ) : (
          <>No slots match the current filter. Switch back to &ldquo;All&rdquo; to see everything.</>
        )}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#053F6E] px-4 py-2 text-xs font-medium uppercase tracking-wider text-white hover:bg-[#0A63A8] transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E] focus-visible:ring-offset-2"
      >
        <X className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" /> Clear filter
      </button>
    </div>
  )
}
