import type { Metadata } from 'next'
import PreviewCard from '@/components/PreviewCard'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Midline Investment LLC is built around the idea that disciplined capital, operational excellence, and long-term partnerships can transform industries and create lasting value.',
}

export default function AboutPage() {
  return (
    <>
      <section className="subhero">
        <div className="section-label section-label-static">About Midline</div>
        <h1 className="subhero-title">
          We don&apos;t just build companies. <em>We build futures.</em>
        </h1>
        <p className="subhero-copy">
          Midline Investment LLC is built around the idea that disciplined capital, operational excellence,
          and long-term partnerships can transform industries and create lasting value.
        </p>
      </section>

      <section className="about-section page-block">
        <div className="about-inner">
          <div className="about-grid">
            <div>
              <p className="about-tagline">
                A holding group shaped by <em>innovation, precision, and responsible investment.</em>
              </p>
              <p className="about-body">
                At Midline Investment LLC, we are more than a multi-sector investment group — we are builders
                of progress. We create long-term value by combining disciplined capital allocation, deep
                operational expertise, and a genuine sense of responsibility toward the markets and
                communities we serve. With a presence that spans continents and industries, we are focused on
                creating value, forging partnerships, and shaping markets for the generations to come.
              </p>
              <p className="about-body">
                Our success is measured not only by the returns we generate, but by the durable businesses and
                lasting relationships we leave behind. By bringing together creativity, expertise, and modern
                technology, we deliver tailored investment solutions that drive sustainable growth and
                meaningful, positive impact.
              </p>
            </div>
            <div className="mission-grid">
              <RevealOnScroll className="mission-item">
                <div className="mission-label">Our Vision</div>
                <h4>Investment as Transformation</h4>
                <p>
                  We see investment as more than capital — it is a force for transformation. With a growing
                  international footprint and a reputation for excellence, we shape industries through bold
                  innovation, strategic foresight, and lasting economic impact.
                </p>
              </RevealOnScroll>
              <RevealOnScroll className="mission-item" delay={70}>
                <div className="mission-label">Our Mission</div>
                <h4>Redefine Excellence</h4>
                <p>
                  To redefine investment excellence by creating lasting value that inspires and transforms
                  industries, delivering solutions that set new global standards.
                </p>
              </RevealOnScroll>
              <RevealOnScroll className="mission-item" delay={140}>
                <div className="mission-label">Our Values</div>
                <h4>Integrity &amp; Innovation</h4>
                <p>
                  We uphold the highest standards of governance, accountability, and operational quality
                  across all 34 companies in the portfolio.
                </p>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

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
