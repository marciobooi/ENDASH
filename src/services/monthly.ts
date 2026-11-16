import { EU_COUNTRY_CODES, EFTA_COUNTRY_CODES, ENLARGEMENT_COUNTRY_CODES, type ChartDefinition, type DataSource } from '../config/toolConfig'
import { labelOf, type Dataset } from './eurostatData'
import { averageColors } from './chartTheme'
import type { ChartSeries } from './series'

/* Monthly charts (oil stocks, chart_23 to chart_26) and the median-split charts, ported from endash.js. */

/** How many months a country may lag the selected month and still be shown (old MAX_MONTHS_BEHIND). */
export const MAX_MONTHS_BEHIND = 3

/** The real countries of the monthly tables: the aggregate and the countries outside the lists are left out. */
const REAL_COUNTRIES = [...EU_COUNTRY_CODES, ...EFTA_COUNTRY_CODES, ...ENLARGEMENT_COUNTRY_CODES]

/** "2026-09" shifted by `offset` months. Works on the month id, so a gap in one table cannot misalign two windows. */
export function shiftMonth(monthId: string, offset: number): string {
  const [year, month] = monthId.split('-').map(Number)
  const index = year * 12 + (month - 1) + offset
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}`
}

/** "2026-09" as a short month and year in the page language, e.g. "Sep 2026". */
export function formatMonth(monthId: string, lang: string): string {
  const [year, month] = monthId.split('-').map(Number)
  return new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, 1)))
}

/** The current month as "YYYY-MM". */
export function currentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export interface CountryMonths {
  months: string[]
  countries: Array<{ code: string; byMonth: Record<string, number> }>
  geoLabels: Record<string, string>
}

/** Every real country with its monthly values, from a table that holds all countries (old readCountryMonths). */
export function readCountryMonths(d: Dataset): CountryMonths | null {
  const months = d.Dimension('time')?.id ?? []
  const geos = d.Dimension('geo')?.id ?? []
  if (d.value.length !== geos.length * months.length) return null
  const countries = geos
    .map((code, g) => {
      if (!REAL_COUNTRIES.includes(code)) return null
      const byMonth: Record<string, number> = {}
      months.forEach((month, t) => {
        const value = d.value[g * months.length + t]
        if (value !== null && value !== undefined) byMonth[month] = value
      })
      return { code, byMonth }
    })
    .filter((entry): entry is { code: string; byMonth: Record<string, number> } => entry !== null)
  return { months, countries, geoLabels: d.__tree__?.dimension?.geo?.category?.label ?? {} }
}

/** Months (oldest first) in which at least half of the countries have a value. */
export function quorumMonths(parsed: CountryMonths): string[] {
  const quorum = Math.ceil(parsed.countries.length / 2)
  return parsed.months.filter((month) => parsed.countries.filter((country) => month in country.byMonth).length >= quorum)
}

/** Average of the stock over the window, with countries that only report zeros left out (old averageThreshold). */
export function averageThreshold(parsed: CountryMonths, windowSize: number) {
  const anchor = quorumMonths(parsed).pop()
  if (!anchor) return null
  const windowMonths = Array.from({ length: windowSize }, (_, i) => shiftMonth(anchor, i - windowSize + 1))
  const withStock = parsed.countries
    .map((country) => ({ code: country.code, data: windowMonths.map((month) => (month in country.byMonth ? country.byMonth[month] : null)) }))
    .filter((country) => country.data.some((value) => value !== null && value !== 0))
  if (withStock.length === 0) return null
  const total = withStock.reduce((sum, country) => sum + country.data.reduce<number>((s, value) => s + (value ?? 0), 0), 0)
  return { windowMonths, withStock, value: total / windowSize / withStock.length }
}

/** A country's value for `month`, or its latest earlier one within MAX_MONTHS_BEHIND (old latestAtOrBefore). */
export function latestAtOrBefore(country: { byMonth: Record<string, number> } | undefined, month: string): { value: number; month: string } | null {
  if (!country) return null
  if (month in country.byMonth) return { value: country.byMonth[month], month }
  const earlier = Object.keys(country.byMonth).filter((id) => id < month).sort().pop()
  return earlier && earlier >= shiftMonth(month, -MAX_MONTHS_BEHIND) ? { value: country.byMonth[earlier], month: earlier } : null
}

/* ------------------------------------------------------------------ */
/* Combined line: stocks and deliveries of the latest 12 months (23, 25) */
/* ------------------------------------------------------------------ */

export interface CombinedLine {
  categories: string[]
  series: Array<ChartSeries & { color: string; dashed: boolean; previousWindow: boolean }>
}

const COMBINED_COLORS = ['#0033FF', '#E67500']

/**
 * Two tables for one country, merged: the latest `months` months of each, and the same span a year before. Both
 * windows end on the newest month the two tables share, so the lines always cover the same months.
 */
export function combinedLineData(chart: ChartDefinition, tables: [Dataset, Dataset], lang: string): CombinedLine | null {
  const windowSize = chart.months ?? 12
  const sources: [DataSource, DataSource] = [chart, chart.combine as DataSource]
  const valuesOf = tables.map((d) => {
    const months = d.Dimension('time')?.id ?? []
    if (d.value.length !== months.length) return null
    const values: Record<string, number> = {}
    months.forEach((month, i) => {
      const value = d.value[i]
      if (value !== null && value !== undefined) values[month] = value
    })
    return values
  })
  if (valuesOf.some((values) => values === null)) return null
  const [first, second] = valuesOf as [Record<string, number>, Record<string, number>]
  const shared = Object.keys(first).filter((month) => month in second).sort()
  if (shared.length === 0) return null
  const latest = shared[shared.length - 1]

  // windows[0] = the latest `windowSize` months, windows[1] = the span before it.
  const windows = [0, 1].map((back) => Array.from({ length: windowSize }, (_, i) => shiftMonth(latest, i - (back + 1) * windowSize + 1)))
  const rangeLabel = (months: string[]) => `${formatMonth(months[0], lang)} – ${formatMonth(months[months.length - 1], lang)}`

  const series: CombinedLine['series'] = []
  sources.forEach((source, t) => {
    // Each line is named by its flow (stocks or deliveries), the second dimension of the table, as in the old tool.
    const code = source.indicator[0]
    const flowLabel = labelOf(tables[t], source.indicator2Type, source.indicator2[0])
    const values = valuesOf[t] as Record<string, number>
    windows.forEach((months, back) => {
      const data = months.map((month) => (month in values ? values[month] : null))
      if (data.every((value) => value === null)) return
      series.push({
        name: `${flowLabel} (${rangeLabel(months)})`,
        code,
        data,
        color: COMBINED_COLORS[t],
        dashed: back > 0,
        previousWindow: back > 0,
      })
    })
  })

  return { categories: windows[0].map((month) => formatMonth(month, lang)), series }
}

/* ------------------------------------------------------------------ */
/* Median split (24, 26): countries above or below the average          */
/* ------------------------------------------------------------------ */

export interface MedianLine {
  categories: string[]
  series: ChartSeries[]
  average: number
}

/**
 * The line of a median-split chart: each country's monthly stock, keeping only the values on the chosen side of the
 * average ("below" includes the average itself). Countries with nothing left on that side drop out.
 */
export function medianLineData(parsed: CountryMonths, windowSize: number, below: boolean, lang: string, allCountries = false): MedianLine | null {
  const threshold = averageThreshold(parsed, windowSize)
  if (!threshold) return null
  const { windowMonths, withStock, value } = threshold
  const keep = (entry: number | null) => entry !== null && (allCountries || (below ? entry <= value : entry > value))
  const series = withStock
    .map((country) => ({ code: country.code, data: country.data.map((entry) => (keep(entry) ? entry : null)) }))
    .filter((country) => country.data.some((entry) => entry !== null))
    .map((country) => ({ name: parsed.geoLabels[country.code] ?? country.code, code: country.code, data: country.data }))
    .sort((a, b) => a.name.localeCompare(b.name, lang))
  if (series.length === 0) return null
  return { categories: windowMonths.map((month) => formatMonth(month, lang)), series, average: value }
}

/* ------------------------------------------------------------------ */
/* Monthly bar view (24, 26): every country for one month               */
/* ------------------------------------------------------------------ */

export interface MonthlyBars {
  months: string[]
  month: string
  categories: string[]
  /** Averaged charts: one series with a colour per bar. Otherwise one series per table. */
  series: Array<{ name: string; data: Array<number | { y: number; color: string } | null> }>
  average?: number
}

/**
 * The bar view of a monthly chart: every country for the selected month (or its latest earlier month), largest first.
 * An averaged chart colours the bars above the average and draws the average as a line.
 */
export function monthlyBarData(chart: ChartDefinition, d: Dataset, month: string, lang: string, labels: (code: string) => string): MonthlyBars | null {
  const parsed = readCountryMonths(d)
  if (!parsed) return null
  const months = parsed.months.filter((id) => parsed.countries.some((country) => id in country.byMonth))
  const selected = months.includes(month) ? month : months[months.length - 1]
  if (!selected) return null
  const entryOf = (code: string) => latestAtOrBefore(parsed.countries.find((country) => country.code === code), selected)
  const codes = parsed.countries
    .map((country) => country.code)
    .filter((code) => (entryOf(code)?.value ?? 0) > 0)
    .sort((a, b) => (entryOf(b)?.value ?? 0) - (entryOf(a)?.value ?? 0))
  if (codes.length === 0) return null

  const categories = codes.map((code) => {
    const entry = entryOf(code)
    const name = labels(code)
    return entry && entry.month !== selected ? `${name} (${formatMonth(entry.month, lang)})` : name
  })

  if (chart.medianSplit) {
    const threshold = averageThreshold(parsed, chart.months ?? 12)
    if (!threshold) return null
    return {
      months,
      month: selected,
      categories,
      series: [
        {
          name: labels('MEDIAN'),
          data: codes.map((code) => {
            const value = entryOf(code)?.value ?? 0
            return { y: value, color: value > threshold.value ? averageColors.above : averageColors.below }
          }),
        },
      ],
      average: threshold.value,
    }
  }

  return {
    months,
    month: selected,
    categories,
    series: [{ name: labelOf(d, chart.indicatorType, chart.indicator[0] ?? ''), data: codes.map((code) => entryOf(code)?.value ?? null) }],
  }
}
