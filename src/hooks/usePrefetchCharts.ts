import { useEffect } from 'react'
import { chartById, themes } from '../config/toolConfig'
import { lineRequests } from '../services/chartViews'
import { fetchDataset } from '../services/eurostatData'

/** How many tables are requested at the same time: a few, so the cards on screen are not held up. */
const CONCURRENCY = 3
/** The cards on screen ask for their own tables at once; the rest wait this long, so those go first. */
const START_DELAY_MS = 600

/**
 * Downloads the tables of the whole gallery in the background, a few at a time, so a card that is scrolled to already
 * has its data. Only the download is done ahead: a chart is still drawn when its card comes near the screen (drawing is
 * the costly part). Tables are kept per address (see fetchDataset), so a table is never downloaded twice, and a new
 * country or language is what starts a new round.
 */
export function usePrefetchCharts(geo: string, lang: string, month: string, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    // Someone who asked to save data keeps the lazy behaviour.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return

    let cancelled = false
    const urls = themes
      .flatMap((theme) => theme.charts)
      .flatMap((id) => {
        const chart = chartById[id]
        if (!chart) return []
        const { primary, secondary } = lineRequests(chart, geo, lang, month)
        return [primary, secondary].filter((url): url is string => url !== null)
      })

    let active = 0
    const next = () => {
      while (!cancelled && active < CONCURRENCY && urls.length > 0) {
        const url = urls.shift() as string
        active += 1
        void fetchDataset(url).finally(() => {
          active -= 1
          next()
        })
      }
    }
    const timer = window.setTimeout(next, START_DELAY_MS)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [geo, lang, month, enabled])
}
