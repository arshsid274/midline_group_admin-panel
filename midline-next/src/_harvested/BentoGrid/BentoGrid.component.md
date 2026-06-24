# BentoGrid — harvested component

| | |
| --- | --- |
| Source | `terminal-industries.com` (tiled feature section) |
| Footprint (orig) | HTML tile grid · `_nuxt/*.css` grid/spans · (static) |
| Target | home §G Why Midline or §I Sustainability (alt to `preview-grid`) |
| Status | ✅ staged · typechecks · **0 new deps** |

**What** Asymmetric 4-col grid of feature tiles with `wide`/`tall` spans and optional navy `accent` tiles.
**Props** `{ items: { eyebrow?, title, body?, span?, accent? }[], className? }`
**Animation** none (pure CSS grid); presentational, no `'use client'`.
**Conversion** Nuxt markup → typed React; hard-coded colours → Midline tokens (accent uses navy gradient + gold eyebrow).
**Wire-in** `<BentoGrid items={[{title:'Multi-sector resilience',span:'wide',accent:true}, …]} />`
