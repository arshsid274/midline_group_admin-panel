# Midline — Layout & Harvested Components (master index)

> Harvest of section components from sibling static sites → converted to React for Midline. Branch `feat/harvested-components`. Staging: `src/_harvested/` (nothing wired into live files until approved in Phase 5).
>
> **Sources discovered** (parent folder, all static unless noted): `Extracted html css`, `aircenter-space`, `indigo-laboratory-it` (Nuxt export), `lusion_mirror`, `offmenu-design`, `safronhome.com`, `springs-next`, `terminal-industries.com` (Nuxt export), `toyokoh`, `www.ssyenc.com`, `www.verkos.ai` (Framer export). `created_next_component` skipped (no HTML — local React scratch).
>
> **IP note:** only interaction *technique/structure* was harvested; markup rebuilt original, all colours/fonts/content remapped to **Midline tokens + Midline content**. No third-party brand copy, logos, or images imported.

## Phase 1 — Midline section inventory (target = source of truth)

| Section | File | Content | Component kind | Existing impl |
| --- | --- | --- | --- | --- |
| Nav | `components/Nav.tsx` | logo · Companies/About/Global/Contact · Get A Quote | sticky glass navbar | ✅ custom |
| §A Hero | `components/ScrollAssembleHero.tsx` | slogan → MIDLINE wordmark, Burlington image grows fullscreen | scroll-pinned GSAP hero | ✅ custom (strong) |
| §B Purpose | `app/page.tsx` `.home-band` | "Disciplined capital…" | full-bleed statement band | ✅ |
| §C Stats | `components/HeroStats.tsx` | 34 companies · 8 sectors · 9 countries | count-up stat row | ✅ custom |
| §D Sector orbit | `components/OrbitalCarousel.tsx` + `OrbitalRing.tsx` | 8 sectors → `/carousel/[slug]` | 3D scroll-jacked carousel | ✅ custom (signature) |
| §E Sector narrative | `app/page.tsx` | "we partner with them" | text + reveal | ✅ |
| §F Our Companies | `app/page.tsx` `.company-strip` | 8 flagship companies | horizontal **marquee/scroll strip** | ⚠️ manual scroll |
| §G Why Midline | `app/page.tsx` + `PreviewCard` | 3 value cards | reveal card grid | ✅ |
| §H Approach | `app/page.tsx` + `PreviewCard` | Select→Strengthen→Compound | reveal card grid | ✅ |
| §I Sustainability | `app/page.tsx` + `PreviewCard` | E/S/G cards | reveal card grid | ✅ |
| §J Global Presence | `components/PresenceCard.tsx` | 9 locations | location grid | ✅ custom |
| §K Insights | `app/page.tsx` + `PreviewCard` | 3 news cards | reveal card grid | ✅ (placeholder copy) |
| §L Careers | `app/page.tsx` `.home-band--careers` | image band + CTA | full-bleed CTA band | ✅ |
| §M CTA | `app/page.tsx` `.home-band` | "Let's build something lasting" | dark CTA band | ✅ |
| Footer | `components/Footer.tsx` | multi-column sitemap | footer | ✅ |
| Sector detail | `app/carousel/[slug]/` | video hero + company cards | video hero + sticky card stack | ✅ custom (`CompanyElicaStack`) |
| **/faq** | `app/faq/page.tsx` | 6 Q&As | **accordion** | ⚠️ static card grid |
| /companies, /about, /global, /partners, /contact | `app/*/page.tsx` | sub-pages | card grids / forms | ✅ |

## Phase 3 — Mapping (Midline section → source block → fit → status)

| Midline section | Source block | Site | Fit /5 | Reason | Status |
| --- | --- | --- | --- | --- | --- |
| §F Our Companies | `.marquee-css` (CSS marquee) | safronhome.com | 4 | auto-scroll display-type strip; upgrades the manual scroll; premium serif fits Midline | **harvested → `Marquee`** |
| /faq | `.faqs-accordion` (`data-trigger`) | safronhome.com | 4 | accordion is the right pattern for Q&A; rebuilt clean (GSAP bundle dropped) | **harvested → `FaqAccordion`** |
| §A Hero | pinned/scroll heroes | lusion, toyokoh | 2 | Midline's GSAP assemble hero already superior | skipped |
| §D Sector orbit | WebGL/sticky showcases | lusion, indigo, terminal | 2 | entangled WebGL/Nuxt bundles; Midline's orbital is the signature | skipped |
| §J Global Presence | location/map blocks | ssyenc, toyokoh | 2 | Midline's `PresenceCard` grid already covers it | skipped |
| §C Stats | counters | terminal, ssyenc | 2 | `HeroStats` already does count-up | skipped |
| Sector detail sticky stack | pinned horizontal showcase | lusion, toyokoh | 3 | `CompanyElicaStack` already does pinned stack; possible future enhancement | needs-build (later) |

## New dependencies to approve
**None.** Both harvested components are pure React + CSS modules (no GSAP/Framer/vendor lib added). Original safron JS bundles (`data-css-marquee`, GSAP `data-trigger`) were **not** carried over.

## Midline sections with no source match (build-from-scratch if desired)
- None *required* — every Midline section either already has a strong custom impl or got a harvested upgrade (§F, /faq).
- Optional future: a pinned horizontal "showcase" for the sector detail page (technique exists on lusion/toyokoh but is WebGL/bundle-entangled → recommend fresh build, not port).

## Harvested components (in `src/_harvested/`) — 9 total, all typecheck, 0 new deps
| Component | Source site | Technique | Target Midline section | Status |
| --- | --- | --- | --- | --- |
| `Marquee` | safronhome.com | CSS keyframe marquee | home §F Our Companies | ✅ **applied (live)** |
| `FaqAccordion` | safronhome.com | grid-rows accordion | `/faq` | ✅ **applied (live)** |
| `StickyFeature` | toyokoh.com | sticky two-column scroll | home §H Our Approach | ✅ **applied (live)** |
| `Magnetic` | lusion.co | pointer-pull hover | home CTAs §F/§L/§M | ✅ **applied (live)** |
| `Timeline` | ssyenc.com | IntersectionObserver milestones | `/about` Group at a Glance | ✅ **applied (live)** |
| `HoverImageList` | offmenu.design | cursor-following image reveal | `/companies` Explore by sector | ✅ **applied (live)** |
| `SplitText` | offmenu.design | masked word/char rise-in | any section title | ✅ staged |
| `BentoGrid` | terminal-industries.com | asymmetric tile grid | §G Why / §I Sustainability | ✅ staged |
| `Gallery` | toyokoh.com | CSS scroll-snap strip | sector detail / `/about` | ✅ staged |

> All six are pure React + CSS modules — **no GSAP/Framer/jQuery/vendor libs added**. Original JS bundles (safron `data-css-marquee` & GSAP `data-trigger`, lusion pointer handler, offmenu Next chunk, ssyenc jQuery, toyokoh Astro scroll) were dropped and rebuilt with hooks + cleanup. Content/assets are Midline-only.
