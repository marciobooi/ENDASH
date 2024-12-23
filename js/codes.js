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

codesDataset = {
	"chart_1": {
		"dataset":'nrg_ind_eff',
		"title": "chart_1",
		"indicator": ["FEC2020-2030", "PEC2020-2030"],
		"indicator_type": "nrg_bal",		
		"indicator2": '',
		"indicator2_type": "",
		"unit": "MTOE",	
		"container": "highchartsContainer_1",		
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
		"meta": "nrg_ind_ep"		
	},
	"chart_6": {
		"dataset":'nrg_ind_id',
		"title": "chart_6",
		"indicator": ["C0000X0350-0370","C0100","C0110","C0121","C0129", "G3000","O4000XBIO","O4100_TOT","O4200"],	
		"indicator_type": "siec",	
		"indicator2": '',
		"indicator2_type": "",	
		"unit": "PC",	
		"container": "highchartsContainer_6",
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
		"meta": "nrg_ind_ffgae"		
	},
	"chart_8": {
		"dataset":'demo_pjan',
		"title": "chart_8",
		"indicator": [],
		"indicator2": '',
		"unit": "KGOE",
		"container": "highchartsContainer_8",	
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
		"meta": "nrg_quant"		
	},
	"chart_19": {
		"dataset":'ilc_mdes01',
		"title": "chart_19",
		"indicator": ["TOTAL"],
		"indicator_type": "hhtyp",	
		"indicator2": ["TOTAL"],
		"indicator2_type": "incgrp",	
		"unit": "PC",	
		"container": "highchartsContainer_19",	
		"meta": "ilc_sieusilc"		
	},
	"chart_20": {
		"dataset":'nrg_ind_market',
		"title": "chart_20",
		"indicator": ["RCMPY_NEG95","PCMPY_NEG5","LCMPY_EG","CMPY_EG5","LCMPY_IECAP","CMPY_ECAP5","ECAP_CN","ECAP_DC","ECAP_VAR","ERTL","ERTL_SELL_EC5","ERTL_LG","ERTL_EC5"],
		"indicator_type": "indic_nrgm",	
		"indicator2": ["E7000"],
		"indicator2_type": "siec",	
		"unit": "PC",	
		"container": "highchartsContainer_20",	
		"meta": "NONE"		
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
		"meta": "nrg_bal"		
	},


}



defaultGeos = ["EU27_2020","BE","BG","CZ","DK","DE","EE","IE","EL","ES","FR","HR","IT","CY","LV","LT","LU","HU","MT","NL","AT","PL","PT","RO","SI","SK","FI","SE","IS","LI","NO","ME","MK","AL","RS","TR","BA","XK","MD","UA","GE"]


const AGGREGATES_COUNTRY_CODES = ["EU27_2020", "EA"];
  
const EU_COUNTRY_CODES = [
  "BE","BG","CZ","DK","DE","EE","IE","EL","ES","FR","HR","IT","CY","LV","LT",
  "LU","HU","MT","NL","AT","PL","PT","RO","SI","SK","FI","SE"
]

const EFTA_COUNTRY_CODES = [
  "IS", "LI", "NO"
]

const ENLARGEMENT_COUNTRY_CODES = [ "BA","ME","MD","MK","GE","AL","RS","TR","UA","XK",]
// const OTHER_THIRD_COUNTRY_CODES = ["UA", "MD", "GE"];