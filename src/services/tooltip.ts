/** The parts of a Highcharts tooltip point that the table reads (typed locally: the typings do not export them). */
export interface TooltipPoint {
  x?: number | string
  y?: number | null
  key?: string
  color?: unknown
  percentage?: number
  name?: string
  point: { name?: string; percentage?: number }
  series: { name: string; color?: unknown }
}

/** Labels the tooltip needs, already translated. */
export interface TooltipLabels {
  /** Header of the value column: the unit, or '%' in percentage mode. */
  valueHeader: string
  /** Name of the "Total" row. */
  total: string
  /** Shown instead of the table when every value is zero. */
  noValue: string
}

export interface TooltipOptions {
  labels: TooltipLabels
  /** Show a "Total" row (only meaningful when the series are parts of one whole). */
  showTotal?: boolean
  /** Percentage mode: show each series' share of its stack instead of its value. */
  percentage?: boolean
  /** Decimal places of the values (default 2). */
  decimals?: number
  /** Hide the per-series rows and keep only the total (old REF.details == 0). */
  hideDetails?: boolean
}

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char)

const swatch = (color: string) =>
  `<svg width="10" height="10" style="vertical-align: baseline;" aria-hidden="true"><circle cx="5" cy="5" r="3" fill="${escapeHtml(String(color))}" /></svg>`

/** The category shown in the header of the tooltip (x value of the first point). */
function headerOf(points: readonly TooltipPoint[]): string {
  const first = points[0]
  return escapeHtml(String(first.point?.name ?? first.key ?? first.x ?? ''))
}

/**
 * The HTML table of a shared tooltip (old tooltipTable() in basics.js): one row per series with its colour, the
 * optional total, and the "no value" message when every point is zero.
 */
export function tooltipTable(points: readonly TooltipPoint[], options: TooltipOptions): string {
  const { labels, percentage = false, decimals = 2, hideDetails = false } = options
  const header = headerOf(points)

  if (percentage) {
    const rows = points
      .map((p) => `<tr><td>${swatch(p.color as string)} ${escapeHtml(p.series.name)}</td><td>${Math.round(p.point.percentage ?? 0)} %</td></tr>`)
      .join('')
    return `<div class="table_component"><table><thead><tr><th scope="col">${header}</th><th scope="col">${labels.valueHeader || '%'}</th></tr></thead>${rows}</table></div>`
  }

  if (points.every((p) => p.y === 0)) {
    return `<div class="table_component"><table><thead><tr><th scope="col">${header}</th></tr></thead><tr><td>${escapeHtml(labels.noValue)}</td></tr></table></div>`
  }

  const withTotalLast = [...points].sort((a, b) => Number(a.series.name === labels.total) - Number(b.series.name === labels.total))
  const rows = hideDetails
    ? ''
    : withTotalLast
        .map((p) => `<tr><td>${swatch(p.series.color as string)} ${escapeHtml(p.series.name)}</td><td>${Number(p.y ?? 0).toFixed(decimals)}</td></tr>`)
        .join('')

  const total = options.showTotal && points.length > 1 && !points.some((p) => p.series.name === labels.total)
    ? `<tr><td>${swatch('rgb(14, 71, 203)')} ${escapeHtml(labels.total)}</td><td>${points.reduce((sum, p) => sum + (p.y ?? 0), 0).toFixed(decimals)}</td></tr>`
    : ''

  return `<div class="table_component"><table><thead><tr><th scope="col">${header}</th><th scope="col">${escapeHtml(labels.valueHeader)}</th></tr></thead>${rows}${total}</table></div>`
}
