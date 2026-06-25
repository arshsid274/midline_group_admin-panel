'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MIDLINE_SECTORS } from '@/lib/data'
import styles from './OrbitalCarousel.module.css'

const sectorSlug = (href?: string) => (href ? href.split('/').filter(Boolean).pop() ?? '' : '')

export interface OrbitalItem {
  /** Label shown in the title-stack. */
  title: string
  /** Tile fill — any CSS background (solid, gradient, or `url(...)`). */
  background?: string
  /** Route opened on select (e.g. `/carousel/aviation`). */
  href?: string
}

export interface OrbitalCarouselProps {
  items?: OrbitalItem[]
  /** Centre intro title (word-by-word reveal). Use "|" to break into two lines;
   *  the second line renders in the sky-italic accent. */
  intro?: string
  /** Mono eyebrow above the intro title (e.g. "34 Companies · 8 Sectors"). */
  eyebrow?: string
  /** Fired when an item is selected (just before navigating). */
  onSelect?: (item: OrbitalItem, index: number) => void
  className?: string
}

const PLACEHOLDER_ITEMS: OrbitalItem[] = [
  { title: 'Project One',   background: 'linear-gradient(135deg,#3B6FE0,#7AA7FF)' },
  { title: 'Project Two',   background: 'linear-gradient(135deg,#E0683B,#FFB07A)' },
  { title: 'Project Three', background: 'linear-gradient(135deg,#1FA66A,#7AE0B0)' },
  { title: 'Project Four',  background: 'linear-gradient(135deg,#B07CC6,#E0B0FF)' },
  { title: 'Project Five',  background: 'linear-gradient(135deg,#E0A21E,#FFD77A)' },
  { title: 'Project Six',   background: 'linear-gradient(135deg,#3E8F94,#7ACBD0)' },
  { title: 'Project Seven', background: 'linear-gradient(135deg,#C0556A,#FF9AAE)' },
  { title: 'Project Eight', background: 'linear-gradient(135deg,#6C7B8A,#AFC0CF)' },
]

const ARROW_PREV =
  'M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8Z'
const ARROW_NEXT =
  'm221.66 133.66-72 72a8 8 0 0 1-11.32-11.32L196.69 136H40a8 8 0 0 1 0-16h156.69l-58.35-58.34a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32Z'

export default function OrbitalCarousel({
  items = PLACEHOLDER_ITEMS,
  intro = 'Your headline goes here — replace this placeholder copy with your own.',
  eyebrow,
  onSelect,
  className = '',
}: OrbitalCarouselProps) {
  const rootRef = useRef<HTMLElement>(null)
  const router = useRouter()
  const navigatingRef = useRef(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    // clear any transition clone left over from navigating to a detail route
    document.querySelectorAll(`.${styles.clone}`).forEach((n) => n.remove())
    navigatingRef.current = false

    // Restore the home scroll position when returning from a detail route.
    // This page is very tall and its height is established asynchronously
    // (GSAP-pinned opener + a 1000vh carousel), so the browser's own scroll
    // restoration fires before the height exists and lands in the wrong place.
    // We wait for the opener to signal its pinned timeline has refreshed (so the
    // pin-spacer — and therefore the final page height — exists), then hold the
    // saved position for a few frames to beat any late automatic restore.
    // Without this gate the restore can land inside the half-built opener and
    // leave its hero image stuck on screen.
    try {
      const saved = sessionStorage.getItem('oc-return-scroll')
      if (saved !== null) {
        sessionStorage.removeItem('oc-return-scroll')
        const y = parseInt(saved, 10) || 0
        if (y > 0) {
          let frames = 0
          let held = 0
          const restore = () => {
            frames += 1
            const maxY = document.documentElement.scrollHeight - window.innerHeight
            if (maxY >= y - 2) {
              // `instant` bypasses the page's `scroll-behavior: smooth`; without
              // it the restore ANIMATES from the top up through the pinned hero
              // (looking like a stuck/duplicate Burlington image) and drifts.
              window.scrollTo({ top: y, left: 0, behavior: 'instant' })
              held += 1
            }
            if (held < 12 && frames < 150) {
              requestAnimationFrame(restore)
            } else {
              // Tell the pinned opener the scroll has landed at its final spot,
              // so it can ScrollTrigger.refresh() — the instant jump skipped the
              // scroll events its pin needed to advance past its end, leaving the
              // hero rendered at the wrong scroll position.
              window.dispatchEvent(new Event('oc:restored'))
            }
          }
          // Don't restore until the pinned opener reports its layout is final.
          const w = window as typeof window & { __sahReady?: boolean }
          let started = false
          const begin = () => {
            if (started) return
            started = true
            window.removeEventListener('sah:ready', begin)
            requestAnimationFrame(restore)
          }
          if (w.__sahReady) begin()
          else {
            window.addEventListener('sah:ready', begin)
            window.setTimeout(begin, 1500) // fallback if the opener never signals
          }
        }
      }
    } catch {
      /* sessionStorage unavailable — skip restore */
    }

    const q = <T extends Element>(s: string) => root.querySelector<T>(s)
    const qa = <T extends Element>(s: string) => Array.from(root.querySelectorAll<T>(s))

    const sphere = q<HTMLElement>(`.${styles.sphere}`)
    const overlay = q<HTMLElement>(`.${styles.overlay}`)
    const dotOrbit = q<HTMLElement>(`.${styles.dots}`)
    const itemEls = qa<HTMLElement>(`.${styles.item}`)
    const titleEls = qa<HTMLElement>('[data-title]')
    const dotEls = qa<HTMLElement>('[data-dot]')
    const wordEls = qa<HTMLElement>(`.${styles.intro} i`)
    const prev = q<HTMLElement>(`.${styles.prev}`)
    const next = q<HTMLElement>(`.${styles.next}`)

    const count = items.length
    const step = (Math.PI * 2) / count
    const frameStep = 1 / 120
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)
    const smootherStep = (t: number) => t * t * t * (t * (6 * t - 15) + 10)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let targetRotation = 0
    let targetTiltY = -0.6
    let targetTiltX = 0.5236
    let zoomTarget = 0
    let zoom = 0
    let progress = 0
    let focused = 0
    let focusSmooth = 0
    let previous = -1
    let rotationSpring = { value: 0, velocity: 0 }
    let tiltYSpring = { value: -0.6, velocity: 0 }
    let tiltXSpring = { value: 0.5236, velocity: 0 }
    let hoverIndex = -1
    let lastTime = performance.now()
    const introStart = performance.now()
    let rafId = 0
    let destroyed = false
    // when we mount mid-carousel (e.g. returning from a detail route) we snap to
    // the scroll position instead of spinning/playing the intro from zero.
    let startedScrolled = false
    let lastProgress = -1

    wordEls.forEach((w, i) => w.style.setProperty('--word-index', String(i)))

    const wrap = (v: number) => ((v % count) + count) % count

    const interpolate = (value: number, input: number[], output: number[]) => {
      if (value <= input[0]) return output[0]
      for (let i = 1; i < input.length; i += 1) {
        if (value <= input[i]) {
          const local = (value - input[i - 1]) / (input[i] - input[i - 1])
          return output[i - 1] + (output[i] - output[i - 1]) * local
        }
      }
      return output[output.length - 1]
    }

    const spring = (
      state: { value: number; velocity: number },
      target: number,
      stiffness: number,
      damping: number,
      mass: number,
      dt: number
    ) => {
      const displacement = state.value - target
      const force = -stiffness * displacement - damping * state.velocity
      const velocity = state.velocity + (force / mass) * dt
      return { value: state.value + velocity * dt, velocity }
    }

    const setTargets = () => {
      const range = (root.offsetHeight || window.innerHeight) - window.innerHeight
      progress = Math.min(1, Math.max(0, (window.scrollY - root.offsetTop) / (range || 1)))
      targetRotation =
        progress <= 0.2
          ? -((progress / 0.2) * Math.PI * 2)
          : // map the scroll to indices 0 … count-1 so the rotation stops on the
            // final sector instead of looping back to the first.
            -(Math.PI * 2) - Math.round(((progress - 0.2) / 0.8) * (count - 1)) * step
      targetTiltY = interpolate(progress, [0, 0.2, 1], [-0.6, 0, 0])
      targetTiltX = interpolate(progress, [0, 0.2, 1], [0.5236, 0, 0])
      zoomTarget = progress >= 0.2 ? 1 : 0
    }

    const setTitle = (nextFocused: number) => {
      if (nextFocused === previous) return
      const old = previous
      const initial = old === -1
      let flow: 'up' | 'down' = 'down'
      if (!initial) {
        const delta = nextFocused - old
        flow = Math.abs(delta) > count / 2 ? (delta > 0 ? 'up' : 'down') : delta > 0 ? 'down' : 'up'
      }
      previous = nextFocused
      titleEls.forEach((title, index) => {
        title.classList.remove(styles.active, styles.exitUp, styles.exitDown)
        if (index === nextFocused) {
          title.style.transitionDuration = initial ? '0ms' : ''
          title.style.transform = initial ? 'translateY(0)' : `translateY(${flow === 'down' ? '110%' : '-110%'})`
          title.style.opacity = initial ? '1' : '0'
          requestAnimationFrame(() => {
            title.style.transitionDuration = ''
            title.classList.add(styles.active)
            title.style.transform = ''
            title.style.opacity = ''
          })
        } else if (index === old && !initial) {
          title.classList.add(flow === 'down' ? styles.exitUp : styles.exitDown)
        } else {
          title.style.transform = index < nextFocused ? 'translateY(-110%)' : 'translateY(110%)'
          title.style.opacity = '0'
        }
      })
    }

    const render = () => {
      if (destroyed) return
      const now = performance.now()
      let dt = Math.min(Math.max(0, (now - lastTime) / 1000), 0.1)
      lastTime = now
      setTargets()

      // A big single-frame jump in progress means the scroll was set
      // programmatically — almost always the browser restoring the scroll
      // position when returning from a detail route. Snap the springs to the new
      // target so the orbit settles instantly instead of spinning to catch up.
      // (This also catches the case where the restore lands a few frames after
      // mount, which the one-shot mount snap can miss.)
      if (lastProgress >= 0 && Math.abs(progress - lastProgress) > 0.1) {
        rotationSpring = { value: targetRotation, velocity: 0 }
        tiltYSpring = { value: targetTiltY, velocity: 0 }
        tiltXSpring = { value: targetTiltX, velocity: 0 }
        zoom = zoomTarget
        focusSmooth = wrap(Math.round(wrap(-targetRotation / step)))
      }
      lastProgress = progress
      if (progress > 0.01) startedScrolled = true

      while (dt > 0) {
        const chunk = Math.min(dt, frameStep)
        rotationSpring = spring(rotationSpring, targetRotation, 60, 25, 0.8, chunk)
        tiltYSpring = spring(tiltYSpring, targetTiltY, 100, 30, 0.5, chunk)
        tiltXSpring = spring(tiltXSpring, targetTiltX, 100, 30, 0.5, chunk)
        zoom += (zoomTarget - zoom) * Math.min(1, (chunk / 1.5) * 4)
        dt -= chunk
      }

      const introElapsed = Math.min((now - introStart) / 3000, 1)
      const introRotation = reduce || startedScrolled ? 0 : Math.PI * (1 - easeOut(introElapsed))
      const rotation = rotationSpring.value + introRotation
      const tiltY = Math.max(-0.75, Math.min(0.75, tiltYSpring.value))
      const tiltX = Math.max(-0.75, Math.min(0.75, tiltXSpring.value))

      sphere?.style.setProperty('--rotation-deg', `${(rotation * 180) / Math.PI}deg`)
      sphere?.style.setProperty('--container-scale', `${0.5 + 0.5 * zoom}`)
      sphere?.style.setProperty('--zoom-offset', `calc(${zoom} * var(--orbit-radius))`)
      sphere?.style.setProperty('--tilt-offset-x', `${5 * tiltX}%`)
      sphere?.style.setProperty('--tilt-offset-y', `${-(5 * tiltY)}%`)
      sphere?.style.setProperty('--zoom', `${zoom}`)
      sphere?.style.setProperty('--sphere-size-scale', `${0.6 + 0.4 * zoom}`)

      focused = Math.round(wrap(-rotation / step)) % count
      let focusDelta = focused - focusSmooth
      if (Math.abs(focusDelta) > count / 2) focusDelta += focusDelta > 0 ? -count : count
      focusSmooth = wrap(focusSmooth + 0.05 * focusDelta)
      setTitle(focused)

      const half = count / 2
      itemEls.forEach((item, index) => {
        let distance = Math.abs(index - focusSmooth)
        if (distance > half) distance = count - distance
        const a = Math.min(distance, 1)
        const u = 1.5 + 0.5 * zoom
        const curveScale = u - smootherStep(a) * (u - 1)

        const angle = (index / count) * Math.PI * 2 + rotation + Math.PI
        let posX = Math.cos(angle)
        let posY = Math.sin(angle)
        let posZ = 0

        const cosX = Math.cos(tiltX)
        const sinX = Math.sin(tiltX)
        posX = posX * cosX
        posZ = -Math.cos(angle) * sinX

        const cosY = Math.cos(tiltY)
        const sinY = Math.sin(tiltY)
        const rotatedY = posY * cosY - posZ * sinY
        posZ = posY * sinY + posZ * cosY
        posY = rotatedY

        const depthScale = 1 + 0.1 * posZ
        const hoverTarget = hoverIndex === index ? 1.1 : 1
        const currentHover =
          Number(item.dataset.hoverScale || '1') + (hoverTarget - Number(item.dataset.hoverScale || '1')) * 0.15
        item.dataset.hoverScale = currentHover.toString()

        item.style.setProperty('--pos-x', posX.toString())
        item.style.setProperty('--pos-y', (-posY).toString())
        item.style.setProperty('--scale', (curveScale * depthScale * currentHover).toString())
        // front-facing tiles render at full opacity; back of the orbit fades.
        const baseOpacity = Math.min(1, 0.55 + Math.max(0, posZ + 1) * 0.45)
        // on the final sector, fade non-focused tiles so none peek in at the end.
        const endFade = Math.min(1, Math.max(0, (progress - 0.95) / 0.05))
        const itemOpacity = index === focused ? baseOpacity : baseOpacity * (1 - endFade)
        item.style.setProperty('--item-opacity', itemOpacity.toString())
        item.style.setProperty('--z-index', String(Math.round((posZ + 1) * 100)))
        item.style.setProperty('--pointer', progress >= 0.18 ? 'auto' : 'none')
        item.style.setProperty('--intro-index', String(index))
        item.classList.toggle(styles.active, index === focused)
        if (!reduce) item.classList.add(styles.entering)
      })

      const overlayVisible = progress >= 0.2
      if (overlay) overlay.style.opacity = overlayVisible ? '1' : '0'
      if (dotOrbit) dotOrbit.style.opacity = overlayVisible ? '1' : '0'
      wordEls.forEach((word, index) => {
        const showWords = progress < 0.15
        word.style.transitionDelay = showWords ? `${0.5 + index * 0.03}s` : `${(wordEls.length - index) * 0.02}s`
        word.style.transform = showWords ? 'translateY(0)' : 'translateY(115%)'
      })

      dotEls.forEach((dot, index) => {
        const dotAngle = (index / count) * Math.PI * 2 + rotationSpring.value + introRotation * 0.5 + Math.PI
        dot.style.transform = `translate(${18 * Math.cos(dotAngle)}px, ${-(18 * Math.sin(dotAngle))}px)`
        dot.style.width = '5px'
        dot.style.height = '5px'
        dot.style.marginLeft = '-2.5px'
        dot.style.marginTop = '-2.5px'
        dot.style.opacity = index === focused ? '1' : '0.4'
        dot.style.backgroundColor = index === focused ? 'currentColor' : 'transparent'
        dot.style.border = index === focused ? 'none' : '1px solid currentColor'
      })

      rafId = requestAnimationFrame(render)
    }

    const go = (nextIndex: number) => {
      const destination = wrap(nextIndex) / count
      const top = root.offsetTop + (0.8 * destination + 0.2) * (root.offsetHeight || window.innerHeight)
      window.scrollTo({ top, behavior: 'smooth' })
    }

    const onPrev = () => go(focused - 1)
    const onNext = () => go(focused + 1)
    prev?.addEventListener('click', onPrev)
    next?.addEventListener('click', onNext)

    const cleanups: Array<() => void> = []
    itemEls.forEach((item, index) => {
      const enter = () => (hoverIndex = index)
      const leave = () => hoverIndex === index && (hoverIndex = -1)
      const click = (e: MouseEvent) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        if (navigatingRef.current) return
        const slug = sectorSlug(items[index].href)
        if (!slug || !MIDLINE_SECTORS[slug]) return
        navigatingRef.current = true
        // remember where we were so we can restore it when the user comes back
        try {
          sessionStorage.setItem('oc-return-scroll', String(window.scrollY))
        } catch {
          /* ignore */
        }
        onSelect?.(items[index], index)

        // square-wipe lead-out: the tile image expands from its position to a
        // fullscreen card, covering the page while we route to the detail page.
        const visual = item.querySelector<HTMLElement>(`.${styles.visual}`)
        const rect = item.getBoundingClientRect()
        const clone = document.createElement('div')
        clone.className = styles.clone
        clone.style.left = `${rect.left}px`
        clone.style.top = `${rect.top}px`
        clone.style.width = `${rect.width}px`
        clone.style.height = `${rect.height}px`
        if (visual) {
          const vs = getComputedStyle(visual)
          clone.style.backgroundImage = vs.backgroundImage
          clone.style.backgroundSize = 'cover'
          clone.style.backgroundPosition = 'center'
        }
        document.body.appendChild(clone)
        requestAnimationFrame(() => {
          clone.style.left = '0px'
          clone.style.top = '0px'
          clone.style.width = '100vw'
          clone.style.height = '100svh'
          clone.style.borderRadius = '0px'
        })

        window.setTimeout(() => router.push(`/carousel/${slug}`), 600)
      }
      item.addEventListener('mouseenter', enter)
      item.addEventListener('mouseleave', leave)
      item.addEventListener('click', click)
      cleanups.push(() => {
        item.removeEventListener('mouseenter', enter)
        item.removeEventListener('mouseleave', leave)
        item.removeEventListener('click', click)
      })
    })

    // clear any leftover transition clone (e.g. on bfcache restore / back nav)
    const onPageShow = () => {
      navigatingRef.current = false
      document.querySelectorAll(`.${styles.clone}`).forEach((n) => n.remove())
    }
    window.addEventListener('pageshow', onPageShow)

    setTargets()
    // snap the springs to the current scroll target so a remount mid-carousel
    // (returning from a detail route) settles instantly instead of spinning up
    // from zero. A fresh top-of-page load keeps progress ~0, so this is a no-op
    // there and the intro still plays.
    startedScrolled = progress > 0.01
    if (startedScrolled) {
      rotationSpring.value = targetRotation
      tiltYSpring.value = targetTiltY
      tiltXSpring.value = targetTiltX
      zoom = zoomTarget
      focusSmooth = wrap(Math.round(wrap(-targetRotation / step)))
      focused = focusSmooth % count
    }
    rafId = requestAnimationFrame(render)

    return () => {
      destroyed = true
      if (rafId) cancelAnimationFrame(rafId)
      prev?.removeEventListener('click', onPrev)
      next?.removeEventListener('click', onNext)
      window.removeEventListener('pageshow', onPageShow)
      cleanups.forEach((fn) => fn())
      document.querySelectorAll(`.${styles.clone}`).forEach((n) => n.remove())
    }
  }, [items, intro, onSelect, router])

  return (
    <section ref={rootRef} className={`${styles.root} ${className}`}>
      <div className={styles.sticky}>
        <div className={styles.sphereWrap}>
          <div className={styles.sphere}>
            {items.map((it, i) => (
              <button key={i} type="button" className={styles.item} data-index={i} aria-label={it.title}>
                <span className={styles.visual} style={{ backgroundImage: it.background }} />
              </button>
            ))}
          </div>
        </div>

        <div
          className={styles.intro}
          role="heading"
          aria-level={2}
          aria-label={intro.replace(/\|/g, ' ')}
        >
          {eyebrow && (
            <div className={styles.eyebrowRow}>
              <span>
                <i className={styles.eyebrowWord}>{eyebrow}</i>
              </span>
            </div>
          )}
          {intro.split('|').map((line, li) => (
            <div key={li} className={styles.titleRow}>
              {line.trim().split(' ').map((word, wi) => (
                <span key={wi}>
                  <i className={li > 0 ? styles.accentWord : undefined}>{word}&nbsp;</i>
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.overlay}>
          <button type="button" className={`${styles.arrow} ${styles.prev}`} aria-label="Previous">
            <svg viewBox="0 0 256 256" aria-hidden="true"><path d={ARROW_PREV} /></svg>
          </button>
          <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Next">
            <svg viewBox="0 0 256 256" aria-hidden="true"><path d={ARROW_NEXT} /></svg>
          </button>
          <div className={styles.titles} aria-live="polite">
            {items.map((it, i) => (
              <h2 key={i} data-title={i}>{it.title}</h2>
            ))}
          </div>
        </div>

        <div className={styles.dots} aria-hidden="true">
          {items.map((_, i) => (
            <span key={i} data-dot={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
