
function endash(d = null) {

  updateREFFromCodesDataset(REF.chartId);

//   REF.chartType = "lineChart";

  const type = "spline"; 

  if (REF.dataset === "demo_pjan") {
    d = chartEightCalculation(d);
    const yAxisTitle = 'kilograms of oil equivalent';
    const categories = d.Dimension("time").id;
    const unit = REF.unit
    buildChart(categories, containerId, yAxisTitle, type, unit);
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
function buildChart(categories, containerId, yAxisTitle, type, unit) {
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

    let orderedSeries = sortByName(chartSeries);

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
        tooltipFormatter: function () { return tooltipTable(this.points, unit); },
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





