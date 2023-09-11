function createBarChart() {
  startLoadingAnimation()

  const type = "column"   

  showHideBarChartOptions()

  REF.dataset == "demo_pjan" ? d = chartEightCalculation(d) : d = chartApiCall();                    

  const series = d.Dimension("geo").id;
  const categories = d.Dimension("geo").id;  


  handleData(d, series);   

  const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit]   


  const xAxis = REF.chartOpt === "compareChart"
  ? { categories: categories.map(category => languageNameSpace.labels[category]), labels: { step: 0 } }
  : { categories: categories, labels: REF.compare == true ? {step: 0} : {step: 10} };


  const tooltipFormatter = function() {
    return tooltipTable(this.points) ;
  };


  const chartOptions = {
    containerId: containerId,
    type: type,
    title: getTitle(),
    subtitle: null,
    xAxis: xAxis,
    yAxisFormat: '{value:.2f}',
    yAxisTitle:  yAxisTitle,
    tooltipFormatter: tooltipFormatter,
    creditsText: credits(),
    creditsHref: "",
    series: chartSeries,
    colors: colors,
    legend: {},
    columnOptions: {
        stacking: REF.percentage == 0 ? "normal" : "percent",
        connectNulls: true,
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


const customChart = new Chart(chartOptions);
barChart = customChart.createChart();

updateLegend(barChart);     

$(window).on('resize', function () {
  updateLegend(barChart);
});

    

  stopLoadingAnimation()
}
