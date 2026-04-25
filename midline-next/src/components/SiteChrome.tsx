'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Aurora from '@/components/Aurora'
import Cursor from '@/components/Cursor'
import Particles from '@/components/Particles'
import ProgressBar from '@/components/ProgressBar'
import PageTransition from '@/components/PageTransition'

const BARE_PATTERNS = [/^\/companies\/[^/]+\/?$/, /^\/admin(\/|$)/]

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  const bare = BARE_PATTERNS.some((re) => re.test(pathname))

  // Tag the body so globals.css can override the leaking CompanyInfoPages
  // resets (body font-size, line-height, color) on every non-bare route —
  // the heavy stylesheet stays loaded by Next.js after the first visit.
  useEffect(() => {
    document.body.classList.toggle('midline-shell', !bare)
    return () => { document.body.classList.remove('midline-shell') }
  }, [bare])

  if (bare) return <>{children}</>

  return (
    <>
      <Aurora />
      <Particles />
      <Cursor />
      <ProgressBar />
      <Nav />
      <PageTransition>
        {children}
        <Footer />
      </PageTransition>
    </>
  )
}
