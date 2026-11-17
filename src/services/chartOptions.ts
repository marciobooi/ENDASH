import type Highcharts from 'highcharts'

/** Where the legend sits. `hidden` for gallery cards, which show their series in the tooltip instead. */
export type LegendPosition = 'right' | 'bottom' | 'hidden'

/** Below this window width the legend moves under the chart (old changeLegendPisition()). */
export const WIDE_LAYOUT_PX = 1100

/** Legend placement: beside the chart on wide expanded views, under it on narrow ones, hidden in the gallery. */
export function legendFor(position: LegendPosition): Highcharts.LegendOptions {
  if (position === 'hidden') return { enabled: false }
  // Long series names break onto two lines instead of widening the legend, so the plot keeps more of the width.
  if (position === 'right') {
    return { enabled: true, align: 'right', verticalAlign: 'middle', layout: 'vertical', itemWidth: 230, itemStyle: { textOverflow: 'none' } }
  }
  return { enabled: true, align: 'center', verticalAlign: 'bottom', layout: 'horizontal' }
}

export interface CartesianInput {
  title: string
  /** Plot height in pixels (gallery cards are shorter than the expanded view). */
  height?: number
  /** Compact card (legacy gallery): three value ticks (0, middle, top) and small axis text. */
  compact?: boolean
  categories: string[]
  series: Highcharts.SeriesOptionsType[]
  /** Axis title (the unit). Leave it out where the unit is already written next to the chart (gallery cards). */
  yAxisTitle?: string
  /** Format of the axis labels, Highcharts syntax (default: thousands separators, no decimals). */
  yAxisFormat?: string
  /** Horizontal reference line(s), e.g. the average. */
  yAxisPlotLines?: Highcharts.YAxisPlotLinesOptions[]
  /** Percentage shares sit on a fixed 0 to 100 scale. */
  fixedPercentScale?: boolean
  /** Every category label, rotated (expanded view), or only the first and last (gallery). */
  allLabels?: boolean
  /** Source link drawn inside the chart (gallery cards). Left out where the page shows it under the chart. */
  credits?: { text: string; href: string }
  colors?: readonly string[]
  legend: LegendPosition
  tooltip: Highcharts.TooltipOptions
  /** Columns stack into one bar (default) or show shares of each stack (percentage). */
  stacking?: 'normal' | 'percent'
  onPointClick?: Highcharts.PointClickCallbackFunction
}

/** Options shared by line and column charts: one category axis, one value axis with a title. */
export function cartesianOptions(input: CartesianInput, type: 'spline' | 'column', palette: readonly string[]): Highcharts.Options {
  return {
    // The gallery card keeps only a small margin around the plot, so the chart uses the whole card width. Bars with country names
    // turned 45 degrees need a little room to the left of the first bar: most of the longest name lies under the value axis.
    // The bottom keeps room for the credits only where there are some (gallery cards); the expanded view shows the source under the chart.
    chart: { type, height: input.height, spacingBottom: input.credits ? 70 : 15, plotShadow: false, ...(input.compact ? { spacingLeft: 0, spacingRight: 4 } : {}), ...(type === 'column' && input.allLabels ? { spacingLeft: 56 } : {}) },
    // The title names the chart for screen readers (its region label). It is not drawn: the card or the page shows it.
    title: { text: input.title, style: { display: 'none' } },
    subtitle: { text: undefined },
    accessibility: { landmarkVerbosity: 'one', screenReaderSection: { beforeChartFormat: '{chartTitle}. {typeDescription}. {xAxisDescription}. {yAxisDescription}', afterChartFormat: '' } },
    xAxis: {
      categories: input.categories,
      labels: {
        rotation: input.allLabels ? -45 : 0,
        align: input.allLabels ? 'right' : 'center',
        step: input.allLabels ? undefined : Math.max(input.categories.length - 1, 1),
        // Rotated labels are never shortened: every category name is shown in full (the legend sits below them).
        style: { textOverflow: 'none', whiteSpace: 'nowrap', fontSize: input.compact ? '0.8em' : undefined, ...(input.allLabels ? { width: '16rem' } : {}) },
      },
    },
    yAxis: {
      // `null` hides the title; an empty or undefined one would bring back Highcharts' default "Value".
      // The typings leave `null` out, but it is what Highcharts documents for "no title".
      title: { text: input.yAxisTitle ?? (null as unknown as undefined) },
      labels: { format: input.yAxisFormat ?? '{value:,.0f}', style: input.compact ? { fontSize: '0.8em' } : undefined },
      tickAmount: input.compact ? 3 : undefined,
      plotLines: input.yAxisPlotLines,
      softMin: input.fixedPercentScale ? 0 : undefined,
      softMax: input.fixedPercentScale ? 100 : undefined,
    },
    colors: [...(input.colors ?? palette)],
    legend: legendFor(input.legend),
    tooltip: { ...input.tooltip, shared: true, useHTML: true, hideDelay: 0, animation: false },
    plotOptions: {
      column: { stacking: input.stacking },
      // No animation (as in the legacy tool): the picture saved right after a chart appears is never of half-drawn bars.
      series: { animation: false, connectNulls: true, cursor: 'pointer', marker: { enabled: input.allLabels ?? false }, point: { events: { click: input.onPointClick } } },
    },
    series: input.series,
    credits: input.credits ? { text: input.credits.text, href: input.credits.href, position: { align: 'center' } } : { enabled: false },
    // The legacy tool hides the chart's context (hamburger) menu: the context button is switched off, the rest stays.
    exporting: { enabled: true, buttons: { contextButton: { enabled: false } } },
  }
}
