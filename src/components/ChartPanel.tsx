import type { ReactNode } from 'react'
import { Skeleton } from './Skeleton'
import { NoDataChart } from './NoDataChart'

interface ChartPanelProps {
  /** `loading` shows the loading text, `empty` the "no data" figure, `ready` the chart (children). */
  status: 'loading' | 'empty' | 'ready'
  /** Title of the chart, named by the "no data" figure. */
  title: string
  loadingText: string
  noDataText: string
  children: ReactNode
}

/** The three states every chart view goes through, so the views only describe the chart itself. */
export function ChartPanel({ status, title, loadingText, noDataText, children }: ChartPanelProps) {
  if (status === 'loading') return <Skeleton height={360} label={loadingText} />
  if (status === 'empty') return <NoDataChart title={title} message={noDataText} />
  return <>{children}</>
}
