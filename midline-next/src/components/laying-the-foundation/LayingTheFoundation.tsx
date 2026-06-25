'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import styles from './LayingTheFoundation.module.css'

/**
 * "Laying the Foundation for the Right Match" — GSAP + Lottie, ported 1:1 from the
 * original Webflow interactions. Self-contained client component.
 *
 *  Desktop (≥992):  cards rise then pass-through up · heading letter-reveal · desk
 *                   ribbon playhead scrubbed (top top → bottom bottom, scrub .5)
 *  Tablet/mobile (≤991): cards rise-in & un-tilt, no pass-through (top 50% → bottom
 *                   bottom, scrub .8) · heading pinned small at top · ribbon scrubbed
 *                   (≥480 desk landscape, ≤479 mob portrait)
 *
 * Requirements: `npm i gsap lottie-web` (SplitText ships free in gsap ≥ 3.13).
 * Copy ./assets/* into your /public at `assetBase` (default /laying-the-foundation).
 */

export interface FoundationStep {
  icon: string
  tag: string
  title: ReactNode
  body: string
}

export interface LayingTheFoundationProps {
  heading?: string
  steps?: FoundationStep[]
  /** Public path holding the ribbon JSONs (copy ./assets there). */
  assetBase?: string
  /**
   * Theme colors for the ribbon "line" (hex). The gradient stroke is recolored
   * from the first → last entry; solid strokes cycle through the list.
   * Defaults to Midline navy → sky.
   */
  lineColors?: string[]
  className?: string
}

/** Per-card initial tilt (deg) — un-tilted to 0 as the cards settle. */
const TILTS = [-1, 3, -2]

/** Midline brand line: navy-900 → sky-400 → sky-300 (deep, good contrast on light bg). */
const DEFAULT_LINE_COLORS = ['#053F6E', '#2FB8EE', '#50CFFE']

/** "#RRGGBB" | "#RGB" → normalized [r,g,b] in 0..1 (Lottie color space). */
function hexToRgb01(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

/**
 * Recolor a Lottie ribbon in place: solid strokes (ty:'st') cycle through the
 * palette; gradient strokes (ty:'gs') have their color stops remapped across the
 * palette (positions + alpha stops preserved).
 */
function recolorRibbon(data: unknown, colors: string[]): void {
  const rgbs = colors.map(hexToRgb01)
  if (!rgbs.length) return
  let solidIdx = 0
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    if (node && typeof node === 'object') {
      const o = node as Record<string, any>
      if (o.ty === 'st' && Array.isArray(o.c?.k)) {
        const [r, g, b] = rgbs[solidIdx % rgbs.length]
        solidIdx++
        o.c.k[0] = r
        o.c.k[1] = g
        o.c.k[2] = b
      }
      if (o.ty === 'gs' && Array.isArray(o.g?.k?.k)) {
        const stops = Math.max(1, o.g.p || 2) // number of COLOR stops
        const k = o.g.k.k as number[]
        for (let i = 0; i < stops; i++) {
          const t = stops > 1 ? i / (stops - 1) : 0
          const [r, g, b] = rgbs[Math.round(t * (rgbs.length - 1))]
          k[i * 4 + 1] = r // k[i*4] is the stop position — keep it
          k[i * 4 + 2] = g
          k[i * 4 + 3] = b
        }
      }
      Object.values(o).forEach(walk)
    }
  }
  walk(data)
}

const DEFAULT_STEPS: FoundationStep[] = [
  {
    icon: '🧠',
    tag: 'Step - 01',
    title: (
      <>
        Strategy Session <br />
        with the Founder
      </>
    ),
    body:
      'A consulting-style call with our founder to review your Leadership DNA™ Profile — how you communicate, delegate, and lead — so we can define the role and make the right match.',
  },
  {
    icon: '🚀',
    tag: 'Step - 02',
    title: (
      <>
        Client <br />
        Success Kickoff
      </>
    ),
    body:
      'Your Success Manager finalizes the role, sets the timeline, and activates your Success Pod to ensure a smooth hiring journey.',
  },
  {
    icon: '🦄',
    tag: 'Step - 03',
    title: (
      <>
        Meet Your <br />
        Unicorn Match
      </>
    ),
    body:
      'You’ll receive a full Unicorn Profile: video intro, hard + soft skills, cognitive + behavioral traits, strengths, and growth areas. It’s everything you need to know beyond a resume.',
  },
]

export default function LayingTheFoundation({
  heading = 'Laying the Foundation for the Right Match',
  steps = DEFAULT_STEPS,
  assetBase = '/laying-the-foundation',
  lineColors = DEFAULT_LINE_COLORS,
  className,
}: LayingTheFoundationProps) {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    gsap.registerPlugin(ScrollTrigger, SplitText)

    const track = root.querySelector<HTMLElement>('[data-track]')!
    const headingEl = root.querySelector<HTMLElement>('[data-reveal]')
    const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-card]'))
    const tilt = (i: number) => Number(cards[i]?.dataset.tilt ?? 0)

    let cancelled = false
    let ribbonCleanup: (() => void) | undefined

    /* ── card + heading animation — set up SYNCHRONOUSLY (never blocked by Lottie) ── */
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      /* Heading letter-reveal — the original VISUAL (timeline t-6dccfc74): SplitText
         chars, opacity 0→1 + y 50%→0, duration .75, stagger amount .5. The original
         scrubs this, but on this heavily-pinned page the scrub never advances past
         opacity 0 (the heading stays invisible) — so we PLAY it once, triggered by a
         native IntersectionObserver that can't fail to fire. Runs on all breakpoints. */
      /* Heading reveal — CSS class, NOT gsap. gsap.from/set left `opacity:0` inline
         on the <h2> and the tween got orphaned by Strict-Mode mount/unmount, so the
         heading stayed invisible. The CSS reveal animates `transform` ONLY (never
         opacity) — so the text is ALWAYS visible and merely slides up. Cannot stick. */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (!headingEl) return
        let played = false
        const io = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting && !played) {
              played = true
              headingEl.classList.add(styles.headingReveal)
              io.disconnect()
            }
          },
          { threshold: 0.1 }
        )
        io.observe(headingEl)
        return () => io.disconnect()
      })

      /* Cards — DESKTOP: rise (50rem→0) then pass-through up (0→−50rem). */
      mm.add('(min-width: 992px) and (prefers-reduced-motion: no-preference)', () => {
        if (!cards.length) return
        cards.forEach((c, i) => gsap.set(c, { rotation: tilt(i) }))
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
        })
        tl.fromTo(cards, { y: '50rem' }, { y: '0rem', duration: 0.72, stagger: { amount: 0.25 }, ease: 'power2.out' }, 0)
        tl.to(cards, { y: '-50rem', duration: 0.72, stagger: { amount: 0.25 }, ease: 'power1.inOut' }, 0.82)
      })

      /* Cards — MOBILE/TABLET: rise-in & un-tilt, no pass-through. */
      mm.add('(max-width: 991px) and (prefers-reduced-motion: no-preference)', () => {
        if (!cards.length) return
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: track, start: 'top 50%', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
        })
        tl.fromTo(cards, { y: '50rem' }, { y: '0rem', duration: 0.72, stagger: { amount: 0.1 }, ease: 'power2.out' }, 0)
        cards.forEach((c, i) => tl.fromTo(c, { rotation: tilt(i) }, { rotation: 0, duration: 0.72 }, 0))
      })
    }, rootRef)

    /* The pinned hero (§A) + 1000vh carousel (§D) change this section's scroll
       position AFTER our triggers are created — so without a re-measure the rise
       fires at the wrong point (or the scrub parks the cards off-screen). We
       recompute ONLY our own triggers (never the GLOBAL ScrollTrigger.refresh(),
       which re-runs every pin and disrupts the carousel) at EVERY settlement
       signal — covering the race where a signal fires before this effect mounts:
         · next frame                (initial)
         · window 'load'             (assets/layout settled)
         · 'sah:ready'               (hero pin spacer exists)
         · 'oc:restored'             (carousel finished restoring scroll)
         · 700ms fallback timer      (catches any signal missed before mount) */
    const refreshOwn = () => {
      ScrollTrigger.getAll().forEach((st) => {
        const el = st.trigger as Node | null
        if (el && (el === root || root.contains(el))) st.refresh()
      })
    }
    const rafId = requestAnimationFrame(refreshOwn)
    const settleTimer = window.setTimeout(refreshOwn, 700)
    window.addEventListener('load', refreshOwn)
    window.addEventListener('sah:ready', refreshOwn)
    window.addEventListener('oc:restored', refreshOwn)

    /* Crossing the 992px breakpoint makes gsap.matchMedia revert the old card
       timeline and build the new one — but the rebuilt scrub doesn't re-apply the
       current scroll position, so the cards can stay parked off-screen (y:50rem).
       Re-sync our scoped triggers ~after the rebuild settles. Debounced so it runs
       once the matchMedia rebuild + ScrollTrigger's own resize refresh have fired. */
    let resizeTimer: number | undefined
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(refreshOwn, 300)
    }
    window.addEventListener('resize', onResize)

    /* ── ribbon line — load Lottie INDEPENDENTLY; a failure here never affects
       the card/heading animation above. Bind the visible variant per breakpoint. ── */
    import('lottie-web')
      .then(({ default: lottie }) => {
        if (cancelled || !rootRef.current) return
        const rmm = gsap.matchMedia()
        const bindRibbon = (variant: 'desk' | 'mob', cfg: { start: string; end: string; scrub: number }) => () => {
          const el = root.querySelector<HTMLElement>(`[data-ribbon="${variant}"]`)
          if (!el?.dataset.src) return
          let anim: ReturnType<typeof lottie.loadAnimation> | undefined
          let tween: gsap.core.Tween | undefined
          let killed = false

          // Fetch the JSON, recolor its strokes/gradient to the theme, then load
          // via animationData (same network cost as `path`, but themeable).
          fetch(el.dataset.src)
            .then((r) => r.json())
            .then((data) => {
              if (killed) return
              recolorRibbon(data, lineColors)
              anim = lottie.loadAnimation({
                container: el,
                renderer: 'svg',
                loop: false,
                autoplay: false, // scrubbed, not played
                animationData: data,
              })
              anim.addEventListener('DOMLoaded', () => {
                if (killed || !anim) return
                const last = anim.totalFrames - 1
                const head = { f: 0 }
                tween = gsap.to(head, {
                  f: last,
                  ease: 'none',
                  onUpdate: () => anim!.goToAndStop(head.f, true),
                  scrollTrigger: { trigger: root, start: cfg.start, end: cfg.end, scrub: cfg.scrub, invalidateOnRefresh: true },
                })
              })
            })
            .catch((err) => console.error('[LayingTheFoundation] ribbon load/recolor failed:', err))

          return () => {
            killed = true
            tween?.scrollTrigger?.kill()
            tween?.kill()
            anim?.destroy()
          }
        }
        rmm.add('(min-width: 480px)', bindRibbon('desk', { start: 'top top', end: 'bottom bottom', scrub: 0.5 }))
        rmm.add('(max-width: 479px)', bindRibbon('mob', { start: 'top 75%', end: 'bottom 25%', scrub: 0.8 }))
        ribbonCleanup = () => rmm.revert()
      })
      .catch((err) => console.error('[LayingTheFoundation] Lottie failed to load:', err))

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      clearTimeout(settleTimer)
      clearTimeout(resizeTimer)
      window.removeEventListener('load', refreshOwn)
      window.removeEventListener('sah:ready', refreshOwn)
      window.removeEventListener('oc:restored', refreshOwn)
      window.removeEventListener('resize', onResize)
      ribbonCleanup?.()
      ctx.revert()
    }
  }, [])

  return (
    <section ref={rootRef} className={`${styles.section}${className ? ` ${className}` : ''}`}>
      {/* ribbon "line" layer (fixed, behind the cards) */}
      <div className={styles.lottieAssets} aria-hidden="true">
        <div className={`${styles.ribbon} ${styles.isDesk}`} data-ribbon="desk" data-src={`${assetBase}/process-ribbon-desk.json`} />
        <div className={`${styles.ribbon} ${styles.isMob}`} data-ribbon="mob" data-src={`${assetBase}/process-ribbon-mob.json`} />
      </div>

      <div className={styles.paddingGlobal}>
        <div className={styles.containerLarge}>
          <h2 className={`${styles.heading} ${styles.maxWidthLarge}`} data-reveal>
            {heading}
          </h2>

          <div className={styles.track} data-track>
            <div className={styles.sticky}>
              {steps.map((step, i) => (
                <article key={i} className={styles.box} data-card data-tilt={TILTS[i] ?? 0}>
                  <div className={styles.iconWrapper}>
                    <div className={styles.icon}>{step.icon}</div>
                    <div className={styles.stepTag}>{step.tag}</div>
                  </div>
                  <h3 className={styles.cardTitle}>{step.title}</h3>
                  <p className={styles.cardBody}>{step.body}</p>
                  {/* glow + white background sit behind the card content (z-index −1/−2) */}
                  <div className={styles.gradientWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${assetBase}/Group 181.avif`} loading="lazy" alt="" className={styles.gradient} />
                  </div>
                  <div className={styles.whiteBg} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
