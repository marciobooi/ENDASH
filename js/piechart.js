function createPieChart() {
  startLoadingAnimation()
  REF.chartType = "pieChart";

  REF.dataset = codesDataset[REF.chartId].dataset;
  REF.unit = codesDataset[REF.chartId].unit;
  REF.indicator = codesDataset[REF.chartId].indicator;
  REF.indicator2 = codesDataset[REF.chartId].indicator2;
  containerId = codesDataset[REF.chartId].container;
  REF.indicator_type = codesDataset[REF.chartId].indicator_type;
  REF.indicator2_type = codesDataset[REF.chartId].indicator2_type;
  REF.title = codesDataset[REF.chartId].title;


  piechartdata()
 
  const chartTitle = getTitle()

 

  
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
  
  const fullChart = $(window).width() > 700;

  const legendBig = {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical'
  };
  
  const legendSmall = {     
      layout: 'horizontal'
  }

  const chartOptions = {
    containerId: containerId,
    type: "pie",
    title: chartTitle,
    subtitle: null,
    xAxis: null,
    yAxisFormat: "",
    tooltipFormatter: "",
    creditsText: credits(),
    creditsHref: "",
    series: [
      {
        data: piedata.reverse(),
        name: languageNameSpace.labels["S_" + REF.currency] +"/" +languageNameSpace.labels["S_" + REF.unit],
      },
    ],
    colors: colors,
    legend: fullChart? legendBig : legendSmall,
    pieOptions: pieOpt,
    columnOptions: null,
    seriesOptions: seriesOpt,
  
  };
  
  const chart = new Chart(chartOptions);
  chart.createChart();
  stopLoadingAnimation()

  REF.chartOpt = "compareChart"

}


function piechartdata() {
  piedata = [];

  d = chartApiCall();

  for (i = 0; i < REF.indicator.length; i++) {
    if (d.value[i] != null) {
        piedata.push([
          d.__tree__.dimension[REF.indicator_type].category.label[REF.indicator[i]],
          d.value[i]
        ]);
      
    }
  }
}
