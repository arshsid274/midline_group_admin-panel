import type { Metadata } from 'next'
import { GLOBAL_PRESENCE } from '@/lib/data'
import PresenceCard from '@/components/PresenceCard'
import PreviewCard from '@/components/PreviewCard'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Global Presence',
  description:
    'Midline Investment operates across nine strategic locations — from headquarters in UAE to regional hubs, European offices, and market connections across Asia and North America.',
}

export default function GlobalPage() {
  return (
    <>
      <section className="subhero">
        <div className="section-label section-label-static">Global Presence</div>
        <h1 className="subhero-title">
          Operating across <em>nine strategic locations</em>
        </h1>
        <p className="subhero-copy">
          From core regional hubs to international market connections, Midline&apos;s footprint is designed
          to support trade, operations, partnerships, and expansion.
        </p>
      </section>

      <section className="presence-section page-block">
        <RevealOnScroll className="section-label">Markets</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Regional strength with <em>global reach</em>
        </RevealOnScroll>
        <RevealOnScroll className="section-body">
          Each location supports the group in a different way, whether as a headquarters, regional operating
          base, strategic supplier market, or customer-facing growth channel.
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

      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">Positioning</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Designed around <em>mobility, supply, and partnerships</em>
        </RevealOnScroll>
        <div className="preview-grid">
          <PreviewCard
            eyebrow="UAE"
            title="Strategic command center"
            body="Dubai serves as the group headquarters and a central point for investment, coordination, and regional access."
          />
          <PreviewCard
            eyebrow="Libya"
            title="Core operating market"
            body="Libya anchors several industrial, food, and pharmaceutical activities across the portfolio."
          />
          <PreviewCard
            eyebrow="Global"
            title="Trade and sourcing corridors"
            body="Europe, Asia, and North America support procurement, distribution, partnerships, and market access."
          />
        </div>
      </section>
    </>
  )
}
