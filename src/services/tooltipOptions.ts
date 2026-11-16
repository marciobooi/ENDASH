import type Highcharts from 'highcharts'
import type { TFunction } from 'i18next'
import { tooltipTable, type TooltipPoint } from './tooltip'

interface TableTooltipInput {
  t: TFunction
  /** Translated unit of the values (the header of the value column). */
  unit: string
  /** Chart setting `tooltipTotal`: end the table with a "Total" row (only when the series are parts of one whole). */
  showTotal: boolean
  /** Stacked as shares: show each series' percentage instead of its value. */
  percentage?: boolean
  /** Draw the tooltip outside the chart, so it can pass the edge of a small card (the old tool did this for the gallery). */
  outside?: boolean
}

/** The tooltip of the old tool: a table with the category, one row per series, and optionally a total. */
export function tableTooltip({ t, unit, showTotal, percentage = false, outside = false }: TableTooltipInput): Highcharts.TooltipOptions {
  const labels = { valueHeader: percentage ? '%' : unit, total: t('labels.TOTAL'), noValue: t('labels.FLAG_NA') }
  return {
    useHTML: true,
    shared: true,
    outside,
    padding: 0,
    hideDelay: 0,
    animation: false,
    formatter() {
      // In a shared tooltip Highcharts passes the points of every series at this x position.
      const points = (this as unknown as { points?: TooltipPoint[] }).points ?? []
      return points.length > 0 ? tooltipTable(points, { labels, showTotal, percentage }) : ''
    },
  }
}
