# Pain Clinic Australia — painclinicaustralia.com.au

Static multi-page site (9 HTML pages) with a small set of React "islands"
mounted into the static markup.

## Run locally

No build step needed to view the site — it is static HTML:

```bash
python -m http.server 4321
```

Then open <http://localhost:4321/index.html>.

## Structure

| Path | What |
|---|---|
| `index.html` + `pca-*.html` | the 9 pages; each carries its own inline `<style>` |
| `assets/css/design-system.css` | **type + spacing tokens — the source of truth** |
| `assets/js/readmore.js` | truncate / expand behaviour |
| `assets/images/` | optimised WebP images used by the site |
| `assets/doctors/` | doctor portraits + `profiles.json` (22 records) |
| `assets/react/` | **built** island bundle (committed, so no build needed) |
| `src/` | React island sources (`main.jsx` + `components/`) |
| `DESIGN-SYSTEM.md` | typescale, spacing, contrast rules and rationale |

## React islands

`src/main.jsx` scans for `[data-react]` elements and mounts a component into
each. Data comes from a sibling `<script type="application/json">`, so the HTML
stays the source of truth for copy.

Currently mounted: `logoloop`, `carousel` (doctors), `accordiongallery`.

Rebuild after editing anything in `src/`:

```bash
npm install
npm run build
```

Output goes to `assets/react/islands.js` + `islands.css`.

## Notes

- See `DESIGN-SYSTEM.md` for the type scale, spacing scale, and the measured
  colour-contrast rules (short version: `#843806` for orange *text*,
  `#F27E33` for fills only — it fails contrast as text).
- Raw stock photo originals are gitignored; the WebP derivatives the site
  actually uses are committed.
