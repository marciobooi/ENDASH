/**
 * Visual defaults shared by every chart: the palette of the dashboard, the Highcharts font and the credits
 * line that links to the Eurostat dataset the chart comes from.
 */

/** Series palette of the dashboard (the old `colors` list, codes.js). */
export const chartPalette = [
  '#06D7FF', '#19FF99', '#4C99FF', '#FFD900', '#C88000', '#33D129', '#FFB800', '#E67500', '#05A0FF', '#2CB523',
  '#8C4000', '#0033FF', '#00A68C', '#FF8C00', '#00D98C', '#2673FF', '#FFB300', '#FF8A00', '#B35900', '#26A31F',
  '#0573FF',
] as const

/** Colour of the "above / below the average" bars and of the average line. */
export const averageColors = { above: '#E67500', below: '#7F9BD9', line: '#555555' } as const

/** Address of the Eurostat data browser table of a dataset, in the page language. */
export function datasetUrl(dataset: string, language: string): string {
  return `https://ec.europa.eu/eurostat/databrowser/view/${dataset}/default/table?lang=${language.toUpperCase()}`
}

export const chartFontFamily = 'arial, sans-serif'
