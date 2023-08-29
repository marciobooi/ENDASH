
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

    const xAxis = REF.chartOpt === "compareChart"
        ? { categories: categories.map(category => languageNameSpace.labels[category]), labels: { step: 0 } }
        : { categories: categories, labels: REF.compare == true ? {step: 0} : {step: 10} };

    const chartOptions = {
        containerId: containerId,
        type: type,
        title: getTitle(),
        subtitle: null,
        xAxis: xAxis,
        yAxisFormat: '{value:.2f}',
        yAxisTitle:  yAxisTitle,
        tooltipFormatter: '',
        creditsText: '',
        creditsHref: "",
        series: chartSeries,
        colors: colors,
        legend: { enabled: false },
        columnOptions: {
            stacking: REF.percentage == 0 ? "normal" : "percent",
            events: {
              mouseOver: function () {
                var point = this;
                var color = point.color;
                $('path.highcharts-label-box.highcharts-tooltip-box').css('stroke', color);
              }
            }
          },
        seriesOptions: { cursor: "pointer" }
    };

    const chart = new Chart(chartOptions);

    chart.createChart();
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
                data.push(d.value[0]);
                d.value.shift();
            }
            newObj = {
                name: d.__tree__.dimension[indicator_type].category.label[indicator[item]],
                data: data,
            };
            chartSeries.push(newObj);
        }
    }

}

function chartEightCalculation(d) {
    urlChartEightOne = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_bal_c?";
    urlChartEightOne += "format=JSON";
    urlChartEightOne += "&lang=" + REF.language;
    urlChartEightOne += "&siec=TOTAL&unit=KTOE&nrg_bal=FC_OTH_HH_E";


    urlChartEightOne += "&geo=" + REF.geos;


    d = JSONstat(urlChartEightOne).Dataset(0);

    year = d.Dimension("time").id;
    chartEightyears = year;

    urlChartEightTwo = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjan?";
    urlChartEightTwo += "format=JSON";
    urlChartEightTwo += "&lang=" + REF.language;
    urlChartEightTwo += "&age=TOTAL&sex=T";

    urlChartEightTwo += "&geo=" + REF.geos;

    for (let i = 0; i < year.length; i++)
        urlChartEightTwo += "&time=" + year[i];

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

 log(REF)

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

 

    if(REF.chartOpt === "compareChart") {

        if(REF.chartType === "barChart") {

            const type = "column"   

            d = chartApiCall();
        
            const series = d.Dimension("geo").id;
            const categories = d.Dimension("geo").id;  
        
            handleData(d, series);   
        
            const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit]   
        
            buildChart(categories, REF.chartId, yAxisTitle, type);

            REF.chartOpt = "mainChart"
        } else {          

            createPieChart ()

            REF.chartOpt = "mainChart"

        }




    } else {

        const type = "spline"
      
        d = chartApiCall();
    
        const series = d.Dimension("time").id;
        const categories = d.Dimension("time").id;               
    
        handleData(d, series);     

        const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit]    

         buildChart(categories, REF.chartId, yAxisTitle, type);  

        REF.chartOpt = "compareChart"
    }
    
}