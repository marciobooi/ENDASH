import { datasetUrl } from '../charts'
import type { TFunction } from 'i18next'
import { chartById } from '../config/toolConfig'
import { lineQuery, loadedDataset, viewUrl } from '../data/eurostatData'
import { lineDataOf, orderSeries } from '../data/series'
import type { DownloadTable } from './download'

/**
 * The table of the expanded chart for the Excel download: one row per year, one column per series (the line view's
 * data). Returns undefined when the chart or its data is not loaded, so the Excel entry is left out.
 */
export function buildChartTable(chartId: string, geo: string, lang: string, t: TFunction): DownloadTable | undefined {
  const chart = chartById[chartId]
  if (!chart) return undefined
  const dataset = loadedDataset(viewUrl(chart, lineQuery(chart, geo), lang))
  if (!dataset) return undefined
  const parsed = lineDataOf(chart, dataset)
  const series = orderSeries(chart.id, parsed.series, lang)
  const unit = t(`units.${chart.unit}`, { defaultValue: chart.unit })
  const title = t(`labels.${chart.id}`)
  return {
    sheet: title,
    title,
    info: [
      `${t('download.country')}: ${t(`countries.${geo}`, { defaultValue: geo })}`,
      `${t('download.unit')}: ${unit}`,
      `${t('labels.EXPORT_FOOTER_TITLE')} (${chart.dataset})`,
      datasetUrl(chart.dataset, lang),
      `${t('download.downloaded')}: ${new Date().toLocaleDateString(lang)}`,
    ],
    headers: [t('labels.YEAR'), ...series.map((entry) => `${entry.name} (${unit})`)],
    rows: parsed.categories.map((category, row) => [category, ...series.map((entry) => valueText(entry.data[row]))]),
  }
}

/** A cell of the Excel table: the number, or empty when the source has no value. */
function valueText(value: number | null | { y: number; color: string } | undefined): number | string {
  if (value === null || value === undefined) return ''
  return typeof value === 'object' ? value.y : value
}

/** Source line of the download: the dataset of the chart, in the page language. */
export function sourceOf(chartId: string, lang: string): string | undefined {
  const chart = chartById[chartId]
  return chart ? datasetUrl(chart.dataset, lang) : undefined
}
