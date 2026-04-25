'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const ORB_DATA = [
  { size: 170, angle: 180, img: 'https://picsum.photos/seed/laptop/300/300', sector: 'Aviation' },
  { size: 135, angle: 235, img: 'https://picsum.photos/seed/flex/300/300',   sector: 'Construction' },
  { size: 112, angle: 275, img: 'https://picsum.photos/seed/white/300/300',  sector: 'Food Industry' },
  { size: 118, angle: 325, img: 'https://picsum.photos/seed/phone/300/300',  sector: 'Oil & Gas' },
  { size: 135, angle: 15,  img: 'https://picsum.photos/seed/sky/300/300',    sector: 'Perfumes' },
  { size: 122, angle: 55,  img: 'https://picsum.photos/seed/desk2/300/300',  sector: 'Furniture' },
  { size: 105, angle: 95,  img: 'https://picsum.photos/seed/desk1/300/300',  sector: 'Auto Parts' },
  { size: 112, angle: 140, img: 'https://picsum.photos/seed/dark/300/300',   sector: 'Pharma' },
]

const RADIUS = 370

export default function OrbitalRing() {
  const compRef   = useRef<HTMLDivElement>(null)
  const ringRef   = useRef<HTMLDivElement>(null)
  const textRef   = useRef<HTMLDivElement>(null)

  const positionerRefs = useRef<(HTMLDivElement | null)[]>([])
  const counterRefs    = useRef<(HTMLDivElement | null)[]>([])
  const floatRefs      = useRef<(HTMLDivElement | null)[]>([])
  const labelRefs      = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const el = compRef.current
    if (!el) return

    gsap.set(el, { opacity: 0 })
    gsap.set(textRef.current, { opacity: 0 })
    gsap.set(floatRefs.current, { scale: 0 })
    gsap.set(labelRefs.current, { opacity: 0, y: 8 })

    ORB_DATA.forEach((data, i) => {
      const rad = data.angle * (Math.PI / 180)
      gsap.set(positionerRefs.current[i], {
        left: '50%', top: '50%',
        x: Math.cos(rad) * RADIUS,
        y: Math.sin(rad) * RADIUS,
        xPercent: -50, yPercent: -50,
      })
    })

    let ctx: ReturnType<typeof gsap.context> | null = null
    let triggered = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || triggered) return
        triggered = true
        observer.disconnect()

        const spinDuration = 5

        ctx = gsap.context(() => {
          gsap.to(el, { opacity: 1, duration: 0.5, ease: 'power2.out' })
          gsap.to(textRef.current, { opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.3 })

          gsap.to(floatRefs.current, {
            scale: 1, duration: 0.8, stagger: 0.05, ease: 'back.out(1.5)',
          })

          gsap.to(ringRef.current, {
            rotation: 720, duration: spinDuration, ease: 'power4.out',
          })

          gsap.to(counterRefs.current, {
            rotation: -720, duration: spinDuration, ease: 'power4.out',
          })

          // Reveal sector labels after spin completes, one by one
          gsap.to(labelRefs.current, {
            opacity: 1, y: 0,
            duration: 0.55,
            stagger: 0.1,
            ease: 'power2.out',
            delay: spinDuration + 0.1,
          })

          floatRefs.current.forEach((orb) => {
            gsap.to(orb, {
              x: -8 + Math.random() * 16,
              duration: 3 + Math.random() * 2,
              repeat: -1, yoyo: true, ease: 'sine.inOut',
              delay: spinDuration + Math.random(),
            })
            gsap.to(orb, {
              y: -8 + Math.random() * 16,
              duration: 3 + Math.random() * 2,
              repeat: -1, yoyo: true, ease: 'sine.inOut',
              delay: spinDuration + Math.random(),
            })
          })
        }, el)
      },
      { threshold: 0.15, rootMargin: '0px 0px -120px 0px' }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      ctx?.revert()
    }
  }, [])

  return (
    <section className="orbital-section">
      <div ref={compRef} className="orbital-stage">

        <div ref={textRef} className="orbital-center">
          <div className="orbital-eyebrow">24 Companies · 8 Sectors</div>
          <div className="orbital-headline">One portfolio.<br /><em>Infinite reach.</em></div>
        </div>

        <div className="orbital-ring-wrap">
          <div ref={ringRef} className="orbital-ring">
            {ORB_DATA.map((data, i) => (
              <div
                key={i}
                ref={(el) => { positionerRefs.current[i] = el }}
                className="orbital-positioner"
                style={{ width: data.size, height: data.size }}
              >
                <div
                  ref={(el) => { counterRefs.current[i] = el }}
                  className="orbital-counter"
                >
                  <div
                    ref={(el) => { floatRefs.current[i] = el }}
                    className="orbital-orb"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.img} alt="" className="orbital-orb-img" />
                  </div>

                  <div
                    ref={(el) => { labelRefs.current[i] = el }}
                    className="orbital-label"
                  >
                    {data.sector}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
