import { useMemo } from 'react'
import { chartPalette } from './chartTheme'
import { cartesianOptions, type CartesianInput } from './cartesian'
import { WebtoolsChart, type ChartStatus } from './WebtoolsChart'

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
    <WebtoolsChart
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
