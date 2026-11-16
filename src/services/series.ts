import type { ChartDefinition } from '../config/toolConfig'
import { cell, labelOf, type Dataset } from './eurostatData'

/** One series of a chart: a name and one value per category (null where the source has none). */
export interface ChartSeries {
  name: string
  /** One value per category; a point may carry its own colour (monthly bars above and below the average). */
  data: Array<number | null | { y: number; color: string }>
  /** Indicator code the series stands for (used to keep the same colour across views). */
  code?: string
}

export interface LineData {
  categories: string[]
  series: ChartSeries[]
}

/** Codes of the indicator dimension that the response holds (old handleData: the response decides, not the config). */
function indicatorCodes(chart: ChartDefinition, d: Dataset): string[] {
  const dimension = d.Dimension(chart.indicatorType)
  return dimension ? dimension.id : chart.indicator
}

/**
 * The time series of a line chart (old handleData() + buildChart()): one series per indicator over the years, or one
 * series for the whole dataset when the chart has no indicator. Missing values count as zero, as in the old tool.
 */
export function lineDataOf(chart: ChartDefinition, d: Dataset): LineData {
  const categories = d.Dimension('time')?.id ?? []

  if (chart.indicator.length === 0 || !chart.indicatorType) {
    return { categories, series: [{ name: d.label ?? chart.id, data: d.value.map((value) => value ?? 0) }] }
  }

  const series = indicatorCodes(chart, d).map((code) => ({
    name: labelOf(d, chart.indicatorType, code),
    code,
    data: categories.map((time) => cell(d, { [chart.indicatorType]: code, time }) ?? 0),
  }))
  return { categories, series }
}

export interface BarData {
  /** Country codes of the comparison, in the order of the data (names are translated by the caller). */
  categories: string[]
  series: ChartSeries[]
}

/** The comparison of countries for one year (old createBarChart + handleData): one series per indicator. */
export function barDataOf(chart: ChartDefinition, d: Dataset, year: string): BarData {
  const categories = d.Dimension('geo')?.id ?? []
  const series = indicatorCodes(chart, d).map((code) => ({
    name: labelOf(d, chart.indicatorType, code),
    code,
    data: categories.map((geo) => cell(d, { [chart.indicatorType]: code, geo, time: year }) ?? 0),
  }))
  return { categories, series }
}

/** Shares of the indicators for one country and year (old piechartdata): only positive values, largest first. */
export function pieDataOf(chart: ChartDefinition, d: Dataset, year: string, geo: string): Array<[string, number]> {
  const indicatorDimension = d.Dimension(chart.indicatorType)
  if (chart.indicator.length === 0 || !indicatorDimension) {
    const value = cell(d, { time: year, geo })
    return value !== null && value > 0 ? [[d.label ?? chart.id, value]] : []
  }
  return chart.indicator
    .map((code): [string, number] | null => {
      const value = cell(d, { [chart.indicatorType]: code, time: year, geo })
      return value !== null && value > 0 ? [labelOf(d, chart.indicatorType, code), value] : null
    })
    .filter((entry): entry is [string, number] => entry !== null)
    .sort((a, b) => b[1] - a[1])
}

/** True when every value of every series is zero (old allSeriesAreZero: the "no data" state). */
export function allZero(series: ChartSeries[]): boolean {
  return series.every((entry) => entry.data.every((value) => value === null || value === 0 || (typeof value === 'object' && value.y === 0)))
}

/** Series order of the line chart: by name in the page language; chart_2 shows the overall renewable share first. */
export function orderSeries(chartId: string, series: ChartSeries[], lang: string): ChartSeries[] {
  if (chartId === 'chart_2') {
    const overall = series.findIndex((entry) => entry.code === 'REN')
    if (overall > 0) return [series[overall], ...series.slice(0, overall), ...series.slice(overall + 1)]
    return series
  }
  return [...series].sort((a, b) => a.name.localeCompare(b.name, lang))
}
