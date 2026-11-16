# Energy dashboard port: feature status (old `old/` folder vs this React app)

Status: **done** (ported and checked), **partial**, **missing**, **not needed** (replaced by the template shell).

| # | Feature (old file) | Status | Notes |
|---|---|---|---|
| 1 | Gallery of 26 charts by six themes (chartContainer.js, THEME_SECTIONS) | done | Lazy load per card (IntersectionObserver), Webtools charts |
| 2 | Expand a card to one chart (toggleChartContainer) | done | URL state `?chart=` |
| 3 | Drag and drop to reorder cards inside a theme (chartContainer.js) | missing | |
| 4 | Line view (endash.js / buildChart) | done | Series sorted by name; chart_2 puts REN first |
| 5 | Bar view for one year, all countries (createBarChart) | done | Percentage stacking and EU aggregate toggles |
| 6 | Pie view (createPieChart) | done | |
| 7 | Table view (openVizTable / Highcharts data table) | done | Own table component |
| 8 | Year timeline slider for bar and pie (Timeline, timeline.js) | done | Native range input |
| 9 | Month timeline slider for monthly charts 23–26 | missing | |
| 10 | Monthly charts 23–26: bar and pie per month, line of 12 months, combined stock + delivery series (chart_23/25) | missing | |
| 11 | Median split charts 24 and 26: above/below average toggle on the card and in the view (medianChartData, medianGroup) | missing | |
| 12 | Average line and highlighted bars (averageThreshold, averagePlotLine) | missing | |
| 13 | Per-capita chart 8 (chartEightCalculation: energy / population) | missing | |
| 14 | Country single select, grouped (populateCountries.js, singleSelect.js) | partial | Flat select in the template FilterControls; groups missing |
| 15 | Country change re-renders the gallery (populateCountries onChange) | done | Via URL state |
| 16 | Info menu: metadata link and dataset link per chart (openMeta, openDataset) | missing | |
| 17 | Tutorial with driver.js, first visit (tutorial.js, checkAndShowTutorial) | partial | Template tour; steps must point to real elements |
| 18 | Feedback e-mail to ESTAT-ENERGY@ec.europa.eu (social.js) | partial | Template uses the statement address |
| 19 | Share to X, Facebook, LinkedIn (social.js) | done | Template ShareMenu |
| 20 | Embed code of the chart (iframe.js exportIframe) | done | Template ShareMenu, `?embed=` view |
| 21 | Download PNG, JPEG, Excel (Highcharts export) | done | Template DownloadMenu; Excel from the loaded chart table |
| 22 | Print the chart (exportHandling printBtn) | missing | Not in the old toolbar either (no button) |
| 23 | Language selector EN/DE/FR (navComponent.js, language.js) | done | Template LanguageSelector |
| 24 | Accessibility statement page (endash.html, `?accessibility`) | done | Filled from the Word document |
| 25 | Footer links: legal, privacy, cookies, accessibility (footerComponent.js) | done | Template footer |
| 26 | Energy topics jump-nav, sticky, scroll-spy (themeNavComponent.js) | missing | Template SubNav only lists links |
| 27 | Global insights button and overlay (insights.js openGlobalInsights) | done | Overlay with all blocks, EN/DE/FR labels; Belgium numbers match the live tool |
| 28 | Per-chart insights view (createEnergyInsights) | done | Per-chart insights view |
| 29 | Mobile sub-navigation with TOOLS menu (subNavBarComponent.js) | not needed | Template responsive layout |
| 30 | Back to top button (scrool.js) | done | Template footer |
| 31 | Smooth wheel scroll inside the gallery (scrool.js) | missing | Low priority UX |
| 32 | Keyboard arrow navigation on the toolbar menubar (keyboardNavigationLogic.js) | missing | Native buttons are tabbable |
| 33 | Cookie-based first-visit flag (tutorial.js cookies) | not needed | Template uses localStorage |
| 34 | 404 page styled as a starry sky (old/404.html) | missing | Copy of another tool's page; decide if needed |
| 35 | Loading indicator with progress (loader) | partial | Text status per card |
| 36 | Tooltips with table and total row (tooltip.js, tooltipTable) | done | Webtools tooltip HTML |
| 37 | Dataset credits link in every chart (credits()) | done | Chart credits |
| 38 | Bootstrap to ECL migration (BOOTSTRAP_TO_ECL_MIGRATION.md) | done | ECL classes and template components |
| 39 | Analytics (siteID in the old endash.html) | missing | Needs the tool's own site ID from the Webtools team |
| 40 | Old static Eurostat header, GloBan and cookie banner | not needed | Template shell provides them |

Old chart bugs noticed while porting (not carried over as they were):
- chart_18 operator filter never applied (the id was written as `chart-18`).
- chart_21/22 leading-zero trimming branch is unreachable.
