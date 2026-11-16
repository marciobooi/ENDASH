interface NoDataChartProps {
  /** Title of the chart the message belongs to. */
  title: string
  /** Translated "no data to display" text. */
  message: string
  className?: string
}

/** Placeholder in place of a chart when the source has no value (old nullishChart()). */
export function NoDataChart({ title, message, className }: NoDataChartProps) {
  return (
    <figure className={className ? `no-data-chart ${className}` : 'no-data-chart'} aria-label={title}>
      <figcaption className="no-data-chart__title">{title}</figcaption>
      <p role="status" className="no-data-chart__message">{message}</p>
    </figure>
  )
}
