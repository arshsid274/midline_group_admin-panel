'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './carousel-detail.module.css'

/**
 * Client wrapper for the (server-rendered) carousel detail content.
 *
 * Owns the Back interaction: pressing Back plays a short "shrink away" exit on
 * the whole page, then navigates back. The carousel home restores its scroll
 * position underneath and fades in (see PageTransition), so the sequence reads
 * as: detail collapses away → carousel revealed where you left it.
 */
export default function CarouselDetailShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [exiting, setExiting] = useState(false)

  const goBack = () => {
    if (exiting) return
    setExiting(true)
    // let the exit play, then return (router.back restores scroll position).
    window.setTimeout(() => {
      if (window.history.length > 1) router.back()
      else router.push('/')
    }, 320)
  }

  return (
    <div className={`${styles.page} ${exiting ? styles.pageExiting : ''}`}>
      <button type="button" className={styles.back} onClick={goBack}>
        ← Back
      </button>
      {children}
    </div>
  )
}
