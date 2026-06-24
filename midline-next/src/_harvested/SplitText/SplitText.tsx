'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import styles from './SplitText.module.css'

export interface SplitTextProps {
  text: string
  /** Split granularity. */
  by?: 'word' | 'char'
  /** Per-unit stagger in ms. */
  staggerMs?: number
  className?: string
}

/**
 * Scroll-reveal split-text — adapted from offmenu.design's heading reveal
 * (each word in an `overflow:hidden` mask, inner span rises in). The original
 * was bundled JS (Splitting/GSAP-style); here it's plain DOM + an
 * `IntersectionObserver` (effect + cleanup), staggered via CSS
 * `transition-delay`. Renders an inline `<span>` — wrap it in your heading.
 * Reduced motion → shown immediately.
 */
export default function SplitText({ text, by = 'word', staggerMs = 40, className = '' }: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add(styles.shown)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add(styles.shown)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const units = by === 'char' ? Array.from(text) : text.split(' ')

  return (
    <span
      ref={ref}
      className={`${styles.split} ${className}`}
      aria-label={text}
      style={{ '--stagger': `${staggerMs}ms` } as CSSProperties}
    >
      {units.map((u, i) => (
        <span key={i} className={styles.mask} aria-hidden="true">
          <span className={styles.unit} style={{ transitionDelay: `calc(${i} * var(--stagger))` }}>
            {by === 'word' ? `${u} ` : u}
          </span>
        </span>
      ))}
    </span>
  )
}
