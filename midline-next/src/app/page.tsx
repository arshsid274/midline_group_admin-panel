import type { Metadata } from 'next'
import PreviewCard from '@/components/PreviewCard'
import PresenceCard from '@/components/PresenceCard'
import RevealOnScroll from '@/components/RevealOnScroll'
import OrbitalRing from '@/components/OrbitalRing'
import ScrollAssembleHero from '@/components/ScrollAssembleHero'
import OrbitalCarousel from '@/components/OrbitalCarousel'
import { GLOBAL_PRESENCE } from '@/lib/data'

// Same eight sectors the orbital ring uses — image, label and carousel route.
const SECTOR_ITEMS = [
  { title: 'Aviation',     background: 'url(/assets/sectors/aviation.png)',     href: '/carousel/aviation' },
  { title: 'Construction', background: 'url(/assets/sectors/construction.png)', href: '/carousel/construction' },
  { title: 'Food Industry',background: 'url(/assets/sectors/food.png)',         href: '/carousel/food' },
  { title: 'Oil & Gas',    background: 'url(/assets/sectors/oilgas.png)',       href: '/carousel/oilgas' },
  { title: 'Perfumes',     background: 'url(/assets/sectors/perfumes.png)',     href: '/carousel/perfumes' },
  { title: 'Furniture',    background: 'url(/assets/sectors/furniture.png)',    href: '/carousel/furniture' },
  { title: 'Auto Parts',   background: 'url(/assets/sectors/spareparts.png)',   href: '/carousel/spareparts' },
  { title: 'Pharma',       background: 'url(/assets/sectors/pharma.png)',       href: '/carousel/pharma' },
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

      {/* ── SECTOR CAROUSEL ── (component kept; intentionally not rendered here) */}
      {/* <SectorCarousel /> */}

      {/* ── OUR SECTORS (narrative) ── */}
      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">Our Sectors</RevealOnScroll>
        <RevealOnScroll className="section-title">
          We don&apos;t just follow industries — <em>we partner with them</em>
        </RevealOnScroll>
        <RevealOnScroll className="section-body">
          We invest where real economic life happens: where people build, move, trade, and create.
          To us, a sector isn&apos;t an abstract market on a chart — it&apos;s a living ecosystem of
          suppliers, operators, customers, and communities. We treat each one with the depth of
          understanding and long-term commitment it deserves.
        </RevealOnScroll>
      </section>

      {/* ── WHY MIDLINE ── */}
      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">Why Midline</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Built for stewardship, <em>not short-term noise</em>
        </RevealOnScroll>
        <RevealOnScroll className="section-body">
          We envision a world where investment is not only profitable, but profoundly responsible.
          Our purpose goes beyond financial return — we drive the future of global investment through
          bold, well-governed initiatives that embrace sustainability, innovation, and operational
          excellence. We don&apos;t just build companies. We build futures.
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

      {/* ── OUR APPROACH ── */}
      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">Our Approach</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Active owners, <em>not passive capital</em>
        </RevealOnScroll>
        <RevealOnScroll className="section-body">
          When we invest in or build a company, we bring three things: the capital to grow, modernize,
          and seize opportunity; hands-on operational guidance through proven management discipline and
          modern systems; and the strength of the group — shared services, cross-company opportunities,
          and a network that opens doors a standalone business couldn&apos;t reach.
        </RevealOnScroll>
        <div className="preview-grid">
          <PreviewCard
            eyebrow="01 — Select"
            title="Conviction over hype"
            body="We invest where we have genuine sector understanding — not where the noise is loudest."
          />
          <PreviewCard
            eyebrow="02 — Strengthen"
            title="Foundations first"
            body="Governance, systems, talent, and quality standards come before chasing scale."
          />
          <PreviewCard
            eyebrow="03 — Compound"
            title="Built for the long term"
            body="We reinvest, refine, and let well-run businesses lead their markets over years, not quarters."
          />
        </div>
      </section>

      {/* ── GLOBAL PRESENCE ── */}
      <section className="presence-section page-block">
        <RevealOnScroll className="section-label">Global Presence</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Operating across <em>nine strategic locations</em>
        </RevealOnScroll>
        <RevealOnScroll className="section-body">
          From established capitals to fast-rising markets, our operations and network span nine
          strategic locations — each a hub for opportunity, sourcing, and expansion.
        </RevealOnScroll>
        <div className="presence-grid">
          {GLOBAL_PRESENCE.map((location) => (
            <PresenceCard
              key={location.country}
              flag={location.flag}
              country={location.country}
              role={location.role}
              isHQ={location.isHQ}
            />
          ))}
        </div>
      </section>
    </>
  )
}
