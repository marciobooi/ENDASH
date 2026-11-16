import { useCallback, useMemo } from 'react'
import { EclCell, EclNumber, EclRow, EclRowHeader, EclTable } from './EclTable'
import { Loading } from './Loading'
import { Notification } from './Notification'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { chartById } from '../config/toolConfig'
import { useGlobalInsights } from '../insights/useInsightsData'
import { formatNumber } from '../insights/format'
import { dataAlerts, globalAggregates, groupOrder, type Assessment, type ChartInsight, type GlobalAggregates, type Trend } from '../insights/model'
import { insightGroups } from '../insights/storyConfig'
import { Donut } from './Donut'
import { StoryCard } from './StoryCard'

interface GlobalInsightsBodyProps {
  geo: string
  active: boolean
}

type Bar = { label: string; value: number; className?: string }

/** The overview of the visible charts, in the order of the legacy tool: theme tabs, hero, data coverage, theme
 * distribution, latest-data timeline, theme summaries, the overview grid, alerts, takeaways, one story section per
 * theme, and the evidence table (collapsed). */
export function InsightsContent({ geo, active }: GlobalInsightsBodyProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const data = useGlobalInsights(geo, lang, t, active)
  const unitName = useCallback((code: string) => t(`units.${code}`, { defaultValue: code }), [t])

  const items = useMemo(
    () => [...data.items].sort((a, b) => groupOrder(a.storyGroup) - groupOrder(b.storyGroup) || a.chartId.localeCompare(b.chartId, undefined, { numeric: true })),
    [data.items],
  )
  const aggregates = useMemo(() => globalAggregates(items, unitName), [items, unitName])

  if (data.status !== 'ready') {
    return (
      <Loading text={t('labels.GLOBAL_INSIGHTS_LOADING')} centered />
    )
  }
  const headers = ['#', t('insights.evidenceTheme'), t('insights.evidenceStory'), t('insights.evidenceDataset'), t('insights.evidenceMeta'), t('insights.evidenceUnit'), t('insights.topDriver'), t('insights.latest'), t('insights.trendWord')]
  if (items.length === 0) return <Notification>{t('insights.noData')}</Notification>

  const groups = Object.keys(insightGroups).filter((key) => items.some((item) => item.storyGroup === key))
  const alerts = dataAlerts(items)

  return (
    <div className="global-insights">
      <nav className="gi-theme-nav" aria-label={t('labels.THEME_NAV_LABEL')}>
        <ul>
          {groups.map((key) => (
            <li key={key}>
              <a className="gi-theme-nav__link" href={`#gi-section-${key}`}>{t(`labels.${insightGroups[key].labelKey}`)}</a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="insight-hero">
        <p className="insights-kicker">{t('insights.kicker')}</p>
        <h3 className="insights-title">{t('insights.heading')}</h3>
        <p>{t('insights.intro')}</p>
      </section>

      <Block title={t('insights.coverageTitle')} text={t('insights.coverageText')}>
        <dl className="insight-kpis">
          <Kpi label={t('insights.kpiCharts')} value={aggregates.charts} />
          <Kpi label={t('insights.kpiDatasets')} value={Object.keys(aggregates.datasets).length} />
          <Kpi label={t('insights.kpiGroups')} value={new Set(items.map((item) => chartById[item.chartId]?.meta ?? '-')).size} />
          <Kpi label={t('insights.kpiUnits')} value={Object.keys(aggregates.units).length} />
        </dl>
        <div className="insight-explain">
          <p><strong>{t('insights.howGlobally')}</strong> {t('insights.howGloballyText')}</p>
          <ul className="insight-list">
            <li><strong>{t('insights.rising')}</strong>: {t('insights.risingText')}</li>
            <li><strong>{t('insights.falling')}</strong>: {t('insights.fallingText')}</li>
            <li><strong>{t('insights.topDriverWord')}</strong>: {t('insights.topDriverText')}</li>
            <li>{t('insights.interpretText')}</li>
          </ul>
        </div>
      </Block>

      <Block title={t('insights.themeDistribution')} text={t('insights.themeDistributionText')}>
        <Donut
          segments={groups.map((key) => ({ name: t(`labels.${insightGroups[key].labelKey}`), count: aggregates.themes[key] ?? 0 }))}
          label={t('insights.donutLabel')}
          tooltip={(name, count, percent) => `${name}: ${count} ${t('insights.chartsWord')} (${percent.toFixed(1)}%)`}
        />
        <p className="insight-block__note">{groups.length} {t('insights.themesRepresented')}</p>
      </Block>

      <Block title={t('insights.coverageTimeline')} text={t('insights.coverageTimelineText')}>
        <BarList bars={Object.entries(aggregates.latestYears).sort(([a], [b]) => a.localeCompare(b)).map(([year, value]) => ({ label: year, value, className: 'is-neutral' }))} />
      </Block>

      <Block title={t('insights.themeSummaries')} text={t('insights.themeSummariesText')}>
        <ThemeSummaries aggregates={aggregates} groups={groups} />
      </Block>

      <div className="story-overview-grid">
        <Block title={t('insights.trendDirection')} text={t('insights.trendDirectionText')}>
          <DirectionBar segments={trendBars(aggregates.trends, t)} />
        </Block>
        <Block title={t('insights.policyDirection')} text={t('insights.policyDirectionText')}>
          <DirectionBar segments={assessmentBars(aggregates.assessments, t)} />
        </Block>
        <Block title={t('insights.unitsInView')} text={t('insights.unitsInViewText')}>
          <BarList bars={Object.entries(aggregates.units).sort(([a], [b]) => a.localeCompare(b)).map(([label, value]) => ({ label, value }))} />
        </Block>
        <Block title={t('insights.datasetCoverage')} text={t('insights.datasetCoverageText')}>
          <BarList bars={Object.entries(aggregates.datasets).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value }))} />
        </Block>
        <Block title={t('insights.topDrivers')} text={t('insights.topDriversText')}>
          <BarList bars={aggregates.topDrivers.slice(0, 6).map(([label, value]) => ({ label, value, className: 'is-driver' }))} />
        </Block>
        <Block title={t('insights.storyThemes')} text={t('insights.storyThemesText')}>
          <BarList bars={groups.map((key) => ({ label: t(`labels.${insightGroups[key].labelKey}`), value: aggregates.themes[key] ?? 0, className: 'is-category' }))} />
        </Block>
      </div>

      <div className="insights-row">
        <Block title={t('insights.policyAlerts')}>
          <PolicyAlerts aggregates={aggregates} groups={groups} />
        </Block>
        <Block title={t('insights.dataAlerts')}>
          <ul className="insight-list">
            {alerts.map((alert) => <li key={alert}>{alert}</li>)}
          </ul>
        </Block>
      </div>

      <Block title={t('insights.takeaways')}>
        <Takeaways aggregates={aggregates} items={items} />
      </Block>

      {groups.map((key) => (
        <ThemeSection key={key} groupKey={key} items={items.filter((item) => item.storyGroup === key)} lang={lang} unitName={unitName} />
      ))}

      <details className="global-insights-details">
        <summary>{t('insights.openEvidence')}</summary>
        <div className="series-table" tabIndex={0} role="region" aria-label={t('insights.evidence')}>
          <EclTable caption={t('insights.evidence')} captionHidden zebra headers={headers}>
            {items.map((item, index) => (
              <EclRow key={item.chartId}>
                <EclRowHeader label={headers[0]}>{index + 1}</EclRowHeader>
                <EclCell label={headers[1]}>{t(`labels.${insightGroups[item.storyGroup]?.labelKey ?? 'GROUP_OTHER_TITLE'}`)}</EclCell>
                <EclCell label={headers[2]}>{t(`labels.STORY_${item.chartId.toUpperCase()}_TITLE`, { defaultValue: item.chartId })}</EclCell>
                <EclCell label={headers[3]}>{item.dataset}</EclCell>
                <EclCell label={headers[4]}>{chartById[item.chartId]?.meta ?? '-'}</EclCell>
                <EclCell label={headers[5]}>{unitName(item.unitCode)}</EclCell>
                <EclCell label={headers[6]}>{item.top?.name ?? '-'}</EclCell>
                <EclNumber label={headers[7]}>{item.top ? `${formatNumber(item.top.latest, lang)} ${unitName(item.unitCode)}` : '-'}</EclNumber>
                <EclCell label={headers[8]}>{t(`insights.trend.${item.top?.trend ?? 'flat'}`)}</EclCell>
              </EclRow>
            ))}
          </EclTable>
        </div>
      </details>
    </div>
  )
}

function Block({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <section className="insight-block">
      <h4 className="ecl-u-type-heading-5">{title}</h4>
      {text && <p className="insight-block__text">{text}</p>}
      {children}
    </section>
  )
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="insight-kpi">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function BarList({ bars }: { bars: Bar[] }) {
  const max = Math.max(1, ...bars.map((bar) => bar.value))
  return (
    <ul className="insight-bars">
      {bars.map((bar) => (
        <li key={bar.label} className="insight-bar">
          <span className="insight-bar__label">{bar.label}</span>
          <span className="insight-bar__track" aria-hidden="true">
            <span className={`insight-bar__fill ${bar.className ?? ''}`} style={{ width: `${Math.max(4, Math.round((bar.value / max) * 100))}%` }} />
          </span>
          <strong className="insight-bar__value">{bar.value}</strong>
        </li>
      ))}
    </ul>
  )
}

/** A stacked bar with a coloured legend (the trend and policy direction blocks). */
function DirectionBar({ segments }: { segments: Bar[] }) {
  const total = Math.max(1, segments.reduce((sum, segment) => sum + segment.value, 0))
  return (
    <div className="direction-bar">
      <div className="direction-bar__track" aria-hidden="true">
        {segments.map((segment) => (
          <span key={segment.label} className={`direction-bar__segment ${segment.className ?? ''}`} style={{ width: `${(segment.value / total) * 100}%` }} />
        ))}
      </div>
      <ul className="direction-bar__legend">
        {segments.map((segment) => (
          <li key={segment.label}><span className={`direction-dot ${segment.className ?? ''}`} aria-hidden="true" /> {segment.label} <strong>{segment.value}</strong></li>
        ))}
      </ul>
    </div>
  )
}

function trendBars(trends: Record<Trend, number>, t: TFunction): Bar[] {
  return [
    { label: t('insights.rising'), value: trends.up, className: 'is-up' },
    { label: t('insights.falling'), value: trends.down, className: 'is-down' },
    { label: t('insights.stable'), value: trends.flat, className: 'is-flat' },
  ]
}

function assessmentBars(assessments: Record<Assessment, number>, t: TFunction): Bar[] {
  return [
    { label: t('insights.favourable'), value: assessments.favourable, className: 'is-up' },
    { label: t('insights.unfavourable'), value: assessments.unfavourable, className: 'is-down' },
    { label: t('insights.stable'), value: assessments.stable, className: 'is-flat' },
    { label: t('insights.contextual'), value: assessments.contextual, className: 'is-neutral' },
  ]
}

function ThemeSummaries({ aggregates, groups }: { aggregates: GlobalAggregates; groups: string[] }) {
  const { t } = useTranslation()
  const cards = groups
    .map((key) => ({ key, stats: aggregates.themeSummaries[key] }))
    .filter((entry) => entry.stats)
    .sort((a, b) => (b.stats?.charts ?? 0) - (a.stats?.charts ?? 0))
    .slice(0, 9)
  return (
    <div className="theme-mini-summaries">
      {cards.map(({ key, stats }) => (
        <article key={key} className="theme-summary-card">
          <h5>{t(`labels.${insightGroups[key].labelKey}`)}</h5>
          <p>{stats?.charts} {t('insights.chartsWord')}</p>
          <small>{stats?.rising} {t('insights.rising').toLowerCase()} · {stats?.falling} {t('insights.falling').toLowerCase()} · {stats?.stable} {t('insights.stable').toLowerCase()}</small>
        </article>
      ))}
    </div>
  )
}

function PolicyAlerts({ aggregates, groups }: { aggregates: GlobalAggregates; groups: string[] }) {
  const { t } = useTranslation()
  const alerts = groups
    .map((key) => ({ key, stat: aggregates.unfavourableByTheme[key] }))
    .filter((entry) => entry.stat && entry.stat.unfavourable > entry.stat.favourable)
  if (alerts.length === 0) return <p>{t('insights.noPolicyAlert')}</p>
  return (
    <ul className="insight-list">
      {alerts.map(({ key, stat }) => (
        <li key={key}>{t(`labels.${insightGroups[key].labelKey}`)}: {stat?.unfavourable} {t('insights.unfavourable').toLowerCase()} vs {stat?.favourable} {t('insights.favourable').toLowerCase()} {t('insights.indicators')}.</li>
      ))}
    </ul>
  )
}

function Takeaways({ aggregates, items }: { aggregates: GlobalAggregates; items: ChartInsight[] }) {
  const { t } = useTranslation()
  const favourable = aggregates.assessments.favourable
  const unfavourable = aggregates.assessments.unfavourable
  const years = aggregates.latestYearMin !== null && aggregates.latestYearMax !== null ? `${aggregates.latestYearMin} to ${aggregates.latestYearMax}` : t('insights.notAvailable')
  return (
    <ul className="insight-list">
      <li>{items.length} {t('insights.takeawayCharts')}</li>
      <li>{Object.keys(aggregates.datasets).length} {t('insights.takeawayDatasets')} {Object.keys(aggregates.units).length} {t('insights.takeawayUnits')}</li>
      <li>{t('insights.takeawayTotals')}</li>
      <li>{favourable > unfavourable
        ? t('insights.policyMore')
        : unfavourable > favourable
          ? t('insights.policyLess')
          : t('insights.policyBalanced')}</li>
      <li>{aggregates.assessments.contextual} {t('insights.takeawayContextual')}</li>
      <li>{t('insights.takeawayYears')} {years}.</li>
    </ul>
  )
}

function ThemeSection({ groupKey, items, lang, unitName }: { groupKey: string; items: ChartInsight[]; lang: string; unitName: (code: string) => string }) {
  const { t } = useTranslation()
  const group = insightGroups[groupKey]
  const rising = items.filter((item) => item.top?.trend === 'up').length
  const falling = items.filter((item) => item.top?.trend === 'down').length
  const stable = items.filter((item) => item.top?.trend === 'flat').length
  return (
    <section className="story-group-section" id={`gi-section-${groupKey}`} aria-labelledby={`gi-title-${groupKey}`} style={{ '--story-color': group.color } as React.CSSProperties}>
      <header className="story-group-header">
        <div>
          <h3 id={`gi-title-${groupKey}`}>{t(`labels.${group.labelKey}`)}</h3>
          <p>{t(`labels.${group.descKey}`)}</p>
          <p className="story-group-why">{t('labels.INSIGHT_WHY_THEME_MATTERS')} {t(`labels.${group.whyKey}`)}</p>
        </div>
        <ul className="story-group-stats">
          <li><strong>{items.length}</strong> {t('labels.INSIGHT_CHARTS_COUNT_LABEL')}</li>
          <li><strong>{rising}</strong> {t('labels.INSIGHT_RISING')}</li>
          <li><strong>{falling}</strong> {t('labels.INSIGHT_FALLING')}</li>
          <li><strong>{stable}</strong> {t('labels.INSIGHT_STABLE')}</li>
        </ul>
      </header>
      <div className="story-card-grid">
        {items.map((item) => (
          <StoryCard
            key={item.chartId}
            chartId={item.chartId}
            title={t(`labels.STORY_${item.chartId.toUpperCase()}_TITLE`, { defaultValue: item.chartId })}
            role={t(`labels.STORY_${item.chartId.toUpperCase()}_ROLE`, { defaultValue: '' })}
            unit={unitName(item.unitCode)}
            item={item}
            lang={lang}
          />
        ))}
      </div>
    </section>
  )
}
