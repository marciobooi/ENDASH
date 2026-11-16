import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { DriveStep } from 'driver.js'
import { useTranslation } from 'react-i18next'
import { features, tourConfig } from '../config/toolConfig'
import { startGuidedTour } from '../tour'

function hasSeenTour(): boolean {
  try {
    return window.localStorage.getItem(tourConfig.storageKey) === 'true'
  } catch {
    return false
  }
}

function rememberTour(): void {
  try {
    window.localStorage.setItem(tourConfig.storageKey, 'true')
  } catch {
    /* storage can be blocked (private mode); the tour then simply shows again next time */
  }
}

/**
 * Guided tour for the tool view.
 * - Starts by itself when the tool loads (once per browser when `tourConfig.showOnce` is true).
 * - Always opens with a welcome step, then the steps passed in.
 * - Returns `startTour` for a button that lets users replay it.
 */
export function useGuidedTour(steps: DriveStep[]) {
  const { t } = useTranslation()

  const labels = useMemo(
    () => ({
      next: t('tour.next'),
      previous: t('tour.previous'),
      done: t('tour.done'),
      close: t('tour.close'),
      progress: t('tour.progress'),
    }),
    [t],
  )

  // The first step is always a centred welcome (no element), named after the tool (`brand`).
  const allSteps = useMemo<DriveStep[]>(
    () => [
      {
        popover: {
          title: t('tour.welcomeTitle'),
          description: t('tour.welcomeDescription'),
        },
      },
      ...steps,
    ],
    [steps, t],
  )

  const startTour = useCallback(() => startGuidedTour(allSteps, labels, rememberTour), [allSteps, labels])

  // The newest startTour, so the one-time auto start below never needs it as a dependency.
  const startTourRef = useRef(startTour)
  useEffect(() => {
    startTourRef.current = startTour
  })

  useEffect(() => {
    if (!features.tour || !tourConfig.autoStart || (tourConfig.showOnce && hasSeenTour())) return
    // Let the shell (banner, toolbar, Webtools) paint first so every step has its target.
    const timer = window.setTimeout(() => {
      rememberTour()
      startTourRef.current()
    }, tourConfig.startDelayMs)
    return () => window.clearTimeout(timer)
  }, [])

  return { startTour }
}
