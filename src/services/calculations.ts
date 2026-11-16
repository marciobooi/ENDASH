/**
 * Business calculations of the energy dashboard, as flat typed functions. Each rule of the legacy tool (old/js) has
 * one entry point here. The implementations live beside their domain (series, monthly, per-capita, insights model);
 * this module is the single import for components and hooks.
 */
import type { ChartDefinition } from '../config/toolConfig'
import type { View } from '../state/dashboardState'
import { isPerCapita } from './chartViews'

export {
  allZero,
  barDataOf,
  lineDataOf,
  orderSeries,
  pieDataOf,
  type ChartSeries,
  type LineData,
  type BarData,
} from './series'
export {
  averageThreshold,
  combinedLineData,
  currentMonth,
  formatMonth,
  latestAtOrBefore,
  medianLineData,
  monthlyBarData,
  quorumMonths,
  readCountryMonths,
  shiftMonth,
  type CountryMonths,
} from './monthly'
export { categorySentence } from '../insights/text'
export { perCapitaBars, perCapitaSeries, perCapitaValue } from './perCapita'
export {
  assessmentOf,
  chartInsight,
  dataAlerts,
  explainOf,
  globalAggregates,
  groupOrder,
  insightCategory,
  percentChange,
  seriesInsights,
  trendLabel,
  trendOf,
  type Assessment,
  type ChartInsight,
  type SeriesInsight,
  type Trend,
} from '../insights/model'

/** The year a bar or pie view shows: the one asked for when the chart has it, else the newest (old chartApiCallWithYearFallback). */
export function resolveYear(years: readonly string[], asked: string): string {
  return years.includes(asked) ? asked : (years[years.length - 1] ?? '')
}

/** The views a chart offers: the line view plus its listed views, without the pie for the per-capita chart (the old tool shows none). */
export function offeredViews(chart: ChartDefinition): View[] {
  const listed = (['bar', 'pie', 'table', 'insights'] as const).filter((view) => chart.views.includes(view) && !(view === 'pie' && isPerCapita(chart)))
  return ['line', ...listed]
}

/** Whether the bar view has the percentage and EU-aggregate toggles: standard charts only (not median or per-capita). */
export function hasBarToggles(chart: ChartDefinition): boolean {
  return !chart.medianSplit && chart.special !== 'perCapita'
}
