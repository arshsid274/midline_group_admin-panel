import type { Metadata } from 'next'
import Link from 'next/link'
import PreviewCard from '@/components/PreviewCard'
import PresenceCard from '@/components/PresenceCard'
import RevealOnScroll from '@/components/RevealOnScroll'
import OrbitalRing from '@/components/OrbitalRing'
import ScrollAssembleHero from '@/components/ScrollAssembleHero'
import OrbitalCarousel from '@/components/OrbitalCarousel'
import HeroStats from '@/components/HeroStats'
import Marquee from '@/_harvested/Marquee/Marquee'
import Magnetic from '@/_harvested/Magnetic/Magnetic'
import StickyFeature from '@/_harvested/StickyFeature/StickyFeature'
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

// Flagship operating company per sector — the home "Our Companies" teaser strip.
const FLAGSHIP_COMPANIES = [
  { name: 'Midline Aviation',        sector: 'Aviation',      href: '/carousel/aviation' },
  { name: 'ARCO Oil & Gas',          sector: 'Oil & Gas',     href: '/carousel/oilgas' },
  { name: 'Ard Al Teeb',             sector: 'Perfumes',      href: '/carousel/perfumes' },
  { name: 'ARC Auto Spare Parts',    sector: 'Auto Parts',    href: '/carousel/spareparts' },
  { name: 'Midline Trend Building',  sector: 'Construction',  href: '/carousel/construction' },
  { name: 'Acacus Juice & Milk',     sector: 'Food Industry', href: '/carousel/food' },
  { name: 'Trivix Pharma',           sector: 'Pharma',        href: '/carousel/pharma' },
  { name: 'Al Sanidan Furniture',    sector: 'Furniture',     href: '/carousel/furniture' },
]

export const metadata: Metadata = {
  title: 'Midline Investment — Multi-Sector Holding Group, Dubai UAE',
  description:
    'From One Name, many successes are born. Midline Investment LLC is a Dubai-based multi-sector holding group operating 34 companies across 8 industries in 9 countries.',
}

export default function HomePage() {
  return (
    <>
      {/* ── §A SCROLL-ASSEMBLE OPENER ── */}
      <ScrollAssembleHero />

      {/* ── §B PURPOSE BAND ── */}
      <section className="home-band">
        <div className="home-band__inner">
          <span className="home-band__eyebrow">The Group</span>
          <h2 className="home-band__title">
            Disciplined capital. Operational depth. Long-term thinking.
          </h2>
          <p className="home-band__copy">
            Midline Investment is a multi-sector investment group built around a simple conviction:
            that disciplined capital, operational expertise, and long-term thinking can turn good
            businesses into category leaders. We own and grow companies across construction, energy,
            aviation, trading, perfumery, and petroleum services — backing each with the resources,
            governance, and patience it needs to compound value over time.
          </p>
        </div>
      </section>

      {/* ── §C AT A GLANCE (stats) ── */}
      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">At a Glance</RevealOnScroll>
        <RevealOnScroll className="section-title">
          A group built to <em>compound value</em>
        </RevealOnScroll>
        <HeroStats />
      </section>

      {/* ── §D ORBITAL CAROUSEL (sector ring) ── */}
      <OrbitalCarousel
        intro="Eight sectors. One disciplined investment group."
        items={SECTOR_ITEMS}
      />

      {/* ── §D ORBITAL RING ── */}
      <OrbitalRing />

      {/* ── §E OUR SECTORS (narrative) ── */}
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

      {/* ── §F OUR COMPANIES (teaser strip) ── */}
      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">Our Companies</RevealOnScroll>
        <RevealOnScroll className="section-title">
          A portfolio of <em>market leaders</em>
        </RevealOnScroll>
        <Marquee items={FLAGSHIP_COMPANIES.map((c) => c.name)} durationSec={48} />
        <div style={{ marginTop: 28 }}>
          <Magnetic>
            <Link href="/companies" className="btn-primary">
              View all companies →
            </Link>
          </Magnetic>
        </div>
      </section>

      {/* ── §G WHY MIDLINE ── */}
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

      {/* ── §H OUR APPROACH (harvested StickyFeature) ── */}
      <section className="page-section section-shell">
        <StickyFeature
          eyebrow="Our Approach"
          heading="Active owners, not passive capital"
          panels={[
            {
              step: '01',
              title: 'Select with conviction',
              body: 'We invest where we have genuine sector understanding — not where the noise is loudest.',
            },
            {
              step: '02',
              title: 'Strengthen the foundation',
              body: 'Governance, systems, talent, and quality standards come before chasing scale.',
            },
            {
              step: '03',
              title: 'Compound over time',
              body: 'We reinvest, refine, and let well-run businesses lead their markets over years, not quarters.',
            },
          ]}
        />
      </section>

      {/* ── §I SUSTAINABILITY (ESG) ── */}
      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">Sustainability</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Responsible <em>by design</em>
        </RevealOnScroll>
        <RevealOnScroll className="section-body">
          We believe investment should leave markets, communities, and the environment better than it
          found them. Sustainability isn&apos;t a separate initiative at Midline — it&apos;s part of how
          we evaluate, build, and operate every business.
        </RevealOnScroll>
        <div className="preview-grid">
          <PreviewCard
            eyebrow="Environmental"
            title="Cleaner, efficient operations"
            body="We support more efficient operations across our energy, industrial, and logistics businesses, and factor environmental impact into how we grow."
          />
          <PreviewCard
            eyebrow="Social"
            title="People and communities"
            body="We invest in our people, support the communities we operate in, and uphold safe, fair working conditions across the group."
          />
          <PreviewCard
            eyebrow="Governance"
            title="Transparency and ethics"
            body="We hold ourselves to high standards of transparency, accountability, and ethics at every level of the group."
          />
        </div>
      </section>

      {/* ── §J GLOBAL PRESENCE ── */}
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

      {/* ── §K INSIGHTS ── */}
      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">Insights</RevealOnScroll>
        <RevealOnScroll className="section-title">
          News from <em>across the group</em>
        </RevealOnScroll>
        <div className="preview-grid">
          <PreviewCard
            eyebrow="Sector perspective"
            title="Why diversified ownership wins through cycles"
            body="How operating across essential and high-growth sectors builds resilience that single-market businesses can't match."
          />
          <PreviewCard
            eyebrow="Company news"
            title="Building capability across the portfolio"
            body="A look at how group-level governance and shared services help each Midline company perform at its best."
          />
          <PreviewCard
            eyebrow="Featured"
            title="From one name, many enterprises"
            body="The thinking behind Midline's long-term, active-ownership model — and where the group is heading next."
          />
        </div>
      </section>

      {/* ── §L CAREERS ── */}
      <section className="home-band home-band--careers">
        <div className="home-band__inner">
          <span className="home-band__eyebrow">Careers</span>
          <h2 className="home-band__title">Build your future with Midline</h2>
          <p className="home-band__copy">
            We grow by attracting people who take ownership, uphold standards, and think long-term —
            across aviation, energy, trade, construction, and perfumery. A career at Midline means
            working across industries with room to learn and advance.
          </p>
          <div className="home-band__actions">
            <Magnetic>
              <Link href="/careers" className="btn-primary">View careers</Link>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* ── §M CLOSING CTA ── */}
      <section className="home-band">
        <div className="home-band__inner">
          <h2 className="home-band__title">Let&apos;s build something lasting.</h2>
          <p className="home-band__copy">
            Whether you&apos;re a potential partner, client, supplier, or investor — reach out and our
            team will get back to you promptly.
          </p>
          <div className="home-band__actions">
            <Magnetic>
              <Link href="/contact" className="btn-primary">Get a quote</Link>
            </Magnetic>
            <Magnetic>
              <Link href="/companies" className="btn-ghost">Our companies →</Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </>
  )
}
