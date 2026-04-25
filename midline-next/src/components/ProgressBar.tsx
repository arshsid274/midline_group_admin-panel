'use client'

import { useEffect, useRef } from 'react'

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const value = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0
      bar.style.width = `${value}%`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <div ref={barRef} className="progress-bar" />
}
