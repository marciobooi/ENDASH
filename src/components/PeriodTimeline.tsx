import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { timelineStepMs } from '../config/toolConfig'
import { RoundButton } from './RoundButton'

interface PeriodTimelineProps {
  /** Positions the slider can take: years (YYYY) or months (YYYY-MM), oldest first. */
  periods: string[]
  /** The selected period. */
  value: string
  onChange: (period: string) => void
  /** Accessible name of the slider (translated by the caller): "Year slider" or "Month slider". */
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

/** Width one tick label needs, so the labels shown never touch. */
const LABEL_WIDTH = 72
/** The thumb is 24px wide: the track it can travel is 24px shorter than the slider. */
const THUMB = 24

/**
 * The period of the expanded chart as a timeline (the look and CSS of the ENPRICES timeline): a play button that steps
 * through the periods, a bubble with the period over the handle, and a tick for every period with a label for as many
 * as fit. It is a native range input (arrow keys, Home, End, PageUp and PageDown; screen readers read the period as the
 * value). The chart updates when the handle is released (or at once for the keyboard and the animation), not on every
 * step of a drag; a live message tells screen readers what the chart now shows. It stays at the bottom of the window.
 */
export function PeriodTimeline({ periods, value, onChange, label, format, controls, showing, pageStep }: PeriodTimelineProps) {
  const { t } = useTranslation()
  const rangeId = useId()
  const track = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const [width, setWidth] = useState(0)
  const [playing, setPlaying] = useState(false)
  // The position under the pointer while dragging; null otherwise (the slider then shows the selected period).
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState('')

  const last = periods.length - 1
  const selected = Math.max(0, periods.indexOf(value))
  const index = dragIndex ?? selected
  const shown = periods[index] ? format(periods[index]) : ''

  const commit = (position: number) => {
    const period = periods[Math.min(last, Math.max(0, position))]
    if (period === undefined || period === value) return
    onChange(period)
    setAnnouncement(`${showing} ${format(period)}`)
  }

  // How many labels fit: measured on the track, again when it changes size.
  useLayoutEffect(() => {
    const element = track.current
    if (!element) return
    const measure = () => setWidth(element.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [last])

  // The newest `commit`, so the animation timer below never needs it as a dependency.
  const commitRef = useRef(commit)
  useEffect(() => {
    commitRef.current = commit
  })

  // The animation runs while it is on and there is a next period: it waits a moment on a period, then goes to the next.
  const running = playing && selected < last
  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => commitRef.current(selected + 1), timelineStepMs)
    return () => window.clearTimeout(timer)
  }, [running, selected])

  const endDrag = (position: number) => {
    if (!dragging.current) return
    dragging.current = false
    setDragIndex(null)
    commit(position)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'PageUp' && event.key !== 'PageDown') return
    event.preventDefault()
    setPlaying(false)
    commit(selected + (event.key === 'PageUp' ? pageStep : -pageStep))
  }

  if (last < 1) return null

  const at = (i: number) => `calc(${(i / last) * 100}% + ${THUMB / 2 - (i / last) * THUMB}px)`
  const x = (i: number) => (i / last) * Math.max(width - THUMB, 1)
  // Ticks no closer than 6px, so on a narrow screen they stay separate marks, not a solid bar.
  const tickEvery = Math.max(1, Math.ceil(periods.length / Math.max(2, Math.floor(width / 6))))
  const every = Math.max(1, Math.ceil(periods.length / Math.max(2, Math.floor(width / LABEL_WIDTH))))
  // The labels: the selected period always, then the last, the first and every n-th one, each only if it is at least a
  // label's width away from the labels already chosen, so no two ever overlap.
  const candidates = [index, last, 0, ...Array.from({ length: last + 1 }, (_, i) => i).filter((i) => i % every === 0)]
  const labelled = new Set<number>()
  for (const candidate of candidates) {
    if ([...labelled].every((other) => Math.abs(x(candidate) - x(other)) >= LABEL_WIDTH)) labelled.add(candidate)
  }

  return (
    <div className="period-timeline" id="period-timeline" role="group" aria-label={label}>
      <RoundButton
        id="timeline-play"
        icon={running ? 'pause' : 'play'}
        label={t(running ? 'timeline.pause' : 'timeline.play')}
        aria-pressed={running}
        onClick={() => {
          if (!running && selected >= last) commit(0)
          setPlaying(!running)
        }}
      />
      <div className="period-timeline__slider">
        <div className="period-timeline__bubble" style={{ left: at(index) }} aria-hidden="true">{shown}</div>
        <div className="period-timeline__track" ref={track}>
          <input
            id="timeline-slider"
            type="range"
            className="period-timeline__input"
            min={0}
            max={last}
            step={1}
            value={index}
            aria-label={label}
            aria-valuetext={shown}
            aria-controls={controls}
            aria-describedby={rangeId}
            style={{ '--filled': at(index) } as CSSProperties}
            onPointerDown={() => {
              dragging.current = true
              setPlaying(false)
            }}
            onPointerUp={(event) => endDrag(Number(event.currentTarget.value))}
            onPointerCancel={(event) => endDrag(Number(event.currentTarget.value))}
            onKeyDown={onKeyDown}
            onChange={(event) => {
              const position = Number(event.target.value)
              if (dragging.current) setDragIndex(position)
              else {
                setPlaying(false)
                commit(position)
              }
            }}
          />
        </div>
        <div className="period-timeline__ticks" aria-hidden="true">
          {periods.map((period, i) => (
            <span key={period}>
              {(i % tickEvery === 0 || i === last) && <span className="period-timeline__tick" style={{ left: at(i) }} />}
              {labelled.has(i) && (
                <span className={`period-timeline__label${i === index ? ' period-timeline__label--selected' : ''}`} style={{ left: at(i) }}>
                  {format(period)}
                </span>
              )}
            </span>
          ))}
        </div>
        <span id={rangeId} className="ecl-u-sr-only">{`${format(periods[0])} – ${format(periods[last])}`}</span>
      </div>
      <div className="ecl-u-sr-only" role="status" aria-live="polite" aria-atomic="true">
        {running ? t('timeline.playing') : announcement}
      </div>
    </div>
  )
}
