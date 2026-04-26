'use client'

import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { consumeFlipOrigin, type FlipOrigin } from '@/lib/flipState'
import { useMediaSrc } from '@/components/MediaOverrideProvider'
import { deriveVideoAlternates } from '@/components/LazyVideo'

type Props = {
  slug: string
  plainTitle: string
  blurb: string
  companiesCount: number
  icon: string
  /**
   * Fallback video shown when the user lands on this page WITHOUT the carousel
   * bridge state — e.g. on direct URL load, page refresh, or navigating BACK
   * from a company detail page. Without this, `consumeFlipOrigin()` returns
   * null and the static branch silently renders no video.
   */
  fallbackVideo?: string
  fallbackPoster?: string
}

export default function SectorFlipHero({ slug, plainTitle, blurb, companiesCount, icon, fallbackVideo, fallbackPoster }: Props) {
  const overriddenPoster = useMediaSrc(`sector:${slug}:photo`, fallbackPoster)
  const overriddenVideo  = useMediaSrc(`sector:${slug}:video`, fallbackVideo)

  const router   = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)

  const [origin]       = useState<FlipOrigin | null>(() => consumeFlipOrigin())
  const [active,       setActive]       = useState(false)
  const [landed,       setLanded]       = useState(false)
  const [videoVisible, setVideoVisible] = useState(false)

  // Build (lazy-friendly) WebM + MP4 source pairs for both render paths.
  const staticVideo = useMemo(
    () => (overriddenVideo ? deriveVideoAlternates(overriddenVideo) : null),
    [overriddenVideo],
  )
  const flipVideoUrl = overriddenVideo ?? origin?.video
  const flipVideo = useMemo(
    () => (flipVideoUrl ? deriveVideoAlternates(flipVideoUrl) : null),
    [flipVideoUrl],
  )

  // Scroll to top BEFORE the browser paints — fires synchronously during commit,
  // so the user never sees the inherited scroll position from { scroll: false }.
  // Must be useLayoutEffect (not useEffect) for this to work.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Kick off FLIP on mount
  useEffect(() => {
    if (!origin) return

    document.body.style.overflow = 'hidden'

    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setActive(true)

        // Fade out the bridge overlay that was injected by the carousel
        const bridge = document.getElementById('flip-bridge')
        if (bridge) {
          bridge.style.transition = 'opacity 0.35s ease'
          bridge.style.opacity = '0'
          setTimeout(() => bridge.remove(), 380)
        }
      })
    )

    const t = setTimeout(() => {
      setLanded(true)
      document.body.style.overflow = ''
    }, 950)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
      document.body.style.overflow = ''
      document.getElementById('flip-bridge')?.remove()
    }
  }, [origin])

  // Photo → video crossfade after FLIP lands
  useEffect(() => {
    if (!active || !flipVideo) return
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    video.play().catch(() => {})
    const show  = () => setVideoVisible(true)
    const timer = setTimeout(() => {
      video.readyState >= 3 ? show() : video.addEventListener('canplay', show, { once: true })
    }, 820)
    return () => {
      clearTimeout(timer)
      video.removeEventListener('canplay', show)
    }
  }, [active, flipVideo])

  // ── Static fallback for direct URL navigation / back-navigation ───────────
  // Renders the same hero composition as the post-FLIP state: full-bleed
  // photo/video, glass-card content panel bottom-left, sky-blue back pill.
  // Bypasses the FLIP transition (no carousel rect to interpolate from) but
  // visually identical so back-navigation doesn't dump users into a stripped page.
  if (!origin) {
    return (
      <div className="sh-hero sh-hero-static active landed">
        <button className="sc-back sh-back sh-back-static" onClick={() => router.back()}>
          ← Back
        </button>

        <div className="sh-content active">
          <div className="sh-content-icon">{icon}</div>
          <h1 className="sh-content-title">{plainTitle}</h1>
          <p className="sh-content-desc">{blurb}</p>
          <span className="sh-content-count">
            {companiesCount} {companiesCount === 1 ? 'COMPANY' : 'COMPANIES'}
          </span>
        </div>

        {overriddenPoster && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className="sh-static-media" src={overriddenPoster} alt="" loading="lazy" />
        )}
        {staticVideo && (
          <video
            className="sh-static-media sh-static-video"
            poster={overriddenPoster ?? staticVideo.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            {staticVideo.sources.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
        )}
      </div>
    )
  }

  const handleBack = useCallback(() => {
    if (!origin) { router.back(); return }

    // Ensure we're at the top so stored rect coords match the viewport
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.body.style.overflow = 'hidden'

    // Stop video — it'll be invisible during the reverse
    setVideoVisible(false)
    videoRef.current?.pause()

    // Step 1: lift the `landed` class so the image is position:fixed again
    //         (active CSS !important still holds it at 0,0,100vw,65vh — no visual jump)
    setLanded(false)

    // Step 2: one frame later, lift `active` → CSS !important lifts →
    //         inline rect values take over → 0.9s transition plays BACK to card position
    requestAnimationFrame(() => setActive(false))

    // Fade a bridge overlay in at the midpoint to hide the page swap
    const bridge = document.createElement('div')
    bridge.id = 'flip-bridge'
    Object.assign(bridge.style, {
      position: 'fixed', inset: '0',
      background: '#F0FAFF',
      zIndex: '8',
      pointerEvents: 'none',
      opacity: '0',
    })
    document.body.appendChild(bridge)
    setTimeout(() => {
      bridge.style.transition = 'opacity 0.35s ease'
      bridge.style.opacity = '1'
    }, 500)

    // Navigate after the 0.9s FLIP transition completes
    setTimeout(() => {
      document.body.style.overflow = ''
      router.back()
    }, 920)
  }, [origin, router])

  // ── FLIP hero (came from carousel) ─────────────────────────────────────────
  const heroClass = ['sh-hero', active && 'active', landed && 'landed']
    .filter(Boolean).join(' ')

  return (
    <div className={heroClass}>
      <button className="sc-back sh-back" onClick={handleBack}>
        ← Back
      </button>

      <div className={`sh-content${active ? ' active' : ''}`}>
        <div className="sh-content-icon">
          <origin.Icon size={36} strokeWidth={1.5} />
        </div>
        <h1 className="sh-content-title">{origin.name}</h1>
        <p className="sh-content-desc">{origin.desc}</p>
        <span className="sh-content-count">{origin.count}</span>
      </div>

      {/* FLIP image: starts at card rect, animates to hero via CSS !important */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="sh-img"
        src={overriddenPoster ?? origin.img}
        alt=""
        draggable={false}
        style={{
          top:     origin.rect.top,
          left:    origin.rect.left,
          width:   origin.rect.width,
          height:  origin.rect.height,
          opacity: videoVisible ? 0 : 1,
        }}
      />

      {flipVideo && (
        <video
          ref={videoRef}
          className="sh-video"
          preload="auto"
          muted
          playsInline
          loop
          poster={flipVideo.poster}
          style={{ opacity: videoVisible ? 1 : 0 }}
        >
          {flipVideo.sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}
    </div>
  )
}
