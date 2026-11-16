import type Highcharts from 'highcharts'

/** The average line of the median-split charts (old averagePlotLine): dashed, labelled with its value. */
export function averagePlotLines(value: number, label: string, lang: string): Highcharts.YAxisPlotLinesOptions[] {
  return [
    {
      value,
      color: '#555555',
      width: 2,
      dashStyle: 'Dash',
      zIndex: 5,
      label: {
        text: `${label}: ${Math.round(value).toLocaleString(lang)}`,
        align: 'right',
        style: { color: '#333333', fontWeight: 'bold' },
      },
    },
  ]
}
