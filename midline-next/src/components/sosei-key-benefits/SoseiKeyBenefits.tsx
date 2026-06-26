'use client'

import { useEffect, useRef } from 'react'
import './SoseiKeyBenefits.css'
import { initSoseiCanvases } from './soseiCanvas'

/**
 * SoseiKeyBenefits — "Key Benefits / Advantage" section (English), Next.js.
 * Sizing is scoped via --sosei-u in SoseiKeyBenefits.css (NOT a global html
 * font-size), so it never rescales the rest of the site. Desktop: sticky 3-layer
 * clip-wipe image swap. Mobile: per-item WebGL shader photo (soseiCanvas.ts) with
 * an <img> fallback. `npm i three`; copy ./assets -> /public/sosei, ./fonts -> /public/fonts.
 */

export interface SoseiKeyBenefitsProps {
  assetBase?: string
  className?: string
}

const ADV: Record<string, { pc: string; pc2x: string; sp: string; sp2x: string }> = {
  '01': { pc: 'i_sosei-advantage_01.OZ4hFF1P_ZBeJvF.webp', pc2x: 'i_sosei-advantage_01@2x.CTFLbGP6_ZR7Abf.webp', sp: 'i_sosei-advantage_01.f3tK6AiP_L5LuJ.webp', sp2x: 'i_sosei-advantage_01@2x.CsyjZ9yn_OuNC7.webp' },
  '02': { pc: 'i_sosei-advantage_02.bqUKDpcV_ZOUrG2.webp', pc2x: 'i_sosei-advantage_02@2x.3ZXeDOkO_Z2qSeaq.webp', sp: 'i_sosei-advantage_02.BuBmjhex_1uAkJK.webp', sp2x: 'i_sosei-advantage_02@2x.DusyePOk_ZinC8h.webp' },
  '03': { pc: 'i_sosei-advantage_03.CRv-txMy_ZY20Xt.webp', pc2x: 'i_sosei-advantage_03@2x.BzP15H6J_ZtJvW3.webp', sp: 'i_sosei-advantage_03.BdyHHiVx_29MPfR.webp', sp2x: 'i_sosei-advantage_03@2x.8hnbWWNI_jW2aN.webp' },
  '04': { pc: 'i_sosei-advantage_04.tX6Q28Qe_1kXcsI.webp', pc2x: 'i_sosei-advantage_04@2x.RUFbVmRZ_XtWcB.webp', sp: 'i_sosei-advantage_04.BpkRzU3E_Z1ogBjK.webp', sp2x: 'i_sosei-advantage_04@2x.BccNpE-B_Z1T753j.webp' },
  '05': { pc: 'i_sosei-advantage_05.CtOizdW1_19Qyoz.webp', pc2x: 'i_sosei-advantage_05@2x.CO3tKxfu_2lYtng.webp', sp: 'i_sosei-advantage_05.DMNVVER0_ZhiSHO.webp', sp2x: 'i_sosei-advantage_05@2x.BZlawwwY_12lb49.webp' },
}
const CURRENT = ['01', '02', '03', '04', '05']
const NEXT = ['02', '03', '04', '05']
const AFTER_NEXT = ['03', '04', '05']

const STEPS = [
  { n: '01', canvas: 'i_sosei-advantage_01.jpg', title: 'Construction completed in a short period of time without interrupting factory operations', body: 'Since the work is only done on the roof surface, it does not affect indoor operations and can be done in a short period of time. We will plan the work according to your factory environment and conditions. In addition, our overwhelming construction capabilities allow us to complete the work in a short period of time, leading to shorter construction periods and lower costs.' },
  { n: '02', canvas: 'i_sosei-advantage_02.jpg', title: 'Prepare for frequent natural disasters such as earthquakes, torrential rains, and typhoons', body: 'Climate change due to global warming is expected to continue, and the environment surrounding buildings is becoming increasingly harsh. The lightweight, seamless, waterproof and tough coating helps prevent slates from cracking and scattering due to strong winds, prevents leaks due to heavy rain, and reduces the risk of roofing and ceiling materials falling off into the building.' },
  { n: '03', canvas: 'i_sosei-advantage_03.jpg', title: 'The heat insulation effect improves the working environment and energy conservation while providing comfort in both summer and winter.', body: 'The insulating effect of SOSEI foam is far superior to that of heat-shielding paint, and significantly reduces the heat impact from the roof surface. It is particularly effective for buildings that do not have insulation installed in the attic. In addition, by reducing heat penetration from the roof, energy savings can be expected through improved air conditioning efficiency.' },
  { n: '04', canvas: 'i_sosei-advantage_04.jpg', title: 'Solar panels can also be installed. There is also a chance to sell the electricity.', body: 'Even if there is no open space on the ground, there is plenty of open space on the roof. Even on roofs where it was previously difficult to install solar panels due to load-bearing and strength issues, the lightweight and strong coating of the SOSEI method may make it possible to install solar panels. In addition, the insulation effect of the SOSEI method makes it possible to save and create energy.' },
  { n: '05', canvas: 'i_sosei-advantage_05.jpg', title: 'This construction is friendly to workers and the environment, preventing falls and scattering of asbestos.', body: "Conventional repair methods raise concerns about asbestos scattering during the cleaning process. In addition, much of the work involves work on the slate surface, exposing workers to danger. With the SOSEI method, the simultaneous application of SOSEI Foam and SOSEI Coat seals in asbestos without the need for high-pressure cleaning, while ensuring the safety of workers' feet during construction." },
]

const easeInOutPow2 = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)

export default function SoseiKeyBenefits({ assetBase = '/sosei', className }: SoseiKeyBenefitsProps) {
  const rootRef = useRef<HTMLElement>(null)
  const src = (f: string) => `${assetBase}/${f}`

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    // MaskText reveal
    root.querySelectorAll<HTMLElement>('[data-mask-text]').forEach((group) => {
      group.querySelectorAll<HTMLElement>('[data-mask-text-item]').forEach((item, i) => {
        item.style.setProperty('--mt-delay', (i * 0.08).toFixed(2) + 's')
      })
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { group.classList.add('-show'); io.unobserve(group) } }),
        { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
      )
      io.observe(group)
    })

    // desktop image-swap (clip-path wipe driven by scroll progress)
    const desktop = window.matchMedia('(min-width: 821px)')
    const textList = root.querySelector<HTMLElement>('[data-advantage-text-list]')
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-advantage-text-item]'))
    const layers = [
      { sel: '[data-layer="current"]', phase: 0 },
      { sel: '[data-layer="next"]', phase: 0.5 },
      { sel: '[data-layer="afterNext"]', phase: 0.75 },
    ]
      .map((l) => {
        const layer = root.querySelector(l.sel)
        if (!layer) return null
        const imgs = Array.from(layer.querySelectorAll<HTMLElement>('.ProductAdvantage-image'))
        imgs.forEach((img, i) => { img.style.zIndex = String(imgs.length - i) })
        return { imgs, phase: l.phase }
      })
      .filter(Boolean) as { imgs: HTMLElement[]; phase: number }[]

    // read the real rendered image height (the --sosei-u custom property holds a
    // calc() that getComputedStyle won't resolve to px)
    const wrapper = root.querySelector<HTMLElement>('.ProductAdvantage-imageWrapper')
    const imgH = () => wrapper?.getBoundingClientRect().height || (parseFloat(getComputedStyle(root).getPropertyValue('--sosei-u')) || 16) * 29.0625
    let yStart = 0
    let yDistance = 1
    let thresholds: number[] = []

    const measure = () => {
      if (!desktop.matches || !items.length || !textList) return
      const h = imgH()
      const r = (window.innerHeight - h) / 2
      const sy = window.scrollY
      yStart = items[0].getBoundingClientRect().top + sy - r
      const yEnd = items[items.length - 1].getBoundingClientRect().bottom + sy - r - h
      yDistance = Math.max(1, yEnd - yStart)
      const listH = textList.clientHeight || 1
      thresholds = []
      let cum = 0
      items.forEach((it) => {
        const ratio = Math.round((it.getBoundingClientRect().height / listH) * 100) / 100
        cum = Math.min(Math.round((cum + ratio) * 100) / 100, 1)
        thresholds.push(cum)
      })
    }
    const update = () => {
      if (!desktop.matches) return
      const progress = clamp((window.scrollY - yStart) / yDistance, 0, 1)
      layers.forEach(({ imgs, phase }) => {
        imgs.forEach((img, i) => {
          const idx = i + 1
          const s = thresholds[idx - 1] != null ? thresholds[idx - 1] : 0
          const rr = thresholds[idx]
          const a = rr == null || rr <= s ? 0 : (progress - s) / (rr - s) + phase
          img.style.clipPath = `inset(0% 0% ${(easeInOutPow2(clamp(a, 0, 1)) * 100).toFixed(2)}% 0%)`
        })
      })
    }
    let ticking = false
    // re-measure on every frame: this section sits below the pinned hero + 1000vh
    // carousel + foundation, whose ScrollTrigger pin-spacers shift our absolute
    // position after mount. Recomputing yStart from live rects keeps the swap correct.
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { measure(); update(); ticking = false }) } }
    const onResize = () => { measure(); update() }
    measure()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('load', onResize)
    // belt-and-suspenders: re-measure once the other pinned modules settle
    window.addEventListener('sah:ready', onResize)
    window.addEventListener('oc:restored', onResize)
    const settle = window.setTimeout(onResize, 800)

    const disposeCanvas = initSoseiCanvases(root, assetBase)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onResize)
      window.removeEventListener('sah:ready', onResize)
      window.removeEventListener('oc:restored', onResize)
      clearTimeout(settle)
      disposeCanvas()
    }
  }, [assetBase])

  const layer = (nums: string[], attr: string, marker: string, cls: string) => (
    <div className={cls} data-layer={marker}>
      {nums.map((n) => (
        <div key={n} className="ProductAdvantage-image" {...{ [attr]: '' }}>
          <picture>
            <source media="(max-width: 820.98px)" srcSet={`${src(ADV[n].sp)} 1x, ${src(ADV[n].sp2x)} 2x`} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src(ADV[n].pc)} srcSet={`${src(ADV[n].pc)} 1x, ${src(ADV[n].pc2x)} 2x`} alt="" className="ProductAdvantage-imageSrc" loading="lazy" />
          </picture>
        </div>
      ))}
    </div>
  )

  return (
    <section ref={rootRef} className={`sosei-root ProductAdvantage${className ? ` ${className}` : ''}`}>
      <div className="ProductAdvantage-inner">
        <div className="SectionTitle ProductAdvantage-title" data-mask-text>
          <h2 className="SectionTitle-title" data-mask-text-item>
            (<span className="SectionTitle-titleText">Advantage</span>)
          </h2>
          <h3 className="SectionTitle-lead" data-mask-text-item>
            Key <br className="_sp" />Benefits
          </h3>
        </div>

        <div className="ProductAdvantage-content">
          <div className="ProductAdvantage-imageWrapper _pc">
            {layer(AFTER_NEXT, 'data-advantage-after-next-image-item', 'afterNext', 'ProductAdvantage-imageAfterNext')}
            {layer(NEXT, 'data-advantage-next-image-item', 'next', 'ProductAdvantage-imageNext')}
            {layer(CURRENT, 'data-advantage-image-item', 'current', 'ProductAdvantage-imageCurrent')}
          </div>

          <div className="ProductAdvantage-textWrapper" data-advantage-text-list>
            {STEPS.map((step) => (
              <div key={step.n} className="ProductAdvantage-textItem" data-mask-text data-advantage-text-item>
                <div
                  className="ProductAdvantage-image _sp"
                  data-image-canvas={JSON.stringify({ src: [step.canvas], cornerSize: 8, observe: true })}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src(ADV[step.n].sp)} srcSet={`${src(ADV[step.n].sp)} 1x, ${src(ADV[step.n].sp2x)} 2x`} alt="" className="ProductAdvantage-imageSrc" loading="lazy" />
                </div>
                <p className="ProductAdvantage-textNumber" data-mask-text-item>
                  (<span className="ProductAdvantage-textNumberText">{step.n}</span>)
                </p>
                <h3 className="ProductAdvantage-itemTitle" data-mask-text-item>{step.title}</h3>
                <p className="ProductAdvantage-itemDescription" data-mask-text-item>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
