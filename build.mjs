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
const BASE_FILES = ['reset.css', 'icon-glyph.css', 'utility.css', 'spacing-helpers.css', 'color-helpers.css'];
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
  'filters.css',
  'pagination.css',
  'forms.css',
  'progress.css',
  'accordion.css',
  'columns.css',
  'grid.css',
  'sep.css',
  'lists.css',
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

// dist/icons.html — searchable showcase of every icon in the library.
// Reads src/assets/icons/ at build time so new icons appear automatically
// on the next build without editing this file. Color variants are derived
// from the base name: {name}-csa-blue.svg, b500/{name}-b500.svg, etc.
const VARIANT_SUFFIXES = ['-csa-blue','-light-blue','-white','-red-orange','-yellow-orange','-b100','-b300','-b500','-n400','-o200','-o300','-o700'];
const BRAND_NAMES = new Set(['ai-brand', 'cloud-brand', 'zero-trust-brand']);

const allRootIcons = readdirSync(join(__dirname, 'src/assets/icons'))
  .filter(f => f.endsWith('.svg'))
  .map(f => f.slice(0, -4))
  .filter(name => !VARIANT_SUFFIXES.some(s => name.endsWith(s)))
  .sort();

const iconData = JSON.stringify(
  allRootIcons.map(name => ({ name, brand: BRAND_NAMES.has(name) }))
);

const iconsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CSA Icon Library</title>
<link rel="stylesheet" href="https://use.typekit.net/tsm2vln.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Red+Hat+Text:wght@400;500;600;700&display=swap">
<style>
${css}

/* ── Icon showcase page ─────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }
body { background: var(--n25); color: var(--n700); }

.ico-header { background: white; border-bottom: 1px solid var(--n50); padding: 40px 0 32px; }
.ico-header h1 { margin: 0 0 8px; }
.ico-header p { margin: 0; font-size: 15px; color: var(--n400); }

.ico-controls {
  position: sticky; top: 0; z-index: 20;
  background: rgba(255,255,255,.95); backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--n50);
  padding: 12px 0;
}
.ico-controls-inner { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

.ico-search {
  flex: 0 0 220px;
  height: 36px; padding: 0 12px;
  border: 1px solid var(--n100); border-radius: 6px;
  font-size: 13.5px; font-family: inherit; color: var(--n700);
  background: white;
  outline: none;
}
.ico-search:focus { border-color: var(--b300); box-shadow: 0 0 0 3px rgba(0,147,255,.15); }

.ico-variants { display: flex; gap: 6px; flex-wrap: wrap; }
.ico-variant-btn {
  height: 32px; padding: 0 13px;
  border: 1px solid var(--n100); border-radius: 6px;
  font-size: 12.5px; font-weight: 600; font-family: inherit;
  color: var(--n500); background: white;
  cursor: pointer; transition: border-color .12s, background .12s, color .12s;
  white-space: nowrap;
}
.ico-variant-btn:hover { border-color: var(--b300); color: var(--b400); }
.ico-variant-btn.active { background: var(--b500); border-color: var(--b500); color: white; }
.ico-variant-btn[data-variant="white"].active { background: var(--n700); border-color: var(--n700); }
.ico-variant-sep { width: 1px; height: 24px; background: var(--n75); align-self: center; flex-shrink: 0; }

.ico-count { margin-left: auto; font-size: 12.5px; color: var(--n300); white-space: nowrap; }

.ico-main { padding: 28px 0 72px; }

.ico-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
  border-radius: 16px;
  transition: background .2s, padding .2s;
}
.ico-grid.dark { background: var(--b800); padding: 20px; }

.ico-card {
  background: white; border: 1px solid var(--n50); border-radius: 10px;
  padding: 20px 10px 13px;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  cursor: pointer; transition: border-color .13s, box-shadow .13s;
  min-width: 0;
}
.ico-card:hover { border-color: var(--b200); box-shadow: 0 2px 10px rgba(0,0,0,.08); }
.ico-card[hidden] { display: none; }

.ico-grid.dark .ico-card { background: var(--b700); border-color: var(--b600); }
.ico-grid.dark .ico-card:hover { border-color: var(--b400); box-shadow: 0 2px 10px rgba(0,0,0,.3); }

.ico-card img { width: 56px; height: 56px; display: block; }

.ico-card-name {
  font-size: 10.5px; font-family: ui-monospace, Menlo, monospace;
  color: var(--n400); text-align: center; line-height: 1.45;
  word-break: break-all; width: 100%;
}
.ico-grid.dark .ico-card-name { color: var(--n200); }

.ico-card-tag {
  display: inline-block; margin-top: 2px;
  font-size: 9px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  color: var(--b400); font-family: inherit;
}

.ico-toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(8px);
  background: var(--n800); color: white;
  font-size: 13px; padding: 8px 16px; border-radius: 8px;
  opacity: 0; transition: opacity .2s, transform .2s; pointer-events: none;
}
.ico-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

.ico-empty { grid-column: 1/-1; padding: 48px 0; text-align: center; color: var(--n300); font-size: 14px; }

@media (max-width: 600px) {
  .ico-controls-inner { gap: 8px; }
  .ico-search { flex: 1 0 160px; }
  .ico-count { width: 100%; margin-left: 0; }
}
</style>
</head>
<body>

<div class="ico-header">
  <div class="csa-wrap">
    <h1 class="csa-title">Icon Library</h1>
    <p>${allRootIcons.length} icons &mdash; 6 color variants each. Click any icon to copy its filename.</p>
  </div>
</div>

<div class="ico-controls">
  <div class="csa-wrap ico-controls-inner">
    <input class="ico-search" id="icoSearch" type="search" placeholder="Search icons&hellip;" autocomplete="off" spellcheck="false">
    <div class="ico-variants" id="icoVariants">
      <button class="ico-variant-btn active" data-variant="default">Default</button>
      <button class="ico-variant-btn" data-variant="csa-blue">CSA Blue</button>
      <button class="ico-variant-btn" data-variant="light-blue">Light Blue</button>
      <button class="ico-variant-btn" data-variant="white">White</button>
      <button class="ico-variant-btn" data-variant="red-orange">Red Orange</button>
      <button class="ico-variant-btn" data-variant="yellow-orange">Yellow Orange</button>
      <span class="ico-variant-sep"></span>
      <button class="ico-variant-btn" data-variant="b100">B100</button>
      <button class="ico-variant-btn" data-variant="b300">B300</button>
      <button class="ico-variant-btn" data-variant="b500">B500</button>
      <button class="ico-variant-btn" data-variant="n400">N400</button>
      <button class="ico-variant-btn" data-variant="o200">O200</button>
      <button class="ico-variant-btn" data-variant="o300">O300</button>
      <button class="ico-variant-btn" data-variant="o700">O700</button>
    </div>
    <span class="ico-count" id="icoCount"></span>
  </div>
</div>

<main class="ico-main">
  <div class="csa-wrap">
    <div class="ico-grid" id="icoGrid"></div>
  </div>
</main>

<div class="ico-toast" id="icoToast"></div>

<script>
(function () {
  var ICONS = ${iconData};

  var VARIANTS = {
    'default':      { suffix: '',              dir: '',      dark: false, mono: true  },
    'csa-blue':     { suffix: '-csa-blue',     dir: '',      dark: false, mono: false },
    'light-blue':   { suffix: '-light-blue',   dir: '',      dark: false, mono: false },
    'white':        { suffix: '-white',        dir: '',      dark: true,  mono: true  },
    'red-orange':   { suffix: '-red-orange',   dir: '',      dark: false, mono: false },
    'yellow-orange':{ suffix: '-yellow-orange',dir: '',      dark: false, mono: false },
    'b100':         { suffix: '-b100',         dir: 'b100/', dark: false, mono: true  },
    'b300':         { suffix: '-b300',         dir: 'b300/', dark: false, mono: true  },
    'b500':         { suffix: '-b500',         dir: 'b500/', dark: false, mono: true  },
    'n400':         { suffix: '-n400',         dir: 'n400/', dark: false, mono: true  },
    'o200':         { suffix: '-o200',         dir: 'o200/', dark: false, mono: true  },
    'o300':         { suffix: '-o300',         dir: 'o300/', dark: false, mono: true  },
    'o700':         { suffix: '-o700',         dir: 'o700/', dark: false, mono: true  },
  };

  var grid      = document.getElementById('icoGrid');
  var search    = document.getElementById('icoSearch');
  var countEl   = document.getElementById('icoCount');
  var toast     = document.getElementById('icoToast');
  var toastTimer;
  var currentVariant = 'default';

  function iconSrc(icon, variantId) {
    if (icon.brand) return 'assets/icons/' + icon.name + '.svg';
    var v = VARIANTS[variantId];
    return 'assets/icons/' + v.dir + icon.name + v.suffix + '.svg';
  }

  // Build cards once; swap src and show/hide on interaction.
  var cards = ICONS.map(function (icon) {
    var card = document.createElement('div');
    card.className = 'ico-card';
    var img = document.createElement('img');
    img.src = iconSrc(icon, 'default');
    img.alt = '';
    img.width = 56;
    img.height = 56;
    var nameEl = document.createElement('div');
    nameEl.className = 'ico-card-name';
    nameEl.textContent = icon.name;
    if (icon.brand) {
      var tag = document.createElement('span');
      tag.className = 'ico-card-tag';
      tag.textContent = 'brand';
      nameEl.appendChild(document.createElement('br'));
      nameEl.appendChild(tag);
    }
    card.appendChild(img);
    card.appendChild(nameEl);
    card.addEventListener('click', function () { copyIcon(icon); });
    grid.appendChild(card);
    return { el: card, img: img, icon: icon };
  });

  function applyVariant(variantId) {
    currentVariant = variantId;
    var dark = VARIANTS[variantId].dark;
    grid.classList.toggle('dark', dark);
    cards.forEach(function (c) {
      c.img.src = iconSrc(c.icon, variantId);
    });
  }

  function applySearch(q) {
    var term = q.trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (c) {
      var match = !term || c.icon.name.indexOf(term) !== -1;
      c.el.hidden = !match;
      if (match) visible++;
    });
    // empty state
    var empty = document.getElementById('icoEmpty');
    if (!visible && !empty) {
      empty = document.createElement('div');
      empty.id = 'icoEmpty';
      empty.className = 'ico-empty';
      empty.textContent = 'No icons match "' + q.trim() + '"';
      grid.appendChild(empty);
    } else if (empty) {
      if (visible) { empty.remove(); }
      else { empty.textContent = 'No icons match "' + q.trim() + '"'; }
    }
    countEl.textContent = visible + ' of ' + ICONS.length + ' icons';
  }

  function iconHtml(icon, variantId) {
    var v = VARIANTS[variantId];
    var src = icon.brand
      ? 'assets/icons/' + icon.name + '.svg'
      : 'assets/icons/' + v.dir + icon.name + v.suffix + '.svg';
    var cls = 'csa-icon' + (v.mono ? ' csa-icon-mono' : '');
    return '<img class="' + cls + '" src="' + src + '" alt="">';
  }

  function copyIcon(icon) {
    var snippet = iconHtml(icon, currentVariant);
    navigator.clipboard.writeText(snippet).then(function () {
      toast.textContent = 'Copied: ' + snippet;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
    });
  }

  // Variant buttons
  document.getElementById('icoVariants').addEventListener('click', function (e) {
    var btn = e.target.closest('.ico-variant-btn');
    if (!btn) return;
    document.querySelectorAll('.ico-variant-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    applyVariant(btn.dataset.variant);
  });

  // Search
  search.addEventListener('input', function () { applySearch(search.value); });

  // Init count
  countEl.textContent = ICONS.length + ' icons';
})();
</script>
</body>
</html>`;

writeFileSync(join(__dirname, 'dist/icons.html'), iconsHtml);
console.log('Built dist/icons.html (%d icons, %d bytes)', allRootIcons.length, Buffer.byteLength(iconsHtml));
