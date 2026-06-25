import Link from 'next/link'
import styles from './SectorShowcase.module.css'

export interface SectorShowcaseItem {
  href: string
  number: string
  name: string
  thumbnailSrc: string
  thumbnailAlt?: string
  description: string
  /** Small meta line (e.g. company count or markets). */
  meta?: string
  readMoreLabel?: string
}

export interface SectorShowcaseProps {
  items: SectorShowcaseItem[]
  className?: string
}

/**
 * Sector showcase — converted from toyokoh.com's "Our Business" product grid
 * (numbered card → thumbnail → logo/name → description → read-more, with a
 * full-card overlay link). Rebuilt for Midline: dark Japanese theme + Cabinet
 * Grotesk + Tailwind arbitrary values → Midline tokens (light card, navy
 * Cormorant name, mono meta, gold number) in a scoped CSS module. Content is
 * Midline's sectors; the brand-logo image becomes the sector name in serif.
 */
export default function SectorShowcase({ items, className = '' }: SectorShowcaseProps) {
  return (
    <div className={`${styles.grid} ${className}`}>
      {items.map((it) => (
        <article key={it.href} className={styles.card}>
          <Link href={it.href} aria-label={`${it.name} — view sector`} className={styles.overlay} />
          <span className={styles.number}>{it.number}</span>
          <div className={styles.thumb}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={it.thumbnailSrc}
              alt={it.thumbnailAlt ?? ''}
              loading="lazy"
              className={styles.thumbImg}
            />
          </div>
          <h3 className={styles.name}>{it.name}</h3>
          {it.meta && <span className={styles.meta}>{it.meta}</span>}
          <p className={styles.desc}>{it.description}</p>
          <span className={styles.readMore}>{it.readMoreLabel ?? 'Read more'} →</span>
        </article>
      ))}
    </div>
  )
}
