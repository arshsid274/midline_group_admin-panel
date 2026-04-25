'use client'

import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import type { Company } from '@/lib/data'
import CompanyCard from '@/components/CompanyCard'

interface Props {
  companies: Company[]
  sectorTitle: string
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export default function CompanyStack({ companies, sectorTitle }: Props) {
  const stackRef = useRef<HTMLDivElement>(null)
  const isStacked = companies.length > 1

  useEffect(() => {
    const stack = stackRef.current
    if (!stack || !isStacked) return

    const cards = Array.from(stack.querySelectorAll<HTMLElement>('.company-card'))
    const stage = stack.querySelector<HTMLElement>('.company-stack-stage')
    if (!stage) return

    const update = () => {
      const viewport = window.innerHeight
      const rect = stack.getBoundingClientRect()
      const travel = Math.max(stack.offsetHeight - stage.clientHeight, 1)
      const raw = clamp((viewport * 0.2 - rect.top) / travel, 0, 1)
      const active = raw * (cards.length - 1)

      cards.forEach((card, index) => {
        const distance = index - active
        let y: number
        let scale: number
        let rotate: number
        let opacity: number

        if (distance < -1) {
          y = -46
          scale = 0.88
          rotate = -3.8
          opacity = 0
        } else if (distance < 0) {
          const amount = Math.abs(distance)
          y = -46 * amount
          scale = 1 - 0.1 * amount
          rotate = -3.8 * amount
          opacity = 1 - 0.34 * amount
        } else if (distance < 1) {
          y = 118 * distance
          scale = 0.96 + 0.04 * (1 - distance)
          rotate = 2.5 * distance
          opacity = 1
        } else {
          y = 124
          scale = 0.96
          rotate = 2.5
          opacity = 0
        }

        card.style.transform = `translate3d(0, ${y}%, ${distance < 0 ? '-120px' : '0'}) scale(${scale}) rotate(${rotate}deg)`
        card.style.opacity = `${opacity}`
        card.style.zIndex = `${Math.max(1, cards.length + 10 - Math.abs(Math.round(distance * 10)))}`
        card.classList.toggle('is-current', Math.abs(distance) < 0.45)
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [isStacked])

  return (
    <div
      ref={stackRef}
      className={`company-list ${isStacked ? 'company-stack' : 'company-single'}`}
      style={{ '--company-count': companies.length } as CSSProperties}
    >
      <div className="company-stack-stage">
        {companies.map((company) => (
          <CompanyCard key={company.name} company={company} sectorTitle={sectorTitle} />
        ))}
      </div>
    </div>
  )
}
