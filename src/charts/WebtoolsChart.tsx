import type Highcharts from 'highcharts'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '../components/Skeleton'
import { Button } from '../components/Button'
import { Notification } from '../components/Notification'
import { WebtoolsIcon } from '../components/WebtoolsIcon'
import { destroyWebtoolsChart, pruneUndefined, renderWebtoolsChart } from '../services/webtools'

export type ChartStatus = 'loading' | 'ready' | 'error'

export interface WebtoolsChartProps {
  /** Highcharts configuration, drawn by the Webtools charts service. */
  options: Highcharts.Options
  /** Two-letter language code: Webtools translates its own chart texts with it. */
  lang: string
  /** Accessible name of the chart, read by screen readers. */
  ariaLabel: string
  /** Text shown when Webtools cannot draw the chart. */
  errorMessage: string
  /** Text shown while Webtools draws the chart. */
  loadingMessage: string
  /** Receives the chart's status (loading, ready, error). */
  onStatus?: (status: ChartStatus) => void
  className?: string
}

/**
 * The one place a chart is drawn. Every chart component (line, column, pie) renders through it. The chart is created
 * for each language, updated in place when its options change, and destroyed on unmount.
 */
export function WebtoolsChart({ options, lang, ariaLabel, errorMessage, loadingMessage, onStatus, className }: WebtoolsChartProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<Highcharts.Chart | null>(null)
  const optionsRef = useRef(options)
  const onStatusRef = useRef(onStatus)
  const [status, setStatus] = useState<ChartStatus>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    optionsRef.current = options
    onStatusRef.current = onStatus
  })

  // Draw (or redraw, after a language change or a retry).
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const abort = new AbortController()
    const cancelled = () => abort.signal.aborted
    setStatus('loading')
    onStatusRef.current?.('loading')

    renderWebtoolsChart(container, optionsRef.current, lang, (chart) => {
      if (cancelled()) {
        destroyWebtoolsChart(chart)
        return
      }
      chartRef.current = chart
      setStatus('ready')
      onStatusRef.current?.('ready')
    }, abort.signal).catch(() => {
      if (cancelled()) return
      setStatus('error')
      onStatusRef.current?.('error')
    })

    return () => {
      abort.abort()
      if (chartRef.current) destroyWebtoolsChart(chartRef.current)
      chartRef.current = null
      container.innerHTML = ''
    }
  }, [lang, attempt])

  // Later option changes update the live chart.
  useEffect(() => {
    chartRef.current?.update(pruneUndefined(options), true, true)
  }, [options])

  return (
    <div className={className ? `webtools-chart ${className}` : 'webtools-chart'} role="group" aria-label={ariaLabel}>
      {status === 'loading' && <Skeleton height={typeof options.chart?.height === 'number' ? options.chart.height : 300} label={loadingMessage} />}
      {status === 'error' && (
        <Notification variant="error" className="webtools-chart__state">
          {errorMessage}{' '}
          <Button variant="tertiary" icon={<WebtoolsIcon set="phosphor" name="arrow-clockwise" />} onClick={() => setAttempt((count) => count + 1)}>
            {t('labels.RETRY')}
          </Button>
        </Notification>
      )}
      <div ref={containerRef} className="webtools-chart__plot" />
    </div>
  )
}
