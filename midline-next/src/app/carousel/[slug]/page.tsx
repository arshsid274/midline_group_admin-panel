import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MIDLINE_SECTORS } from '@/lib/data'
import { getSectorMedia } from '@/lib/companyContent'
import CompanyElicaStack from '@/components/CompanyElicaStack'
import CarouselDetailShell from './CarouselDetailShell'
import styles from './carousel-detail.module.css'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return Object.keys(MIDLINE_SECTORS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const sector = MIDLINE_SECTORS[slug]
  if (!sector) return {}
  const title = sector.title.replace(/<[^>]*>/g, '')
  return { title, description: sector.blurb }
}

export default async function CarouselDetailPage({ params }: Props) {
  const { slug } = await params
  const sector = MIDLINE_SECTORS[slug]
  if (!sector) notFound()

  const media = getSectorMedia(slug)
  const title = sector.title.replace(/<[^>]*>/g, '')

  return (
    <CarouselDetailShell>
      <div className={styles.hero}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          className={styles.video}
          src={media.video}
          poster={media.photo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>{sector.icon} Sector</span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.blurb}>{sector.blurb}</p>
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.intro}>{sector.intro}</p>
      </div>

      {/* Rich stacked company cards — same component (and mapping) the sectors
          route uses, migrated in as-is. */}
      <CompanyElicaStack
        companies={sector.companies}
        sectorTitle={title}
        totalCompanies={sector.companies.length}
      />
    </CarouselDetailShell>
  )
}
