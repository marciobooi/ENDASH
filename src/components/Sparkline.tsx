interface SparklineProps {
  values: number[]
  /** Accessible description, e.g. "Sparkline for Energy poverty. Trend is rising." */
  label: string
  /** Colour of the line (the trend colour). */
  color: string
}

/** A small trend line of the last values of a series (the story cards' sparkline; plain SVG, no chart library). */
export function Sparkline({ values, label, color }: SparklineProps) {
  if (values.length < 2) return <span className="sparkline-empty">—</span>
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const width = 240
  const height = 56
  const points = values
    .map((value, index) => `${(index / (values.length - 1)) * width},${height - ((value - min) / span) * (height - 6) - 3}`)
    .join(' ')
  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
