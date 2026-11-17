import type { KeyboardEvent, RefObject } from 'react'

/** The controls of the toolbar: buttons, the info summary and links (the insights button is a link to its page). */
const ITEMS = 'button, summary, a[href], input[type="checkbox"]'
/** Controls inside an open menu keep their own keys: they are not part of the toolbar's arrow-key row. */
const OWN_KEYS = '.share-popover, .info-links__list'

/**
 * Keyboard navigation of a toolbar: every control is a Tab stop (Tab goes through all of them, in order), and the arrow
 * keys (and up and down) also move between them, Home and End go to the first and the last. Controls inside an open menu
 * keep their own keys.
 */
export function useRovingToolbar(ref: RefObject<HTMLElement | null>) {
  const items = (): HTMLElement[] =>
    ref.current ? [...ref.current.querySelectorAll<HTMLElement>(ITEMS)].filter((element) => !element.closest(OWN_KEYS) && !(element as HTMLButtonElement).disabled) : []

  return {
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if ((event.target as Element).closest(OWN_KEYS)) return
      const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']
      if (!keys.includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return
      const list = items()
      const index = list.indexOf(event.target as HTMLElement)
      if (index === -1) return
      event.preventDefault()
      const last = list.length - 1
      const next =
        event.key === 'Home' ? 0
        : event.key === 'End' ? last
        : event.key === 'ArrowRight' || event.key === 'ArrowDown' ? (index === last ? 0 : index + 1)
        : index === 0 ? last : index - 1
      list[next].focus()
    },
  }
}
