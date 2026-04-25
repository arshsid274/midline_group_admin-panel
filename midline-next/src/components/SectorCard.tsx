'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Sector } from '@/lib/data'

interface Props {
  sectorKey: string
  sector: Sector
  mode?: 'full' | 'preview'
  delay?: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, duration: 0.55, bounce: 0.1 },
  },
}

export default function SectorCard({ sectorKey, sector, mode = 'full', delay = 0 }: Props) {
  const href = `/sectors/${sectorKey}`
  const plainTitle = sector.title.replace(/<[^>]*>/g, '')

  return (
    <motion.div
      className="sector-card"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
      whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 500, damping: 30 } }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: delay / 1000 }}
      onClick={() => { window.location.href = href }}
    >
      <div className="sector-icon">{sector.icon}</div>
      <div className="sector-name">{plainTitle}</div>
      <div className="sector-desc">{sector.blurb}</div>
      <div className="sector-count">
        {sector.companies.length} {sector.companies.length === 1 ? 'Company' : 'Companies'}
      </div>
      {mode === 'preview' ? (
        <Link href={href} className="inline-link">View sector</Link>
      ) : (
        <Link href={href} className="sector-arrow sector-arrow-link" aria-label={`Open ${plainTitle} page`}>
          →
        </Link>
      )}
    </motion.div>
  )
}
