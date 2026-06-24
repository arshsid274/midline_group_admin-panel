'use client'

import { useState } from 'react'
import styles from './FaqAccordion.module.css'

export interface FaqItem {
  /** Short category label (mono eyebrow). */
  eyebrow?: string
  /** The question (accordion trigger). */
  q: string
  /** The answer (revealed panel). */
  a: string
}

export interface FaqAccordionProps {
  items: FaqItem[]
  /** Allow several panels open at once (default: single-open). */
  allowMultiple?: boolean
  className?: string
}

/**
 * Accessible FAQ accordion.
 *
 * Behaviour adapted from safronhome.com's `.faqs-accordion` (`data-trigger`),
 * whose open/close + scroll markers were driven by a bundled GSAP script. That
 * bundle is not portable, so the accordion is rebuilt from scratch in React:
 * `useState` for open indices, real `<button>` triggers with `aria-expanded`,
 * and a CSS `grid-template-rows: 0fr → 1fr` reveal (no JS height measurement).
 * Colours/fonts use Midline tokens.
 */
export default function FaqAccordion({ items, allowMultiple = false, className = '' }: FaqAccordionProps) {
  const [open, setOpen] = useState<number[]>([])
  const toggle = (i: number) =>
    setOpen((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : allowMultiple ? [...prev, i] : [i]
    )

  return (
    <div className={`${styles.accordion} ${className}`}>
      {items.map((item, i) => {
        const expanded = open.includes(i)
        return (
          <div key={i} className={styles.item} data-open={expanded || undefined}>
            <h3 className={styles.heading}>
              <button
                type="button"
                className={styles.trigger}
                aria-expanded={expanded}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                onClick={() => toggle(i)}
              >
                {item.eyebrow && <span className={styles.eyebrow}>{item.eyebrow}</span>}
                <span className={styles.q}>{item.q}</span>
                <span className={styles.icon} aria-hidden="true" />
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-trigger-${i}`}
              className={styles.panel}
            >
              <div className={styles.panelInner}>
                <p className={styles.a}>{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
