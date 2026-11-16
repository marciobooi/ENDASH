import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DriveStep } from 'driver.js'
import { features, filters, tourConfig } from './config/toolConfig'
import { describeFilter, useFilters } from './state/filters'
import { useGuidedTour } from './hooks/useGuidedTour'
import { useSiteShell } from './hooks/useSiteShell'
import { DownloadMenu } from './components/DownloadMenu'
import { FilterControls } from './components/FilterControls'
import { SiteFooter } from './components/Footer'
import { GlobalInsightsBody } from './components/insights/GlobalInsightsBody'
import { InsightsPanel } from './components/InsightsPanel'
import { SiteNavigation } from './components/Nav'
import { RoundButton } from './components/RoundButton'
import { ShareMenu } from './components/ShareMenu'
import { SiteSubNavigation } from './components/SubNav'
import { ToolContent } from './components/ToolContent'
import { ChartToolbar } from './components/ChartToolbar'
import { useDashboardState } from './state/dashboardState'
import { chartById } from './config/toolConfig'
import { buildChartTable } from './download/toolTable'
import './App.css'

function App() {
  const { t, i18n } = useTranslation()
  useSiteShell()

  // The filters (src/config/toolConfig.ts) live in the address: shared links and embedded views show this state.
  const [values, setFilter] = useFilters()
  const [insightsOpen, setInsightsOpen] = useState(false)
  const dashboard = useDashboardState()
  const [dashState, patchDashboard] = dashboard
  const expandedChart = dashState.chart ? chartById[dashState.chart] : undefined

  // Context added to the contact e-mail: what the person had selected when they wrote.
  const emailDetails = useMemo(
    () =>
      filters.map((definition) => ({
        label: t(`filters.${definition.id}`),
        value: describeFilter(definition, values[definition.id], t) || '-',
      })),
    [t, values],
  )

  // The steps come from `tourConfig.steps`, their texts from the locale files.
  const tourSteps = useMemo<DriveStep[]>(
    () =>
      tourConfig.steps.map(({ id, element }) => ({
        element,
        popover: {
          title: t(`tour.${id}Title`),
          description: t(`tour.${id}Description`),
        },
      })),
    [t],
  )
  const { startTour } = useGuidedTour(tourSteps)

  // The chart on screen (its address names it) and its loaded table; without one there is no Excel file.
  const downloadMenu = (
    <DownloadMenu
      imageTitle={expandedChart ? t(`labels.${expandedChart.id}`) : t('subnav.title')}
      getTable={() => {
        const chartId = new URLSearchParams(window.location.search).get('chart') ?? ''
        return chartId ? buildChartTable(chartId, String(values.geo), i18n.language, t) : undefined
      }}
    />
  )

  return (
    <>
      <SiteNavigation title={t('brand')} />

      <SiteSubNavigation
        title={t('subnav.title')}
        subtitle={expandedChart ? t(`labels.${expandedChart.id}`) : t('subnav.subtitle')}
        actions={
          expandedChart ? (
            <ChartToolbar
              chart={expandedChart}
              state={dashState}
              patch={patchDashboard}
              onClose={() => patchDashboard({ chart: '', view: 'line', year: '', month: '' })}
              download={features.download ? downloadMenu : undefined}
            />
          ) : (
            <>
              {features.insights && (
                <RoundButton
                  id="insights-button"
                  icon="lightbulb"
                  label={t('insights.open')}
                  aria-haspopup="dialog"
                  onClick={() => setInsightsOpen(true)}
                />
              )}
              {features.download && downloadMenu}
              {features.share && <ShareMenu emailDetails={emailDetails} />}
              {features.tour && (
                <RoundButton id="tour-button" icon="help" label={t('tour.start')} onClick={startTour} />
              )}
            </>
          )
        }
      />

      <main id="main-content" className="visualization-shell">
        <ToolContent
          values={values}
          filters={<FilterControls values={values} onChange={setFilter} />}
          dashboard={dashboard}
        />
      </main>

      {features.insights && (
        <InsightsPanel
          open={insightsOpen}
          onClose={() => setInsightsOpen(false)}
          title={t('insights.title')}
          closeLabel={t('insights.close')}
        >
          <GlobalInsightsBody geo={String(values.geo)} active={insightsOpen} />
        </InsightsPanel>
      )}

      <SiteFooter />
    </>
  )
}

export default App
