# CSA Component Library

Tokens, base styles, and components for building on-brand Cloud Security
Alliance pages, apps, and prototypes. This library is the source of
truth for how CSA things look — `csa-component-library-SPEC.md` was the
original spec it was built from, and a handful of early CSA program
pages supplied real markup for nav, carousel, and badges during that
initial build. Those pages have kept evolving independently since; this
library doesn't track them going forward — it's the canonical version
now, not a mirror of theirs.

## Using it

- **Starting a new page:** copy `dist/csa-library.html` *and* the
  `dist/assets/` folder next to it — it's a complete, minimal HTML
  document with every token and component already inlined in a `<style>`
  block, the two required font `<link>` tags in `<head>`, and placeholder
  nav/footer/`<main>` you fill in. Build your content with the classes
  documented in the showcase, and pull logos/icons/illustrations from
  `assets/` by relative path (e.g. `assets/icons/AI-Security.svg`).
- **Font loading — always the two `<link>` tags, never inlined:** any
  page using this library (whether copied from `dist/csa-library.html`
  as-is, or built by pulling these tokens/components into an existing
  site) must keep these as live `<link>` tags in its own `<head>`:
  ```html
  <link rel="stylesheet" href="https://use.typekit.net/tsm2vln.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Red+Hat+Text:wght@400;500;600;700&display=swap">
  ```
  Don't copy/inline the kit's underlying `@font-face` CSS into your own
  stylesheet instead — Adobe's kit is domain-restricted and can change
  its served CSS/font URLs over time, so a live `<link>` stays correct
  automatically and a pasted snapshot can silently stop working. If the
  `<link>` is missing entirely, `--font`/`--font-kicker` (`typography.css`)
  just fall back to the next font in their stack with no error, so it's
  easy to miss without checking.
- **Browsing what's available:** open `src/docs/index.html` in a browser.
  It's the live component showcase — palette swatches, type scale, all 3
  surfaces, every button variant, card-glass, badges, nav, carousel, tabs,
  and real-layout examples built entirely with the library's own classes. It links to the
  `src/` files directly (not `dist/`), so editing any component CSS
  shows up on refresh with no build step.
- **Rebuilding `dist/csa-library.html`** after changing anything in `src/`:

  ```bash
  node build.mjs
  ```

## Styling only, not behavior

This repo defines how CSA things look; each application defines how they
actually work. CSS is portable across static pages, Rails, React, etc.,
and stays within the visual layer — JS behavior is tied to the state and
conventions of whatever app it lives in, so this library **ships no
JS**. `dist/csa-library.html` has zero `<script>` tags.

Most components are pure CSS already (hover states, transitions, the
card-reveal grow animation). The few that used to have a companion
`.js` file — Tabs, Carousel, Tags' filter-toggle/removable behavior —
still document their intended interaction, just as a **BEHAVIOR SPEC**
comment at the top of the component's `.css` file instead of working
code: the markup contract, the expected click/keyboard behavior, and a
link to the relevant WAI-ARIA pattern where one applies. Implement that
contract in whatever fits the consuming app's own stack. This also
happens to work well with LLM-assisted development — the spec tells the
model what a component is supposed to do, and it can generate an
implementation that actually fits the framework it's landing in, rather
than forcing this repo's one-size-fits-all version.

The showcase (`src/docs/index.html`) is the one exception: it runs
small demo-only harnesses for Tabs/Carousel/Tags purely so the page is
interactive to click through. That script is clearly marked
demo-only, lives only in the docs page, and `build.mjs` never bundles
it into `dist/`.

## Project structure

```
src/
  tokens/       colors, typography, spacing, shadows — design tokens only
  base/         reset.css — bare-element resets (*, html, body, a, section);
                icon-glyph.css — shared .csa-icon-glyph mask primitive used
                by tags.css and badges.css
  components/   one CSS file per component — no shipped JS, see
                "Styling only, not behavior" above
  assets/       real brand assets that ship with the library — see below
  docs/         index.html (the showcase) + docs/assets/ (demo-only fixtures,
                not shipped — logos/photos used to illustrate components)
build.mjs       concatenates src/ into dist/csa-library.html,
                copies src/assets/ -> dist/assets/
dist/           csa-library.html + assets/ — together, what teammates copy
```

## Brand assets (`src/assets/`)

Real logos/icons/illustrations, kept separate from `src/docs/assets/`
(which is scoped to showcase-only demo fixtures, not shipped). Copied
into every asset zip as-is — filenames unchanged from the source so
they stay traceable back to the original design files.

| Folder | Count | Format | Naming |
|---|---|---|---|
| `logos/` | 164 | PNG | Mixed — CSA certification/program logos (`{Program}-logo-{CMYK\|RGB\|grayscale\|white}.png`) plus ~52 one-off badges (Credly, membership, STAR, council) |
| `icons/` | 606 | SVG | 101 unique icons × 6 color variants each: base, `-CSA-blue`, `-light-blue`, `-red-orange`, `-white`, `-yellow-orange` |
| `illustrations/` | 182 | PNG | ~33 scenes × 5 variants each: `- dark`, `- light`, `- white bg`, `- dark blue bg`, `- light blue bg` |

A handful of illustration files break that 5-variant pattern — flagging
rather than silently renaming, since I can't tell which file is meant to
be authoritative in the ambiguous cases:

- **Cloud Service Models** has 6 files, not 5: both `- dark blue bg.png`/
  `- light blue bg.png` (the standard pair) *and* `- dark blue.png`/
  `- light blue.png` (no `bg`) — but no plain `- dark.png`/`- light.png`
  like every other illustration has. Looks like the plain variants got
  exported under the wrong name.
- **Virtual Event** has 5 files but two are `- dark blue bg copy.png` /
  `- light blue bg copy.png` sitting alongside non-`copy` versions of the
  same two — and they're not identical (the `copy` files are ~25–35%
  larger). No `- dark.png`/`- light.png` plain variants exist at all for
  this one. Can't tell which of the two (copy vs. non-copy) is the
  current export.
- **AI Threat Radar** and **Blueprint** each have one file named
  `- dark_1.png`/`- light_1.png` instead of `- dark.png`/`- light.png` —
  likely just an export-tool artifact (no competing non-`_1` file exists
  for either), safe to rename if you want the clean pattern.
- **TAISE Group Training** has 6 files: both `- white.png` and
  `- white bg.png`, where every other illustration only has one.

## Class naming

Every class ships prefixed `csa-` (`csa-btn`, `csa-card`, `csa-kicker`, …)
so it can never collide with cloudsecurityalliance.org's own CSS once a
page built with this library gets uploaded there. `data-surface="..."` is
a plain data attribute, not a class — already collision-safe, left
unprefixed.

`*`, `html`, `body`, `a`, and `section` in `base/reset.css` are bare
element selectors — the reset approach CSA's page templates commonly
used when this library was first built. This is intentional, not an
oversight: this library is meant for whole standalone
pages, not fragments dropped into an existing page, so there's no host
content for a bare selector to collide with.

## Tokens

7 color families (not 6 — the spec's palette includes Neutral alongside
Blue/Orange/Teal/Purple/Green/Red), each an 11-step ramp `25`–`800`, named
`--{letter}{ramp}` (e.g. `--b500`, `--o700`, `--n25`). No semantic aliases
(`--csa-blue`, `--navy`, `--ink`, etc.) — see the spec's retirement map if
you're porting old page code. Shadows: only `--shadow-sm` and `--shadow`
exist, per spec. Layout: `--maxw` (1200px) + `.csa-wrap` / `.csa-section`
utilities. Headings: h1–h3 are weight 900, h4 is 700 — the one heading
level that isn't unified to 900.

## Components

| File | Source |
|---|---|
| `surfaces.css` | Built fresh per spec — light/gradient/dark backgrounds + surface-aware `.csa-card` |
| `cards.css` | `.csa-card` shell synthesized from a handful of bespoke card patterns seen across CSA's early pages (no shared class existed at the time); `.csa-card-glass` adds a 16px radius and surface-aware text color on top of the spec's base CSS. Also: `.csa-card-hover` (lift/shadow/border-color modifier, matching the hover treatment consistently used across CSA's early interactive cards), `.csa-card-media` (16:9 image-top card, surface-aware like `.csa-card`), `.csa-card-reveal` (4:3 photo card — kicker + heading sit permanently on a thin frosted-glass strip at the bottom; `.csa-card-reveal-more`/`-more-inner` grow that strip on hover via a `grid-template-rows` 0fr→1fr transition, not `max-height`, so it fits body copy of any length without a guessed cutoff; always dark regardless of page surface), `.csa-go` (shared CTA link utility, `font-size:14.5px` to read as a peer of body copy rather than a caption — `--b500` default, `--b300` on hover and on dark surfaces; promoted out of `carousel.css` where it started), `.csa-card-brand-cloud`/`-ai`/`-zt` (one per CSA sub-brand, white-background only, no `data-surface` variants — top-down fill + gradient border via the same double-background-clip trick buttons.css uses for a gradient border, plus a non-uniform border-width and a hard gradient stop so the border-box layer also carries a solid 4px top accent bar; border gradient (not the top accent, not the fill) swaps colors on `:hover`, and `.csa-go` is recolored to match each brand's own accent), and `.csa-card-quote` (testimonial card — quote glyph, body copy, then a footer with a headshot slot, name, and title; the headshot is a plain `<img>`, not a mask, since a photo doesn't need to recolor with surrounding text the way an icon glyph does). An icon as a card's first child just needs `.csa-icon` — no new class |
| `buttons.css` | `.csa-btn-primary` is always `--o500` — no blue variant, no surface-conditional switching. 4 standardized variants, all surface-aware (work unmodified on light/gradient/dark/black): `.csa-btn-primary`, `.csa-btn-secondary`, `.csa-btn-tertiary`, `.csa-btn-disabled`. `.csa-btn-light`/`.csa-btn-ghost`/`.csa-btn-onnavy` are retired — Disabled replaces Light, Secondary is Ghost renamed (it already worked on dark surfaces unmodified, making Onnavy redundant there). Replaces `.btn-gold`/`.btn-gold-outline` (removed) |
| `badges.css` | The original extracted-as-is glass pill (`.csa-badge-hot`, the spec's "Eyebrow") has been retired. Ships `.csa-badge-primary`/`-secondary`/`-outlined` instead — designed fresh, icon + italic label, surface-aware (light/gradient share one treatment, dark/black another). Icon is either a plain `<img>` (when a pre-colored file exists for the exact color, e.g. Calendar's b500/b100/b300/white variants) or the shared `.csa-icon-glyph` mask primitive (`base/icon-glyph.css`) when it doesn't |
| `nav.css` | Extracted as-is — two real variants, see below. **Not shown in the showcase** (removed per your request) — the component still ships, it's just not documented on the showcase page |
| `hero.css` | Built fresh per spec, informed by the shared real hero structure; also houses `.csa-cta` (the closing promo band, a pattern repeated across most of CSA's early program pages). `.csa-hero-glass`/`-light`/`-dark` nest a plain `.csa-card-glass` inside a `.csa-hero-photo` hero — recreates an earlier glass-panel-over-photo hero treatment used on a couple of CSA's early pages before it was later simplified to a plain gradient (identical values to `.csa-card-glass`'s own dark variant); every text color inside is set explicitly rather than left to the `.csa-hero`/`.csa-card-glass` cascade, since nesting one inside the other creates real specificity collisions between them |
| `icons.css` | Sizing only (default 48px) — color/background treatment is baked into each SVG file in `src/assets/icons/`, see "Icons" below |
| `carousel.css` | Visuals extracted as-is from an early drag/momentum carousel built for one of CSA's program pages, generalized to support multiple carousels per page. Card background is white (not `--n25`) so it reads against a gray section. Cards run narrow enough that the next one peeks into view instead of using an edge fade to hint "more to scroll" — no `--csa-carousel-bg`/background-matching to keep track of on whatever section it sits in. `.csa-carousel-dots`/`.csa-carousel-dot`/`.csa-carousel-dot-active` are an optional progress-dots row below the viewport; which dot is active is real app state (tracks scroll/drag position), same as the rest of the carousel's behavior. **No shipped JS** — see "Styling only, not behavior" below; the drag/momentum/infinite-loop/dot-sync interaction is a BEHAVIOR SPEC comment at the top of the file, not code |
| `tabs.css` | **Designed fresh** — no tabs UI existed elsewhere in the brand system at the time (checked for tablist/tab-panel patterns; none found). **No shipped JS** — see "Styling only, not behavior" below; the WAI-ARIA tabs interaction is a BEHAVIOR SPEC comment at the top of the file, not code |
| `toggles.css` | Two switch patterns extracted from RiskRubric.ai (an existing CSA property): `.csa-toggle-icon` (compact switch, icon per state — that page's own dark-mode switch, thumb slide added since the reference's own thumb doesn't move) and `.csa-toggle-segmented` (two-option segmented control with a sliding highlight — that page's "10 highest/lowest scoring" filter). Segmented toggle colors copied exactly as they render there; the icon toggle's resting-track color is flat library tokens instead (n25/n50/b800 by surface) rather than the reference's own semi-transparent value, for consistency with the rest of the library's "one ramp step off the page" convention. `.csa-toggle-icon-confirm` is a second icon-toggle variant on the same button — X/checkmark instead of sun/moon, green (`--g200`/`--g100`) instead of orange for "on" — for a generic enable/disable toggle rather than one specifically about dark mode. **No shipped JS** — the entire visual state of both is driven by one attribute (`aria-pressed` / `data-selected`) the app flips on click, same minimal contract as `.csa-tag-filter` |
| `tables.css` | Built fresh per your spec — a generic data table: n50 grid lines, a b500 header row, alternating white/n25 body rows. `.csa-table-wrap` exists solely to round the table's corners (12px) — `overflow:hidden` on a separate wrapper, since a `<table>` with `border-collapse:collapse` (needed for single, non-doubled n50 lines between cells) doesn't reliably respect its own `border-radius` across browsers |

### Nav has two real variants

1. **Hub nav** — logo lockup + link row + primary CTA button, the
   treatment used on hub-style landing pages.
2. **Subpage nav** — logo lockup + a single "← back" link, used
   everywhere else.

Both are in `nav.css`. Nav (and footer) content is a placeholder in this
library on purpose — the real site nav replaces it once a page goes live
on cloudsecurityalliance.org.

## Icons

Source: `CSA Brand Guide 20260421.pdf`, "Icon Color Variations" +
"Approved Icon Color & Background Combinations" (pages 15–16). Default
size is **48px**, matching CSA's existing brand pages.

There are 6 style variants per icon in `src/assets/icons/`, and the color
*and* background chip are baked directly into each SVG file — `icons.css`
only handles sizing (`.csa-icon`, `object-fit: contain` to smooth over
slightly inconsistent internal viewBoxes between an icon's chip and
no-chip variants). The only real decision when placing an icon is
*which file* to use for the background it's sitting on:

| Style | File suffix | Approved backgrounds |
|---|---|---|
| Monochrome (default) | *(none)* | White, N25, B25–B50 tint, Gradient |
| Inverse Monochrome (default, dark) | `-white` | B700, N800 |
| Light Blue (subtle grouping) | `-light-blue` | White, N25 |
| CSA Blue (important) | `-CSA-blue` | White, N25, Gradient, B25–B50 tint, B700 |
| Yellow Orange (attention) | `-yellow-orange` | White, N25, B700 |
| Red Orange (bold moment — use sparingly) | `-red-orange` | B700 only |

Rules from the brand guide: don't mix multiple icon styles within the
same section; don't use low-contrast combinations; use color to
communicate importance, not decoration. The showcase's Icons section
renders this whole table live with a real icon (`Shield-Keyhole`) so
it's a working reference, not just a static picture.

This is step one of three you asked for — establishing the color/background
foundation. Layout examples that feature icons, and adding icons to
badges, are follow-ups, not done yet.

## Border radius nesting

When a rounded component sits inside another rounded container, the inner
radius should read as visibly smaller than the outer one — not equal, or
the corners look like a coincidence rather than a system. The real
precedent for this is `.csa-card-glass` itself: an earlier standalone
use of this same glass-panel treatment was 16px, while a version nested
inside another rounded container (a 20px-rounded band) used 12px.
Default `.csa-card-glass` to the 16px standalone case; scale it down
(e.g. 12px) if you nest it inside another rounded container. The showcase's own demo wrappers (`.docs-surface-demo`,
`.docs-glass-demo`, 20px) follow the same rule around the 16px `.csa-card`
/ `.csa-card-glass` they contain.

## Flagged conflicts / decisions made while building

These came up while reconciling the spec against real markup from CSA's
early program pages — resolved per your direction, noted here for
visibility:

- **No tabs component existed elsewhere in the brand system yet.** Per
  your direction, `tabs.css` was designed fresh, following the system's
  existing conventions (underline-indicator style, `data-surface`-aware
  active color mirroring `.csa-btn-primary`) rather than extracted.
- **`.btn-primary` color disagreed across CSA's early pages**: blue on
  one, hardcoded orange on the others. Per your call, resolved to
  always `--o500` — no blue variant, no surface-conditional switching.
- **Hero/CTA kicker color**: `.csa-hero`/`.csa-cta` are always-dark bespoke
  backgrounds, not tied to `data-surface`, so the generic
  `[data-surface="dark"] .csa-kicker` rule never reached them — wired
  directly in `hero.css` instead. Per your call, the two are split to
  match their real precedent: `.csa-hero .csa-kicker`/`.csa-kicker-sub`
  is `--b300` (those early pages hardcoded the hero kicker to blue,
  `#0093ff`), while `.csa-cta`'s stays `--o500` (matching the other dark
  blocks on those same pages — advisory/mission/sage — which use orange).
- **`.csa-card`'s shape (radius/padding/shadow)** has no single spec value
  — none of those early pages used a shared `.card` class, each had
  bespoke one-off variants in the 14–16px radius / 28–32px padding
  range. Picked 16px / 32px / `--shadow-sm` as a synthesis of that range.
- **`.csa-badge-hot` (the original extracted glass pill) is retired.** It
  wasn't used anywhere in the showcase, only mentioned in passing text, so
  it was dropped in favor of documenting just the Primary/Secondary/
  Outlined set it was never actually shown alongside.
- **`.csa-tag-icon-glyph`/`.csa-badge-icon-glyph` were merged into one
  shared `.csa-icon-glyph` primitive** (`base/icon-glyph.css`) — both were
  the identical mask + `currentColor` technique with only the
  custom-property name and size differing, which is exactly how their
  sizes (14px vs 13px) drifted out of sync before being caught. Each
  component now only sets its own size, scoped under its own ancestor
  class, on top of the one shared definition. **Known limitation:**
  `mask-image` doesn't render under the `file://` protocol (confirmed by
  testing) — fine for a real deployed page, but a blank glyph if
  `dist/csa-library.html`/`dist/preview/index.html` is opened by
  double-click instead of served. See the comment on `.csa-icon-glyph`
  in `base/icon-glyph.css` for the workaround (inline the SVG with
  `fill="currentColor"` instead) if that matters for your use case.
- **h3/h4 stay unset at the token level (`typography.css`) — deliberate,
  not an oversight.** Unlike h1/h2 (each only ever appears in one shape),
  h3 already needs a different size in nearly every context it's used
  in: a standard `.csa-card` heading, a `.csa-card-reveal` strip's
  compact heading, a `.csa-card-glass` panel's heading, a carousel card
  title (`.csa-carousel-card h3`, in `carousel.css`) — one library-wide
  h3 size would be wrong for most of those. What WAS wrong: each of
  those contexts had its font-size/margin repeated as an inline style
  on every individual heading in the docs (drifting between 19px/20px
  with no real reason), instead of being scoped once per context.
  Consolidated into `.csa-card h3`, `.csa-card-glass h3`, and
  `.csa-card-reveal-head h3` in `cards.css`, plus `#surfaces h3` in the
  docs page's own `<style>` block for the Surfaces section's demo-only
  heading (not a real component usage, so it doesn't belong in
  `cards.css`). h4 has no real usage yet (appears once, in the
  type-scale demo itself) — nothing to consolidate there.
