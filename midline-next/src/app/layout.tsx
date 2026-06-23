import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import SiteChrome from '@/components/SiteChrome'
import { MediaOverrideProvider } from '@/components/MediaOverrideProvider'
import { readManifest } from '@/lib/mediaManifest'

export const revalidate = 0

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display-loaded',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body-loaded',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-loaded',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Midline Investment — Multi-Sector Holding Group',
    template: '%s — Midline Investment',
  },
  description:
    'Midline Investment LLC is a multi-sector holding group operating across aviation, oil & gas, food industry, construction, pharmaceuticals, perfumes, furniture, and auto spare parts — headquartered in Dubai, UAE.',
  keywords: ['Midline Investment', 'Dubai holding group', 'UAE investment', 'multi-sector'],
  metadataBase: new URL('https://midline-investment.com'),
  openGraph: {
    type: 'website',
    siteName: 'Midline Investment',
    locale: 'en_AE',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const manifest = await readManifest()
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <head>
        {/* Microsoft Clarity — analytics + session recording. Loaded after
            interactive so it never blocks first paint. Project ID: wi1t835k0n. */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wi1t835k0n");
          `}
        </Script>
      </head>
      <body>
        <MediaOverrideProvider initialManifest={manifest}>
          <SiteChrome>{children}</SiteChrome>
        </MediaOverrideProvider>
      </body>
    </html>
  )
}
