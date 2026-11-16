/* Generated from old/js/insights.js (chartStoryConfig, insightGroups, explainers). Texts of the story cards come
 * from the locale files (STORY_CHART_<n>_*), these are the fallbacks and the structure. */
export const chartStoryConfig: Record<string, {
  group: string
  icon: string
  storyTitle: string
  insightRole: string
  preferredMetric: string
  sentiment: 'higher-is-better' | 'lower-is-better' | 'neutral' | 'contextual'
  simpleExplain: { what: string; how: string; read: string }
}> = {
  "chart_1": {
    "group": "headline",
    "icon": "⚡",
    "storyTitle": "Energy efficiency",
    "insightRole": "Tracks final and primary energy consumption against policy indicators.",
    "preferredMetric": "latest-and-change",
    "sentiment": "lower-is-better",
    "simpleExplain": {
      "what": "Compares final and primary energy consumption levels and their recent direction.",
      "how": "Reads the latest value, yearly change and long-term change from the time series.",
      "read": "Lower consumption for similar activity usually indicates better efficiency."
    }
  },
  "chart_2": {
    "group": "headline",
    "icon": "🌱",
    "storyTitle": "Renewable energy",
    "insightRole": "Shows the share of renewable energy across total, transport, electricity and heating/cooling.",
    "preferredMetric": "percentage-point-change",
    "sentiment": "higher-is-better",
    "simpleExplain": {
      "what": "Shows how much of energy demand is covered by renewables.",
      "how": "Uses percentage shares and their change in percentage points over time.",
      "read": "Higher renewable shares generally signal progress in transition."
    }
  },
  "chart_3": {
    "group": "environment",
    "icon": "🌍",
    "storyTitle": "Energy-related greenhouse gas emissions",
    "insightRole": "Shows greenhouse gas emissions by source category.",
    "preferredMetric": "contributor-and-trend",
    "sentiment": "lower-is-better",
    "simpleExplain": {
      "what": "Identifies which source contributes most to energy-related emissions.",
      "how": "Ranks source categories by latest value and checks their trend over time.",
      "read": "Falling emissions are usually favourable for climate objectives."
    }
  },
  "chart_4": {
    "group": "performance",
    "icon": "📉",
    "storyTitle": "Energy intensity",
    "insightRole": "Shows how much energy is used per unit of economic output.",
    "preferredMetric": "latest-and-change",
    "sentiment": "lower-is-better",
    "simpleExplain": {
      "what": "Measures energy used to produce one unit of economic output.",
      "how": "Tracks the intensity indicator level and its short- and long-term changes.",
      "read": "Lower intensity means less energy needed for the same output."
    }
  },
  "chart_5": {
    "group": "performance",
    "icon": "📈",
    "storyTitle": "Energy productivity",
    "insightRole": "Shows economic output generated per unit of energy used.",
    "preferredMetric": "latest-and-change",
    "sentiment": "higher-is-better",
    "simpleExplain": {
      "what": "Measures how much economic value is created per unit of energy.",
      "how": "Tracks the productivity indicator and compares current vs past values.",
      "read": "Higher productivity usually means energy is used more efficiently."
    }
  },
  "chart_6": {
    "group": "security",
    "icon": "🛢️",
    "storyTitle": "Energy import dependency",
    "insightRole": "Shows dependency on energy imports by product.",
    "preferredMetric": "dependency-risk",
    "sentiment": "lower-is-better",
    "simpleExplain": {
      "what": "Shows how much the energy system relies on imported energy.",
      "how": "Calculates dependency ratios and compares them over time by product.",
      "read": "Lower dependency generally implies lower exposure to external shocks."
    }
  },
  "chart_7": {
    "group": "security",
    "icon": "⛽",
    "storyTitle": "Fossil fuels in gross available energy",
    "insightRole": "Shows the share of fossil fuels in gross available energy.",
    "preferredMetric": "percentage-point-change",
    "sentiment": "lower-is-better",
    "simpleExplain": {
      "what": "Shows the fossil fuel share in total available energy.",
      "how": "Uses share indicators and percentage-point changes across years.",
      "read": "A declining fossil share indicates a cleaner supply mix."
    }
  },
  "chart_8": {
    "group": "context",
    "icon": "👥",
    "storyTitle": "Population context",
    "insightRole": "Provides demographic context for energy indicators.",
    "preferredMetric": "context",
    "sentiment": "neutral",
    "simpleExplain": {
      "what": "Provides population context to interpret energy indicators fairly.",
      "how": "Displays demographic levels and trends that can explain energy demand shifts.",
      "read": "Use as background context, not as a good-or-bad performance metric."
    }
  },
  "chart_9": {
    "group": "consumption",
    "icon": "🔥",
    "storyTitle": "Final energy consumption by product",
    "insightRole": "Shows which energy products dominate final consumption.",
    "preferredMetric": "top-driver-and-share",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Shows which fuels/products contribute most to final energy use.",
      "how": "Ranks products by latest value and their share of the total.",
      "read": "Interpret changes with structural and policy context, not direction alone."
    }
  },
  "chart_10": {
    "group": "consumption",
    "icon": "🏭",
    "storyTitle": "Final energy consumption by sector",
    "insightRole": "Shows which sectors consume the most final energy.",
    "preferredMetric": "top-driver-and-share",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Shows sectoral distribution of final energy consumption.",
      "how": "Compares sector series and highlights top contributors and shares.",
      "read": "Use to identify demand structure before judging trend quality."
    }
  },
  "chart_11": {
    "group": "households",
    "icon": "🏠",
    "storyTitle": "Household energy use",
    "insightRole": "Breaks down household energy consumption by end use.",
    "preferredMetric": "top-driver-and-trend",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Explains where household energy is used (heating, appliances, etc.).",
      "how": "Finds leading end uses and follows their trend over time.",
      "read": "Direction depends on weather, efficiency and social context."
    }
  },
  "chart_12": {
    "group": "transport",
    "icon": "🚆",
    "storyTitle": "Transport energy by fuel",
    "insightRole": "Shows the fuel mix used in transport.",
    "preferredMetric": "top-driver-and-trend",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Shows which fuels power the transport sector.",
      "how": "Compares fuel series, identifies the top fuel and its trend.",
      "read": "Assess with mobility demand and decarbonisation context together."
    }
  },
  "chart_13": {
    "group": "transport",
    "icon": "🚗",
    "storyTitle": "Road transport energy by fuel",
    "insightRole": "Shows the fuel mix used in road transport.",
    "preferredMetric": "top-driver-and-trend",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Focuses on fuel use specifically in road transport.",
      "how": "Ranks road-fuel series by latest values and tracks their trend.",
      "read": "Use with fleet and technology context to interpret shifts."
    }
  },
  "chart_14": {
    "group": "consumption",
    "icon": "🏢",
    "storyTitle": "Services energy consumption",
    "insightRole": "Shows energy use in commercial and public services.",
    "preferredMetric": "top-driver-and-trend",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Shows how service activities consume energy by product/fuel.",
      "how": "Highlights top consuming products and their trend over time.",
      "read": "Interpret with activity growth and efficiency changes together."
    }
  },
  "chart_15": {
    "group": "industry",
    "icon": "🏭",
    "storyTitle": "Industry energy consumption",
    "insightRole": "Shows the fuel mix used by industry.",
    "preferredMetric": "top-driver-and-trend",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Shows which fuels are most used in industrial activity.",
      "how": "Compares fuel contributions and their long-term movement.",
      "read": "Judge trends with industrial output and technology context."
    }
  },
  "chart_16": {
    "group": "industry",
    "icon": "🧪",
    "storyTitle": "Final non-energy consumption",
    "insightRole": "Shows products used for non-energy purposes.",
    "preferredMetric": "top-driver-and-trend",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Tracks products used as feedstock or materials rather than fuel.",
      "how": "Identifies dominant non-energy products and their trend.",
      "read": "Changes often reflect industrial structure, not only efficiency."
    }
  },
  "chart_17": {
    "group": "electricity",
    "icon": "🔌",
    "storyTitle": "Electricity and heat production",
    "insightRole": "Shows gross electricity and derived heat production by source.",
    "preferredMetric": "generation-mix",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Shows how electricity and heat generation are split by source.",
      "how": "Compares source contributions and changes in the generation mix.",
      "read": "Use to monitor diversification and decarbonisation patterns."
    }
  },
  "chart_18": {
    "group": "electricity",
    "icon": "⚙️",
    "storyTitle": "Electricity from combustible fuels",
    "insightRole": "Shows electricity production from combustible fuel types.",
    "preferredMetric": "generation-mix",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Details electricity output from combustible fuel categories.",
      "how": "Breaks down generation by fuel type and tracks trend shifts.",
      "read": "Interpret with transition pace and security constraints in mind."
    }
  },
  "chart_19": {
    "group": "social",
    "icon": "🏠",
    "storyTitle": "Energy poverty",
    "insightRole": "Shows population unable to keep home adequately warm.",
    "preferredMetric": "social-risk",
    "sentiment": "lower-is-better",
    "simpleExplain": {
      "what": "Measures social exposure to insufficient home heating conditions.",
      "how": "Uses survey-based population shares and their trend over time.",
      "read": "Lower values indicate lower energy poverty risk."
    }
  },
  "chart_20": {
    "group": "electricity",
    "icon": "⚡",
    "storyTitle": "Rate of electrification",
    "insightRole": "Shows the share of final energy consumption that is electrified, by sector.",
    "preferredMetric": "percentage-point-change",
    "sentiment": "higher-is-better",
    "simpleExplain": {
      "what": "Shows how much of final energy use is met directly by electricity, overall and by sector.",
      "how": "Tracks the electrification share for each sector and its change over time.",
      "read": "A rising share generally signals progress in electrifying energy demand."
    }
  },
  "chart_21": {
    "group": "supply",
    "icon": "📦",
    "storyTitle": "Gross available energy",
    "insightRole": "Shows available energy by product.",
    "preferredMetric": "top-driver-and-share",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Shows total available energy split by product categories.",
      "how": "Finds largest product contributions and their relative share.",
      "read": "Use to understand supply structure before comparing levels."
    }
  },
  "chart_22": {
    "group": "supply",
    "icon": "🔋",
    "storyTitle": "Total energy supply",
    "insightRole": "Shows total energy supply by product.",
    "preferredMetric": "top-driver-and-share",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Shows how total energy supply is distributed across products.",
      "how": "Ranks product series by latest value and share of total supply.",
      "read": "Interpret trends with structural changes in energy mix."
    }
  },
  "chart_23": {
    "group": "oil",
    "icon": "🛢️",
    "storyTitle": "Road diesel stocks and deliveries",
    "insightRole": "Compares road diesel closing stocks and deliveries over the last 12 months.",
    "preferredMetric": "latest-and-change",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Puts road diesel closing stocks next to deliveries for the latest 12 months, with the 12 months before for comparison.",
      "how": "Takes the newest month published for the selected country, then reads the latest value, the change on the previous month and over the period.",
      "read": "Stocks that stay high while deliveries fall can signal weaker demand; falling stocks with steady deliveries signal tighter supply."
    }
  },
  "chart_25": {
    "group": "oil",
    "icon": "✈️",
    "storyTitle": "Jet fuel stocks and deliveries",
    "insightRole": "Compares kerosene-type jet fuel closing stocks and deliveries over the last 12 months.",
    "preferredMetric": "latest-and-change",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Puts jet fuel closing stocks next to deliveries for the latest 12 months, with the 12 months before for comparison.",
      "how": "Takes the newest month published for the selected country, then reads the latest value, the change on the previous month and over the period.",
      "read": "Stocks that stay high while deliveries fall can signal weaker demand; falling stocks with steady deliveries signal tighter supply."
    }
  },
  "chart_24": {
    "group": "oil",
    "icon": "🛢️",
    "storyTitle": "Road diesel stocks by country",
    "insightRole": "Ranks countries by road diesel closing stocks over the last 12 months.",
    "preferredMetric": "latest-and-change",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Shows every country's closing stock month by month and which countries hold the most.",
      "how": "Ranks all countries by their latest published month and reads each one's trend over the period.",
      "read": "A large and rising stock is a bigger buffer; compare countries against the period average shown in the chart."
    }
  },
  "chart_26": {
    "group": "oil",
    "icon": "✈️",
    "storyTitle": "Jet fuel stocks by country",
    "insightRole": "Ranks countries by kerosene-type jet fuel closing stocks over the last 12 months.",
    "preferredMetric": "latest-and-change",
    "sentiment": "contextual",
    "simpleExplain": {
      "what": "Shows every country's closing stock month by month and which countries hold the most.",
      "how": "Ranks all countries by their latest published month and reads each one's trend over the period.",
      "read": "A large and rising stock is a bigger buffer; compare countries against the period average shown in the chart."
    }
  }
}

export const insightGroups: Record<string, { labelKey: string; descKey: string; whyKey: string; color: string; order: number }> = {
  "theme-sustainability": {
    "labelKey": "THEME_SUSTAINABILITY",
    "descKey": "THEME_SUSTAINABILITY_DESC",
    "whyKey": "THEME_SUSTAINABILITY_WHY",
    "color": "#1f6fba",
    "order": 1
  },
  "theme-diversification": {
    "labelKey": "THEME_DIVERSIFICATION",
    "descKey": "THEME_DIVERSIFICATION_DESC",
    "whyKey": "THEME_DIVERSIFICATION_WHY",
    "color": "#b85c00",
    "order": 2
  },
  "theme-efficiency": {
    "labelKey": "THEME_EFFICIENCY",
    "descKey": "THEME_EFFICIENCY_DESC",
    "whyKey": "THEME_EFFICIENCY_WHY",
    "color": "#805ad5",
    "order": 3
  },
  "theme-electrification": {
    "labelKey": "THEME_ELECTRIFICATION",
    "descKey": "THEME_ELECTRIFICATION_DESC",
    "whyKey": "THEME_ELECTRIFICATION_WHY",
    "color": "#0e8a3d",
    "order": 4
  },
  "theme-consumption": {
    "labelKey": "THEME_CONSUMPTION",
    "descKey": "THEME_CONSUMPTION_DESC",
    "whyKey": "THEME_CONSUMPTION_WHY",
    "color": "#6b4eff",
    "order": 5
  },
  "theme-oilstocks": {
    "labelKey": "THEME_OILSTOCKS",
    "descKey": "THEME_OILSTOCKS_DESC",
    "whyKey": "THEME_OILSTOCKS_WHY",
    "color": "#4a5568",
    "order": 6
  },
  "other": {
    "labelKey": "GROUP_OTHER_TITLE",
    "descKey": "GROUP_OTHER_DESC",
    "whyKey": "GROUP_OTHER_WHY",
    "color": "#718096",
    "order": 99
  }
}

export const preferredMetricExplainers: Record<string, string> = {
  "latest-and-change": "Uses the latest value and compares it with the previous and first available years.",
  "percentage-point-change": "Measures changes in share values in percentage points over time.",
  "contributor-and-trend": "Finds the largest contributor and then checks whether it rises, falls or stays stable.",
  "dependency-risk": "Highlights import dependence and whether reliance is increasing or decreasing.",
  "context": "Provides context indicators to support interpretation of the energy data.",
  "top-driver-and-share": "Selects the leading series and its relative weight in the selected scope.",
  "top-driver-and-trend": "Selects the leading series and evaluates its time trend.",
  "generation-mix": "Compares the contribution of different generation sources in the energy mix.",
  "social-risk": "Tracks social exposure and direction of change over time.",
  "market-structure": "Summarises concentration and structure indicators for the electricity market.",
  "generic": "Summarises the leading values and trend in the available series."
}

export const sentimentReadingGuide: Record<string, string> = {
  "higher-is-better": "Read upward movement as generally positive progress for this indicator.",
  "lower-is-better": "Read downward movement as generally positive progress for this indicator.",
  "neutral": "Read movement as descriptive context, not as good or bad by default.",
  "contextual": "Interpret using policy context; direction alone is not enough to judge performance."
}
