/*
Definition, mapping and handling of Eurobase codes
*/


/*
ALL ABOUT COUNTRY CODES
*/
// List of all countries found in the energy prices dataset !!! LOOKUP TABLE !!!
// Labels are set in the language JSON files in the data folder 
energyCountries = {
	"EU27_2020": "",
	// "EU28": "",
	"EA": "",
	"BE": "",
	"BG": "",
	"CZ": "",
	"DK": "",
	"DE": "",
	"EE": "",
	"IE": "",
	"EL": "",
	"ES": "",
	"FR": "",
	"HR": "",
	"IT": "",
	"CY": "",
	"LV": "",
	"LT": "",
	"LU": "",
	"HU": "",
	"MT": "",
	"NL": "",
	"AT": "",
	"PL": "",
	"PT": "",
	"RO": "",
	"SI": "",
	"SK": "",
	"FI": "",
	"SE": "",
	// "UK": "",
	"IS": "",
	"NO": "",
	"LI": "",
	"ME": "",
	"MK": "",
	"AL": "",
	"RS": "",
	"TR": "",
	"XK": "",
	"UA": "",
	"MD": "",
	"BA": "",
	"GE": "",


};

geocodes = {
	"European Union (27 countries)": "EU27_2020",
	"Austria": "AT",
	"Belgium": "BE",
	"Spain": "ES",
	"France": "FR",
	// "European Union (28 countries)": "EU28",
	"Euro area (19 countries)": "EA",
	"Belgium": "BE",
	"Bulgaria": "BG",
	"Czechia": "CZ",
	"Denmark": "DK",
	"Germany": "DE",
	"Estonia": "EE",
	"Ireland": "IE",
	"Greece": "EL",
	"Spain": "ES",
	"France": "FR",
	"Croatia": "HR",
	"Italy": "IT",
	"Cyprus": "CY",
	"Latvia": "LV",
	"Lithuania": "LT",
	"Luxembourg": "LU",
	"Hungary": "HU",
	"Malta": "MT",
	"Netherlands": "NL",
	"Austria": "AT",
	"Poland": "PL",
	"Portugal": "PT",
	"Romania": "RO",
	"Slovenia": "SI",
	"Slovakia": "SK",
	"Finland": "FI",
	"Sweden": "SE",
	// "United Kingdom": "UK",
	"Iceland": "IS",
	"Liechtenstein": "LI",
	"Norway": "NO",
	"Montenegro": "ME",
	"North Macedonia": "MK",
	"Serbia": "RS",
	"Türkiye": "TR",
	"Bosnia and Herzegovina": "BA",
	"Kosovo (UN SCR 1244/99)": "XK",
	"Moldova": "MD",
	"Ukraine": "UA",
	"Georgia": "GE",
	"Albania": "AL",

}


/*
ALL ABOUT BAND CODES
*/
//define a generic list of 14 band colors to be used for the pie charts and time graphs
colors = [
'#06D7FF', '#19FF99', '#4C99FF', '#FFD900', '#C88000', '#33D129', '#FFB800', '#E67500', '#05A0FF', '#2CB523', '#8C4000', '#0033FF', '#00A68C', '#FF8C00', '#00D98C', '#2673FF', '#FFB300', '#FF8A00', '#B35900', '#26A31F', '#0573FF'
];


codesEnprices = {
	"geo": Object.keys(energyCountries),
	"year": [] // to be queried from Eurobase directly
};

// Every entry lists the expanded-view views it supports in "optionCharts":
//   "bar" | "pie" | "timeline" (year/month slider for bar+pie) | "table" |
//   "insights". A view that isn't listed has its button disabled, so adding or
//   removing a view for a chart is a one-word edit here. The line chart is the
//   default view and is always available.
// "tooltipTotal": true | false - whether the tooltip ends with a "Total" row.
// "monthly": true marks monthly datasets (bar/pie/timeline work on a month,
// REF.month, instead of a year); "titleAux" is the title key for those bar and
// pie views, whose period differs from the line chart's "last 12 months".
codesDataset = {
	"chart_1": {
		"dataset":'nrg_ind_eff',
		"title": "chart_1",
		// FEC2020-2030/PEC2020-2030 (Europe 2020-2030 tracking) no longer carry
		// any data in this dataset - Eurostat replaced them with the Energy
		// Efficiency Directive codes below (verified against the live API and
		// the official data browser table).
		"indicator": ["FEC_EED", "PEC_EED"],
		"indicator_type": "nrg_bal",
		"indicator2": '',
		"indicator2_type": "",
		"unit": "MTOE",
		"container": "highchartsContainer_1",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,
		"optionUrl": "",
		"meta": "nrg_ind_eff"
	},
	"chart_2": {
		"dataset":'nrg_ind_ren',
		"title": "chart_2",
		"indicator": ["REN", "REN_TRA", "REN_ELC", "REN_HEAT_CL"],
		"indicator_type": "nrg_bal",
		"indicator2": '',
		"indicator2_type": "",	
		"unit": "PC",	
		"container": "highchartsContainer_2",
		"optionCharts": ["table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": false,
		"meta": "nrg_ind_share"		
	},
	"chart_3": {
		"dataset":'env_air_gge',
		"title": "chart_3",
		"indicator": ['CRF1A1','CRF1A2','CRF1A3','CRF1A4A','CRF1A4B','CRF1A4C','CRF1A5'],
		"indicator_type": "src_crf",
		"indicator2": ['GHG'],
		"indicator2_type": "AIRPOL",	
		"unit": "THS_T",	
		"container": "highchartsContainer_3",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,	
		"meta": "env_air_gge"		
	},
	"chart_4": {
		"dataset":'nrg_ind_ei',
		"title": "chart_4",
		"indicator": ['EI_GDP_CLV05'],
		"indicator_type": "nrg_bal",
		"indicator2": '',
		"indicator2_type": "",
		"unit": "KGOE_TEUR",	
		"container": "highchartsContainer_4",
		"optionCharts": ["bar", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": false,
		"meta": "nrg_ind_ei"		
	},
	"chart_5": {
		"dataset":'nrg_ind_ep',
		"title": "chart_5",
		"indicator": [],	
		"indicator_type": "nrg_bal",	
		"indicator2": '',	
		"indicator2_type": "",
		"unit": "EUR_KGOE",	
		"container": "highchartsContainer_5",
		"optionCharts": ["bar", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": false,
		"meta": "nrg_ind_ep"		
	},
	"chart_6": {
		"dataset":'nrg_ind_id',
		"title": "chart_6",
		// C0000X0350-0370 (Solid fossil fuels) removed - it's just an aggregate
		// of the fuel types below, not its own valid dependency figure.
		// C0100/C0110/C0121/C0129 (hard coal + its sub-types) removed - Eurostat
		// doesn't have a hard coal series for this dataset yet, so it was being
		// faked client-side (see the old chart_6 special case in handleData()).
		// Re-add once a real hard coal source is linked in.
		"indicator": ["G3000","O4000XBIO","O4100_TOT","O4200"],
		"indicator_type": "siec",
		"indicator2": '',
		"indicator2_type": "",
		"unit": "PC",
		"container": "highchartsContainer_6",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": false,
		"meta": "nrg_ind_id"
	},
	"chart_7": {
		"dataset":'nrg_ind_ffgae',
		"title": "chart_7",
		"indicator": [],
		"indicator_type": "PC",	
		"indicator2": '',
		"indicator2_type": "",	
		"unit": "PC",	
		"container": "highchartsContainer_7",
		"optionCharts": ["bar", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": false,	
		"meta": "nrg_ind_ffgae"		
	},
	"chart_8": {
		"dataset":'demo_pjan',
		"title": "chart_8",
		"indicator": [],
		"indicator2": '',
		"unit": "KGOE",
		"container": "highchartsContainer_8",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": false,	
		"meta": "demo_pop"		
	},
	"chart_9": {
		"dataset":'nrg_bal_s',
		"title": "chart_9",
		"indicator": ["C0000X0350-0370","C0350-0370","P1000","S2000","G3000","O4000XBIO","RA000","W6100_6220","N900H","E7000","H8000"],	
		"indicator_type": "siec",	
		"indicator2": ["FC_E"],
		"indicator2_type": "nrg_bal",	
		"unit": "KTOE",	
		"container": "highchartsContainer_9",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,
		"meta": "nrg_bal"		
	},
	"chart_10": {
		"dataset":'nrg_bal_s',
		"title": "chart_10",
		"indicator": ["FC_IND_E","FC_OTH_AF_E","FC_OTH_CP_E","FC_OTH_FISH_E","FC_OTH_HH_E","FC_OTH_NSP_E","FC_TRA_E"],
		"indicator_type": "nrg_bal",	
		"indicator2": ["TOTAL"],
		"indicator2_type": "siec",	
		"unit": "KTOE",	
		"container": "highchartsContainer_10",
		"optionCharts": ["bar", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,	
		"meta": "nrg_bal"		
	},
	"chart_11": {
		"dataset":'nrg_d_hhq',
		"title": "chart_11",
		"indicator": ["FC_OTH_HH_E_SH","FC_OTH_HH_E_SC","FC_OTH_HH_E_WH","FC_OTH_HH_E_CK","FC_OTH_HH_E_LE","FC_OTH_HH_E_OE"],
		"indicator_type": "nrg_bal",	
		"indicator2": ["TOTAL"],
		"indicator2_type": "siec",	
		"unit": "TJ",	
		"container": "highchartsContainer_11",
		"optionCharts": ["bar", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,	
		"meta": "nrg_quant"		
	},
	"chart_12": {
		"dataset":'nrg_bal_c',
		"title": "chart_12",
		"indicator": ["E7000","G3000","O4630","O4652XR5210B","O4661XR5230B","O4671XR5220B","O4680","R5210B","R5210P","R5220B","R5220P","R5290","R5300"],
		"indicator_type": "siec",		
		"indicator2": ["FC_TRA_E"],
		"indicator2_type": "nrg_bal",
		"unit": "KTOE",	
		"container": "highchartsContainer_12",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,	
		"meta": "nrg_bal"		
	},
	"chart_13": {
		"dataset":'nrg_bal_c',
		"title": "chart_13",
		"indicator": ["G3000","O4630","O4652XR5210B","O4671XR5220B","R5210P","R5210B","R5220P","R5220B","R5290","R5300","E7000"],
		"indicator_type": "siec",	
		"indicator2": ["FC_TRA_ROAD_E"],
		"indicator2_type": "nrg_bal",	
		"unit": "KTOE",	
		"container": "highchartsContainer_13",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,	
		"meta": "nrg_bal"		
	},
	"chart_14": {
		"dataset":'nrg_bal_s',
		"title": "chart_14",
		"indicator": ["C0000X0350-0370","E7000","G3000","H8000","O4000XBIO","RA000","W6100_6220"],
		"indicator_type": "siec",	
		"indicator2": ["FC_OTH_CP_E"],
		"indicator2_type": "nrg_bal",	
		"unit": "KTOE",	
		"container": "highchartsContainer_14",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,	
		"meta": "nrg_bal"		
	},
	"chart_15": {
		"dataset":'nrg_bal_s',
		"title": "chart_15",
		"indicator": ["C0000X0350-0370","C0350-0370","E7000","G3000","H8000","N900H","O4000XBIO","P1000","RA000","S2000","W6100_6220"],
		"indicator_type": "siec",	
		"indicator2": ["FC_IND_E"],
		"indicator2_type": "nrg_bal",	
		"unit": "KTOE",	
		"container": "highchartsContainer_15",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,	
		"meta": "nrg_bal"		
	},
	"chart_16": {
		"dataset":'nrg_bal_s',
		"title": "chart_16",
		"indicator": ["C0000X0350-0370","C0350-0370","G3000","O4000XBIO","P1000","RA000","S2000",],
		"indicator_type": "siec",	
		"indicator2": ["FC_NE"],
		"indicator2_type": "nrg_bal",	
		"unit": "KTOE",	
		"container": "highchartsContainer_16",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,	
		"meta": "nrg_bal"		
	},
	"chart_17": {
		"dataset":'nrg_ind_peh',
		"title": "chart_17",
		"indicator": ["CF","RA100","RA130","RA200","RA300","RA400","RA500","N9000","X9900","X9900H",],
		"indicator_type": "siec",	
		"indicator2": ["GEP"],
		"indicator2_type": "nrg_bal",	
		"unit": "GWH",	
		"container": "highchartsContainer_17",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,	
		"meta": "nrg_quant"		
	},
	"chart_18": {
		"dataset":'nrg_ind_pehcf',
		"title": "chart_18",
		"indicator": ["C0110","C0121","C0129","C0210","C0220","C0311","C0312","C0320","C0330","C0340","C0350","C0360","C0371","C0379"],
		"indicator_type": "siec",	
		"indicator2": ["GEP"],
		"indicator2_type": "nrg_bal",	
		"unit": "GWH",	
		"container": "highchartsContainer_18",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,	
		"meta": "nrg_quant"		
	},
	"chart_19": {
		"dataset":'ilc_mdes01',
		"title": "chart_19",
		"indicator": ["TOTAL"],
		"indicator_type": "hhcomp",
		"indicator2": ["TOTAL"],
		"indicator2_type": "rskpovth",
		"unit": "PC",
		"container": "highchartsContainer_19",
		"optionCharts": ["bar", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": false,
		"meta": "ilc_sieusilc"
	},
	"chart_20": {
		// Replaces the old "Market share of the largest generator" chart
		// (nrg_ind_market - dataset permanently unavailable upstream, see
		// HIDDEN_CHART_IDS history) with "Rate of electrification". Verified
		// live against the Eurostat API: nrg_ind_re is a real dataset and all
		// 4 indicator codes below return real data (unit: Percentage). Shows
		// all 4 as separate lines at once, same as every other chart.
		"dataset":'nrg_ind_re',
		"title": "chart_20",
		"indicator": ["FC_E", "FC_IND_E", "FC_TRA_E", "FC_OTH_HH_CP_E"],
		"indicator_type": "nrg_bal",
		"indicator2": '',
		"indicator2_type": "",
		"unit": "PC",
		"container": "highchartsContainer_20",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": false,
		"meta": "nrg_ind_re"
	},
	"chart_21": {
		"dataset":'nrg_bal_s',
		"title": "chart_21",
		"indicator": ["C0000X0350-0370","C0350-0370","P1000","S2000","G3000","O4000XBIO","RA000","W6100_6220","E7000","H8000","N900H"],
		"indicator_type": "siec",	
		"indicator2": ["GAE"],
		"indicator2_type": "nrg_bal",	
		"unit": "KTOE",	
		"container": "highchartsContainer_21",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,	
		"meta": "nrg_bal"		
	},
	"chart_22": {
		"dataset":'nrg_bal_s',
		"title": "chart_22",
		"indicator": ["C0000X0350-0370","C0350-0370","P1000","S2000","G3000","O4000XBIO","RA000","W6100_6220","E7000","H8000","N900H",],
		"indicator_type": "siec",	
		"indicator2": ["NRGSUP"],
		"indicator2_type": "nrg_bal",	
		"unit": "KTOE",	
		"container": "highchartsContainer_22",
		"optionCharts": ["bar", "pie", "timeline", "table", "insights"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": true,
		"meta": "nrg_bal"
	},
	"chart_23": {
		// Road diesel stocks vs. deliveries (oil stocks theme) - ONE chart built
		// from TWO monthly Eurostat tables. The top-level fields are the first
		// table (closing stocks, nrg_stk_oilm); `combine` is the second table
		// (gross inland deliveries, nrg_cb_oilm). Both are in THS_T, so they
		// share one y-axis. combinedChartData() (endash.js) merges them: it
		// anchors on the latest month BOTH tables have published and draws the
		// last `months` months plus the `months` before them as an overlay, so
		// the window rolls forward by itself each time Eurostat adds a month.
		// No Eurostat metadata page code is known for these tables yet, so
		// "meta" is NONE (the Metadata button then says "No metadata to
		// display") - replace it with the real code once it's confirmed.
		"dataset":'nrg_stk_oilm',
		"title": "chart_23",
		"indicator": ["O46711"],
		"indicator_type": "siec",
		"indicator2": ["STK_CL"],
		"indicator2_type": "stk_flow",
		"unit": "THS_T",
		"container": "highchartsContainer_23",
		"optionCharts": ["bar", "timeline", "table"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": false,
		"monthly": true,
		"titleAux": "chart_23_aux",
		"meta": "NONE",
		"combine": {
			"dataset":'nrg_cb_oilm',
			"indicator": ["O46711"],
			"indicator_type": "siec",
			"indicator2": ["GID_OBS"],
			"indicator2_type": "nrg_bal",
			"unit": "THS_T"
		},
		"months": 12
	},
	"chart_25": {
		// Kerosene-type jet fuel stocks vs. deliveries - same combined two-table
		// overlay as chart_23 (see its comment), for product O4661.
		"dataset":'nrg_stk_oilm',
		"title": "chart_25",
		"indicator": ["O4661"],
		"indicator_type": "siec",
		"indicator2": ["STK_CL"],
		"indicator2_type": "stk_flow",
		"unit": "THS_T",
		"container": "highchartsContainer_25",
		"optionCharts": ["bar", "timeline", "table"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": false,
		"monthly": true,
		"titleAux": "chart_25_aux",
		"meta": "NONE",
		"combine": {
			"dataset":'nrg_cb_oilm',
			"indicator": ["O4661"],
			"indicator_type": "siec",
			"indicator2": ["GID_OBS"],
			"indicator2_type": "nrg_bal",
			"unit": "THS_T"
		},
		"months": 12
	},
	"chart_26": {
		// Kerosene-type jet fuel closing stocks by country - same above/below
		// average split as chart_24 (see its comment), for product O4661.
		"dataset":'nrg_stk_oilm',
		"title": "chart_26",
		"indicator": ["O4661"],
		"indicator_type": "siec",
		"indicator2": ["STK_CL"],
		"indicator2_type": "stk_flow",
		"unit": "THS_T",
		"container": "highchartsContainer_26",
		"optionCharts": ["bar", "pie", "timeline", "table"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": false,
		"monthly": true,
		"titleAux": "chart_26_aux",
		"meta": "NONE",
		"medianSplit": true,
		"months": 12
	},
	"chart_24": {
		// Road diesel closing stocks BY COUNTRY (oil stocks theme), last `months`
		// available months. The median is ONE value computed from every
		// country's monthly figures in that period; the chart shows only the
		// values above it or only those at or below it, flipped with the toggle
		// in the expanded view (REF.medianGroup). See medianChartData() in
		// endash.js.
		// Same table as chart_23's first half; "meta" is NONE for the same
		// reason (no confirmed Eurostat metadata code yet).
		"dataset":'nrg_stk_oilm',
		"title": "chart_24",
		"indicator": ["O46711"],
		"indicator_type": "siec",
		"indicator2": ["STK_CL"],
		"indicator2_type": "stk_flow",
		"unit": "THS_T",
		"container": "highchartsContainer_24",
		"optionCharts": ["bar", "pie", "timeline", "table"],
		// Show a "Total" row in the tooltip (only meaningful when the series are parts of one whole).
		"tooltipTotal": false,
		"monthly": true,
		"titleAux": "chart_24_aux",
		"meta": "NONE",
		"medianSplit": true,
		"months": 12
	},


}

function chartOptionEnabled(chartId, option) {
	const config = codesDataset[chartId];
	return !!(config && Array.isArray(config.optionCharts) && config.optionCharts.includes(option));
}

function tooltipTotalEnabled(chartId) {
	const config = codesDataset[chartId];
	return !!(config && config.tooltipTotal === true);
}

function isMonthlyChart(chartId) {
	const config = codesDataset[chartId];
	return !!(config && config.monthly);
}

// Groups the gallery into jump-nav themed sections (see the "Energy topics"
// nav row). Order here is both the nav link order and the on-page section
// order - charts are rendered grouped by theme, not by chart_N number.
// A theme with an empty `charts` list renders a "coming soon" message instead
// of cards. "oilstocks" holds chart_23 and chart_25 (two Eurostat tables merged into
// one - see their `combine` block) and chart_24 (all countries, split at the median -
// see its `medianSplit` flag).
const THEME_SECTIONS = [
	{ id: "theme-sustainability", labelKey: "THEME_SUSTAINABILITY", charts: ["chart_2", "chart_3", "chart_19"] },
	{ id: "theme-diversification", labelKey: "THEME_DIVERSIFICATION", charts: ["chart_21", "chart_22", "chart_7", "chart_6"] },
	{ id: "theme-efficiency", labelKey: "THEME_EFFICIENCY", charts: ["chart_1", "chart_4", "chart_5"] },
	{ id: "theme-electrification", labelKey: "THEME_ELECTRIFICATION", charts: ["chart_20", "chart_17", "chart_18"] },
	{ id: "theme-consumption", labelKey: "THEME_CONSUMPTION", charts: ["chart_8", "chart_9", "chart_10", "chart_11", "chart_12", "chart_13", "chart_14", "chart_15", "chart_16"] },
	{ id: "theme-oilstocks", labelKey: "THEME_OILSTOCKS", charts: ["chart_23", "chart_25", "chart_24", "chart_26"] },
];


defaultGeos = ["EU27_2020","BE","BG","CZ","DK","DE","EE","IE","EL","ES","FR","HR","IT","CY","LV","LT","LU","HU","MT","NL","AT","PL","PT","RO","SI","SK","FI","SE","IS","LI","NO","ME","MK","AL","RS","TR","BA","XK","MD","UA","GE"]


const AGGREGATES_COUNTRY_CODES = ["EU27_2020"];
  
const EU_COUNTRY_CODES = [
  "BE","BG","CZ","DK","DE","EE","IE","EL","ES","FR","HR","IT","CY","LV","LT",
  "LU","HU","MT","NL","AT","PL","PT","RO","SI","SK","FI","SE"
]

const EFTA_COUNTRY_CODES = [
  "IS", "LI", "NO"
]

const ENLARGEMENT_COUNTRY_CODES = [ "BA","ME","MD","MK","GE","AL","RS","TR","UA","XK",]
// const OTHER_THIRD_COUNTRY_CODES = ["UA", "MD", "GE"];