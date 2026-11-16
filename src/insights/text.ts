import type { SeriesInsight } from './model'
import { insightCategory, trendLabel } from './model'
import { formatNumber, formatSigned } from './format'

/**
 * The sentence that summarises a series (old buildCategoryInsightText). The wording depends on the kind of indicator:
 * percentages, stocks, electricity, emissions, energy volumes, productivity, intensity or a generic line.
 */
export function categorySentence(item: SeriesInsight, unitCode: string, unit: string, chartLabel: string, lang: string): string {
  const category = insightCategory(chartLabel, unitCode)
  const name = item.name || 'The selected series'
  const year = item.latestYear ? ` in ${item.latestYear}` : ''
  const latest = `${formatNumber(item.latest, lang)} ${unit}${year}`
  const label = trendLabel(item.trend)
  switch (category) {
    case 'percentage':
      return `${name} reached ${latest}. The long-term change is ${formatSigned(item.longTermChange, lang, 'percentage points')}.`
    case 'stocks':
      return `${name} holds the largest stock in the selected context, with ${latest}. Over the period shown the stock is ${label} (${formatSigned(item.longTermChange, lang, unit)}).`
    case 'electricity':
      return `${name} recorded ${latest}, with a ${label} long-term trend.`
    case 'emissions':
      return `${name} is the main contributor in the selected context, with ${latest}. The long-term trend is ${label}.`
    case 'energy-volume':
      return `${name} is the leading energy component, with ${latest}. The long-term change is ${formatSigned(item.longTermChange, lang, unit)}.`
    case 'productivity':
      return `${name} reached ${latest}. A rising trend usually indicates more economic output per unit of energy.`
    case 'intensity':
      return `${name} reached ${latest}. A falling trend usually indicates lower energy use per unit of output.`
    default:
      return `${name} has a latest value of ${latest} and shows a ${label} trend.`
  }
}

