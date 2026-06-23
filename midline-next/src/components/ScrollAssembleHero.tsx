'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './ScrollAssembleHero.module.css'

/**
 * Cinematic scroll-assemble opener.
 *
 * The slogan "Many Industries Diverse Lands Infinite New Enterprise" spells
 * M-I-D-L-I-N-E through its leading capitals. As the user scrolls, the noise
 * letters drift away and the seven capitals glide together into the MIDLINE
 * wordmark, then the brand tagline resolves in beneath it.
 *
 * Fully self-contained — uses its own CSS module and GSAP timeline, and never
 * touches the existing hero / HeroStats / OrbitalRing components below it.
 */

// Leading capital + the rest of each word. The capitals, in order, spell MIDLINE.
const WORDS = [
  { lead: 'M', rest: 'any,' },
  { lead: 'I', rest: 'ndustries,' },
  { lead: 'D', rest: 'iverse' },
  { lead: 'L', rest: 'ands,' },
  { lead: 'I', rest: 'nfinite' },
  { lead: 'N', rest: 'ew' },
  { lead: 'E', rest: 'nterprise.' },
]

const TARGETS = ['M', 'I', 'D', 'L', 'I', 'N', 'E']

export default function ScrollAssembleHero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    // ── DEBUG INSTRUMENTATION ───────────────────────────────────────────────
    // Logs how many Burlington images / .assemble sections / pin-spacers exist
    // in the DOM at each key moment. On a clean load you should see burlington=1
    // throughout. On the buggy back-navigation you'll see burlington=2 (and a
    // ⚠️ DUPLICATE warning) at whichever stage the second one appears.
    const logState = (label: string) => {
      const burls = document.querySelectorAll('img[src*="burlington"]').length
      const sts = ScrollTrigger.getAll()
      const detached = sts.filter((st) => {
        const t = st.trigger as Element | undefined
        return t ? !t.isConnected : false
      }).length
      const a = document.querySelector(`.${styles.assemble}`) as HTMLElement | null
      const r = a?.getBoundingClientRect()
      const tf = a ? getComputedStyle(a).transform : 'n/a'
      const media = document.querySelector(`.${styles.media}`) as HTMLElement | null
      const mr = media?.getBoundingClientRect()
      const spacer = document.querySelector('.pin-spacer') as HTMLElement | null
      console.log(
        `[SAH] ${label} | burlington=${burls} ST.total=${sts.length} ST.detached=${detached}` +
        ` | assembleTop=${r ? Math.round(r.top) : '?'} assembleBot=${r ? Math.round(r.bottom) : '?'}` +
        ` mediaTop=${mr ? Math.round(mr.top) : '?'} mediaH=${mr ? Math.round(mr.height) : '?'}` +
        ` transform=${tf === 'none' ? 'none' : tf.replace(/matrix3?d?\(/, 'm(').slice(0, 26)}` +
        ` spacerH=${spacer ? Math.round(spacer.offsetHeight) : '-'} docH=${document.documentElement.scrollHeight}` +
        ` scrollY=${Math.round(window.scrollY)}`
      )
    }
    logState('① mount (before sweep)')

    // GSAP's `pin: true` wraps this section in a `.pin-spacer` and reparents it.
    // React doesn't know about that wrapper, so when the home subtree unmounts on
    // navigation (PageTransition re-keys), React can't remove the reparented
    // node and the whole pinned hero is orphaned in the DOM — surfacing as a
    // second, stuck Burlington image after back-navigation. Sweep any stale
    // pin-spacer (one that isn't wrapping THIS freshly-mounted instance) before
    // we build, so only one opener ever exists.
    let sweptSpacers = 0
    document.querySelectorAll<HTMLElement>('.pin-spacer').forEach((sp) => {
      if (!sp.contains(el)) { sp.remove(); sweptSpacers += 1 }
    })
    console.log(`[SAH] orphan sweep removed ${sweptSpacers} stale .pin-spacer`)
    logState('② after sweep')

    // Late checks: catch a duplicate that appears AFTER mount (e.g. once the
    // scroll is restored / the pin re-materialises on back-navigation).
    const debugTimers = [
      window.setTimeout(() => logState('④ +800ms (post-restore)'), 800),
      window.setTimeout(() => logState('⑤ +1800ms (settled)'), 1800),
    ]

    const signalReady = () => {
      ;(window as typeof window & { __sahReady?: boolean }).__sahReady = true
      window.dispatchEvent(new Event('sah:ready'))
    }
    // Mark the opener "not laid out yet" until its pinned timeline has refreshed
    // and the page height (pin-spacer) is final. The carousel waits for the
    // matching `sah:ready` signal before restoring scroll on back-navigation, so
    // it never lands inside the half-built opener and leaves its image on screen.
    ;(window as typeof window & { __sahReady?: boolean }).__sahReady = false

    // Reduced motion: leave the slogan as a clean static hero, no pin/scrub.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      signalReady()
      return () => debugTimers.forEach((t) => clearTimeout(t))
    }

    gsap.registerPlugin(ScrollTrigger)

    // Kill any ScrollTriggers whose trigger element is no longer in the DOM —
    // e.g. the detail route's CompanyElicaStack pins, if their teardown lagged
    // behind the back-navigation. Leftover/detached triggers corrupt the shared
    // ScrollTrigger layout pass and can leave the opener's pin mis-evaluated.
    {
      let killedDetached = 0
      ScrollTrigger.getAll().forEach((st) => {
        const t = st.trigger as Element | undefined
        if (t && !t.isConnected) { st.kill(); killedDetached += 1 }
      })
      console.log(`[SAH] killed ${killedDetached} detached ScrollTrigger(s) before build`)
    }

    // Guards the DEFERRED build (it runs in a fontsReady microtask, i.e. AFTER
    // a possible unmount). React Strict Mode double-invokes effects in dev: run
    // #1 schedules build(), gets torn down (ctx.revert), then its deferred
    // build() fires anyway and creates a ScrollTrigger no longer tracked by the
    // reverted context → leaked trigger → a second stacked pin-spacer → the
    // opener's pin region doubles (ST.total=2, docH ~+4200) → the hero stays
    // on-screen at scroll positions where it should be gone. Skip if destroyed.
    let destroyed = false

    const ctx = gsap.context(() => {
      const keys = Array.from(el.querySelectorAll<HTMLElement>(`.${styles.key}`))
      const rest = Array.from(
        el.querySelectorAll<HTMLElement>(`.${styles.g}:not(.${styles.key})`)
      )
      const targets = Array.from(el.querySelectorAll<HTMLElement>(`.${styles.target}`))
      const subEl = el.querySelector<HTMLElement>(`.${styles.sub}`)
      const stageEl = el.querySelector<HTMLElement>(`.${styles.stage}`)
      const media = el.querySelector<HTMLElement>(`.${styles.media}`)
      const heroTag = el.querySelector<HTMLElement>(`.${styles.heroTag}`)
      const heroStack = el.querySelector<HTMLElement>(`.${styles.heroStack}`)

      let tl: gsap.core.Timeline | null = null

      const build = () => {
        if (destroyed) return // effect torn down (e.g. Strict Mode) — don't leak a trigger
        if (tl) {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
        // Reset so measurements read the resting layout, not a mid-tween state.
        gsap.set([...keys, ...rest], { clearProps: 'all' })

        // Measure each capital's start (in the slogan) and end (its MIDLINE slot).
        const moves = keys.map((k) => {
          const i = Number(k.dataset.i)
          const ks = k.getBoundingClientRect()
          const ts = targets[i].getBoundingClientRect()
          return {
            x: ts.left + ts.width / 2 - (ks.left + ks.width / 2),
            y: ts.top + ts.height / 2 - (ks.top + ks.height / 2),
            scale: ts.height / ks.height,
          }
        })

        tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: '+=4200',
            scrub: 0.6,
            pin: true,
            // PageTransition wraps every page in a framer-motion <motion.div>,
            // which establishes a transform stacking context. Default
            // pinType:'fixed' (position:fixed) then reparents to that
            // transformed ancestor instead of the viewport, so the pinned hero
            // renders in the wrong place and looks "broken/half-built" on
            // back-navigation. pinType:'transform' uses translate3d, which is
            // immune to transformed ancestors. (Same fix CompanyElicaStack uses.)
            pinType: 'transform',
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // 1) noise letters drift up & blur away
        tl.to(
          rest,
          {
            opacity: 0,
            y: -22,
            filter: 'blur(4px)',
            duration: 0.5,
            stagger: { each: 0.004, from: 'random' },
          },
          0
        )
        if (subEl) tl.to(subEl, { opacity: 0, y: -14, duration: 0.4 }, 0)

        // 2) the capitals glide to centre, grow and brighten — locking M→E
        tl.to(
          keys,
          {
            x: (i: number) => moves[i].x,
            y: (i: number) => moves[i].y,
            scale: (i: number) => moves[i].scale,
            color: '#BFE0FF',
            ease: 'power2.inOut',
            duration: 0.7,
            stagger: 0.05,
          },
          0.15
        )

        // 3) the resolved tagline fades in below the assembled wordmark.
        //    y is measured from the centred resting position, so it must clear
        //    half the wordmark's height to avoid overlapping the letters.
        // the tagline + CTAs resolve in together as one stacked block
        if (heroStack) {
          gsap.set(heroStack, { y: 26 })
          tl.to(heroStack, { opacity: 1, y: 0, duration: 0.5 }, 0.8)
        }

        // (the glass pill is visible from the start — see CSS — it only gets
        //  pushed up later with the rest of the hero text)

        // 4) the image banner SLIDES UP from below the fold into the line
        //    position (it never fades in), then grows up to fill the screen,
        //    pushing the wordmark + tagline up and off the top as it rises.
        if (media) {
          const vw = document.documentElement.clientWidth
          const vh = window.innerHeight
          const LINE_VH = 0.72 // banner top sits below the tagline + side-by-side CTAs

          // start fully below the viewport, banner-sized and opaque
          gsap.set(media, {
            xPercent: -50,
            y: vh,
            width: vw * 0.8,
            height: vh * 0.64,
            borderRadius: 14,
            opacity: 1,
          })

          // slide up from the bottom into the line position (during the opening)
          tl.to(media, { y: vh * LINE_VH, ease: 'power2.out', duration: 0.7 }, 0.3)

          // then grow up to fullscreen
          tl.to(
            media,
            { y: 0, width: vw, height: vh, borderRadius: 0, ease: 'power2.inOut', duration: 1.3 },
            1.6
          )

          // the wordmark + tagline + pill + CTAs are pushed up and off the top
          // (not covered): they travel twice as far as the image's top edge, so
          // they always stay just above the rising image.
          const pushers = [stageEl, heroTag, heroStack].filter(Boolean) as HTMLElement[]
          if (pushers.length)
            tl.to(pushers, { y: -vh * 1.4, ease: 'power2.inOut', duration: 1.3 }, 1.6)

          // once the image is fullscreen, the caption overlays rise in from the
          // bottom into their final corners.
          const note = media.querySelector<HTMLElement>(`.${styles.mediaNote}`)
          const chip = media.querySelector<HTMLElement>(`.${styles.mediaChip}`)
          const overlays = [note, chip].filter(Boolean) as HTMLElement[]
          if (overlays.length) gsap.set(overlays, { y: 44, opacity: 0 })
          if (note) tl.to(note, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.4 }, 3.0)
          if (chip) tl.to(chip, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.4 }, 3.12)
        }
      }

      const onRefreshInit = () => build()
      ScrollTrigger.addEventListener('refreshInit', onRefreshInit)

      // Web fonts change glyph widths — measure only after they're ready.
      const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()
      fontsReady.then(() => {
        if (destroyed) return // unmounted before fonts resolved — don't build/leak
        // Establish a clean scroll baseline before measuring/pinning. Returning
        // from a tall, scroll-jacked detail route (CompanyElicaStack pins a lot
        // of scroll height) can leave window.scrollY at a large carried-over
        // value; building + refreshing the pinned opener against that mis-sizes
        // the pin-spacer and leaves the hero stuck half-built. The carousel
        // restores the real scroll position afterwards — it waits for sah:ready,
        // which we dispatch below, so this reset always lands first.
        // (Mirrors the same invariant CompanyElicaStack relies on.)
        // `instant` so this baseline reset doesn't animate (the page has
        // `scroll-behavior: smooth`).
        if (window.scrollY !== 0) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        build()
        ScrollTrigger.refresh()
        signalReady()
        logState('③ after build+refresh+signalReady')
      })

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', onRefreshInit)
        tl?.scrollTrigger?.kill()
        tl?.kill()
      }
    }, root)

    // After the carousel finishes restoring scroll on back-navigation, the
    // instant scroll jump can leave this pinned timeline a step behind (it
    // never received the intermediate scroll events to advance past its end).
    // Re-evaluate the pin at the final scroll position.
    const onRestored = () => {
      console.log('[SAH] oc:restored → ScrollTrigger.refresh()')
      ScrollTrigger.refresh()
    }
    window.addEventListener('oc:restored', onRestored)

    return () => {
      console.log('[SAH] ⑥ unmount → ctx.revert()')
      destroyed = true // block any deferred build() scheduled before unmount
      window.removeEventListener('oc:restored', onRestored)
      debugTimers.forEach((t) => clearTimeout(t))
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={root}
      className={styles.assemble}
      aria-label="Midline — From One Name, many successes are born."
    >
      <div className={styles.stage}>
        <h1 className={styles.slogan} aria-label="Many Industries Diverse Lands Infinite New Enterprise">
          {WORDS.map((w, wi) => (
            <span key={wi} className={styles.word}>
              <span className={`${styles.g} ${styles.key}`} data-i={wi}>
                {w.lead}
              </span>
              {w.rest.split('').map((c, ci) => (
                <span key={ci} className={styles.g}>
                  {c}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p className={styles.sub}>
          Midline Investment LLC is a multi-sector holding group headquartered in Business Bay, Dubai —
          operating 34 companies across aviation, energy, food, construction, and more.
        </p>

        {/* hidden guide: where each capital lands, big & centred */}
        <div className={styles.resolve} aria-hidden="true">
          <div className={styles.mark}>
            {TARGETS.map((c, ti) => (
              <span key={ti} className={styles.target} data-t={ti}>
                {c}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* glass pill imported from the hero */}
      <div className={styles.heroTag}>Dubai · UAE · Global Investment Group</div>

      {/* resolved tagline + CTAs, stacked below the wordmark (never overlap) */}
      <div className={styles.heroStack}>
        <div className={styles.tag}>
          From One Name, many <span className={styles.accent}>successes</span> are born.
        </div>
        <div className={styles.ctas}>
          <Link href="/contact" className="btn-primary">
            Get A Quote
          </Link>
          <Link href="/companies" className="btn-ghost">
            Our Sectors →
          </Link>
        </div>
      </div>

      {/* image banner — anchored at the line, grown to fullscreen by the timeline */}
      <figure className={styles.media}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.mediaImg}
          src="/assets/burlington.jpeg"
          alt="Burlington Tower, Dubai — Midline Investment headquarters"
        />

        {/* overlays that reveal from the bottom once the image is fullscreen */}
        <div className={styles.mediaCopy}>
          <div className={styles.mediaNote}>
            <span>Headquarters</span>
            <strong>Burlington Tower, Dubai</strong>
            <p>Business Bay · Office 410 · Marasi Drive, UAE</p>
          </div>
          <div className={styles.mediaChip}>Est. Dubai · UAE</div>
        </div>
      </figure>
    </section>
  )
}
