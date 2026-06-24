import type { CSSProperties } from 'react'
import styles from './Marquee.module.css'

export interface MarqueeProps {
  /** Items rendered in the track; the track is duplicated to loop seamlessly. */
  items: string[]
  /** Seconds for one full loop (lower = faster). */
  durationSec?: number
  /** Reverse the scroll direction. */
  reverse?: boolean
  /** Symbol shown between items (rendered in the gold accent). */
  separator?: string
  className?: string
}

/**
 * Infinite horizontal marquee.
 *
 * Converted from safronhome.com's `.marquee-css` block (`data-css-marquee`
 * list / item structure). Their scroll was driven by a bundled JS helper; here
 * it's reimplemented as a pure CSS keyframe (two identical tracks translated
 * -100%), so no JS or vendor library is needed. Colours/fonts remapped to
 * Midline tokens (Cormorant italic display, navy text, gold separator).
 */
export default function Marquee({
  items,
  durationSec = 40,
  reverse = false,
  separator = '—',
  className = '',
}: MarqueeProps) {
  const Track = ({ aria }: { aria?: boolean }) => (
    <ul className={styles.track} aria-hidden={aria || undefined}>
      {items.map((item, i) => (
        <li key={i} className={styles.item}>
          <span className={styles.label}>{item}</span>
          <span className={styles.sep} aria-hidden="true">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className={`${styles.marquee} ${className}`}
      data-reverse={reverse || undefined}
      style={{ '--marquee-duration': `${durationSec}s` } as CSSProperties}
    >
      <Track />
      <Track aria />
    </div>
  )
}
