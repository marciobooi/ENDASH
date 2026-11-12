
function endash(d = null) {

  updateREFFromCodesDataset(REF.chartId);

  // endash() only ever renders gallery cards (always line/spline, never
  // expanded) - every call site confirms this (chartContainer.js,
  // populateCountries.js). buildApiUrl()/getTitle()/buildChart() all key off
  // these two shared, mutable REF flags though, so if either was left over
  // from an earlier expanded-chart interaction (or a reloaded URL), every
  // subsequently-rendered gallery card inherited the stale value:
  // - REF.chartType stuck as "barChart"/"pieChart" switched the fetch to the
  //   single-year query shape and gave titles the bar/pie suffix.
  // - REF.chartExpanded stuck as true made buildChart() label every single
  //   year on the x-axis (the "expanded" step) instead of just a few,
  //   leaving some gallery cards crowded while others looked normal.
  REF.chartType = "lineChart";
  REF.chartExpanded = false;

  const type = "spline";

  if (REF.dataset === "demo_pjan") {
    d = chartEightCalculation(d);
    const yAxisTitle = 'kilograms of oil equivalent';
    const categories = d.Dimension("time").id;
    const unit = REF.unit
    buildChart(categories, containerId, yAxisTitle, type, unit);
  } else if (isCustomDataChart()) {
    const combined = customChartData();

    if (!combined) {
      // The custom data path found nothing to draw (a request failed, or the
      // tables share no month) - same "no data" fallback as the single-table
      // path below.
      getTitle();
      nullishChart(containerId, []);
      return;
    }

    buildChart(combined.categories, containerId, combined.yAxisTitle, type, REF.unit, combined.yAxisPlotLines);
  } else {
    d = chartApiCall();

    if (!d) {
      // The Eurostat API call failed (dataset unavailable, network error,
      // etc.) - fall back to the existing "no data" chart instead of
      // crashing on d.Dimension(...) below and leaving the card stuck
      // mid-render (skeleton never clears, and a thrown error here can also
      // abort any other cards batched in the same intersection callback).
      // nullishChart() bypasses the Chart class (and its getTitle() call),
      // so call it here too - otherwise the card keeps showing its initial
      // "Chart Item N" placeholder instead of the real chart title.
      getTitle();
      nullishChart(containerId, []);
      return;
    }

    const series = d.Dimension("time").id;
    const categories = d.Dimension("time").id;

    handleData(d, series, categories);
    const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit];

    const unit = REF.unit

    buildChart(categories, containerId, yAxisTitle, type, unit);
  }

}
function buildChart(categories, containerId, yAxisTitle, type, unit, yAxisPlotLines) {
    // Set containerId to the default value from codesDataset if it's not provided
    containerId = containerId || codesDataset[REF.chartId].container;

    const enable = REF.chartExpanded === true ? true : false

    // Define xAxis options with conditional label step
    const xAxis = {
        categories,
        labels: {
            step: enable ? 1 : categories.length - 1,
            formatter: function() {
                return (!REF.chartExpanded && (this.isLast || this.isFirst)) ? this.value : this.value;
            }
        }
    };

    // Define series options with conditional marker
    const seriesOptions = {
        cursor: "pointer",
        marker: {
            enabled: enable,
        },
    };

    // Get the chart title
    const title = getTitle(yAxisTitle);

    if (allSeriesAreZero(chartSeries)) {
        // Call the nullishChart() function when all series have zero values
        chartSeries = []
        // log(containerId, true)
        nullishChart(containerId, chartSeries)
        return
    }      

    // Custom-data charts order their own lines deliberately (chart_23: stocks
    // then deliveries, latest window first; chart_24: largest stock first)
    // and sorting by name would scramble that. Decided here, at build time -
    // REF.chartId changes as other cards render, so the tooltip below must
    // not look it up when it runs.
    let orderedSeries = isCustomDataChart() ? chartSeries : sortByName(chartSeries);
    const showTotal = tooltipTotalEnabled(REF.chartId); // per-chart "tooltipTotal" in codes.js

    if (REF.chartId === 'chart_2') {
        // "Renewable energy - overall" (REN) is the headline figure - show
        // it first in the legend/tooltip instead of wherever it falls
        // alphabetically among the other categories.
        const overallIndex = orderedSeries.findIndex(item => item.indicator === 'REN');
        if (overallIndex > 0) {
            const [overall] = orderedSeries.splice(overallIndex, 1);
            orderedSeries.unshift(overall);
        }
    }

    // Define the chart options
    const chartOptions = {
        containerId,
        type,
        title,
        subtitle: null,
        xAxis,
        yAxisFormat: '{value:,.0f}',
        yAxisTitle,
        yAxisPlotLines,
        tooltipFormatter: function () { return tooltipTable(this.points, unit, { showTotal }); },
        creditsText: credits(),
        creditsHref: "",
        series: orderedSeries,
        colors: colors,
        legend: {},
        seriesOptions,
    };

    // Create and update the chart
    const customChart = new Chart(chartOptions);
    lineChart = customChart.createChart();

    const chartElement = $("#" + REF.chartId);
    var isExpanded = chartElement.hasClass("expand");

    lineChart.update({ legend: isExpanded ? legendSmall : legendHide }, true);
    
    changeLegendPisition(lineChart);     
    
    $(window).on('resize', function () {
      changeLegendPisition(lineChart);
    });
}

function handleData(d, series, categories ) {


    const indicator_type = REF.indicator_type

    let indicator

    // Prefer whatever the API actually returned for the chart's own primary
    // breakdown dimension (indicator_type) over our static config list, in
    // case some configured codes got silently dropped. This used to
    // hardcode 'siec' regardless of indicator_type, which broke every chart
    // where siec is only the SECONDARY/fixed dimension (e.g. chart_10/11:
    // indicator_type "nrg_bal" with siec fixed to TOTAL) - it would use
    // siec's single "TOTAL" category as if it were the series breakdown,
    // collapsing multiple series into one mislabeled "Series 1".
    indicator = d.Dimension(indicator_type) !== null ? d.Dimension(indicator_type).id : REF.indicator

    chartSeries = []


    if(REF.dataset === "nrg_ind_ep"|| REF.dataset === "nrg_ind_ffgae") {
        chartSeries.push({name: d.label, data:d.value})
    } else {
        for (let item in indicator) {
            data = [];
            for (let j = 0; j < series.length; j++) {
                
                const value = d.value[0] == null ? 0 : d.value[0]
                data.push(value);
                d.value.shift();
            }
            newObj = {
                name: d.__tree__.dimension[indicator_type].category.label[indicator[item]],
                data: data,
                indicator: indicator[item]
            };
            chartSeries.push(newObj);
        }
    }

    if(REF.chartId != 'chart_21' || REF.chartId != 'chart_22') {
        categories = categories
    } else {
        let startIndex = 0;
        chartSeries.forEach((series) => {
            const data = series.data;       
        
            // Find the index of the first non-zero and non-null value
            for (let i = 0; i < data.length; i++) {
                if (data[i] !== null && data[i] > 0) {
                    startIndex = i;
                    break;
                }
            }
        
            // Update the data series to start from the first non-zero value
            series.data = data.slice(startIndex);
        }); 
        categories.splice(0, startIndex)
    }


    
}
function chartEightCalculation() {
    urlChartEightOne = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?";
    urlChartEightOne += "format=JSON";
    urlChartEightOne += "&lang=" + REF.language;
    urlChartEightOne += "&siec=TOTAL&unit=KTOE&nrg_bal=FC_OTH_HH_E";
    if(REF.chartOpt === "compareChart") {
        for (let i = 0; i < defaultGeos.length; i++) urlChartEightOne += "&geo=" + defaultGeos[i];
    } else {
        urlChartEightOne += "&geo=" + REF.geos;
    }

    d = JSONstat(urlChartEightOne).Dataset(0);

    year = d.Dimension("time").id;
    geo = d.Dimension("geo").id;

    urlChartEightTwo = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjan?";
    urlChartEightTwo += "format=JSON";
    urlChartEightTwo += "&lang=" + REF.language;
    urlChartEightTwo += "&age=TOTAL&sex=T";

    for (let i = 0; i < year.length; i++) urlChartEightTwo += "&time=" + year[i];
    for (let i = 0; i < geo.length; i++) urlChartEightTwo += "&geo=" + geo[i];

    c = JSONstat(urlChartEightTwo).Dataset(0);

    value1 = d.value;
    value2 = c.value;

    data = [];

    for (let i = 0; i < year.length; i++) {
        data.push(
            [Math.trunc(Math.floor((value1[i] / value2[i]) * 1000000))]
        );
    }

    chartSeries.push({
        name: 'Final energy consumption in households per capita',
        data: data
    });
    return d;
}
// ---------------------------------------------------------------------------
// Combined monthly charts (chart_23, oil stocks)
// ---------------------------------------------------------------------------
// A chart config with a `combine` block merges two Eurostat tables into ONE
// chart. The rest of the app assumes one dataset and annual data per chart, so
// - like chartEightCalculation() for chart_8 - these get their own data path
// instead of chartApiCall() + handleData().

function isCombinedChart(chartId = REF.chartId) {
    const config = codesDataset[chartId];
    return !!(config && config.combine);
}

// "2026-09" shifted by -11 months -> "2025-10". Works on the month id itself,
// not on array positions, so a gap in one table can't misalign the two windows.
function shiftMonthId(monthId, offset) {
    const [year, month] = monthId.split("-").map(Number);
    const index = year * 12 + (month - 1) + offset;
    return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`;
}

function formatMonthId(monthId, options) {
    const [year, month] = monthId.split("-").map(Number);
    return new Intl.DateTimeFormat(REF.language.toLowerCase(), { ...options, timeZone: "UTC" })
        .format(new Date(Date.UTC(year, month - 1, 1)));
}

// { "2026-08": 397.8, ... } for a single-geo, single-indicator monthly table;
// months with no published value are left out. null for any other table shape.
function monthlyValues(d) {
    const months = d.Dimension("time").id;
    if (d.value.length !== months.length) return null;

    const values = {};
    months.forEach((id, i) => {
        if (d.value[i] != null) values[id] = d.value[i];
    });
    return values;
}

// Builds chartSeries (the global buildChart() reads) and returns the x-axis
// categories + y-axis title, or null when there is nothing to draw.
function combinedChartData() {
    const config = codesDataset[REF.chartId];
    const windowSize = config.months || 12;
    const sources = [config, config.combine];

    const tables = sources.map((source) => chartApiCall(buildDatasetApiUrl(source)));
    if (tables.some((table) => !table)) return null;

    const valuesByTable = tables.map(monthlyValues);
    if (valuesByTable.some((values) => !values)) return null;

    // "Last 12 months available": anchor on the newest month that BOTH tables
    // have published, so the stock and delivery lines always cover the same months.
    const sharedMonths = Object.keys(valuesByTable[0]).filter((id) => id in valuesByTable[1]).sort();
    if (!sharedMonths.length) return null;
    const latestMonth = sharedMonths[sharedMonths.length - 1];

    // windows[0] = the last `windowSize` months, windows[1] = the span right before it.
    const windows = [0, 1].map((back) =>
        Array.from({ length: windowSize }, (_, i) => shiftMonthId(latestMonth, i - (back + 1) * windowSize + 1))
    );

    const rangeLabel = (monthIds) => {
        const monthYear = { month: "short", year: "numeric" };
        return `${formatMonthId(monthIds[0], monthYear)} – ${formatMonthId(monthIds[monthIds.length - 1], monthYear)}`;
    };

    const lineColors = ["#0033FF", "#E67500"]; // stocks, deliveries
    const series = [];

    sources.forEach((source, t) => {
        const code = source.indicator2[0];
        const flowLabel = tables[t].__tree__.dimension[source.indicator2_type].category.label[code];

        windows.forEach((monthIds, back) => {
            const data = monthIds.map((id) => (id in valuesByTable[t] ? valuesByTable[t][id] : null));
            // A window this table doesn't reach back to has nothing to draw.
            if (!data.some((value) => value !== null)) return;

            series.push({
                name: `${flowLabel} (${rangeLabel(monthIds)})`,
                data,
                indicator: code,
                color: lineColors[t],
                dashStyle: back === 0 ? "Solid" : "ShortDash",
            });
        });
    });

    chartSeries = series;

    return {
        // Month AND year of the latest window ("Oct 2025" ... "Sep 2026"); the
        // earlier window's points sit at the same positions, a year back.
        categories: windows[0].map((id) => formatMonthId(id, { month: "short", year: "numeric" })),
        yAxisTitle: tables[0].__tree__.dimension.unit.category.label[config.unit],
    };
}

// ---------------------------------------------------------------------------
// Median-split charts (chart_24, oil stocks by country)
// ---------------------------------------------------------------------------
// A chart config with `medianSplit` draws EVERY country at once (the page's
// country selector doesn't apply), split at the median into two groups that
// the user toggles between with isMedianBelow(chartId) / the on-card toggle.

// Per-chart above/below state, kept in REF.medianGroup (a list of the chart ids
// flipped to "below") so each median chart toggles independently.
function isMedianBelow(chartId) {
    return String(REF.medianGroup || "").split(",").includes(chartId);
}

function toggleMedianBelow(chartId) {
    const below = String(REF.medianGroup || "").split(",").filter((id) => id && id !== chartId);
    if (!isMedianBelow(chartId)) below.push(chartId);
    REF.medianGroup = below.join(",");
}

function isMedianChart(chartId = REF.chartId) {
    const config = codesDataset[chartId];
    return !!(config && config.medianSplit);
}

// Charts that bypass chartApiCall() + handleData() with their own data path.
function isCustomDataChart(chartId = REF.chartId) {
    return isCombinedChart(chartId) || isMedianChart(chartId);
}

// Builds chartSeries and returns { categories, yAxisTitle }, or null when
// there is nothing to draw.
function customChartData() {
    return isMedianChart() ? medianChartData() : combinedChartData();
}

function medianOf(valuesAscending) {
    const n = valuesAscending.length;
    const mid = Math.floor(n / 2);
    return n % 2 ? valuesAscending[mid] : (valuesAscending[mid - 1] + valuesAscending[mid]) / 2;
}

// ---- all-countries monthly tables (median charts, and the bar/pie views of
// every monthly chart) ----

// { months, countries: [{ code, byMonth }], geoLabels } for a monthly table
// that came back with every country; null for any other shape. Real countries
// only - the response also carries the EU aggregate and countries outside the
// dashboard's own lists (e.g. the UK, all empty).
function readCountryMonths(d) {
    const months = d.Dimension("time").id;
    const geos = d.Dimension("geo").id;
    if (d.value.length !== geos.length * months.length) return null;

    const realCountries = [...EU_COUNTRY_CODES, ...EFTA_COUNTRY_CODES, ...ENLARGEMENT_COUNTRY_CODES];
    const countries = [];
    geos.forEach((code, g) => {
        if (!realCountries.includes(code)) return;
        const byMonth = {};
        months.forEach((id, t) => {
            const value = d.value[g * months.length + t];
            if (value != null) byMonth[id] = value;
        });
        countries.push({ code, byMonth });
    });
    return { months, countries, geoLabels: d.__tree__.dimension.geo.category.label };
}

// Months (ascending) in which at least half the countries have a value. The
// very latest month usually has only a handful (e.g. 5 of 36), which would
// leave most lines ending a month early; this still rolls forward by itself as
// more countries report.
function quorumMonths(parsed) {
    const quorum = Math.ceil(parsed.countries.length / 2);
    return parsed.months.filter((id) => parsed.countries.filter((c) => id in c.byMonth).length >= quorum);
}

// Full-history, every-country tables of a monthly chart (one per source table)
// plus the months all of them cover well. null when a request fails.
function monthlyTables(config) {
    const sources = isCombinedChart(config.title) ? [config, config.combine] : [config];
    const tables = [];
    for (const source of sources) {
        const d = chartApiCall(buildDatasetApiUrl(source, { allGeos: true }));
        const parsed = d && readCountryMonths(d);
        if (!parsed) return null;
        tables.push({ ...parsed, d, source });
    }
    const quorums = tables.map((table) => new Set(quorumMonths(table)));
    const months = tables[0].months.filter((id) => quorums.every((set) => set.has(id)));
    return months.length ? { tables, months } : null;
}

// The month the bar/pie views show: REF.month if it's available, else the newest.
function resolveMonth(months) {
    if (!months.includes(REF.month)) REF.month = months[months.length - 1];
    return REF.month;
}

// Bar view of a monthly chart: every country for the selected month, one
// series per source table, largest first.
function monthlyBarData() {
    const config = codesDataset[REF.chartId];
    const data = monthlyTables(config);
    if (!data) return null;
    const month = resolveMonth(data.months);

    const valueOf = (table, code) => {
        const country = table.countries.find((c) => c.code === code);
        return country && month in country.byMonth ? country.byMonth[month] : null;
    };
    const codes = data.tables[0].countries
        .map((c) => c.code)
        .filter((code) => data.tables.some((table) => (valueOf(table, code) || 0) > 0))
        .sort((a, b) => (valueOf(data.tables[0], b) || 0) - (valueOf(data.tables[0], a) || 0));
    if (!codes.length) return null;

    const lineColors = ["#0033FF", "#E67500"];
    const geoLabels = data.tables[0].geoLabels;
    chartSeries = data.tables.map((table, t) => ({
        name: table.d.__tree__.dimension[table.source.indicator2_type].category.label[table.source.indicator2[0]],
        data: codes.map((code) => valueOf(table, code)),
        color: lineColors[t],
    }));

    return {
        categories: codes.map((code) => languageNameSpace.labels[code] || geoLabels[code] || code),
        yAxisTitle: data.tables[0].d.__tree__.dimension.unit.category.label[config.unit],
    };
}

// Pie view of a monthly chart (first source table): each country's share of
// the selected month's total. Returns [[name, value], ...].
function monthlyPieData() {
    const config = codesDataset[REF.chartId];
    const data = monthlyTables(config);
    if (!data) return null;
    const month = resolveMonth(data.months);
    const table = data.tables[0];

    window.pieChartUnitLabel = table.d.__tree__.dimension.unit.category.label[config.unit] || REF.unit;
    return table.countries
        .filter((c) => (c.byMonth[month] || 0) > 0)
        .map((c) => [languageNameSpace.labels[c.code] || table.geoLabels[c.code] || c.code, c.byMonth[month]]);
}

function medianChartData() {
    const config = codesDataset[REF.chartId];
    const windowSize = config.months || 12;
    const group = isMedianBelow(REF.chartId) ? "below" : "above";

    // Ask for a few months more than the window: countries publish with a
    // lag, so the newest months are only partly filled in (see the anchor).
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const since = shiftMonthId(currentMonth, -(windowSize + 6));

    const d = chartApiCall(buildDatasetApiUrl(config, { allGeos: true, since }));
    if (!d) return null;

    const parsed = readCountryMonths(d);
    if (!parsed) return null;
    const countries = parsed.countries;

    // "Last 12 months available": anchor on the newest month that at least
    // half the countries have published (see quorumMonths).
    const anchor = quorumMonths(parsed).pop();
    if (!anchor) return null;

    const windowMonths = Array.from({ length: windowSize }, (_, i) => shiftMonthId(anchor, i - windowSize + 1));

    // The median is ONE value for the whole period: every country's monthly
    // closing stock in the window, pooled. Countries with nothing but zeros or
    // gaps (Albania reports 0 throughout) aren't real stock figures, so they
    // stay out of it.
    const withStock = countries
        .map((c) => ({ code: c.code, data: windowMonths.map((id) => (id in c.byMonth ? c.byMonth[id] : null)) }))
        .filter((c) => c.data.some((value) => value !== null && value !== 0));
    // Threshold = (sum of every country's monthly stock) / months / countries,
    // i.e. the average stock per country per month over the period.
    const totalStock = withStock.reduce((sum, c) => sum + c.data.reduce((s, value) => s + (value || 0), 0), 0);
    if (!withStock.length) return null;
    const medianValue = totalStock / windowSize / withStock.length;

    // Show only the values on the chosen side of the median ("below" includes
    // the median itself); points on the other side become gaps, and a country
    // with no point left on this side drops out of the chart.
    const keep = (value) => value !== null && (group === "above" ? value > medianValue : value <= medianValue);
    const geoLabels = d.__tree__.dimension.geo.category.label;
    chartSeries = withStock
        .map((c) => ({ ...c, shown: c.data.map((value) => (keep(value) ? value : null)) }))
        .filter((c) => c.shown.some((value) => value !== null))
        .map((c) => ({
            name: languageNameSpace.labels[c.code] || geoLabels[c.code] || c.code,
            data: c.shown,
            indicator: c.code,
        }));
    // Alphabetical (in the page language) - this is the order of the tooltip
    // rows and the legend.
    chartSeries.sort((a, b) => a.name.localeCompare(b.name, REF.language.toLowerCase()));
    if (!chartSeries.length) return null;

    return {
        categories: windowMonths.map((id) => formatMonthId(id, { month: "short", year: "numeric" })),
        yAxisTitle: d.__tree__.dimension.unit.category.label[config.unit],
        yAxisPlotLines: [{
            value: medianValue,
            color: "#555",
            width: 2,
            dashStyle: "Dash",
            zIndex: 5,
            label: {
                text: `${languageNameSpace.labels["MEDIAN"] || "Average"}: ${Math.round(medianValue).toLocaleString(REF.language.toLowerCase())}`,
                align: "right",
                style: { color: "#333", fontWeight: "bold" },
            },
        }],
    };
}

function compareCountries() {

    updateREFFromCodesDataset(REF.chartId);

    const unit = REF.unit

    switch (REF.chartType) {
        case "barChart":
            createBarChart();
            break;
        case "pieChart":
            createPieChart();
            break;
        case "insightsChart":
            createEnergyInsights();
            break;
        default:
            let chartType = "spline";
            if (REF.dataset === "demo_pjan") {
                // Handle special case for dataset "demo_pjan"
                // You may need to define chartEightCalculation and buildChart functions
                const d = chartEightCalculation();
                const yAxisTitle = 'kilograms of oil equivalent';
                const categories = d.Dimension("time").id;
                buildChart(categories, REF.containerId, yAxisTitle, chartType, unit);
            } else if (isCustomDataChart()) {
                const combined = customChartData();

                if (!combined) {
                    getTitle();
                    nullishChart(containerId, []);
                    break;
                }

                buildChart(combined.categories, REF.containerId, combined.yAxisTitle, chartType, unit, combined.yAxisPlotLines);
            } else {
                const d = chartApiCall();

                if (!d) {
                    // REF.containerId is never actually set anywhere - use the
                    // container id updateREFFromCodesDataset() just resolved
                    // (same one buildChart() below would fall back to).
                    getTitle();
                    nullishChart(containerId, []);
                    break;
                }

                const series = d.Dimension("time").id;
                const categories = d.Dimension("time").id;
                handleData(d, series, categories);
                const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit];
                buildChart(categories, REF.containerId, yAxisTitle, chartType, unit);
            }
            break;
    }
}





