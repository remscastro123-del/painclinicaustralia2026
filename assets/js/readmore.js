/* Truncate long copy to N lines with a Read more / Read less toggle.
   Progressive enhancement: markup stays fully readable without JS, the
   clamp is only applied here. Opt in with class="clamp-text" and
   data-lines="N" (default 4) on a wrapper around the copy. */
(function () {
  var CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  function init(el, i) {
    var body = el.querySelector('.clamp-body');
    if (!body) return;
    var lines = parseInt(el.dataset.lines || '4', 10);
    el.style.setProperty('--clamp-lines', lines);
    el.classList.add('is-clamped');

    // nothing to do if the copy already fits
    if (body.scrollHeight <= body.clientHeight + 2) {
      el.classList.remove('is-clamped');
      return;
    }

    var id = body.id || ('clamp-body-' + i);
    body.id = id;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'clamp-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', id);
    btn.innerHTML = '<span class="clamp-label">Read more</span>' + CHEV;

    btn.addEventListener('click', function () {
      var open = el.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.querySelector('.clamp-label').textContent = open ? 'Read less' : 'Read more';
      if (!open) el.scrollIntoView({ block: 'nearest' });
    });

    el.appendChild(btn);
  }

  function run() {
    document.querySelectorAll('.clamp-text').forEach(init);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else { run(); }
})();
