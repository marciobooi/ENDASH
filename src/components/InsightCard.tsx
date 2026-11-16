import type { ReactNode } from 'react'

interface InsightCardProps {
  /** Small caption above the value (e.g. "Latest value, 2024"). */
  label: ReactNode
  /** The figure. */
  value: ReactNode
  /** Line below the value (series name, note). */
  sub: ReactNode
}

/** One figure of the per-chart insights: caption, value and a note under it. */
export function InsightCard({ label, value, sub }: InsightCardProps) {
  return (
    <article className="insight-card">
      <div className="insight-label">{label}</div>
      <div className="insight-value">{value}</div>
      <div className="insight-sub">{sub}</div>
    </article>
  )
}
