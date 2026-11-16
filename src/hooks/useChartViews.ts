import { useMemo } from 'react'
import type { TFunction } from 'i18next'
import type { ChartDefinition } from '../config/toolConfig'
import { pieRequests, buildBar, buildLine, barRequests, buildPie, lineRequests, yearsOf, type BarResult, type LineResult } from '../data/chartViews'
import { useDataset } from './useDataset'

/** The line view of a chart, whatever its kind: requests, fetch and build. `years` is the timeline range. */
export function useLineChart(chart: ChartDefinition, geo: string, lang: string, below: boolean, month: string, t: TFunction, enabled = true) {
  const all = lineRequests(chart, geo, lang, month)
  // Lazy: nothing is requested until the card is on screen (`enabled`).
  const requests = { primary: enabled ? all.primary : null, secondary: enabled ? all.secondary : null }
  const first = useDataset(requests.primary)
  const second = useDataset(requests.secondary)
  const result: LineResult = useMemo(
    () => buildLine(chart, [first.data, second.data], lang, below, t),
    [chart, first.data, second.data, lang, below, t],
  )
  return { result, years: yearsOf(first.data), table: first.data, loaded: first.data !== undefined }
}

/** The bar view: the year (standard charts, per-capita) or the month (median charts) decides the data. */
export function useBarChart(chart: ChartDefinition, year: string, month: string, aggregates: boolean, lang: string, t: TFunction, enabled: boolean): BarResult {
  const requests = barRequests(chart, year, aggregates, lang)
  const first = useDataset(enabled ? requests.primary : null)
  const second = useDataset(enabled ? requests.secondary : null)
  return useMemo(
    () => (enabled ? buildBar(chart, [first.data, second.data], year, month, lang, t) : { status: 'loading', categories: [], series: [] }),
    [chart, first.data, second.data, year, month, lang, t, enabled],
  )
}

/** The pie view of a standard chart: the shares of its indicators for one country and year. */
export function usePieChart(chart: ChartDefinition, geo: string, year: string, lang: string, enabled: boolean) {
  const requests = pieRequests(chart, geo, year, lang)
  const { data } = useDataset(enabled ? requests.primary : null)
  return useMemo(() => buildPie(chart, data, year, geo), [chart, data, year, geo])
}
