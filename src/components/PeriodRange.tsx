import { useId } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { rangeBounds } from '../services/chartViews'

interface PeriodRangeProps {
  /** Every period the line chart has, oldest first. */
  periods: string[]
  /** The range that is set: a period, or empty for "from the first" / "to the last". */
  from: string
  to: string
  onChange: (from: string, to: string) => void
}

/**
 * Two sliders on one track that choose the first and the last period of the line chart (the time range, as in ENPRICES).
 * They are native range inputs (keyboard: arrow keys, Home, End, PageUp and PageDown; screen readers read the period as
 * the value) drawn as pins on the ECL blue. The first can never pass the last, so the chart always has two periods.
 */
export function PeriodRange({ periods, from, to, onChange }: PeriodRangeProps) {
  const { t } = useTranslation()
  const sentenceId = useId()
  const last = periods.length - 1
  if (last < 1) return null

  const [low, high] = rangeBounds(periods, from, to)
  // Open ends stay empty in the address, so a link says "all periods" and keeps saying it when new data comes.
  const set = (nextLow: number, nextHigh: number) => onChange(nextLow <= 0 ? '' : periods[nextLow], nextHigh >= last ? '' : periods[nextHigh])
  // A pin is 14px wide, so the track a pin can travel is 14px shorter than the slider.
  const at = (index: number) => `calc(${(index / last) * 100}% + ${7 - (index / last) * 14}px)`

  return (
    <div className="period-range">
      <div className="period-range__track">
        <div className="period-range__bar" style={{ left: at(low), right: `calc(100% - ${at(high)})` }} />
        <input
          type="range"
          className="period-range__input"
          min={0}
          max={last}
          step={1}
          value={low}
          aria-label={t('timeline.rangeFrom')}
          aria-valuetext={periods[low]}
          aria-describedby={sentenceId}
          onChange={(event) => set(Math.min(Number(event.target.value), high - 1), high)}
        />
        <input
          type="range"
          className="period-range__input"
          min={0}
          max={last}
          step={1}
          value={high}
          aria-label={t('timeline.rangeTo')}
          aria-valuetext={periods[high]}
          aria-describedby={sentenceId}
          onChange={(event) => set(low, Math.max(Number(event.target.value), low + 1))}
        />
      </div>
      {/* The oldest and the newest period there is, at the two ends of the track (the sentence below says what is set) */}
      <div className="period-range__ends" aria-hidden="true">
        <span>{periods[0]}</span>
        <span>{periods[last]}</span>
      </div>
      <p id={sentenceId} className="period-range__sentence" role="status" aria-live="polite">
        <Trans i18nKey="timeline.periodFiltered" values={{ from: periods[low], to: periods[high] }} components={{ b: <strong /> }} />
      </p>
    </div>
  )
}
