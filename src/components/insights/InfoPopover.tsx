import { useOutsideClose } from '../../hooks/useOutsideClose'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface InfoPopoverProps {
  /** Name of the chart the explanation belongs to (used in the accessible name). */
  title: string
  what: string
  how: string
  read: string
}

/** The (i) button of a story (old buildSimpleExplainHtml and its bindings): what it shows, how it is calculated, how
 * to read it. Closes on its own button, its Close button, Escape or a click outside; arrow keys move between the
 * info buttons of the page; focus returns to the button when the panel closes with the keyboard. */
export function InfoPopover({ title, what, how, read }: InfoPopoverProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const id = useId()
  const wrapRef = useRef<HTMLSpanElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useOutsideClose(wrapRef, open, () => setOpen(false))

  const close = (refocus: boolean) => {
    setOpen(false)
    if (refocus) buttonRef.current?.focus()
  }

  const onButtonKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return
    event.preventDefault()
    const all = Array.from(document.querySelectorAll<HTMLButtonElement>('.info-popover__button'))
    const index = all.indexOf(event.currentTarget)
    if (index < 0 || all.length === 0) return
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    all[forward ? (index + 1) % all.length : (index - 1 + all.length) % all.length]?.focus()
  }

  return (
    <span className="info-popover" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="info-popover__button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={t('insights.openExplanation')}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onButtonKey}
      >
        i
      </button>
      {open && (
        <span
          id={id}
          className="info-popover__panel"
          role="dialog"
          aria-modal="false"
          aria-label={title}
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              event.stopPropagation()
              close(true)
            }
          }}
        >
          <button type="button" className="info-popover__close" onClick={() => close(true)} aria-label={t('insights.closeExplanation')}>
            {t('labels.CLOSE', { defaultValue: 'Close' })}
          </button>
          <strong>{t('insights.whatShows')}</strong>
          <span>{what}</span>
          <strong>{t('insights.howCalculated')}</strong>
          <span>{how}</span>
          <strong>{t('insights.howToRead')}</strong>
          <span>{read}</span>
        </span>
      )}
    </span>
  )
}
