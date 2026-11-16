import { useEffect, useState } from 'react'
import { fetchDataset, type Dataset } from '../services/eurostatData'

export interface DatasetState {
  /** undefined while loading (or when there is no address), null when the request failed, else the dataset. */
  data: Dataset | null | undefined
  loading: boolean
}

/**
 * Reads the table behind `url` (cached per address). Pass `null` to read nothing. The result is always for the
 * address asked for: an answer for an older address is never shown.
 */
export function useDataset(url: string | null): DatasetState {
  const [answer, setAnswer] = useState<{ url: string; data: Dataset | null } | null>(null)

  useEffect(() => {
    if (url === null) return
    let cancelled = false
    fetchDataset(url).then((data) => {
      if (!cancelled) setAnswer({ url, data })
    })
    return () => {
      cancelled = true
    }
  }, [url])

  if (url === null) return { data: undefined, loading: false }
  const current = answer && answer.url === url ? answer.data : undefined
  return { data: current, loading: current === undefined }
}
