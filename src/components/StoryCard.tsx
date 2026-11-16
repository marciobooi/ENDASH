import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import type { ChartInsight, SeriesInsight, Trend } from '../insights/model'
import { explainOf } from '../insights/model'
import { formatNumber, formatSigned } from '../insights/format'
import { Sparkline } from './Sparkline'
import { InfoPopover } from './InfoPopover'

const TREND_COLOR: Record<Trend, string> = { up: '#0e8a3d', down: '#c0392b', flat: '#6c757d' }

interface StoryCardProps {
  chartId: string
  title: string
  role: string
  unit: string
  item: ChartInsight
  lang: string
}

/** One story of the overview (old buildStoryCard): the latest value and change, first, peak and lowest values, the
 * breakdown of the leading series and the reading of its movement. */
/** ECL label variant of each trend (rising draws attention, falling is strongest, stable is quiet). */
const TREND_LABEL = { up: 'highlight', down: 'high', flat: 'low' } as const

export function StoryCard({ chartId, title, role, unit, item, lang }: StoryCardProps) {
  const { t } = useTranslation()
  const top: SeriesInsight | null = item.top
  const explain = explainOf(chartId)
  const trend = top?.trend ?? 'flat'
  const trendText = t(`insights.trend.${trend}`)
  const sparkPoints = top ? top.points.slice(-20).map((point) => point.value) : []
  const sparkTrend = sparkPoints.length < 2 ? 'flat' : Math.abs(sparkPoints[sparkPoints.length - 1] - sparkPoints[0]) < 1e-6 ? 'flat' : sparkPoints[sparkPoints.length - 1] > sparkPoints[0] ? 'up' : 'down'
  const latestText = top ? `${formatNumber(top.latest, lang)} ${unit}` : t('insights.noLatest')
  const changeText = top ? formatSigned(top.longTermChange, lang, unit) : t('insights.noChange')
  const breakdown = item.series.slice(0, 5)
  const breakdownMax = Math.max(1, ...breakdown.map((entry) => Math.abs(entry.latest)))
  const lang2 = lang
  const sparkValues = top ? top.points.slice(-20).map((point) => point.value) : []

  return (
    <article className={`story-card story-group-${item.storyGroup}`}>
      <header className="story-card__header">
        <span className="story-icon" aria-hidden="true">{item.storyIcon}</span>
        <div>
          <div className="story-title-row">
            <h4>{title}</h4>
            {explain && (
              <InfoPopover title={title} what={explain.what} how={explain.how} read={explain.read} />
            )}
          </div>
          <p>{role}</p>
        </div>
      </header>

      <div className="story-card__sparkline">
        <Sparkline
          values={sparkValues}
          color={TREND_COLOR[sparkTrend]}
          label={`${t('insights.sparkline')} ${title}. ${t('insights.trendIs')} ${trendText}.`}
        />
      </div>

      <dl className="story-card__kpis">
        <div>
          <dt>{t('insights.latest')}</dt>
          <dd>{latestText}</dd>
          <small>{top?.latestYear ?? '-'}</small>
        </div>
        <div>
          <dt>{t('insights.longTerm')}</dt>
          <dd>{changeText}</dd>
          <small>{trendText}</small>
        </div>
      </dl>

      {top && (
        <dl className="story-card__facts">
          <div>
            <dt>{t('insights.first')}</dt>
            <dd>{formatNumber(top.first, lang)} {unit}</dd>
            <small>{top.firstYear}</small>
          </div>
          <div>
            <dt>{t('insights.peak')}</dt>
            <dd>{formatNumber(top.maxValue, lang)} {unit}</dd>
            <small>{top.maxYear}</small>
          </div>
          <div>
            <dt>{t('insights.lowest')}</dt>
            <dd>{formatNumber(top.minValue, lang)} {unit}</dd>
            <small>{top.minYear}</small>
          </div>
        </dl>
      )}

      {breakdown.length > 0 && (
        <div className="story-breakdown">
          <p className="story-card__section-title">{t('insights.breakdown')}</p>
          {breakdown.map((entry) => (
            <div className="story-breakdown__row" key={entry.name}>
              <span className="story-breakdown__label" title={entry.name}>{entry.name}</span>
              <span className="story-breakdown__track">
                <span className="story-breakdown__fill" style={{ width: `${Math.max(4, Math.round((Math.abs(entry.latest) / breakdownMax) * 100))}%` }} />
              </span>
              <strong>{formatNumber(entry.latest, lang2)} {unit}</strong>
            </div>
          ))}
        </div>
      )}

      {top && <p className="story-interpretation">{interpretation(item, unit, lang, t)}</p>}

      <footer className="story-card__footer">
        <span>{t('insights.topDriver')}: {top?.name ?? '-'}</span>
        <span className={`ecl-label ecl-label--${TREND_LABEL[trend]}`}>{trendText}</span>
      </footer>
    </article>
  )
}

/** The sentence under the breakdown (old buildStoryInterpretation): its wording follows the chart's metric type. */
function interpretation(item: ChartInsight, unit: string, lang: string, t: TFunction): string {
  const top = item.top
  if (!top) return ''
  const key = {
    'percentage-point-change': 'pointChange',
    'dependency-risk': 'dependency',
    'top-driver-and-share': 'share',
    'top-driver-and-trend': 'driverTrend',
    'generation-mix': 'generationMix',
    'social-risk': 'socialRisk',
    'latest-and-change': 'latestChange',
  }[item.preferredMetric] ?? 'fallback'
  return t(`insights.sentence.${key}`, {
    driver: top.name || t('insights.sentence.leadingSeries'),
    latest: `${formatNumber(top.latest, lang)} ${unit}`,
    year: top.latestYear,
    trend: t(`insights.trend.${top.trend}`),
    change: formatSigned(top.longTermChange, lang, key === 'pointChange' ? t('insights.sentence.pointsUnit') : unit),
  })
}

export type { SeriesInsight }
