import { useMemo } from 'react'
import { chartPalette } from '../services/chartTheme'
import { cartesianOptions, type CartesianInput } from '../services/chartOptions'
import { WebChart, type ChartStatus } from './WebChart'

export interface LineChartProps extends CartesianInput {
  lang: string
  ariaLabel: string
  errorMessage: string
  loadingMessage: string
  onStatus?: (status: ChartStatus) => void
  className?: string
}

/** Time series: one line per series over its categories (years or months). */
export function LineChart({ lang, ariaLabel, errorMessage, loadingMessage, onStatus, className, ...input }: LineChartProps) {
  const options = useMemo(() => cartesianOptions(input, 'spline', chartPalette), [input])
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
