'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Stat {
  target: number
  suffix?: string
  label: string
}

const STATS: Stat[] = [
  { target: 34, label: 'Companies' },
  { target: 8, label: 'Sectors' },
  { target: 9, label: 'Countries' },
]

// Quartic ease-out feels more satisfying than cubic — strong initial snap, long tail
function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4)
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    const start = Date.now()
    const duration = 1400

    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1)
      setValue(Math.round(easeOutQuart(progress) * target))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [active, target])

  return value
}

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const value = useCountUp(stat.target, active)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      className="stat"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        duration: 0.5,
        bounce: 0.1,
        // Stagger: first stat at 1.35s, each following +120ms
        delay: 1.35 + index * 0.12,
      }}
    >
      <div className="stat-num">
        {value}
        {stat.suffix}
      </div>
      <div className="stat-label">{stat.label}</div>
    </motion.div>
  )
}

export default function HeroStats() {
  return (
    <div className="hero-stats" style={{ opacity: 1, animation: 'none' }}>
      {STATS.map((stat, i) => (
        <StatItem key={stat.label} stat={stat} index={i} />
      ))}
    </div>
  )
}
