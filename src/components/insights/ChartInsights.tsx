import { useTranslation } from 'react-i18next'
import { InsightCard } from '../InsightCard'
import { Notification } from '../Notification'
import type { ChartDefinition } from '../../config/toolConfig'
import { explainOf, type ChartInsight } from '../../insights/model'
import { formatNumber, formatSigned } from '../../insights/format'
import { categorySentence } from '../../insights/text'
import type { InsightsPanelState } from './useInsightsPanelState'
import { InfoPopover } from './InfoPopover'

interface ChartInsightsProps {
  chart: ChartDefinition
  title: string
  insights: InsightsPanelState
}

/** The per-chart insights view (old createEnergyInsights): the leading series in four figures and a summary sentence. */
export function ChartInsights({ chart, title, insights }: ChartInsightsProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const unit = t(`units.${chart.unit}`, { defaultValue: chart.unit })

  if (insights.status === 'loading') return <p role="status">{t('labels.MSG_LOADING')}</p>
  if (insights.status === 'empty' || !insights.summary) return <Notification>{t('insights.noData')}</Notification>

  const summary: ChartInsight = insights.summary
  const top = summary.top
  if (!top) return <Notification>{t('insights.noData')}</Notification>
  const explain = explainOf(chart.id)
  const second = summary.series[1] ?? null
  const delta = top.previous === null ? null : top.latest - top.previous
  const percent = top.percentChange === null ? '' : ` (${formatSigned(top.percentChange, lang)}%)`
  const monthly = chart.monthly

  return (
    <section className="insights-page story-local-insight" aria-labelledby={`${chart.id}-insights-title`}>
      <header className="local-story-header">
        <span className="story-icon" aria-hidden="true">{summary.storyIcon}</span>
        <div>
          <div className="story-title-row">
            <h3 className="insights-title" id={`${chart.id}-insights-title`}>{title}</h3>
            {explain && (
              <InfoPopover title={title} what={explain.what} how={explain.how} read={explain.read} />
            )}
          </div>
          <p>{explain?.what ?? title}</p>
        </div>
      </header>

      <div className="insights-cards">
        <InsightCard
          label={top.latestYear ? `${t('insights.latestValue')}, ${top.latestYear}` : t('insights.latestValue')}
          value={`${formatNumber(top.latest, lang)} ${unit}`}
          sub={top.name || t('insights.notAvailable')}
        />
        <InsightCard
          label={top.previousYear ? `${t('insights.changeSince')} ${top.previousYear}` : t('insights.change')}
          value={delta === null ? '-' : formatSigned(delta, lang, unit)}
          sub={monthly ? t('insights.monthChange') : t('insights.annualChange')}
        />
        <InsightCard
          label={top.firstYear ? `${t('insights.changeSince')} ${top.firstYear}` : t('insights.longTerm')}
          value={`${formatSigned(top.longTermChange, lang, unit)}${percent}`}
          sub={`${t(`insights.trend.${top.trend}`)} ${t('insights.trendSuffix')}`}
        />
        <InsightCard
          label={t('insights.highest')}
          value={`${formatNumber(top.maxValue, lang)} ${unit}`}
          sub={`${t('insights.observedIn')} ${top.maxYear}`}
        />
      </div>

      <div className="insights-summary">
        <strong>{t('insights.summary')}</strong>{' '}
        {categorySentence(top, chart.unit, unit, title, lang)}
        {second ? ` ${t('insights.nextSeries')} ${second.name}.` : ''}
      </div>
    </section>
  )
}
