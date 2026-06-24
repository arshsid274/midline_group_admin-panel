'use client'

import { useEffect, useRef } from 'react'
import styles from './Timeline.module.css'

export interface TimelineItem {
  /** Short marker (mono eyebrow) — a label, phase, or confirmed year. */
  marker: string
  title: string
  body?: string
}

export interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

/**
 * Vertical milestone timeline — adapted from ssyenc.com's company-history /
 * group section. Converted to React: the original scroll-reveal (jQuery/scroll
 * handler) is replaced with an `IntersectionObserver` created in an effect and
 * `disconnect()`-ed in cleanup. Tokens are Midline's; markers use the gold
 * accent. Reduced motion → all items shown immediately.
 */
export default function Timeline({ items, className = '' }: TimelineProps) {
  const ref = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const els = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.item}`))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add(styles.shown))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.shown)
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <ol ref={ref} className={`${styles.timeline} ${className}`}>
      {items.map((it, i) => (
        <li key={i} className={styles.item}>
          <span className={styles.marker}>{it.marker}</span>
          <h3 className={styles.title}>{it.title}</h3>
          {it.body && <p className={styles.body}>{it.body}</p>}
        </li>
      ))}
    </ol>
  )
}
