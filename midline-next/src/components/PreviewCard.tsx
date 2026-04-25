'use client'

import { motion } from 'framer-motion'

interface Props {
  eyebrow: string
  title: string
  body: string
  delay?: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, duration: 0.5, bounce: 0.08 },
  },
}

export default function PreviewCard({ eyebrow, title, body, delay = 0 }: Props) {
  return (
    <motion.div
      className="preview-card"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 28 } }}
      whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 500, damping: 30 } }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: delay / 1000 }}
    >
      <div className="preview-eyebrow">{eyebrow}</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </motion.div>
  )
}
