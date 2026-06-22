import type { Metadata } from 'next'
import PreviewCard from '@/components/PreviewCard'
import RevealOnScroll from '@/components/RevealOnScroll'
import OrbitalRing from '@/components/OrbitalRing'
import SectorCarousel from '@/components/SectorCarousel'
import ScrollAssembleHero from '@/components/ScrollAssembleHero'
import OrbitalCarousel from '@/components/OrbitalCarousel'

// Same eight sectors the orbital ring uses — image, label and sector route.
const SECTOR_ITEMS = [
  { title: 'Aviation',     background: 'url(/assets/sectors/aviation.png)',     href: '/sectors/aviation' },
  { title: 'Construction', background: 'url(/assets/sectors/construction.png)', href: '/sectors/construction' },
  { title: 'Food Industry',background: 'url(/assets/sectors/food.png)',         href: '/sectors/food' },
  { title: 'Oil & Gas',    background: 'url(/assets/sectors/oilgas.png)',       href: '/sectors/oilgas' },
  { title: 'Perfumes',     background: 'url(/assets/sectors/perfumes.png)',     href: '/sectors/perfumes' },
  { title: 'Furniture',    background: 'url(/assets/sectors/furniture.png)',    href: '/sectors/furniture' },
  { title: 'Auto Parts',   background: 'url(/assets/sectors/spareparts.png)',   href: '/sectors/spareparts' },
  { title: 'Pharma',       background: 'url(/assets/sectors/pharma.png)',       href: '/sectors/pharma' },
]

export const metadata: Metadata = {
  title: 'Midline Investment — Multi-Sector Holding Group, Dubai UAE',
  description:
    'From One Name, many successes are born. Midline Investment LLC is a Dubai-based multi-sector holding group operating 34 companies across 8 industries in 9 countries.',
}

export default function HomePage() {
  return (
    <>
      {/* ── SCROLL-ASSEMBLE OPENER (now also grows the Burlington image to fullscreen) ── */}
      <ScrollAssembleHero />

      {/* ── ORBITAL CAROUSEL (sector ring) ── */}
      <OrbitalCarousel
        intro="Eight sectors. One disciplined investment group."
        items={SECTOR_ITEMS}
      />

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
