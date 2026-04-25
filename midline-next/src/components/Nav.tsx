'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/companies', label: 'Companies' },
  { href: '/about', label: 'About' },
  { href: '/global', label: 'Global' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav>
      <Link href="/" className="nav-brand">
        Midline <em>Investment</em>
      </Link>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={pathname === href || (href !== '/' && pathname.startsWith(href)) ? 'active' : ''}
        >
          {label}
        </Link>
      ))}
      <Link href="/contact" className="btn-nav">
        Get A Quote
      </Link>
    </nav>
  )
}
