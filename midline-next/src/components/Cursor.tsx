'use client'

import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const trail = document.getElementById('cursor-trail')
    if (!cursor || !trail || window.innerWidth <= 960) return

    let mx = 0
    let my = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      cursor.style.left = `${mx}px`
      cursor.style.top = `${my}px`
      setTimeout(() => {
        trail.style.left = `${mx}px`
        trail.style.top = `${my}px`
      }, 80)
    }

    const onEnter = () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)'
      cursor.style.background = 'var(--bright)'
      trail.style.width = '60px'
      trail.style.height = '60px'
      trail.style.borderColor = 'rgba(80,207,254,.34)'
    }

    const onLeave = () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)'
      cursor.style.background = 'var(--sky)'
      trail.style.width = '40px'
      trail.style.height = '40px'
      trail.style.borderColor = 'rgba(47,184,238,.4)'
    }

    window.addEventListener('mousemove', onMove)

    const targets = document.querySelectorAll('a,button,.sector-card,.company-card,.preview-card,.presence-card')
    targets.forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <div id="cursor" />
      <div id="cursor-trail" />
    </>
  )
}
