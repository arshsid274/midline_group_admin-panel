import type { Metadata } from 'next'
import { SITE_META } from '@/lib/data'
import PreviewCard from '@/components/PreviewCard'
import RevealOnScroll from '@/components/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Whether you're seeking investment opportunities, strategic partnerships, or services from one of our companies, our Dubai office is ready to connect.",
}

export default function ContactPage() {
  return (
    <>
      <section className="subhero">
        <div className="section-label section-label-static">Contact Us</div>
        <h1 className="subhero-title">
          Let&apos;s start a <em>conversation.</em>
        </h1>
        <p className="subhero-copy">
          Whether you are seeking investment opportunities, strategic partnerships, or services from one of
          our companies, our Dubai office is ready to connect.
        </p>
      </section>

      <section className="contact-banner page-block">
        <div className="contact-inner">
          <h2>
            Midline Investment <em>Dubai Headquarters</em>
          </h2>
          <p>
            Reach out by phone or email, or visit our office in Business Bay. We are available from Monday
            to Saturday during business hours.
          </p>
          <a href={`mailto:${SITE_META.email}`} className="btn-primary">
            Email Midline
          </a>
          <div className="contact-details">
            <div>
              <div className="contact-item-label">Address</div>
              <div className="contact-item-value">
                Burlington Tower – Office 410<br />
                Marasi Drive, Business Bay, Dubai
              </div>
            </div>
            <div>
              <div className="contact-item-label">Phone</div>
              <div className="contact-item-value">
                <a href={`tel:${SITE_META.phone.replace(/\s/g, '')}`}>{SITE_META.phone}</a>
              </div>
            </div>
            <div>
              <div className="contact-item-label">Email</div>
              <div className="contact-item-value">
                <a href={`mailto:${SITE_META.email}`}>{SITE_META.email}</a>
              </div>
            </div>
            <div>
              <div className="contact-item-label">Hours</div>
              <div className="contact-item-value">{SITE_META.hours}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">How We Help</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Connect with the right <em>part of the group</em>
        </RevealOnScroll>
        <div className="preview-grid">
          <PreviewCard
            eyebrow="Investors"
            title="Investment opportunities"
            body="Discuss portfolio strategy, joint ventures, or long-term capital partnerships."
          />
          <PreviewCard
            eyebrow="Partners"
            title="Strategic collaboration"
            body="Explore procurement, expansion, operating alliances, and market-entry partnerships."
          />
          <PreviewCard
            eyebrow="Clients"
            title="Sector-specific services"
            body="Get routed to the right company across aviation, energy, food, automotive, furniture, or pharma."
          />
        </div>
      </section>
    </>
  )
}
