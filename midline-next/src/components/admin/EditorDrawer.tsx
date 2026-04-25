'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X, Search, Building2 } from 'lucide-react'
import type { CompanyAdminEntry } from '@/lib/mediaSlots'

interface SectorRef {
  slug: string
  title: string
}

interface Props {
  open: boolean
  onClose: () => void
  sectors: SectorRef[]
  companies: CompanyAdminEntry[]
  manifest: Record<string, string>
  activeSlug?: string
  query: string
  onQueryChange: (q: string) => void
}

export default function EditorDrawer({ open, onClose, sectors, companies, manifest, activeSlug, query, onQueryChange }: Props) {
  // ESC to close
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const q = query.trim().toLowerCase()
  const matches = (text: string) => !q || text.toLowerCase().includes(q)

  const companiesBySector: Record<string, CompanyAdminEntry[]> = {}
  for (const c of companies) {
    if (!matches(c.name) && !matches(c.slug) && !matches(c.sectorTitle)) continue
    ;(companiesBySector[c.sectorSlug] ??= []).push(c)
  }

  const overrideCountFor = (c: CompanyAdminEntry) => c.slots.filter((s) => manifest[s.id]).length

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-[#053F6E]/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Companies"
        aria-modal="true"
        className={`fixed top-0 left-0 h-full w-[min(360px,90vw)] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <header className="flex-shrink-0 px-5 py-4 border-b border-[#053F6E]/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#053F6E]/55" style={{ fontFamily: 'var(--font-mono)' }}>
              Switch
            </p>
            <h2 className="text-lg font-light text-[#053F6E]" style={{ fontFamily: 'var(--font-display)' }}>
              All companies
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#053F6E]/65 hover:text-[#053F6E] hover:bg-[#053F6E]/5 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#053F6E]"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </header>

        <div className="flex-shrink-0 px-5 py-3 border-b border-[#053F6E]/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#053F6E]/45" strokeWidth={2} />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search companies…"
              className="w-full rounded-lg border border-[#053F6E]/15 bg-white pl-9 pr-3 py-2 text-sm text-[#053F6E] placeholder:text-[#053F6E]/40 focus:outline-none focus:border-[#053F6E]/40 focus:ring-2 focus:ring-[#053F6E]/15 transition-colors duration-150"
              aria-label="Search companies"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          {sectors.map((sector) => {
            const list = companiesBySector[sector.slug] ?? []
            if (!list.length) return null
            return (
              <div key={sector.slug} className="mb-3">
                <p
                  className="px-2 mb-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#053F6E]/55"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {sector.title}
                </p>
                <ul className="space-y-0.5">
                  {list.map((company) => {
                    const active = activeSlug === company.slug
                    const count = overrideCountFor(company)
                    return (
                      <li key={company.slug}>
                        <Link
                          href={`/admin/edit/${company.slug}`}
                          onClick={onClose}
                          className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors duration-150 cursor-pointer ${
                            active
                              ? 'bg-[#053F6E] text-white'
                              : 'text-[#053F6E] hover:bg-[#053F6E]/5'
                          }`}
                        >
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${active ? 'bg-white/15' : 'bg-[#053F6E]/5'}`}>
                            <Building2 className={`w-3 h-3 ${active ? 'text-white' : 'text-[#053F6E]/65'}`} strokeWidth={1.75} />
                          </span>
                          <span className="flex-1 min-w-0 truncate text-[13px]">{company.name}</span>
                          {count > 0 && (
                            <span className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded-full ${
                              active ? 'bg-white/15 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}>
                              {count}
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}

          {Object.keys(companiesBySector).length === 0 && (
            <div className="px-3 py-10 text-center">
              <p className="text-sm text-[#053F6E]/55">No companies match &ldquo;{query}&rdquo;.</p>
            </div>
          )}
        </nav>

        <footer className="flex-shrink-0 px-5 py-3 border-t border-[#053F6E]/10 bg-[#F0FAFF]/40">
          <Link
            href="/admin"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-wider text-[#053F6E]/75 hover:text-[#053F6E] transition-colors duration-150"
          >
            ← Back to admin home
          </Link>
        </footer>
      </aside>
    </>
  )
}
