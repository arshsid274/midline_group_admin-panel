# SplitText — harvested component

| | |
| --- | --- |
| Source | `offmenu.design` (heading word-reveal) |
| Footprint (orig) | HTML masked word spans · CSS overflow/transform · bundled split JS |
| Target | any section title (reusable) — e.g. wrap `section-title` text |
| Status | ✅ staged · typechecks · **0 new deps** |

**What** Splits text into words/chars, each in an `overflow:hidden` mask; inner spans rise in on scroll, staggered.
**Props** `{ text, by?='word', staggerMs?=40, className? }`
**Animation** `IntersectionObserver` (effect+cleanup) toggles `.shown`; per-unit `transition-delay`; `--ease-expo`. Reduced motion → shown.
**Conversion** bundled Splitting/GSAP JS → DOM split + observer; renders inline `<span aria-label>` with `aria-hidden` units.
**Wire-in** `<h2 className="section-title"><SplitText text="We build futures" /></h2>`
