import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import PreviewCard from '@/components/PreviewCard'
import HeroStats from '@/components/HeroStats'
import RevealOnScroll from '@/components/RevealOnScroll'
import OrbitalRing from '@/components/OrbitalRing'
import SectorCarousel from '@/components/SectorCarousel'

export const metadata: Metadata = {
  title: 'Midline Investment — Multi-Sector Holding Group, Dubai UAE',
  description:
    'From One Name, many successes are born. Midline Investment LLC is a Dubai-based multi-sector holding group operating 34 companies across 8 industries in 9 countries.',
}

export default function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-tag">Dubai · UAE · Global Investment Group</div>
        <h1>
          From One Name,<br />
          many <em>successes</em> are born.
        </h1>
        <p className="hero-sub">
          Midline Investment LLC is a multi-sector holding group headquartered in Business Bay, Dubai —
          operating 34 companies across aviation, energy, food, construction, and more.
        </p>
        <div className="hero-ctas">
          <Link href="/contact" className="btn-primary">Get A Quote</Link>
          <Link href="/companies" className="btn-ghost">Our Sectors →</Link>
        </div>

        <div className="hero-media">
          <div className="hero-media-frame">
            <Image
              src="/assets/burlington.jpeg"
              alt="Burlington Tower, Dubai — Midline Investment headquarters"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="hero-media-copy">
              <div className="hero-media-note">
                <span>Headquarters</span>
                <strong>Burlington Tower, Dubai</strong>
                <p>Business Bay · Office 410 · Marasi Drive, UAE</p>
              </div>
              <div className="hero-media-chip">Est. Dubai · UAE</div>
            </div>
          </div>
        </div>

        <HeroStats />
      </section>

      {/* ── ORBITAL RING ── */}
      <OrbitalRing />

      {/* ── SECTOR CAROUSEL ── */}
      <SectorCarousel />

      {/* ── WHY MIDLINE ── */}
      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">Why Midline</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Built for stewardship, <em>not short-term noise</em>
        </RevealOnScroll>
        <div className="preview-grid">
          <PreviewCard
            eyebrow="Diversification"
            title="Multi-sector resilience"
            body="From aviation to pharmaceuticals, Midline balances its portfolio across essential and high-growth sectors."
          />
          <PreviewCard
            eyebrow="Operations"
            title="Hands-on ownership"
            body="Capital is paired with operational oversight, market understanding, and execution discipline."
          />
          <PreviewCard
            eyebrow="Outlook"
            title="Long-term value creation"
            body="Midline focuses on sustainable growth, trusted partnerships, and durable business legacies."
          />
        </div>
      </section>
    </>
  )
}
