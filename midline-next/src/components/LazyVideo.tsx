'use client'

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

interface VideoSource {
  src: string
  type?: string
}

interface Props extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'poster' | 'children'> {
  /**
   * The video URL stored in the manifest. Convention: when this points at a
   * `.webm`, sibling `.mp4` and `.jpg` files exist in the same folder (the
   * admin's transcode pipeline produced them). For legacy `.mp4`/`.mov`
   * uploads with no siblings, the component falls back to a single source.
   */
  src: string
  /**
   * Override poster auto-detection. Defaults to the `.jpg` sibling when src
   * ends in `.webm`, otherwise undefined.
   */
  poster?: string
  /** When true, skip the IntersectionObserver gate and load eagerly. */
  eager?: boolean
  /** Distance from viewport at which loading starts (default 200px). */
  rootMargin?: string
}

export interface LazyVideoHandle {
  el: HTMLVideoElement | null
  load: () => void
  play: () => Promise<void> | void
  pause: () => void
}

const VIDEO_EXT_RE = /\.(mp4|mov|webm|m4v)$/i

export function deriveVideoAlternates(src: string): { sources: VideoSource[]; poster?: string } {
  const m = src.match(/^(.*)\.([^./?#]+)([?#].*)?$/)
  if (!m) return { sources: [{ src }] }
  const [, base, ext, query = ''] = m
  const e = ext.toLowerCase()
  if (e === 'webm') {
    return {
      sources: [
        { src, type: 'video/webm' },
        { src: `${base}.mp4${query}`, type: 'video/mp4' },
      ],
      poster: `${base}.jpg${query}`,
    }
  }
  if (e === 'mp4' || e === 'm4v') {
    return { sources: [{ src, type: 'video/mp4' }] }
  }
  if (e === 'mov') {
    return { sources: [{ src, type: 'video/quicktime' }] }
  }
  return { sources: [{ src }] }
}

const LazyVideo = forwardRef<LazyVideoHandle, Props>(function LazyVideo(
  { src, poster: posterOverride, eager, rootMargin = '200px', autoPlay, ...rest },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [armed, setArmed] = useState(!!eager)

  const { sources, poster: derivedPoster } = useMemo(() => deriveVideoAlternates(src), [src])
  const poster = posterOverride ?? derivedPoster

  useEffect(() => {
    if (eager) return
    const node = videoRef.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setArmed(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setArmed(true)
            obs.disconnect()
            break
          }
        }
      },
      { rootMargin, threshold: 0.01 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [eager, rootMargin])

  // When sources mount (armed flips true) tell the element to load and play.
  useEffect(() => {
    if (!armed) return
    const v = videoRef.current
    if (!v) return
    v.load()
    if (autoPlay) {
      v.play().catch(() => {
        /* autoplay can be blocked by the browser when muted=false; ignore. */
      })
    }
  }, [armed, autoPlay])

  useImperativeHandle(ref, () => ({
    get el() { return videoRef.current },
    load: () => videoRef.current?.load(),
    play: () => videoRef.current?.play() ?? undefined,
    pause: () => videoRef.current?.pause(),
  }), [])

  // We render the <source> elements only once armed, otherwise the browser
  // will start fetching the first source immediately.
  return (
    <video
      ref={videoRef}
      poster={poster}
      preload="none"
      autoPlay={autoPlay}
      {...rest}
    >
      {armed && sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  )
})

export default LazyVideo

export const isVideoUrl = (url: string | undefined | null): url is string =>
  !!url && VIDEO_EXT_RE.test(url)
