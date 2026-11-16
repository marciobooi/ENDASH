import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { ChartDefinition } from '../config/toolConfig'
import { offeredViews } from '../utils/calculations'
import type { DashboardState, View } from '../state/dashboardState'
import { RoundButton } from './RoundButton'
import { WebtoolsIcon } from './WebtoolsIcon'

interface ChartToolbarProps {
  chart: ChartDefinition
  state: DashboardState
  patch: (changes: Partial<DashboardState>) => void
  onClose: () => void
  /** The download control (image and data), shown in the export group. */
  download?: ReactNode
  /** The embed control, next to the download. */
  embed?: ReactNode
}

const VIEW_ICON = {
  line: 'chart-line',
  bar: 'chart-bar',
  pie: 'chart-pie',
  table: 'table',
  insights: 'lightbulb',
} as const satisfies Record<View, string>

/** The toolbar of an expanded chart, shown in the top band in place of the page actions (as in the old tool): the
 * chart's views, its info links and close. */
export function ChartToolbar({ chart, state, patch, onClose, download, embed }: ChartToolbarProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language.toLowerCase()
  const viewLabel: Record<View, string> = {
    line: t('labels.SHOW_LINE_CHART'),
    bar: t('labels.SHOW_BAR_CHART'),
    pie: t('labels.SHOW_PIE_CHART'),
    table: t('labels.SHOW_TABLE'),
    insights: t('labels.SHOW_INSIGHTS'),
  }
  const meta = chart.meta === 'NONE' ? null : `https://ec.europa.eu/eurostat/cache/metadata/en/${chart.meta === 'ilc_sieusilc' ? 'ilc_sieusilc' : `${chart.meta}_esmsip2`}.htm`
  const dataset = `https://ec.europa.eu/eurostat/databrowser/view/${chart.dataset}/default/table?lang=${lang}`

  return (
    <div className="chart-toolbar">
      <div className="chart-toolbar__group" role="group" aria-label={t('labels.OPTIONS_GRAPH_TOOLBOX')}>
      {offeredViews(chart).map((view) => (
        <RoundButton
          key={view}
          icon={VIEW_ICON[view]}
          label={viewLabel[view]}
          variant="primary"
          // The current view is disabled, as in the old tool; ECL styles the disabled button.
          disabled={state.view === view}
          onClick={() => patch({ view })}
        />
      ))}
      </div>
      <div className="chart-toolbar__group">
        {download}
        {embed}
        <details className="info-links">
        <summary className="round-button ecl-button ecl-button--primary ecl-button--icon-only" aria-label={t('labels.INFO')} title={t('labels.INFO')}>
          <span className="ecl-button__container"><WebtoolsIcon set="phosphor" name="info" /></span>
        </summary>
        <ul className="info-links__list">
          {meta && <li><a className="ecl-link" href={meta} target="_blank" rel="noopener">{t('labels.METADATA')}</a></li>}
          <li><a className="ecl-link" href={dataset} target="_blank" rel="noopener">{t('labels.DB')}</a></li>
        </ul>
        </details>
      </div>
      <RoundButton icon="close" label={t('labels.BTNCLOSECHART')} variant="secondary" onClick={onClose} />
    </div>
  )
}
