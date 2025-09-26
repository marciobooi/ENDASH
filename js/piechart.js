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
  piedata = [];

  d = chartApiCall();

  console.log(d)

  if(REF.indicator.length == 0) {

  for (i = 0; i < 1; i++) {
    if (d.value[i] != null || d.value[i] > 0) {
        piedata.push(
          [d.__tree__.label,
            d.value[i]]
        );
      
    }
  }

  } else {

    for (i = 0; i < REF.indicator.length; i++) {
      // Get the correct index for this indicator from the dataset
      const indicatorCode = REF.indicator[i];
      const valueIndex = d.__tree__.dimension[REF.indicator_type].category.index[indicatorCode];
      const value = d.value[valueIndex];
      
      if (value != null && value > 0) {        
        // Get the label from the correct data structure
        let indicatorLabel;
        try {
          indicatorLabel = d.__tree__.dimension[REF.indicator_type].category.label[indicatorCode];
        } catch (error) {
          console.warn('Could not get label for indicator:', indicatorCode, error);
        }
        
        // Fallback to indicator code if label not found
        if (!indicatorLabel) {
          indicatorLabel = indicatorCode;
        }
        
        piedata.push([indicatorLabel, value]);
      }
    }

  }

  if(REF.chartCreated === true){
    pieChart.series[0].setData(piedata);
  }  

  getTitle()

}

