let pieChart; // Declare the chart variable

function createPieChart() {
  startLoadingAnimation()
  REF.chartType = "pieChart";

  showHideBarChartOptions()

  updateREFFromCodesDataset(REF.chartId);

  piechartdata()
  
  const seriesOpt = {
    showInLegend: true,
    dataLabels: {
      enabled: true,
    },
  };


  const pieOpt = {  
    allowPointSelect: true,
    // size: "75%",
    innerSize: "75%",
    showInLegend: true,
    animation: true,
    cursor: "pointer",
    dataLabels: {
        enabled: true,
        style: {
            fontSize: '.8rem',
            fontWeight: 'normal'
        },
        formatter: function () {
          // Split the name by spaces
          const nameParts = this.point.name.split(' ');
          // Insert <br> after the second word if there are enough parts
          if (nameParts.length > 2) {
            nameParts.splice(2, 0, '<br>');
          }
          // Join the parts back together
          const formattedName = nameParts.join(' ');
          
          // Use safe HTML sanitization that works with older Highcharts versions
          const safeName = createSafeHTML ? createSafeHTML(formattedName) : formattedName;
          
          return '<b>' + safeName + '</b>:<br>' +
              'Percentage: ' + Highcharts.numberFormat(this.point.percentage, 1) + '%<br>' +
              languageNameSpace.labels["VAL"] + ': ' + Highcharts.numberFormat(this.point.y, 4) + ' ' + languageNameSpace.labels[REF.unit];
      }
    }
}

  function pieChartNormalTooltip(point) {
    const unit = REF.unit;
    const na = languageNameSpace.labels['FLAG_NA'];

    return `<b>${point.name}:</b> ${point.y} ${unit}<br>`;
}



   const chartOptions = {
    containerId: containerId,
    type: "pie",
    title: getTitle(),
    subtitle: null,
    xAxis: null,
    yAxisFormat: "",
    tooltipFormatter: tooltip,
    creditsText: credits(),
    creditsHref: "",
      series: [{
      name: 'Categories',
      data: piedata.sort((a, b) => b[1] - a[1]),
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

  $('.highcharts-credits').css('display', 'initial');    

}

function piechartdata() {
  const data = chartApiCall();
  
  // Helper function to get indicator label safely
  const getIndicatorLabel = (indicatorCode) => {
    try {
      return data.__tree__.dimension[REF.indicator_type].category.label[indicatorCode] || indicatorCode;
    } catch (error) {
      console.warn('Could not get label for indicator:', indicatorCode, error);
      return indicatorCode;
    }
  };

  // Generate pie data based on whether we have specific indicators or not
  piedata = REF.indicator.length === 0 
    ? // No specific indicators - use the first value with dataset label
      data.value[0] != null && data.value[0] > 0 
        ? [[data.__tree__.label, data.value[0]]] 
        : []
    : // Map indicators to their corresponding values and labels
      REF.indicator
        .map(indicatorCode => {
          const valueIndex = data.__tree__.dimension[REF.indicator_type].category.index[indicatorCode];
          const value = data.value[valueIndex];
          
          return value != null && value > 0 
            ? [getIndicatorLabel(indicatorCode), value]
            : null;
        })
        .filter(Boolean); // Remove null entries

  // Update existing chart if it's already created
  if (REF.chartCreated === true) {
    pieChart.series[0].setData(piedata);
  }

  getTitle();
}

