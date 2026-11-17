import { useSyncExternalStore } from 'react'

/** Space the expanded view needs besides the chart: the top band, the switches row, the period control and the source line. */
const SURROUNDING_PX = 395
const MIN_PX = 320
const MAX_PX = 560

const subscribe = (notify: () => void) => {
  window.addEventListener('resize', notify)
  return () => window.removeEventListener('resize', notify)
}
const height = () => Math.min(MAX_PX, Math.max(MIN_PX, window.innerHeight - SURROUNDING_PX))

/**
 * Height in pixels of the expanded line and bar charts: as tall as the window allows while the period control and the source
 * line stay in view without scrolling (never under 320px or over 560px).
 */
export function useChartHeight(): number {
  return useSyncExternalStore(subscribe, height)
}
