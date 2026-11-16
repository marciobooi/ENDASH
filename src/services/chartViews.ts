import type { TFunction } from 'i18next'
import { defaultQueryGeos, type ChartDefinition } from '../config/toolConfig'
import { barQuery, eurostatUrl, lineQuery, pieQuery, sourceQuery, viewUrl } from './eurostatData'
import { ENERGY_DATASET, ENERGY_FILTERS, POPULATION_DATASET, POPULATION_FILTERS } from './perCapita'
import type { Dataset } from './eurostatData'
import { allZero, barDataOf, lineDataOf, orderSeries, pieDataOf, type ChartSeries } from './series'
import { combinedLineData, currentMonth, medianLineData, monthlyBarData, readCountryMonths, shiftMonth } from './monthly'
import { perCapitaBars, perCapitaSeries } from './perCapita'

/* The three views of a chart (line, bar, pie) with their requests and their results, for every kind of chart:
 * standard, combined (23, 25), median split (24, 26) and per-capita (8). Each view has a request part and a build part,
 * so the React hooks only fetch and call the build. */

export interface Requests {
  primary: string | null
  secondary: string | null
}

export const isPerCapita = (chart: ChartDefinition) => chart.special === 'perCapita'

/** Requests of the line view. Median charts read every country since a window before the current month. */
export function lineRequests(chart: ChartDefinition, geo: string, lang: string, month: string): Requests {
  if (isPerCapita(chart)) {
    return {
      primary: eurostatUrl(ENERGY_DATASET, [['geo', geo], ...ENERGY_FILTERS], lang),
      secondary: eurostatUrl(POPULATION_DATASET, [['geo', geo], ...POPULATION_FILTERS], lang),
    }
  }
  if (chart.combine) {
    return {
      primary: viewUrl(chart, sourceQuery(chart, { geo }), lang),
      secondary: eurostatUrl(chart.combine.dataset, sourceQuery(chart.combine, { geo }), lang),
    }
  }
  if (chart.medianSplit) {
    const windowSize = chart.months ?? 12
    // Empty month (nothing chosen yet) means the current month: the window must always be a real month.
    const since = shiftMonth(month || currentMonth(), -(windowSize + 6))
    return { primary: viewUrl(chart, sourceQuery(chart, { since }), lang), secondary: null }
  }
  return { primary: viewUrl(chart, lineQuery(chart, geo), lang), secondary: null }
}

export type LineResult =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'empty' }
  | { status: 'ready'; categories: string[]; series: LineSeries[]; average?: number }

export interface LineSeries extends ChartSeries {
  color?: string
  dashed?: boolean
}

/** Builds the line view from its tables. `below` is the median-split side; `t` names the per-capita series. */
export function buildLine(
  chart: ChartDefinition,
  tables: [Dataset | null | undefined, Dataset | null | undefined],
  lang: string,
  below: boolean,
  t: TFunction,
  allCountries = false,
): LineResult {
  const [first, second] = tables
  if (first === undefined || (chart.combine && second === undefined) || (isPerCapita(chart) && second === undefined)) return { status: 'loading' }
  if (first === null || (chart.combine && second === null) || (isPerCapita(chart) && second === null)) return { status: 'error' }

  if (isPerCapita(chart)) {
    const { categories, values } = perCapitaSeries(first, second as Dataset, geoOf(first))
    return { status: values.every((value) => value === null) ? 'empty' : 'ready', categories, series: [{ name: t('labels.chart_8'), data: values }] }
  }
  if (chart.combine) {
    const combined = combinedLineData(chart, [first, second as Dataset], lang)
    if (!combined) return { status: 'empty' }
    return { status: 'ready', categories: combined.categories, series: combined.series }
  }
  if (chart.medianSplit) {
    const parsed = readCountryMonths(first)
    const windowSize = chart.months ?? 12
    const median = parsed ? medianLineData(parsed, windowSize, below, lang, allCountries) : null
    if (!median) return { status: 'empty' }
    return { status: 'ready', categories: median.categories, series: median.series, average: median.average }
  }

  const parsed = lineDataOf(chart, first)
  const series = orderSeries(chart.id, parsed.series, lang)
  if (allZero(series)) return { status: 'empty' }
  return { status: 'ready', categories: parsed.categories, series }
}

/** The geo of a one-country table (its only geo). */
function geoOf(d: Dataset): string {
  return d.Dimension('geo')?.id?.[0] ?? ''
}

/** Requests of the bar view: one year for every country of the comparison, or a month for median charts. */
export function barRequests(chart: ChartDefinition, year: string, aggregates: boolean, lang: string): Requests {
  if (isPerCapita(chart)) {
    // Every country and the full history: the year is picked from the loaded tables (cheap, and it keeps the slider honest).
    return {
      primary: eurostatUrl(ENERGY_DATASET, ENERGY_FILTERS, lang),
      secondary: eurostatUrl(POPULATION_DATASET, POPULATION_FILTERS, lang),
    }
  }
  if (chart.medianSplit) return { primary: viewUrl(chart, sourceQuery(chart, {}), lang), secondary: null }
  const comparison = aggregates ? defaultQueryGeos : defaultQueryGeos.filter((code) => code !== 'EU27_2020')
  return { primary: viewUrl(chart, barQuery(chart, year, comparison), lang), secondary: null }
}

export interface BarResult {
  status: 'loading' | 'error' | 'empty' | 'ready'
  categories: string[]
  series: ChartSeries[]
  average?: number
  /** Monthly bars: the month shown and the months the slider can take. */
  month?: string
  months?: string[]
}

/** Builds the bar view. Categories are country codes; the caller names them. */
export function buildBar(
  chart: ChartDefinition,
  tables: [Dataset | null | undefined, Dataset | null | undefined],
  year: string,
  month: string,
  lang: string,
  t: TFunction,
): BarResult {
  const country = (code: string) => t(`countries.${code}`, { defaultValue: code })
  const [first, second] = tables
  if (first === undefined) return { status: 'loading', categories: [], series: [] }
  if (first === null || (isPerCapita(chart) && second === null)) return { status: 'error', categories: [], series: [] }

  if (isPerCapita(chart)) {
    if (second === undefined) return { status: 'loading', categories: [], series: [] }
    const { categories, values } = perCapitaBars(first, second as Dataset, year)
    const named = categories.map((code) => country(code))
    const series = [{ name: t('labels.chart_8'), data: values }]
    return { status: values.every((value) => value === null) ? 'empty' : 'ready', categories: named, series }
  }
  if (chart.medianSplit) {
    const bars = monthlyBarData(chart, first, month, lang, country)
    if (!bars) return { status: 'empty', categories: [], series: [] }
    return {
      status: 'ready',
      categories: bars.categories,
      series: bars.series,
      average: bars.average,
      month: bars.month,
      months: bars.months,
    }
  }
  const parsed = barDataOf(chart, first, year)
  if (allZero(parsed.series)) return { status: 'empty', categories: [], series: [] }
  return { status: 'ready', categories: parsed.categories.map((code) => country(code)), series: parsed.series }
}

/** Requests of the pie view (standard charts only). */
export function pieRequests(chart: ChartDefinition, geo: string, year: string, lang: string): Requests {
  return { primary: viewUrl(chart, pieQuery(chart, geo, year), lang), secondary: null }
}

export function buildPie(chart: ChartDefinition, d: Dataset | null | undefined, year: string, geo: string): Array<[string, number]> | null | undefined {
  if (d === undefined || d === null) return d
  return pieDataOf(chart, d, year, geo)
}

/** The years of a chart, from its line table (the timeline range). */
export function yearsOf(d: Dataset | null | undefined): string[] {
  return d ? (d.Dimension('time')?.id ?? []) : []
}
