import type { Metadata } from 'next'
import PreviewCard from '@/components/PreviewCard'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Our Approach',
  description:
    'A disciplined approach to growth — how Midline Investment selects, strengthens, and compounds value across every company in the group through capital, operational guidance, and group strength.',
}

export default function ApproachPage() {
  return (
    <>
      <section className="subhero">
        <div className="section-label section-label-static">Our Approach</div>
        <h1 className="subhero-title">
          A disciplined approach <em>to growth</em>
        </h1>
        <p className="subhero-copy">
          Capital is a commodity. What sets an investment group apart is judgment — knowing which sectors to
          back, which teams to trust, and how to help a business become more than it could be on its own. That
          judgment is what Midline Investment offers.
        </p>
      </section>

      <section className="about-section page-block">
        <div className="about-inner">
          <div className="about-grid">
            <div>
              <p className="about-tagline">
                We are an active owner, <em>not a passive one.</em>
              </p>
              <p className="about-body">
                We focus on sectors tied to real, enduring economic demand — building, energy, movement,
                trade, and craftsmanship. Within those sectors, we look for businesses with strong
                fundamentals, capable teams, and clear room to grow with the right support.
              </p>
              <p className="about-body">
                We invest for the long term. We are not looking for the quickest exit — we are looking to
                build companies that lead their markets for years, compounding value steadily and responsibly.
              </p>
            </div>
            <div className="mission-grid">
              <RevealOnScroll className="mission-item">
                <div className="mission-label">Capital</div>
                <h4>Resources to grow</h4>
                <p>The financial resources to grow, modernize, and seize opportunity when it appears.</p>
              </RevealOnScroll>
              <RevealOnScroll className="mission-item" delay={70}>
                <div className="mission-label">Operational Guidance</div>
                <h4>Proven discipline</h4>
                <p>Proven management discipline, modern systems, and deep sector expertise applied hands-on.</p>
              </RevealOnScroll>
              <RevealOnScroll className="mission-item" delay={140}>
                <div className="mission-label">Group Strength</div>
                <h4>Doors that open</h4>
                <p>Shared services, cross-company opportunities, and a network a standalone business could not reach.</p>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">Our Value-Creation Model</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Five principles, <em>every company</em>
        </RevealOnScroll>
        <div className="preview-grid">
          <PreviewCard
            eyebrow="01"
            title="Select with discipline"
            body="We invest where we have conviction and sector understanding — not where the hype is loudest."
          />
          <PreviewCard
            eyebrow="02"
            title="Strengthen the foundation"
            body="We invest in governance, systems, talent, and quality standards before chasing scale."
          />
          <PreviewCard
            eyebrow="03"
            title="Grow deliberately"
            body="We expand into new markets and products when the fundamentals are ready, not before."
          />
          <PreviewCard
            eyebrow="04"
            title="Operate responsibly"
            body="Sustainability, compliance, and ethical conduct are built into how each company runs."
          />
          <PreviewCard
            eyebrow="05"
            title="Compound over time"
            body="We reinvest, refine, and let well-run businesses do what they do best — over a long horizon."
          />
        </div>
      </section>
    </>
  )
}
