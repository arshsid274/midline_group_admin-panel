import styles from './Gallery.module.css'

export interface GalleryItem {
  image: string
  caption?: string
  alt?: string
}

export interface GalleryProps {
  items: GalleryItem[]
  className?: string
}

/**
 * Horizontal scroll-snap gallery — adapted from toyokoh.com's image strip. The
 * original used a JS scroll/drag handler; this uses native CSS scroll-snap
 * (mandatory, x), so it's a presentational component (no hooks) that still
 * supports touch drag, trackpad, and keyboard. Tokens/shadows are Midline's.
 */
export default function Gallery({ items, className = '' }: GalleryProps) {
  return (
    <div className={`${styles.gallery} ${className}`}>
      {items.map((it, i) => (
        <figure key={i} className={styles.slide}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={it.image} alt={it.alt ?? it.caption ?? ''} className={styles.img} loading="lazy" />
          {it.caption && <figcaption className={styles.caption}>{it.caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}
