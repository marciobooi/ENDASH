/** The insights are the same page shell with `?insights` in the URL (no second HTML file), like the accessibility statement. */
export const INSIGHTS_PARAM = 'insights'

export function isInsightsMode(): boolean {
  return new URLSearchParams(window.location.search).has(INSIGHTS_PARAM)
}

/** What the insights page and the way back to the tool keep of the address: the language and the country (the filters). */
const KEPT_PARAMS = ['language', 'geo']

function addressWith(extra: boolean): string {
  const current = new URL(window.location.href)
  const query = new URLSearchParams()
  for (const key of KEPT_PARAMS) {
    const value = current.searchParams.get(key)
    if (value) query.set(key, value)
  }
  const text = query.toString()
  return `${current.pathname}${text || extra ? '?' : ''}${text}${extra ? `${text ? '&' : ''}${INSIGHTS_PARAM}` : ''}`
}

/** The address of the insights page: the language and country of the tool (the open chart and its view do not belong to it). */
export function insightsHref(): string {
  return addressWith(true)
}

/** The address of the tool's main view (the gallery) with the same language and country. */
export function toolHrefFromInsights(): string {
  return addressWith(false)
}
