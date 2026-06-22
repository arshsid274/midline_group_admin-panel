import type { Metadata } from 'next'
import Link from 'next/link'
import PreviewCard from '@/components/PreviewCard'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Careers',
  description:
    'Build your future with Midline Investment — work across aviation, energy, trade, and perfumery in a group built on integrity, ownership, and long-term thinking.',
}

export default function CareersPage() {
  return (
    <>
      <section className="subhero">
        <div className="section-label section-label-static">Careers</div>
        <h1 className="subhero-title">
          Build your future <em>with Midline.</em>
        </h1>
        <p className="subhero-copy">
          We are a group of ambitious companies, and we grow by attracting people who take ownership, uphold
          standards, and think long-term. From aviation and energy to trade and perfumery, a career at Midline
          means working across industries with room to learn and advance.
        </p>
      </section>

      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">Why Work With Us</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Room to grow <em>as the group grows</em>
        </RevealOnScroll>
        <div className="preview-grid">
          <PreviewCard
            eyebrow="Breadth"
            title="Multiple sectors and markets"
            body="Exposure to aviation, energy, food, construction, trade, and more — across the markets the group serves."
          />
          <PreviewCard
            eyebrow="Culture"
            title="Integrity and excellence"
            body="A culture built on integrity, ownership, and operational excellence in the details, every day."
          />
          <PreviewCard
            eyebrow="Growth"
            title="Advance with the group"
            body="Opportunities to grow as the group grows, with the support to learn and take on more responsibility."
          />
        </div>
      </section>

      <section className="contact-banner page-block">
        <div className="contact-inner">
          <h2>
            Interested in <em>joining us?</em>
          </h2>
          <p>
            We are always glad to hear from people who share our standards and ambition. Reach out and tell us
            where you would like to contribute across the group.
          </p>
          <Link href="/contact" className="btn-primary">
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  )
}
