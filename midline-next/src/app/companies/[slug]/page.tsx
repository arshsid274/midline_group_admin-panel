import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCompanyBySlug, getAllCompanySlugs } from '@/lib/data'
import { getCompanyContent } from '@/lib/companyContent'
import CompanyInfoPages from '@/components/CompanyInfoPages'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllCompanySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const found = getCompanyBySlug(slug)
  if (!found) return {}
  return {
    title: found.company.name,
    description: found.company.desc,
  }
}

export default async function CompanyInfoRoute({ params }: Props) {
  const { slug } = await params
  const found = getCompanyBySlug(slug)
  if (!found) notFound()

  // For the "For The Best Quality" reveal, prefer the explicit company.video
  // field, then any video found in company.photos[] (e.g. Midline Aviation
  // stores its video in photos[2]), otherwise let the component use its default.
  const videoFromPhotos = found.company.photos?.find((p) => /\.(mp4|mov|webm)$/i.test(p))
  const companyVideo = found.company.video ?? videoFromPhotos
  const companyPoster = found.company.photo ?? found.company.photos?.[0]

  return (
    <CompanyInfoPages
      companyName={found.company.name}
      sectorTitle={found.sectorTitle}
      sectorSlug={found.sectorSlug}
      companySlug={slug}
      logo={found.company.logo}
      companyVideo={companyVideo}
      companyPoster={companyPoster}
      content={getCompanyContent(slug)}
    />
  )
}
