import { palette } from './theme'

export interface DonutSegment {
  name: string
  count: number
}

interface DonutProps {
  segments: DonutSegment[]
  /** Accessible description of the chart (read by screen readers). */
  label: string
  /** Text of a segment's tooltip: receives the name, the count and the share. */
  tooltip: (name: string, count: number, percent: number) => string
}

/** A donut of counts (old renderThemeDonut, innerSize 62%): one labelled slice per theme, the tooltip gives the count
 * and the share. Plain SVG so it adds no chart library to the overview. */
export function Donut({ segments, label, tooltip }: DonutProps) {
  const total = Math.max(1, segments.reduce((sum, segment) => sum + segment.count, 0))
  const size = 220
  const radius = 90
  const inner = radius * 0.62
  const circumference = 2 * Math.PI * ((radius + inner) / 2)
  const ring = radius - inner
  // Each slice starts where the previous one ends: the offsets are computed first, so rendering has no side effects.
  const starts = segments.reduce<number[]>((acc, _segment, index) => [...acc, index === 0 ? 0 : acc[index - 1] + segments[index - 1].count / total], [])
  return (
    <figure className="donut" role="img" aria-label={label}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" aria-hidden="true">
        {segments.map((segment, index) => {
          const fraction = segment.count / total
          const dash = fraction * circumference
          return (
            <circle
              key={segment.name}
              cx={size / 2}
              cy={size / 2}
              r={(radius + inner) / 2}
              fill="none"
              stroke={palette[index % palette.length]}
              strokeWidth={ring}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-starts[index] * circumference}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            >
              <title>{tooltip(segment.name, segment.count, fraction * 100)}</title>
            </circle>
          )
        })}
      </svg>
      <figcaption>
        <ul className="donut__legend">
          {segments.map((segment, index) => (
            <li key={segment.name}>
              <span className="donut__swatch" style={{ background: palette[index % palette.length] }} aria-hidden="true" />
              {segment.name}: <strong>{segment.count}</strong>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  )
}
