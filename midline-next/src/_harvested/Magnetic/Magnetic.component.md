# Magnetic — harvested component

| | |
| --- | --- |
| Source | `lusion.co` (index/about/projects) — pointer-tracked button pull |
| Footprint (orig) | HTML `[data-magnet]`/hover targets · CSS transforms · bundled JS pointer handler (not portable) |
| Target | wrap any Midline CTA (`btn-primary`/`btn-ghost`) — hero, §M CTA, §L careers |
| Status | ✅ converted · typechecks · **0 new deps** |

**What** Wrapper that eases its child toward the cursor on hover, springs back on leave.
**Props** `{ children, strength?=18, className? }`
**Animation** pointer math → CSS vars `--mx/--my`; `transform` transition `.35s --ease-out`. Reduced motion → disabled.
**Conversion** bundled JS handler → React `onPointerMove`/`onPointerLeave`; no GSAP.
**Wire-in** `<Magnetic><Link className="btn-primary" href="/contact">Get a quote</Link></Magnetic>`
