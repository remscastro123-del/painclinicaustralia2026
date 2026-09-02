import { useCallback, useEffect, useRef } from 'react';
import './DocSlider.css';

/* Seamless doctor marquee: the list is rendered twice and the track drifts
   left forever, wrapping on the half-width so the seam never shows. Arrows
   nudge it by one card, hover/focus pauses, reduced motion holds it still. */
export default function DocSlider({ items = [], speed = 34 }) {
  const trackRef = useRef(null);
  const offset = useRef(0);      // px scrolled, always within [0, half)
  const half = useRef(0);        // width of one copy of the list + its gap
  const target = useRef(null);   // set by the arrows; null = free drift
  const paused = useRef(false);
  const step = useRef(0);        // one card + gap

  const measure = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector('.ds-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(t).columnGap || '0') || 0;
    step.current = card.offsetWidth + gap;
    half.current = step.current * items.length;
  }, [items.length]);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return undefined;

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);

    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let last = 0;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      if (!half.current) return;

      if (target.current !== null) {
        const diff = target.current - offset.current;
        if (Math.abs(diff) < 0.5) {
          offset.current = target.current;
          target.current = null;
        } else {
          offset.current += diff * 0.12;
        }
      } else if (!paused.current && !still.matches) {
        offset.current += speed * dt;
      }

      // wrap both ways so backwards arrows stay seamless too
      const h = half.current;
      if (offset.current >= h) {
        offset.current -= h;
        if (target.current !== null) target.current -= h;
      } else if (offset.current < 0) {
        offset.current += h;
        if (target.current !== null) target.current += h;
      }
      t.style.transform = `translate3d(${-offset.current}px,0,0)`;
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [measure, speed]);

  const nudge = useCallback((dir) => {
    if (!step.current) measure();
    const base = target.current === null ? offset.current : target.current;
    target.current = base + dir * step.current;
  }, [measure]);

  if (!items.length) return null;

  const loop = [...items, ...items];

  return (
    <div
      className="ds"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onFocusCapture={() => { paused.current = true; }}
      onBlurCapture={() => { paused.current = false; }}
      role="group"
      aria-roledescription="carousel"
      aria-label="Our doctors"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); nudge(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(-1); }
      }}
      tabIndex={-1}
    >
      <div className="ds-viewport">
        <div className="ds-track" ref={trackRef}>
          {loop.map((d, i) => (
            <article className="ds-card" key={i} aria-hidden={i >= items.length || undefined}>
              <div className="ds-photo">
                <img src={d.photo} alt={i < items.length ? `${d.name}, ${d.role}` : ''} loading="lazy" />
              </div>
              <div className="ds-body">
                <h3>{d.name}</h3>
                <div className="ds-role">{d.role}</div>
                {d.credentials ? <p className="ds-cred">{d.credentials}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="ds-controls">
        <button className="ds-btn" onClick={() => nudge(-1)} aria-label="Previous doctors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button className="ds-btn" onClick={() => nudge(1)} aria-label="Next doctors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}
