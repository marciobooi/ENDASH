import { useRef, useState, type KeyboardEvent } from 'react'

interface TimelineProps {
  /** Positions the slider can take: years (YYYY) or months (YYYY-MM), oldest first. */
  periods: string[]
  /** The selected period. */
  value: string
  onChange: (period: string) => void
  /** Accessible name of the slider (translated by the caller). */
  label: string
  /** How a period is shown (e.g. "Sep 2026" for a month). */
  format: (period: string) => string
  /** Id of the region the slider changes (the expanded chart), for `aria-controls`. */
  controls: string
  /** Translated "Showing": announced with the period after every change ("Showing 2020"). */
  showing: string
  /** How many positions PageUp / PageDown move: 10 years or 3 months (old tool). */
  pageStep: number
}

/**
 * Slider over the periods of a chart (old Timeline). A native range input in ECL's range markup and styles (without
 * ECL's value bubble, which would show the position instead of the year): it keeps the keyboard and screen reader
 * behaviour of a slider without custom code. The chart updates when the handle is released (or at once for the
 * keyboard), not on every step of a drag; a live message tells screen readers what the chart now shows.
 */
export function Timeline({ periods, value, onChange, label, format, controls, showing, pageStep }: TimelineProps) {
  const selected = Math.max(0, periods.indexOf(value))
  // The position under the pointer while dragging; null otherwise (the slider then shows the selected period).
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const dragging = useRef(false)

  const index = dragIndex ?? selected
  const shown = periods[index] ? format(periods[index]) : ''
  const last = Math.max(0, periods.length - 1)

  const commit = (position: number) => {
    const period = periods[Math.min(last, Math.max(0, position))]
    if (period === undefined || period === value) return
    onChange(period)
    setAnnouncement(`${showing} ${format(period)}`)
  }

  const endDrag = (position: number) => {
    if (!dragging.current) return
    dragging.current = false
    setDragIndex(null)
    commit(position)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'PageUp' && event.key !== 'PageDown') return
    event.preventDefault()
    commit(selected + (event.key === 'PageUp' ? pageStep : -pageStep))
  }

  return (
    <div className="timeline">
      <label className="timeline__label" htmlFor="timeline-slider">
        {label}: <strong>{shown}</strong>
      </label>
      <div className="ecl-range-container ecl-range-container--l">
        <input
          id="timeline-slider"
          className="ecl-range ecl-range--l"
          type="range"
          min={0}
          max={last}
          step={1}
          value={index}
          aria-valuetext={shown}
          aria-controls={controls}
          onPointerDown={() => {
            dragging.current = true
          }}
          onPointerUp={(event) => endDrag(Number(event.currentTarget.value))}
          onPointerCancel={(event) => endDrag(Number(event.currentTarget.value))}
          onKeyDown={onKeyDown}
          onChange={(event) => {
            const position = Number(event.target.value)
            if (dragging.current) setDragIndex(position)
            else commit(position)
          }}
        />
      </div>
      <span className="timeline__ends" aria-hidden="true">
        {periods.length > 0 ? `${format(periods[0])} – ${format(periods[periods.length - 1])}` : ''}
      </span>
      <div className="ecl-u-sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
    </div>
  )
}
