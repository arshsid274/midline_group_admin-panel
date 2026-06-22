import type { Metadata } from 'next'
import Link from 'next/link'
import PreviewCard from '@/components/PreviewCard'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Partners',
  description:
    'Midline Investment grows through strategic partnerships across trade, logistics, technology, energy, and industry — long-term alliances built on shared standards and mutual growth.',
}

export default function PartnersPage() {
  return (
    <>
      <section className="subhero">
        <div className="section-label section-label-static">Our Partners</div>
        <h1 className="subhero-title">
          Strength comes from <em>strong relationships.</em>
        </h1>
        <p className="subhero-copy">
          Our businesses thrive on strategic partnerships with a carefully chosen group of leading companies —
          partners who help bring our vision to life and strengthen our position across every sector we
          operate in. We do not view partnerships as transactions; we view them as long-term alliances built
          on shared standards and mutual growth.
        </p>
      </section>

      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">Global Strategic Partnerships</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Integrated solutions, <em>delivered together</em>
        </RevealOnScroll>
        <RevealOnScroll className="section-body">
          We work hand-in-hand with trusted partners across multiple industries to deliver integrated
          solutions that meet our clients&apos; needs and uphold the highest standards of quality.
        </RevealOnScroll>
        <div className="preview-grid">
          <PreviewCard
            eyebrow="Trade & Distribution"
            title="Reliable supply networks"
            body="We collaborate with global suppliers and distributors to ensure consistent availability of products at the highest standards — supply networks our clients can rely on."
          />
          <PreviewCard
            eyebrow="Logistics Services"
            title="Goods moving reliably"
            body="We partner with specialists in transportation, warehousing, and storage to enhance supply-chain efficiency, reduce friction, and keep goods moving across borders."
          />
          <PreviewCard
            eyebrow="Innovation & Technology"
            title="Modernized operations"
            body="We work alongside technology leaders to develop solutions that modernize our operations and support the growth of every business in the group."
          />
          <PreviewCard
            eyebrow="Energy & Industry"
            title="Resilient growth"
            body="We form strategic partnerships across the energy and manufacturing sectors to drive sustainability, operational resilience, and long-term growth."
          />
        </div>
      </section>

      <section className="contact-banner page-block">
        <div className="contact-inner">
          <h2>
            Together, towards a <em>bright future</em>
          </h2>
          <p>
            Thanks to these partnerships, Midline Investment continues to add value and achieve sustainable
            growth. We are proud to work with partners who share our commitment to innovation, integrity, and
            leadership — and we are always open to building new alliances with organizations that share our
            standards and ambition.
          </p>
          <Link href="/contact" className="btn-primary">
            Become a Partner
          </Link>
        </div>
      </section>
    </>
  )
}
