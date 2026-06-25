# Debugging rule — "heading text not visible" (LayingTheFoundation)

A fixed, in-order checklist. Do the steps **top to bottom** and stop at the first one that fixes it. Each step says what to check and what it means.

---

## STEP 0 — Hard refresh (do this EVERY time before judging)
The #1 false alarm. The browser keeps **stale JS**, so old code (that set `opacity:0`) is still running.
- **⌘⇧R** (hard reload). If unsure: Safari **Develop → Empty Caches**, then reload.
- If it still looks old: in the terminal **stop `npm run dev` (Ctrl+C) and start it again**, then hard reload. HMR sometimes doesn't swap a client component cleanly.

✅ After a *clean* reload, re-check. Most "still not there" reports are stale cache.

---

## STEP 1 — Is the text in the DOM?
Inspect → find `<h2 ... data-reveal="true">`.

| What you see | Meaning | Fix |
| --- | --- | --- |
| `<h2 …>Built for stewardship…</h2>` (text inside) | text is rendered → it's a **style** problem → go to STEP 2 | — |
| `<h2 … aria-label="Built for stewardship…"></h2>` (text only in `aria-label`, body empty) | **SplitText corrupted it** (Strict-Mode double-split) | do **not** use `new SplitText` here; animate the whole `<h2>` or split letters in JSX |
| no `<h2 data-reveal>` at all | component not rendering / wrong file | confirm `<LayingTheFoundation/>` is in `page.tsx` |

---

## STEP 2 — Read the `<h2>`'s styles (select it → **Styles** + **Computed**)
Check the **inline `style=""`** first, then the **Computed** tab.

| Symptom | Cause | Fix |
| --- | --- | --- |
| inline `style="opacity: 0"` | a JS lib (GSAP `from`/`set`) set it and never restored it (tween orphaned by Strict-Mode) | remove GSAP from the heading; reveal with a **transform-only** CSS class. The `.heading { opacity:1 !important }` safeguard already overrides this — if you still see it, you didn't hard-refresh (STEP 0) |
| Computed `opacity: 0` but **no** inline | a CSS rule hides it | search the Styles pane for `opacity` — find which rule, set it to 1 |
| inline `transform: translate(0, NNpx)` and stuck | from-state of an interrupted tween | same as above — transform-only CSS reveal can't stick |
| Computed `color` ≈ page background (e.g. white on `--cloud`) | invisible text | give `.heading` an explicit dark `color` (already set to `--ink`) |
| Computed `height: 0` or `display: none` | collapsed/hidden box | check the `<h2>` and its parents' `display`/`height` |
| Computed `visibility: hidden` | hidden by CSS/anti-FOUC | the `visibility:visible !important` safeguard covers this |

---

## STEP 3 — Is it positioned off-screen or behind something?
Still in the inspector, with the `<h2>` selected, look at the **highlight overlay** in the page.

| Symptom | Cause | Fix |
| --- | --- | --- |
| overlay is at the very top, **under the nav bar** | `position: sticky; top: <small>` pins it behind the fixed site nav | use `position: relative` (done for mobile) **or** set `top` below the nav height (e.g. `top: 5rem`) |
| overlay is **above** the viewport / way up | a negative margin pulled it off | check `.track { margin-top }` / `.section { margin-bottom }` — reduce the negative value |
| overlay is where it should be, but covered by a card/blob | a sibling with higher paint order overlaps it | bump `.heading { z-index }` above the overlapping element (cards are `z-index:1` area; heading is `3`) |

---

## STEP 4 — Is the reveal JS even running?
Only matters if the heading is hidden *by JS*.
- Console: paste
  ```js
  const h = document.querySelector('[data-reveal]');
  console.log({ text: h?.textContent, opacity: getComputedStyle(h).opacity, color: getComputedStyle(h).color, top: h?.getBoundingClientRect().top });
  ```
- `text` empty → STEP 1 (SplitText). `opacity` `0` → STEP 2. `top` huge/negative → STEP 3.

---

## The nuclear option (guaranteed visible, then re-add animation)
If you just need it on screen NOW, temporarily strip the reveal:
1. In `LayingTheFoundation.tsx`, comment out the heading `mm.add('(prefers-reduced-motion…')` block.
2. The `<h2>` is now a plain, always-visible heading (no JS touches it).
3. Confirm the text shows. Then re-introduce the **CSS `.headingReveal`** (transform-only) — never an opacity/SplitText reveal.

---

## The standing rule for THIS component
- **Never animate the heading's `opacity` or use `SplitText` here.** Both can leave it permanently invisible on this Strict-Mode + heavily-pinned page.
- The heading must be **visible by default**; any reveal animates **`transform` only**.
- The `.heading { opacity:1 !important; visibility:visible !important }` safeguard in `LayingTheFoundation.module.css` is intentional — don't remove it.
