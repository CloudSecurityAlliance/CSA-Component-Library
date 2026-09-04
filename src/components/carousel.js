/* CSA Component Library — Carousel behavior
   Extracted as-is from csai-foundation-hub.html's insights carousel
   (drag + momentum + arrow nav + infinite loop via clone sets),
   generalized to initialize every .csa-carousel on the page instead
   of a single hardcoded #insightsTrack id.

   Markup contract per carousel:
     <div class="csa-carousel">
       <button class="csa-carousel-arrow csa-carousel-arrow-prev">...</button>
       <div class="csa-carousel-viewport">
         <div class="csa-carousel-track">
           <!-- clone set (before), real set, clone set (after) -->
         </div>
       </div>
       <button class="csa-carousel-arrow csa-carousel-arrow-next">...</button>
     </div>
   The track must contain 3 copies of the real card set (before/real/after)
   for the infinite-loop illusion — see the showcase for a worked example.
*/
(function () {
  function initCarousel(root) {
    const track = root.querySelector('.csa-carousel-track');
    if (!track) return;
    const allCards = track.querySelectorAll('.csa-carousel-card');
    if (!allCards.length || allCards.length % 3 !== 0) return;
    const realCount = allCards.length / 3;

    let cardWidth, setWidth, x = 0, vx = 0, isDown = false, startX = 0, startXAtDown = 0,
        lastMoveX = 0, lastMoveT = 0, moved = false, momentumId = null;

    function measure() {
      cardWidth = allCards[0].getBoundingClientRect().width + 20;
      setWidth = cardWidth * realCount;
    }
    function render() { track.style.transform = `translate3d(${-x}px,0,0)`; }
    function normalize() {
      while (x >= setWidth * 2) x -= setWidth;
      while (x < setWidth) x += setWidth;
    }
    function jumpToStart() { measure(); x = setWidth; render(); }
    window.addEventListener('load', jumpToStart);
    window.addEventListener('resize', jumpToStart);
    jumpToStart();

    function cancelMomentum() { if (momentumId) cancelAnimationFrame(momentumId); momentumId = null; }

    function animateTo(target, duration) {
      cancelMomentum();
      const startVal = x, startTime = performance.now();
      function step(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        x = startVal + (target - startVal) * eased;
        render();
        if (t < 1) requestAnimationFrame(step);
        else { normalize(); render(); }
      }
      requestAnimationFrame(step);
    }

    function snapToNearest() {
      const target = Math.round(x / cardWidth) * cardWidth;
      animateTo(target, 300);
    }

    function runMomentum() {
      function step() {
        vx *= 0.94;
        if (Math.abs(vx) < 0.05) { snapToNearest(); return; }
        x += vx;
        render();
        momentumId = requestAnimationFrame(step);
      }
      momentumId = requestAnimationFrame(step);
    }

    const prevBtn = root.querySelector('.csa-carousel-arrow-prev');
    const nextBtn = root.querySelector('.csa-carousel-arrow-next');
    if (prevBtn) prevBtn.addEventListener('click', () => animateTo(x - cardWidth, 400));
    if (nextBtn) nextBtn.addEventListener('click', () => animateTo(x + cardWidth, 400));

    track.addEventListener('pointerdown', e => {
      cancelMomentum();
      isDown = true; moved = false;
      track.classList.add('csa-dragging');
      track.setPointerCapture(e.pointerId);
      startX = e.clientX; startXAtDown = x;
      lastMoveX = e.clientX; lastMoveT = performance.now();
      vx = 0;
    });

    track.addEventListener('pointermove', e => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) moved = true;
      x = startXAtDown - dx;
      render();
      const now = performance.now();
      const dt = now - lastMoveT || 16;
      vx = -((e.clientX - lastMoveX) / dt) * 16;
      lastMoveX = e.clientX; lastMoveT = now;
    });

    function endDrag() {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('csa-dragging');
      if (Math.abs(vx) > 0.5) runMomentum(); else snapToNearest();
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    track.addEventListener('dragstart', e => e.preventDefault());
  }

  document.querySelectorAll('.csa-carousel').forEach(initCarousel);
})();
