import styles from './BentoGrid.module.css'

export interface BentoItem {
  eyebrow?: string
  title: string
  body?: string
  /** Tile footprint in the grid. */
  span?: 'normal' | 'wide' | 'tall'
  /** Render as a filled navy accent tile. */
  accent?: boolean
}

export interface BentoGridProps {
  items: BentoItem[]
  className?: string
}

/**
 * Asymmetric "bento" feature grid — adapted from terminal-industries.com's
 * tiled feature section. Pure layout (CSS grid with `span` variants), so it's a
 * presentational component (no hooks). Tokens are Midline's; `accent` tiles use
 * the navy gradient with light text.
 */
export default function BentoGrid({ items, className = '' }: BentoGridProps) {
  return (
    <div className={`${styles.bento} ${className}`}>
      {items.map((it, i) => (
        <article key={i} className={styles.tile} data-span={it.span ?? 'normal'} data-accent={it.accent || undefined}>
          {it.eyebrow && <span className={styles.eyebrow}>{it.eyebrow}</span>}
          <h3 className={styles.title}>{it.title}</h3>
          {it.body && <p className={styles.body}>{it.body}</p>}
        </article>
      ))}
    </div>
  )
}
