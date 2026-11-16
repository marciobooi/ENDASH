import type { ChartSeries } from '../data/series'

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
  return (
    <div className="series-table" tabIndex={0} role="region" aria-label={caption}>
      <table className="ecl-table ecl-table--zebra">
        <caption className="ecl-table__caption ecl-u-sr-only">{caption}</caption>
        <thead className="ecl-table__head">
          <tr>
            <th scope="col" className="ecl-table__header">{firstHeader}</th>
            {series.map((entry) => (
              <th scope="col" key={entry.name} className="ecl-table__header">
                {entry.name}
                {unitLabel ? ` (${unitLabel})` : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="ecl-table__body">
          {categories.map((category, row) => (
            <tr key={category} className="ecl-table__row">
              <th scope="row" className="ecl-table__cell">{category}</th>
              {series.map((entry) => (
                <td key={entry.name} className="ecl-table__cell">{entry.data[row] === null || entry.data[row] === undefined ? '–' : Number(entry.data[row]).toLocaleString()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
