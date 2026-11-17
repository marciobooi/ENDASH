# ENDASH 3.0 - Energy dashboard

The Eurostat Energy dashboard rebuilt with Vite, React and strict TypeScript. It shows the most important energy indicators for one country at a time (energy efficiency, renewables, import dependency, greenhouse gas emissions, consumption by sector, oil stocks and more) as a gallery of charts grouped by topic, each of which opens into line, bar, pie and table views with a period timeline, insights, download, share and embed.

Everything that depends on the tool lives in **`src/config/toolConfig.ts`** (charts, topics, countries, datasets, features) and in the translation files `src/locales/*.json`; the rest is shared code. The legacy tool is the `main` branch of this repository; a copy can be kept in `old/` for local reference (ignored by the checks, not committed on this branch); `PORT_STATUS.md` lists what was ported, and `PORTING_PROMPT.md` is the prompt, principles and list of traps to start the next port from.

It includes:

- The Europa Component Library (EU preset 5.4.0) from npm (`@ecl/preset-eu`): buttons, select and multiple select, tooltips, in-page navigation, tables, notification, spinner, range. The Webtools Smart Loader (GloBan, cookie consent kit, analytics, icons).
- Charts drawn by the Webtools charts service (a wrapper of Highcharts: this project does not load or license Highcharts itself).
- The shared shell: branded banner, language selector, sub-navigation with the tool's actions, footer, and pages for the accessibility statement, the global insights and the embedded view.
- Interface translations in English, French and German, with the texts of the legacy tool.
- The state of the tool in the address: every link, shared view and embedded `<iframe>` carries it, and links of the legacy tool are rewritten to it.

## Run locally

```sh
npm install
npm run dev
```

The address of the dev server is `http://localhost:5173`. Try `?language=de&geo=FR`, `?chart=chart_1&view=bar` or `?insights`.

| Command | What it does |
|---|---|
| `npm run dev` / `npm run preview` | Development server / serve the production build |
| `npm run build` | Type-check and build into `dist/` |
| `npm run typecheck` / `npm run lint` | TypeScript (strict) / oxlint, both must be clean |
| `npm run check:statement` | Fails while `<<PLACEHOLDER>>` text is left in the accessibility statement |
| `npm run check:share` | Reads `dist/index.html` like a social crawler and checks the preview tags and image |
| `npm run check:release` | `check:statement` + `check:share`; run it after `npm run build`, before publishing |

Webtools shows GloBan only on `*.europa.eu` hosts. Locally, add `127.0.0.1 localhost.europa.eu` to `C:\Windows\System32\drivers\etc\hosts` (administrator) and open `http://localhost.europa.eu:5173`; `vite.config.ts` already allows that host.

## The dashboard

- **Gallery.** The charts are grouped by topic (`themes` in the config) under a sticky "Energy topics" row built on ECL's in-page navigation: it highlights the topic being read and collapses to a "Page contents" button on narrow screens. Cards load their chart only when they come near the screen and show a skeleton meanwhile. Cards can be reordered by dragging, or with Alt and the arrow keys (announced to screen readers).
- **Country.** One country at a time, chosen in a grouped select (aggregates, EU, EFTA, enlargement). Every chart of the gallery shows it.
- **Expanded chart.** The toolbar replaces the page actions in the top band: line, bar, pie and table views (the ones a chart offers, `views` in the config), insights, info links, download, embed and close. Bar and pie views have a **period timeline** under the chart (play, bubble, ticks, keyboard and screen reader support); the year slider is for annual charts and the month slider only for the monthly oil-stock charts.
- **Oil stocks (charts 23 to 26).** Charts 23 and 25 merge two Eurostat tables (stocks and deliveries): the latest 12 months that both tables share, with the same span of the year before dashed. Charts 24 and 26 draw every country and split them at the average of the last 12 months, shown above or below with a toggle; countries with only zeros are left out, and in the bar view a country that has not yet published the chosen month shows its latest one (at most three months back) with its own month in the name. The rules are in `src/services/monthly.ts` and were checked against the legacy code, value by value.
- **Insights.** Per chart (the insights view of an expanded chart) and global (`?insights`, a page of its own with a way back to the tool): trends, highest values, top drivers, policy direction and data alerts, computed from the same Eurostat data. The calculations are in `src/insights/`.
- **Download.** PNG and JPEG images carry the chart title (with the country for the one-country views), the source and dataset and the Eurostat logo at the bottom right. The Excel file starts with the title, country, unit, source, dataset, link and date, then the table.
- **Legacy links.** `src/state/legacyUrl.ts` rewrites links of the previous tool (`geos`, `chartId`, `chartType`, `chartExpanded`, `medianGroup`, `share`, ...) before anything reads the address.

## Configuration

### `src/config/toolConfig.ts` (the only config file)

Pure data, so the build can read it too. Sections:

- **Page identity (`site`)**: title, description, deployed address, preview image, languages, contact e-mail, footer and home links. A Vite plugin (`plugins/siteMeta.ts`) writes it into the static HTML at build time: `<title>`, description, canonical, Open Graph, Twitter Card and the page language.
- **Colours, datasets, countries and groups, units, images, API codes**: the lookup tables.
- **`filters`**: the controls of the menu (`select` or `multiselect`), their option codes, groups and defaults. Everything follows from them: the menu, the address, the shared and embedded views, the summary in the content and the contact e-mail.
- **`menuItems`**, **`features`** (insights, download, share, embed, tour), **`downloadConfig`** (formats, the element saved as an image, file name), **`embedConfig`** (iframe height, embeddable charts) and **`tourConfig`** (settings and steps).

The config never contains display names. Every name is translated in `src/locales/<code>.json` under the code (`countries.<code>`, `units.<code>`, `filters.<id>`, ...). Languages are listed in `site.languages`; adding one means a new locale file and an entry there.

### Environment (`.env.local`, see `.env.example`)

- Analytics: the site ID and instance of this tool are fixed in `site.analytics` (`src/config/toolConfig.ts`), as in the legacy html; no environment variable.
- `VITE_WEBTOOLS_IS_404`: `true` only for a not-found page. `VITE_WEBTOOLS_CHART_URL`: optional published Webtools chart address.
- `VITE_SITE_URL`: optional override of `site.url` for a deployment pipeline (the preview image address follows it).

### Webtools notes

The Smart Loader is loaded once over HTTPS by `src/services/webtools.ts`. Never add another `load.js` tag, never use `rel="noreferrer"` or a blocking `referrer` policy on links, and do not add a restrictive Content Security Policy without allowing the Europa resources. If the loader answers 403 locally, use the `localhost.europa.eu` host above. Webtools components cannot come from npm; ECL does (`@ecl/preset-eu`, imported in `src/index.css` and `src/main.tsx`).

Webtools icons are used through `WebtoolsIcon` (`set` + `name`, for example `phosphor` + `lightbulb` or `networks` + `facebook`): Webtools swaps the icon element for an SVG, so the wrapper is the node React owns. Icon names: <https://webtools.europa.eu/showcase/demo/?comp=icons>.

## Structure

```
src/
  config/toolConfig.ts      everything that depends on the tool: page identity, charts, topics, countries, filters, features
  locales/                  every text, one file per language (en, de, fr)
  App.tsx, main.tsx         the page; main.tsx picks the page: tool, ?accessibility, ?insights or ?embed
  pages/                    AccessibilityPage, InsightsPage, EmbedPage (the same shell around different content)
  components/               shell (Nav, SubNav, Footer, LanguageSelector), controls (Select, MultiSelect, FilterControls, Button,
                            RoundButton, Tooltip), gallery (Gallery, ChartCard, ThemeNav, Card), expanded chart (ToolView, ChartToolbar,
                            ChartPanel, PeriodTimeline, SeriesTable, EclTable, SourceNote), chart components (WebChart, LineChart,
                            ColumnChart, PieChart, NoDataChart), insights (InsightsContent, ChartInsights, StoryCard, InsightCard, Donut,
                            Sparkline, InfoPopover), menus (ShareMenu, DownloadMenu, EmbedButton, InsightsPanel), feedback (Loading,
                            Skeleton, Notification), icons (ToolbarIcon, WebtoolsIcon)
  services/                 data and chart building without React: eurostatData (requests, JSON-stat), chartViews, monthly, perCapita,
                            series, calculations; chartOptions, chartTheme, plotLines, tooltip, tooltipOptions (Highcharts options);
                            webtools (Smart Loader, charts service), ecl (ECL widgets)
  insights/                 the insights: model, storyConfig, text, format, input, theme, useInsightsData, useInsightsPanelState, mode
  hooks/                    useToolState, useChartViews, useDataset, useInView, useWideLayout, useNeedsScroll, useFocusTrap,
                            useOutsideClose, useRovingToolbar, useGuidedTour, useSiteShell
  state/                    the address-based state: urlState, filters, dashboardState, legacyUrl
  download/, share/, embed/ image and Excel download, share networks and e-mail, embed code
  accessibility/            the statement (statementConfig.ts) and its page mode
  tour.ts                   the guided tour helper (driver.js)
plugins/siteMeta.ts         writes the page identity into the static HTML at build time
scripts/                    check-statement.mjs, check-share.mjs (release checks)
old/                        the legacy tool, for reference only (not in Git)
```

## Features

**State in the address.** The filters of `toolConfig.ts` and the dashboard state (open chart, view, year, month, below-average charts, percentage, aggregates) are written to the address without a history entry, next to `language`. A link, a bookmark and an embedded view show exactly what the person saw. Invalid values fall back to the defaults.

**Embedded view.** `?embed=<chartId>` renders only the chart (no banner, toolbar, footer or Webtools), from the state in the address. The Embed button shows the `<iframe>` code with the current view and a copy button. Charts that can be embedded are listed in `embedConfig.charts`; the host page's server must allow framing.

**Download menu.** PNG and JPEG are drawn from the chart on screen (the element of `downloadConfig.imageTarget`) with html2canvas, with a frame added around the capture (`src/share/screenshot.ts`). The Excel file is written by `write-excel-file` from the table that `App.tsx` passes to `DownloadMenu` (`getTable`, built in `src/download/toolTable.ts`); it is offered only while a chart is open. Both libraries load only when someone downloads. Limit: an image is a picture of the screen, so Webtools-injected icons and cross-origin images without CORS headers may be missing.

**Share menu.** X, Facebook and LinkedIn open in a small window. The e-mail goes to `contactEmail` with the tool, address, language, the selection, date, window size and browser filled in, and a screenshot of the current view on the clipboard (a `mailto:` link cannot carry an attachment, so the screenshot is pasted into the message; if the clipboard refuses, it is saved as a file). Networks are defined in `src/share/networks.ts`; to add one, add an entry, its `share.networks.<id>` name in every locale file and any `wt-icon-networks--<name>` icon.

**Accessibility.** The tool is built for keyboard and screen reader use: one Tab stop per toolbar with arrow-key navigation (`useRovingToolbar`), focus moves to the chart heading when a chart opens and returns to its card when it closes, charts are named regions with one landmark each, the timeline is a native range with a spoken period and a live message, and tooltips (ECL) open on focus. The statement page is `?accessibility&language=xx`: an English-only statement in ECL classes; edit only `src/accessibility/statementConfig.ts`, from the tool's Word document; `npm run check:statement` fails while a placeholder is left.

**Guided tour.** Starts on a first visit (`tourConfig.showOnce`), always with a welcome step, then `tourConfig.steps` (the ones of the legacy tutorial); replayed with the help button. Focus is trapped in the popover and the page behind is inert.

**Tooltips.** Every icon button has an ECL tooltip: the trigger only needs `data-ecl-tooltip` (the `Tooltip` component and `RoundButton` set it), and ECL's script (started once by `src/services/ecl.ts`) builds the bubble in the browser's top layer, so it is never hidden behind the header.

**Components.** `Select` (native select, option groups) and `MultiSelect` (ECL's multiple select, started by React) use ECL form markup. `Button`, `RoundButton`, `Card`, `EclTable`, `Notification`, `Skeleton`, `Loading` (ECL spinner) and `PeriodTimeline` are the building blocks; hand-written markup for any of them should be a component first.

**Eurostat data.** `src/services/eurostatData.ts` builds the requests (repeated keys, `geo=BE&geo=FR`), caches the answers and reads JSON-stat through `jsonstat-toolkit`. A chart that needs a second table (per capita, oil stocks) has its own builder in `src/services`.

## Social sharing preview

Facebook, LinkedIn and X build the post from the `<meta>` tags of the page's **static HTML** (they do not run JavaScript), so the preview is one language whatever `?language=` the link has. The tags are generated from `site` in `toolConfig.ts` at build time: nothing is written in `index.html`.

Per tool: edit `site` (title, description, image alt text, `url` = the **absolute https** address of the deployed page; the image address is derived from it), set `site.image` to the tool's own image in `public/images/` (now `shareico.jpg`, the legacy image, 506x253; networks want **PNG or JPEG, at least 600x315, ideally 1200x630, under 5 MB**, and `npm run check:share` fails below 600x315; SVG and WebP are not supported by all networks), then `npm run build` and `npm run check:release`.

Facebook and LinkedIn read only the tags (title, summary and quote parameters in a share link are ignored); X uses the text of the link plus the Twitter Card image. After deploying, check one real post per network and refresh the previews with the Facebook Sharing Debugger and the LinkedIn Post Inspector; networks cache previews. The shared address is the current page without its `#fragment`.

## Deployment

Tools are served from a fixed Eurostat path such as `/eurostat/cache/visualisations/<tool>/`. The template is ready for it: `vite.config.ts` sets `base: './'` and public files are referenced through `import.meta.env.BASE_URL` (never with a leading `/`). Test the `dist` folder from a sub-folder on a local server. All query-string links (`?language=`, `?accessibility`, `?embed=`) are relative on purpose.
