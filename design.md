# Design — StatementFlow

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

## Genre
modern-minimal (dev-tool / utility register)

## Macrostructure family

- Marketing pages (`index.html`): Marquee Hero — Cobalt hero variant (title/lede/CTA left, dark graphite demo-card right; no fake browser chrome).
- App pages (`standardbank.html`, `gotyme.html`): Workbench — the tool itself is the content; sequence is drop-zone → action row → status → stats → filters → table → raw-lines diagnostic → footnote.

## Theme — Cobalt

Cool engineered light canvas, one electric-cobalt signal accent, hairline structure, code/data as the hero. See `styles/tokens.css` for the full OKLCH values. Light is the default; dark is an opt-in toggle (persisted to `localStorage`, key `sf-theme`) using the graphite tones as a full dark mode rather than Cobalt's usual single dark band.

- `--color-paper`   oklch(98.5% 0.004 250)
- `--color-ink`     oklch(24% 0.02 258)
- `--color-ink-2`   oklch(34% 0.018 257)
- `--color-rule`    oklch(90% 0.01 250)
- `--color-accent`  oklch(58% 0.20 256)
- `--color-focus`   oklch(58% 0.20 256)
- `--color-debit`   oklch(52% 0.16 25)   (financial semantic — not in base Cobalt spec, added for transaction tables)
- `--color-credit`  oklch(50% 0.15 152)  (financial semantic — not in base Cobalt spec, added for transaction tables)

## Typography
- Display: Space Grotesk, weight 600, style normal
- Body: Inter, weight 400/500
- Mono: JetBrains Mono, weight 400/500/600 — labels, eyebrows, tabular numbers, code/data card
- Display tracking: -0.01em
- Type scale anchor: `--text-display` = clamp(2.75rem, 3.2vw + 2rem, 4.5rem)

## Spacing
4-point named scale in `styles/tokens.css` (`--space-3xs` … `--space-3xl`). Pages use named tokens only.

## Motion
- Easings: `--ease-out` cubic-bezier(0.16,1,0.3,1) — the only easing used on UI state.
- Reveal pattern: none — content is present on load; no scroll-triggered fades (this is a utility tool, not a marketing scroll).
- Reduced-motion fallback: durations collapse to 1ms.

## Microinteractions stance
- Silent success (CSV download/copy shows inline label change, not a toast).
- Focus rings appear instantly, never transitioned.
- ⌘K / Ctrl+K opens a real command palette on every page (`asset/cmdk.js`) — click or keyboard, Esc closes, arrow keys navigate.

## CTA voice
- Primary: solid `--color-accent` fill, `--color-accent-ink` text, 6px radius, no pill, no gradient.
- Secondary: bordered, `--color-paper-2` fill, hairline border.

## Per-page allowances
- Marketing page (`index.html`) may use the dark graphite demo-card band.
- App pages must not use enrichment — the live tool carries the page.

## What pages MUST share
- The wordmark (`StatementFlow.`) and the cobalt accent dot.
- The accent colour and its placement (≤ 5% of any viewport — one button, one status colour, focus rings).
- Space Grotesk + Inter + JetBrains Mono.
- The ⌘K pill + theme toggle in the nav.
- Ft2 inline single-line footer.

## What pages MAY differ on
- Macrostructure within the page-type family.
- Hero/header content.

## Nav / footer
- Nav: N13 — inline ⌘K search pill, bordered, sticky, blur backdrop.
- Footer: Ft2 — inline single line, hairline rule above, no columns.

## Exports

### tokens.css
See [`styles/tokens.css`](styles/tokens.css) — the canonical, only copy. Do not duplicate values inline anywhere else in the codebase.
