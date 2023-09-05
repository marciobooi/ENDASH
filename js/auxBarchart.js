function createBarChart() {
  startLoadingAnimation()

  const type = "column"   

  showHideBarChartOptions()

  REF.dataset == "demo_pjan" ? d = chartEightCalculation(d) : d = chartApiCall();                    

  const series = d.Dimension("geo").id;
  const categories = d.Dimension("geo").id;  


  handleData(d, series);   

  const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit]   

  const fullChart = $(window).width() > 1300;

  const legendBig = {
      align: 'right',
      verticalAlign: 'middle',
      layout: 'vertical'
  };
  
  const legendSmall = {     
      layout: 'horizontal'
  }

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
    legend: fullChart? legendBig : legendSmall,
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

const chart = new Chart(chartOptions);

chart.createChart();




    

  stopLoadingAnimation()
}
