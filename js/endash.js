
function endash(d = null) {

  updateREFFromCodesDataset(REF.chartId);

  REF.chartType = "lineChart";

  const type = "spline"; 

  if (REF.dataset === "demo_pjan") {
    d = chartEightCalculation(d);
    const yAxisTitle = 'kilograms of oil equivalent';
    const categories = d.Dimension("time").id;
    const unit = REF.unit
    buildChart(categories, containerId, yAxisTitle, type, unit);
  } else {
    d = chartApiCall();
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
    const title = getTitle();

    if (allSeriesAreZero(chartSeries)) {
        // Call the nullishChart() function when all series have zero values
        chartSeries = []
        // log(containerId, true)
        nullishChart(containerId, chartSeries)
        return
    }





      


    // Define the chart options
    const chartOptions = {
        containerId,
        type,
        title,
        subtitle: null,
        xAxis,
        yAxisFormat: '{value:.2f}',
        yAxisTitle,
        tooltipFormatter: tooltip,    
        creditsText: credits(),
        creditsHref: "",
        series: chartSeries,
        colors: colors,
        legend: {},
        seriesOptions,
    };

    // Create and update the chart
    const customChart = new Chart(chartOptions);
    lineChart = customChart.createChart();

    const chartElement = $("#" + REF.chartId);
    const isExpanded = chartElement.hasClass("expand");

    lineChart.update({ legend: isExpanded ? legendSmall : legendHide }, true);
}

function handleData(d, series, categories ) {
    const indicator_type = REF.indicator_type
    const indicator = REF.indicator;    

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
                const series = d.Dimension("time").id;
                const categories = d.Dimension("time").id;
                handleData(d, series, categories);
                const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit];
                buildChart(categories, REF.containerId, yAxisTitle, chartType, unit);                
            }
            break;
    }
}





