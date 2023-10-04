
function endash(d = null) {

  updateREFFromCodesDataset(REF.chartId);

  REF.chartType = "lineChart";

  const type = "spline";

  if (REF.dataset === "demo_pjan") {
    d = chartEightCalculation(d);
    const yAxisTitle = 'kilograms of oil equivalent';
    const categories = d.Dimension("time").id;
    buildChart(categories, containerId, yAxisTitle, type);
  } else {
    d = chartApiCall();
    const series = d.Dimension("time").id;
    const categories = d.Dimension("time").id;

    handleData(d, series);
    const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit];

    buildChart(categories, containerId, yAxisTitle, type);
  }

}
function buildChart(categories, containerId, yAxisTitle, type) {
    // Set containerId to the default value from codesDataset if it's not provided
    containerId = containerId || codesDataset[REF.chartId].container;

    // Define xAxis options with conditional label step
    const xAxis = {
        categories,
        labels: {
            step: REF.chartExpanded ? 0 : 10,
        },
    };

    // Define series options with conditional marker
    const seriesOptions = {
        cursor: "pointer",
        marker: {
            enabled: REF.chartExpanded,
        },
    };

    // Get the chart title
    const title = getTitle();

    // Define the chart options
    const chartOptions = {
        containerId,
        type,
        title,
        subtitle: null,
        xAxis,
        yAxisFormat: '{value:.2f}',
        yAxisTitle,
        tooltipFormatter: '',
        creditsText: '',
        creditsHref: "",
        series: chartSeries,
        colors,
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

function handleData(d, series ) {
    const indicator_type = REF.indicator_type
    const indicator = REF.indicator;    

    chartSeries = []

    if(REF.dataset === "nrg_ind_ep"|| REF.dataset === "nrg_ind_ffgae") {
        chartSeries.push({name: d.label, data:d.value})
    } else {
        for (let item in indicator) {
            data = [];
            for (let j = 0; j < series.length; j++) {
                const value = d.value[0];
                data.push(value === null ? 0 : value);
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
    // Ensure that REF.chartId is set appropriately before calling this function

    // Update REF properties based on the selected chartId
    updateREFFromCodesDataset(REF.chartId);

    // Log the chart type (for debugging purposes)
    console.log(REF.chartType);

    switch (REF.chartType) {
        case "barChart":
            createBarChart();
            break;
        case "pieChart":
            createPieChart();
            break;
        default:
            // Default chart type (e.g., spline)
            let chartType = "spline";

            if (REF.dataset === "demo_pjan") {
                // Handle special case for dataset "demo_pjan"
                // You may need to define chartEightCalculation and buildChart functions
                const d = chartEightCalculation();
                const yAxisTitle = 'kilograms of oil equivalent';
                const categories = d.Dimension("time").id;
                buildChart(categories, REF.containerId, yAxisTitle, chartType);
            } else {
                // Handle other datasets (you may need to define chartApiCall and handleData functions)
                const d = chartApiCall();
                const series = d.Dimension("time").id;
                const categories = d.Dimension("time").id;
                handleData(d, series);
                const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit];
                buildChart(categories, REF.containerId, yAxisTitle, chartType);
            }
            break;
    }
}

// Define the functions createBarChart, createPieChart, chartEightCalculation,
// chartApiCall, handleData, and buildChart as needed.



// function to display all countries but its disabled for now
// function compareLineChart(indicator) {
//     log(indicator)

//     const type = "spline"

//     const indicator_type = `&${REF.indicator_type}=`

//     REF.dataset = codesDataset[REF.chartId].dataset;
//     containerId = codesDataset[REF.chartId].container;


//     let url = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/" + REF.dataset + "?";
//     url += "format=JSON";
//     url += "&lang=" + REF.language;
//     url += "&unit=" + codesDataset[REF.chartId].unit; 
//     url += indicator_type + indicator
//     for (let i = 0; i < defaultGeos.length; i++) url += "&geo=" + defaultGeos[i]; 

//     d = JSONstat(url).Dataset(0);

//     log(d)

    
//     const series = d.Dimension("time").id;
//     const categories = d.Dimension("time").id;               

//     for (let item in defaultGeos) {
//         data = [];
//         for (let j = 0; j < series.length; j++) {
//             const value = d.value[0];
//             data.push(value === null ? 0 : value);
//             d.value.shift();
//         }
//         newObj = {
//             name: defaultGeos[item],
//             data: data,          
//         };
//         chartSeries.push(newObj);
//     }

//     const yAxisTitle = d.__tree__.dimension.unit.category.label[codesDataset[REF.chartId].unit]    

//     buildChart(categories, REF.containerId, yAxisTitle, type);  

    
// }