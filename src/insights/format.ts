/** Numbers as the overview shows them: up to two decimals, in the page language. */
export function formatNumber(value: number | null | undefined, lang: string): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '-'
  return Number(value).toLocaleString(lang, { maximumFractionDigits: 2 })
}

/** A change with its sign, e.g. "+3,951.24 Thousand tonnes". */
export function formatSigned(value: number | null | undefined, lang: string, unit?: string): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '-'
  return `${value >= 0 ? '+' : ''}${formatNumber(value, lang)}${unit ? ` ${unit}` : ''}`
}
