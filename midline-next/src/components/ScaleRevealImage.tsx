'use client'

import { useEffect, useRef } from 'react'

/**
 * ScaleRevealImage
 *
 * Scroll-driven image reveal: the image starts as a wide rounded banner anchored
 * in the LOWER part of the viewport (so it sits below a title, like the
 * reference), then grows — rising and widening — until it fills the whole
 * screen, with its corners squaring off.
 *
 * Width/height are animated (not transform:scale) so `object-fit: cover` re-fits
 * the image undistorted at every size and the rounded corners stay circular.
 * The vertical position is animated with translateY.
 */

export interface ScaleRevealImageProps {
  /** 1x desktop image (served from /public). */
  srcDesktop: string
  /** 2x desktop image for retina. Optional. */
  srcDesktop2x?: string
  /** 1x mobile (portrait) image, used below 821px. Optional. */
  srcMobile?: string
  /** 2x mobile image for retina. Optional. */
  srcMobile2x?: string
  alt?: string
  /** Scroll distance of the pinned grow, in vh. Larger = slower. Default 300. */
  sectionVh?: number
  /** Start width as % of the viewport width (the banner). Default 80. */
  startW?: number
  /** Start height as % of the viewport height. Default 64. */
  startH?: number
  /** Where the banner's TOP sits at the start, as % of viewport height. Default 58. */
  startTopVh?: number
  /** Corner radius (px) at the start; eases to 0 at fullscreen. Default 14. */
  startRadius?: number
  /** Background of the stage behind the banner. Default light grey. */
  bgClassName?: string
  /** Extra classes for the outer section. */
  className?: string
}

export default function ScaleRevealImage({
  srcDesktop,
  srcDesktop2x,
  srcMobile,
  srcMobile2x,
  alt = '',
  sectionVh = 300,
  startW = 80,
  startH = 64,
  startTopVh = 58,
  startRadius = 14,
  bgClassName = 'bg-[#f1f3f5]',
  className = '',
}: ScaleRevealImageProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const frame = frameRef.current
    if (!section || !frame) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // accessible fallback: hold the image fullscreen, no pin/scrub
      frame.style.width = '100vw'
      frame.style.height = '100vh'
      frame.style.borderRadius = '0px'
      frame.style.transform = 'translateX(-50%) translateY(0px)'
      return
    }

    let sectionTop = 0
    let range = 1
    let ticking = false
    let listening = false
    let rafId = 0

    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 // easeInOutCubic
    const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const absTop = (el: HTMLElement | null) => {
      let y = 0
      let node: HTMLElement | null = el
      while (node) {
        y += node.offsetTop
        node = node.offsetParent as HTMLElement | null
      }
      return y
    }

    const render = () => {
      const vw = document.documentElement.clientWidth
      const vh = window.innerHeight
      const p = clamp((window.scrollY - sectionTop) / range, 0, 1)
      const e = ease(p)

      const w = lerp((startW / 100) * vw, vw, e)
      const h = lerp((startH / 100) * vh, vh, e)
      const top = lerp((startTopVh / 100) * vh, 0, e) // banner top: low → 0 (fullscreen)
      const r = startRadius * (1 - e)

      frame.style.width = `${w}px`
      frame.style.height = `${h}px`
      frame.style.borderRadius = `${r}px`
      frame.style.transform = `translateX(-50%) translateY(${top}px)`
    }

    const measure = () => {
      sectionTop = absTop(section)
      range = section.offsetHeight - window.innerHeight
      if (range < 1) range = 1
      render()
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        rafId = requestAnimationFrame(() => {
          render()
          ticking = false
        })
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!listening) {
              listening = true
              window.addEventListener('scroll', onScroll, { passive: true })
            }
          } else if (listening) {
            listening = false
            window.removeEventListener('scroll', onScroll)
          }
        })
      },
      { threshold: 0 }
    )

    measure()
    io.observe(section)
    window.addEventListener('resize', measure, { passive: true })
    window.addEventListener('load', measure)

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [sectionVh, startW, startH, startTopVh, startRadius])

  return (
    <section
      ref={sectionRef}
      className={`relative ${bgClassName} ${className}`}
      style={{ height: `${sectionVh}vh` }}
    >
      <div
        className={`relative sticky top-0 h-screen overflow-hidden ${bgClassName} [height:100svh]`}
      >
        <figure
          ref={frameRef}
          className="absolute left-1/2 top-0 overflow-hidden shadow-[0_24px_70px_rgba(26,28,34,0.16)]"
          style={{
            width: `${startW}vw`,
            height: `${startH}vh`,
            transform: `translateX(-50%) translateY(${startTopVh}vh)`,
            borderRadius: `${startRadius}px`,
            willChange: 'width, height, transform, border-radius',
          }}
        >
          <picture>
            {srcMobile && (
              <source
                srcSet={`${srcMobile} 1x${srcMobile2x ? `, ${srcMobile2x} 2x` : ''}`}
                media="(max-width: 820.98px)"
              />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="block h-full w-full object-cover object-center"
              src={srcDesktop}
              srcSet={`${srcDesktop} 1x${srcDesktop2x ? `, ${srcDesktop2x} 2x` : ''}`}
              alt={alt}
            />
          </picture>
        </figure>
      </div>
    </section>
  )
}
