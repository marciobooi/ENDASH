import { useMemo } from 'react'
import type Highcharts from 'highcharts'
import { chartPalette } from '../services/chartTheme'
import { legendFor, type LegendPosition } from '../services/chartOptions'
import { WebChart, type ChartStatus } from './WebChart'

export interface PieChartProps {
  title: string
  /** Pairs of [name, value], one slice each; sorted largest first. */
  data: Array<[string, number]>
  /** Unit shown in the tooltip. */
  unitLabel: string
  /** Label of the value in the tooltip (e.g. "Value"). */
  valueLabel: string
  credits?: { text: string; href: string }
  legend: LegendPosition
  lang: string
  ariaLabel: string
  errorMessage: string
  loadingMessage: string
  onStatus?: (status: ChartStatus) => void
  className?: string
}

/** Share of each category in one period: a donut with labelled slices. */
export function PieChart({ title, data, unitLabel, valueLabel, credits, legend, lang, ariaLabel, errorMessage, loadingMessage, onStatus, className }: PieChartProps) {
  const creditsText = credits?.text
  const creditsHref = credits?.href ?? ''
  const options = useMemo<Highcharts.Options>(
    () => ({
      chart: { type: 'pie' },
      title: { text: title, style: { display: 'none' } },
      accessibility: { landmarkVerbosity: 'one', screenReaderSection: { beforeChartFormat: '{chartTitle}. {typeDescription}', afterChartFormat: '' } },
      subtitle: { text: undefined },
      colors: [...chartPalette],
      legend: legendFor(legend),
      tooltip: { useHTML: true, pointFormat: `${valueLabel}: <b>{point.y:,.4f}</b> ${unitLabel}`, hideDelay: 0, animation: false },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          innerSize: '75%',
          showInLegend: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            style: { fontSize: '.8rem', fontWeight: 'normal' },
            formatter() {
              // Break the label after the second word, as the old chart did.
              const parts = String(this.name ?? '').split(' ')
              if (parts.length > 2) parts.splice(2, 0, '<br>')
              return `<b>${parts.join(' ')}</b>:<br>Percentage: ${(this.percentage ?? 0).toFixed(1)}%`
            },
          },
        },
      },
      series: [{ type: 'pie', name: title, data: [...data].sort((a, b) => b[1] - a[1]) }],
      credits: creditsText ? { text: creditsText, href: creditsHref, position: { align: 'center' } } : { enabled: false },
      exporting: { enabled: false },
    }),
    [data, title, unitLabel, valueLabel, creditsText, creditsHref, legend],
  )

  return (
    <WebChart
      options={options}
      lang={lang}
      ariaLabel={ariaLabel}
      errorMessage={errorMessage}
      loadingMessage={loadingMessage}
      onStatus={onStatus}
      className={className}
    />
  )
}
