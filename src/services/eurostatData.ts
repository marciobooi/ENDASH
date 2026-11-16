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

/** The tables are also kept in the browser's Cache Storage, so they survive a page change (the insights page, "back", a reload). */
const STORE = 'endash-eurostat-v1'
/** Eurostat figures change rarely (annual, or monthly for the oil stocks): an hour is fresh enough and avoids every re-download. */
const MAX_AGE_MS = 60 * 60 * 1000

async function readStored(url: string): Promise<unknown | null> {
  try {
    const store = await caches.open(STORE)
    const saved = await store.match(url)
    if (!saved) return null
    if (Date.now() - Number(saved.headers.get('x-saved-at')) > MAX_AGE_MS) {
      await store.delete(url)
      return null
    }
    return await saved.json()
  } catch {
    return null // no Cache Storage (private window, insecure page): the table is simply downloaded
  }
}

async function writeStored(url: string, body: string): Promise<void> {
  try {
    const store = await caches.open(STORE)
    await store.put(url, new Response(body, { headers: { 'content-type': 'application/json', 'x-saved-at': String(Date.now()) } }))
  } catch {
    /* a full or unavailable store only means the next page downloads again */
  }
}

/** A table already read in this page, or undefined. Lets the download (which is synchronous) use what is on screen. */
export function loadedDataset(url: string): Dataset | undefined {
  return loaded.get(url)
}

/**
 * Reads one table; null when the request fails (dataset down, network): the chart then shows its "no data" state. A
 * table is downloaded once per address: this page remembers it, and so does the browser for the next page.
 */
export function fetchDataset(url: string): Promise<Dataset | null> {
  let pending = cache.get(url)
  if (!pending) {
    pending = (async () => {
      let json = await readStored(url)
      if (json === null) {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const body = await response.text()
        json = JSON.parse(body)
        void writeStored(url, body)
      }
      const dataset = JSONstat(json as object).Dataset(0) as Dataset
      loaded.set(url, dataset)
      return dataset
    })().catch(() => {
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

