import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { LegendPosition } from '../services/chartOptions'
import type { ChartDefinition } from '../config/toolConfig'
import type { LineResult } from '../services/chartViews'
import type { DashboardState, View } from '../state/dashboardState'
import { hasBarToggles, offeredViews, resolveYear } from '../services/calculations'
import { useBarChart, useLineChart, usePieChart } from './useChartViews'
import { useWideLayout } from './useWideLayout'

export interface TimelineModel {
  periods: string[]
  value: string
  label: string
  kind: 'month' | 'year'
}

/** Everything the expanded chart view shows, derived from one chart, the dashboard state and the requested tables. */
export interface ToolViewModel {
  title: string
  unit: string
  credits: { text: string; href: string }
  legend: LegendPosition
  below: boolean
  aggregatesOn: boolean
  barToggles: boolean
  views: View[]
  line: LineResult
  lineAverage: number | undefined
  bar: ReturnType<typeof useBarChart>
  barLabel: string
  pieData: ReturnType<typeof usePieChart>
  year: string
  years: string[]
  timeline: TimelineModel | null
  tableRows: LineResult
}

/** The derived state of the expanded view. Every hook runs on every render, so the data is fetched as views change. */
export function useToolState(chart: ChartDefinition, geo: string, state: DashboardState): ToolViewModel {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const wide = useWideLayout()
  const below = state.below.includes(chart.id)
  const aggregatesOn = state.aggregates === '1'

  const line = useLineChart(chart, geo, lang, below, state.month, t)
  const year = resolveYear(line.years, state.year)
  const bar = useBarChart(chart, year, state.month, aggregatesOn, lang, t, state.view === 'bar')
  const pieData = usePieChart(chart, geo, year, lang, state.view === 'pie')

  const title = chart.medianSplit
    ? `${t(`labels.${chart.id}`)} – ${t(below ? 'labels.OIL_MEDIAN_BELOW' : 'labels.OIL_MEDIAN_ABOVE')}`
    : t(`labels.${chart.id}`)
  const unit = t(`units.${chart.unit}`, { defaultValue: chart.unit })

  const timeline = useMemo<TimelineModel | null>(() => {
    if (state.view !== 'bar' && state.view !== 'pie') return null
    if (state.view === 'bar' && chart.medianSplit) {
      if (!bar.months || bar.months.length === 0) return null
      return { periods: bar.months, value: bar.month ?? '', label: t('labels.TIMELINE_MONTH_SLIDER'), kind: 'month' }
    }
    if (line.years.length === 0) return null
    return { periods: line.years, value: year, label: t('labels.TIMELINE_YEAR_SLIDER'), kind: 'year' }
  }, [state.view, chart.medianSplit, bar.months, bar.month, line.years, year, t])

  return {
    title,
    unit,
    credits: { text: `Eurostat - ${t('labels.DB')}`, href: `https://ec.europa.eu/eurostat/databrowser/view/${chart.dataset}/default/table?lang=${lang.toUpperCase()}` },
    legend: wide ? 'right' : 'bottom',
    below,
    aggregatesOn,
    barToggles: hasBarToggles(chart),
    views: offeredViews(chart),
    line: line.result,
    lineAverage: line.result.status === 'ready' ? line.result.average : undefined,
    bar,
    barLabel: chart.medianSplit ? (bar.month ?? '') : year,
    pieData,
    year,
    years: line.years,
    timeline,
    tableRows: line.result,
  }
}
