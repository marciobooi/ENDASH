/*
 * insights.js
 * Lightweight insights views for selected chart context.
 * - Energy insights: summary cards (main page)
 * - Energy details insights: deeper breakdown (expanded chart)
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
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
  const suffix = REF.chartExpanded ? "Energy details insights" : "Energy insights";
  return geo ? chartTitle + " - " + geo + " - " + suffix : chartTitle + " - " + suffix;
}

function buildInsightSeriesFromChartSeries() {
  if (!Array.isArray(chartSeries)) return [];

  return chartSeries
    .map((serie) => {
      const numeric = Array.isArray(serie.data)
        ? serie.data.filter((v) => typeof v === "number" && !Number.isNaN(v))
        : [];
      const total = numeric.reduce((sum, value) => sum + value, 0);
      const latest = numeric.length ? numeric[numeric.length - 1] : null;
      const previous = numeric.length > 1 ? numeric[numeric.length - 2] : null;
      const delta = latest != null && previous != null ? latest - previous : null;

      return {
        name: serie.name,
        total,
        latest,
        previous,
        delta,
        data: numeric,
        points: numeric.length
      };
    })
    .sort((a, b) => b.total - a.total);
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

  const insightsSeries = buildInsightSeriesFromChartSeries();
  const unit = getInsightUnitLabel();

  if (!insightsSeries.length) {
    renderInsightsToChartContainer('<div class="insights-page"><p class="insights-empty">No data available.</p></div>');
    return;
  }

  const total = insightsSeries.reduce((sum, item) => sum + item.total, 0);
  const top = insightsSeries[0];
  const second = insightsSeries[1] || null;
  const topShare = total > 0 ? (top.total / total) * 100 : null;

  const html = [
    '<section class="insights-page insights-main">',
    '<h3 class="insights-title">' + getInsightTitle() + '</h3>',
    '<div class="insights-cards">',
    '<article class="insight-card"><div class="insight-label">Total value</div><div class="insight-value">' + formatInsightNumber(total) + ' ' + unit + '</div></article>',
    '<article class="insight-card"><div class="insight-label">Top driver</div><div class="insight-value">' + (top.name || "-") + '</div><div class="insight-sub">' + (topShare == null ? '-' : topShare.toFixed(1) + '% of total') + '</div></article>',
    '<article class="insight-card"><div class="insight-label">Second driver</div><div class="insight-value">' + (second ? second.name : "-") + '</div><div class="insight-sub">Latest: ' + (second ? formatInsightNumber(second.latest) : '-') + ' ' + unit + '</div></article>',
    '<article class="insight-card"><div class="insight-label">Coverage</div><div class="insight-value">' + insightsSeries.length + '</div><div class="insight-sub">series with valid data</div></article>',
    '</div>',
    '<div class="insights-summary">',
    '<strong>Summary:</strong> ' +
      (second
        ? 'The selected chart is led by ' + top.name + ', followed by ' + second.name + '. '
        : 'The selected chart is led by ' + top.name + '. ') +
      'Switch to expanded mode for a deeper breakdown.',
    '</div>',
    '</section>'
  ].join("");

  renderInsightsToChartContainer(html);
}

function createEnergyDetailsInsights() {
  updateREFFromCodesDataset(REF.chartId);

  const d = chartApiCall();
  if (!d) {
    renderInsightsToChartContainer('<div class="insights-page"><p class="insights-empty">No data available.</p></div>');
    return;
  }

  const timeDim = d.Dimension("time");
  const categories = timeDim ? timeDim.id : [];
  handleData(d, categories, categories);

  const insightsSeries = buildInsightSeriesFromChartSeries();
  const unit = getInsightUnitLabel();

  if (!insightsSeries.length) {
    renderInsightsToChartContainer('<div class="insights-page"><p class="insights-empty">No data available.</p></div>');
    return;
  }

  const rows = insightsSeries.slice(0, 12).map((item, index) => {
    return (
      '<tr>' +
        '<td>' + (index + 1) + '</td>' +
        '<td>' + (item.name || "-") + '</td>' +
        '<td>' + formatInsightNumber(item.total) + ' ' + unit + '</td>' +
        '<td>' + (item.latest == null ? '-' : formatInsightNumber(item.latest) + ' ' + unit) + '</td>' +
        '<td>' + (item.delta == null ? '-' : (item.delta >= 0 ? '+' : '') + formatInsightNumber(item.delta) + ' ' + unit) + '</td>' +
      '</tr>'
    );
  }).join('');

  const html = [
    '<section class="insights-page insights-details">',
    '<h3 class="insights-title">' + getInsightTitle() + '</h3>',
    '<p class="insights-summary"><strong>Energy details insights:</strong> detailed ranking for the selected chart context and current filters.</p>',
    '<div class="insights-table-wrap">',
    '<table class="insights-table">',
    '<thead><tr><th>#</th><th>Series</th><th>Total</th><th>Latest</th><th>Change</th></tr></thead>',
    '<tbody>' + rows + '</tbody>',
    '</table>',
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

      const insightsSeries = buildInsightSeriesFromChartSeries();
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
        topShare: top && total ? (top.total / total) * 100 : null,
        seriesCount: insightsSeries.length,
        trendPoints: top && Array.isArray(top.data) ? top.data.slice(-20) : [],
        unitLabel: getInsightUnitLabel()
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

  const summary = collectGlobalInsightsData();
  const labels = (languageNameSpace && languageNameSpace.labels) || {};
  const title = labels.GLOBAL_INSIGHTS || "Global insights";
  const maxAbsTotal = Math.max.apply(null, summary.map((item) => Math.abs(item.total)).concat([1]));
  const uniqueUnits = new Set(summary.map((item) => item.unitLabel)).size;
  const risingCount = summary.filter((item) => getSparklineDirection(item.trendPoints) === "up").length;
  const leader = summary[0] || null;

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
    const slopeDirection = getSparklineDirection(item.trendPoints);
    const trendClass = slopeDirection === "up" ? "is-up" : (slopeDirection === "down" ? "is-down" : "is-flat");
    const trendLabel = item.topDelta == null
      ? "stable"
      : item.topDelta > 0
        ? "+" + formatInsightNumber(item.topDelta)
        : formatInsightNumber(item.topDelta);
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
      '<span><strong>', formatInsightNumber(item.total), ' ', escapeInsightText(item.unitLabel), '</strong> total</span>',
      '<span>Top: ', escapeInsightText(item.topName), '</span>',
      '<span>Share: ', item.topShare == null ? '-' : item.topShare.toFixed(1) + '%', '</span>',
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

  const html = [
    '<div id="globalInsightsOverlay" class="global-insights-overlay" role="dialog" aria-modal="true">',
    '<div class="global-insights-panel">',
    '<div class="global-insights-header">',
    '<h3 class="insights-title">', title, '</h3>',
    '<button type="button" class="global-insights-close ecl-button ecl-button--secondary" onclick="closeGlobalInsights()">', (labels.CLOSE || "Close"), '</button>',
    '</div>',
    summary.length
      ? [
          '<section class="global-insights-hero">',
          '<p class="global-insights-kicker">Overview</p>',
          '<p class="global-insights-text">This view summarizes all visible charts for the current filters. Values are grouped per chart and keep their original units.</p>',
          '</section>',
          '<section class="global-kpis">',
          '<article class="global-kpi-card"><span class="kpi-label">Charts analyzed</span><strong>', summary.length, '</strong></article>',
          '<article class="global-kpi-card"><span class="kpi-label">Units present</span><strong>', uniqueUnits, '</strong></article>',
          '<article class="global-kpi-card"><span class="kpi-label">Rising leaders</span><strong>', risingCount, '</strong></article>',
          '<article class="global-kpi-card"><span class="kpi-label">Strongest chart</span><strong>', leader ? escapeInsightText(leader.chartLabel) : '-', '</strong></article>',
          '</section>',
          '<section class="global-driver-strip">',
          '<p class="global-section-title">Most frequent top drivers</p>',
          '<div class="global-driver-chips">', driverChips || '<span class="global-driver-chip">-</span>', '</div>',
          '</section>',
          '<section>',
          '<p class="global-section-title">Chart intensity ranking</p>',
          '<div class="global-ranking-grid">', rankingCards, '</div>',
          '</section>',
          '<details class="global-insights-details">',
          '<summary>Open detailed table</summary>',
          '<div class="insights-table-wrap"><table class="insights-table"><thead><tr><th>#</th><th>Chart</th><th>Total</th><th>Top driver</th><th>Latest</th></tr></thead><tbody>', rows, '</tbody></table></div>',
          '</details>'
        ].join('')
      : '<p class="insights-empty">No data available.</p>',
    '</div>',
    '</div>'
  ].join("");

  document.body.insertAdjacentHTML("beforeend", html);

  const overlay = document.getElementById("globalInsightsOverlay");
  if (overlay) {
    renderGlobalSparklines(summary);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeGlobalInsights();
      }
    });
  }
}
