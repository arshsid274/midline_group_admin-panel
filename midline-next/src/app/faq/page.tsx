import type { Metadata } from 'next'
import PreviewCard from '@/components/PreviewCard'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about Midline Investment — who we are, the industries and companies in the group, where we are based, and how to get in touch.',
}

export default function FaqPage() {
  return (
    <>
      <section className="subhero">
        <div className="section-label section-label-static">FAQ</div>
        <h1 className="subhero-title">
          Frequently asked <em>questions.</em>
        </h1>
        <p className="subhero-copy">
          A quick overview of who we are, what we do, and how to reach the right part of the group. For
          anything not covered here, our Dubai office is ready to help.
        </p>
      </section>

      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">Answers</RevealOnScroll>
        <RevealOnScroll className="section-title">
          What people <em>ask us most</em>
        </RevealOnScroll>
        <div className="preview-grid">
          <PreviewCard
            eyebrow="About"
            title="What is Midline Investment?"
            body="A multi-sector investment group headquartered in Dubai, UAE, with operating companies across construction, energy, aviation, trading, perfumery, and petroleum services."
          />
          <PreviewCard
            eyebrow="Industries"
            title="Which industries does Midline operate in?"
            body="Construction & contracting, food & beverage, perfumes & beauty, import & export, industry & trade, aviation services, and oil & petroleum services."
          />
          <PreviewCard
            eyebrow="Location"
            title="Where is Midline Investment based?"
            body="Our head office is in Burlington Tower, Business Bay, Dubai, with operations and a network spanning several international markets."
          />
          <PreviewCard
            eyebrow="Companies"
            title="What companies are part of the group?"
            body="Midline Aviation, HighTrend Energy, HighTrend Trading, Ard Al Teeb Perfume, ARC (auto parts), and ARCO Oil & Gas, among others."
          />
          <PreviewCard
            eyebrow="Partnership"
            title="How can I partner with or invest alongside Midline?"
            body="Reach out through our Contact page and our team will connect you with the right person."
          />
          <PreviewCard
            eyebrow="Contact"
            title="How do I contact Midline Investment?"
            body="Email info@midline-investment.com or call +971 4 548 8762, Monday–Saturday, 9:00 AM–6:00 PM (GST)."
          />
        </div>
      </section>
    </>
  )
}
