# Porting a legacy Eurostat tool to this stack

How ENDASH 3.0 was ported, written down so the next tool goes faster and ends up the same way. It has three parts: a
prompt to paste into Claude Code, the principles behind it, and the traps we already fell into.

Reference implementations (read them before writing anything), both finished ports to copy from:
- ENDASH, branch `endash3.0`: https://github.com/marciobooi/ENDASH.git (this repository)
- ENPRICES, branch `enprices3.0`: https://github.com/marciobooi/ENPRICES.git
  (`git clone -b enprices3.0 https://github.com/marciobooi/ENPRICES.git`)
 Same base, same folder structure, same component names.

---

## 1. The prompt (copy, fill the `<...>`, paste)

```
Port the legacy tool in `old/` (also live at <URL>) to this React + Vite + strict TypeScript project, keeping 100% of its
functionality and matching its look. Read this repository first (README.md, PORTING_PROMPT.md, src/config/toolConfig.ts,
src/components, src/services) and copy its structure, naming and patterns: `marciobooi/ENDASH` branch `endash3.0` and
`marciobooi/ENPRICES` branch `enprices3.0` (https://github.com/marciobooi/ENPRICES.git) are finished ports of the same kind. Where the same thing exists there, use
that file and its name instead of inventing a new one.

Rules
1. Everything that depends on the tool lives in `src/config/toolConfig.ts` (charts, topics, countries, filters,
   features, page identity) and in `src/locales/{en,de,fr}.json` (every text). Components never hard-code codes or text.
2. Take texts and translations from the legacy tool's own files (`old/data/labels_*.json`, `tutorial_*.json`,
   `translations.json`) first; write new ones only where none exist, in all three languages.
3. Use ECL (`@ecl/preset-eu`) for everything it has: buttons, select and multiple select, tooltips
   (`data-ecl-tooltip`), in-page navigation, table, notification, spinner, range, skip link, label. Custom CSS only
   where ECL has no equivalent or to match the legacy look. Icons: Webtools Phosphor set through `WebtoolsIcon`.
4. Charts through the Webtools charts service (a wrapper of Highcharts); never bundle Highcharts.
5. Repeated markup becomes a component (Button, RoundButton, Card, EclTable, Notification, Skeleton, ChartPanel...).
   Logic in hooks and `services/`, UI in `components/`. No `any`, no `var`, no manual DOM unless unavoidable (use refs),
   every effect cleans up its timers and listeners.
6. State of the tool lives in the address (`state/urlState.ts`), and links of the legacy tool are rewritten by
   `state/legacyUrl.ts`.
7. Accessibility is part of "done": keyboard, screen reader, focus management, axe-clean, reduced motion.
8. Do not trust the port: compare numbers and rules with the legacy code by running its own functions
   (see "Verify against the legacy tool" below).

Work in this order, and tell me what you did after each step: (1) audit `old/` and write PORT_STATUS.md, (2) config +
locales, (3) data layer (`services/`), (4) one chart end to end, (5) gallery and expanded views, (6) toolbar, download,
share, embed, tour, (7) insights, (8) accessibility and meta, (9) README. Commit after each step and push to the branch
`<name>3.0`; never touch `main`.
```

---

## 2. Principles (what made ENDASH work)

**One config, one place for text.** `toolConfig.ts` is the only file that knows the tool (charts, topics, datasets,
countries, filters, features, `site` identity, analytics ID). Names are never in the config: they are translated under
the code (`countries.<code>`, `units.<code>`, `labels.<chartId>`). Adding a chart or a language should be a config and
locale change, not a code change.

**Reuse before writing.** Order of preference: the ECL component, an existing component of this repo, the same file from
ENPRICES/ENDASH, then new code. The legacy tool's own texts and rules win over improvised ones (we lost time re-deriving
chart titles that the old `labels_*.json` already had).

**Port rules, not page furniture.** Banner, GloBan, cookie kit, footer, share, accessibility page, loading already exist.
Port the data, the calculations and the behaviour. Replace jQuery/Bootstrap/Font Awesome with React state, ECL classes
and Webtools icons.

**Separate data from drawing.** `services/` builds requests, reads JSON-stat and builds Highcharts options without
React; hooks fetch and memoise; components draw. Downloading is cheap and drawing is costly, so: download everything in
the background (`usePrefetchCharts`, visible cards first), draw a chart only when its card nears the screen
(`useInView`), and keep each table once per address (memory + Cache Storage, one hour).

**Derived, not stored.** State is the address plus a few UI flags. Loading flags and filtered data are derived during
render (`shown = slice(line, from, to)`), not copied into state and synced in effects.

**Accessible by construction.** Every toolbar control is a Tab stop and the arrow keys also move along it (`useRovingToolbar`); focus moves to the chart
heading when a chart opens and back to its card when it closes; every chart is one named region (Highcharts landmark
verbosity `one`, title hidden visually but kept for screen readers); sliders are native range inputs with
`aria-valuetext`, a static name and a live message; tooltips open on focus; nothing relies on colour only.

**Honest verification.** For every rule that has numbers (windows, averages, medians, top drivers), run the legacy code
and the new code on the same input and compare the values, not the screenshots. Do it for every language you ship.

---

## 3. Structure to copy

```
src/
  config/toolConfig.ts      page identity, charts, topics, countries, filters, features, tour, analytics
  locales/                  en.json, de.json, fr.json (every text; texts from the legacy tool first)
  App.tsx, main.tsx         main.tsx picks: tool, ?accessibility, ?insights, ?embed
  pages/                    AccessibilityPage, InsightsPage, EmbedPage
  components/               shell, controls, gallery, expanded view, chart components, insights, menus, feedback, icons
  services/                 eurostatData (requests, cache), chartViews, monthly, series, chartOptions, tooltip, webtools, ecl
  insights/                 model, text, storyConfig, input, useInsightsData, mode
  hooks/                    useToolState, useChartViews, useInView, usePrefetchCharts, useFocusTrap, useOutsideClose,
                            useRovingToolbar, useGuidedTour, useSiteShell, useWideLayout, useNeedsScroll
  state/                    urlState, filters, dashboardState, legacyUrl
  download/, share/, embed/ image and Excel download, share networks and e-mail, embed code
  accessibility/            statementConfig.ts (from the tool's Word document)
plugins/siteMeta.ts         page identity into the static HTML (title, description, Open Graph, Twitter, keywords, robots)
scripts/                    check-statement.mjs, check-share.mjs
old/                        the legacy tool, local only (ignored by Git and by oxlint)
```

---

## 4. Workflow and checks

1. **Audit** the legacy tool: list every feature, option, label, tooltip, keyboard behaviour. Write `PORT_STATUS.md`
   (one row per feature: done / partial / missing). Keep it current.
2. **Run the legacy tool locally** to call its own functions: `cd old && python3 -m http.server 8099`, open
   `http://localhost:8099/<page>.html?language=EN` (uppercase language), and run its data functions in the page console.
   The deployed copy can be older than the repository code, so compare with the repository.
3. **Data layer first**, with the legacy numbers as the test. Datasets with extra dimensions need every extra dimension
   fixed to one value or Eurostat returns nothing (we lost a chart to a missing `plants`/`operator`).
4. **One chart end to end** (data, options, card, expanded view, tooltip, table, download) before building the other 25.
5. **Every step ends with**: `npx tsc -p tsconfig.app.json --noEmit`, `npx oxlint`, `npm run build`, then the page in
   a browser in English, German and French. Fix the warnings, do not silence them.
6. **Before release**: `npm run check:release` (statement and social preview), axe on the tool, the table view, the
   insights page and the embed, and keyboard-only use of every control.
7. Commit small, push every commit to `<name>3.0`, never to `main`.

---

## 5. Traps we already fell into

**Webtools charts**
- Drop `undefined` keys from the options (`pruneUndefined`): an undefined subtitle makes Webtools draw an empty chart.
- Destroy a chart in a `setTimeout`, never directly: Webtools still reads it right after `ready`.
- Hide Webtools' frame, toolbar and menu with CSS; `$wt.render(..., menu: [], options: { logo: { visible: false } })`.
- The tooltip is drawn inside the chart's SVG. It needs `white-space: normal` on its table cells (Highcharts sets
  `nowrap` on the wrapper) and the table must fill the box Highcharts measured, or the value column is cut off.
- An axis title of `undefined` brings back Highcharts' default "Value"; use `null` to hide it.
- Long rotated category labels need room on the left (`spacingLeft`) and `textOverflow: 'none'`, or they are cut.
- Wrap long legend names (`itemWidth`) so the plot keeps its width.
- Webtools pads the chart container by 20px; remove it or a blank band appears under the chart.
- Webtools builds a long hidden data table (`.highcharts-data-table`) under every chart and shows it until its own style
  sheet arrives (a flash of a table while loading). Hide it with `display: none !important`; the tool has its own table view.
- Webtools also adds "Skip chart" / "Back to previous chart" links (`#skipChart_...`, `#backChart_...`; the second writes
  into the address) and makes table rows Tab stops: set `tabindex="-1"` on them with a MutationObserver (they come back).
- Highcharts' legend proxy buttons are `tabindex="-1"` and swallow Enter/Space: set `tabindex="0"` and press them from a
  capture-phase key handler, so a keyboard user can show/hide a series.
- Turn series `animation` off, or image export captures half-drawn bars.
- Size the expanded chart to the window (`useChartHeight`: window height minus the surrounding UI, clamped) so the period
  control and the source line are visible without scrolling.

**ECL**
- The tooltip needs only `data-ecl-tooltip` on the trigger plus one `ECL.Tooltip.autoInit(document.body)`; it renders
  in the top layer, so it is never hidden behind a sticky header. Restyle it in CSS, do not rebuild it.
- Multiple select: let ECL's own widget build the DOM (`new ECL.Select(el).init()`, `destroy()` on cleanup) and read the
  selection from `change`; do not write a copy of it. The widget owns the selection once started.
- In-page navigation: ECL's script does the scroll spy, the mobile "Page contents" button and keyboard. Mark the first
  link with a data attribute (not a class) until the spy starts, so React never rewrites ECL's class list.
- ECL buttons are styled by the native `disabled` attribute, not `aria-disabled`.
- ECL copies the tooltip text only when it opens: a button whose label changes while its tooltip is open must rewrite the
  open popup (see `RoundButton`).
- A toggle names its next action ("Show aggregates" / "Hide aggregates") in the tooltip and the accessible name; do not add
  `aria-pressed` on top of a label that already changes. Add both texts in every language.
- Tooltips stay above the trigger unless there is no room: keep them to one line (`width: max-content`) so a long text does
  not make them taller than the space above.
- Every toolbar icon is a Tab stop (arrows are an extra, `useRovingToolbar`); tooltips open on focus and close with Escape.
  Menus (`<details>`) close with Escape (focus back on the button) and on an outside click.
- Range slider: ECL's value bubble shows the position, not the period: use ECL's markup and styles without its script.

**React and the browser**
- A scroll listener that measures the DOM on every frame causes scroll lag: use `IntersectionObserver`.
- Effects that call `setState` synchronously are a lint error and a smell: derive the value during render.
- StrictMode runs effects twice: every widget you start must be destroyable and restartable.
- Never read a ref during render; keep the newest callback in a ref updated in an effect.
- Keep files formatted the way the project is (no semicolons, single quotes); do not run Prettier with its defaults.

**Testing in the Codex/Claude browser pane**
- `IntersectionObserver` and `requestAnimationFrame` do not fire reliably while the pane is hidden: scroll with a real
  scroll action before concluding that lazy content "does not load"; download menus waiting for a frame can look stuck.
- ECL tooltips need real pointer events: use hover actions (two or three small moves), not synthetic events.
- After editing CSS, reload the page: the dev server can keep serving the old stylesheet to an open tab.
- `scrollIntoView` does not scroll in the pane; use the scroll action.

**Data and rules**
- Monthly charts (oil stocks): the window is the last 12 months that every table has; countries are in only if they have
  a value in at least half of the months (quorum); a country may lag at most 3 months and then shows its own month in
  its name; countries with only zeros are left out of averages.
- Use the legacy tool's own labels and chart titles; our first guesses were wrong in several languages.
- Classify generated sentences by the English title or by the chart id, never by the translated title.

**Build and page**
- `npm run build` outputs only `dist/endash.zip` (the page renamed to `endash.html` inside it); `npm run build:site` gives a
  plain `dist/` for local checks. Check scripts read from the zip.
- The `<html lang>` follows the selected language; the accessibility statement is English only, whatever the language.
- Menus and popovers of the expanded view need a z-index above the chart; `.site-subnavigation` sits above the content.
- Image export hides everything that is not the chart (range, timeline, popovers) and adds title, country, period, source
  and logo (bottom right).
- Test other languages for long labels (German bar labels clipped until `spacingLeft` was raised).

**Git and files**
- The legacy copy lives in `old/` and is ignored; the repository's `main` already holds the legacy tool: never push the
  port to `main`, always to `<name>3.0`.
- Do not paste secrets or write `.env` files into the repository; the analytics site ID of the tool is fixed in
  `site.analytics` (it does not change between releases).

---

## 6. Definition of done

- [ ] Every feature of the legacy tool is in `PORT_STATUS.md` as done, or has a written reason.
- [ ] Numbers match the legacy code for every chart and rule (checked by running both).
- [ ] English, German and French complete: no raw keys, no English sentences, dates and numbers localised.
- [ ] Keyboard-only and screen reader use of every control; axe clean; reduced motion respected.
- [ ] `tsc`, `oxlint`, `npm run build` clean; `npm run check:release` passes (social image at least 600x315).
- [ ] No unused files, exports or CSS (scan before release); README describes the real structure.
- [ ] Keyboard only: Tab reaches every icon, legend item and chart once; Escape closes tooltips and menus; no hidden table or skip links in the Tab order.
- [ ] Links of the legacy tool still open the right view (`legacyUrl.ts`).
- [ ] Branch `<name>3.0` pushed, `main` untouched.
