# FaqAccordion — harvested component

| | |
| --- | --- |
| **Source site** | `safronhome.com` (Astro static export) |
| **Source page** | `safronhome.com/faqs.html` |
| **Target Midline section** | `/faq` route (`src/app/faq/page.tsx`) — currently a static `PreviewCard` grid |
| **Status** | ✅ converted (behaviour rebuilt, not ported) · typechecks |

## Full footprint (original)
| Piece | Location | Notes |
| --- | --- | --- |
| HTML block | `faqs.html` → `.faqs-container > .faqs-accordions > .faqs-accordion[data-trigger][id]` (+ `.faqs-markers > .faqs-marker[data-scroll-to]`) | accordion + scroll-spy markers |
| CSS | inline `<style>` in `faqs.html` (minified): `.faqs-*` rules | layout + transitions |
| JS | bundled `_astro/*.js` — `data-trigger` open/close + `data-scroll-to` smooth-scroll (GSAP) | **not portable** → rebuilt |
| Assets | none | — |

## What it does
Accessible single-open (optionally multi) FAQ accordion: each question is a button that reveals its answer with a smooth grid-rows expand and a +/- toggle icon.

## Props
```ts
interface FaqItem { eyebrow?: string; q: string; a: string }
interface FaqAccordionProps { items: FaqItem[]; allowMultiple?: boolean; className?: string }
```
Bound to Midline's existing 6 FAQ Q&As (About / Industries / Location / Companies / Partnership / Contact) from `src/app/faq/page.tsx`.

## Dependencies
**None.** React `useState` + CSS module only. (Original GSAP `data-trigger`/scroll-spy bundle intentionally **not** carried over.)

## Animation notes
- Reveal: CSS `grid-template-rows: 0fr → 1fr` on `.panel` (no JS height measurement), `.34s --ease-out`.
- Icon: vertical bar `scaleY(0)` when `[data-open]` → morphs + to −.
- A11y: `<button aria-expanded aria-controls>`, panel `role="region" aria-labelledby`, heading wraps trigger.
- **Reduced motion:** transitions disabled (instant open/close).

## What changed in conversion
| Original | Converted |
| --- | --- |
| `data-trigger` + bundled GSAP toggle | `useState` open-index array + `onClick` |
| DOM IDs hooked by JS | React refs/ids per item; no global ID collisions |
| `data-scroll-to` scroll-spy markers | **dropped** (out of scope for Midline's short FAQ) |
| hard-coded Q&A markup | `items` prop (Midline content) |
| safron colours/`Cinzel` | `var(--navy/--sky/--slate)`, `var(--font-display/--mono/--body)` |
| global `.faqs-*` classes | scoped CSS module |

## Wire-in (Phase 5 target)
In `src/app/faq/page.tsx`, replace the `.preview-grid` of `PreviewCard`s with:
```tsx
<FaqAccordion items={[
  { eyebrow:'About', q:'What is Midline Investment?', a:'…' },
  /* …the 6 existing Q&As… */
]} />
```
