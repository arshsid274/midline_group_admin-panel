'use client'

import { motion } from 'framer-motion'

type MotionTag = 'div' | 'article' | 'section' | 'p'

const MOTION_ELEMENTS: Record<MotionTag, React.ElementType> = {
  div: motion.div,
  article: motion.article,
  section: motion.section,
  p: motion.p,
}

const revealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      duration: 0.5,
      bounce: 0.1,
    },
  },
}

interface Props {
  children: React.ReactNode
  className?: string
  as?: MotionTag
  delay?: number
}

export default function RevealOnScroll({ children, className = '', as: tag = 'div', delay = 0 }: Props) {
  const Component = MOTION_ELEMENTS[tag]

  return (
    <Component
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: delay / 1000 }}
    >
      {children}
    </Component>
  )
}
