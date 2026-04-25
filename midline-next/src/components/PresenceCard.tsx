'use client'

import { motion } from 'framer-motion'

interface Props {
  flag: string
  country: string
  role: string
  isHQ?: boolean
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, duration: 0.45, bounce: 0.08 },
  },
}

export default function PresenceCard({ flag, country, role, isHQ = false }: Props) {
  return (
    <motion.div
      className={`presence-card${isHQ ? ' hq' : ''}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
      viewport={{ once: true, margin: '-40px' }}
    >
      <div className="presence-flag">{flag}</div>
      <div className="presence-country">{country}</div>
      <div className="presence-role">{role}</div>
    </motion.div>
  )
}
