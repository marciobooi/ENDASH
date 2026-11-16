import { useTranslation } from 'react-i18next'
import type { ChartDefinition } from '../config/toolConfig'
import { useInsightLine } from './useInsightsData'
import { summaryOf } from './useInsightsData'
import type { ChartInsight } from './model'

export interface InsightsPanelState {
  status: 'loading' | 'empty' | 'ready'
  summary: ChartInsight | null
}

/** The per-chart insight input: the chart's series for all countries, read once the insights view is open. */
export function useInsightsPanelState(chart: ChartDefinition, geo: string, enabled: boolean): InsightsPanelState {
  const { i18n, t } = useTranslation()
  const result = useInsightLine(chart, geo, i18n.language, t, enabled)
  if (result === null) return { status: 'loading', summary: null }
  const summary = summaryOf(chart, result)
  return summary ? { status: 'ready', summary } : { status: 'empty', summary: null }
}
