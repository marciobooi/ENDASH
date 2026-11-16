import type { ReactNode } from 'react'

interface EclTableProps {
  caption: string
  /** The column headers. */
  headers: string[]
  /** Keep the caption for screen readers only (the page already shows the title above the table). */
  captionHidden?: boolean
  /** Alternate row shading: the look of the legacy tables. */
  zebra?: boolean
  children: ReactNode
}

/**
 * A data table in the markup of the Europa Component Library: a responsive wrapper, the `ecl-table` classes on the
 * table, its caption, header, rows and cells. Every cell carries the name of its column (`label`), which ECL's
 * stylesheet shows beside the value when the screen is narrow and the header row is hidden. Sorting and filters are
 * ECL options that are off by default and are not used here.
 */
export function EclTable({ caption, headers, captionHidden = false, zebra = false, children }: EclTableProps) {
  return (
    <div className="ecl-table-responsive">
      <table className={`ecl-table${zebra ? ' ecl-table--zebra' : ''}`}>
        <caption className={`ecl-table__caption${captionHidden ? ' ecl-u-sr-only' : ''}`}>{caption}</caption>
        <thead className="ecl-table__head">
          <tr className="ecl-table__row">
            {headers.map((header) => (
              <th key={header} className="ecl-table__header" scope="col">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="ecl-table__body">{children}</tbody>
      </table>
    </div>
  )
}

export function EclRow({ current, children }: { current?: boolean; children: ReactNode }) {
  return <tr className="ecl-table__row" aria-current={current ? 'true' : undefined}>{children}</tr>
}

/** The first cell of a row. It is a header cell (`scope="row"`) so screen readers name the row with it. */
export function EclRowHeader({ label, children }: { label: string; children: ReactNode }) {
  return <th className="ecl-table__cell" scope="row" data-ecl-table-header={label}>{children}</th>
}

/** A text cell. */
export function EclCell({ label, children }: { label: string; children: ReactNode }) {
  return <td className="ecl-table__cell" data-ecl-table-header={label}>{children}</td>
}

/** A number cell: right-aligned, with figures of equal width so the columns line up. */
export function EclNumber({ label, children }: { label: string; children: ReactNode }) {
  return <td className="ecl-table__cell data-table__number" data-ecl-table-header={label}>{children}</td>
}
