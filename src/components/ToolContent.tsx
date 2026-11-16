import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { chartById, embedConfig, type ChartDefinition } from '../config/toolConfig'
import type { FilterValues } from '../state/filters'
import type { DashboardState } from '../state/dashboardState'
import { ToolView } from './ToolView'
import { Notification } from './Notification'
import { Gallery } from './Gallery'
import { ThemeNav } from './ThemeNav'

interface ToolContentProps {
  /** The country selector, shown under the topic row of the gallery. */
  filters?: ReactNode
  /** Chart of an embedded view (`?embed=chart_N`): that chart is shown expanded. */
  chartId?: string
  /** The filters in force (from the address): the country. */
  values: FilterValues
  headingLevel?: 1 | 2
  /** The dashboard state and its setter, owned by the page (the band's chart toolbar reads the same state). */
  dashboard: readonly [DashboardState, (changes: Partial<DashboardState>) => void]
}

/**
 * The content of the dashboard: the gallery, or one chart expanded. This is the one place that owns the dashboard
 * state, so the gallery and the expanded chart always agree.
 */
export function ToolContent({ chartId, values, filters, dashboard, headingLevel }: ToolContentProps) {
  const { t } = useTranslation()
  const [state, patch] = dashboard
  // The chart that was open: when the gallery comes back, focus returns to its card.
  const [lastOpened, setLastOpened] = useState('')
  const geo = String(values.geo ?? 'BE')

  if (chartId !== undefined && !embedConfig.charts.includes(chartId)) {
    return <Notification variant="error" className="tool-content__message">{t('labels.ERROR2')}</Notification>
  }

  const expandedId = chartId ?? state.chart
  const expanded: ChartDefinition | undefined = expandedId ? chartById[expandedId] : undefined

  return (
    <div className="tool-content">
      {expanded ? (
        <ToolView
          chart={expanded}
          geo={geo}
          state={state}
          patch={patch}
          headingLevel={headingLevel}
        />
      ) : (
        <>
          <ThemeNav visible />
          {filters && <div className="gallery-filters">{filters}</div>}
        <Gallery
          geo={geo}
          state={state}
          patch={patch}
          returnFocusTo={lastOpened}
          onExpand={(chart) => {
            setLastOpened(chart.id)
            patch({ chart: chart.id, view: 'line', year: '', month: '' })
          }}
        />
        </>
      )}
    </div>
  )
}
