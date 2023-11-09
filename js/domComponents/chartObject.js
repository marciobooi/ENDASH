class Chart {
    constructor(options) {
      this.containerId = options.containerId;
      this.type = options.type;
      this.title = options.title;
      this.subtitle = options.subtitle;
      this.xAxis = options.xAxis;
      this.yAxisFormat = options.yAxisFormat;
      this.tooltipFormatter = options.tooltipFormatter;
      this.creditsText = options.creditsText;
      this.creditsHref = options.creditsHref;
      this.series = options.series;
      this.colors = options.colors;
      this.legend = options.legend;
      this.columnOptions = options.columnOptions;
      this.pieOptions = options.pieOptions;
      this.seriesOptions = options.seriesOptions;
      this.yAxisTitle = options.yAxisTitle;
    }
  
    createChart() {
      var chart = Highcharts.chart(this.containerId, {
        chart: {
          type: this.type,
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          animation: false,
           events: {
            load() {
              const chart = this;
              chart.showLoading();
              setTimeout(function() {
                chart.hideLoading();
              }, 800);
            }
          }
        },
        title: {
          text: this.title,
        },
        subtitle: {
          text: this.subtitle,
        },
        xAxis: this.xAxis,
        yAxis: {
          // labels: {
          //   format: this.yAxisFormat,
          // },
          title: {
            enabled: true,
            text: this.yAxisTitle,         
            style: {             
              wordWrap:'break-word',
              step:1,
              width : "200px"
            }   
          },

        },
        colors: this.colors,
        tooltip: {
          formatter: this.tooltipFormatter,
          valueDecimals: REF.dataset == "demo_pjan" ? 0 : 3,
          shared: true,
          useHTML: true,    
          padding: 5,          
          backgroundColor: "rgba(255,255,255,0.8)",   
        },
        credits: {
          text: this.creditsText,
          href: this.creditsHref,
          position:{
            align:'center',
          },   
        },
        legend: this.legend,
        plotOptions: {
          column: this.columnOptions,
          pie: this.pieOptions,
          series: this.seriesOptions,
      },
        series: this.series,
        exporting: {         
            enabled: true,
            sourceWidth: 1200,
            sourceHeight: 600,
            chartOptions: {
              xAxis: [{
                labels: {
                  style: {
                    fontSize: '10px'
                  }
                }
              }]
            },                   
          buttons: {
              contextButton: {
                  enabled: false
              }
          }
      }
    }); // end of chart object


      return chart

    } // end of chart function
    
  }

  // function that return empty chart for when is no data to display
  function nullishChart(containerId, chartSeries) {
      Highcharts.setOptions({lang: {noData: languageNameSpace.labels['ERROR2']}})

    Highcharts.chart(containerId, {   
      exporting: {
          enabled: false // Hide the exporting menu (burger menu)
      },
      xAxis: {
          visible: false // Hide the x-axis
      },
      yAxis: {
          visible: false // Hide the y-axis
      },
      credits: credits(),
      series: [{
          visible: false, // Hide the series
          showInLegend: false,
          data: []
      }]
  });
  }

  
  

  