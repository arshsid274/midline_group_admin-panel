import type { Metadata } from 'next'
import { MIDLINE_SECTORS } from '@/lib/data'
import SectorCard from '@/components/SectorCard'
import TreeSection from '@/components/TreeSection'
import RevealOnScroll from '@/components/RevealOnScroll'
import HoverImageList from '@/_harvested/HoverImageList/HoverImageList'

// Sector index for the harvested hover-reveal list (image follows the cursor).
const SECTOR_INDEX = [
  { label: 'Aviation',      meta: 'UAE',         image: '/assets/sectors/aviation.png',     href: '/carousel/aviation' },
  { label: 'Oil & Gas',     meta: 'UAE',         image: '/assets/sectors/oilgas.png',       href: '/carousel/oilgas' },
  { label: 'Food Industry', meta: 'UAE · Libya', image: '/assets/sectors/food.png',         href: '/carousel/food' },
  { label: 'Construction',  meta: 'UAE',         image: '/assets/sectors/construction.png', href: '/carousel/construction' },
  { label: 'Pharma',        meta: 'UAE · Libya', image: '/assets/sectors/pharma.png',       href: '/carousel/pharma' },
  { label: 'Auto Parts',    meta: 'UAE',         image: '/assets/sectors/spareparts.png',   href: '/carousel/spareparts' },
  { label: 'Perfumes',      meta: 'UAE',         image: '/assets/sectors/perfumes.png',     href: '/carousel/perfumes' },
  { label: 'Furniture',     meta: 'UAE',         image: '/assets/sectors/furniture.png',    href: '/carousel/furniture' },
]

export const metadata: Metadata = {
  title: 'Companies',
  description:
    'A clear view of the Midline portfolio — 34 companies across 8 sectors including aviation, oil & gas, food industry, construction, pharma, spare parts, perfumes, and furniture.',
}

export default function CompaniesPage() {
  return (
    <>
      <section className="subhero">
        <div className="section-label section-label-static">Companies</div>
        <h1 className="subhero-title">
          A clear view of the <em>Midline portfolio</em>
        </h1>
        <p className="subhero-copy">
          This page brings together the group structure, all sector categories, and every company profile in
          one place without relying on a single long homepage.
        </p>
      </section>

      <section className="page-section section-shell">
        <RevealOnScroll className="section-label">Explore by sector</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Eight industries, <em>one group</em>
        </RevealOnScroll>
        <HoverImageList items={SECTOR_INDEX} />
      </section>

      <section className="structure-section">
        <RevealOnScroll className="section-label">Holding Structure</RevealOnScroll>
        <RevealOnScroll className="section-title">
          A clear tree of <em>34 companies</em> across the group
        </RevealOnScroll>
        <RevealOnScroll className="section-body">
          Built from the company profiles document, this view shows the Midline Holding Group root, each
          division, and the entities inside it so visitors can immediately understand the full portfolio.
        </RevealOnScroll>
        <TreeSection />
      </section>

      <section className="sectors-section">
        <RevealOnScroll className="section-label">Our Companies &amp; Services</RevealOnScroll>
        <RevealOnScroll className="section-title">
          Eight sectors. <em>One vision.</em>
        </RevealOnScroll>
        <RevealOnScroll className="section-body">
          Each sector has its own dedicated page, giving visitors a clearer path into the businesses,
          services, and companies that sit inside every Midline division.
        </RevealOnScroll>
        <div className="sectors-grid">
          {Object.entries(MIDLINE_SECTORS).map(([key, sector]) => (
            <SectorCard key={key} sectorKey={key} sector={sector} mode="full" />
          ))}
        </div>
      </section>
    </>
  )
}
