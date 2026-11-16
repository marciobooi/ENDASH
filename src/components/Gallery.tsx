import { useEffect, useRef, useState, type DragEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { chartById, themes, type ChartDefinition } from '../config/toolConfig'
import type { DashboardState } from '../state/dashboardState'
import { ChartCard, type CardDrag } from './ChartCard'

interface GalleryProps {
  geo: string
  state: DashboardState
  patch: (changes: Partial<DashboardState>) => void
  onExpand: (chart: ChartDefinition) => void
  /** The card that had the focus before a chart was opened: it gets the focus back when the gallery returns. */
  returnFocusTo?: string
}

/**
 * The gallery: every chart, grouped by energy topic. Cards can be dragged into another place within their theme, or
 * moved with Alt + arrow keys. The order is kept while the page is open (the old tool did not keep it either).
 */
export function Gallery({ geo, state, patch, onExpand, returnFocusTo }: GalleryProps) {
  const { t } = useTranslation()
  const [order, setOrder] = useState<Record<string, string[]>>(() => Object.fromEntries(themes.map((theme) => [theme.id, [...theme.charts]])))
  // The dragged card is read by the drop handler: a ref, so a drop never depends on a re-render having happened.
  const dragged = useRef<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  // The card under the pointer while dragging: it gets the drop highlight.
  const [overId, setOverId] = useState<string | null>(null)
  // Spoken feedback for a move made with the keyboard (a polite status message).
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (returnFocusTo) document.getElementById(returnFocusTo)?.focus()
  }, [returnFocusTo])

  const themeOf = (chartId: string) => themes.find((theme) => theme.charts.includes(chartId))?.id

  const moveWithin = (chartId: string, target: string | number) => {
    const themeId = themeOf(chartId)
    if (!themeId) return
    setOrder((current) => {
      const list = current[themeId].filter((id) => id !== chartId)
      const index = typeof target === 'number' ? target : list.indexOf(target)
      if (index < 0) return current
      list.splice(index, 0, chartId)
      return { ...current, [themeId]: list }
    })
  }

  const drag = (chartId: string): CardDrag => ({
    dragging: draggingId === chartId,
    over: overId === chartId,
    onDragLeave: () => setOverId((current) => (current === chartId ? null : current)),
    onDragStart: (id) => {
      dragged.current = id
      setDraggingId(id)
    },
    onDragOver: (event: DragEvent<HTMLElement>) => {
      const from = dragged.current ? themeOf(dragged.current) : undefined
      if (from && from === themeOf(chartId)) {
        event.preventDefault()
        setOverId(chartId)
      }
    },
    onDrop: (targetId) => {
      const source = dragged.current
      if (source && source !== targetId && themeOf(source) === themeOf(targetId)) moveWithin(source, targetId)
      dragged.current = null
      setDraggingId(null)
      setOverId(null)
    },
    onDragEnd: () => {
      dragged.current = null
      setDraggingId(null)
      setOverId(null)
    },
    onMove: (id, direction) => {
      const themeId = themeOf(id)
      if (!themeId) return
      const list = order[themeId]
      const index = list.indexOf(id) + direction
      if (index >= 0 && index < list.length) {
        moveWithin(id, index)
        setAnnouncement(t('labels.CARD_MOVED', { title: t(`labels.${id}`), position: index + 1, total: list.length }))
      }
    },
  })

  return (
    <div className="gallery">
      <p className="ecl-u-sr-only" role="status">{announcement}</p>
      {themes.map((theme) => {
        const charts = (order[theme.id] ?? theme.charts).map((id) => chartById[id]).filter(Boolean)
        return (
          <section key={theme.id} className="theme-section" aria-labelledby={theme.id}>
            <h2 id={theme.id} tabIndex={-1} className="ecl-u-type-heading-2 theme-section__heading">
              {t(`labels.${theme.labelKey}`)}
            </h2>
            {charts.length === 0 ? (
              <p className="theme-section__empty">{t('labels.THEME_COMING_SOON')}</p>
            ) : (
              <div className="card-grid">
                {charts.map((chart) => (
                  <ChartCard
                    key={chart.id}
                    chart={chart}
                    geo={geo}
                    state={state}
                    patch={patch}
                    onExpand={() => onExpand(chart)}
                    drag={drag(chart.id)}
                  />
                ))}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
