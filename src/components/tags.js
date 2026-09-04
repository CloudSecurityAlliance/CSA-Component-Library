/* CSA Component Library — Filter tag behavior
   The entire interaction: clicking toggles aria-pressed. Every visual
   state (hover, pressed) is driven by that attribute alone in tags.css —
   there's no class to add/remove, no state to track beyond the DOM. */
(function () {
  document.querySelectorAll('.csa-tag-filter').forEach(tag => {
    tag.addEventListener('click', () => {
      const pressed = tag.getAttribute('aria-pressed') === 'true';
      tag.setAttribute('aria-pressed', String(!pressed));
    });
  });
})();
