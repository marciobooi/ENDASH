function createBarChart() {
  startLoadingAnimation()

  const type = "column"   

  showHideBarChartOptions()

  REF.dataset == "demo_pjan" ? d = chartEightCalculation(d) : d = chartApiCall();                    

  const series = d.Dimension("geo").id;
  const categories = d.Dimension("geo").id;  

  handleData(d, series);   

  const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit]   


  // const xAxis = REF.chartOpt === "compareChart"
  // ? { categories: categories.map(category => languageNameSpace.labels[category]), labels: { step: 0 } }
  // : { categories: categories, labels: REF.compare == true ? {step: 0} : {step: 10} };

  const xAxis = { categories: categories.map(category => languageNameSpace.labels[category]), labels: { step: 0 } }


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
      seriesOptions: {
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              const point = this;
              const series = point.series;
              const chart = series.chart;
          
              // Check if we've already stored original colors in the chart object
              if (!chart.originalColors) {
                  chart.originalColors = {};
          
                  // Store the original colors of each series' data points when the chart is initially rendered
                  chart.series.forEach((s) => {
                      chart.originalColors[s.name] = {};
                      s.data.forEach((p) => {
                          chart.originalColors[s.name][p.index] = p.color;
                      });
                  });
              }
          
              // Find the index of the clicked point within its stack
              const stackIndex = series.data.indexOf(point);
          
              // Toggle or restore the color of the corresponding points in each series
              chart.series.forEach((s) => {
                  s.data.forEach((p, index) => {
                      if (index === stackIndex) {
                          // Check the current color of the point
                          if (p.color === 'lightgray') {
                              // Restore the original color
                              p.update({ color: chart.originalColors[s.name][index] });
                          } else {
                              // Toggle the color to lightgray
                              p.update({ color: 'lightgray' });
                          }
                      }
                  });
              });
          },
          mouseOver: function () {
            var point = this;
            var color = point.color;
           if (color === 'lightgray') {
            // Disable the tooltip by setting enabled to false
            return false;
        }


          }
          
          
          },
        },
      }
};


const customChart = new Chart(chartOptions);
barChart = customChart.createChart();

changeLegendPisition(barChart);     

$(window).on('resize', function () {
  changeLegendPisition(barChart);
});

    

  stopLoadingAnimation()
}
