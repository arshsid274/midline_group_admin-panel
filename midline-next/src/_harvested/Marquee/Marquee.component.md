# Marquee — harvested component

| | |
| --- | --- |
| **Source site** | `safronhome.com` (Astro static export) |
| **Source page** | `safronhome.com/index.html` |
| **Target Midline section** | Home §F "Our Companies" teaser (and reusable for a Partners strip) |
| **Status** | ✅ converted · typechecks |

## Full footprint (original)
| Piece | Location | Notes |
| --- | --- | --- |
| HTML block | `index.html` → `.clip-marquee > [data-css-marquee].marquee-css > [data-css-marquee-list].marquee-css__list > .marquee-css__item > .marquee-css__item-p` | List/item structure |
| CSS | inline `<style>` in `index.html` (minified): `.marquee-css`, `.marquee-css__list`, `.marquee-css__item`, `.marquee-css__item-p`, `.marquee-css__item-p span` | layout only; **no `@keyframes`** found |
| JS | bundled `_astro/*.js` `data-css-marquee` helper (translates the list) | not portable — reimplemented |
| Assets | none (pure text) | — |

## What it does
Infinite horizontal marquee of large display-type items with a gold separator between each.

## Props
```ts
interface MarqueeProps {
  items: string[]          // text items (repeated to loop)
  durationSec?: number     // one full loop, default 40
  reverse?: boolean        // reverse direction
  separator?: string       // glyph between items, default "—"
  className?: string
}
```

## Dependencies
**None.** Pure React + CSS module. No GSAP/Framer/vendor lib. (Original relied on a bundled `data-css-marquee` JS helper — dropped.)

## Animation notes
- Two identical `<ul>` tracks; both `@keyframes mq-scroll` translateX `0 → -100%`, `linear infinite` → seamless loop.
- `:hover` → `animation-play-state: paused`. `data-reverse` flips direction.
- Edge fade via `mask-image`.
- **Reduced motion:** animation off; one static track, `overflow-x:auto` (manually scrollable). Duplicate track `aria-hidden`.

## What changed in conversion
| Original | Converted |
| --- | --- |
| JS-driven `data-css-marquee` scroll | CSS `@keyframes` (no JS) |
| `#0b0b0b` text, `#967544` accent, `Cinzel`/`New Icon Script` | `var(--navy)`, `var(--gold)`, `var(--font-display)` |
| hard-coded marquee text | `items` prop |
| global classes | scoped CSS module |

## Wire-in (Phase 5 target)
Replace the manual `.company-strip` in `src/app/page.tsx` §F with:
```tsx
<Marquee items={['Midline Aviation','ARCO Oil & Gas','Ard Al Teeb','ARC Auto Spare Parts','Midline Trend Building','Acacus Juice & Milk','Trivix Pharma','Al Sanidan Furniture']} durationSec={48} />
```
