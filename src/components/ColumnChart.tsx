import { useMemo } from 'react'
import { chartPalette } from '../services/chartTheme'
import { cartesianOptions, type CartesianInput } from '../services/chartOptions'
import { WebChart, type ChartStatus } from './WebChart'

export interface ColumnChartProps extends CartesianInput {
  lang: string
  ariaLabel: string
  errorMessage: string
  loadingMessage: string
  onStatus?: (status: ChartStatus) => void
  className?: string
}

/** Comparison of categories (countries, or a range of years): one column per category, stacked or grouped. */
export function ColumnChart({ lang, ariaLabel, errorMessage, loadingMessage, onStatus, className, ...input }: ColumnChartProps) {
  const options = useMemo(() => cartesianOptions(input, 'column', chartPalette), [input])
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
