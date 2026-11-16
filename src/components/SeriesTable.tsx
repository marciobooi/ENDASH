import type { ChartSeries } from '../services/series'
import { EclNumber, EclRow, EclRowHeader, EclTable } from './EclTable'

interface SeriesTableProps {
  /** Caption of the table (the chart title). */
  caption: string
  /** Header of the first column (e.g. "Year" or "Country"). */
  firstHeader: string
  /** Rows: the categories, one per row. */
  categories: string[]
  series: ChartSeries[]
  /** Unit of the values, shown after the series names. */
  unitLabel: string
}

/** The data of a chart as a table (old "table" view: the chart's own data, for keyboard and screen reader users). */
export function SeriesTable({ caption, firstHeader, categories, series, unitLabel }: SeriesTableProps) {
  const headers = series.map((entry) => `${entry.name}${unitLabel ? ` (${unitLabel})` : ''}`)
  return (
    <div className="series-table" tabIndex={0} role="region" aria-label={caption}>
      <EclTable caption={caption} captionHidden zebra headers={[firstHeader, ...headers]}>
        {categories.map((category, row) => (
          <EclRow key={category}>
            <EclRowHeader label={firstHeader}>{category}</EclRowHeader>
            {series.map((entry, column) => {
              const value = entry.data[row]
              return (
                <EclNumber key={entry.name} label={headers[column]}>
                  {value === null || value === undefined ? '–' : Number(value).toLocaleString()}
                </EclNumber>
              )
            })}
          </EclRow>
        ))}
      </EclTable>
    </div>
  )
}
