# PCA — Type & Spacing System

Single source of truth: **`assets/css/design-system.css`**, linked from all 9 pages
*after* each page's inline `<style>` so its tokens win. Change values there, never
in the page.

## Type scale

Modular scale, ratio **1.200** (minor third), base **1rem / 16px**. Every step is a
fluid `clamp()` — min at 360px viewport, max at 1440px. The `vw` coefficient of each
step is derived from `(max - min) / (1440 - 360)`, not guessed, so steps scale in
proportion and never cross over each other.

| Token | Min → Max | Use |
|---|---|---|
| `--fs-2xs` | 0.694 → 0.756rem | legal text, meta, overlines |
| `--fs-xs` | 0.833 → 0.913rem | captions, credentials |
| `--fs-sm` | 0.875 → 0.974rem | secondary copy, buttons |
| `--fs-base` | 1.000 → 1.125rem | **body** |
| `--fs-md` | 1.125 → 1.313rem | lead paragraphs, subheads |
| `--fs-lg` | 1.266 → 1.575rem | h4, card titles |
| `--fs-xl` | 1.424 → 1.890rem | h3 |
| `--fs-2xl` | 1.602 → 2.391rem | h2 |
| `--fs-3xl` | 1.802 → 3.010rem | h1 on inner pages |
| `--fs-4xl` | 2.027 → 3.875rem | hero h1 only |

Applied automatically: `h1`–`h4`, `p`, `small`, `.overline`, `.lead`, `.tagline`.
Pages should not restate sizes.

## Line height & tracking

Display type gets tight leading and negative tracking; body gets loose leading and
none. Large type needs less air per line, small type needs more.

| Token | Value | Use |
|---|---|---|
| `--lh-tight` | 1.08 | hero h1 |
| `--lh-snug` | 1.20 | h2, h3 |
| `--lh-heading` | 1.30 | h4, card titles |
| `--lh-body` | 1.62 | paragraphs |
| `--lh-loose` | 1.75 | small print |
| `--ls-display` | -0.02em | `--fs-3xl` and up |
| `--ls-heading` | -0.01em | h2–h4 |
| `--ls-overline` | 0.12em | uppercase eyebrows |

## Measure

Body copy is capped so lines stay in the readable 45–75 character band.
`p` defaults to `--measure` (62ch).

- `--measure-narrow` 46ch — narrow columns, cards
- `--measure` 62ch — default
- `--measure-wide` 74ch — full-width intros

## Spacing scale

4px base unit. Use these for every margin, padding, and gap — no arbitrary values.

| Token | px | Token | px |
|---|---|---|---|
| `--sp-1` | 4 | `--sp-7` | 40 |
| `--sp-2` | 8 | `--sp-8` | 48 |
| `--sp-3` | 12 | `--sp-9` | 64 |
| `--sp-4` | 16 | `--sp-10` | 80 |
| `--sp-5` | 24 | `--sp-11` | 104 |
| `--sp-6` | 32 | | |

## Section rhythm

Three sizes only, so the page has a predictable vertical beat. Every `<section>`
uses one.

- `--sp-sec` — `clamp(64px, 8vw, 104px)` — **default**
- `--sp-sec-sm` — `clamp(44px, 5.5vw, 68px)` — strips, tight bands
- `--sp-sec-lg` — `clamp(88px, 11vw, 152px)` — feature moments

Utilities: `.section`, `.section-sm`, `.section-lg`, `.stack`, `.stack-lg`.

Inside a section:
- `--gap-head` — heading block → content
- `--gap-grid` — cards within a grid
- `--gap-col` — two-column split

> Historical note: `--sp-sec` was referenced by four sections but never declared,
> which made `padding: var(--sp-sec) 0` invalid and collapsed those sections to
> **zero** padding. That was the cause of the "no spacing" problem.

## Colour & contrast

Palette is unchanged: forest `#1E4035`, rust/CTA `#843806`, bright orange `#F27E33`,
cream `#FFFAEE`, cream2 `#F4ECDB`, muted `#4C5E58`.

Measured ratios that matter:

| Pair | Ratio | Verdict |
|---|---|---|
| `#843806` on cream | **7.89:1** | passes AA + AAA — use for orange text |
| forest on `#F27E33` | **4.24:1** | large text only (≥18.66px bold) |
| `#F27E33` on cream | **2.58:1** | **fails** — never use as text colour |

Rule: bright orange is for fills and icons; rust `#843806` is for orange *text*.

## Truncate + Read more

Wrap long copy:

```html
<div class="clamp-text" data-lines="5">
  <div class="clamp-body">
    <p>…</p>
  </div>
</div>
```

`assets/js/readmore.js` clamps it and injects the toggle. Progressive enhancement —
without JS the copy renders in full. The button is a real `<button>` with
`aria-expanded` and `aria-controls`, and self-removes if the copy already fits.

## Known upstream bugs we patch here

1. **LogoLoop** renders a `<ul>/<li>` and never resets `list-style`, so browsers
   paint native disc bullets between items. Patched with `list-style: none`.
2. **ScrollStack** applies `scroll-stack-scroller` (`overflow-y:auto; height:100%`)
   unconditionally even when `useWindowScroll` is set, creating a nested scroller
   the window handler can't drive. Patched in `src/index.css`. Present in the
   current registry version — re-check after any reinstall.
3. **ScrollStack** also initialises **Lenis** smooth scrolling on `<html>` globally
   in `useWindowScroll` mode, changing the scroll feel of the whole site.
