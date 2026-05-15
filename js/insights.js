/*
 * insights.js
 * Lightweight insights views for selected chart context.
 * - Energy insights: chart-level summary cards
 * - Global insights: data-story / infographic overview using codesDataset metadata
 */

function formatInsightNumber(value) {
  if (value == null || Number.isNaN(value)) return "-";
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function escapeInsightText(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const chartStoryConfig = {
  chart_1: {
    group: "headline",
    icon: "⚡",
    storyTitle: "Energy efficiency",
    insightRole: "Tracks final and primary energy consumption against policy indicators.",
    preferredMetric: "latest-and-change",
    sentiment: "lower-is-better"
  },
  chart_2: {
    group: "headline",
    icon: "🌱",
    storyTitle: "Renewable energy",
    insightRole: "Shows the share of renewable energy across total, transport, electricity and heating/cooling.",
    preferredMetric: "percentage-point-change",
    sentiment: "higher-is-better"
  },
  chart_3: {
    group: "environment",
    icon: "🌍",
    storyTitle: "Energy-related greenhouse gas emissions",
    insightRole: "Shows greenhouse gas emissions by source category.",
    preferredMetric: "contributor-and-trend",
    sentiment: "lower-is-better"
  },
  chart_4: {
    group: "performance",
    icon: "📉",
    storyTitle: "Energy intensity",
    insightRole: "Shows how much energy is used per unit of economic output.",
    preferredMetric: "latest-and-change",
    sentiment: "lower-is-better"
  },
  chart_5: {
    group: "performance",
    icon: "📈",
    storyTitle: "Energy productivity",
    insightRole: "Shows economic output generated per unit of energy used.",
    preferredMetric: "latest-and-change",
    sentiment: "higher-is-better"
  },
  chart_6: {
    group: "security",
    icon: "🛢️",
    storyTitle: "Energy import dependency",
    insightRole: "Shows dependency on energy imports by product.",
    preferredMetric: "dependency-risk",
    sentiment: "lower-is-better"
  },
  chart_7: {
    group: "security",
    icon: "⛽",
    storyTitle: "Fossil fuels in gross available energy",
    insightRole: "Shows the share of fossil fuels in gross available energy.",
    preferredMetric: "percentage-point-change",
    sentiment: "lower-is-better"
  },
  chart_8: {
    group: "context",
    icon: "👥",
    storyTitle: "Population context",
    insightRole: "Provides demographic context for energy indicators.",
    preferredMetric: "context",
    sentiment: "neutral"
  },
  chart_9: {
    group: "consumption",
    icon: "🔥",
    storyTitle: "Final energy consumption by product",
    insightRole: "Shows which energy products dominate final consumption.",
    preferredMetric: "top-driver-and-share",
    sentiment: "contextual"
  },
  chart_10: {
    group: "consumption",
    icon: "🏭",
    storyTitle: "Final energy consumption by sector",
    insightRole: "Shows which sectors consume the most final energy.",
    preferredMetric: "top-driver-and-share",
    sentiment: "contextual"
  },
  chart_11: {
    group: "households",
    icon: "🏠",
    storyTitle: "Household energy use",
    insightRole: "Breaks down household energy consumption by end use.",
    preferredMetric: "top-driver-and-trend",
    sentiment: "contextual"
  },
  chart_12: {
    group: "transport",
    icon: "🚆",
    storyTitle: "Transport energy by fuel",
    insightRole: "Shows the fuel mix used in transport.",
    preferredMetric: "top-driver-and-trend",
    sentiment: "contextual"
  },
  chart_13: {
    group: "transport",
    icon: "🚗",
    storyTitle: "Road transport energy by fuel",
    insightRole: "Shows the fuel mix used in road transport.",
    preferredMetric: "top-driver-and-trend",
    sentiment: "contextual"
  },
  chart_14: {
    group: "consumption",
    icon: "🏢",
    storyTitle: "Services energy consumption",
    insightRole: "Shows energy use in commercial and public services.",
    preferredMetric: "top-driver-and-trend",
    sentiment: "contextual"
  },
  chart_15: {
    group: "industry",
    icon: "🏭",
    storyTitle: "Industry energy consumption",
    insightRole: "Shows the fuel mix used by industry.",
    preferredMetric: "top-driver-and-trend",
    sentiment: "contextual"
  },
  chart_16: {
    group: "industry",
    icon: "🧪",
    storyTitle: "Final non-energy consumption",
    insightRole: "Shows products used for non-energy purposes.",
    preferredMetric: "top-driver-and-trend",
    sentiment: "contextual"
  },
  chart_17: {
    group: "electricity",
    icon: "🔌",
    storyTitle: "Electricity and heat production",
    insightRole: "Shows gross electricity and derived heat production by source.",
    preferredMetric: "generation-mix",
    sentiment: "contextual"
  },
  chart_18: {
    group: "electricity",
    icon: "⚙️",
    storyTitle: "Electricity from combustible fuels",
    insightRole: "Shows electricity production from combustible fuel types.",
    preferredMetric: "generation-mix",
    sentiment: "contextual"
  },
  chart_19: {
    group: "social",
    icon: "🏠",
    storyTitle: "Energy poverty",
    insightRole: "Shows population unable to keep home adequately warm.",
    preferredMetric: "social-risk",
    sentiment: "lower-is-better"
  },
  chart_20: {
    group: "market",
    icon: "🏦",
    storyTitle: "Electricity market structure",
    insightRole: "Shows market concentration and electricity market indicators.",
    preferredMetric: "market-structure",
    sentiment: "contextual"
  },
  chart_21: {
    group: "supply",
    icon: "📦",
    storyTitle: "Gross available energy",
    insightRole: "Shows available energy by product.",
    preferredMetric: "top-driver-and-share",
    sentiment: "contextual"
  },
  chart_22: {
    group: "supply",
    icon: "🔋",
    storyTitle: "Total energy supply",
    insightRole: "Shows total energy supply by product.",
    preferredMetric: "top-driver-and-share",
    sentiment: "contextual"
  }
};

const insightGroups = {
  headline: {
    title: "Headline policy indicators",
    description: "Core indicators used to understand energy transition progress.",
    color: "#1f6fba",
    order: 1
  },
  security: {
    title: "Energy security and dependency",
    description: "Dependence on imports and fossil fuels.",
    color: "#b85c00",
    order: 2
  },
  supply: {
    title: "Energy supply",
    description: "Gross available energy and total energy supply.",
    color: "#4a5568",
    order: 3
  },
  consumption: {
    title: "Energy consumption patterns",
    description: "How final energy consumption is distributed by product and sector.",
    color: "#6b4eff",
    order: 4
  },
  transport: {
    title: "Transport energy",
    description: "Fuel use in transport and road transport.",
    color: "#007c89",
    order: 5
  },
  industry: {
    title: "Industry and non-energy use",
    description: "Energy and non-energy consumption in industrial activities.",
    color: "#595959",
    order: 6
  },
  electricity: {
    title: "Electricity production",
    description: "Electricity and heat generation by source and fuel.",
    color: "#0e8a3d",
    order: 7
  },
  environment: {
    title: "Emissions and environment",
    description: "Greenhouse gas emissions linked to energy activity.",
    color: "#2f855a",
    order: 8
  },
  performance: {
    title: "Energy performance",
    description: "Energy intensity and productivity indicators.",
    color: "#805ad5",
    order: 9
  },
  households: {
    title: "Households",
    description: "Household energy consumption patterns.",
    color: "#dd6b20",
    order: 10
  },
  social: {
    title: "Social indicators",
    description: "Energy-related living condition indicators.",
    color: "#c53030",
    order: 11
  },
  market: {
    title: "Energy market",
    description: "Electricity market structure and concentration indicators.",
    color: "#2b6cb0",
    order: 12
  },
  context: {
    title: "Context",
    description: "Demographic and contextual indicators.",
    color: "#718096",
    order: 13
  },
  other: {
    title: "Other indicators",
    description: "Additional indicators in the current view.",
    color: "#718096",
    order: 99
  }
};

function getChartStory(chartId) {
  return chartStoryConfig[chartId] || {
    group: "other",
    icon: "📊",
    storyTitle: chartId || "Indicator",
    insightRole: "Additional indicator in the current view.",
    preferredMetric: "generic",
    sentiment: "neutral"
  };
}

function getValidTimeSeriesPoints(values, categories) {
  if (!Array.isArray(values)) return [];

  return values
    .map((value, index) => {
      const numericValue = typeof value === "number" && !Number.isNaN(value) ? value : null;
      const year = Array.isArray(categories) ? categories[index] : index;

      if (numericValue == null) return null;

      return {
        year,
        value: numericValue
      };
    })
    .filter(Boolean);
}

function hasMeaningfulValues(values) {
  return Array.isArray(values) && values.some((value) => {
    return typeof value === "number" && !Number.isNaN(value) && value !== 0;
  });
}

function getPercentChange(first, latest) {
  if (first == null || latest == null || first === 0) return null;
  return ((latest - first) / Math.abs(first)) * 100;
}

function getTrendDirectionFromValues(first, latest) {
  if (first == null || latest == null) return "flat";

  const diff = latest - first;

  if (Math.abs(diff) < 0.000001) return "flat";
  return diff > 0 ? "up" : "down";
}

function getTrendLabel(direction) {
  if (direction === "up") return "rising";
  if (direction === "down") return "falling";
  return "stable";
}

function formatSignedNumber(value, unit) {
  if (value == null || Number.isNaN(value)) return "-";
  return (value >= 0 ? "+" : "") + formatInsightNumber(value) + (unit ? " " + unit : "");
}

function formatSignedPercent(value) {
  if (value == null || Number.isNaN(value)) return "-";
  return (value >= 0 ? "+" : "") + formatInsightNumber(value) + "%";
}

function getSafeDriverName(value) {
  const text = String(value == null ? "" : value).trim();
  return text && text !== "-" ? text : "Not available";
}

function hasUsableDriverName(value) {
  const text = String(value == null ? "" : value).trim();
  return !!text && text !== "-";
}

function getInsightCategory(chartLabel, unitLabel) {
  const title = String(chartLabel || "").toLowerCase();
  const unit = String(unitLabel || "").toUpperCase();

  if (
    unit === "PC" ||
    title.includes("share") ||
    title.includes("dependency") ||
    title.includes("market share") ||
    title.includes("unable to keep home")
  ) {
    return "percentage";
  }

  if (title.includes("electricity") || unit === "GWH") {
    return "electricity";
  }

  if (title.includes("emission") || unit === "THS_T") {
    return "emissions";
  }

  if (
    title.includes("consumption") ||
    title.includes("supply") ||
    title.includes("energy") ||
    unit === "KTOE" ||
    unit === "MTOE" ||
    unit === "TJ"
  ) {
    return "energy-volume";
  }

  if (title.includes("productivity") || unit === "EUR_KGOE") {
    return "productivity";
  }

  if (title.includes("intensity") || unit === "KGOE_TEUR") {
    return "intensity";
  }

  return "generic";
}

function buildCategoryInsightText(item, unit, chartLabel) {
  const category = getInsightCategory(chartLabel, unit);
  const name = item.name || "The selected series";
  const latestYearText = item.latestYear ? " in " + item.latestYear : "";

  if (category === "percentage") {
    return (
      name +
      " reached " +
      formatInsightNumber(item.latest) +
      " " +
      unit +
      latestYearText +
      ". The long-term change is " +
      formatSignedNumber(item.longTermChange, "percentage points") +
      "."
    );
  }

  if (category === "electricity") {
    return (
      name +
      " recorded " +
      formatInsightNumber(item.latest) +
      " " +
      unit +
      latestYearText +
      ", with a " +
      item.trendLabel +
      " long-term trend."
    );
  }

  if (category === "emissions") {
    return (
      name +
      " is the main contributor in the selected context, with " +
      formatInsightNumber(item.latest) +
      " " +
      unit +
      latestYearText +
      ". The long-term trend is " +
      item.trendLabel +
      "."
    );
  }

  if (category === "energy-volume") {
    return (
      name +
      " is the leading energy component, with " +
      formatInsightNumber(item.latest) +
      " " +
      unit +
      latestYearText +
      ". The long-term change is " +
      formatSignedNumber(item.longTermChange, unit) +
      "."
    );
  }

  if (category === "productivity") {
    return (
      name +
      " reached " +
      formatInsightNumber(item.latest) +
      " " +
      unit +
      latestYearText +
      ". A rising trend usually indicates more economic output per unit of energy."
    );
  }

  if (category === "intensity") {
    return (
      name +
      " reached " +
      formatInsightNumber(item.latest) +
      " " +
      unit +
      latestYearText +
      ". A falling trend usually indicates lower energy use per unit of output."
    );
  }

  return (
    name +
    " has a latest value of " +
    formatInsightNumber(item.latest) +
    " " +
    unit +
    latestYearText +
    " and shows a " +
    item.trendLabel +
    " trend."
  );
}

let globalInsightsMiniCharts = [];
let globalInsightsThemeDonutChart = null;

function getSparklineDirection(points) {
  if (!Array.isArray(points) || points.length < 2) return "flat";

  const first = points[0];
  const last = points[points.length - 1];
  const diff = last - first;

  if (Math.abs(diff) < 0.000001) return "flat";
  return diff > 0 ? "up" : "down";
}

function getSparklineColor(direction) {
  if (direction === "up") return "#0e8a3d";
  if (direction === "down") return "#b3263a";
  return "#5a7184";
}

function renderGlobalSparklines(summary) {
  if (typeof Highcharts === "undefined" || !Array.isArray(summary)) return;

  globalInsightsMiniCharts.forEach((chart) => {
    if (chart && typeof chart.destroy === "function") {
      chart.destroy();
    }
  });

  globalInsightsMiniCharts = [];

  summary.forEach((item) => {
    if (!item || !item.sparklineId || !Array.isArray(item.trendPoints) || item.trendPoints.length < 2) {
      return;
    }

    const direction = getSparklineDirection(item.trendPoints);

    const chart = Highcharts.chart(item.sparklineId, {
      chart: {
        animation: false,
        backgroundColor: "transparent",
        height: 32,
        margin: [2, 0, 2, 0],
        spacing: [0, 0, 0, 0],
        type: "spline"
      },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: false },
      legend: { enabled: false },
      tooltip: { enabled: false },
      accessibility: { enabled: false },
      xAxis: {
        visible: false,
        labels: { enabled: false },
        tickLength: 0,
        lineWidth: 0
      },
      yAxis: {
        visible: false,
        labels: { enabled: false },
        title: { text: null },
        gridLineWidth: 0,
        startOnTick: false,
        endOnTick: false
      },
      plotOptions: {
        series: {
          enableMouseTracking: false,
          marker: { enabled: false },
          lineWidth: 2,
          states: {
            hover: { enabled: false },
            inactive: { opacity: 1 }
          }
        }
      },
      series: [{
        data: item.trendPoints,
        color: getSparklineColor(direction)
      }]
    });

    globalInsightsMiniCharts.push(chart);
  });
}

function getInsightUnitLabel() {
  const labels = (languageNameSpace && languageNameSpace.labels) || {};
  return labels["abr_" + REF.unit] || labels[REF.unit] || REF.unit || "";
}

function getInsightTitle() {
  const labels = (languageNameSpace && languageNameSpace.labels) || {};
  const chartTitle = labels[REF.title] || REF.title || "Energy";
  const geo = labels[REF.geos] || REF.geos || "";
  const suffix = "Energy insights";

  return geo ? chartTitle + " - " + geo + " - " + suffix : chartTitle + " - " + suffix;
}

function buildInsightSeriesFromChartSeries(categories) {
  if (!Array.isArray(chartSeries)) return [];

  return chartSeries
    .map((serie) => {
      const points = getValidTimeSeriesPoints(serie.data, categories);
      const values = points.map((point) => point.value);

      if (!hasMeaningfulValues(values)) {
        return null;
      }

      const total = values.reduce((sum, value) => sum + value, 0);

      const firstPoint = points.length ? points[0] : null;
      const latestPoint = points.length ? points[points.length - 1] : null;
      const previousPoint = points.length > 1 ? points[points.length - 2] : null;

      const first = firstPoint ? firstPoint.value : null;
      const latest = latestPoint ? latestPoint.value : null;
      const previous = previousPoint ? previousPoint.value : null;

      const delta = latest != null && previous != null ? latest - previous : null;
      const longTermChange = latest != null && first != null ? latest - first : null;
      const percentChange = getPercentChange(first, latest);

      const maxPoint = points.length
        ? points.reduce((max, point) => point.value > max.value ? point : max, points[0])
        : null;

      const minPoint = points.length
        ? points.reduce((min, point) => point.value < min.value ? point : min, points[0])
        : null;

      const trendDirection = getTrendDirectionFromValues(first, latest);

      return {
        name: serie.name,
        total,
        first,
        firstYear: firstPoint ? firstPoint.year : null,
        latest,
        latestYear: latestPoint ? latestPoint.year : null,
        previous,
        previousYear: previousPoint ? previousPoint.year : null,
        delta,
        longTermChange,
        percentChange,
        maxValue: maxPoint ? maxPoint.value : null,
        maxYear: maxPoint ? maxPoint.year : null,
        minValue: minPoint ? minPoint.value : null,
        minYear: minPoint ? minPoint.year : null,
        trendDirection,
        trendLabel: getTrendLabel(trendDirection),
        data: values,
        points: points.length
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const aLatest = a.latest == null ? -Infinity : a.latest;
      const bLatest = b.latest == null ? -Infinity : b.latest;
      return bLatest - aLatest;
    });
}

function renderInsightsToChartContainer(html) {
  const targetContainerId = (codesDataset[REF.chartId] && codesDataset[REF.chartId].container) || containerId;
  const target = document.getElementById(targetContainerId);

  if (!target) return;

  target.innerHTML = html;
}

function createEnergyInsights() {
  updateREFFromCodesDataset(REF.chartId);

  const d = chartApiCall();

  if (!d) {
    renderInsightsToChartContainer('<div class="insights-page"><p class="insights-empty">No data available.</p></div>');
    return;
  }

  const timeDim = d.Dimension("time");
  const categories = timeDim ? timeDim.id : [];

  handleData(d, categories, categories);

  const insightsSeries = buildInsightSeriesFromChartSeries(categories);
  const unit = getInsightUnitLabel();

  if (!insightsSeries.length) {
    renderInsightsToChartContainer('<div class="insights-page"><p class="insights-empty">No data available.</p></div>');
    return;
  }

  const top = insightsSeries[0];
  const second = insightsSeries[1] || null;
  const story = getChartStory(REF.chartId);

  const latestLabel = top.latestYear == null
    ? "Latest value"
    : "Latest value, " + top.latestYear;

  const deltaLabel = top.previousYear == null
    ? "Change"
    : "Change since " + top.previousYear;

  const longTermLabel = top.firstYear == null
    ? "Long-term change"
    : "Change since " + top.firstYear;

  const deltaText = formatSignedNumber(top.delta, unit);
  const longTermText = formatSignedNumber(top.longTermChange, unit);
  const percentText = top.percentChange == null ? "" : " (" + formatSignedPercent(top.percentChange) + ")";

  const chartLabel = getInsightTitle();

  const summaryText =
    buildCategoryInsightText(top, unit, chartLabel) +
    (second ? " The next highest series is " + second.name + "." : "");

  const html = [
    '<section class="insights-page insights-main story-local-insight">',
    '<div class="local-story-header">',
    '<span class="story-icon">' + escapeInsightText(story.icon || "📊") + '</span>',
    '<div>',
    '<h3 class="insights-title">' + escapeInsightText(story.storyTitle || getInsightTitle()) + '</h3>',
    '<p>' + escapeInsightText(story.insightRole || getInsightTitle()) + '</p>',
    '</div>',
    '</div>',

    '<div class="insights-cards">',

    '<article class="insight-card">',
    '<div class="insight-label">' + escapeInsightText(latestLabel) + '</div>',
    '<div class="insight-value">' + formatInsightNumber(top.latest) + ' ' + escapeInsightText(unit) + '</div>',
    '<div class="insight-sub">' + escapeInsightText(getSafeDriverName(top.name)) + '</div>',
    '</article>',

    '<article class="insight-card">',
    '<div class="insight-label">' + escapeInsightText(deltaLabel) + '</div>',
    '<div class="insight-value">' + escapeInsightText(deltaText) + '</div>',
    '<div class="insight-sub">Recent annual change</div>',
    '</article>',

    '<article class="insight-card">',
    '<div class="insight-label">' + escapeInsightText(longTermLabel) + '</div>',
    '<div class="insight-value">' + escapeInsightText(longTermText + percentText) + '</div>',
    '<div class="insight-sub">' + escapeInsightText(top.trendLabel) + ' trend</div>',
    '</article>',

    '<article class="insight-card">',
    '<div class="insight-label">Highest value</div>',
    '<div class="insight-value">' + formatInsightNumber(top.maxValue) + ' ' + escapeInsightText(unit) + '</div>',
    '<div class="insight-sub">Observed in ' + escapeInsightText(top.maxYear || "-") + '</div>',
    '</article>',

    '</div>',

    '<div class="insights-summary">',
    '<strong>Summary:</strong> ' + escapeInsightText(summaryText),
    '</div>',

    '</section>'
  ].join("");

  renderInsightsToChartContainer(html);
}

function closeGlobalInsights() {
  globalInsightsMiniCharts.forEach((chart) => {
    if (chart && typeof chart.destroy === "function") {
      chart.destroy();
    }
  });

  globalInsightsMiniCharts = [];

  if (globalInsightsThemeDonutChart && typeof globalInsightsThemeDonutChart.destroy === "function") {
    globalInsightsThemeDonutChart.destroy();
  }
  globalInsightsThemeDonutChart = null;

  const overlay = document.getElementById("globalInsightsOverlay");

  if (overlay) {
    overlay.remove();
  }
}

function getMainViewChartIds() {
  return Array.from(document.querySelectorAll("#endash .chartContainer[id]"))
    .map((item) => item.id)
    .filter((id) => !!codesDataset[id]);
}

function cloneRefState() {
  const state = {};

  Object.keys(REF).forEach((key) => {
    const value = REF[key];
    state[key] = Array.isArray(value) ? value.slice() : value;
  });

  return state;
}

function restoreRefState(state, savedContainerId) {
  Object.keys(state).forEach((key) => {
    REF[key] = state[key];
  });

  containerId = savedContainerId;
}

function collectGlobalInsightsData() {
  const labels = (languageNameSpace && languageNameSpace.labels) || {};
  const chartIds = getMainViewChartIds();
  const initialState = cloneRefState();
  const savedContainerId = containerId;
  const summary = [];

  chartIds.forEach((chartId) => {
    try {
      const chartConfig = codesDataset[chartId];
      const story = getChartStory(chartId);

      updateREFFromCodesDataset(chartId);

      const d = chartApiCall();

      if (!d) return;

      const timeDim = d.Dimension("time");
      const categories = timeDim ? timeDim.id : [];

      handleData(d, categories, categories);

      const insightsSeries = buildInsightSeriesFromChartSeries(categories);

      if (!insightsSeries.length) return;

      const total = insightsSeries.reduce((sum, item) => sum + item.total, 0);
      const top = insightsSeries[0];
      const chartLabel = labels[chartConfig.title] || chartConfig.title || chartId;
      const unitLabel = getInsightUnitLabel();

      summary.push({
        chartId,
        chartLabel,
        dataset: chartConfig.dataset || "-",
        meta: chartConfig.meta || "-",
        indicatorType: chartConfig.indicator_type || "-",
        indicator2Type: chartConfig.indicator2_type || "-",
        indicatorCount: Array.isArray(chartConfig.indicator) ? chartConfig.indicator.length : 0,
        unitLabel,

        storyGroup: story.group || "other",
        storyTitle: story.storyTitle || chartLabel,
        storyIcon: story.icon || "📊",
        insightRole: story.insightRole || "Additional indicator in the current view.",
        preferredMetric: story.preferredMetric || "generic",
        sentiment: story.sentiment || "neutral",

        total,
        topName: top ? top.name : "-",
        topLatest: top ? top.latest : null,
        topDelta: top ? top.delta : null,
        topLongTermChange: top ? top.longTermChange : null,
        topPercentChange: top ? top.percentChange : null,
        topShare: top && total ? (top.total / total) * 100 : null,
        seriesCount: insightsSeries.length,
        trendPoints: top && Array.isArray(top.data) ? top.data.slice(-20) : [],
        latestYear: top ? top.latestYear : null,
        trendDirection: top ? top.trendDirection : "flat",
        trendLabel: top ? top.trendLabel : "stable",
        seriesSummary: insightsSeries.slice(0, 8).map((item) => ({
          name: item.name,
          latest: item.latest,
          latestYear: item.latestYear,
          first: item.first,
          firstYear: item.firstYear,
          longTermChange: item.longTermChange,
          percentChange: item.percentChange,
          minValue: item.minValue,
          minYear: item.minYear,
          maxValue: item.maxValue,
          maxYear: item.maxYear,
          trendDirection: item.trendDirection,
          trendLabel: item.trendLabel
        }))
      });
    } catch (err) {
      // Ignore broken chart payloads so one chart does not block the global summary.
    }
  });

  restoreRefState(initialState, savedContainerId);

  return summary.sort((a, b) => {
    const groupA = insightGroups[a.storyGroup] || insightGroups.other;
    const groupB = insightGroups[b.storyGroup] || insightGroups.other;

    if (groupA.order !== groupB.order) {
      return groupA.order - groupB.order;
    }

    return String(a.storyTitle || "").localeCompare(String(b.storyTitle || ""));
  });
}

function groupSummaryByUnit(summary) {
  return summary.reduce((acc, item) => {
    const unit = item.unitLabel || "Unknown unit";

    if (!acc[unit]) acc[unit] = [];
    acc[unit].push(item);

    return acc;
  }, {});
}

function buildMiniBar(label, value, maxValue, className) {
  const width = maxValue > 0 ? Math.max(4, Math.round((value / maxValue) * 100)) : 0;

  return [
    '<div class="insight-mini-bar">',
    '<span class="mini-bar-label" title="' + escapeInsightText(label) + '">' + escapeInsightText(label) + '</span>',
    '<span class="mini-bar-track">',
    '<span class="mini-bar-fill ' + escapeInsightText(className || "") + '" style="width:' + width + '%"></span>',
    '</span>',
    '<strong>' + formatInsightNumber(value) + '</strong>',
    '</div>'
  ].join("");
}

function getDirectionAssessment(item) {
  const sentiment = item.sentiment || "neutral";
  const direction = item.trendDirection || "flat";

  if (sentiment === "neutral" || sentiment === "contextual") {
    return "contextual";
  }

  if (direction === "flat") {
    return "stable";
  }

  if (sentiment === "higher-is-better") {
    return direction === "up" ? "favourable" : "unfavourable";
  }

  if (sentiment === "lower-is-better") {
    return direction === "down" ? "favourable" : "unfavourable";
  }

  return "contextual";
}

function buildStackedBar(items, classPrefix) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;

  const segments = items.map((item) => {
    const width = item.value > 0 ? Math.max(2, Math.round((item.value / total) * 100)) : 0;

    return [
      '<span class="' + escapeInsightText(classPrefix + "-" + item.key) + '"',
      ' style="width:' + width + '%"',
      ' title="' + escapeInsightText(item.label + ": " + item.value) + '">',
      '</span>'
    ].join("");
  }).join("");

  const legend = items.map((item) => {
    return [
      '<span class="stacked-legend-item">',
      '<i class="' + escapeInsightText(classPrefix + "-" + item.key) + '"></i>',
      escapeInsightText(item.label) + ' <strong>' + item.value + '</strong>',
      '</span>'
    ].join("");
  }).join("");

  return [
    '<div class="stacked-chart">',
    '<div class="stacked-track">' + segments + '</div>',
    '<div class="stacked-legend">' + legend + '</div>',
    '</div>'
  ].join("");
}

function buildTrendStackedBlock(summary) {
  const rising = summary.filter((item) => item.trendDirection === "up").length;
  const falling = summary.filter((item) => item.trendDirection === "down").length;
  const stable = summary.filter((item) => item.trendDirection === "flat").length;

  return [
    '<section class="insight-infographic-block">',
    '<div class="infographic-block-head">',
    '<h4>Trend direction</h4>',
    '<p>Direction of the leading series across visible charts.</p>',
    '</div>',
    buildStackedBar([
      { key: "up", label: "Rising", value: rising },
      { key: "down", label: "Falling", value: falling },
      { key: "flat", label: "Stable", value: stable }
    ], "trend-segment"),
    '</section>'
  ].join("");
}

function buildPolicyDirectionBlock(summary) {
  const favourable = summary.filter((item) => getDirectionAssessment(item) === "favourable").length;
  const unfavourable = summary.filter((item) => getDirectionAssessment(item) === "unfavourable").length;
  const stable = summary.filter((item) => getDirectionAssessment(item) === "stable").length;
  const contextual = summary.filter((item) => getDirectionAssessment(item) === "contextual").length;

  return [
    '<section class="insight-infographic-block">',
    '<div class="infographic-block-head">',
    '<h4>Policy direction</h4>',
    '<p>Trend direction interpreted according to the indicator role.</p>',
    '</div>',
    buildStackedBar([
      { key: "good", label: "Favourable", value: favourable },
      { key: "bad", label: "Unfavourable", value: unfavourable },
      { key: "stable", label: "Stable", value: stable },
      { key: "neutral", label: "Contextual", value: contextual }
    ], "policy-segment"),
    '</section>'
  ].join("");
}

function buildDatasetCoverageBlock(summary) {
  const datasetMap = {};

  summary.forEach((item) => {
    const dataset = item.dataset || "Unknown dataset";
    datasetMap[dataset] = (datasetMap[dataset] || 0) + 1;
  });

  const datasets = Object.keys(datasetMap)
    .map((name) => ({
      name,
      count: datasetMap[name]
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const maxValue = Math.max.apply(null, datasets.map((item) => item.count).concat([1]));

  const bars = datasets
    .map((item) => buildMiniBar(item.name, item.count, maxValue, "is-dataset"))
    .join("");

  return [
    '<section class="insight-infographic-block">',
    '<div class="infographic-block-head">',
    '<h4>Dataset coverage</h4>',
    '<p>Eurostat datasets contributing to the current view.</p>',
    '</div>',
    bars,
    '</section>'
  ].join("");
}

function buildInsightAlerts(summary) {
  const missingDrivers = summary.filter((item) => !hasUsableDriverName(item.topName));
  const missingLatest = summary.filter((item) => item.topLatest == null);
  const unfavourable = summary.filter((item) => getDirectionAssessment(item) === "unfavourable");

  const latestYears = summary
    .map((item) => Number(item.latestYear))
    .filter((year) => !Number.isNaN(year));

  const latestYearMax = latestYears.length ? Math.max.apply(null, latestYears) : null;

  const olderData = latestYearMax == null
    ? []
    : summary.filter((item) => {
      const year = Number(item.latestYear);
      return !Number.isNaN(year) && year < latestYearMax - 1;
    });

  const alerts = [];

  if (missingDrivers.length) {
    alerts.push(missingDrivers.length + " charts have no clear top driver.");
  }

  if (missingLatest.length) {
    alerts.push(missingLatest.length + " charts have no latest value available.");
  }

  if (unfavourable.length) {
    alerts.push(unfavourable.length + " indicators move in an unfavourable direction based on their interpretation rule.");
  }

  if (olderData.length) {
    alerts.push(olderData.length + " charts have latest data older than the newest year in this view.");
  }

  if (!alerts.length) {
    alerts.push("No major data quality or interpretation alerts detected.");
  }

  return [
    '<section class="insight-alert-panel">',
    '<h4>Data and interpretation alerts</h4>',
    '<ul>',
    alerts.map((alert) => '<li>' + escapeInsightText(alert) + '</li>').join(""),
    '</ul>',
    '</section>'
  ].join("");
}

function buildTrendBalanceBlock(summary) {
  const rising = summary.filter((item) => item.trendDirection === "up").length;
  const falling = summary.filter((item) => item.trendDirection === "down").length;
  const stable = summary.filter((item) => item.trendDirection === "flat").length;
  const maxValue = Math.max(rising, falling, stable, 1);

  return [
    '<section class="insight-infographic-block">',
    '<div class="infographic-block-head">',
    '<h4>Trend balance</h4>',
    '<p>Direction of the leading series in visible charts.</p>',
    '</div>',
    buildMiniBar("Rising", rising, maxValue, "is-up"),
    buildMiniBar("Falling", falling, maxValue, "is-down"),
    buildMiniBar("Stable", stable, maxValue, "is-flat"),
    '</section>'
  ].join("");
}

function buildUnitDistributionBlock(summary) {
  const grouped = groupSummaryByUnit(summary);
  const units = Object.keys(grouped).sort();
  const maxValue = Math.max.apply(null, units.map((unit) => grouped[unit].length).concat([1]));

  const bars = units
    .map((unit) => buildMiniBar(unit, grouped[unit].length, maxValue, "is-neutral"))
    .join("");

  return [
    '<section class="insight-infographic-block">',
    '<div class="infographic-block-head">',
    '<h4>Units in current view</h4>',
    '<p>Charts are grouped by their original unit.</p>',
    '</div>',
    bars,
    '</section>'
  ].join("");
}

function buildTopDriversBlock(summary) {
  const driverMap = {};

  summary.forEach((item) => {
    const key = String(item.topName || "").trim();
    if (!key || key === "-") return;
    driverMap[key] = (driverMap[key] || 0) + 1;
  });

  const drivers = Object.keys(driverMap)
    .map((name) => ({ name, count: driverMap[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const maxValue = Math.max.apply(null, drivers.map((driver) => driver.count).concat([1]));

  const bars = drivers.length
    ? drivers.map((driver) => buildMiniBar(driver.name, driver.count, maxValue, "is-driver")).join("")
    : '<p class="insights-empty">No leading drivers available.</p>';

  return [
    '<section class="insight-infographic-block">',
    '<div class="infographic-block-head">',
    '<h4>Most frequent top drivers</h4>',
    '<p>Leading series appearing most often across visible charts.</p>',
    '</div>',
    bars,
    '</section>'
  ].join("");
}

function buildCategoryDistributionBlock(summary) {
  const categoryLabels = {
    headline: "Headline indicators",
    security: "Security and dependency",
    supply: "Energy supply",
    consumption: "Consumption",
    transport: "Transport",
    industry: "Industry",
    electricity: "Electricity",
    environment: "Environment",
    performance: "Performance",
    households: "Households",
    social: "Social",
    market: "Market",
    context: "Context",
    other: "Other"
  };

  const categoryMap = {};

  summary.forEach((item) => {
    const category = item.storyGroup || "other";
    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });

  const categories = Object.keys(categoryMap)
    .map((category) => ({
      category,
      label: categoryLabels[category] || category,
      count: categoryMap[category]
    }))
    .sort((a, b) => {
      const groupA = insightGroups[a.category] || insightGroups.other;
      const groupB = insightGroups[b.category] || insightGroups.other;
      return groupA.order - groupB.order;
    });

  const maxValue = Math.max.apply(null, categories.map((item) => item.count).concat([1]));

  const bars = categories
    .map((item) => buildMiniBar(item.label, item.count, maxValue, "is-category"))
    .join("");

  return [
    '<section class="insight-infographic-block">',
    '<div class="infographic-block-head">',
    '<h4>Story themes</h4>',
    '<p>Visible charts grouped by analytical theme.</p>',
    '</div>',
    bars,
    '</section>'
  ].join("");
}

function buildGlobalTakeaways(summary) {
  const uniqueUnits = new Set(summary.map((item) => item.unitLabel || "Unknown unit")).size;
  const uniqueDatasets = new Set(summary.map((item) => item.dataset || "Unknown dataset")).size;

  const latestYears = summary
    .map((item) => Number(item.latestYear))
    .filter((year) => !Number.isNaN(year));

  const latestYearMin = latestYears.length ? Math.min.apply(null, latestYears) : null;
  const latestYearMax = latestYears.length ? Math.max.apply(null, latestYears) : null;

  const favourable = summary.filter((item) => getDirectionAssessment(item) === "favourable").length;
  const unfavourable = summary.filter((item) => getDirectionAssessment(item) === "unfavourable").length;
  const contextual = summary.filter((item) => getDirectionAssessment(item) === "contextual").length;

  const policyDirectionText = favourable > unfavourable
    ? "More interpretable indicators move in a favourable direction than an unfavourable one."
    : unfavourable > favourable
      ? "More interpretable indicators move in an unfavourable direction than a favourable one."
      : "Favourable and unfavourable movements are balanced among interpretable indicators.";

  return [
    '<section class="insight-takeaways">',
    '<h4>Key takeaways</h4>',
    '<ul>',
    '<li>' + summary.length + ' charts are analysed in the current view.</li>',
    '<li>' + uniqueDatasets + ' Eurostat datasets and ' + uniqueUnits + ' units are present.</li>',
    '<li>Cross-chart totals should not be compared directly because units differ.</li>',
    '<li>' + escapeInsightText(policyDirectionText) + '</li>',
    '<li>' + contextual + ' charts are contextual indicators where direction should not be judged as good or bad automatically.</li>',
    '<li>Latest available years range from ' +
      (latestYearMin && latestYearMax ? latestYearMin + ' to ' + latestYearMax : 'not available') +
      '.</li>',
    '</ul>',
    '</section>'
  ].join("");
}

function buildDataCoveragePanel(summary) {
  const datasetMap = {};
  const metaMap = {};
  const unitMap = {};

  summary.forEach((item) => {
    datasetMap[item.dataset || "Unknown dataset"] = (datasetMap[item.dataset || "Unknown dataset"] || 0) + 1;
    metaMap[item.meta || "Unknown metadata"] = (metaMap[item.meta || "Unknown metadata"] || 0) + 1;
    unitMap[item.unitLabel || "Unknown unit"] = (unitMap[item.unitLabel || "Unknown unit"] || 0) + 1;
  });

  return [
    '<section class="data-coverage-panel">',
    '<div>',
    '<h3>Data coverage</h3>',
    '<p>The current view combines multiple Eurostat datasets, indicator groups and units.</p>',
    '</div>',
    '<div class="coverage-kpis">',
    '<article><span>Charts</span><strong>' + summary.length + '</strong></article>',
    '<article><span>Datasets</span><strong>' + Object.keys(datasetMap).length + '</strong></article>',
    '<article><span>Metadata groups</span><strong>' + Object.keys(metaMap).length + '</strong></article>',
    '<article><span>Units</span><strong>' + Object.keys(unitMap).length + '</strong></article>',
    '</div>',
    '</section>'
  ].join("");
}

function getThemeLabelFromGroup(group) {
  const map = {
    headline: "Headline policy indicators",
    security: "Security",
    supply: "Supply",
    consumption: "Consumption",
    transport: "Transport",
    electricity: "Electricity",
    environment: "Environment",
    social: "Social",
    market: "Market"
  };

  return map[group] || "Other";
}

function buildThemeDistributionData(summary) {
  const counts = {};

  summary.forEach((item) => {
    const label = getThemeLabelFromGroup(item.storyGroup);
    counts[label] = (counts[label] || 0) + 1;
  });

  return Object.keys(counts)
    .map((label) => ({ name: label, y: counts[label] }))
    .sort((a, b) => b.y - a.y);
}

function buildThemeDonutBlock(summary) {
  const totalThemes = buildThemeDistributionData(summary).length;

  return [
    '<section class="insight-infographic-block theme-donut-card">',
    '<div class="infographic-block-head">',
    '<h4>Theme distribution</h4>',
    '<p>How visible charts are distributed across dashboard themes.</p>',
    '</div>',
    '<div id="themeDistributionDonut" class="theme-donut"></div>',
    '<p class="global-insights-note">',
    totalThemes + ' themes represented in this view.',
    '</p>',
    '</section>'
  ].join("");
}

function renderThemeDonut(summary) {
  if (typeof Highcharts === "undefined") return;

  if (globalInsightsThemeDonutChart && typeof globalInsightsThemeDonutChart.destroy === "function") {
    globalInsightsThemeDonutChart.destroy();
  }

  const container = document.getElementById("themeDistributionDonut");
  if (!container) return;

  const donutData = buildThemeDistributionData(summary);

  globalInsightsThemeDonutChart = Highcharts.chart("themeDistributionDonut", {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      height: 280,
      spacing: [0, 0, 0, 0]
    },
    title: { text: null },
    credits: { enabled: false },
    exporting: { enabled: false },
    tooltip: {
      pointFormat: "<b>{point.y}</b> charts ({point.percentage:.1f}%)"
    },
    accessibility: { enabled: false },
    plotOptions: {
      pie: {
        innerSize: "62%",
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.y}",
          style: {
            fontSize: "10px",
            textOutline: "none"
          }
        },
        showInLegend: false
      }
    },
    series: [{
      data: donutData
    }]
  });
}

function buildThemeMiniSummaries(summary) {
  const grouped = summary.reduce((acc, item) => {
    const label = getThemeLabelFromGroup(item.storyGroup);
    if (!acc[label]) {
      acc[label] = { total: 0, up: 0, down: 0, flat: 0 };
    }

    acc[label].total += 1;
    acc[label][item.trendDirection === "up" ? "up" : item.trendDirection === "down" ? "down" : "flat"] += 1;

    return acc;
  }, {});

  const cards = Object.keys(grouped)
    .map((label) => ({ label, stats: grouped[label] }))
    .sort((a, b) => b.stats.total - a.stats.total)
    .slice(0, 9)
    .map((entry) => {
      return [
        '<article class="theme-summary-card">',
        '<h5>' + escapeInsightText(entry.label) + '</h5>',
        '<p>' + entry.stats.total + ' charts</p>',
        '<small>' + entry.stats.up + ' rising · ' + entry.stats.down + ' falling · ' + entry.stats.flat + ' stable</small>',
        '</article>'
      ].join("");
    })
    .join("");

  return [
    '<section class="insight-infographic-block">',
    '<div class="infographic-block-head">',
    '<h4>Theme-level mini summaries</h4>',
    '<p>Quick trend distribution per dashboard theme.</p>',
    '</div>',
    '<div class="theme-mini-summaries">' + cards + '</div>',
    '</section>'
  ].join("");
}

function buildPolicyAlertsByGroup(summary) {
  const grouped = summary.reduce((acc, item) => {
    const group = getThemeLabelFromGroup(item.storyGroup);
    if (!acc[group]) {
      acc[group] = { favourable: 0, unfavourable: 0, stable: 0, contextual: 0 };
    }

    const assessment = getDirectionAssessment(item);
    if (assessment === "favourable") acc[group].favourable += 1;
    if (assessment === "unfavourable") acc[group].unfavourable += 1;
    if (assessment === "stable") acc[group].stable += 1;
    if (assessment === "contextual") acc[group].contextual += 1;

    return acc;
  }, {});

  const alerts = Object.keys(grouped)
    .map((label) => {
      const stat = grouped[label];
      if (stat.unfavourable > stat.favourable) {
        return label + ': ' + stat.unfavourable + ' unfavourable vs ' + stat.favourable + ' favourable indicators.';
      }
      return null;
    })
    .filter(Boolean);

  if (!alerts.length) {
    alerts.push('No theme currently has more unfavourable than favourable interpreted indicators.');
  }

  return [
    '<section class="insight-alert-panel">',
    '<h4>Policy alerts by theme</h4>',
    '<ul>',
    alerts.map((alert) => '<li>' + escapeInsightText(alert) + '</li>').join(''),
    '</ul>',
    '</section>'
  ].join("");
}

function buildLatestCoverageTimeline(summary) {
  const yearMap = {};

  summary.forEach((item) => {
    const year = Number(item.latestYear);
    if (!Number.isNaN(year)) {
      yearMap[year] = (yearMap[year] || 0) + 1;
    }
  });

  const years = Object.keys(yearMap)
    .map((year) => Number(year))
    .sort((a, b) => a - b);

  if (!years.length) {
    return [
      '<section class="insight-infographic-block coverage-timeline">',
      '<div class="infographic-block-head">',
      '<h4>Latest data coverage timeline</h4>',
      '<p>No latest-year information available for visible charts.</p>',
      '</div>',
      '</section>'
    ].join('');
  }

  const maxValue = Math.max.apply(null, years.map((year) => yearMap[year]).concat([1]));

  const rows = years.map((year) => {
    return buildMiniBar(String(year), yearMap[year], maxValue, "is-neutral");
  }).join("");

  return [
    '<section class="insight-infographic-block coverage-timeline">',
    '<div class="infographic-block-head">',
    '<h4>Latest data coverage timeline</h4>',
    '<p>How many charts have their latest observation in each year.</p>',
    '</div>',
    rows,
    '</section>'
  ].join('');
}

function buildSeriesBreakdownBars(item) {
  if (!Array.isArray(item.seriesSummary) || !item.seriesSummary.length) {
    return "";
  }

  const validSeries = item.seriesSummary
    .filter((serie) => serie.latest != null && !Number.isNaN(serie.latest))
    .slice(0, 5);

  if (!validSeries.length) {
    return "";
  }

  const maxValue = Math.max.apply(
    null,
    validSeries.map((serie) => Math.abs(serie.latest)).concat([1])
  );

  const bars = validSeries.map((serie) => {
    const width = Math.max(4, Math.round((Math.abs(serie.latest) / maxValue) * 100));

    return [
      '<div class="story-breakdown-row">',
      '<span class="story-breakdown-label" title="' + escapeInsightText(serie.name || "-") + '">' +
        escapeInsightText(serie.name || "-") +
      '</span>',
      '<span class="story-breakdown-track">',
      '<span class="story-breakdown-fill" style="width:' + width + '%"></span>',
      '</span>',
      '<strong>' + formatInsightNumber(serie.latest) + ' ' + escapeInsightText(item.unitLabel || "") + '</strong>',
      '</div>'
    ].join("");
  }).join("");

  return [
    '<div class="story-breakdown">',
    '<p class="story-card-section-title">Latest breakdown</p>',
    bars,
    '</div>'
  ].join("");
}

function buildStoryCardDeepFacts(item) {
  const mainSeries = Array.isArray(item.seriesSummary) && item.seriesSummary.length
    ? item.seriesSummary[0]
    : null;

  if (!mainSeries) return "";

  return [
    '<div class="story-deep-facts">',
    '<div>',
    '<span>First value</span>',
    '<strong>' +
      formatInsightNumber(mainSeries.first) +
      ' ' +
      escapeInsightText(item.unitLabel || "") +
    '</strong>',
    '<small>' + escapeInsightText(mainSeries.firstYear || "-") + '</small>',
    '</div>',

    '<div>',
    '<span>Peak value</span>',
    '<strong>' +
      formatInsightNumber(mainSeries.maxValue) +
      ' ' +
      escapeInsightText(item.unitLabel || "") +
    '</strong>',
    '<small>' + escapeInsightText(mainSeries.maxYear || "-") + '</small>',
    '</div>',

    '<div>',
    '<span>Lowest value</span>',
    '<strong>' +
      formatInsightNumber(mainSeries.minValue) +
      ' ' +
      escapeInsightText(item.unitLabel || "") +
    '</strong>',
    '<small>' + escapeInsightText(mainSeries.minYear || "-") + '</small>',
    '</div>',
    '</div>'
  ].join("");
}

function buildStoryInterpretation(item) {
  const metric = item.preferredMetric || "generic";
  const topDriver = getSafeDriverName(item.topName);
  const unit = item.unitLabel || "";
  const latest = item.topLatest == null ? "-" : formatInsightNumber(item.topLatest) + " " + unit;
  const year = item.latestYear || "-";

  if (metric === "percentage-point-change") {
    return (
      topDriver +
      " is the leading component in " +
      year +
      ". The latest value is " +
      latest +
      ", with a long-term change of " +
      formatSignedNumber(item.topLongTermChange, "percentage points") +
      "."
    );
  }

  if (metric === "dependency-risk") {
    return (
      topDriver +
      " has the highest dependency value in the selected view. Latest value: " +
      latest +
      " in " +
      year +
      "."
    );
  }

  if (metric === "top-driver-and-share") {
    return (
      topDriver +
      " is the leading component. Latest value: " +
      latest +
      " in " +
      year +
      "."
    );
  }

  if (metric === "top-driver-and-trend") {
    return (
      topDriver +
      " is the leading component and shows a " +
      item.trendLabel +
      " long-term trend. Latest value: " +
      latest +
      " in " +
      year +
      "."
    );
  }

  if (metric === "generation-mix") {
    return (
      topDriver +
      " is the leading electricity or heat source. Latest value: " +
      latest +
      " in " +
      year +
      "."
    );
  }

  if (metric === "social-risk") {
    return (
      "The latest value is " +
      latest +
      " in " +
      year +
      ". Lower values generally indicate better living conditions."
    );
  }

  if (metric === "market-structure") {
    return (
      "The latest market indicator value is " +
      latest +
      " in " +
      year +
      ". This indicator should be interpreted together with the market structure definition."
    );
  }

  if (metric === "latest-and-change") {
    return (
      "The latest value is " +
      latest +
      " in " +
      year +
      ", with a long-term change of " +
      formatSignedNumber(item.topLongTermChange, unit) +
      "."
    );
  }

  return (
    "The leading series is " +
    topDriver +
    ", with a latest value of " +
    latest +
    " in " +
    year +
    "."
  );
}

function buildStoryCard(item) {
  const trendClass = item.trendDirection === "up"
    ? "is-up"
    : item.trendDirection === "down"
      ? "is-down"
      : "is-flat";

  const sparklineId = "storySparkline_" + String(item.chartId || "chart").replace(/[^a-zA-Z0-9_-]/g, "");
  item.sparklineId = sparklineId;

  const latestText = item.topLatest == null
    ? "No latest value"
    : formatInsightNumber(item.topLatest) + " " + item.unitLabel;

  const changeText = item.topLongTermChange == null
    ? "Change not available"
    : formatSignedNumber(item.topLongTermChange, item.unitLabel);

  return [
    '<article class="story-card story-group-' + escapeInsightText(item.storyGroup) + '">',

    '<div class="story-card-header">',
    '<span class="story-icon">' + escapeInsightText(item.storyIcon) + '</span>',
    '<div>',
    '<h4>' + escapeInsightText(item.storyTitle) + '</h4>',
    '<p>' + escapeInsightText(item.insightRole) + '</p>',
    '</div>',
    '</div>',

    '<div class="story-card-sparkline">',
    item.trendPoints && item.trendPoints.length > 1
      ? '<div class="global-sparkline-hc" id="' + sparklineId + '"></div>'
      : '<span class="global-sparkline-empty">No trend line</span>',
    '</div>',

    '<div class="story-card-kpis">',
    '<div>',
    '<span>Latest</span>',
    '<strong>' + escapeInsightText(latestText) + '</strong>',
    '<small>' + escapeInsightText(item.latestYear || "-") + '</small>',
    '</div>',
    '<div>',
    '<span>Long-term change</span>',
    '<strong>' + escapeInsightText(changeText) + '</strong>',
    '<small>' + escapeInsightText(item.trendLabel || "-") + '</small>',
    '</div>',
    '</div>',

    buildStoryCardDeepFacts(item),

    buildSeriesBreakdownBars(item),

    '<div class="story-interpretation">',
    '<p>' + escapeInsightText(buildStoryInterpretation(item)) + '</p>',
    '</div>',

    '<div class="story-card-footer">',
    '<span>Top driver: ' + escapeInsightText(getSafeDriverName(item.topName)) + '</span>',
    '<span class="global-trend ' + trendClass + '">' + escapeInsightText(item.trendLabel) + '</span>',
    '</div>',

    '</article>'
  ].join("");
}

function buildStoryGroupSections(summary) {
  const grouped = summary.reduce((acc, item) => {
    const group = item.storyGroup || "other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return Object.keys(grouped)
    .sort((a, b) => {
      const groupA = insightGroups[a] || insightGroups.other;
      const groupB = insightGroups[b] || insightGroups.other;
      return groupA.order - groupB.order;
    })
    .map((groupKey) => {
      const group = insightGroups[groupKey] || insightGroups.other;
      const items = grouped[groupKey];

      const rising = items.filter((item) => item.trendDirection === "up").length;
      const falling = items.filter((item) => item.trendDirection === "down").length;
      const stable = items.filter((item) => item.trendDirection === "flat").length;
      const cards = items.map(buildStoryCard).join("");

      return [
        '<section class="story-group-section" style="--story-color:' + escapeInsightText(group.color) + '">',
        '<div class="story-group-header">',
        '<div>',
        '<h3>' + escapeInsightText(group.title) + '</h3>',
        '<p>' + escapeInsightText(group.description) + '</p>',
        '</div>',
        '<div class="story-group-stats">',
        '<span><strong>' + items.length + '</strong> charts</span>',
        '<span><strong>' + rising + '</strong> rising</span>',
        '<span><strong>' + falling + '</strong> falling</span>',
        '<span><strong>' + stable + '</strong> stable</span>',
        '</div>',
        '</div>',
        '<div class="story-card-grid">',
        cards,
        '</div>',
        '</section>'
      ].join("");
    })
    .join("");
}

function buildEvidenceRows(summary) {
  return summary.map((item, index) => {
    const group = insightGroups[item.storyGroup] || insightGroups.other;

    return [
      '<tr>',
      '<td>' + (index + 1) + '</td>',
      '<td>' + escapeInsightText(group.title) + '</td>',
      '<td>' + escapeInsightText(item.storyTitle || item.chartLabel) + '</td>',
      '<td>' + escapeInsightText(item.dataset || "-") + '</td>',
      '<td>' + escapeInsightText(item.meta || "-") + '</td>',
      '<td>' + escapeInsightText(item.unitLabel || "-") + '</td>',
      '<td>' + escapeInsightText(getSafeDriverName(item.topName)) + '</td>',
      '<td>' + (item.topLatest == null ? "-" : formatInsightNumber(item.topLatest) + " " + escapeInsightText(item.unitLabel)) + '</td>',
      '<td>' + escapeInsightText(item.trendLabel || "-") + '</td>',
      '</tr>'
    ].join("");
  }).join("");
}

function injectInsightsStoryStyles() {
  if (document.getElementById("insightsStoryStyles")) return;

  const style = document.createElement("style");
  style.id = "insightsStoryStyles";
  style.textContent = `
    .story-hero {
      background: linear-gradient(135deg, #eef6ff 0%, #f8fbff 100%);
      border: 1px solid #d8e8fb;
      border-radius: 16px;
      padding: 1.25rem;
      margin-bottom: 1rem;
    }

    .story-hero h2 {
      margin: 0.25rem 0;
      font-size: 1.5rem;
      line-height: 1.2;
    }

    .data-coverage-panel,
    .story-group-section,
    .insight-infographic-block,
    .insight-takeaways {
      background: #fff;
      border: 1px solid #e3e7ed;
      border-radius: 16px;
      padding: 1rem;
      margin-top: 1rem;
    }

    .data-coverage-panel {
      display: grid;
      grid-template-columns: 1.2fr 2fr;
      gap: 1rem;
      align-items: center;
    }

    .data-coverage-panel h3,
    .story-group-header h3,
    .insight-takeaways h4,
    .infographic-block-head h4 {
      margin: 0;
    }

    .data-coverage-panel p,
    .story-group-header p,
    .infographic-block-head p,
    .story-card p {
      color: #5a7184;
      margin: 0.25rem 0 0;
    }

    .coverage-kpis {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.75rem;
    }

    .coverage-kpis article {
      background: #f7f9fc;
      border-radius: 12px;
      padding: 0.75rem;
    }

    .coverage-kpis span,
    .story-card-kpis span,
    .story-card-kpis small {
      display: block;
      color: #5a7184;
      font-size: 0.78rem;
    }

    .coverage-kpis strong {
      display: block;
      margin-top: 0.25rem;
      font-size: 1.5rem;
    }

    .story-overview-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .insight-mini-bar {
      display: grid;
      grid-template-columns: minmax(120px, 1fr) 2fr auto;
      align-items: center;
      gap: 0.75rem;
      margin: 0.5rem 0;
    }

    .mini-bar-label {
      font-size: 0.875rem;
      color: #243b53;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mini-bar-track {
      height: 8px;
      background: #edf2f7;
      border-radius: 999px;
      overflow: hidden;
    }

    .mini-bar-fill {
      display: block;
      height: 100%;
      border-radius: 999px;
      background: #5a7184;
    }

    .mini-bar-fill.is-up { background: #0e8a3d; }
    .mini-bar-fill.is-down { background: #b3263a; }
    .mini-bar-fill.is-flat,
    .mini-bar-fill.is-neutral { background: #5a7184; }
    .mini-bar-fill.is-driver { background: #1f6fba; }
    .mini-bar-fill.is-category { background: #6b4eff; }

    .story-group-section {
      border-top: 4px solid var(--story-color, #718096);
    }

    .story-group-header {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .story-group-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: flex-end;
      align-content: flex-start;
    }

    .story-group-stats span {
      background: #f7f9fc;
      border-radius: 999px;
      padding: 0.35rem 0.6rem;
      font-size: 0.8rem;
      white-space: nowrap;
    }

    .story-card-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
    }

    .story-card {
      background: #fbfcfe;
      border: 1px solid #e8edf5;
      border-radius: 14px;
      padding: 0.9rem;
    }

    .story-card-header,
    .local-story-header {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
    }

    .story-icon {
      min-width: 2rem;
      width: 2rem;
      height: 2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #eef2f7;
      border-radius: 999px;
      font-size: 1.1rem;
    }

    .story-card h4 {
      margin: 0;
      font-size: 0.95rem;
    }

    .story-card-sparkline {
      margin-top: 0.75rem;
      min-height: 32px;
    }

    .story-card-kpis {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .story-card-kpis div {
      background: #fff;
      border-radius: 10px;
      padding: 0.6rem;
    }

    .story-card-kpis strong {
      display: block;
      margin: 0.2rem 0;
      font-size: 0.95rem;
    }

    .story-card-footer {
      margin-top: 0.75rem;
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      align-items: center;
      font-size: 0.8rem;
    }

    .insight-takeaways ul {
      margin: 0.75rem 0 0;
      padding-left: 1.25rem;
    }

    .insight-takeaways li {
      margin-bottom: 0.35rem;
    }

    .story-local-insight .local-story-header {
      margin-bottom: 1rem;
    }

    @media (max-width: 900px) {
      .data-coverage-panel,
      .coverage-kpis,
      .story-overview-grid,
      .story-card-grid,
      .story-card-kpis {
        grid-template-columns: 1fr;
      }

      .story-group-header {
        flex-direction: column;
      }

      .story-group-stats {
        justify-content: flex-start;
      }

      .insight-mini-bar {
        grid-template-columns: 1fr;
        gap: 0.35rem;
      }
    }
  `;

  document.head.appendChild(style);
}

function openGlobalInsights() {
  if (REF.chartExpanded) return;

  closeGlobalInsights();
  injectInsightsStoryStyles();

  const labels = (languageNameSpace && languageNameSpace.labels) || {};
  const title = labels.GLOBAL_INSIGHTS || "Global insights";

  const html = [
    '<div id="globalInsightsOverlay" class="global-insights-overlay" role="dialog" aria-modal="true">',
    '<div class="global-insights-panel">',
    '<div class="global-insights-header">',
    '<h3 class="insights-title">' + escapeInsightText(title) + '</h3>',
    '<button type="button" class="global-insights-close ecl-button ecl-button--secondary" onclick="closeGlobalInsights()">' + escapeInsightText(labels.CLOSE || "Close") + '</button>',
    '</div>',
    '<div id="globalInsightsBody" class="global-insights-loading">',
    '<div class="global-insights-spinner" aria-hidden="true"></div>',
    '<p>' + escapeInsightText(labels.LOADING || "Loading insights...") + '</p>',
    '</div>',
    '</div>',
    '</div>'
  ].join("");

  document.body.insertAdjacentHTML("beforeend", html);

  const overlay = document.getElementById("globalInsightsOverlay");

  if (!overlay) return;

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeGlobalInsights();
    }
  });

  document.addEventListener("keydown", function globalInsightsEscHandler(event) {
    const currentOverlay = document.getElementById("globalInsightsOverlay");

    if (!currentOverlay) {
      document.removeEventListener("keydown", globalInsightsEscHandler);
      return;
    }

    if (event.key === "Escape") {
      closeGlobalInsights();
      document.removeEventListener("keydown", globalInsightsEscHandler);
    }
  });

  setTimeout(function () {
    const body = document.getElementById("globalInsightsBody");

    if (!body) return;

    try {
      const summary = collectGlobalInsightsData();
      const rows = buildEvidenceRows(summary);

      body.innerHTML = summary.length
        ? [
            '<section class="global-insights-hero story-hero">',
            '<p class="global-insights-kicker">Energy dashboard overview</p>',
            '<h2>Energy indicators at a glance</h2>',
            '<p class="global-insights-text">This view summarises the visible charts using Eurostat datasets, indicator groups and units. Values keep their original units and should not be compared directly across different units.</p>',
            '</section>',

            buildDataCoveragePanel(summary),

            buildThemeDonutBlock(summary),

            buildLatestCoverageTimeline(summary),

            buildThemeMiniSummaries(summary),

            '<section class="story-overview-grid">',
            buildTrendStackedBlock(summary),
            buildPolicyDirectionBlock(summary),
            buildUnitDistributionBlock(summary),
            buildDatasetCoverageBlock(summary),
            buildTopDriversBlock(summary),
            buildCategoryDistributionBlock(summary),
            '</section>',

            buildPolicyAlertsByGroup(summary),

            buildInsightAlerts(summary),

            buildGlobalTakeaways(summary),

            buildStoryGroupSections(summary),

            '<details class="global-insights-details">',
            '<summary>Open detailed evidence table</summary>',
            '<div class="insights-table-wrap">',
            '<table class="insights-table">',
            '<thead>',
            '<tr>',
            '<th>#</th>',
            '<th>Theme</th>',
            '<th>Chart</th>',
            '<th>Dataset</th>',
            '<th>Metadata</th>',
            '<th>Unit</th>',
            '<th>Top driver</th>',
            '<th>Latest</th>',
            '<th>Trend</th>',
            '</tr>',
            '</thead>',
            '<tbody>' + rows + '</tbody>',
            '</table>',
            '</div>',
            '</details>'
          ].join("")
        : '<p class="insights-empty">No data available.</p>';

      renderGlobalSparklines(summary);
      renderThemeDonut(summary);
    } catch (error) {
      body.innerHTML = '<p class="insights-empty">Unable to load insights right now.</p>';
    }
  }, 0);
}
