import { useCallback } from 'react'
import { charts } from '../config/toolConfig'
import { listParam, stringParam, useUrlState, type ParamSet } from './urlState'

/** The views of an expanded chart (old REF.chartType and the view buttons). */
export const VIEWS = ['line', 'bar', 'pie', 'table', 'insights'] as const
export type View = (typeof VIEWS)[number]

/** The views of one country (line, pie, table). The bar view compares all countries and the insights cover them all, so a
 * title there must not name the selected country. */
export const viewShowsOneCountry = (view: View): boolean => view === 'line' || view === 'pie' || view === 'table'

export interface DashboardState {
  /** The expanded chart, '' for the gallery (old REF.chartId with REF.chartExpanded). */
  chart: string
  /** The view of the expanded chart. */
  view: View
  /** The year of the bar and pie views (old REF.year). */
  year: string
  /** The month of the monthly charts' bar and pie views (old REF.month, "YYYY-MM"). */
  month: string
  /** Median-split charts flipped to the countries below the average (old REF.medianGroup). */
  below: string[]
  /** Bar view: show shares of each stack (old REF.percentage). */
  percentage: '0' | '1'
  /** Bar view: include the EU aggregate in the comparison (old toggleAgregates; included at start, as before). */
  aggregates: '0' | '1'
}

const chartIds = charts.map((chart) => chart.id)

/** The address parameters of the dashboard views. */
export const dashboardParams: ParamSet<DashboardState> = {
  chart: stringParam('chart', '', chartIds),
  view: stringParam('view', 'line', [...VIEWS]) as unknown as ParamSet<DashboardState>['view'],
  year: stringParam('year', ''),
  month: stringParam('month', ''),
  below: listParam('below', [], chartIds),
  percentage: stringParam('percentage', '0', ['0', '1']) as unknown as ParamSet<DashboardState>['percentage'],
  aggregates: stringParam('aggregates', '1', ['0', '1']) as unknown as ParamSet<DashboardState>['aggregates'],
}

/** The dashboard state, kept in the address. */
export function useDashboardState() {
  const [state, update] = useUrlState(dashboardParams)
  const patch = useCallback((changes: Partial<DashboardState>) => update(changes), [update])
  return [state, patch] as const
}
