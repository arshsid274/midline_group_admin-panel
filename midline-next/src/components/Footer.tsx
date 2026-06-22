import Link from 'next/link'
import { SITE_META } from '@/lib/data'

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>Midline <em>Investment</em></h3>
          <p>{SITE_META.tagline}</p>
        </div>
        <div className="footer-col">
          <h4>Website</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/companies">Companies</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/approach">Our Approach</Link></li>
            <li><Link href="/partners">Partners</Link></li>
            <li><Link href="/sustainability">Sustainability</Link></li>
            <li><Link href="/global">Global Presence</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Main Office — UAE</h4>
          <p>
            Burlington Tower – 410<br />
            Marasi Drive, Business Bay<br />
            Dubai, UAE<br />
            <br />
            <a href={`tel:${SITE_META.phone.replace(/\s/g, '')}`}>{SITE_META.phone}</a><br />
            <a href={`mailto:${SITE_META.email}`}>{SITE_META.email}</a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 MIDLINE INVESTMENT LLC. All rights reserved.</span>
        <span>Burlington Tower 410, Business Bay, Dubai, UAE</span>
      </div>
    </footer>
  )
}
