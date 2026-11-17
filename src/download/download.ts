import { downloadConfig, images } from '../config/toolConfig'
import { captureElement, downloadImage, type ImageFrame } from '../share/screenshot'

export type DownloadFormat = (typeof downloadConfig.formats)[number]

/** The data of the chart as a table: what the Excel file contains. */
export interface DownloadTable {
  /** Name of the worksheet. */
  sheet: string
  /** Bold first line of the sheet: the name of the chart. */
  title: string
  /** Lines under the title (country, unit, source, link, date), one per row, before the table. */
  info: string[]
  headers: string[]
  rows: (string | number)[][]
}

const today = () => new Date().toISOString().slice(0, 10)

/** `eurostat-tool-2026-11-05.png` */
function fileName(extension: string): string {
  return `${downloadConfig.fileName}-${today()}.${extension}`
}

/** Text of the frame around the saved image: the title above it and the source below it (the logo is the tool's own). */
export type ImageCaption = Pick<ImageFrame, 'title' | 'source'>

/**
 * Save the chart (the element of `downloadConfig.imageTarget`) as PNG or JPEG, with the title on top and the source
 * and the Eurostat logo (bottom right) below. Returns false when it fails.
 */
export async function downloadChartImage(type: 'png' | 'jpeg', caption: ImageCaption): Promise<boolean> {
  const target = document.querySelector<HTMLElement>(downloadConfig.imageTarget)
  if (!target) return false
  // The timeline of a bar or pie is left out of the picture, so the title names the period it shows.
  const period = target.querySelector('.period-timeline__bubble')?.textContent?.trim()
  const title = period ? `${caption.title} – ${period}` : caption.title
  const image = await captureElement(target, type === 'png' ? 'image/png' : 'image/jpeg', { ...caption, title, logoSrc: images.eurostatLogo.src })
  if (!image) return false
  downloadImage(image, fileName(type === 'png' ? 'png' : 'jpg'))
  return true
}

/** Excel allows at most 31 characters in a sheet name and none of `: \\ / ? * [ ]`. */
const sheetName = (name: string) => name.replace(/[:\\/?*[\]]/g, ' ').trim().slice(0, 31)

/**
 * Save the data of the chart as an .xlsx file: the title, the lines that say what the data is (country, unit, source,
 * link, date), an empty row, then the table. The library is loaded on demand. Returns false when it fails.
 */
export async function downloadExcel(table: DownloadTable): Promise<boolean> {
  try {
    const { default: writeXlsxFile } = await import('write-excel-file/universal')
    const header = table.headers.map((value) => ({ value, fontWeight: 'bold' as const }))
    const rows = table.rows.map((row) => row.map((value) => ({ value })))
    const data = [[{ value: table.title, fontWeight: 'bold' as const }], ...table.info.map((line) => [{ value: line }]), [], header, ...rows]
    const blob = await writeXlsxFile([{ data, sheet: sheetName(table.sheet), columns: [{ width: 24 }, ...table.headers.slice(1).map(() => ({ width: 22 }))] }]).toBlob()
    downloadImage(blob, fileName('xlsx'))
    return true
  } catch {
    return false
  }
}
