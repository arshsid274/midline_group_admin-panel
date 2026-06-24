'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './StickyFeature.module.css'

export interface StickyPanel {
  /** Optional step label (e.g. "01"). */
  step?: string
  title: string
  body: string
}

export interface StickyFeatureProps {
  eyebrow?: string
  heading: string
  panels: StickyPanel[]
  className?: string
}

/**
 * Two-column sticky-scroll feature — adapted from toyokoh.com's pinned section
 * (CSS `position: sticky` left column while right-column panels scroll). The
 * active panel is tracked with an `IntersectionObserver` (effect + cleanup) to
 * update a counter and dim inactive panels. Tokens are Midline's. Collapses to
 * a single column on mobile and under reduced motion.
 */
export default function StickyFeature({ eyebrow, heading, panels, className = '' }: StickyFeatureProps) {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const els = Array.from(root.querySelectorAll<HTMLElement>(`.${styles.panel}`))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = els.indexOf(e.target as HTMLElement)
            if (i >= 0) setActive(i)
          }
        })
      },
      { threshold: 0.6 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div ref={ref} className={`${styles.feature} ${className}`}>
      <div className={styles.sticky}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h2 className={styles.heading}>{heading}</h2>
        <div className={styles.counter}>
          {pad(active + 1)} / {pad(panels.length)}
        </div>
      </div>
      <ol className={styles.panels}>
        {panels.map((p, i) => (
          <li key={i} className={styles.panel} data-active={active === i || undefined}>
            {p.step && <span className={styles.step}>{p.step}</span>}
            <h3 className={styles.panelTitle}>{p.title}</h3>
            <p className={styles.panelBody}>{p.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
