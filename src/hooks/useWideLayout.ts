import { useSyncExternalStore } from 'react'
import { WIDE_LAYOUT_PX } from '../charts'

const query = window.matchMedia(`(min-width: ${WIDE_LAYOUT_PX + 1}px)`)
const subscribe = (notify: () => void) => {
  query.addEventListener('change', notify)
  return () => query.removeEventListener('change', notify)
}

/** True while the window is wide enough for a legend beside the chart (old changeLegendPisition() breakpoint). */
export function useWideLayout(): boolean {
  return useSyncExternalStore(subscribe, () => query.matches)
}
