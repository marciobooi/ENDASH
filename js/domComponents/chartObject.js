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
          spacingBottom: 70,
          style: {
            fontFamily: 'arial,sans-serif',
            animation: true,
            duration: 1000,
          },
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
          labels: {
            format: this.yAxisFormat,
          },
          title: {
            enabled: true,
            text: this.yAxisTitle,            
          },
        },
        colors: this.colors,
        tooltip: {
          formatter: this.tooltipFormatter,
          footerFormat: 'Sum: <b>{point.total}</b>',
          valueDecimals: REF.dataset == "demo_pjan" ? 0 : 3,
          shared: true,
          useHTML: true,    
          padding: 0,         
        },
        credits: {
          text: this.creditsText,
          href: this.creditsHref,
          position:{
            align:'center',
          },   
        },
        legend: this.legend,
        legend: {                
          itemHiddenStyle: {
            color: '#767676'
          },
          itemStyle: {
            fontSize: '1rem',
          }
        },
        plotOptions: {
          column: this.columnOptions,
          pie: this.pieOptions,
          series: this.seriesOptions,
      },
        series: this.series,
        exporting: {      
          enabled: true,
          allowHTML: true,
          sourceWidth: 1200,
          sourceHeight: 800,
          scale: 1,
          chartOptions: {
            subtitle: null,
            credits:"",
            chart: {
              marginTop: 100,
              marginLeft: 100,
              marginRight: 100,
              events: {
                load: function () {                  
                  this.renderer.image(
                    'https://ec.europa.eu/eurostat/statistics-explained/images/0/09/Logo_RGB-POS.png', 
                    1100, 
                    750, 
                    90, 
                    50
                  ).add();
                },
                redraw: function () {
                  const chart = this;
                  const images = chart.container.getElementsByTagName('image');
                  if (images.length > 0) {
                    images[0].setAttribute('x', chart.chartWidth - 100);
                    images[0].setAttribute('y', chart.chartHeight - 40);
                  }
                }
              }
          } 
          },
                      
          buttons: {
              contextButton: {
                  enabled: false
              }
          }, 
          csv: {
            columnHeaderFormatter: function(item, key) {
                if (!item || item instanceof Highcharts.Axis) {
                  const chartLabels = {
                    pieChart: languageNameSpace.labels["INDICATOR"],
                    barChart: languageNameSpace.labels["CTR"],
                    mainChart: languageNameSpace.labels["CTR"],
                    // Add more chart types and their corresponding labels here
                  };                    
                // Default label for unknown chart types
                const defaultLabel = languageNameSpace.labels["YEAR"];  
                const label = chartLabels[REF.chartId] || defaultLabel;
                return label;                   
                } else {
                    return item.name;
                }
            }
        }
      }
    }); // end of chart object
    
    enableScreenREader()

    setTimeout(() => {
      updateAccessibilityLabels()
    }, 500);

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

  
  

  