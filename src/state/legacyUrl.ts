/**
 * Links made by the previous ENDASH tool keep working. It wrote its whole state into the address
 * (`?geos=BE&unit=KWH&language=EN&dataset=nrg_ind_eff&chartId=chart_1&chartType=barChart&year=2024&chartExpanded=true...`);
 * they are rewritten to the parameters of this tool (`?geo=BE&language=en&chart=chart_1&view=bar&year=2024`) before
 * anything reads the address, so addresses people shared or bookmarked open the same view.
 */
const LEGACY_KEYS = [
  'geos', 'chartId', 'chartType', 'chartExpanded', 'chartCreated', 'chartOpt', 'medianGroup', 'yearManuallySet',
  'indicator', 'indicator2', 'indicator_type', 'indicator2_type', 'dataset', 'unit', 'title', 'compare', 'meta', 'share',
]

/** The view of an expanded chart, by the old `chartType`. */
const VIEWS: Record<string, string> = { lineChart: 'line', barChart: 'bar', pieChart: 'pie', insightsChart: 'insights' }

/** Rewrites `address` in place when it is an old-style link. Returns false when it is not one. */
export function migrateLegacyUrl(address: URL): boolean {
  const query = address.searchParams
  if (!LEGACY_KEYS.some((key) => query.has(key))) return false

  const chartId = query.get('chartId') ?? ''
  const expanded = query.get('chartExpanded') === 'true'
  const share = query.get('share') === 'true'

  // The country: the old tool kept a list, this one shows one country at a time (the first).
  const geo = (query.get('geos') ?? '').split(',')[0]
  if (geo) query.set('geo', geo)

  // The open chart and its view. A chart that was only created in the gallery is not "open".
  if (expanded && chartId) {
    query.set('chart', chartId)
    const view = VIEWS[query.get('chartType') ?? '']
    if (view) query.set('view', view)
  }

  // The year counts only when the person moved the slider: otherwise it was the tool's own first guess.
  if (query.get('yearManuallySet') !== 'true') query.delete('year')

  const below = query.get('medianGroup')
  if (below) query.set('below', below)

  const language = query.get('language')
  if (language) query.set('language', language.toLowerCase())

  // An old "share" link was the iframe version of the tool: one chart, nothing else.
  if (share && chartId) query.set('embed', chartId)

  for (const key of LEGACY_KEYS) query.delete(key)
  return true
}

/** Rewrite the address of the page (no history entry) if it is an old-style link. */
export function applyLegacyUrl(): void {
  const address = new URL(window.location.href)
  if (migrateLegacyUrl(address)) window.history.replaceState(window.history.state, '', address)
}

applyLegacyUrl()
