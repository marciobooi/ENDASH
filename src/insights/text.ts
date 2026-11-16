import type { TFunction } from 'i18next'
import type { SeriesInsight } from './model'
import { insightCategory } from './model'
import { formatNumber, formatSigned } from './format'

/**
 * The sentence that summarises a series (old buildCategoryInsightText). The wording depends on the kind of indicator:
 * percentages, stocks, electricity, emissions, energy volumes, productivity, intensity or a generic line. The text is
 * in the locale files (`insights.sentence.*`); `categoryTitle` is the chart's ENGLISH title, which only picks the kind.
 */
export function categorySentence(item: SeriesInsight, unitCode: string, unit: string, categoryTitle: string, lang: string, t: TFunction): string {
  const category = insightCategory(categoryTitle, unitCode)
  const value = `${formatNumber(item.latest, lang)} ${unit}`
  const parts = {
    name: item.name || t('insights.sentence.selectedSeries'),
    latest: item.latestYear ? t('insights.sentence.valueInYear', { value, year: item.latestYear }) : value,
    trend: t(`insights.trend.${item.trend}`),
  }
  const key = {
    percentage: 'percentage',
    stocks: 'stocks',
    electricity: 'electricity',
    emissions: 'emissions',
    'energy-volume': 'energyVolume',
    productivity: 'productivity',
    intensity: 'intensity',
  }[category] ?? 'generic'
  const change = formatSigned(item.longTermChange, lang, category === 'percentage' ? t('insights.sentence.pointsUnit') : unit)
  return t(`insights.sentence.${key}`, { ...parts, change })
}
