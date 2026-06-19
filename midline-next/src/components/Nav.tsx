'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const links = [
  { href: '/companies', label: 'Companies' },
  { href: '/about', label: 'About' },
  { href: '/global', label: 'Global' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  // Close the menu whenever the route changes.
  useEffect(() => { setOpen(false) }, [pathname])

  // Lock body scroll + allow Escape to close while the overlay is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      {/* ── Desktop floating pill (hidden ≤960px) ── */}
      <nav>
        <Link href="/" className="nav-brand">
          Midline <em>Investment</em>
        </Link>
        {links.map(({ href, label }) => (
          <Link key={href} href={href} className={isActive(href) ? 'active' : ''}>
            {label}
          </Link>
        ))}
        <Link href="/contact" className="btn-nav">
          Get A Quote
        </Link>
      </nav>

      {/* ── Mobile floating hamburger (shown ≤960px) ── */}
      <button
        className="nav-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="nav-mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav-toggle-box" aria-hidden="true">
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </span>
      </button>

      {/* ── Mobile full-screen menu overlay ── */}
      <div
        id="nav-mobile-menu"
        className={`nav-mobile-menu${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <Link href="/" className="nav-brand nav-mobile-brand" onClick={() => setOpen(false)}>
          Midline <em>Investment</em>
        </Link>
        <div className="nav-mobile-links">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={isActive(href) ? 'active' : ''}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link href="/contact" className="btn-nav nav-mobile-cta" onClick={() => setOpen(false)}>
            Get A Quote
          </Link>
        </div>
      </div>
    </>
  )
}
