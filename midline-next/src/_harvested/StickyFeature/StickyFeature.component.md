# StickyFeature — harvested component

| | |
| --- | --- |
| Source | `toyokoh.com` (pinned two-column section) |
| Footprint (orig) | HTML two-col block · `_astro/*.css` `position:sticky` + transitions · scroll JS |
| Target | home **Our Approach** §H (Select→Strengthen→Compound) or "How we work" |
| Status | ✅ converted · typechecks · **0 new deps** |

**What** Left column pins (eyebrow + heading + counter) while right-column panels scroll past; active panel brightens.
**Props** `{ eyebrow?, heading, panels: { step?, title, body }[], className? }`. Bind to Midline's Approach steps.
**Animation** CSS `position: sticky` (no JS for the pin) + `IntersectionObserver` (effect + cleanup) for the active-panel counter/dim. Collapses to one column < 860px and under reduced motion.
**Conversion** Astro/scroll JS → CSS sticky + IntersectionObserver; tokens → Midline.
**Wire-in** replace the §H `preview-grid` with `<StickyFeature eyebrow="Our Approach" heading="Active owners, not passive capital" panels={[…]} />`.
