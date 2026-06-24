# Gallery — harvested component

| | |
| --- | --- |
| Source | `toyokoh.com` (image strip) |
| Footprint (orig) | HTML strip · `_astro/*.css` · scroll/drag JS |
| Target | sector detail page or `/about` (project/facility imagery) |
| Status | ✅ staged · typechecks · **0 new deps** |

**What** Horizontal scroll-snap image gallery with captions.
**Props** `{ items: { image, caption?, alt? }[], className? }` — use Midline's own assets only.
**Animation** native CSS `scroll-snap-type: x mandatory` (touch/trackpad/keyboard); presentational, no `'use client'`.
**Conversion** scroll/drag JS → CSS scroll-snap (no JS); tokens/shadows → Midline; `loading="lazy"` + alt.
**Wire-in** `<Gallery items={[{ image:'/assets/…', caption:'…' }]} />`
