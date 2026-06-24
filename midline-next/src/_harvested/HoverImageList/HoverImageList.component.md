# HoverImageList — harvested component

| | |
| --- | --- |
| Source | `offmenu.design` (index work/list) — hovering a row reveals a cursor-following image |
| Footprint (orig) | HTML index list · CSS · Next chunk JS (pointer follow) — behaviour rebuilt |
| Target | a **Sectors index** or **Companies** list (alt to the orbital carousel / `/companies`) |
| Status | ✅ converted · typechecks · **0 new deps** |

**What** A list of rows; hovering a row reveals its image, which follows the cursor.
**Props** `{ items: { label, meta?, image, href? }[], className? }` — bind to Midline's 8 sectors (`label`=name, `meta`=market, `image`=`/assets/sectors/*.png`, `href`=`/carousel/<slug>`).
**Animation** `useState` active row + ref pointer math → CSS vars `--ix/--iy`; cross-fade. Reduced motion / touch → image hidden, plain list.
**Conversion** bundled pointer JS → React refs + `onPointerMove`; images swapped to Midline assets.
**Wire-in** drop under a "Sectors" or "Companies" section heading.
