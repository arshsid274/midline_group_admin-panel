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

    // Reduced motion: leave the slogan as a clean static hero, no pin/scrub.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

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
            anticipatePin: 1,
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
        build()
        ScrollTrigger.refresh()
      })

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', onRefreshInit)
        tl?.scrollTrigger?.kill()
        tl?.kill()
      }
    }, root)

    return () => ctx.revert()
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
