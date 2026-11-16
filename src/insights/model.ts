import type { TFunction } from 'i18next'
import { themes } from '../config/toolConfig'
import { chartStoryConfig, insightGroups, preferredMetricExplainers, sentimentReadingGuide } from './storyConfig'

/* The insight model of the dashboard, ported from old/js/insights.js: the statistics of every series, the summary of
 * a chart, the reading rules (favourable or unfavourable) and the aggregates of the global overview. Pure functions:
 * the React components only render what these return. */

export type Trend = 'up' | 'down' | 'flat'
export type Sentiment = 'higher-is-better' | 'lower-is-better' | 'neutral' | 'contextual'
export type Assessment = 'favourable' | 'unfavourable' | 'stable' | 'contextual'

export interface SeriesPoint {
  year: string
  value: number
}

/** The statistics of one series over the years (old buildInsightSeriesFromChartSeries). */
export interface SeriesInsight {
  name: string
  points: SeriesPoint[]
  total: number
  first: number
  firstYear: string
  latest: number
  latestYear: string
  previous: number | null
  previousYear: string | null
  longTermChange: number
  percentChange: number | null
  maxValue: number
  maxYear: string
  minValue: number
  minYear: string
  trend: Trend
}

/** Numeric points only: missing values are left out, as in the old tool. */
export function validPoints(values: Array<number | null | undefined>, categories: string[]): SeriesPoint[] {
  return values.flatMap((value, index) => (typeof value === 'number' && Number.isFinite(value) ? [{ year: categories[index], value }] : []))
}

export function hasMeaningfulValues(values: number[]): boolean {
  return values.some((value) => value !== 0)
}

export function percentChange(first: number | null, latest: number | null): number | null {
  if (first === null || latest === null || first === 0) return null
  return ((latest - first) / Math.abs(first)) * 100
}

export function trendOf(first: number | null, latest: number | null): Trend {
  if (first === null || latest === null) return 'flat'
  const diff = latest - first
  if (Math.abs(diff) < 0.000001) return 'flat'
  return diff > 0 ? 'up' : 'down'
}

export function trendLabel(trend: Trend): 'rising' | 'falling' | 'stable' {
  return trend === 'up' ? 'rising' : trend === 'down' ? 'falling' : 'stable'
}

/** Statistics of every series with data, largest latest value first (the old order of the breakdown). */
export function seriesInsights(categories: string[], series: Array<{ name: string; data: Array<number | null | { y: number }> }>): SeriesInsight[] {
  return series
    .map((entry) => {
      const points = validPoints(
        entry.data.map((value) => (typeof value === 'object' && value !== null ? value.y : value)),
        categories,
      )
      const values = points.map((point) => point.value)
      if (!hasMeaningfulValues(values)) return null
      const first = points[0]
      const latest = points[points.length - 1]
      const previous = points.length > 1 ? points[points.length - 2] : null
      const max = points.reduce((best, point) => (point.value > best.value ? point : best), points[0])
      const min = points.reduce((best, point) => (point.value < best.value ? point : best), points[0])
      return {
        name: entry.name,
        points,
        total: values.reduce((sum, value) => sum + value, 0),
        first: first.value,
        firstYear: first.year,
        latest: latest.value,
        latestYear: latest.year,
        previous: previous ? previous.value : null,
        previousYear: previous ? previous.year : null,
        longTermChange: latest.value - first.value,
        percentChange: percentChange(first.value, latest.value),
        maxValue: max.value,
        maxYear: max.year,
        minValue: min.value,
        minYear: min.year,
        trend: trendOf(first.value, latest.value),
      } satisfies SeriesInsight
    })
    .filter((entry): entry is SeriesInsight => entry !== null)
    .sort((a, b) => b.latest - a.latest)
}

/** How a movement reads for the indicator (old getDirectionAssessment). */
export function assessmentOf(sentiment: Sentiment, trend: Trend): Assessment {
  if (sentiment === 'neutral' || sentiment === 'contextual') return 'contextual'
  if (trend === 'flat') return 'stable'
  if (sentiment === 'higher-is-better') return trend === 'up' ? 'favourable' : 'unfavourable'
  if (sentiment === 'lower-is-better') return trend === 'down' ? 'favourable' : 'unfavourable'
  return 'contextual'
}

/** Category of a chart for the sentence templates (old getInsightCategory). */
export function insightCategory(chartLabel: string, unitCode: string): string {
  const title = chartLabel.toLowerCase()
  const unit = unitCode.toUpperCase()
  if (title.includes('stocks')) return 'stocks'
  if (unit === 'PC' || title.includes('share') || title.includes('dependency') || title.includes('market share') || title.includes('unable to keep home')) return 'percentage'
  if (title.includes('electricity') || unit === 'GWH') return 'electricity'
  if (title.includes('emission') || unit === 'THS_T') return 'emissions'
  if (title.includes('consumption') || title.includes('supply') || title.includes('energy') || unit === 'KTOE' || unit === 'MTOE' || unit === 'TJ') return 'energy-volume'
  if (title.includes('productivity') || unit === 'EUR_KGOE') return 'productivity'
  if (title.includes('intensity') || unit === 'KGOE_TEUR') return 'intensity'
  return 'generic'
}

export interface ChartInsight {
  chartId: string
  dataset: string
  unitCode: string
  storyGroup: string
  storyIcon: string
  sentiment: Sentiment
  preferredMetric: string
  series: SeriesInsight[]
  total: number
  top: SeriesInsight | null
  topShare: number | null
  trend: Trend
  assessment: Assessment
}

/** The summary of one chart: its series, its leading series and the reading of its movement. */
export function chartInsight(chartId: string, dataset: string, unitCode: string, categories: string[], series: Parameters<typeof seriesInsights>[1]): ChartInsight | null {
  const insights = seriesInsights(categories, series)
  if (insights.length === 0) return null
  const story = chartStoryConfig[chartId]
  const sentiment = (story?.sentiment ?? 'neutral') as Sentiment
  const total = insights.reduce((sum, entry) => sum + entry.total, 0)
  const top = insights[0]
  return {
    chartId,
    dataset,
    unitCode,
    storyGroup: themes.find((theme) => theme.charts.includes(chartId))?.id ?? 'other',
    storyIcon: story?.icon ?? '📊',
    sentiment,
    preferredMetric: story?.preferredMetric ?? 'generic',
    series: insights,
    total,
    top,
    topShare: total ? (top.total / total) * 100 : null,
    trend: top.trend,
    assessment: assessmentOf(sentiment, top.trend),
  }
}

/** Themes in display order (old getInsightGroupConfig, order field). */
export function groupOrder(groupKey: string): number {
  return (insightGroups[groupKey] ?? insightGroups.other).order
}

/** The explanation texts of a chart (old enrichStoryExplain): the configured ones, or the rule by preferred metric. */
export function explainOf(chartId: string) {
  const story = chartStoryConfig[chartId]
  if (!story) return null
  return {
    what: story.simpleExplain.what || story.insightRole,
    how: story.simpleExplain.how || preferredMetricExplainers[story.preferredMetric] || preferredMetricExplainers.generic,
    read: story.simpleExplain.read || sentimentReadingGuide[story.sentiment] || sentimentReadingGuide.contextual,
  }
}

export interface GlobalAggregates {
  charts: number
  datasets: Record<string, number>
  units: Record<string, number>
  trends: Record<Trend, number>
  assessments: Record<Assessment, number>
  themes: Record<string, number>
  latestYears: Record<string, number>
  topDrivers: Array<[string, number]>
  themeSummaries: Record<string, { charts: number; rising: number; falling: number; stable: number }>
  latestYearMin: number | null
  latestYearMax: number | null
  unfavourableByTheme: Record<string, { favourable: number; unfavourable: number }>
}

/** The aggregates of the global overview: counts for every block (old buildGlobal* blocks). */
export function globalAggregates(items: ChartInsight[], unitLabel: (code: string) => string): GlobalAggregates {
  const count = <T extends string>(keys: T[]) => keys.reduce<Record<string, number>>((acc, key) => ({ ...acc, [key]: (acc[key] ?? 0) + 1 }), {})
  const trendOfItem = (item: ChartInsight) => item.top?.trend ?? 'flat'
  const latestYears = items.map((item) => Number(item.top?.latestYear)).filter((year) => !Number.isNaN(year))
  const drivers = count(items.map((item) => item.top?.name ?? '-').filter((name) => name && name !== '-'))
  const unfavourableByTheme: GlobalAggregates['unfavourableByTheme'] = {}
  const themeSummaries: GlobalAggregates['themeSummaries'] = {}
  for (const item of items) {
    const theme = (themeSummaries[item.storyGroup] ??= { charts: 0, rising: 0, falling: 0, stable: 0 })
    theme.charts += 1
    const trend = trendOfItem(item)
    theme[trend === 'up' ? 'rising' : trend === 'down' ? 'falling' : 'stable'] += 1
    const policy = (unfavourableByTheme[item.storyGroup] ??= { favourable: 0, unfavourable: 0 })
    if (item.assessment === 'favourable') policy.favourable += 1
    if (item.assessment === 'unfavourable') policy.unfavourable += 1
  }
  return {
    charts: items.length,
    datasets: count(items.map((item) => item.dataset)),
    units: count(items.map((item) => unitLabel(item.unitCode))),
    trends: { up: items.filter((item) => trendOfItem(item) === 'up').length, down: items.filter((item) => trendOfItem(item) === 'down').length, flat: items.filter((item) => trendOfItem(item) === 'flat').length },
    assessments: {
      favourable: items.filter((item) => item.assessment === 'favourable').length,
      unfavourable: items.filter((item) => item.assessment === 'unfavourable').length,
      stable: items.filter((item) => item.assessment === 'stable').length,
      contextual: items.filter((item) => item.assessment === 'contextual').length,
    },
    themes: count(items.map((item) => item.storyGroup)),
    latestYears: count(items.map((item) => String(item.top?.latestYear ?? '-'))),
    topDrivers: Object.entries(drivers).sort((a, b) => b[1] - a[1]),
    themeSummaries,
    latestYearMin: latestYears.length ? Math.min(...latestYears) : null,
    latestYearMax: latestYears.length ? Math.max(...latestYears) : null,
    unfavourableByTheme,
  }
}

/** Alerts of the global overview (old buildInsightAlerts): missing drivers, older data, unfavourable movements. */
export function dataAlerts(items: ChartInsight[], t: TFunction): string[] {
  const latest = items.map((item) => Number(item.top?.latestYear)).filter((year) => !Number.isNaN(year))
  const newest = latest.length ? Math.max(...latest) : null
  const alerts: string[] = []
  const noDriver = items.filter((item) => !item.top || item.top.name === '-' || item.top.name === '').length
  const noLatest = items.filter((item) => item.top === null).length
  const unfavourable = items.filter((item) => item.assessment === 'unfavourable').length
  const older = newest === null ? 0 : items.filter((item) => Number(item.top?.latestYear) < newest - 1).length
  if (noDriver) alerts.push(t('insights.sentence.alertNoDriver', { count: noDriver }))
  if (noLatest) alerts.push(t('insights.sentence.alertNoLatest', { count: noLatest }))
  if (unfavourable) alerts.push(t('insights.sentence.alertUnfavourable', { count: unfavourable }))
  if (older) alerts.push(t('insights.sentence.alertOlder', { count: older }))
  return alerts.length ? alerts : [t('insights.sentence.alertNone')]
}
