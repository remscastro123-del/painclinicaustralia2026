import { useCallback, useEffect, useRef, useState } from 'react';
import './DocSlider.css';

/* A plain scroll-snap slider: responsive (1/2/3 up), arrows, dots,
   keyboard, autoplay that respects prefers-reduced-motion. No deps. */
export default function DocSlider({ items = [], autoplayDelay = 5000 }) {
  const trackRef = useRef(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [paused, setPaused] = useState(false);

  const metrics = useCallback(() => {
    const t = trackRef.current;
    if (!t) return { step: 1, perView: 1 };
    const card = t.querySelector('.ds-card');
    if (!card) return { step: 1, perView: 1 };
    const gap = parseFloat(getComputedStyle(t).columnGap || '0') || 0;
    const step = card.offsetWidth + gap;
    return { step, perView: Math.max(1, Math.round(t.clientWidth / step)) };
  }, []);

  const recount = useCallback(() => {
    const { perView } = metrics();
    setPages(Math.max(1, Math.ceil(items.length / perView)));
  }, [items.length, metrics]);

  useEffect(() => {
    recount();
    const t = trackRef.current;
    if (!t) return;
    const ro = new ResizeObserver(recount);
    ro.observe(t);
    return () => ro.disconnect();
  }, [recount]);

  const goTo = useCallback(
    (p) => {
      const t = trackRef.current;
      if (!t) return;
      const { step, perView } = metrics();
      const total = Math.max(1, Math.ceil(items.length / perView));
      const next = (p + total) % total;
      t.scrollTo({ left: next * perView * step, behavior: 'smooth' });
      setPage(next);
    },
    [items.length, metrics]
  );

  useEffect(() => {
    if (paused || pages < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => goTo(page + 1), autoplayDelay);
    return () => clearInterval(id);
  }, [page, pages, paused, goTo, autoplayDelay]);

  const onScroll = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const { step, perView } = metrics();
    setPage(Math.round(t.scrollLeft / (perView * step)) || 0);
  }, [metrics]);

  if (!items.length) return null;

  return (
    <div
      className="ds"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label="Our doctors"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(page + 1); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(page - 1); }
      }}
      tabIndex={-1}
    >
      <div className="ds-track" ref={trackRef} onScroll={onScroll}>
        {items.map((d, i) => (
          <article className="ds-card" key={i}>
            <div className="ds-photo">
              <img src={d.photo} alt={`${d.name}, ${d.role}`} loading="lazy" />
            </div>
            <div className="ds-body">
              <h3>{d.name}</h3>
              <div className="ds-role">{d.role}</div>
              {d.credentials ? <p className="ds-cred">{d.credentials}</p> : null}
            </div>
          </article>
        ))}
      </div>

      <div className="ds-controls">
        <button className="ds-btn" onClick={() => goTo(page - 1)} aria-label="Previous doctors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="ds-dots" role="tablist" aria-label="Slides">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} role="tab" aria-selected={i === page}
              aria-label={`Go to slide ${i + 1} of ${pages}`}
              className={'ds-dot' + (i === page ? ' is-active' : '')}
              onClick={() => goTo(i)} />
          ))}
        </div>
        <button className="ds-btn" onClick={() => goTo(page + 1)} aria-label="Next doctors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}
