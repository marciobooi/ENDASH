let aggregates
function endash(d = null) {

  updateREFFromCodesDataset(REF.chartId);

  aggregates = REF.geos.length > 1;

  REF.chartType = "lineChart";

  const type = "spline"; 


  if(aggregates) {

    compareLineChart(type)   
   
    return
  }

  if (REF.dataset === "demo_pjan") {
    d = chartEightCalculation(d);
    const yAxisTitle = 'kilograms of oil equivalent';
    const categories = d.Dimension("time").id;
    buildChart(categories, containerId, yAxisTitle, type);
  } else {
    d = chartApiCall();
    const series = d.Dimension("time").id;
    const categories = d.Dimension("time").id;

    handleData(d, series, categories);
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
            step: REF.chartExpanded === false ? categories.length - 1 : 1, // Set step to 1 for first and last labels
            formatter: function() {
                if (this.isLast || this.isFirst) {
                    return this.value;
                }
            }
        }
    };
  
    // Define series options with conditional marker
    const seriesOptions = {
        cursor: "pointer",
        marker: {
          enabled: REF.chartExpanded == true ? true : false, // Set marker enabled based on REF.chartExpanded
        },
      };

    // Get the chart title
    const title = getTitle();
  
    if (allSeriesAreZero(chartSeries)) {
        // Call the nullishChart() function when all series have zero values
        chartSeries = []
        log(containerId, true)
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
    // Ensure that REF.chartId is set appropriately before calling this function

    // Update REF properties based on the selected chartId
    updateREFFromCodesDataset(REF.chartId);

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
                handleData(d, series, categories);
                const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit];
                buildChart(categories, REF.containerId, yAxisTitle, chartType);
            }
            break;
    }
}


// function to display all countries but its disabled for now
function compareLineChart(type) {
    let testSeries = [];   

    d = chartApiCall();    
    const series = d.Dimension("time").id;
    const categories = d.Dimension("time").id;
    const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit];

    for (const country of REF.geos) {
        const countryData = { name: country, data: [] };
        if(REF.dataset === "nrg_ind_ep"|| REF.dataset === "nrg_ind_ffgae") {
            const indicatorData = {
                data: [],
            };   
            for (let j = 0; j < series.length; j++) {    
                const filteredData = d.Data({
                    geo: country,                  
                    time: series[j]
                });   
                indicatorData.data.push(filteredData.value);
            }           
            countryData.data.push(indicatorData);
           
        } else {
            for (const indicator of REF.indicator) {
                const indicatorData = {
                    data: [],
                };    
                for (let j = 0; j < series.length; j++) {  
                    const filteredData = d.Data({
                        geo: country,
                        [REF.indicator_type]: indicator,
                        time: series[j]
                    });      
                        indicatorData.data.push(filteredData.value);             
                }    
                countryData.data.push(indicatorData);
            }    
           
        }
        testSeries.push(countryData);
      
    }
    
     testSeries = testSeries.map((countryData) => {
        if (countryData.data.length === 1) {
            // Only one indicator, push it as is
            return {
                name: languageNameSpace.labels[countryData.name],
                data: countryData.data[0].data, // Use the single indicator directly
            };
        } else {
            const mergedIndicatorData = []
    
            for (let j = 0; j < series.length; j++) {
                const sum = countryData.data.reduce(
                    (accumulator, indicatorData) => accumulator + indicatorData.data[j],
                    0
                );
                mergedIndicatorData.push(sum);
            }
    
            return {
                name: languageNameSpace.labels[countryData.name],
                data: mergedIndicatorData,
            };
        }
    });   

    chartSeries = testSeries

    buildChart(categories, containerId, yAxisTitle, type);

  
}



