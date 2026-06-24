# Home §F "Our Companies" — section layout

| | |
| --- | --- |
| **File** | `src/app/page.tsx` (§F block) |
| **Intended layout** | section eyebrow "Our Companies" + title "A portfolio of market leaders" → full-bleed **auto-scrolling marquee** of company names (large Cormorant italic, gold separators) → "View all companies" CTA |
| **Chosen component** | `Marquee` (`src/_harvested/Marquee/`) |
| **Bound content** | the 8 flagship companies (Midline Aviation, ARCO Oil & Gas, Ard Al Teeb, ARC Auto Spare Parts, Midline Trend Building, Acacus Juice & Milk, Trivix Pharma, Al Sanidan Furniture) |
| **Replaces** | the manual `.company-strip` horizontal scroller |
| **Why** | continuous motion reads more premium and "alive" than a static scroll row; pauses on hover; reduced-motion falls back to a manual scroll row |
| **Reusable** | same component can drive a Partners logo/name strip on `/partners` |
