#!/usr/bin/env node
// Concatenates src/ into a single dist/csa-library.html — the flat file
// teammates copy as the starting point for a new on-brand page — and
// copies src/assets/ (logos, icons, illustrations) to dist/assets/
// alongside it. Binary images don't inline into a text file usefully
// the way CSS/JS do, so dist is "the html file + its assets folder"
// as one deployable unit, not a single file.
// Usage: node build.mjs

import { readFileSync, writeFileSync, readdirSync, cpSync, rmSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function readFiles(dir, names) {
  return names.map(name => readFileSync(join(__dirname, dir, name), 'utf8')).join('\n');
}

// Explicit order matters: tokens before base before components, and
// within components, surfaces before cards/buttons/badges/etc. so later
// rules can rely on earlier custom properties and base element styles.
const TOKEN_FILES = ['colors.css', 'typography.css', 'spacing.css', 'shadows.css'];
const BASE_FILES = ['reset.css', 'icon-glyph.css', 'utility.css'];
const COMPONENT_CSS_FILES = [
  'surfaces.css',
  'action.css',
  'cards.css',
  'buttons.css',
  'badges.css',
  'tags.css',
  'nav.css',
  'hero.css',
  'icons.css',
  'carousel.css',
  'tabs.css',
  'toggles.css',
  'tables.css',
  'columns.css',
  'grid.css',
  'sep.css',
];
const css = [
  readFiles('src/tokens', TOKEN_FILES),
  readFiles('src/base', BASE_FILES),
  readFiles('src/components', COMPONENT_CSS_FILES),
].join('\n\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CSA Component Library</title>
<!-- Typekit: azo-sans-web + peridot-pe-variable. Google Fonts: Red Hat Text
     (true fallback per spec — not Inter). Both required on every page. -->
<link rel="stylesheet" href="https://use.typekit.net/tsm2vln.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Red+Hat+Text:wght@400;500;600;700&display=swap">
<style>
${css}
</style>
</head>
<body>

<!-- ====================================================================
     This file is a COPY-PASTE STARTING POINT, not a page. Duplicate it
     to start a new on-brand page, then:
       1. Replace the <header>/<footer> placeholders below with the real
          cloudsecurityalliance.org nav/footer once this page goes live.
       2. Build your content using the csa- prefixed classes documented
          in src/docs/index.html (the showcase).
     ==================================================================== -->

<header class="csa-nav">
  <div class="csa-wrap csa-nav-inner">
    <!-- NAV PLACEHOLDER — replace with the real site nav on launch -->
    <span class="csa-brand">
      <span class="csa-muted">[ CSA / CSAI brand lockup placeholder ]</span>
    </span>
    <a class="csa-nav-backlink" href="#">[ nav placeholder ]</a>
  </div>
</header>

<main>
  <!-- Your page content goes here. -->
</main>

<footer style="background:var(--b800);color:var(--n100);padding:44px 0;font-size:13px">
  <div class="csa-wrap" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:14px">
    <!-- FOOTER PLACEHOLDER — replace with the real site footer on launch -->
    <span>[ footer placeholder ]</span>
  </div>
</footer>

</body>
</html>
`;

writeFileSync(join(__dirname, 'dist/csa-library.html'), html);
console.log('Built dist/csa-library.html (%d bytes)', Buffer.byteLength(html));

rmSync(join(__dirname, 'dist/assets'), { recursive: true, force: true });
cpSync(join(__dirname, 'src/assets'), join(__dirname, 'dist/assets'), { recursive: true });
console.log('Copied src/assets/ -> dist/assets/ (logos, icons, illustrations)');

// dist/preview/ — the showcase (src/docs/index.html) as a standalone,
// double-click-able bundle, for sharing this project with people who
// won't run a local server. src/docs/index.html itself is dev-mode: it
// links every component CSS file individually from src/ (so edits show
// up on refresh with no build step) — that's what this inlines, using
// the same compiled CSS dist/csa-library.html already builds above. The
// showcase's own demo-only <script> (interaction harnesses for tabs/
// carousel/tags, plus the palette renderer and mobile nav toggle — none
// of it part of the shipped library) stays inline as-is; nothing to
// rewrite there.
// Image paths need NO rewriting: dist/preview/index.html sits exactly
// one level under dist/, the same depth src/docs/index.html sits under
// src/, so its existing `../assets/icon.svg` references already resolve
// straight to the dist/assets/ built above — reusing it rather than
// copying the whole (50MB+) asset library a second time. The docs-only
// demo photos are the one path that needs its own copy: they're
// referenced bare (`assets/photo.jpg`, no `../`) since they normally
// come from src/docs/assets/, a separate, much smaller (~3.5MB) folder
// that dist/assets/ was never meant to include.
let previewHtml = readFileSync(join(__dirname, 'src/docs/index.html'), 'utf8')
  .replace(/(<link rel="stylesheet" href="\.\.\/[^"]+">\n?)+/, `<style>\n${css}\n</style>\n`);

mkdirSync(join(__dirname, 'dist/preview'), { recursive: true });
writeFileSync(join(__dirname, 'dist/preview/index.html'), previewHtml);
console.log('Built dist/preview/index.html (%d bytes)', Buffer.byteLength(previewHtml));

rmSync(join(__dirname, 'dist/preview/assets'), { recursive: true, force: true });
cpSync(join(__dirname, 'src/docs/assets'), join(__dirname, 'dist/preview/assets'), { recursive: true });
console.log('Copied src/docs/assets/ -> dist/preview/assets/ (demo photos only — icons/logos are shared from dist/assets/ via ../, not duplicated)');
