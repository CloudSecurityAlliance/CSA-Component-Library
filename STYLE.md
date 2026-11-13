# CSA Component Library — Style Guide for Building Pages

How to build an on-brand CSA web page with this library. Written to be handed to a person
**or** pasted into an AI tool (Claude Code, etc.) before it writes any markup.

- **Library source:** https://github.com/CloudSecurityAlliance/CSA-Component-Library
- **Live class reference (the showcase):** `src/docs/index.html` in the repo — every component,
  built with the library's own classes. When this guide and the showcase disagree on a detail,
  check the component's CSS file in `src/components/` (most start with a markup contract).

Using the library is a **hard requirement**, not optional styling guidance: it's the source of
truth for how every CSA property looks.

---

## 1. Setup — copy this page skeleton

No build step and no download needed: the CSS loads straight from the GitHub repo through
jsDelivr.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page title</title>

<!-- Fonts: keep both links exactly as-is (see note below) -->
<link rel="stylesheet" href="https://use.typekit.net/tsm2vln.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Red+Hat+Text:wght@400;500;600;700&display=swap">

<!-- The whole library, all 36 stylesheets in order, as one file -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/combine/gh/CloudSecurityAlliance/CSA-Component-Library@main/src/tokens/colors.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/tokens/typography.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/tokens/spacing.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/tokens/shadows.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/base/reset.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/base/icon-glyph.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/base/utility.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/base/spacing-helpers.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/base/color-helpers.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/base/fixes.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/surfaces.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/action.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/cards.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/buttons.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/badges.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/tags.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/nav.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/hero.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/icons.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/carousel.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/tabs.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/toggles.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/tables.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/filters.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/pagination.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/forms.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/progress.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/accordion.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/columns.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/grid.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/sep.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/lists.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/latest-brief.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/promo-band.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/team.css,gh/CloudSecurityAlliance/CSA-Component-Library@main/src/components/modal.css">
</head>
<body>

  <!-- sections go here — see §3 -->

</body>
</html>
```

- **Fonts.** Keep both font `<link>` tags as shipped — never copy/inline the font CSS. The brand
  font (Azo Sans, via Typekit) only loads on approved CSA domains; on a local file or any other
  domain the page falls back to Red Hat Text. That's expected, not a bug.
- **`@main` = always the latest library.** jsDelivr can take up to ~12 hours to pick up a new
  push. For a page that must never change unexpectedly, swap `@main` for a specific commit
  (e.g. `@18b8140`) in every path.
- **Working inside a clone of the repo instead?** Link the same files directly, in the same
  order — the showcase's `<head>` (`src/docs/index.html`) is the template.

---

## 2. Rules

1. **Library classes only.** Every class is one of the library's own `csa-` classes, used the way
   the showcase uses it (same wrappers, same `data-surface` usage). No lookalike custom classes.
2. **No ad-hoc CSS that imitates a component.** About to write CSS for a card, button, badge,
   nav, hero, tabs, carousel, toggle, table or form? Check the showcase first — it's almost
   certainly there.
3. **Styling only, no behavior.** The library ships no JavaScript. Tabs, carousel, filter tags,
   toggles and pagination need a little JS for interaction; each one's expected behavior is
   written as a **BEHAVIOR SPEC** comment at the top of its CSS file. Implement that, don't
   invent a different interaction.
4. **Placeholders, not real brand assets.** Don't pull logos, icons, illustrations or photos from
   `src/assets/` to fill layout slots. Use an obviously fake placeholder (a labeled gray box, a
   placeholder `<svg>`, or a file named like `PLACEHOLDER-hero-image.jpg`) so it's clear real
   asset selection is a follow-up step.
5. **Flag anything new.** If a pattern truly doesn't exist (checked the showcase *and* the CSS
   files), build it — but mark it at the point of use with
   `<!-- NEW COMPONENT NEEDED: what and why -->`, follow the library's conventions (`csa-`
   prefix, tokens, `data-surface` awareness), and list every new component at the end of your
   output with why the library didn't cover it. Never paper over a gap silently.

---

## 3. Page structure

```html
<section class="csa-section" data-surface="light">
  <div class="csa-wrap">
    <span class="csa-kicker">Kicker</span>
    <h2 class="csa-title">Section heading</h2>
    <div class="csa-rule"></div>
    <p class="csa-block">Intro paragraph.</p>
    <!-- content -->
  </div>
</section>
```

- `.csa-section` = 92px top/bottom padding (`-small` 32px, `-medium` 64px, `-large` 128px).
  `.csa-wrap` = centered, max 1200px wide.
- **`data-surface`** goes on each section/band and sets its background plus the colors of every
  component inside it: `light` (white), `gradient` (soft blue-white), `dark` (navy), `black`.
- **`data-tone`** (optional, alongside `data-surface`) nudges a band one step:
  `data-surface="light" data-tone="neutral"` → light-gray band with white cards;
  `data-surface="dark" data-tone="deep"` → deeper navy band.
- **Heroes and CTA bands** (`.csa-hero`, `.csa-cta`) are always dark by design — **don't** put
  `data-surface` on them.
- **There is no footer component.** Use a simple placeholder footer and flag it (rule 5).

---

## 4. Type and color

| Use | Markup |
|---|---|
| Headings | `<h1 class="csa-title">` … `<h4 class="csa-title">` — **bare h1–h4 are unstyled**, always add `csa-title` (`csa-subtitle` for a subtitle) |
| Eyebrow above an h1/h2 | `<span class="csa-kicker">` |
| Label above an h3, or a standalone label | `<span class="csa-kicker-sub">` |
| Blue kicker instead of orange | add `csa-kicker-blue` to either |
| Lead paragraph (18px) | `<p class="csa-block">` |
| Body (16px) | plain `<p>` |
| Short/supporting paragraph (14.5px) | `<p class="csa-block-small">` |
| Dates, bylines, footnotes, captions (12px) | `<span class="csa-caption">` — short lines only |
| Orange accent bar under a heading | `<div class="csa-rule"></div>` |
| Thin divider | `<hr class="csa-hr">` |

**Colors** are CSS variables named `--{family}{step}`: families `b` (blue), `o` (orange),
`t` (teal), `p` (purple), `g` (green), `r` (red), `n` (neutral); steps `25 50 75 100 200 … 800`
(e.g. `var(--b800)` navy, `var(--b500)` CSA blue, `var(--o500)` orange). Components already set
their own colors per surface — reach for variables only in your own layout glue. `.csa-color-*`
/ `.csa-bg-*` helper classes exist but use `!important`; don't put them on components.

---

## 5. Components — quick reference

Short snippets of the common pieces. Full examples and every variant: the showcase.

**Buttons** — always on `.csa-btn`; group with `.csa-buttons`. All work on any surface.
```html
<div class="csa-buttons">
  <a class="csa-btn csa-btn-primary" href="#">Primary</a>
  <a class="csa-btn csa-btn-secondary" href="#">Secondary</a>
  <a class="csa-btn csa-btn-tertiary" href="#"><span class="csa-btn-label">Tertiary</span></a>
  <a class="csa-btn csa-btn-disabled" href="#" aria-disabled="true" tabindex="-1">Disabled</a>
</div>
```
Tertiary **needs** the `.csa-btn-label` span (its underline is drawn on it). Sizes: add
`csa-btn-sm` / `csa-btn-lg`; full width: `csa-btn-block`.

**Text link with arrow** — `<a class="csa-go" href="#">Learn more →</a>`

**Cards**
```html
<div class="csa-card csa-card-hover">        <!-- -hover: lift on hover, whole card clickable -->
  <span class="csa-kicker-sub">Label</span>
  <h3 class="csa-title">Card heading</h3>
  <p>Body copy.</p>
  <a class="csa-go" href="#">Learn more →</a>
</div>
```
Variants: plain `.csa-card` · `.csa-card-raised` (stronger shadow) · `.csa-card-disabled` ·
`.csa-card-media` (image on top) · `.csa-card-reveal` (photo, copy reveals on hover) ·
`.csa-card-flip` (turns over on click) · `.csa-card-quote` (testimonial) ·
`.csa-card-glass` (frosted glass, for use **over a photo**; add `csa-card-glass-light` for
light glass) · brand cards `.csa-card-brand-cloud|-ai|-zt` (white backgrounds only).
Put cards in a grid (layout below) for rows.

**Badges and tags**
```html
<div class="csa-badges">
  <span class="csa-badge csa-badge-primary">Coming soon</span>   <!-- -secondary -outlined -orange -->
</div>
<div class="csa-tags">
  <span class="csa-tag csa-tag-neutral">Static tag</span>        <!-- -blue -orange -->
  <button type="button" class="csa-tag csa-tag-filter csa-tag-blue" aria-pressed="false">Filter tag</button>
</div>
```

**Icons** — `<img class="csa-icon" src="…" alt="">` (48px; `csa-icon-small` 32px,
`csa-icon-large` 56px). Icon + text on one line:
`<span class="csa-icon-text"><img src="…" alt=""><span>Label</span></span>` (a plain icon here
is 14px). Use placeholders for the icon files (rule 4).

**Hero** (dark navy; `csa-hero csa-hero-light` for the light version)
```html
<div class="csa-hero csa-hero-navy">
  <div class="csa-wrap">
    <span class="csa-kicker">Kicker</span>
    <h1 class="csa-title">Hero heading</h1>
    <p class="csa-sub">Supporting line.</p>
    <div class="csa-hero-cta">
      <a class="csa-btn csa-btn-primary" href="#">Primary action</a>
      <a class="csa-btn csa-btn-secondary" href="#">Secondary</a>
    </div>
  </div>
</div>
```
Photo + glass panel: `<div class="csa-hero csa-hero-photo csa-hero-glass csa-hero-glass-dark"
style="background-image:url('PLACEHOLDER-hero.jpg')">` with the content inside a
`<div class="csa-card-glass">` within `.csa-wrap` (`-glass-light` for a light panel).
More variants (`-glass-graphic`, `-split-graphic`): showcase "Hero examples".

**Closing CTA band** — a rounded dark panel; place it inside a section's `.csa-wrap` (e.g.
`<section class="csa-section" data-surface="light"><div class="csa-wrap">…</div></section>`).
It has no background of its own: it needs a photo (the library blurs and darkens it). Without
one the band is transparent and its white text disappears.
```html
<div class="csa-cta" style="background-color:var(--b800)">   <!-- navy stand-in until a real photo is chosen -->
  <img class="csa-cta-photo-bg" src="PLACEHOLDER-cta-photo.jpg" alt="">
  <div class="csa-cta-content">
    <h2 class="csa-title">Call to action heading</h2>
    <p>Short supporting copy.</p>
    <div class="csa-cta-row"><a class="csa-btn csa-btn-primary" href="#">Get started</a></div>
  </div>
</div>
```

**Layout**
```html
<div class="csa-grid csa-grid-1 csa-grid-md-2 csa-grid-lg-3">   <!-- 1 col → 2 at 768px → 3 at 1024px -->
  <div class="csa-cell"><div class="csa-card">…</div></div>
  <div class="csa-cell"><div class="csa-card">…</div></div>
</div>
<div class="csa-columns">                                         <!-- flex columns, stack <640px -->
  <div class="csa-column csa-column-two-thirds">…</div>
  <div class="csa-column csa-column-third">…</div>
</div>
```
Spacing helpers: `csa-{m|p}{t|b|l|r|x|y}-{0–6}` = 0/4/8/12/16/24/48px (e.g. `csa-mt-5`,
`csa-mx-auto`). Alignment: `csa-text-center`, `csa-center`. Screen-reader-only text:
`csa-sr-only`.

**Also in the library** (markup in the showcase and each CSS file's header):
lists `ul.csa-list` · stat separators `.csa-sep` · forms (`.csa-field`, `.csa-label`,
`.csa-input`, `.csa-textarea`, `.csa-select`, `.csa-checkbox`, `.csa-radio`, `.csa-field-hint`,
`.csa-field-error`) · tables `.csa-table-wrap > table.csa-table` · accordion (native
`<details>`, no JS) · tabs, carousel, pagination, filters, toggles, action tiles (`.csa-action`),
progress bars (`.csa-progress`) · bookmark button (`.csa-bookmark-btn`) · research ticker
(`.csa-latest-brief`) · promo band (`.csa-promo-band`) · team members (`.csa-team-card`) ·
modal (`<dialog class="csa-modal" popover>`, no JS) · nav `.csa-nav`.

---

## 6. Common mistakes

- Bare `<h2>` → unstyled. Always `class="csa-title"`.
- Tertiary button without `<span class="csa-btn-label">` → no underline.
- `data-surface` on a hero or CTA → don't; they're dark by design.
- Glass card on a plain background → it needs a photo/busy background behind it to read as glass.
- CTA band with no photo → transparent band, invisible white text. Keep the navy stand-in until
  the photo is chosen.
- Font CSS inlined or font links removed → silent fallback to a generic font.
- Real CSA logos/icons/illustrations dropped into slots → use placeholders (rule 4).
- A custom card/button/badge style → check the showcase; it already exists.
- Something genuinely new built without a `NEW COMPONENT NEEDED` flag → flag it.
