let pieChart; // Declare the chart variable

function createPieChart() {
  startLoadingAnimation()
  REF.chartType = "pieChart";

  showHideBarChartOptions()

  REF.dataset = codesDataset[REF.chartId].dataset;
  REF.unit = codesDataset[REF.chartId].unit;
  REF.indicator = codesDataset[REF.chartId].indicator;
  REF.indicator2 = codesDataset[REF.chartId].indicator2;
  containerId = codesDataset[REF.chartId].container;
  REF.indicator_type = codesDataset[REF.chartId].indicator_type;
  REF.indicator2_type = codesDataset[REF.chartId].indicator2_type;
  REF.title = codesDataset[REF.chartId].title;

  piechartdata()
  
  const seriesOpt = {
    innerSize: "75%",
    showInLegend: true,
    dataLabels: {
      enabled: true,
    },
  };

  const pieOpt = {  
      allowPointSelect: true,
      animation: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>:<br>{point.percentage:.1f} %<br>value: {point.y:,.4f} " + REF.unit
      },
  } 

   const chartOptions = {
    containerId: containerId,
    type: "pie",
    title: getTitle(),
    subtitle: null,
    xAxis: null,
    yAxisFormat: "",
    tooltipFormatter: "",
    creditsText: credits(),
    creditsHref: "",
      series: [{
      name: 'Categories',
      data: piedata
    }],
    colors: colors,
    legend: {},
    pieOptions: pieOpt,
    columnOptions: null,
    seriesOptions: seriesOpt,
  
  };
  
  const customChart = new Chart(chartOptions);
  pieChart = customChart.createChart();

  REF.chartCreated = true;
  
  changeLegendPisition(pieChart);     

  $(window).on('resize', function () {
    changeLegendPisition(pieChart);
  });

  stopLoadingAnimation()
  REF.chartOpt = "compareChart"
}

function piechartdata() {
  piedata = [];

  d = chartApiCall();

  for (i = 0; i < REF.indicator.length; i++) {
    if (d.value[i] != null) {
        piedata.push(
          [d.__tree__.dimension[REF.indicator_type].category.label[REF.indicator[i]],
            d.value[i]]
        );
      
    }
  }

  if(REF.chartCreated === true){
    pieChart.series[0].setData(piedata);
  }
  

}
