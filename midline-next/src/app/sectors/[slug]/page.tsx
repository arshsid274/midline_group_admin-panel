import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MIDLINE_SECTORS } from '@/lib/data'
import { getSectorMedia } from '@/lib/companyContent'
import SectorFlipHero from '@/components/SectorFlipHero'
import CompanyElicaStack from '@/components/CompanyElicaStack'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(MIDLINE_SECTORS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const sector = MIDLINE_SECTORS[slug]
  if (!sector) return {}
  const plainTitle = sector.title.replace(/<[^>]*>/g, '')
  return {
    title: plainTitle,
    description: sector.blurb,
  }
}

export default async function SectorPage({ params }: Props) {
  const { slug } = await params
  const sector = MIDLINE_SECTORS[slug]
  if (!sector) notFound()

  const plainTitle = sector.title.replace(/<[^>]*>/g, '')

  return (
    <>
      <SectorFlipHero
        slug={slug}
        plainTitle={plainTitle}
        blurb={sector.blurb}
        companiesCount={sector.companies.length}
        icon={sector.icon}
        fallbackVideo={getSectorMedia(slug).video}
        fallbackPoster={getSectorMedia(slug).photo}
      />

      <section className="sector-page-shell">
        <div className="sector-page-intro">
          <div>
            <div className="section-label section-label-static">Sector Focus</div>
            <p className="sector-page-copy">{sector.intro}</p>
          </div>
          <div className="sector-page-stat">
            <span>Companies</span>
            <strong>{sector.companies.length}</strong>
          </div>
        </div>
      </section>

      <CompanyElicaStack
        companies={sector.companies}
        sectorTitle={plainTitle}
        totalCompanies={sector.companies.length}
      />
    </>
  )
}
