import { cell, type Dataset } from './eurostatData'

/* Chart_8 (old chartEightCalculation): household energy per inhabitant. Energy comes from one table and population
 * from another; the value is energy / population for each year, truncated as the old tool did. */

export const ENERGY_DATASET = 'nrg_bal_c'
export const POPULATION_DATASET = 'demo_pjan'

/** Filters of the energy table: total products, unit of the figures, household final consumption. */
export const ENERGY_FILTERS: Array<[string, string]> = [
  ['siec', 'TOTAL'],
  ['unit', 'KTOE'],
  ['nrg_bal', 'FC_OTH_HH_E'],
]

/** Filters of the population table: total age, both sexes. */
export const POPULATION_FILTERS: Array<[string, string]> = [
  ['age', 'TOTAL'],
  ['sex', 'T'],
]

/** Energy per inhabitant of one country and year, or null when either figure is missing. */
export function perCapitaValue(energy: Dataset, population: Dataset, geo: string, time: string): number | null {
  const used = cell(energy, { geo, time })
  const inhabitants = cell(population, { geo, time })
  if (used === null || inhabitants === null || inhabitants === 0) return null
  return Math.trunc(Math.floor((used / inhabitants) * 1_000_000))
}

/** The years of a country, from the energy table (the population table has the same years). */
export function perCapitaSeries(energy: Dataset, population: Dataset, geo: string): { categories: string[]; values: Array<number | null> } {
  const categories = energy.Dimension('time')?.id ?? []
  return { categories, values: categories.map((time) => perCapitaValue(energy, population, geo, time)) }
}

/** Every country for one year (the bar view), in the order of the energy table. */
export function perCapitaBars(energy: Dataset, population: Dataset, time: string): { categories: string[]; values: Array<number | null> } {
  const categories = energy.Dimension('geo')?.id ?? []
  return { categories, values: categories.map((geo) => perCapitaValue(energy, population, geo, time)) }
}
