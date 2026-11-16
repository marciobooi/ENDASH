/**
 * Tool configuration of the Energy dashboard: every lookup table lives here (charts, themes, countries, palette) and
 * the page identity, features and embedded views. Components import from this file and never hard-code codes.
 * Names are not here: they are translated in src/locales/<code>.json (`countries.<code>`, `labels.<code>`, ...).
 */

/* ------------------------------------------------------------------ */
/* PAGE IDENTITY                                                       */
/* ------------------------------------------------------------------ */

/**
 * Page identity of this tool: title, description, social preview, languages, contact e-mail and links.
 * A Vite plugin (plugins/siteMeta.ts) writes it into the static HTML at build time.
 */
export const site = {
  title: 'Energy dashboard - Eurostat',
  description:
    'By using the energy dashboard tool, created by Eurostat, you can easily visualise the evolution of the most important energy indicators (energy efficiency, share of renewables, import dependency, and many more) for your country and for the EU.',
  siteName: 'Eurostat Energy Dashboard',
  /** Absolute https address of the deployed page. */
  url: 'https://ec.europa.eu/eurostat/cache/visualisations/energy-dashboard/endash.html',
  image: {
    file: 'images/shareico.jpg',
    type: 'image/png',
    width: 506,
    height: 253,
    alt: 'Energy dashboard - Eurostat: the evolution of the most important energy indicators for countries and the EU.',
  },
  languages: [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
  ],
  defaultLanguage: 'en',
  /** Mailbox that receives the contact e-mail of the share menu (as in the old tool's feedback button). */
  contactEmail: 'ESTAT-ENERGY@ec.europa.eu',
  /** Webtools analytics of this tool (the same site ID as the legacy endash.html; it does not change). */
  analytics: { siteID: 'a441974e-4574-4f0a-9ed2-f90fb8547bb7', instance: 'ec.europa.eu' },
  links: {
    home: 'https://ec.europa.eu/eurostat/',
    footer: {
      privacy: 'https://ec.europa.eu/info/privacy-policy_{lang}',
      legal: 'https://ec.europa.eu/info/legal-notice_{lang}',
      cookies: 'https://ec.europa.eu/info/cookies_{lang}',
    },
  },
  locale: 'en_GB',
  localeAlternates: ['fr_FR', 'de_DE'],
  twitterCard: 'summary_large_image',
  themeColor: '#082b7a',
} as const

export type LanguageCode = (typeof site.languages)[number]['code']

/** A link address with `{lang}` replaced by the language code. */
export function localizedLink(template: string, language: string): string {
  return template.replace('{lang}', language)
}

/** Address of the preview image: the folder of `url` plus `image.file`. */
export function shareImageUrl(pageUrl: string = site.url): string {
  return pageUrl.slice(0, pageUrl.lastIndexOf('/') + 1) + site.image.file
}

/* ------------------------------------------------------------------ */
/* COLOURS                                                             */
/* ------------------------------------------------------------------ */

/** Series palette of the dashboard (old `colors`, codes.js). */
export const seriesColors = [
  "#06D7FF",
  "#19FF99",
  "#4C99FF",
  "#FFD900",
  "#C88000",
  "#33D129",
  "#FFB800",
  "#E67500",
  "#05A0FF",
  "#2CB523",
  "#8C4000",
  "#0033FF",
  "#00A68C",
  "#FF8C00",
  "#00D98C",
  "#2673FF",
  "#FFB300",
  "#FF8A00",
  "#B35900",
  "#26A31F",
  "#0573FF"
]

/** Neutral colour for everything not highlighted. */
export const backgroundColor = '#DCDCDC'

/** Named colours, also exposed as CSS variables. */
export const namedColors: Record<string, string> = {
  highlight: '#E67500',
  average: '#7F9BD9',
}

/** Publish the colours as CSS custom properties: `--color-<name>`. */
export function applyColorCssVariables(root: HTMLElement = document.documentElement): void {
  for (const [name, color] of Object.entries(namedColors)) {
    root.style.setProperty(`--color-${name.toLowerCase()}`, color)
  }
}

/* ------------------------------------------------------------------ */
/* COUNTRIES                                                           */
/* ------------------------------------------------------------------ */

export const allCountries: string[] = [
  "EU27_2020",
  "BE",
  "BG",
  "CZ",
  "DK",
  "DE",
  "EE",
  "IE",
  "EL",
  "ES",
  "FR",
  "HR",
  "IT",
  "CY",
  "LV",
  "LT",
  "LU",
  "HU",
  "MT",
  "NL",
  "AT",
  "PL",
  "PT",
  "RO",
  "SI",
  "SK",
  "FI",
  "SE",
  "IS",
  "LI",
  "NO",
  "ME",
  "MK",
  "AL",
  "RS",
  "TR",
  "BA",
  "XK",
  "MD",
  "UA",
  "GE"
]
export const AGGREGATES_COUNTRY_CODES: string[] = [
  "EU27_2020"
]
export const EU_COUNTRY_CODES: string[] = [
  "BE",
  "BG",
  "CZ",
  "DK",
  "DE",
  "EE",
  "IE",
  "EL",
  "ES",
  "FR",
  "HR",
  "IT",
  "CY",
  "LV",
  "LT",
  "LU",
  "HU",
  "MT",
  "NL",
  "AT",
  "PL",
  "PT",
  "RO",
  "SI",
  "SK",
  "FI",
  "SE"
]
export const EFTA_COUNTRY_CODES: string[] = [
  "IS",
  "LI",
  "NO"
]
export const ENLARGEMENT_COUNTRY_CODES: string[] = [
  "BA",
  "ME",
  "MD",
  "MK",
  "GE",
  "AL",
  "RS",
  "TR",
  "UA",
  "XK"
]

/** Groups of the country selector, in display order. `id` is the key under `countryGroups` in the locale files. */
export const countryGroups = [
  { id: 'aggregates', codes: AGGREGATES_COUNTRY_CODES },
  { id: 'eu', codes: EU_COUNTRY_CODES },
  { id: 'efta', codes: EFTA_COUNTRY_CODES },
  { id: 'enlargement', codes: ENLARGEMENT_COUNTRY_CODES },
] as const

/** Real countries of the dashboard (no aggregates): the rankings and medians count only these. */
/** Countries compared in the bar view (old defaultGeos: the aggregate plus every country of the dashboard). */
export const defaultQueryGeos: string[] = [...allCountries]

export const realCountryCodes: string[] = [...EU_COUNTRY_CODES, ...EFTA_COUNTRY_CODES, ...ENLARGEMENT_COUNTRY_CODES]

/* ------------------------------------------------------------------ */
/* CHARTS (the 26 charts of the dashboard)                             */
/* ------------------------------------------------------------------ */

/** One Eurostat table and the query it is read with. */
export interface DataSource {
  dataset: string
  unit: string
  /** Codes of the indicator dimension (`indicatorType`). */
  indicator: string[]
  indicatorType: string
  /** Codes of the second dimension (`indicator2Type`), fixed to one value. */
  indicator2: string[]
  indicator2Type: string
}

export type ChartView = 'bar' | 'pie' | 'timeline' | 'table' | 'insights'

export interface ChartDefinition extends DataSource {
  id: string
  /** Eurostat metadata page of the dataset (`NONE` when there is none). */
  meta: string
  /** Expanded views this chart offers besides the line chart (old `optionCharts`). */
  views: ChartView[]
  /** Show a "Total" row in the tooltip: only when the series are parts of one whole. */
  tooltipTotal: boolean
  /** Monthly dataset: bar and pie show a month (REF.month) instead of a year. */
  monthly: boolean
  /** Length of the monthly window in months. */
  months?: number
  /** Key of the title of the bar and pie views (monthly charts). */
  titleAux?: string
  /** Second table merged into the same chart (oil stocks and deliveries). */
  combine?: DataSource
  /** Shows every country at once, split at the average (oil stocks by country). */
  medianSplit: boolean
  /** chart_8: kilograms of oil equivalent per inhabitant, from two tables. */
  special?: 'perCapita'
  /** Extra query parameters of the request. */
  extraParams?: Record<string, string>
}

export const charts: ChartDefinition[] = [
  {
    "dataset": "nrg_ind_eff",
    "unit": "MTOE",
    "indicator": [
      "FEC_EED",
      "PEC_EED"
    ],
    "indicatorType": "nrg_bal",
    "indicator2": [],
    "indicator2Type": "",
    "id": "chart_1",
    "meta": "nrg_ind_eff",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_ind_ren",
    "unit": "PC",
    "indicator": [
      "REN",
      "REN_TRA",
      "REN_ELC",
      "REN_HEAT_CL"
    ],
    "indicatorType": "nrg_bal",
    "indicator2": [],
    "indicator2Type": "",
    "id": "chart_2",
    "meta": "nrg_ind_share",
    "views": [
      "table",
      "insights"
    ],
    "tooltipTotal": false,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "env_air_gge",
    "unit": "THS_T",
    "indicator": [
      "CRF1A1",
      "CRF1A2",
      "CRF1A3",
      "CRF1A4A",
      "CRF1A4B",
      "CRF1A4C",
      "CRF1A5"
    ],
    "indicatorType": "src_crf",
    "indicator2": [
      "GHG"
    ],
    "indicator2Type": "AIRPOL",
    "id": "chart_3",
    "meta": "env_air_gge",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_ind_ei",
    "unit": "KGOE_TEUR",
    "indicator": [
      "EI_GDP_CLV05"
    ],
    "indicatorType": "nrg_bal",
    "indicator2": [],
    "indicator2Type": "",
    "id": "chart_4",
    "meta": "nrg_ind_ei",
    "views": [
      "bar",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": false,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_ind_ep",
    "unit": "EUR_KGOE",
    "indicator": [],
    "indicatorType": "nrg_bal",
    "indicator2": [],
    "indicator2Type": "",
    "id": "chart_5",
    "meta": "nrg_ind_ep",
    "views": [
      "bar",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": false,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_ind_id",
    "unit": "PC",
    "indicator": [
      "G3000",
      "O4000XBIO",
      "O4100_TOT",
      "O4200"
    ],
    "indicatorType": "siec",
    "indicator2": [],
    "indicator2Type": "",
    "id": "chart_6",
    "meta": "nrg_ind_id",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": false,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_ind_ffgae",
    "unit": "PC",
    "indicator": [],
    "indicatorType": "PC",
    "indicator2": [],
    "indicator2Type": "",
    "id": "chart_7",
    "meta": "nrg_ind_ffgae",
    "views": [
      "bar",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": false,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "demo_pjan",
    "unit": "KGOE",
    "indicator": [],
    "indicatorType": "",
    "indicator2": [],
    "indicator2Type": "",
    "id": "chart_8",
    "meta": "demo_pop",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": false,
    "monthly": false,
    "medianSplit": false,
    "special": "perCapita"
  },
  {
    "dataset": "nrg_bal_s",
    "unit": "KTOE",
    "indicator": [
      "C0000X0350-0370",
      "C0350-0370",
      "P1000",
      "S2000",
      "G3000",
      "O4000XBIO",
      "RA000",
      "W6100_6220",
      "N900H",
      "E7000",
      "H8000"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "FC_E"
    ],
    "indicator2Type": "nrg_bal",
    "id": "chart_9",
    "meta": "nrg_bal",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_bal_s",
    "unit": "KTOE",
    "indicator": [
      "FC_IND_E",
      "FC_OTH_AF_E",
      "FC_OTH_CP_E",
      "FC_OTH_FISH_E",
      "FC_OTH_HH_E",
      "FC_OTH_NSP_E",
      "FC_TRA_E"
    ],
    "indicatorType": "nrg_bal",
    "indicator2": [
      "TOTAL"
    ],
    "indicator2Type": "siec",
    "id": "chart_10",
    "meta": "nrg_bal",
    "views": [
      "bar",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_d_hhq",
    "unit": "TJ",
    "indicator": [
      "FC_OTH_HH_E_SH",
      "FC_OTH_HH_E_SC",
      "FC_OTH_HH_E_WH",
      "FC_OTH_HH_E_CK",
      "FC_OTH_HH_E_LE",
      "FC_OTH_HH_E_OE"
    ],
    "indicatorType": "nrg_bal",
    "indicator2": [
      "TOTAL"
    ],
    "indicator2Type": "siec",
    "id": "chart_11",
    "meta": "nrg_quant",
    "views": [
      "bar",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_bal_c",
    "unit": "KTOE",
    "indicator": [
      "E7000",
      "G3000",
      "O4630",
      "O4652XR5210B",
      "O4661XR5230B",
      "O4671XR5220B",
      "O4680",
      "R5210B",
      "R5210P",
      "R5220B",
      "R5220P",
      "R5290",
      "R5300"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "FC_TRA_E"
    ],
    "indicator2Type": "nrg_bal",
    "id": "chart_12",
    "meta": "nrg_bal",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_bal_c",
    "unit": "KTOE",
    "indicator": [
      "G3000",
      "O4630",
      "O4652XR5210B",
      "O4671XR5220B",
      "R5210P",
      "R5210B",
      "R5220P",
      "R5220B",
      "R5290",
      "R5300",
      "E7000"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "FC_TRA_ROAD_E"
    ],
    "indicator2Type": "nrg_bal",
    "id": "chart_13",
    "meta": "nrg_bal",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_bal_s",
    "unit": "KTOE",
    "indicator": [
      "C0000X0350-0370",
      "E7000",
      "G3000",
      "H8000",
      "O4000XBIO",
      "RA000",
      "W6100_6220"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "FC_OTH_CP_E"
    ],
    "indicator2Type": "nrg_bal",
    "id": "chart_14",
    "meta": "nrg_bal",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_bal_s",
    "unit": "KTOE",
    "indicator": [
      "C0000X0350-0370",
      "C0350-0370",
      "E7000",
      "G3000",
      "H8000",
      "N900H",
      "O4000XBIO",
      "P1000",
      "RA000",
      "S2000",
      "W6100_6220"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "FC_IND_E"
    ],
    "indicator2Type": "nrg_bal",
    "id": "chart_15",
    "meta": "nrg_bal",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_bal_s",
    "unit": "KTOE",
    "indicator": [
      "C0000X0350-0370",
      "C0350-0370",
      "G3000",
      "O4000XBIO",
      "P1000",
      "RA000",
      "S2000"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "FC_NE"
    ],
    "indicator2Type": "nrg_bal",
    "id": "chart_16",
    "meta": "nrg_bal",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_ind_peh",
    "unit": "GWH",
    "indicator": [
      "CF",
      "RA100",
      "RA130",
      "RA200",
      "RA300",
      "RA400",
      "RA500",
      "N9000",
      "X9900",
      "X9900H"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "GEP"
    ],
    "indicator2Type": "nrg_bal",
    "id": "chart_17",
    "meta": "nrg_quant",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "medianSplit": false,
    "extraParams": {
      "operator": "PRR_AUTO",
      "plants": "ELC"
    }
  },
  {
    "dataset": "nrg_ind_pehcf",
    "unit": "GWH",
    "indicator": [
      "C0110",
      "C0121",
      "C0129",
      "C0210",
      "C0220",
      "C0311",
      "C0312",
      "C0320",
      "C0330",
      "C0340",
      "C0350",
      "C0360",
      "C0371",
      "C0379"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "GEP"
    ],
    "indicator2Type": "nrg_bal",
    "id": "chart_18",
    "meta": "nrg_quant",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "extraParams": {
      "operator": "PRR_MAIN",
      "plants": "ELC"
    },
    "medianSplit": false
  },
  {
    "dataset": "ilc_mdes01",
    "unit": "PC",
    "indicator": [
      "TOTAL"
    ],
    "indicatorType": "hhcomp",
    "indicator2": [
      "TOTAL"
    ],
    "indicator2Type": "rskpovth",
    "id": "chart_19",
    "meta": "ilc_sieusilc",
    "views": [
      "bar",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": false,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_ind_re",
    "unit": "PC",
    "indicator": [
      "FC_E",
      "FC_IND_E",
      "FC_TRA_E",
      "FC_OTH_HH_CP_E"
    ],
    "indicatorType": "nrg_bal",
    "indicator2": [],
    "indicator2Type": "",
    "id": "chart_20",
    "meta": "nrg_ind_re",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": false,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_bal_s",
    "unit": "KTOE",
    "indicator": [
      "C0000X0350-0370",
      "C0350-0370",
      "P1000",
      "S2000",
      "G3000",
      "O4000XBIO",
      "RA000",
      "W6100_6220",
      "E7000",
      "H8000",
      "N900H"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "GAE"
    ],
    "indicator2Type": "nrg_bal",
    "id": "chart_21",
    "meta": "nrg_bal",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_bal_s",
    "unit": "KTOE",
    "indicator": [
      "C0000X0350-0370",
      "C0350-0370",
      "P1000",
      "S2000",
      "G3000",
      "O4000XBIO",
      "RA000",
      "W6100_6220",
      "E7000",
      "H8000",
      "N900H"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "NRGSUP"
    ],
    "indicator2Type": "nrg_bal",
    "id": "chart_22",
    "meta": "nrg_bal",
    "views": [
      "bar",
      "pie",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": true,
    "monthly": false,
    "medianSplit": false
  },
  {
    "dataset": "nrg_stk_oilm",
    "unit": "THS_T",
    "indicator": [
      "O46711"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "STK_CL"
    ],
    "indicator2Type": "stk_flow",
    "id": "chart_23",
    "meta": "NONE",
    "views": [
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": false,
    "monthly": true,
    "months": 12,
    "titleAux": "chart_23_aux",
    "medianSplit": false,
    "combine": {
      "dataset": "nrg_cb_oilm",
      "unit": "THS_T",
      "indicator": [
        "O46711"
      ],
      "indicatorType": "siec",
      "indicator2": [
        "GID_OBS"
      ],
      "indicator2Type": "nrg_bal"
    }
  },
  {
    "dataset": "nrg_stk_oilm",
    "unit": "THS_T",
    "indicator": [
      "O46711"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "STK_CL"
    ],
    "indicator2Type": "stk_flow",
    "id": "chart_24",
    "meta": "NONE",
    "views": [
      "bar",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": false,
    "monthly": true,
    "months": 12,
    "titleAux": "chart_24_aux",
    "medianSplit": true
  },
  {
    "dataset": "nrg_stk_oilm",
    "unit": "THS_T",
    "indicator": [
      "O4661"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "STK_CL"
    ],
    "indicator2Type": "stk_flow",
    "id": "chart_25",
    "meta": "NONE",
    "views": [
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": false,
    "monthly": true,
    "months": 12,
    "titleAux": "chart_25_aux",
    "medianSplit": false,
    "combine": {
      "dataset": "nrg_cb_oilm",
      "unit": "THS_T",
      "indicator": [
        "O4661"
      ],
      "indicatorType": "siec",
      "indicator2": [
        "GID_OBS"
      ],
      "indicator2Type": "nrg_bal"
    }
  },
  {
    "dataset": "nrg_stk_oilm",
    "unit": "THS_T",
    "indicator": [
      "O4661"
    ],
    "indicatorType": "siec",
    "indicator2": [
      "STK_CL"
    ],
    "indicator2Type": "stk_flow",
    "id": "chart_26",
    "meta": "NONE",
    "views": [
      "bar",
      "timeline",
      "table",
      "insights"
    ],
    "tooltipTotal": false,
    "monthly": true,
    "months": 12,
    "titleAux": "chart_26_aux",
    "medianSplit": true
  }
]

export const chartById: Record<string, ChartDefinition> = Object.fromEntries(charts.map((chart) => [chart.id, chart]))

/** Themes of the gallery: the jump-nav sections and the charts of each one, in display order. */
export const themes: Array<{ id: string; labelKey: string; charts: string[] }> = [
  {
    "id": "theme-sustainability",
    "labelKey": "THEME_SUSTAINABILITY",
    "charts": [
      "chart_2",
      "chart_3",
      "chart_19"
    ]
  },
  {
    "id": "theme-diversification",
    "labelKey": "THEME_DIVERSIFICATION",
    "charts": [
      "chart_21",
      "chart_22",
      "chart_7",
      "chart_6"
    ]
  },
  {
    "id": "theme-efficiency",
    "labelKey": "THEME_EFFICIENCY",
    "charts": [
      "chart_1",
      "chart_4",
      "chart_5"
    ]
  },
  {
    "id": "theme-electrification",
    "labelKey": "THEME_ELECTRIFICATION",
    "charts": [
      "chart_20",
      "chart_17",
      "chart_18"
    ]
  },
  {
    "id": "theme-consumption",
    "labelKey": "THEME_CONSUMPTION",
    "charts": [
      "chart_8",
      "chart_9",
      "chart_10",
      "chart_11",
      "chart_12",
      "chart_13",
      "chart_14",
      "chart_15",
      "chart_16"
    ]
  },
  {
    "id": "theme-oilstocks",
    "labelKey": "THEME_OILSTOCKS",
    "charts": [
      "chart_23",
      "chart_25",
      "chart_24",
      "chart_26"
    ]
  }
]

/* ------------------------------------------------------------------ */
/* IMAGES                                                              */
/* ------------------------------------------------------------------ */

export const images = {
  eurostatLogo: { src: `${import.meta.env?.BASE_URL ?? './'}images/eurostat-logo-horizontal.svg` },
  headerRibbon: { src: `${import.meta.env?.BASE_URL ?? './'}images/eurostat-banner-ribbon.svg` },
} as const

/* ------------------------------------------------------------------ */
/* FILTERS (controls of the menu and state kept in the address)       */
/* ------------------------------------------------------------------ */

export interface FilterGroup {
  id: string
  codes: readonly string[]
}

interface FilterBase {
  id: string
  nameKey: string
}

export type FilterDefinition =
  | (FilterBase & { type: 'select'; options: readonly string[]; default: string })
  | (FilterBase & {
      type: 'multiselect'
      options: readonly string[] | readonly FilterGroup[]
      groupKey?: string
      default: readonly string[]
    })

/** The country of the dashboard (old `REF.geos`): every chart of the gallery shows it. */
export const filters: readonly FilterDefinition[] = [
  { id: 'geo', type: 'select', nameKey: 'countries', options: allCountries, default: 'BE' },
]

/* ------------------------------------------------------------------ */
/* MENU (the energy topics jump-nav)                                   */
/* ------------------------------------------------------------------ */

export const menuItems = themes.map((theme) => ({ labelKey: theme.labelKey, href: `#${theme.id}` }))

/* ------------------------------------------------------------------ */
/* FEATURES                                                            */
/* ------------------------------------------------------------------ */

export const features = {
  insights: true,
  download: true,
  share: true,
  embed: true,
  tour: true,
}

/* ------------------------------------------------------------------ */
/* DOWNLOAD                                                            */
/* ------------------------------------------------------------------ */

export const downloadConfig = {
  formats: ['png', 'jpeg', 'excel'] as const,
  imageTarget: '.tool-content',
  fileName: 'energy-dashboard',
}

/* ------------------------------------------------------------------ */
/* EMBEDDED VIEW                                                       */
/* ------------------------------------------------------------------ */

export const embedConfig = {
  height: 600,
  defaultChart: 'chart_1',
  /** Every chart can be embedded on its own (`?embed=chart_N`). */
  charts: charts.map((chart) => chart.id),
}

/* ------------------------------------------------------------------ */
/* GUIDED TOUR                                                         */
/* ------------------------------------------------------------------ */

export const tourConfig = {
  autoStart: true,
  showOnce: true,
  storageKey: 'energy-dashboard-tour-seen-v1',
  startDelayMs: 800,
  steps: [
    { id: 'gallery', element: '#main-content' },
    { id: 'expand', element: '#chart_1' },
    { id: 'country', element: '#geo-select' },
    { id: 'language', element: '#toggleLanguageBtn' },
    { id: 'share', element: '#share-button' },
  ],
}
