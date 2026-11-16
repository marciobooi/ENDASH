import type { TFunction } from 'i18next'
import type { ChartDefinition } from '../config/toolConfig'
import { buildLine, lineRequests, type LineResult } from '../data/chartViews'
import { fetchDataset, type Dataset } from '../data/eurostatData'
import type { ChartSeries } from '../data/series'

/** The series an insight reads for a chart: every country for median charts, and only the current window for the
 * combined oil charts (the previous year is a comparison, not a series of its own). Same as the old tool. */
export function insightInput(chart: ChartDefinition, result: LineResult): { categories: string[]; series: ChartSeries[] } | null {
  if (result.status !== 'ready') return null
  const series = chart.combine ? result.series.filter((entry) => !entry.dashed) : result.series
  return { categories: result.categories, series }
}

/** Loads one chart's tables and builds its line result for the insights (all countries for median charts). */
export async function loadInsightLine(chart: ChartDefinition, geo: string, lang: string, t: TFunction, month: string): Promise<LineResult> {
  const requests = lineRequests(chart, geo, lang, month)
  const [first, second] = await Promise.all([
    requests.primary ? fetchDataset(requests.primary) : Promise.resolve(undefined),
    requests.secondary ? fetchDataset(requests.secondary) : Promise.resolve(undefined),
  ])
  return buildLine(chart, [first as Dataset | null | undefined, second as Dataset | null | undefined], lang, false, t, true)
}

