interface EclWidget {
  autoInit(element: Element): unknown
}

/**
 * Starts ECL's tooltip widget once for the whole page. It listens on the document, so tooltips of elements that React
 * adds later (or that other libraries build, like the tour) work with no further code: they only need the
 * `data-ecl-tooltip` attribute.
 */
export function initEclTooltips(): void {
  const ecl = (window as unknown as { ECL?: { Tooltip?: EclWidget } }).ECL
  ecl?.Tooltip?.autoInit(document.body)
}

/** The one widget of ECL's multiple select that React components start themselves (see MultiSelect). */
export interface EclSelect {
  init(): void
  destroy(): void
}

interface EclGlobal {
  Tooltip: EclWidget
  Select: new (element: Element) => EclSelect
  InpageNavigation: new (element: Element, options?: { spyOffset?: number }) => EclSelect
}

/** ECL's script is loaded by the page (index.html); this is its typed global. */
export const eclGlobal = (): EclGlobal => (window as unknown as { ECL: EclGlobal }).ECL
