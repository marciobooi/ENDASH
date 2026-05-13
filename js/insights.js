/*
 * insights.js
 * Lightweight insights views for selected chart context.
 * - Energy insights: summary cards and global overview
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

let globalInsightsMiniCharts = [];

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
        height: 30,
        margin: [2, 0, 2, 0],
        spacing: [0, 0, 0, 0],
        type: "spline"
      },
      title: { text: null },
      credits: { enabled: false },
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

  const summaryText =
    (top.name || "The leading series") +
    " is currently " +
    top.trendLabel +
    ". The latest available value is " +
    formatInsightNumber(top.latest) +
    (unit ? " " + unit : "") +
    (top.latestYear ? " in " + top.latestYear : "") +
    "." +
    (second ? " The next highest series is " + second.name + "." : "");

  const html = [
    '<section class="insights-page insights-main">',
    '<h3 class="insights-title">' + escapeInsightText(getInsightTitle()) + '</h3>',
    '<div class="insights-cards">',
    '<article class="insight-card">',
    '<div class="insight-label">' + escapeInsightText(latestLabel) + '</div>',
    '<div class="insight-value">' + formatInsightNumber(top.latest) + ' ' + escapeInsightText(unit) + '</div>',
    '<div class="insight-sub">' + escapeInsightText(top.name || '-') + '</div>',
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
    '<div class="insight-sub">Observed in ' + escapeInsightText(top.maxYear || '-') + '</div>',
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

      summary.push({
        chartId,
        chartLabel: labels[codesDataset[chartId].title] || codesDataset[chartId].title || chartId,
        total,
        topName: top ? top.name : "-",
        topLatest: top ? top.latest : null,
        topDelta: top ? top.delta : null,
        topLongTermChange: top ? top.longTermChange : null,
        topPercentChange: top ? top.percentChange : null,
        topShare: top && total ? (top.total / total) * 100 : null,
        seriesCount: insightsSeries.length,
        trendPoints: top && Array.isArray(top.data) ? top.data.slice(-20) : [],
        unitLabel: getInsightUnitLabel(),
        latestYear: top ? top.latestYear : null,
        trendDirection: top ? top.trendDirection : "flat",
        trendLabel: top ? top.trendLabel : "stable"
      });
    } catch (err) {
      // Ignore broken chart payloads so one chart does not block the global summary.
    }
  });

  restoreRefState(initialState, savedContainerId);

  return summary.sort((a, b) => b.total - a.total);
}

function openGlobalInsights() {
  if (REF.chartExpanded) return;

  closeGlobalInsights();

  const labels = (languageNameSpace && languageNameSpace.labels) || {};
  const title = labels.GLOBAL_INSIGHTS || "Global insights";
  const html = [
    '<div id="globalInsightsOverlay" class="global-insights-overlay" role="dialog" aria-modal="true">',
    '<div class="global-insights-panel">',
    '<div class="global-insights-header">',
    '<h3 class="insights-title">', title, '</h3>',
    '<button type="button" class="global-insights-close ecl-button ecl-button--secondary" onclick="closeGlobalInsights()">', (labels.CLOSE || "Close"), '</button>',
    '</div>',
    '<div id="globalInsightsBody" class="global-insights-loading">',
    '<div class="global-insights-spinner" aria-hidden="true"></div>',
    '<p>', escapeInsightText(labels.LOADING || 'Loading insights...'), '</p>',
    '</div>',
    '</div>',
    '</div>'
  ].join("");

  document.body.insertAdjacentHTML("beforeend", html);

  const overlay = document.getElementById("globalInsightsOverlay");
  if (overlay) {
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeGlobalInsights();
      }
    });

    setTimeout(function () {
      const body = document.getElementById("globalInsightsBody");
      if (!body) return;

      try {
        const summary = collectGlobalInsightsData();
        const maxAbsTotal = Math.max.apply(null, summary.map((item) => Math.abs(item.total)).concat([1]));
        const uniqueUnits = new Set(summary.map((item) => item.unitLabel)).size;
        const risingCount = summary.filter((item) => getSparklineDirection(item.trendPoints) === "up").length;

        const latestYears = summary
          .map((item) => Number(item.latestYear))
          .filter((year) => !Number.isNaN(year));

        const latestYearMin = latestYears.length ? Math.min.apply(null, latestYears) : null;
        const latestYearMax = latestYears.length ? Math.max.apply(null, latestYears) : null;

        const driverMap = {};
        summary.forEach((item) => {
          const key = item.topName || "-";
          driverMap[key] = (driverMap[key] || 0) + 1;
        });

        const driverChips = Object.keys(driverMap)
          .map((name) => ({ name: name, count: driverMap[name] }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8)
          .map((driver) => {
            return '<span class="global-driver-chip">' + escapeInsightText(driver.name) + ' <strong>' + driver.count + '</strong></span>';
          })
          .join("");

        const rankingCards = summary.slice(0, 12).map((item, index) => {
          const normalized = Math.max(6, Math.round((Math.abs(item.total) / maxAbsTotal) * 100));
          const slopeDirection = item.trendDirection || getSparklineDirection(item.trendPoints);
          const trendClass = slopeDirection === "up" ? "is-up" : (slopeDirection === "down" ? "is-down" : "is-flat");
          const trendLabel = item.trendLabel || getTrendLabel(slopeDirection);
          const sparklineId = "globalSparkline_" + index + "_" + String(item.chartId || "chart").replace(/[^a-zA-Z0-9_-]/g, "");
          item.sparklineId = sparklineId;

          return [
            '<article class="global-chart-card">',
            '<div class="global-chart-card-head">',
            '<span class="global-rank">#', (index + 1), '</span>',
            '<h4>', escapeInsightText(item.chartLabel), '</h4>',
            '<span class="global-trend ', trendClass, '">', escapeInsightText(trendLabel), '</span>',
            '</div>',
            '<div class="global-sparkline-wrap">',
            item.trendPoints && item.trendPoints.length > 1
              ? '<div class="global-sparkline-hc" id="' + sparklineId + '"></div>'
              : '<span class="global-sparkline-empty">-</span>',
            '</div>',
            '<div class="global-intensity-track"><span style="width:', normalized, '%"></span></div>',
            '<div class="global-chart-metrics">',
            '<span><strong>', item.latestYear ? escapeInsightText(item.latestYear) + ': ' : '', formatInsightNumber(item.topLatest), ' ', escapeInsightText(item.unitLabel), '</strong> latest leading value</span>',
            '<span>Top: ', escapeInsightText(item.topName), '</span>',
            '<span>Trend: ', escapeInsightText(item.trendLabel || getTrendLabel(getSparklineDirection(item.trendPoints))), '</span>',
            '</div>',
            '</article>'
          ].join("");
        }).join("");

        const rows = summary.slice(0, 22).map((item, index) => {
          return [
            '<tr>',
            '<td>', (index + 1), '</td>',
            '<td>', escapeInsightText(item.chartLabel), '</td>',
            '<td>', formatInsightNumber(item.total), ' ', escapeInsightText(item.unitLabel), '</td>',
            '<td>', escapeInsightText(item.topName), '</td>',
            '<td>', item.topLatest == null ? '-' : (formatInsightNumber(item.topLatest) + ' ' + escapeInsightText(item.unitLabel)), '</td>',
            '</tr>'
          ].join('');
        }).join('');

        body.innerHTML = summary.length
          ? [
              '<section class="global-insights-hero">',
              '<p class="global-insights-kicker">Overview</p>',
              '<p class="global-insights-text">This view summarizes all visible charts for the current filters. Values are grouped per chart and keep their original units.</p>',
              '</section>',
              '<section class="global-kpis">',
              '<article class="global-kpi-card"><span class="kpi-label">Charts analyzed</span><strong>', summary.length, '</strong></article>',
              '<article class="global-kpi-card"><span class="kpi-label">Units present</span><strong>', uniqueUnits, '</strong></article>',
              '<article class="global-kpi-card"><span class="kpi-label">Rising leaders</span><strong>', risingCount, '</strong></article>',
              '<article class="global-kpi-card"><span class="kpi-label">Latest year range</span><strong>', latestYearMin && latestYearMax ? latestYearMin + '-' + latestYearMax : '-', '</strong></article>',
              '</section>',
              '<section class="global-driver-strip">',
              '<p class="global-section-title">Most frequent top drivers</p>',
              '<div class="global-driver-chips">', driverChips || '<span class="global-driver-chip">-</span>', '</div>',
              '</section>',
              '<section>',
              '<p class="global-section-title">Chart overview by selected filters</p>',
              '<div class="global-ranking-grid">', rankingCards, '</div>',
              '</section>',
              '<details class="global-insights-details">',
              '<summary>Open detailed table</summary>',
              '<div class="insights-table-wrap"><table class="insights-table"><thead><tr><th>#</th><th>Chart</th><th>Total</th><th>Top driver</th><th>Latest</th></tr></thead><tbody>', rows, '</tbody></table></div>',
              '</details>'
            ].join('')
          : '<p class="insights-empty">No data available.</p>';

        renderGlobalSparklines(summary);
      } catch (error) {
        body.innerHTML = '<p class="insights-empty">Unable to load insights right now.</p>';
      }
    }, 0);
  }
}
