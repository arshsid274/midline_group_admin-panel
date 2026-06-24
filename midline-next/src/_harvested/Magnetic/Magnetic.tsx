'use client'

import { useRef, type ReactNode, type PointerEvent } from 'react'
import styles from './Magnetic.module.css'

export interface MagneticProps {
  children: ReactNode
  /** Max pull in px toward the cursor. */
  strength?: number
  className?: string
}

/**
 * Magnetic hover wrapper — adapted from lusion.co's pointer-tracked button
 * interaction. Wrap any CTA: the element eases toward the cursor on hover and
 * springs back on leave. Pure pointer events + a CSS transition (no GSAP).
 * Disabled under prefers-reduced-motion.
 */
export default function Magnetic({ children, strength = 18, className = '' }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    const mx = ((e.clientX - (r.left + r.width / 2)) / r.width) * strength * 2
    const my = ((e.clientY - (r.top + r.height / 2)) / r.height) * strength * 2
    el.style.setProperty('--mx', `${mx}px`)
    el.style.setProperty('--my', `${my}px`)
  }
  const reset = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mx', '0px')
    el.style.setProperty('--my', '0px')
  }

  return (
    <span ref={ref} className={`${styles.magnetic} ${className}`} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </span>
  )
}
