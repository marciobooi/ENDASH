import JSONstat from 'jsonstat-toolkit'
import { defaultQueryGeos, type ChartDefinition, type DataSource } from '../config/toolConfig'

/* Data access of the dashboard: the Eurostat dissemination API, read with JSON-stat (jsonstat-toolkit).
 * Queries keep the shapes of the old tool (buildApiUrl, buildDatasetApiUrl in basics.js). */

const API = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data'

/** A dataset as read by jsonstat-toolkit (`Dataset(0)`): Dimension(), Data(), value and __tree__ labels. */
export type Dataset = ReturnType<ReturnType<typeof JSONstat>['Dataset']>

export type Query = Array<[string, string]>

export function eurostatUrl(dataset: string, query: Query, lang: string): string {
  const params = new URLSearchParams()
  params.append('format', 'JSON')
  params.append('lang', lang.toUpperCase())
  for (const [key, value] of query) params.append(key, value)
  return `${API}/${encodeURIComponent(dataset)}?${params.toString()}`
}

/** The filters of one source table: its unit, its indicator codes and its fixed second dimension. */
export function sourceQuery(source: DataSource, options: { geo?: string | string[]; time?: string; since?: string } = {}): Query {
  const query: Query = [['unit', source.unit]]
  if (options.geo !== undefined) {
    for (const geo of Array.isArray(options.geo) ? options.geo : [options.geo]) query.push(['geo', geo])
  }
  if (options.time !== undefined) query.push(['time', options.time])
  if (options.since !== undefined) query.push(['sinceTimePeriod', options.since])
  for (const code of source.indicator) query.push([source.indicatorType, code])
  for (const code of source.indicator2) query.push([source.indicator2Type, code])
  return query
}

const cache = new Map<string, Promise<Dataset | null>>()
const loaded = new Map<string, Dataset>()

/** A table already read in this page, or undefined. Lets the download (which is synchronous) use what is on screen. */
export function loadedDataset(url: string): Dataset | undefined {
  return loaded.get(url)
}

/** Reads one table; null when the request fails (dataset down, network): the chart then shows its "no data" state. */
export function fetchDataset(url: string): Promise<Dataset | null> {
  let pending = cache.get(url)
  if (!pending) {
    pending = fetch(url)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
      .then((json) => {
        const dataset = JSONstat(json).Dataset(0) as Dataset
        loaded.set(url, dataset)
        return dataset
      })
      .catch(() => {
        cache.delete(url)
        return null
      })
    cache.set(url, pending)
  }
  return pending
}

/** Value of a cell, or null when the dataset has no value there. */
export function cell(dataset: Dataset, fixed: Record<string, string>): number | null {
  const value = dataset.Data(fixed)?.value
  return typeof value === 'number' ? value : null
}

/** Label of a code of a dimension, in the language of the request (falls back to the code). */
export function labelOf(dataset: Dataset, dimension: string, code: string): string {
  return dataset.__tree__?.dimension?.[dimension]?.category?.label?.[code] ?? code
}

/* ------------------------------------------------------------------ */
/* Queries of the views                                                */
/* ------------------------------------------------------------------ */

/** Line view: one country over the whole history (old lineChart query, chart_17 extra parameters included). */
export function lineQuery(chart: ChartDefinition, geo: string): Query {
  const query = sourceQuery(chart, { geo })
  if (chart.extraParams) for (const [key, value] of Object.entries(chart.extraParams)) query.push([key, value])
  return query
}

/** Bar view: every country of the comparison for one year (old barChart query). */
export function barQuery(chart: ChartDefinition, year: string, geos: readonly string[] = defaultQueryGeos): Query {
  return sourceQuery(chart, { geo: [...geos], time: year })
}

/** Pie view: the shares of the indicators for one country and one year (old pieChart query). */
export function pieQuery(chart: ChartDefinition, geo: string, year: string): Query {
  return sourceQuery(chart, { geo, time: year })
}

/** The request of one chart view, as a URL, for a language. */
export function viewUrl(chart: ChartDefinition, query: Query, lang: string): string {
  return eurostatUrl(chart.dataset, query, lang)
}

