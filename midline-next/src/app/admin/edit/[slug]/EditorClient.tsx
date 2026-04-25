'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import {
  Menu,
  ChevronLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Unlock,
  ShieldCheck,
} from 'lucide-react'
import type { Company } from '@/lib/data'
import type { CompanyAdminEntry } from '@/lib/mediaSlots'
import EditorDrawer from '@/components/admin/EditorDrawer'
import SectorCardReplica from '@/components/admin/replica/SectorCardReplica'
import CompanyPageReplica from '@/components/admin/replica/CompanyPageReplica'

type Manifest = Record<string, string>
type Toast = { id: number; kind: 'success' | 'error'; message: string }

interface SectorRef {
  slug: string
  title: string
}

interface Props {
  slug: string
  company: Company
  sectorSlug: string
  sectorTitle: string
  initialManifest: Manifest
  initialPreservedAt: string | null
  sectors: SectorRef[]
  companies: CompanyAdminEntry[]
  fallbacks: Record<string, string>
}

export default function EditorClient({
  slug,
  company,
  sectorSlug,
  sectorTitle,
  initialManifest,
  initialPreservedAt,
  sectors,
  companies,
  fallbacks,
}: Props) {
  const [manifest, setManifest] = useState<Manifest>(initialManifest)
  const [preservedAt, setPreservedAt] = useState<string | null>(initialPreservedAt)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerQuery, setDrawerQuery] = useState('')
  const [toasts, setToasts] = useState<Toast[]>([])
  const locked = !!preservedAt

  const pushToast = useCallback((kind: 'success' | 'error', message: string) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, kind, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3600)
  }, [])

  const myEntry = companies.find((c) => c.slug === slug)
  const overrideCount = myEntry ? myEntry.slots.filter((s) => manifest[s.id]).length : 0
  const totalSlots = myEntry?.slots.length ?? 0
  const totalOverrideCount = Object.keys(manifest).length

  async function preserveChanges() {
    if (totalOverrideCount === 0) {
      pushToast('error', 'Upload at least one file first')
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
    if (!confirm('Unlock to edit? You will be able to upload, replace, and delete files again.')) return
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

  return (
    <div className="min-h-screen bg-[#F0FAFF] text-[#053F6E]" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Toast stack */}
      <div className="fixed top-5 right-5 z-[60] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-2 rounded-lg border px-3.5 py-2.5 shadow-lg backdrop-blur-md animate-[slide-in_220ms_ease-out] ${
              t.kind === 'success' ? 'bg-white/95 border-emerald-200 text-emerald-900' : 'bg-white/95 border-rose-200 text-rose-900'
            }`}
          >
            {t.kind === 'success' ? (
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" strokeWidth={2} />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600" strokeWidth={2} />
            )}
            <span className="text-sm leading-snug">{t.message}</span>
          </div>
        ))}
      </div>

      {/* ── Sticky top bar ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/85 border-b border-[#053F6E]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#053F6E] hover:bg-[#053F6E]/5 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E]"
            aria-label="Open companies menu"
          >
            <Menu className="w-5 h-5" strokeWidth={1.75} />
          </button>

          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium uppercase tracking-wider text-[#053F6E]/75 hover:text-[#053F6E] hover:bg-[#053F6E]/5 transition-colors duration-150"
          >
            <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} /> Admin home
          </Link>

          <div className="flex-1 min-w-0 px-2">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#053F6E]/55" style={{ fontFamily: 'var(--font-mono)' }}>
              Editing · {sectorTitle}
            </p>
            <h1 className="text-lg sm:text-xl font-light text-[#053F6E] leading-tight truncate" style={{ fontFamily: 'var(--font-display)' }}>
              {company.name}
            </h1>
          </div>

          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#053F6E]/5 border border-[#053F6E]/10 px-3 py-1 text-xs text-[#053F6E]/80">
            <Sparkles className="w-3 h-3 text-[#053F6E]/65" strokeWidth={2} />
            {overrideCount}/{totalSlots} replaced
          </span>

          {locked ? (
            <button
              type="button"
              onClick={unlockChanges}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium uppercase tracking-wider text-amber-800 hover:bg-amber-100 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              title="Unlock to edit"
            >
              <Unlock className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
              <span className="hidden sm:inline">Unlock to edit</span>
              <span className="sm:hidden">Unlock</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={preserveChanges}
              disabled={totalOverrideCount === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#053F6E]/20 bg-white px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#053F6E] hover:bg-[#F0FAFF] transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E] focus-visible:ring-offset-2"
              title={totalOverrideCount === 0 ? 'Upload at least one file first' : 'Lock current uploads'}
            >
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
              <span className="hidden sm:inline">Preserve changes</span>
              <span className="sm:hidden">Preserve</span>
            </button>
          )}

          <a
            href={`/companies/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#053F6E] px-3 py-2 text-xs font-medium uppercase tracking-wider text-white hover:bg-[#0A63A8] transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E] focus-visible:ring-offset-2"
          >
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="hidden sm:inline">Update on live site</span>
            <span className="sm:hidden">Live</span>
          </a>
        </div>

        {/* Quick sector link */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-3 flex flex-wrap items-center gap-2 text-[11.5px] text-[#053F6E]/65">
          <span style={{ fontFamily: 'var(--font-mono)' }} className="uppercase tracking-[0.18em] text-[10px] text-[#053F6E]/50">
            Also visible:
          </span>
          <a
            href={`/sectors/${sectorSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-[#053F6E]/15 bg-white/70 px-2 py-1 text-[#053F6E]/80 hover:text-[#053F6E] hover:border-[#053F6E]/35 transition-colors"
          >
            Sector page · /sectors/{sectorSlug} <ExternalLink className="w-3 h-3" strokeWidth={2} />
          </a>
          <a
            href={`/companies/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-[#053F6E]/15 bg-white/70 px-2 py-1 text-[#053F6E]/80 hover:text-[#053F6E] hover:border-[#053F6E]/35 transition-colors"
          >
            Company page · /companies/{slug} <ExternalLink className="w-3 h-3" strokeWidth={2} />
          </a>
        </div>

        {locked && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-3">
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
          </div>
        )}
      </header>

      <EditorDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sectors={sectors}
        companies={companies}
        manifest={manifest}
        activeSlug={slug}
        query={drawerQuery}
        onQueryChange={setDrawerQuery}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        <SectorCardReplica
          slug={slug}
          company={company}
          manifest={manifest}
          fallbacks={fallbacks}
          onManifestChange={setManifest}
          onToast={pushToast}
          locked={locked}
        />

        <CompanyPageReplica
          slug={slug}
          company={company}
          manifest={manifest}
          fallbacks={fallbacks}
          onManifestChange={setManifest}
          onToast={pushToast}
          locked={locked}
        />

        <div className="rounded-2xl bg-[#053F6E] text-white px-5 py-5 sm:px-6 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/65" style={{ fontFamily: 'var(--font-mono)' }}>
              Done editing?
            </p>
            <h2 className="text-xl sm:text-2xl font-light leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Open the live page to confirm your changes
            </h2>
            <p className="mt-1 text-[12.5px] text-white/75 max-w-xl">
              Each upload is already saved to the server — opening the live page just lets you verify the result. Changes appear instantly with no rebuild.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={`/sectors/${sectorSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-xs font-medium uppercase tracking-wider text-white hover:bg-white/15 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} /> Sector page
            </a>
            <a
              href={`/companies/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white text-[#053F6E] px-3.5 py-2 text-xs font-medium uppercase tracking-wider hover:bg-[#F0FAFF] transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} /> Company page
            </a>
          </div>
        </div>
      </main>

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
