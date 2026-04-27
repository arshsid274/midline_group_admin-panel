'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { type Company, companySlug } from '@/lib/data'
import { useMediaOverrides } from '@/components/MediaOverrideProvider'
import LazyVideo from '@/components/LazyVideo'
import styles from './CompanyElicaStack.module.css'

interface Props {
  companies: Company[]
  sectorTitle: string
  totalCompanies?: number
}

export default function CompanyElicaStack({ companies, sectorTitle, totalCompanies }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const count = totalCompanies ?? companies.length
  const router = useRouter()
  const overrides = useMediaOverrides()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText)

    const section = sectionRef.current
    if (!section) return

    // ── The Ssangyong/Elica pattern (from index.html initElicaSlides) ──
    //
    // The original 3-card stack works for ANY count of cards because it
    // creates ScrollTriggers at scrollY=0. Every card evaluates
    // progress=0 → no wrong autoAlpha:0 painted, no rotation/scale leaked
    // into the from-state. Then scroll is restored AFTER triggers exist;
    // ScrollTrigger updates progress for the new scroll position,
    // painting correct values across all cards.
    //
    // Next.js App Router auto-restores scroll BEFORE useEffect, breaking
    // this invariant. We restore it explicitly: scroll to 0 → build
    // triggers → scroll back to the user's saved Y.

    // Read user's intended scroll position (from sessionStorage if present,
    // or from current scrollY which the browser/Next may have already set).
    const storageKey = `midline:scroll:${window.location.pathname}`
    let savedY = window.scrollY
    try {
      const fromStorage = window.sessionStorage.getItem(storageKey)
      const parsed = fromStorage ? parseInt(fromStorage, 10) : NaN
      if (Number.isFinite(parsed) && parsed > savedY) savedY = parsed
    } catch {
      // Ignore storage failures (private mode, quota, etc.)
    }

    // Force scroll to 0 BEFORE creating triggers so they all evaluate
    // their progress at the safe baseline (everything visible, no
    // transforms applied). This is the structural invariant the original
    // Ssangyong code relied on via `history.scrollRestoration = 'manual'
    // + window.scrollTo(0, 0)` at page load.
    if (window.scrollY !== 0) window.scrollTo(0, 0)

    // ── Trigger setup (mirrors initElicaSlides from index.html) ──
    const ctx = gsap.context(() => {
      const slides = section.querySelectorAll<HTMLElement>(`.${styles.slide}`)
      const total = slides.length

      slides.forEach((slide, idx) => {
        const wrap    = slide.querySelector<HTMLElement>(`.${styles.wrap}`)
        const content = slide.querySelector<HTMLElement>(`.${styles.content}`)
        if (!wrap || !content) return
        if (idx === total - 1) return // last card untouched (kept visible at end)

        // Pin + 3D tilt.
        //
        // CRITICAL: pinType: 'transform' — our PageTransition wraps every
        // page in a framer-motion <motion.div>, which applies a transform
        // stacking context to the ancestor. ScrollTrigger's default
        // pinType:'fixed' uses position:fixed, which breaks when a
        // transformed ancestor exists (CSS spec: fixed-position elements
        // get reparented to the transformed ancestor's containing block,
        // not the viewport). The pinned card ends up rendered at the
        // wrong location, appearing "missing" on back-navigation.
        // pinType:'transform' uses translate3d instead — unaffected by
        // transformed ancestors. See GSAP forum 37048.
        gsap.to(content, {
          rotationZ: 10 * (Math.random() - 0.1),
          scale: 0.9,
          rotationX: 40,
          ease: 'power1.in',
          scrollTrigger: {
            pin: wrap,
            pinType: 'transform',
            trigger: slide,
            start: 'top 0%',
            end: `+=${window.innerHeight}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        // Fade-out as next card takes over
        gsap.to(content, {
          autoAlpha: 0,
          ease: 'power1.in',
          scrollTrigger: {
            trigger: content,
            start: 'top -80%',
            end: `+=${0.2 * window.innerHeight}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      })

      // Photo/video parallax reveal
      slides.forEach((slide) => {
        const wraps = slide.querySelectorAll<HTMLElement>(`.${styles.imageWrap}`)
        if (!wraps.length) return

        const tweenConfig = {
          xPercent: (_i: number, el: Element) => parseFloat(el.getAttribute('data-x') ?? '0') || 0,
          yPercent: (_i: number, el: Element) => parseFloat(el.getAttribute('data-y') ?? '0') || 0,
          opacity: 0,
          ease: 'expo.out',
          duration: 1.8,
          stagger: 0.1,
        } as const

        if (total === 1) {
          // Single-card sector: trigger never fires, so play on mount.
          gsap.from(wraps, { ...tweenConfig, delay: 0.1 })
        } else {
          gsap.from(wraps, {
            ...tweenConfig,
            scrollTrigger: { trigger: slide, start: 'top center' },
          })
        }
      })

      // Split-text heading reveal
      const timings = {
        lines: { duration: 1.2, stagger: 0.08 },
        words: { duration: 1.0, stagger: 0.05 },
        chars: { duration: 0.8, stagger: 0.03 },
      } as const

      section.querySelectorAll<HTMLElement>('[data-split-reveal]').forEach((el) => {
        const revealType = (el.getAttribute('data-split-reveal') ?? 'lines') as keyof typeof timings
        const typeList =
          revealType === 'lines' ? 'lines'
          : revealType === 'words' ? 'lines, words'
          : 'lines, words, chars'

        const split = SplitText.create(el, { type: typeList, mask: 'lines', autoSplit: true })
        const targets = split[revealType] as HTMLElement[]
        const { duration, stagger } = timings[revealType]

        gsap.from(targets, {
          yPercent: 110,
          duration,
          stagger,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'clamp(top 80%)', once: true },
          onComplete: () => split.revert(),
        })
      })
    }, sectionRef)

    // ── Restore scroll position AFTER triggers exist ──
    // Two RAFs to ensure the browser has committed the trigger setup
    // (pin spacers materialised, layout extended) before the scroll lands.
    // Then a final ScrollTrigger.refresh() so all scrubs lock to their
    // correct scroll-driven progress for the restored Y.
    let restoreId: number | null = null
    if (savedY > 4) {
      restoreId = window.requestAnimationFrame(() => {
        restoreId = window.requestAnimationFrame(() => {
          window.scrollTo(0, savedY)
          ScrollTrigger.refresh()
        })
      })
    }

    // ── Save scroll position on user scroll (sessionStorage) ──
    let saveTimer: number | null = null
    const onScroll = () => {
      if (saveTimer) window.clearTimeout(saveTimer)
      saveTimer = window.setTimeout(() => {
        try {
          window.sessionStorage.setItem(storageKey, String(window.scrollY))
        } catch {
          // Ignore storage failures
        }
      }, 150)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      if (restoreId !== null) window.cancelAnimationFrame(restoreId)
      if (saveTimer) window.clearTimeout(saveTimer)
      window.removeEventListener('scroll', onScroll)
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>

      <div className={styles.stickyLabel}>
        <span className={styles.stickyLabelText}>Our {sectorTitle} Companies</span>
        <span className={styles.stickyCounter}>— {count} {count === 1 ? 'company' : 'companies'}</span>
      </div>

      {companies.map((company, i) => {
        const slug = companySlug(company.name)
        const logoSrc = overrides[`company:${slug}:logo`] ?? company.logo
        return (
        <div key={company.name} className={styles.slide}>
          <div className={styles.wrap}>
            <div
              className={styles.content}
              role="link"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              onClick={() => router.push(`/companies/${slug}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  router.push(`/companies/${slug}`)
                }
              }}
            >

              {/* ── Top: eyebrow → [logo + title inline] ── */}
              <div className={styles.contentTop}>
                <p className={styles.eyebrow}>{company.type}</p>
                <div className={styles.logoTitleRow}>
                  {logoSrc && (
                    <div className={styles.logoPlate}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoSrc}
                        alt={`${company.name} logo`}
                        className={styles.companyLogo}
                      />
                    </div>
                  )}
                  <h2 data-split-reveal="lines" className={styles.heading}>
                    {company.name}
                  </h2>
                </div>
              </div>

              {/* ── Bottom: 3-layer media + info (absolutely covers card) ── */}
              <div className={styles.contentBottom}>

                {/* Media cluster — primary in flow, secondary/tertiary float absolutely.
                 *
                 * Each of the three slots can render either an <img> or a <video>, decided
                 * by file extension. Wiring is data-driven via `company.photos`:
                 *   slot[0] (primary)   = company.photos[0]
                 *   slot[1] (secondary) = company.photos[1]
                 *   slot[2] (tertiary)  = company.photos[2]
                 * Falls back to (company.photo, company.video) for backward compatibility. */}
                <div className={styles.contentImages}>
                  {[
                    { wrap: `${styles.imageWrap} ${styles.imageWrapMain}`,      placeholder: styles.cardPlaceholder,                         dx: '0',   dy: '50'  },
                    { wrap: `${styles.imageWrap} ${styles.imageWrapSecondary}`, placeholder: `${styles.cardPlaceholder} ${styles.cardPlaceholderB}`, dx: '-30', dy: '100' },
                    { wrap: `${styles.imageWrap} ${styles.imageWrapTertiary}`,  placeholder: `${styles.cardPlaceholder} ${styles.cardPlaceholderC}`, dx: '-60', dy: '120' },
                  ].map((slot, idx) => {
                    // Per-company media only — sector media is reserved for the
                    // SECTOR pages (hero + carousel), never used as filler in a
                    // company card. Companies without their own photos/video
                    // render as placeholders until media is supplied.
                    const fallbackSrc =
                      company.photos?.[idx] ??
                      (idx === 0 ? company.photo ?? company.video : undefined)
                    const src = overrides[`company:${slug}:card-photo-${idx + 1}`] ?? fallbackSrc
                    const isVideo = !!src && /\.(mp4|mov|webm|m4v)$/i.test(src)
                    return (
                      <div key={idx} data-x={slot.dx} data-y={slot.dy} className={slot.wrap}>
                        {src ? (
                          isVideo ? (
                            <LazyVideo
                              src={src}
                              poster={company.photo ?? undefined}
                              muted
                              playsInline
                              loop
                              autoPlay
                              className={styles.cardVideo}
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={src} alt={idx === 0 ? company.name : ''} loading="lazy" className={styles.cardImage} />
                          )
                        ) : idx === 0 && !company.photos?.length ? (
                          <div className={slot.placeholder}>{company.name.slice(0, 2).toUpperCase()}</div>
                        ) : (
                          <div className={slot.placeholder} />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Right: tags + desc + link + index */}
                <div className={styles.contentRight}>
                  <div className={styles.tags}>
                    {company.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                    <span className={`${styles.tag} ${styles.tagType}`}>{company.type}</span>
                  </div>
                  <p className={styles.body}>{company.desc}</p>
                  {company.link && (
                    <a
                      href={company.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                      onClick={(e) => e.stopPropagation()}
                    >
                      ↗ {company.link.replace(/https?:\/\//, '')}
                    </a>
                  )}
                  <span className={styles.cardNumber}>
                    {String(i + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                  </span>
                  <Link
                    href={`/companies/${slug}`}
                    prefetch={false}
                    className={styles.openButton}
                    onClick={(e) => {
                      e.stopPropagation()
                      // Belt-and-suspenders: if the parent's onClick wins
                      // the race somehow, navigate via the router directly.
                      router.push(`/companies/${slug}`)
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label={`Open ${company.name} page`}
                  >
                    Open <span aria-hidden>→</span>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
        )
      })}

    </section>
  )
}
