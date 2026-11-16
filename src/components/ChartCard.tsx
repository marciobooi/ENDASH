import { useMemo, type DragEvent, type KeyboardEvent } from 'react'
import { Card } from './Card'
import { Skeleton } from './Skeleton'
import { RoundButton } from './RoundButton'
import { useTranslation } from 'react-i18next'
import { datasetUrl } from '../services/chartTheme'
import { LineChart } from './LineChart'
import { NoDataChart } from './NoDataChart'
import { tableTooltip } from '../services/tooltipOptions'
import { averagePlotLines } from '../services/plotLines'
import type { ChartDefinition } from '../config/toolConfig'
import { useLineChart } from '../hooks/useChartViews'
import { useInView } from '../hooks/useInView'
import type { DashboardState } from '../state/dashboardState'

export interface CardDrag {
  onDragStart: (chartId: string) => void
  onDragOver: (event: DragEvent<HTMLElement>) => void
  onDrop: (chartId: string) => void
  onDragEnd: () => void
  onDragLeave: () => void
  /** A card is being dragged over this one (the drop target). */
  over: boolean
  /** Alt + arrow key: move the card one place (keyboard alternative to dragging). */
  onMove: (chartId: string, direction: -1 | 1) => void
  dragging: boolean
}

interface ChartCardProps {
  chart: ChartDefinition
  geo: string
  state: DashboardState
  patch: (changes: Partial<DashboardState>) => void
  onExpand: () => void
  drag: CardDrag
}

/**
 * One chart of the gallery. Data loads only when the card comes on screen. A median-split card has its own
 * above/below switch; every card can be dragged to another place within its theme.
 */
export function ChartCard({ chart, geo, state, patch, onExpand, drag }: ChartCardProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [ref, visible] = useInView<HTMLElement>()
  const below = state.below.includes(chart.id)
  const { result } = useLineChart(chart, geo, lang, below, state.month, t, visible)
  const title = chart.medianSplit ? `${t(`labels.${chart.id}`)} – ${t(below ? 'labels.OIL_MEDIAN_BELOW' : 'labels.OIL_MEDIAN_ABOVE')}` : t(`labels.${chart.id}`)
  const unit = t(`units.${chart.unit}`, { defaultValue: chart.unit })
  const credits = { text: `Eurostat - ${t('labels.DB')}`, href: datasetUrl(chart.dataset, lang) }
  const noData = t('labels.ERROR2')
  const loading = t('labels.MSG_LOADING')

  const plotLines = useMemo(
    () => (result.status === 'ready' && result.average !== undefined ? averagePlotLines(result.average, t('labels.MEDIAN'), lang) : undefined),
    [result, t, lang],
  )

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowUp')) drag.onMove(chart.id, -1)
    if (event.altKey && (event.key === 'ArrowRight' || event.key === 'ArrowDown')) drag.onMove(chart.id, 1)
  }

  return (
    <Card
      ref={ref}
      id={chart.id}
      classBase="chart-card"
      className={`${drag.dragging ? 'chart-card--dragging' : ''}${drag.over ? ' chart-card--over' : ''}`.trim()}
      title={title}
      titleId={`${chart.id}-title`}
      description={unit}
      draggable
      tabIndex={0}
      aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight"
      onDragStart={() => drag.onDragStart(chart.id)}
      onDragOver={drag.onDragOver}
      onDrop={() => drag.onDrop(chart.id)}
      onDragEnd={drag.onDragEnd}
      onDragLeave={drag.onDragLeave}
      onKeyDown={onKeyDown}
      actions={
        <>
          {chart.medianSplit && (
            <RoundButton
              icon={below ? 'arrow-up' : 'arrow-down'}
              label={t(below ? 'labels.SHOW_ABOVE_MEDIAN' : 'labels.SHOW_BELOW_MEDIAN')}
              aria-pressed={below}
              onClick={() => patch({ below: below ? state.below.filter((id) => id !== chart.id) : [...state.below, chart.id] })}
            />
          )}
          <RoundButton icon="expand" label={t('labels.BTNEXPAND')} onClick={onExpand} />
        </>
      }
    >

      {!visible || result.status === 'loading' ? (
        <Skeleton height={300} label={loading} />
      ) : result.status === 'error' ? (
        <NoDataChart title={title} message={noData} />
      ) : result.status === 'empty' ? (
        <NoDataChart title={title} message={noData} />
      ) : (
        <LineChart
          lang={lang}
          title={title}
          height={300}
          compact
          categories={result.categories}
          series={result.series.map((entry) => ({
            type: 'spline',
            name: entry.name,
            data: entry.data,
            color: entry.color,
            dashStyle: entry.dashed ? 'ShortDash' : undefined,
          }))}
          yAxisPlotLines={plotLines}
          fixedPercentScale={chart.unit === 'PC'}
          credits={credits}
          legend="hidden"
          tooltip={tableTooltip({ t, unit, showTotal: chart.tooltipTotal, outside: true })}
          ariaLabel={title}
          errorMessage={noData}
          loadingMessage={loading}
        />
      )}
    </Card>
  )
}
