'use client'

/**
 * CompanyInfoPages
 * ────────────────────────────────────────────────────────────────────────────
 * Faithful Next.js port of pages.html (the Ssangyong E&C "Overview" page).
 *
 * Nothing is omitted: every section, class name, image and animation from the
 * original page is preserved. The only changes are the wrapper-level concerns
 * (React lifecycle, jQuery → vanilla JS, Swiper/YouTube loaded as scripts).
 *
 * Pair this file with CompanyInfoPages.css (the full inlined stylesheet, with
 * mask_line.svg already base64-encoded so the gradient ring renders locally).
 */

import { useEffect, useRef } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { SplitText } from 'gsap/SplitText'
import type { CompanyContent } from '@/lib/companyContent'
import { useMediaOverrides } from '@/components/MediaOverrideProvider'
import LazyVideo, { deriveVideoAlternates } from '@/components/LazyVideo'
import './CompanyInfoPages.css'

const IMG = 'https://www.ssyenc.com/resources/en/images'
const VID = 'https://www.ssyenc.com/resources/en/video'

interface CompanyInfoPagesProps {
  companyName?: string
  sectorTitle?: string
  sectorSlug?: string
  companySlug?: string
  /** Company logo URL (e.g. /assets/logos/midline-aviation.png).
   *  If omitted, the Ssangyong placeholder logo + wordmark are kept. */
  logo?: string
  /** Company-specific video used in the "For The Best Quality" section
   *  (the .sec_quality clip_wrap reveal). Falls back to the Ssangyong demo
   *  clip when absent so unwired companies still render correctly. */
  companyVideo?: string
  /** Poster image for the same video. Defaults to company.photo or the
   *  Ssangyong default. */
  companyPoster?: string
  content?: CompanyContent
}

export default function CompanyInfoPages({ companyName, sectorTitle, sectorSlug, companySlug: cSlug, logo, companyVideo, companyPoster, content }: CompanyInfoPagesProps = {}) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const swiperInitialized = useRef(false)
  const overrides = useMediaOverrides()
  const ov = (slot: string) => (cSlug ? overrides[`company:${cSlug}:${slot}`] : undefined)

  const heroBg = ov('hero-bg') ?? `${IMG}/company/about/sub_visual_bg.jpg`
  const overriddenLogo = ov('logo') ?? logo
  const logoCircleVideo = ov('logo-circle-video') ?? `${IMG}/company/about/circle_video.mp4`
  const qualityVideoSrc = ov('quality-video') ?? companyVideo ?? `${VID}/company/about.mp4`
  const qualityPosterSrc = ov('quality-poster') ?? companyPoster ?? `${IMG}/company/about/quailty_main.jpg`

  const handleBack = () => {
    // If the user arrived here via in-app navigation, history.back is the
    // most natural target. On direct loads or refreshes there's nothing to
    // go back to, so fall back to the sector page (or home).
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else if (sectorSlug) {
      router.push(`/sectors/${sectorSlug}`)
    } else {
      router.push('/')
    }
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText)

    const root = containerRef.current
    if (!root) return

    // ── Globals matching common.js ─────────────────────────────────────────
    const windowWidth   = window.innerWidth
    const isTouchDevice = getComputedStyle(document.documentElement).getPropertyValue('--pointer') === 'coarse'
    const mediaQuery    = window.matchMedia('(min-width: 1025px)')

    const qs  = <T extends Element = Element>(sel: string) => root.querySelector<T>(sel)
    const qsa = <T extends Element = Element>(sel: string) => Array.from(root.querySelectorAll<T>(sel))

    // ── titleMotion (SplitText word-reveal for headings) ───────────────────
    function titleMotion(section: Element) {
      const tit = section.querySelector<HTMLElement>('.top strong')
      const p   = section.querySelector<HTMLElement>('.top p')
      if (!tit || !p) return
      if (tit.dataset.animated === 'true' && p.dataset.animated === 'true') return

      const titleSplit = SplitText.create(tit, { type: 'lines,words', linesClass: '-line', wordsClass: '-word' })
      const pSplit     = SplitText.create(p,   { type: 'lines,words', linesClass: '-line', wordsClass: '-word' })

      gsap.set([tit, p], { opacity: 1 })
      gsap.set([...tit.querySelectorAll<HTMLElement>('.-line'), ...p.querySelectorAll<HTMLElement>('.-line')], { overflow: 'hidden' })
      gsap.set(tit.querySelectorAll<HTMLElement>('.-word'), { yPercent: 100 })
      gsap.set(p.querySelectorAll<HTMLElement>('.-word'),   { yPercent: 100 })

      const tl = gsap.timeline({
        onComplete() {
          titleSplit.revert()
          pSplit.revert()
          tit.dataset.animated = 'true'
          p.dataset.animated   = 'true'
        },
      })
      tl.to(tit.querySelectorAll<HTMLElement>('.-word'), { yPercent: 0, duration: 1, ease: 'power4.out' })
      p.querySelectorAll<HTMLElement>('.-line').forEach((line, i) => {
        tl.to(line.querySelectorAll<HTMLElement>('.-word'), { yPercent: 0, duration: 1, ease: 'power4.out' }, i * 0.1)
      })
    }

    // ── groupTrigger (sec_enc + sec_quality scroll choreography) ───────────
    function groupTrigger() {
      const triggerGroup = qs('#triggerGroup')!
      const secEnc       = qs<HTMLElement>('.sec_enc')!
      const secQuality   = qs<HTMLElement>('.sec_quality')!
      const video        = secQuality.querySelector<HTMLVideoElement>('video')

      function getMaskOffsetRelativeToSection() {
        const wrap   = secQuality.querySelector<HTMLElement>('.clip_wrap')!
        const target = secQuality.querySelector<HTMLElement>('.offset')!
        const wRect  = wrap.getBoundingClientRect()
        const tRect  = target.getBoundingClientRect()
        const h = wrap.offsetHeight, w = wrap.offsetWidth
        return {
          '--maskT': ((tRect.top   - wRect.top)    / h * 100).toFixed(5) + '%',
          '--maskR': ((wRect.right - tRect.right)  / w * 100).toFixed(5) + '%',
          '--maskB': ((wRect.bottom - tRect.bottom) / h * 100).toFixed(5) + '%',
          '--maskL': ((tRect.left  - wRect.left)   / w * 100).toFixed(5) + '%',
        }
      }

      let parallaxTrigger: gsap.core.Timeline | null = null
      let tlGroup:          gsap.core.Timeline | null = null

      function motion() {
        parallaxTrigger?.scrollTrigger?.kill()
        parallaxTrigger?.kill()
        tlGroup?.scrollTrigger?.kill()
        tlGroup?.kill()

        parallaxTrigger = gsap.timeline({
          scrollTrigger: {
            trigger: triggerGroup.querySelector('.parallax_trigger')!,
            start: 'top bottom', end: 'bottom top', scrub: true,
          },
        }).to(triggerGroup, { '--parallax': '0%', duration: 1, ease: 'none' })

        tlGroup = gsap.timeline({
          scrollTrigger: {
            trigger: triggerGroup,
            start: 'top 30%', end: 'bottom bottom', scrub: 0.3,
          },
        })
        .to(secEnc.querySelector('.circle_bg')!, {
          opacity: 1, duration: 0.3,
          onStart() {
            secEnc.classList.add('active')
            setTimeout(() => video?.play().catch(() => {}), 70)
          },
        })

        ScrollTrigger.matchMedia({
          '(min-width: 1025px)': () => {
            tlGroup!.to(secEnc.querySelector('.row_wrap')!, {
              y: '-100%', duration: 2, ease: 'none', delay: 0.3,
            })
          },
        })

        tlGroup
          .to(secQuality, {
            y: 0, duration: 1, ease: 'none',
            onStart() { setTimeout(() => titleMotion(secQuality), 300) },
          }, '< +0.3')
          .to(secEnc.querySelector('.dim')!, { opacity: 1, duration: 1, ease: 'none' }, '< -0.5')
          .to(secQuality.querySelector('.clip_wrap')!, {
            y: 0, duration: 1, delay: 1.15,
            onStart() { secQuality.classList.add('active') },
          }, '<')
          .fromTo(
            secQuality.querySelector('.clip_mask')!,
            { ...getMaskOffsetRelativeToSection(), '--opacity': 0 },
            { '--maskT': '0%', '--maskR': '0%', '--maskB': '0%', '--maskL': '0%', '--opacity': 1, '--round': 0, duration: 1, ease: 'none' },
            'scene1',
          )
          .to(secQuality.querySelector('.left')!,   { left: '-50%',  duration: 1 }, 'scene1')
          .to(secQuality.querySelector('.right')!,  { right: '-50%', duration: 1 }, 'scene1')
          .to(secQuality.querySelector('.txt_box')!, { opacity: 1, top: '50%', duration: 0.8, ease: 'linear' }, '< +0.7')
      }

      let oneMotion = true
      const breakPoint = (mq: { matches: boolean } | MediaQueryListEvent) => {
        oneMotion = true   // matches the original behaviour: always reset
      }
      breakPoint(mediaQuery)
      mediaQuery.addEventListener('change', breakPoint)

      const onResize = () => {
        setTimeout(() => {
          const w = window.innerWidth
          if (w > 1024 && !isTouchDevice) {
            motion()
          } else if (w > 1024 && isTouchDevice) {
            if (oneMotion) { motion(); oneMotion = false }
          } else if (w < 1025) {
            if (oneMotion) { motion(); oneMotion = false }
          }
        }, 10)
      }
      onResize()
      window.addEventListener('resize', onResize)

      return () => {
        window.removeEventListener('resize', onResize)
        mediaQuery.removeEventListener('change', breakPoint)
      }
    }

    // ── secPortfolio (stacked-card scroll + Swiper title rotator) ──────────
    function secPortfolio() {
      const sec     = qs('.sec_portfolio')!
      const current = sec.querySelector<HTMLElement>('.progress .current')!
      const drag    = sec.querySelector<HTMLElement>('.progress .drag')!
      const cards   = qsa<HTMLElement>('.sec_portfolio .card')

      const setProgress = (n: number) => {
        current.textContent = String(n).padStart(2, '0')
        drag.style.height   = `${(n / cards.length) * 100}%`
      }
      setProgress(1)

      const initSwiper = () => {
        if (swiperInitialized.current) return
        // Swiper script is loaded async from a CDN — keep polling until it
        // shows up on `window.Swiper`. Without this retry, the very first
        // call (~100 ms after the section enters view) often runs before
        // the CDN finishes downloading, the function bails, and rotation
        // never starts.
        if (typeof (window as any).Swiper === 'undefined') {
          setTimeout(initSwiper, 100)
          return
        }
        swiperInitialized.current = true
        new (window as any).Swiper('.titleSwiper .swiper', {
          slidesPerView: 1,
          autoplay: { delay: 1000, disableOnInteraction: false },
          speed: 600, loop: true, observer: true, observeParents: true,
          touchRatio: 0, allowTouchMove: false,
        })
      }
      // Kick off on mount so rotation starts even if the user never scrolls
      // to the trigger point (or lands on the page already past it). The
      // retry loop above handles the script-not-loaded-yet case.
      initSwiper()

      const tl = gsap.timeline({
        defaults: { duration: 1 },
        scrollTrigger: {
          trigger: sec, start: 'top 20%', end: 'bottom bottom', scrub: 0.5,
          onEnter() {
            sec.classList.add('active')
            if (!swiperInitialized.current) setTimeout(initSwiper, 100)
          },
        },
      })
        .to(sec.querySelector('.top')!, { y: '-150%', duration: 0.7 }, '>+1')
        .to(sec.querySelector('.portfolio')!, {
          top: window.innerWidth > 769 ? '40%' : '35%',
        }, '> -0.3')

      cards.forEach((card, i) => {
        const topValue   = `${i * 4.5}%`
        const scaleValue = 0.86 + i * 0.04

        tl
          .to(card, { top: topValue }, '<')
          .to(card, {
            scale: scaleValue,
            onComplete() { if (!card.classList.contains('active')) card.classList.add('active') },
            onUpdate()   { if (card.classList.contains('active'))  card.classList.remove('active') },
          }, '=-0.2')
          .call(() => setProgress(i + 1), undefined, '>-0.4')
      })
    }

    // sec_wonder JSX removed; the secWonder() init (and its YouTube
    // IFrame embed) is dropped along with it.

    // ── subVisual (hero intro + scroll-based mask reveal) ──────────────────
    function subVisual() {
      const sub = qs<HTMLElement>('.sub_visual')
      if (!sub) return
      const tit = sub.querySelector<HTMLElement>('.title h2')
      const p   = sub.querySelector<HTMLElement>('.title p')
      const isBackground = sub.classList.contains('background')

      function getMaskOffsetRelativeToSection() {
        const wrap   = sub!.querySelector<HTMLElement>('.bg_wrap')
        const target = sub!.querySelector<HTMLElement>('.bg_trigger')
        if (!wrap || !target) return { '--maskT': '0%', '--maskR': '0%', '--maskB': '0%', '--maskL': '0%' }
        const sR = wrap.getBoundingClientRect()
        const tR = target.getBoundingClientRect()
        const h = wrap.offsetHeight, w = wrap.offsetWidth
        return {
          '--maskT': ((tR.top   - sR.top)    / h * 100).toFixed(5) + '%',
          '--maskR': ((sR.right - tR.right)  / w * 100).toFixed(5) + '%',
          '--maskB': ((sR.bottom - tR.bottom) / h * 100).toFixed(5) + '%',
          '--maskL': ((tR.left  - sR.left)   / w * 100).toFixed(5) + '%',
        }
      }

      let maskTo: gsap.core.Tween | null = null

      // Intro: SplitText word-reveal for title h2 + p
      if (tit && p) {
        const titleSplit = SplitText.create(tit, { type: 'lines,words', linesClass: '-line', wordsClass: '-word' })
        const pSplit     = SplitText.create(p,   { type: 'lines,words', linesClass: '-line', wordsClass: '-word' })

        gsap.set([tit, p], { opacity: 1 })
        gsap.set([...tit.querySelectorAll<HTMLElement>('.-line'), ...p.querySelectorAll<HTMLElement>('.-line')], { overflow: 'hidden' })
        gsap.set([...tit.querySelectorAll<HTMLElement>('.-word'), ...p.querySelectorAll<HTMLElement>('.-word')], { yPercent: 100 })

        if (isBackground) {
          maskTo = gsap.to(sub, { ...getMaskOffsetRelativeToSection(), duration: 0.9 })
        }

        const tl = gsap.timeline({
          onComplete() { titleSplit.revert(); pSplit.revert() },
        })
        tl.to(tit.querySelectorAll<HTMLElement>('.-word'), { yPercent: 0, duration: 1, ease: 'power4.out' }, 'scene1')
        p.querySelectorAll<HTMLElement>('.-line').forEach((line, i) => {
          tl.to(line.querySelectorAll<HTMLElement>('.-word'), { yPercent: 0, duration: 1.6, ease: 'power4.out' }, i * 0.2 + 0.2)
        })
      }

      // Scroll-based mask reveal (only when sub_visual has .background)
      if (isBackground) {
        gsap.set(sub, getMaskOffsetRelativeToSection())
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sub, scrub: true, start: 'top top', end: 'bottom bottom',
            onUpdate() {
              if (maskTo?.isActive()) { maskTo.kill(); maskTo = null }
            },
          },
        })
        tl.fromTo(
          sub,
          { ...getMaskOffsetRelativeToSection(), '--opacity': 0 },
          {
            '--maskT': '0%', '--maskR': '0%', '--maskB': '0%', '--maskL': '0%',
            '--opacity': 1, '--y': 0, force3D: true, duration: 1, ease: 'none',
            onStart() {
              const v = sub.querySelector<HTMLVideoElement>('.bg_wrap video')
              v?.play().catch(() => {})
            },
            onReverseComplete() {
              const v = sub.querySelector<HTMLVideoElement>('.bg_wrap video')
              v?.pause()
            },
          },
          'scene1',
        )

        const crumbs = sub.querySelectorAll<HTMLElement>('.breadcrumb_wrap li, .breadcrumb_wrap li b')
        if (crumbs.length) {
          tl.to(crumbs, { '--color': '#ccc', '--activeColor': '#fff', duration: 0.3, ease: 'none' }, 'scene1+=0.7')
        }
        if (tit && p) {
          tl.to([tit, p], { color: '#fff', duration: 0.4, ease: 'none' }, 'scene1+=0.4')
        }
      }
    }

    // sec_business JSX has been removed; the secBusiness() init is dropped
    // along with it. The block below intentionally has no replacement.

    subVisual()
    const cleanup = groupTrigger()
    secPortfolio()

    return () => {
      cleanup?.()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <>
      {/* Swiper 4.x for the rotating title images */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.5.1/js/swiper.min.js" strategy="afterInteractive" />

      <button type="button" className="cip-back" onClick={handleBack} aria-label={`Back${sectorTitle ? ` to ${sectorTitle}` : ''}`}>
        <span aria-hidden>←</span> Back
      </button>

      <div ref={containerRef} id="wrap" className="intro company about">
        <div id="container" className="container">
          <div className="content">

            {/* ════════════════════════════════════════════════════════
                HERO / sub_visual
            ════════════════════════════════════════════════════════ */}
            <div className="sub_visual background">
              <div className="sticky">
                <div className="row_wrap">
                  <div className="row">
                    <div className="col-10 offset-1">
                      <div className="inner">
                        <div className="top">
                          <div className="breadcrumb_wrap" style={{ marginLeft: '-3vw' }}>
                            <ul>
                              <li>HOME</li>
                              <li>{sectorTitle ?? 'About Us'}</li>
                              <li><b>{companyName ?? 'Overview'}</b></li>
                            </ul>
                          </div>
                          <div className="title">
                            <h2>Overview</h2>
                            <div className="txt">
                              <p>
                                {content?.tagline ?? (
                                  <>
                                    Ssangyong E&amp;C creates<br />
                                    wonders of the world.
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bot">
                          <div className="bg_trigger"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg_wrap">
                    <div
                      className="bg"
                      style={{ backgroundImage: `url('${heroBg}')` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════
                #triggerGroup → sec_enc + sec_quality
            ════════════════════════════════════════════════════════ */}
            <div id="triggerGroup" className="trigger-group">
              <div className="parallax_trigger"></div>
              <div className="sticky">

                {/* ── #trigger1 .sec_enc ───────────────────────────── */}
                <div className="sec sec_enc">
                  <div className="dim"></div>
                  <div className="row_wrap">
                    <div className="row">
                      <div className="col-11">
                        <div className="flex-container">
                          <div className="flex-item left">
                            <div className="circle_bg">
                              <span className="circle1"></span>
                              <div className="circle2_wrap">
                                <span className="circle2"></span>
                                <div className="center_clip">
                                  <div
                                    className="group_logo"
                                    style={overriddenLogo ? { backgroundImage: `url('${overriddenLogo}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' } : undefined}
                                  ></div>
                                  <div className="clip_mask">
                                    <video key={logoCircleVideo} className="bg_video" autoPlay muted loop playsInline preload="metadata">
                                      {deriveVideoAlternates(logoCircleVideo).sources.map((s) => (
                                        <source key={s.src} src={s.src} type={s.type} />
                                      ))}
                                    </video>
                                  </div>
                                </div>
                              </div>
                              <span className="circle3"></span>
                            </div>
                          </div>
                          <div className="flex-item right">
                            {overriddenLogo ? (
                              <div className="cip-brand">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img className="cip-brand-logo" src={overriddenLogo} alt={companyName ?? ''} loading="lazy" />
                                {companyName && <h3 className="cip-brand-name">{companyName}</h3>}
                              </div>
                            ) : (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={`${IMG}/company/about/enc_logo.svg`} alt="SSANGYONG E&C" loading="lazy" />
                            )}
                            <div className="text_box">
                              <span className="line"></span>
                              <p className="bold">
                                {content?.overview?.[0] ?? (
                                  <>
                                    Since its establishment in 1977, Ssangyong E&amp;C, No. 1 in Overseas High-end
                                    Construction Performance, has been realizing the value of customer satisfaction
                                    based on its corporate philosophy of quality first.
                                  </>
                                )}
                              </p>
                              <p>
                                {content?.overview?.[1] ?? (
                                  <>
                                    Welcoming Global Sae-A Group as its largest shareholder, Ssangyong E&amp;C has
                                    secured financial stability as well as advanced technology. Under the active
                                    support of Global Sae-A Group, which has 14 subsidiaries, it has established
                                    itself as a global construction company recognized worldwide based on its
                                    abundant capabilities and expertise.
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── #trigger2 .sec_quality ───────────────────────── */}
                <div className="sec sec_quality">
                  <div className="m_sticky">
                    <div className="first_wrap">
                      <div className="top">
                        <strong className="gilda">For The<span className="m_on"></span> Best Quality</strong>
                        <p className="suit">
                          {content?.qualitySubtitle ?? (
                            <>With more masterpieces of Ssangyong,<br />the world becomes more beautiful.</>
                          )}
                        </p>
                      </div>

                      <div className="img_cont">
                        <div className="flex-container">
                          <div className="flex-item left">
                            {[1, 2, 3, 4].map(n => (
                              <div key={n} className={`item item${n}`}>
                                <div className={`img_wrap img${n}`}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={ov(`quality-left-${n}`) ?? `${IMG}/company/about/quality_left0${n}.jpg`} alt="" loading="lazy" />
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex-item main">
                            <div className="offset"></div>
                          </div>

                          <div className="flex-item right">
                            {[1, 2, 3, 4].map(n => (
                              <div key={n} className={`item item${n}`}>
                                <div className={`img_wrap img${n}`}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={ov(`quality-right-${n}`) ?? `${IMG}/company/about/quality_right0${n}.jpg`} alt="" loading="lazy" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="clip_wrap">
                      <div className="clip_mask">
                        <div className="bg">
                          <LazyVideo
                            key={qualityVideoSrc}
                            src={qualityVideoSrc}
                            poster={qualityPosterSrc}
                            loop
                            muted
                            autoPlay
                            playsInline
                          />
                        </div>
                      </div>
                      <div className="txt_box">
                        <strong>
                          {content?.missionHeading ?? (
                            <>Ssangyong E&amp;C has expanded <br className="m_none" />Korea beyond its borders</>
                          )}
                        </strong>
                        <p>
                          {content?.missionBody ?? (
                            <>
                              As Ssangyong, which is rewriting a new chapter <br className="m_none" />
                              in the history of high-end construction,<br className="tablet_on" /> delivers more of its creations, <br className="m_none" />
                              the world becomes a more beautiful place <br className="m_none" />
                              and the future looks more prosperous than ever.
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ════════════════════════════════════════════════════════
                sec_portfolio — "Do You Know That?"
            ════════════════════════════════════════════════════════ */}
            <div className="sec sec_portfolio">
              <div className="sticky">
                <div className="row_wrap">
                  <div className="row">
                    <div className="col-12">

                      <div className="top">
                        <div className="title_box flex-container">
                          <span className="gilda">Do You</span>
                          <div className="titleSwiper">
                            <div className="swiper">
                              <div className="swiper-wrapper">
                                {[1, 2, 3].map(n => (
                                  <div key={n} className="swiper-slide">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={ov(`rolling-${n}`) ?? `${IMG}/company/about/rolling0${n}.png`} alt="" loading="lazy" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="gilda">Know That?</span>
                        </div>
                        <p className="desc">
                          {content?.knowThatBody ?? (
                            <>
                              Based on creative passion and challenges for beauty, <br className="m_none" />
                              Ssangyong E &amp; C is creating a more beautiful <br className="tablet_on" />
                              tomorrow than yesterday.
                            </>
                          )}
                        </p>
                      </div>

                      <div className="portfolio">
                        <ul className="card_wrap">
                          {(content?.facts && content.facts.length > 0
                            ? content.facts.map((f, i) => ({
                                stat: f.stat,
                                img: PORTFOLIO_CARDS[i % PORTFOLIO_CARDS.length].img,
                                titlePc: f.title,
                                bodyPc: f.body,
                                titleMo: f.title,
                                bodyMo: f.body,
                              }))
                            : PORTFOLIO_CARDS
                          ).map((card, i) => (
                            <li key={`${card.stat}-${i}`} className="card">
                              <i className="dim"></i>
                              <div className="thumb">
                                <div className="img_wrap">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={ov(`portfolio-${i + 1}`) ?? `${IMG}/company/about/${card.img}`} alt="" loading="lazy" />
                                </div>
                              </div>
                              <div className="text_wrap">
                                <strong className="title gilda">{card.stat}</strong>
                                <span className="pc">{card.titlePc}</span>
                                <p className="pc">{card.bodyPc}</p>
                                <span className="mo">{card.titleMo}</span>
                                <p className="mo">{card.bodyMo}</p>
                              </div>
                            </li>
                          ))}
                        </ul>

                        <div className="progress">
                          <span className="gilda current">01</span>
                          <p className="progress_bar"><span className="drag"></span></p>
                          <span className="gilda total">05</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* sec_wonder removed — was the "We Make Wonders" Ssangyong PR
                video block. Vision quote content (visionQuote field) is no
                longer rendered; can be moved into another section if needed. */}

            {/* sec_business removed — was the Ssangyong "Overseas / Domestic
                Business" panel with hardcoded external links to ssyenc.com,
                irrelevant to every Midline company. */}

          </div>
        </div>
      </div>
    </>
  )
}

// ── Portfolio card data ─────────────────────────────────────────────────────
const PORTFOLIO_CARDS = [
  {
    stat: 'No.1', img: 'portfolio01.jpg',
    titlePc: 'Leader in prestige building projects around the world',
    bodyPc: 'ENR, a US magazine for global construction industry professionals, ranked Ssangyong E&C as the second best builder of hotels in 1998. Since then, the company has maintained its position as the "leader in prestige building projects around the world No.1" with construction performance of the most luxurious hotels with a total of 17,000 guest rooms, as well as hospitals with 12,000 beds.',
    titleMo: 'Leader in prestige building projects around the world',
    bodyMo: 'We are the No.1 company in high-end overseas construction, with an unrivaled track record in building world-class hotels and hospitals.',
  },
  {
    stat: '15cm', img: 'portfolio02.jpg',
    titlePc: 'The Miracle of Subway Construction',
    bodyPc: '"Seoul 923 Subway Station" is considered the most challenging civil engineering feat among all Korean subway construction sections as it was built only 15 centimeters below the existing Seoul Metro Line 3. Ssangyong E&C won the Brunel Medal from the Institution of Civil Engineers for completing this section by applying both TRcM and CAM methods for the first time in the world.',
    titleMo: 'The Miracle of Subway Construction',
    bodyMo: 'We pioneered Korea\'s most challenging subway project with just 15cm of underground clearance, earning the Brunel Medal for the world\'s first hybrid tunneling method.',
  },
  {
    stat: '52°', img: 'portfolio03.jpg',
    titlePc: 'Miracle of 21st Century Architecture',
    bodyPc: 'Marina Bay Sands Hotel is the existing building with the highest difficulty, tilting about 10 times more than the Leaning Tower of Pisa. Because the hotel has a unique structure, which is inclined at 52 degrees at its apex, including the SkyPark, with a combined weight of more than 43,000 mid-size vehicles with the total length of 340m, and about 2,561 guest rooms in its three 57-story towers with SkyPark.',
    titleMo: 'Miracle of 21st Century Architecture',
    bodyMo: 'We completed the Marina Bay Sands Hotel — a structure with a world-record 52° incline — in just 27 months, achieving what is hailed as a miracle of 21st-century architecture.',
  },
  {
    stat: 'Leader', img: 'portfolio04.jpg',
    titlePc: 'Taking the lead in renovation projects',
    bodyPc: 'Ssangyong E&C, which successfully completed the full remodeling of apartment complexes 1 to 4, leads the domestic market with the highest performance. After launching the industry\'s first remodeling team, it introduced numerous new technologies and secured Korea\'s largest remodeling project — the Ssangyong Apartment Garak Project. It also demonstrates strong capabilities in general building remodeling.',
    titleMo: 'Taking the lead in renovation projects',
    bodyMo: 'As Korea\'s No.1 in remodeling, Ssangyong E&C leads the industry with unmatched achievements — from luxury apartments to six-star hotels — holding numerous "first" titles.',
  },
  {
    stat: 'Smart', img: 'portfolio05.jpg',
    titlePc: 'Gaining Competitiveness via Smart Construction Technologies',
    bodyPc: 'In line with the 4th industrial revolution, Ssangyong is enhancing productivity and safety through smart construction technologies that integrate advanced technology with construction. Especially in BIM, a 3D design method for managing data throughout the construction process, we hold top-tier expertise, proven by receiving the highest grade from Singapore\'s Building and Construction Authority (BCA).',
    titleMo: 'Gaining Competitiveness via Smart Construction Technologies',
    bodyMo: 'By integrating cutting-edge technologies like BIM, drones, IoT, and AI into our sites, we are leading smart construction and proving our capabilities through global awards.',
  },
]
