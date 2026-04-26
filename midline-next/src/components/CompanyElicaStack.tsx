'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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

    const ctx = gsap.context(() => {
      const section = sectionRef.current
      if (!section) return

      // ── 3D card scroll-away (matches ElicaCards original) ──
      // All cards except the last get both animations.
      // Last card stays visible — no pin, no animation.
      const slides = section.querySelectorAll<HTMLElement>(`.${styles.slide}`)
      const total = slides.length

      // Defensive reset on (re)mount. On back-navigation from a company
      // detail page, scroll position is restored before PageTransition's
      // opacity fade settles. Without this reset, leftover/stale state
      // could leave a card invisible (autoAlpha:0). Force a clean slate
      // — ScrollTrigger.refresh() below will then re-apply the right
      // values for the current scroll position.
      const allContents = section.querySelectorAll<HTMLElement>(`.${styles.content}`)
      gsap.set(allContents, { autoAlpha: 1, clearProps: 'transform' })

      // Same defensive reset for the photo wraps. A previous mount's
      // mid-animation state (opacity:0 + translation from gsap.from)
      // can persist if ctx.revert lands during the framer-motion fade.
      const allWraps = section.querySelectorAll<HTMLElement>(`.${styles.imageWrap}`)
      gsap.set(allWraps, { clearProps: 'opacity,transform,xPercent,yPercent' })

      // ── PHASE 1: Pin triggers only ──
      // Pin triggers must be created FIRST and ScrollTrigger.refresh()
      // must run BEFORE the fade-out triggers, so that the fade-out
      // triggers read post-pin-spacer layout when calculating their
      // start/end positions. Without this two-phase split, the fade-out
      // for the card the user was viewing pinned (on back-nav) reads
      // un-spaced positions, evaluates as "past fade end → progress=1
      // → autoAlpha:0", and that wrong state then sticks because
      // invalidateOnRefresh re-reads autoAlpha:0 as the new start value.
      slides.forEach((slide, idx) => {
        const wrap    = slide.querySelector<HTMLElement>(`.${styles.wrap}`)
        const content = slide.querySelector<HTMLElement>(`.${styles.content}`)
        if (!wrap || !content) return
        if (idx === total - 1) return // last card: no pin, no fade

        gsap.to(content, {
          rotationZ: 10 * (Math.random() - 0.1),
          scale: 0.9,
          rotationX: 40,
          ease: 'power1.in',
          scrollTrigger: {
            pin: wrap,
            trigger: slide,
            start: 'top 0%',
            end: `+=${window.innerHeight}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      })

      // Materialise pin spacers so subsequent triggers see stable layout.
      ScrollTrigger.refresh()

      // ── PHASE 2: Fade-out triggers ──
      // Now `content.getBoundingClientRect().top` reads correct
      // post-spacer positions for every card — no false "past fade end"
      // evaluations on back-nav.
      slides.forEach((slide, idx) => {
        const content = slide.querySelector<HTMLElement>(`.${styles.content}`)
        if (!content) return
        if (idx === total - 1) return

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

      // ── Image/video parallax reveal ──
      // `once: true` so the entrance plays exactly once — without it, fast-scrolling
      // past a slide could leave its wraps stuck at the gsap.from start state
      // (opacity:0, translated off-position) because GSAP's scroll-state can
      // desync on rapid scroll jumps.
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
          // Single-card sector: the slide sits ~1.7vh down the page, so a
          // scrollTrigger of `top center` would never fire for a user who
          // lands on the page and doesn't scroll — leaving wraps stuck at
          // opacity:0. Play the reveal on mount instead. The animation
          // intent ("reveal images as user encounters them") is preserved;
          // for a single card the encounter IS mount.
          gsap.from(wraps, { ...tweenConfig, delay: 0.1 })
        } else {
          // Multi-card sectors: reveal as the slide enters view. `top 80%`
          // fires earlier than `top center` so the animation completes
          // before the slide reaches its pin position — no flash of
          // empty card.
          //
          // immediateRender:false defers the from-state (opacity:0 +
          // translation) until the trigger actually fires. On back-nav
          // from a company detail page, framer-motion's fade window can
          // cause the once-trigger to miss its onEnter — without this
          // flag, the wraps would be stuck at opacity:0 forever. With
          // it, wraps stay at their natural visible state if the
          // trigger never fires.
          gsap.from(wraps, {
            ...tweenConfig,
            immediateRender: false,
            scrollTrigger: { trigger: slide, start: 'top 80%', once: true },
          })
        }
      })

      // ── Split-text heading reveal ──
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

    // PageTransition wraps the page in a framer-motion opacity 0→1 fade.
    // ScrollTrigger captured trigger positions during that fade — a window
    // where layout can be subtly off. Refresh once after the fade has
    // resolved AND after browser scroll restoration has settled, so
    // triggers re-measure with stable coordinates.
    const refreshId = window.setTimeout(() => {
      ScrollTrigger.refresh()
    }, 350)

    return () => {
      window.clearTimeout(refreshId)
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
                  <button
                    type="button"
                    className={styles.openButton}
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/companies/${slug}`)
                    }}
                    aria-label={`Open ${company.name} page`}
                  >
                    Open <span aria-hidden>→</span>
                  </button>
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
