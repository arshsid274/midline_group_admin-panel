# Timeline — harvested component

| | |
| --- | --- |
| Source | `ssyenc.com` (company history / group section) |
| Footprint (orig) | HTML history list · CSS line/dots · `js/page/company/group.js` scroll-reveal |
| Target | `/about` (company story) or home "Our Approach" / a "Milestones" band |
| Status | ✅ converted · typechecks · **0 new deps** |

**What** Vertical milestone timeline with a gradient spine, dots, and scroll-reveal per item.
**Props** `{ items: { marker, title, body? }[], className? }`. Use confirmed facts for `marker` (avoid invented years) — e.g. `HQ · Burlington Tower, Dubai`, `8 sectors`, `9 countries`, `34 companies`.
**Animation** `IntersectionObserver` (effect + `disconnect()` cleanup) toggles `.shown` (fade+rise). Reduced motion → all shown.
**Conversion** jQuery/scroll handler → IntersectionObserver; colours → Midline tokens (gold markers).
**Wire-in** `<Timeline items={[…]} />` inside an About/Approach section.
