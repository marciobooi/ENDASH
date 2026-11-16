import { useEffect, useState } from 'react'
import type { TFunction } from 'i18next'
import { charts, type ChartDefinition } from '../config/toolConfig'
import type { LineResult } from '../services/chartViews'
import { insightInput, loadInsightLine } from './input'
import { chartInsight, type ChartInsight } from './model'

/** The charts that have an insights view (old chartOptionEnabled(id, "insights")). */
export const insightCharts: ChartDefinition[] = charts.filter((chart) => chart.views.includes('insights'))

/** The insight summaries of every chart with an insights view, for the overview (loads every chart once). */
export function useGlobalInsights(geo: string, lang: string, t: TFunction, enabled: boolean) {
  const key = `${geo}|${lang}`
  const [loaded, setLoaded] = useState<{ key: string; items: ChartInsight[] } | null>(null)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    Promise.all(insightCharts.map((chart) => loadInsightLine(chart, geo, lang, t, '').then((result) => summaryOf(chart, result)))).then((answers) => {
      if (!cancelled) setLoaded({ key, items: answers.filter((item): item is ChartInsight => item !== null) })
    })
    return () => {
      cancelled = true
    }
  }, [enabled, key, geo, lang, t])

  // Derived, not stored: the result of another country or language counts as "loading" again.
  const ready = enabled && loaded?.key === key
  return { status: ready ? ('ready' as const) : enabled ? ('loading' as const) : ('idle' as const), items: ready ? loaded.items : [] }
}

/** The insight summary of one chart from its line result (null when there is nothing to read). */
export function summaryOf(chart: ChartDefinition, result: LineResult): ChartInsight | null {
  const input = insightInput(chart, result)
  if (!input) return null
  return chartInsight(chart.id, chart.dataset, chart.unit, input.categories, input.series)
}

/** The insight input of one chart (per-chart view): the line result, all countries, without the previous window. */
export function useInsightLine(chart: ChartDefinition, geo: string, lang: string, t: TFunction, enabled: boolean): LineResult | null {
  const key = `${chart.id}|${geo}|${lang}`
  const [loaded, setLoaded] = useState<{ key: string; line: LineResult } | null>(null)
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    loadInsightLine(chart, geo, lang, t, '').then((line) => {
      if (!cancelled) setLoaded({ key, line })
    })
    return () => {
      cancelled = true
    }
  }, [chart, geo, lang, t, enabled, key])
  return enabled && loaded?.key === key ? loaded.line : null
}
