import { site } from '../config/toolConfig'

const WEBTOOLS_LOADER_ID = 'european-commission-webtools-loader'
const UTILITY_CONFIG_PREFIX = 'european-commission-webtools-config'

let loaderPromise: Promise<void> | undefined

interface WebtoolsApi {
  render: (target: Element, config: object) => void
  globan?: { regenerate: (params?: { lang?: string }) => void }
}

const getWt = () => (window as unknown as { $wt?: WebtoolsApi }).$wt

function renderGloban() {
  const container = document.getElementById('euGlobanContainer')
  const wt = getWt()
  if (!container || !wt || container.childElementCount > 0) return

  wt.render(container, {
    service: 'globan',
    theme: 'dark',
    logo: true,
    link: true,
    lang: document.documentElement.lang || 'en',
    mode: false,
    zindex: 40,
  })
}

/** Re-render GloBan in a new language (documented SPA method). No-op until it has been rendered. */
function setLanguage(lang: string) {
  const wt = getWt()
  if (document.querySelector('#euGlobanContainer > *')) wt?.globan?.regenerate({ lang })
}

function getUtilityConfigurations(): Array<Record<string, string | number | boolean>> {
  const utilities: Array<Record<string, string | number | boolean>> = [
    {
      utility: 'cck',
      url: 'https://commission.europa.eu/cookies-policy_{lang}',
    },
  ]

  // Analytics belongs to this tool: its site ID and instance are fixed in `site.analytics` (as in the legacy html).
  utilities.push({
    utility: 'analytics',
    siteID: site.analytics.siteID,
    instance: site.analytics.instance,
    is404: import.meta.env.VITE_WEBTOOLS_IS_404 === 'true',
  })
  return utilities
}

function loadWebtools(): Promise<void> {
  if (loaderPromise) return loaderPromise

  loaderPromise = new Promise<void>((resolve, reject) => {
    // Render GloBan when the loader is ready; if it already is (loader tag present, e.g. after HMR), render now.
    window.addEventListener('wtReady', renderGloban, { once: true })
    if (document.getElementById(WEBTOOLS_LOADER_ID)) {
      renderGloban()
      resolve()
      return
    }

    getUtilityConfigurations().forEach((configuration) => {
      const configId = `${UTILITY_CONFIG_PREFIX}-${configuration.utility}`
      if (document.getElementById(configId)) return

      const configScript = document.createElement('script')
      configScript.id = configId
      configScript.type = 'application/json'
      configScript.textContent = JSON.stringify(configuration)
      document.body.append(configScript)
    })

    const loader = document.createElement('script')
    loader.id = WEBTOOLS_LOADER_ID
    loader.src = 'https://webtools.europa.eu/load.js?spa=1'
    loader.defer = true
    loader.onload = () => resolve()
    loader.onerror = () => {
      loader.remove()
      window.removeEventListener('wtReady', renderGloban)
      loaderPromise = undefined
      reject(new Error('The European Commission Webtools Smart Loader could not be loaded.'))
    }
    document.head.append(loader)
  })

  return loaderPromise
}

export const webtoolsService = {
  initialize: loadWebtools,
  setLanguage,
  getChartEmbedUrl(): string | undefined {
    return import.meta.env.VITE_WEBTOOLS_CHART_URL || undefined
  },
}

/* ------------------------------------------------------------------ */
/* CHARTS (Webtools charts service: a Highcharts configuration drawn by Webtools) */
/* ------------------------------------------------------------------ */

import type Highcharts from 'highcharts'

interface WebtoolsChartsRender {
  render(container: Element, params: Record<string, unknown>): void
}

const CHART_TIMEOUT_MS = 15_000

function webtoolsRenderer(signal: AbortSignal): Promise<WebtoolsChartsRender> {
  // The loader sets $wt once it is ready; poll for it, as the Webtools documentation does for the SPA mode.
  return new Promise((resolve, reject) => {
    const started = performance.now()
    let timer = 0
    signal.addEventListener('abort', () => {
      window.clearTimeout(timer)
      reject(signal.reason)
    })
    const check = () => {
      const wt = (window as unknown as { $wt?: WebtoolsChartsRender }).$wt
      if (wt?.render) return resolve(wt)
      if (performance.now() - started > CHART_TIMEOUT_MS) return reject(new Error('Webtools did not initialise in time.'))
      timer = window.setTimeout(check, 50)
    }
    void webtoolsService.initialize().catch(reject).then(check)
  })
}

/**
 * Removes the keys whose value is undefined, at every depth. Webtools reads the configuration as data: an undefined
 * key (for example a subtitle without text) makes it drop the series and the title, so the chart draws empty.
 */
export function pruneUndefined<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => pruneUndefined(item)) as unknown as T
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const result: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value)) {
      if (item !== undefined) result[key] = pruneUndefined(item)
    }
    return result as T
  }
  return value
}

/**
 * Draws a Highcharts configuration through the Webtools charts service. `ready` gets the live chart once Webtools
 * has drawn it. Webtools keeps using the chart right after `ready`, so destroy it with `destroyChart`, not directly.
 */
export async function renderWebtoolsChart(
  container: HTMLElement,
  options: Highcharts.Options,
  lang: string,
  ready: (chart: Highcharts.Chart) => void,
  signal: AbortSignal,
): Promise<void> {
  const wt = await webtoolsRenderer(signal)
  wt.render(container, {
    service: 'charts',
    version: '2.0',
    provider: 'highcharts',
    lang,
    menu: [],
    options: { logo: { visible: false } },
    data: pruneUndefined(options),
    ready,
  })
}

/** Destroys a chart after the current task: Webtools may still read its options right after `ready`. */
export function destroyWebtoolsChart(chart: Highcharts.Chart) {
  window.setTimeout(() => {
    try {
      if (chart.options) chart.destroy()
    } catch {
      // already destroyed
    }
  }, 0)
}
