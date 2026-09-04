/* CSA Component Library — Tabs behavior
   Designed fresh (no reference markup existed to extract). Follows the
   WAI-ARIA "tabs" pattern: click to activate, arrow keys to move focus
   and activate, Home/End to jump to first/last.

   Markup contract per tab group:
     <div class="csa-tabs">
       <div class="csa-tablist" role="tablist" aria-label="...">
         <button class="csa-tab csa-tab-active" role="tab" id="tab-a"
                 aria-selected="true" aria-controls="panel-a">Label A</button>
         <button class="csa-tab" role="tab" id="tab-b"
                 aria-selected="false" aria-controls="panel-b" tabindex="-1">Label B</button>
       </div>
       <div class="csa-tabpanel csa-tabpanel-active" role="tabpanel" id="panel-a" aria-labelledby="tab-a">...</div>
       <div class="csa-tabpanel" role="tabpanel" id="panel-b" aria-labelledby="tab-b" hidden>...</div>
     </div>
*/
(function () {
  function initTabs(root) {
    const tablist = root.querySelector('.csa-tablist');
    if (!tablist) return;
    const tabs = Array.from(tablist.querySelectorAll('.csa-tab'));

    function activate(tab, focus) {
      tabs.forEach(t => {
        const selected = t === tab;
        t.classList.toggle('csa-tab-active', selected);
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) {
          panel.classList.toggle('csa-tabpanel-active', selected);
          panel.hidden = !selected;
        }
      });
      if (focus) tab.focus();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(tab, false));
      tab.addEventListener('keydown', e => {
        let target = null;
        if (e.key === 'ArrowRight') target = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') target = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') target = tabs[0];
        else if (e.key === 'End') target = tabs[tabs.length - 1];
        if (target) { e.preventDefault(); activate(target, true); }
      });
    });
  }

  document.querySelectorAll('.csa-tabs').forEach(initTabs);
})();
