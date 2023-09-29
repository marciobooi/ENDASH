
function endash(d = null) {

   
setTimeout(() => {
        Highcharts.charts.forEach(chart => {
            if (chart) {
                chart.showLoading();
            }
        });
}, 100);           

   
        REF.dataset = codesDataset[REF.chartId].dataset;
        REF.unit = codesDataset[REF.chartId].unit;
        REF.indicator = codesDataset[REF.chartId].indicator;
        REF.indicator2 = codesDataset[REF.chartId].indicator2;
        containerId = codesDataset[REF.chartId].container;
        REF.indicator_type = codesDataset[REF.chartId].indicator_type;
        REF.indicator2_type = codesDataset[REF.chartId].indicator2_type;
        REF.title = codesDataset[REF.chartId].title;
        REF.chartType = "lineChart"

        const type = "spline"

        chartSeries = [];

        if(REF.dataset == "demo_pjan") {            
           
        d = chartEightCalculation(d);      
  
        const yAxisTitle = 'kilograms of oil equivalent'
        const categories = d.Dimension("time").id;
  
        buildChart(categories, containerId, yAxisTitle, type);  

        } else {       
    
            d = chartApiCall();
    
            // const indicator_type = REF.indicator_type
        
            const series = d.Dimension("time").id;
            const categories = d.Dimension("time").id;               
        
            handleData(d, series);     
    
            const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit]    

             buildChart(categories, containerId, yAxisTitle, type);     
       
        }

        setTimeout(() => {
            Highcharts.charts.forEach(chart => {
                if (chart) {                             
                    chart.hideLoading();
                }
            });
    }, 500);    
}



function buildChart(categories, containerId, yAxisTitle, type) {

    if (containerId === undefined) {
        containerId = codesDataset[REF.chartId].container;
      }

    const xAxis = { categories: categories, labels: REF.chartExpanded == true ? {step: 0} : {step: 10} }

    const seriesOptions = { cursor: "pointer",  marker:REF.chartExpanded == true ? {enabled:true} : {enabled:false},
    // point: {
    //     events: {
    //       click: function () {
    //         const point = this;
    //         const series = point.series;
    //         indicator = series.userOptions.indicator           
    //         compareLineChart(indicator)
    //       }
    //     }
    // }
}    

     const title = getTitle()

    const chartOptions = {
        containerId: containerId,
        type: type,
        title: title,
        subtitle: null,
        xAxis: xAxis,
        yAxisFormat: '{value:.2f}',
        yAxisTitle:  yAxisTitle,
        tooltipFormatter: '',
        creditsText: '',
        creditsHref: "",
        series: chartSeries,
        colors: colors,
        legend: {},

        seriesOptions: seriesOptions
    };

    const customChart = new Chart(chartOptions);
    lineChart = customChart.createChart();

    if($( "#"+REF.chartId ).hasClass( "expand" )){
        lineChart.update({ legend: legendSmall }, true);      
    } else {
        lineChart.update({ legend: legendHide }, true);   
    }  
}

function handleData(d, series ) {
    const indicator_type = REF.indicator_type
    const indicator = REF.indicator;    

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

    // REF.chartId = chartToLoad
    REF.dataset = codesDataset[REF.chartId].dataset;
    REF.unit = codesDataset[REF.chartId].unit;
    REF.indicator = codesDataset[REF.chartId].indicator;
    REF.indicator2 = codesDataset[REF.chartId].indicator2;
    containerId = codesDataset[REF.chartId].container;
    REF.indicator_type = codesDataset[REF.chartId].indicator_type;
    REF.indicator2_type = codesDataset[REF.chartId].indicator2_type;
    REF.title = codesDataset[REF.chartId].title;


    chartSeries = [];


    switch (REF.chartType) {
        case "barChart":
            createBarChart()
            break;
        case "pieChart":
            createPieChart ()
            break; 
        default:
        const type = "spline"

        if(REF.dataset == "demo_pjan") {            
           
            d = chartEightCalculation(d);      
      
            const yAxisTitle = 'kilograms of oil equivalent'
            const categories = d.Dimension("time").id;
      
            buildChart(categories, containerId, yAxisTitle, type);  
            
        } else {

            d = chartApiCall();
    
            const series = d.Dimension("time").id;
            const categories = d.Dimension("time").id;               
        
            handleData(d, series);     
    
            const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit]    
    
            buildChart(categories, REF.containerId, yAxisTitle, type);  
        }


            break;
    }
 


    
}


// function to display all countries but its disabled for now
function compareLineChart(indicator) {
    log(indicator)

    const type = "spline"

    const indicator_type = `&${REF.indicator_type}=`

    REF.dataset = codesDataset[REF.chartId].dataset;
    containerId = codesDataset[REF.chartId].container;


    let url = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/" + REF.dataset + "?";
    url += "format=JSON";
    url += "&lang=" + REF.language;
    url += "&unit=" + codesDataset[REF.chartId].unit; 
    url += indicator_type + indicator
    for (let i = 0; i < defaultGeos.length; i++) url += "&geo=" + defaultGeos[i]; 

    d = JSONstat(url).Dataset(0);

    log(d)

    
    const series = d.Dimension("time").id;
    const categories = d.Dimension("time").id;               

    for (let item in defaultGeos) {
        data = [];
        for (let j = 0; j < series.length; j++) {
            const value = d.value[0];
            data.push(value === null ? 0 : value);
            d.value.shift();
        }
        newObj = {
            name: defaultGeos[item],
            data: data,          
        };
        chartSeries.push(newObj);
    }

    log(chartSeries)

    const yAxisTitle = d.__tree__.dimension.unit.category.label[codesDataset[REF.chartId].unit]    

    buildChart(categories, REF.containerId, yAxisTitle, type);  

    
}