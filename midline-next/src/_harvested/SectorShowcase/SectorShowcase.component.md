# SectorShowcase — harvested component

| | |
| --- | --- |
| Source | `toyokoh.com` — "Our Business" product grid |
| Footprint (orig) | HTML numbered product cards · `_astro/*.css` · (static) |
| Target | `/companies` → "Our Companies & Services / Eight sectors. One vision." |
| Status | ✅ **applied (live)** · typechecks · 0 new deps |

**What** Grid of numbered cards (number → thumbnail → name → meta → description → Read more), full-card overlay link, hover lift + image zoom.
**Props** `{ items: { href, number, name, thumbnailSrc, thumbnailAlt?, description, meta?, readMoreLabel? }[], className? }`
**Bound content** the 8 Midline sectors from `MIDLINE_SECTORS` → `href=/carousel/<key>`, `thumbnailSrc=/assets/sectors/<key>.png`, `name=sector.title`, `meta=company count`, `description=sector.blurb`.
**Conversion** dark Japanese theme + Cabinet Grotesk + Tailwind arbitrary values → Midline tokens (light card, navy Cormorant name, gold number, mono meta) in a scoped CSS module; brand-logo image → sector name in serif; `description` clamped to 3 lines.
**Replaced** the `SectorCard` grid (`.sectors-grid`) on the companies page.
