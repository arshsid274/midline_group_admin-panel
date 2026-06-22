import type { Metadata } from 'next'
import PreviewCard from '@/components/PreviewCard'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Sustainability & Responsibility',
  description:
    'Sustainability is part of how Midline Investment evaluates, builds, and operates every business — across environmental, social, and governance dimensions.',
}

export default function SustainabilityPage() {
  return (
    <>
      <section className="subhero">
        <div className="section-label section-label-static">Sustainability &amp; Responsibility</div>
        <h1 className="subhero-title">
          Responsible <em>by design.</em>
        </h1>
        <p className="subhero-copy">
          We believe investment should leave markets, communities, and the environment better than it found
          them. Sustainability is not a separate initiative at Midline — it is part of how we evaluate, build,
          and operate every business.
        </p>
      </section>

      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">ESG</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Built into <em>how we operate</em>
        </RevealOnScroll>
        <div className="preview-grid">
          <PreviewCard
            eyebrow="Environmental"
            title="Cleaner operations"
            body="We support cleaner, more efficient operations across our energy, industrial, and logistics businesses, and we factor environmental impact into how we grow."
          />
          <PreviewCard
            eyebrow="Social"
            title="People and communities"
            body="We invest in our people, support the communities we operate in, and uphold safe, fair working conditions across the group."
          />
          <PreviewCard
            eyebrow="Governance"
            title="Transparency and ethics"
            body="We hold ourselves to high standards of transparency, ethics, and accountability at every level of the organization."
          />
        </div>
      </section>
    </>
  )
}
