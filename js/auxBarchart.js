function createBarChart() {
  startLoadingAnimation()



  const type = "column"   

  REF.dataset == "demo_pjan" ? d = chartEightCalculation(d) : d = chartApiCall();                    

  const series = d.Dimension("geo").id;
  const categories = d.Dimension("geo").id;  

  handleData(d, series);   

  const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit]   

  // buildChart(categories, REF.containerId, yAxisTitle, type);




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
    legend: fullChart? legendBig : legendSmall,
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




    

  stopLoadingAnimation()
}
