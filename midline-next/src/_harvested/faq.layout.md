# /faq — section layout

| | |
| --- | --- |
| **Route** | `src/app/faq/page.tsx` |
| **Intended layout** | subhero (FAQ eyebrow + "Frequently asked questions") → single-column **accordion** of Q&As, left-aligned, hairline dividers, mono category eyebrow per row |
| **Chosen component** | `FaqAccordion` (`src/_harvested/FaqAccordion/`) |
| **Bound content** | the 6 existing Midline Q&As: About · Industries · Location · Companies · Partnership · Contact |
| **Replaces** | the static `PreviewCard` grid currently under "What people ask us most" |
| **Why** | accordion = correct pattern for scannable Q&A; lighter, expandable, accessible; keeps the same copy |
