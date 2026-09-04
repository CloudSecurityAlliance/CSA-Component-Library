/* CSA Component Library — Reveal card behavior
   Progressive enhancement only: the hover reveal itself works from CSS
   alone (see .csa-card-reveal in cards.css). This decides, once per card,
   whether its revealed paragraph+CTA will fit the available space or
   needs the internal scroll fallback — and applies that as a permanent
   overflow-y (hidden or auto), not something toggled on hover.

   Why not toggle on hover: the card's own height never changes (only the
   internal row grows within it), so "does this fit" is static geometry,
   knowable up front — it doesn't depend on animation progress. Toggling
   reactively (e.g. on a timer) means guessing when the grow transition is
   "done enough", and any guess that's a little early sees the row still
   short, shows a scrollbar, then hides it again once the row finishes
   growing — a flash on cards that actually fit fine. Deciding up front
   avoids that class of bug entirely: cards that fit get overflow-y:hidden
   forever (no flash, ever); cards that don't get overflow-y:auto forever,
   so the scrollbar just tracks the row's live height every frame and
   grows in step with the frosted-glass reveal, no timing code needed. */
(function () {
  function needsScroll(card) {
    const head = card.querySelector('.csa-card-reveal-head');
    const panel = card.querySelector('.csa-card-reveal-panel');
    const inner = card.querySelector('.csa-card-reveal-more-inner');
    if (!head || !panel || !inner) return false;
    const panelStyle = getComputedStyle(panel);
    const available = card.clientHeight
      - head.getBoundingClientRect().height
      - parseFloat(panelStyle.paddingTop)
      - parseFloat(panelStyle.paddingBottom);
    return inner.scrollHeight > available;
  }

  function refresh(card) {
    const inner = card.querySelector('.csa-card-reveal-more-inner');
    if (inner) inner.classList.toggle('csa-needs-scroll', needsScroll(card));
  }

  const cards = Array.from(document.querySelectorAll('.csa-card-reveal'));
  cards.forEach(refresh);

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => cards.forEach(refresh), 150);
  });
})();
