'use client'

import { useRef, useState, type PointerEvent } from 'react'
import styles from './HoverImageList.module.css'

export interface HoverImageItem {
  label: string
  meta?: string
  image: string
  href?: string
}

export interface HoverImageListProps {
  items: HoverImageItem[]
  className?: string
}

/**
 * Hover-reveal index list — adapted from offmenu.design's work/index list,
 * where hovering a row reveals a cursor-following image. Converted to React:
 * `useState` for the active row, a ref + pointer math for the follow position,
 * CSS for the cross-fade. Images are Midline's own assets. Falls back to a
 * plain list under prefers-reduced-motion (image hidden).
 */
export default function HoverImageList({ items, className = '' }: HoverImageListProps) {
  const [active, setActive] = useState<number | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current
    const img = imgRef.current
    if (!wrap || !img) return
    const r = wrap.getBoundingClientRect()
    img.style.setProperty('--ix', `${e.clientX - r.left}px`)
    img.style.setProperty('--iy', `${e.clientY - r.top}px`)
  }

  return (
    <div ref={wrapRef} className={`${styles.list} ${className}`} onPointerMove={onMove}>
      <ul className={styles.rows}>
        {items.map((it, i) => {
          const inner = (
            <>
              <span className={styles.label}>{it.label}</span>
              {it.meta && <span className={styles.meta}>{it.meta}</span>}
              <span className={styles.arrow} aria-hidden="true">→</span>
            </>
          )
          const rowProps = {
            className: styles.row,
            'data-active': active === i || undefined,
            onPointerEnter: () => setActive(i),
            onPointerLeave: () => setActive((cur) => (cur === i ? null : cur)),
          }
          return (
            <li key={i}>
              {it.href ? (
                <a href={it.href} {...rowProps}>{inner}</a>
              ) : (
                <div {...rowProps}>{inner}</div>
              )}
            </li>
          )
        })}
      </ul>

      <div ref={imgRef} className={styles.preview} data-show={active !== null || undefined} aria-hidden="true">
        {items.map((it, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={it.image} alt="" className={styles.previewImg} data-show={active === i || undefined} />
        ))}
      </div>
    </div>
  )
}
