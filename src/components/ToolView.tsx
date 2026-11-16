import { useEffect, useMemo, useRef } from 'react'
import { Button } from './Button'
import { ChartPanel } from './ChartPanel'
import { useTranslation } from 'react-i18next'
import { ColumnChart } from './ColumnChart'
import { LineChart } from './LineChart'
import { PieChart } from './PieChart'
import { averagePlotLines } from '../services/plotLines'
import { tableTooltip } from '../services/tooltipOptions'
import type { ChartDefinition } from '../config/toolConfig'
import { useToolState } from '../hooks/useToolState'
import { viewShowsOneCountry, type DashboardState } from '../state/dashboardState'
import { useInsightsPanelState } from '../insights/useInsightsPanelState'
import { ChartInsights } from './ChartInsights'
import { RoundButton } from './RoundButton'
import { SeriesTable } from './SeriesTable'
import { SourceNote } from './SourceNote'
import { formatMonth } from '../services/monthly'
import { PeriodRange } from './PeriodRange'
import { PeriodTimeline } from './PeriodTimeline'
import { ToolbarIcon } from './ToolbarIcon'

/** The panel state of a loaded chart result: an error counts as "no data". */
const panelStatus = (status: 'loading' | 'ready' | 'empty' | 'error'): 'loading' | 'empty' | 'ready' =>
  status === 'loading' ? 'loading' : status === 'ready' ? 'ready' : 'empty'

interface ToolViewProps {
  chart: ChartDefinition
  geo: string
  state: DashboardState
  patch: (changes: Partial<DashboardState>) => void
  /** 2 under the banner's h1; 1 in the embedded view, which has no banner. */
  headingLevel?: 1 | 2
}

/** One chart in one view at a time, with its controls: the view buttons, the year or month slider, the bar toggles and
 * the median switch. Everything it shows comes from useToolState. */
export function ToolView({ chart, geo, state, patch, headingLevel = 2 }: ToolViewProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const model = useToolState(chart, geo, state)
  const noData = t('labels.ERROR2')
  const loading = t('labels.MSG_LOADING')
  const insights = useInsightsPanelState(chart, geo, state.view === 'insights')

  // Expanding replaces the gallery: keyboard and screen reader focus moves to the chart's heading, not to the page body.
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [chart.id])

  const lineAverage = useMemo(
    () => (model.lineAverage !== undefined ? averagePlotLines(model.lineAverage, t('labels.MEDIAN'), lang) : undefined),
    [model.lineAverage, t, lang],
  )
  const barAverage = useMemo(
    () => (model.bar.average !== undefined ? averagePlotLines(model.bar.average, t('labels.MEDIAN'), lang) : undefined),
    [model.bar.average, t, lang],
  )
  const toggleBelow = () => patch({ below: model.below ? state.below.filter((id) => id !== chart.id) : [...state.below, chart.id] })

  return (
    <div className="expanded-chart" id={`${chart.id}-expanded`}>
      <header className="expanded-chart__header">
        <div className="textGroup">
          <Heading id={`${chart.id}-expanded-title`} ref={headingRef} tabIndex={-1}>{model.title}</Heading>
          <p className="expanded-chart__unit">
            {model.unit}
            {viewShowsOneCountry(state.view) && <span className="print-only"> – {t(`countries.${geo}`)}</span>}
          </p>
        </div>
      </header>

      {state.view === 'line' && chart.medianSplit && (
        <div className="expanded-chart__options">
          <Button variant="secondary" aria-pressed={model.below} onClick={toggleBelow} icon={<ToolbarIcon name={model.below ? 'arrow-up' : 'arrow-down'} />}>
            {t(model.below ? 'labels.SHOW_ABOVE_MEDIAN' : 'labels.SHOW_BELOW_MEDIAN')}
          </Button>
        </div>
      )}

      {state.view === 'bar' && model.barToggles && (
        <div className="expanded-chart__options">
          <RoundButton
            icon="percent"
            label={t('labels.SHOW_PERCENTAGE')}
            variant={state.percentage === '1' ? 'primary' : 'secondary'}
            aria-pressed={state.percentage === '1'}
            onClick={() => patch({ percentage: state.percentage === '1' ? '0' : '1' })}
          />
          <RoundButton
            icon="swap"
            label={t('labels.SHOW_AGGREGATES')}
            variant={model.aggregatesOn ? 'primary' : 'secondary'}
            aria-pressed={model.aggregatesOn}
            onClick={() => patch({ aggregates: model.aggregatesOn ? '0' : '1' })}
          />
        </div>
      )}


      <div className="expanded-chart__body">
        {state.view === 'line' && (
          <ChartPanel status={panelStatus(model.line.status)} title={model.title} loadingText={loading} noDataText={noData}>
            {model.line.status === 'ready' && (
              <LineChart
                lang={lang}
                title={model.title}
                categories={model.line.categories}
                series={model.line.series.map((entry) => ({ type: 'spline', name: entry.name, data: entry.data, color: entry.color, dashStyle: entry.dashed ? 'ShortDash' : undefined }))}
                yAxisTitle={model.unit}
                yAxisPlotLines={lineAverage}
                fixedPercentScale={chart.unit === 'PC'}
                allLabels
                legend={model.legend}
                tooltip={tableTooltip({ t, unit: model.unit, showTotal: chart.tooltipTotal })}
                ariaLabel={model.title}
                errorMessage={noData}
                loadingMessage={loading}
              />
            )}
          </ChartPanel>
        )}

        {state.view === 'bar' && (
          <ChartPanel status={panelStatus(model.bar.status)} title={model.title} loadingText={loading} noDataText={noData}>
            {model.bar.status === 'ready' && (
              <ColumnChart
                lang={lang}
                title={model.title}
                categories={model.bar.categories}
                series={model.bar.series.map((entry) => ({ type: 'column', name: entry.name, data: entry.data }))}
                yAxisTitle={model.unit}
                yAxisPlotLines={barAverage}
                allLabels
                fixedPercentScale={chart.unit === 'PC'}
                stacking={model.barToggles && state.percentage === '1' ? 'percent' : 'normal'}
                legend={model.legend}
                tooltip={tableTooltip({ t, unit: model.unit, showTotal: chart.tooltipTotal, percentage: model.barToggles && state.percentage === '1' })}
                ariaLabel={`${model.title} – ${model.barLabel}`}
                errorMessage={noData}
                loadingMessage={loading}
              />
            )}
          </ChartPanel>
        )}

        {state.view === 'pie' && (
          <ChartPanel
            status={model.pieData === undefined ? 'loading' : model.pieData === null || model.pieData.length === 0 ? 'empty' : 'ready'}
            title={model.title}
            loadingText={loading}
            noDataText={noData}
          >
            {model.pieData && (
              <PieChart
                title={model.title}
                data={model.pieData}
                unitLabel={model.unit}
                valueLabel={t('labels.VAL')}
                legend={model.legend}
                lang={lang}
                ariaLabel={`${model.title} – ${geo} – ${model.year}`}
                errorMessage={noData}
                loadingMessage={loading}
              />
            )}
          </ChartPanel>
        )}

        {state.view === 'table' && model.tableRows.status === 'ready' && (
          <SeriesTable caption={model.title} firstHeader={t('labels.YEAR')} categories={model.tableRows.categories} series={model.tableRows.series} unitLabel={model.unit} />
        )}

        {state.view === 'insights' && (
          <ChartInsights chart={chart} title={model.title} insights={insights} />
        )}
      </div>

      {(state.view === 'line' || state.view === 'table') && model.periods.length > 1 && (
        <PeriodRange periods={model.periods} from={state.from} to={state.to} onChange={(from, to) => patch({ from, to })} />
      )}
      {model.timeline && (
        <PeriodTimeline
          periods={model.timeline.periods}
          value={model.timeline.value}
          label={model.timeline.label}
          format={model.timeline.kind === 'month' ? (period) => formatMonth(period, lang) : (period) => period}
          controls={`${chart.id}-expanded`}
          showing={t('labels.TIMELINE_SHOWING')}
          pageStep={model.timeline.kind === 'month' ? 3 : 10}
          onChange={(period) => patch(model.timeline?.kind === 'month' ? { month: period } : { year: period })}
        />
      )}

      {(state.view === 'line' || state.view === 'bar' || state.view === 'pie' || state.view === 'table') && <SourceNote dataset={chart.dataset} />}

    </div>
  )
}
