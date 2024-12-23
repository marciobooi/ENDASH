var log = console.log.bind(console);

var isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 850 || /Mobi|Android/i.test(navigator.userAgent) && (window.innerWidth < window.innerHeight);


var legendBig = {
  align: 'right',
  verticalAlign: 'middle',
  layout: 'vertical'
};

var legendSmall = {     
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
}

var legendHide = {     
  enabled: false
}



function changeLegendPisition() {

  openChart = codesDataset[REF.chartId].container;

    Highcharts.charts.forEach(chart => {
      if (chart) {
        if(chart.renderTo.id === openChart) {
            if ($(window).width() > 1100) {
              $('.flex-item.chartContainer.expand .highcharts-credits').css( "transform", "translate(38%, -10%)")
              chart.update({ legend: legendBig }, true); // true for redraw
            } else {
              $('.flex-item.chartContainer.expand .highcharts-credits').css( "transform", "translate(0, 0)")
              chart.update({ legend: legendSmall }, true); // true for redraw
            }
            chart.redraw()
        }        
      }
  });
}



formMessage = (/The endash tool is down since:     (.*)/)

function openMeta() {
  const eurostatBaseUrl = "https://ec.europa.eu/eurostat/cache/metadata/en/";

  if (REF.meta === "ilc_sieusilc") {
    window.location.href = eurostatBaseUrl + "ilc_sieusilc.htm";
  } else if (REF.meta === "NONE") {
    alert(languageNameSpace.labels['ERROR1']);
  } else {
    window.location.href = eurostatBaseUrl + REF.meta + "_esmsip2.htm";
  }
}



function openDataset() {
  const eurostatBaseUrl = "https://ec.europa.eu/eurostat/databrowser/view/";

  const url = `${eurostatBaseUrl}${REF.dataset}/default/table?lang=${REF.language}`;

  window.location.href = url;
}

//  orderByPiles = (countriesAndValues, x, y) => {
//   const categories = Object.values(x).map(country => languageNameSpace.labels[country]);
//   const fuelTypes = Object.values(y).map(fuel => languageNameSpace.labels[fuel]);

//   const mySeries = fuelTypes.map((fuel, i) => ({
//     name: fuel,
//     data: countriesAndValues[i].data.map(element => element)
//   }));

//   const categoriesAndPiles = categories.map((name, index) => ({
//     name,
//     piles: mySeries.map(serie => ({
//       name: serie.name,
//       value: serie.data[index]
//     }))
//   }));

//   categoriesAndPiles.sort((a, b) => {
//     const sumA = a.piles.reduce((sum, pile) => sum + pile.value, 0);
//     const sumB = b.piles.reduce((sum, pile) => sum + pile.value, 0);
//     return sumB - sumA;
//   });

//   const myXAxis = categoriesAndPiles.map(category => category.name);

//   mySeries.forEach(serie => {
//     serie.data = categoriesAndPiles.map(category => category.piles.find(pile => pile.name == serie.name).value);
//   });

//   return {
//     myXAxis,
//     mySeries
//   };
// };


//  makeOrderedSeries = (categoriesAndStacks) => {
//   const ordSeries = [];

//   bardata = REF.chartId == "lineChart" ? linedata : bardata;

//   for (let i = 0; i < categoriesAndStacks[0].y.length; i++) {
//     const temp = categoriesAndStacks.map(category => category.y[i]);
//     ordSeries.push({
//       index: bardata[i].index,
//       name: bardata[i].name,
//       legendIndex: bardata[i].legendIndex,
//       id: bardata[i].id,
//       data: temp
//     });
//   }

//   const [temp] = ordSeries.splice(1, 1);
//   ordSeries.push(temp);

//   return ordSeries;
// };




function exportHandling(id) {
  const chartToPrint = `#${codesDataset[REF.chartId].container}`;

  const exportFunctions = {
    'printBtn': () => $(chartToPrint).highcharts().print(),
    'downloadBtn': () => $(chartToPrint).highcharts().exportChart(),
    'excelBtn': () => $(chartToPrint).highcharts().downloadXLS(),
  };

  const selectedFunction = exportFunctions[id];

  if (selectedFunction) {
    selectedFunction();
  } else {
    console.log('Invalid operation');
  }

// function exportJpegChart() { $(chartToPrint).highcharts().exportChart({type: 'image/jpeg'})};
// function exportPdfChart() { $(chartToPrint).highcharts().exportChart({type: 'application/pdf'})};
// function exportSvgChart() { $(chartToPrint).highcharts().exportChart({type: 'image/svg+xml'})};
// function exportCsvChart() { $(chartToPrint).highcharts().downloadCSV()};
}



function exportTable() {
  window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('.highcharts-data-table').html()));
}

function showHideBarChartOptions() {
  if (REF.chartType !== "barChart") {
      $("#togglePercentage, #Agregates").css('display', 'none');
      $("#countrySelect").css('display', '');
  } else {
      $("#togglePercentage, #Agregates").css('display', '');
      $("#countrySelect").css('display', 'none');
  }
}


function showHideTimeLine() {
  const timelineContainer = document.getElementById('timelineContainer');

  // Check if a timeline instance exists
  if (this.timeline) {
    // Remove the existing timeline
    this.timeline.removeFromDOM();
    this.timeline = null;
  }

  if (REF.chartType === 'barChart' || REF.chartType === 'pieChart') {
    // Create and add the Timeline instance to the DOM
    this.timeline = new Timeline(timelineContainer);

    // Display the timeline
    this.timeline.addToDOM();

    // Show specific chart options
    showChartOptions();
  } else {
    // Hide specific chart options
    hideChartOptions();
  }
}

function showChartOptions() {
  // Show chart-specific options
  $('#togglePercentage').css('display', 'block');
  $('#Agregates').css('display', 'block');
}

function hideChartOptions() {
  // Hide chart-specific options
  $('#togglePercentage').css('display', 'none');
  $('#Agregates').css('display', 'none');
}

function addAuxiliarBarGraphOptions() {
  auxiliarBarGraphOptions = new ChartControls();
  auxiliarBarGraphOptions.addToDOM("#subnavbar-container"); 

  FloatingControls = new FloatingChartControls();
  FloatingControls.addToDOM("#componentFooter > footer"); 

  const footerElement = document.querySelector("#componentFooter > footer");
  const menuSwitchElement = document.querySelector("#menuSwitch");
  
  footerElement.insertBefore(menuSwitchElement, footerElement.firstChild);
  
  footerElement.style.justifyContent = 'space-between';

  showHideTimeLine()
}

function removeAuxiliarBarGraphOptions() {
log('here')
  
  REF.chartType =  "lineChart"
  REF.percentage = 0
  REF.chartExpanded = false

  dataNameSpace.setRefURL();

  compareCountries() 

  closeTable()

  showHideTimeLine()

  $('#menuSwitch').remove();
  var parentContainer = $(".flex-container").find(".expand");
  parentContainer.removeClass("expand");
  parentContainer.attr('aria-expanded', 'false');
  $(this).remove();

    $( ".flex-container" ).find( ".flex-item.chartContainer" ).css( "display", "initial" );
      parentContainer.find( ".highchartsContainerExpand" ).removeClass('highchartsContainerExpand')


      Highcharts.charts.forEach(chart => {
        if (chart) {
          chart.update({ legend: legendHide }, true); 
            chart.reflow();
        }
    });

    const chartContainer = document.getElementById("endash");

    // Empty the content of the div
    chartContainer.innerHTML = "";

    const rebuiltCharts = new ChartContainer();
    rebuiltCharts.addToDOM("#endash");


  const auxiliarBarGraphOptions = new ChartControls();
  auxiliarBarGraphOptions.removeFromDOM("#subnavbar-container");

  getTitle()

  $(".containerNav").css('visibility', 'initial')
  const footerElement = document.querySelector("#componentFooter > footer");  
  footerElement.style.justifyContent = 'flex-end';  
}

function showChartMenuOptions() {
  $('#tb-togle-percentage').css('display', "initial") 
  $('#toggleAgregates').css('display', "initial") 
  $('#timelineContainer').css('display', "initial") 
}
function hideChartMenuOptions() {

  $('#timelineContainer').css('display', "none") 
  $('#togglePercentage').css('display', "none") 
  $('#Agregates').css('display', "none") 
}

// function sortArrayAlphabetically() {
//   if (REF.detail == 1) {
//     categoriesAndStacks.sort((a, b) => a.x.localeCompare(b.x));
//   } else {
//     bardata.sort((a, b) => a.name.localeCompare(b.name, undefined, { ignorePunctuation: true, sensitivity: 'base' }));
//   }
// }

// function sortArrayByAscValues(arr) {
//   if (REF.detail == 1) {
//     arr.sort((a, b) => {
//       const sumA = a.y.reduce((acc, val) => acc + val, 0);
//       const sumB = b.y.reduce((acc, val) => acc + val, 0);
//       return sumA - sumB;
//     });
//   } else {
//     arr.sort((a, b) => a.y % 2 - b.y % 2 || a.y - b.y);
//   }
// }

// function sortArrayByDescValues(arr) {
//   if (REF.detail == 1) {
//     arr.sort((a, b) => {
//       const sumA = a.y.reduce((acc, val) => acc + val, 0);
//       const sumB = b.y.reduce((acc, val) => acc + val, 0);
//       return sumB - sumA;
//     });
//   } else {
//     arr.sort((a, b) => b.y % 2 - a.y % 2 || b.y - a.y);
//   }
// }

// function sortArrayByProtocolOrder(arr) {
//   if (REF.detail == 1) {
//     const energyCountriesCodes = REF.geos;
//     arr.sort((a, b) => {
//       if (a.code === "all") return -1; // Move "all" to the beginning
//       if (b.code === "all") return 1; // Move "all" to the beginning
//       return energyCountriesCodes.indexOf(a.code) - energyCountriesCodes.indexOf(b.code);
//     });
//     orderedSeries = makeOrderedSeries(categoriesAndStacks);
//   } else {
//     barproto = [];
//     bardata = barproto;

//     const geosProto = REF.geos.filter(geop => geop !== "all"); // Ignore "all" in REF.geos

//     geosProto.map((geop, gIdx) => {
//       geos.map((geo, yIdx) => {
//         if (geop == geo && geop !== "all") {
//           values = tax.map((tax, cIdx) => {
//             return (num = arr.value[cIdx * geos.length + yIdx]);
//           });
//         }
//       });

//       const taxValue = REF.component == 1
//         ? parseFloat((values.reduce((a, b) => a + Number(b), 0) * factor).toFixed(dec))
//         : parseFloat((values[0] * factor).toFixed(dec));

//       barcateg.push(languageNameSpace.labels[geop]);

//       const languageLabel = languageNameSpace.labels[geop];
//       const color = geop == "EU27_2020" ? '#14375a' : (geop == "EA" ? '#800000' : "#32afaf");

//       barproto.push({ name: languageLabel, y: taxValue, color });
//     });
//   }
// }


tooltip = function () {
  const unit = REF.unit; 
  const na = languageNameSpace.labels['FLAG_NA'];

  const formatPointTooltip = function (point) {
      const formattedY = Number(point.y).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3, useGrouping: true }).replace(/,/g, ' ');
      if (REF.chartType === "pieChart") {
          return `<tr class=""><td><span style="padding-right: 5px; color:${point.color}">\u25CF</span> ${point.name}:</td><td>${formattedY} ${unit}</td></tr>`;
      } else {
          return `<tr class=""><td><span style="padding-right: 5px; color:${point.color}">\u25CF</span> ${point.series.name}:</td><td>${formattedY}</td></tr>`;
      }
  };

  // Calculate total
  let total = 0;
  if (REF.chartType !== "pieChart") {
      this.points.forEach(function (point) {
          total += point.y;
      });
  }

  // Construct the complete tooltip content
  const tooltipRows = REF.chartType === "pieChart" ? formatPointTooltip(this.point) : this.points.map(formatPointTooltip).join('');
  const totalRow = REF.chartType !== "pieChart" ? 
  `<tr><td><b>${languageNameSpace.labels['TOTAL']}:</b></td><td><b>${total.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3, useGrouping: true }).replace(/,/g, ' ')}</td></tr>` : '';

  // Create the HTML table structure
  const html = `  
      <table class="table_component">
          <thead>
              <tr>
                  <th scope="col" colspan="2">${REF.chartType === "pieChart" ? languageNameSpace.labels[REF.geos] : this.x}</th>   
              </tr>
          </thead>
          <tbody>       
              ${tooltipRows}
              ${totalRow}        
          </tbody>
      </table>`;
  return html;   
}



function tooltipTable(points) {
  
  if(REF.percentage == 1 ){
    let html = "";
    html += `<table id="tooltipTable" class="table_component">                
                <thead>
                  <tr>
                    <th scope="cols">${points[0].x}</th>                    
                    <th scope="cols"></th>                    
                  </tr>
                </thead>`
      points.forEach(element => {
          const value = element.point.percentage.toFixed(0); // Limit decimals to three places
          const category = element.point.series.name; 
          const color = element.point.color;              
          html += `<tr>
                      <td><svg width="10" height="10" style="vertical-align: baseline;"><circle cx="5" cy="5" r="3" fill="${color}" /></svg> ${category}</td>
                      <td>${value} %</td>
                  </tr>` 
      });
    html += `</table>`;
    return `<div>${html}</div>`;
  } else {
    let html = "";
    let totalAdded = false; // Flag to track if the total row has been added
    let totalColor = "rgb(14, 71, 203)";

    
    // Sort the points so that the "Total" item is at the last place
    const sortedPoints = points.sort(function (a, b) {
      if (a.series.name == languageNameSpace.labels['TOTAL']) return 1;
      if (b.series.name == languageNameSpace.labels['TOTAL']) return -1;
      return 0;
    });


    
    html += `<table id="tooltipTable" class="table_component">                
      <thead>
        <tr>
          <th scope="cols">${sortedPoints[0].key}</th>                    
          <th scope="cols"></th>                    
        </tr>
      </thead>`;
    
    sortedPoints.forEach(function (point) {
      const color = point.series.color;
      const value = point.y.toFixed(2); // Limit decimals to three places
      const category = point.series.name;    

      log(category)

      if(REF.details != 0) {
        html += `<tr>
        <td><svg width="10" height="10" style="vertical-align: baseline;"><circle cx="5" cy="5" r="3" fill="${color}" /></svg> ${category}</td>
        <td>${value}</td>
      </tr>`;
      }    
      // Check if point is "Total" and set the flag if found
      if (category == languageNameSpace.labels['TOTAL']) {
        totalAdded = true;
      }
    });
    
    // Check if all values are zero and display a message if they are
    const allValuesZero = sortedPoints.every(function (point) {
      return point.y === 0;
    });
   
    if (allValuesZero) {
      html = 
    `<table id="tooltipTable" class="table_component">                
    <thead>
      <tr>
        <th scope="cols">${sortedPoints[0].key}</th>                                    
      </tr>
    </thead><tr>      
    <td>${languageNameSpace.labels["FLAG_NA"]}</td>
  </tr></table>`;


    } else {
      // Add a row for the total if not already added
      if (!totalAdded) {
        // Calculate the total sum of all values
        const totalSum = sortedPoints.reduce(function (sum, point) {
          return sum + point.y;
        }, 0);
    
        // Format the total sum with three decimal places
        const totalValue = totalSum.toFixed(2);
    
        // Add a row for the total
        html += `<tr>
          <td><svg width="10" height="10" style="vertical-align: baseline;"><circle cx="5" cy="5" r="3" fill="${totalColor}" /></svg> ${languageNameSpace.labels['TOTAL']}</td>
          <td>${totalValue}</td>
        </tr>`;
      }
    }    
    html += `</table>`; 
    return `<div>${html}</div>`;
    
  }
}

function getTitle(yAxisTitle) {

  const titleElement = $(`#${containerId}`).prev();

  let title
  let unit = yAxisTitle

  const btn = `<button class="ecl-button ecl-button--primary round-btn expandChart" data-i18n-label="BTNEXPAND" aria-label="${languageNameSpace.labels["BTNEXPAND"]}" data-i18n-title="BTNEXPAND" title="${languageNameSpace.labels["BTNEXPAND"]}">
                <i class="fas fa-expand-alt" aria-hidden="true"></i>
              </button>`;

switch (REF.chartType) {
  case "barChart":
    title = `${languageNameSpace.labels[REF.title] } - ${languageNameSpace.labels['BOX_SELECTION_ALL_COUNTRY']} - ${REF.year}`
    $("#title").html(title)
    break;
  case "pieChart":
    title = `${languageNameSpace.labels[REF.title] } - ${languageNameSpace.labels[REF.geos]} - ${REF.year}`
    $("#title").html(title) 
    break;

  default:
      title = `${languageNameSpace.labels[REF.title]}`   
      unit = `${unit}`
      if(REF.chartExpanded == true) {
        $("#title").html(`${languageNameSpace.labels[REF.title]} - ${languageNameSpace.labels[REF.geos]}`)
      } else {
        $("#title").html(`${languageNameSpace.labels[REF.geos]}`)
      }
      
    break;
}
  titleElement.html(`<div class="textGroup">
  <h2>${title}</h2><p>${unit}</p></div>`).append(btn);


  if ($('.chartContainer').hasClass('expand')) {
    $(".expandChart").css('display', 'none');
} else {
    $(".expandChart").css('display', 'initial');
}

  return title;
 
}




function credits() {
  const datasetURL = `https://ec.europa.eu/eurostat/databrowser/view/${REF.dataset}/default/table?lang=${REF.language}`;

  // Return SVG-compatible credits text
  const chartCredits = `
    <tspan id="credits" style="font-size: 0.9rem;">
      Eurostat - 
      <tspan
        tabindex="1"
        role="link"
        aria-label="Eurostat dataset link: ${datasetURL}"
        title="Eurostat dataset link"
        style="cursor: pointer; fill: blue; text-decoration: underline;"
        onclick="window.open('${datasetURL}', '_blank')"
      >
      ${languageNameSpace.labels['DB']}
      </tspan>
    </tspan>
  `;

  return chartCredits
}



var cache = {};

function addToCache(query, d) {
  if (!cache[query]) {
    cache[query] = [];
  }
  
  cache[query].push(d);
}


function chartApiCall(query) {

  const indicator_type = `&${REF.indicator_type}=`
  const indicator2_type = `&${REF.indicator2_type}=`
  const geos = defaultGeos

  let url = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/" + REF.dataset + "?";
  url += "format=JSON";
  url += "&lang=" + REF.language;



  switch (REF.chartType) {
    case "lineChart":
      url += "&unit=" + REF.unit; 
      url += "&geo=" + REF.geos;  
      if(REF.indicator.length > 0) {
        for (let i = 0; i < REF.indicator.length; i++) url += indicator_type + REF.indicator[i];  
      }
      if(REF.indicator2.length > 0) {
        for (let i = 0; i < REF.indicator2.length; i++) url += indicator2_type + REF.indicator2[i];  
      }

      if(REF.chartId === "chart_17" || REF.chartId === "chart-18") {
        REF.chartId === "chart_17" ? url += "&operator=PRR_AUTO" : url += "&operator=PRR_MAIN"
        url += "&plants=ELC"
      }
      break;

 case "barChart":
  url += "&unit=" + REF.unit; 
      if(REF.indicator.length > 0) { for (let i = 0; i < REF.indicator.length; i++) url += indicator_type + REF.indicator[i]}
      if(REF.indicator2.length > 0) {for (let i = 0; i < REF.indicator2.length; i++) url += indicator2_type + REF.indicator2[i];}
      for (let i = 0; i < geos.length; i++) url += "&geo=" + geos[i]; 
      url += "&time=" + REF.year; 

  break


  case "pieChart":
    if(REF.indicator.length > 0) { for (let i = 0; i < REF.indicator.length; i++) url += indicator_type + REF.indicator[i]}
    if(REF.indicator2.length > 0) {for (let i = 0; i < REF.indicator2.length; i++) url += indicator2_type + REF.indicator2[i];}
    url += "&unit=" + REF.unit; 
    url += "&time=" + REF.year;
    url += "&geo=" + REF.geos;
  
    break 
 
  }

  if (cache[url] && cache[url].length > 0) {  
    d = JSONstat(cache[url][cache[url].length - 1]).Dataset(0);
    return d;
  } else {
   

    const request = new XMLHttpRequest();
    request.open("GET", url, false); // Setting the third parameter to 'false' makes it synchronous
    request.send();
  
    if (request.status === 500 || request.status === 503) {
      // submitFormDown();
    }
  
    if (request.status !== 200) {
      // submitFormDown();
    }
  
    const data = JSON.parse(request.responseText);
    const d = JSONstat(data).Dataset(0);
    addToCache(url, d);
    
    return d;
  }


}

function startLoadingAnimation() {
  $('#loader').css('display', 'flex')
}
function stopLoadingAnimation() {
  $('#loader').css('display', 'none')
}

function agregateIcon() {
  const iconHTML = `
  <span class="agregates fa-stack fa-rotate-180" style=" position: absolute; top: 8px;">
    <i class="fa fa-square fa-stack-1x" style="top: .0em; left: .0em; color: white;"></i>
    <i class="fa fa-square fa-stack-1x" style="top: .2em; left: .2em; color: #0a328e;"></i>
    <i class="fa fa-square fa-stack-1x" style="top: .2em; left: .2em; color: transparent;"></i>
    <i class="fa fa-square fa-stack-1x" style="top: .3em; left: .3em; color: white;"></i>
    <i class="fa fa-square fa-stack-1x" style="top: .5em; left: .5em; color: #0a328e;"></i>
    <i class="fa fa-square fa-stack-1x" style="top: .5em; left: .5em; color: transparent;"></i>
    <i class="fa fa-square fa-stack-1x" style="top: .6em; left: .6em; color: white;"></i>
    <i class="fa fa-square fa-stack-1x" style="top: .8em; left: .8em; color: #0a328e;"></i>
    <i class="fa fa-square fa-stack-1x" style="top: .8em; left: .8em; color: transparent;"></i>
    <i class="fa fa-square fa-stack-1x" style="top: .9em; left: .9em; color: white;"></i>
  </span>
`;
return iconHTML;
}

function nonagregateIcon() {
  const iconHTML = `
      <span class="nonAgregates fa-stack fa-rotate-180" style="position: absolute;top: 4px;">
        <i class="fa fa-square fa-stack-1x" style="top: .0em;left: .0em;color: white;"></i>
        <i class="fa fa-square fa-stack-1x" style="top: .2em;left: .2em;color: #0a328e;"></i>
        <i class="fa fa-square fa-stack-1x" style="top: .2em;left: .2em;color: transparent;"></i>
        <i class="fa fa-square fa-stack-1x" style="top: .3em;left: .3em;color: white;"></i>
      </span>`;
return iconHTML;
}

// function chartToDisplay(d) { 

//   if(REF.chartId == "lineChart") {
//     endash(d)  
//   }
//   if(REF.chartId == "pieChart") {
//     createPieChart();
//   }
//   if(REF.chartId == "barChart") {
//     auxiliarBarGraph();
//   }
//   if(REF.chartId == "lineChart") {
//     createLineChart();
//   }

// }


function updateREFFromCodesDataset(chartId) {
  const chartData = codesDataset[chartId] || {}; 

  const {
    dataset,
    unit,
    indicator,
    indicator2,
    container: containerNumber,
    indicator_type,
    indicator2_type,
    title,
    meta
  } = chartData;


  REF.dataset = dataset;
  REF.unit = unit;
  REF.indicator = indicator;
  REF.indicator2 = indicator2;
  containerId = containerNumber; 
  REF.indicator_type = indicator_type;
  REF.indicator2_type = indicator2_type;
  REF.title = title;
  REF.meta = meta;
}


function allSeriesAreZero(chartSeries) {
  for (const series of chartSeries) {
      const data = series.data;
      if (data.some(value => value !== 0)) {
          return false; // At least one series has a non-zero value
      }
  }
  return true; // All series have zero values
}



function enableScreenREader(params) {
	const titleElement = document.querySelector("text.highcharts-title")
	if (titleElement) {
	  titleElement.setAttribute('aria-hidden', 'false');
	}

	// Find and update the subtitle element
	const subtitleElement = document.querySelector('text.highcharts-subtitle');
	if (subtitleElement) {
	  subtitleElement.setAttribute('aria-hidden', 'false');
	}


	const container = document.querySelector(".highcharts-root")

	container.removeAttribute('aria-hidden');
  
  }

  function loadSkeleton() {    
    // Select all elements with the class "flex-item" and "chartContainer"
    const elements = document.querySelectorAll(".chartContainer");

      elements.forEach(element => {
          // Select elements within the current element
          $(".containerNav > div > h2").addClass('pulsate')
          $(".containerNav > div > p").addClass('pulsate')
          $(".containerNav > button").addClass('pulsate')
          $("div.skeletonContainer").removeClass('d-none')
      });
}



function unloadSkeleton() {    
  // Select all elements with the class "chartContainer"
  const elements = document.querySelectorAll(".chartContainer");

  elements.forEach(element => {
      // Deactivate pulsate effect
      $(".containerNav > div > h2").removeClass('pulsate');
      $(".containerNav > div > p").removeClass('pulsate');
      $(".containerNav > button").removeClass('pulsate');
      // Hide skeleton container
      $("div.skeletonContainer").addClass('d-none');
  });
}



function sortByName(array) {
  return array.sort((a, b) => {
      // Compare the 'name' properties of the two objects
      if (a.name < b.name) {
          return -1; // a should come before b
      }
      if (a.name > b.name) {
          return 1; // a should come after b
      }
      return 0; // a and b are equal
  });
}


function enableTooltips() {
  // Select all button elements with data-i18n-title or data-i18n-label attributes
  const buttons = document.querySelectorAll("button[title], button[aria-label]");

  buttons.forEach((button) => {
    // Get the tooltip content from data-i18n-title or data-i18n-label
    const tooltipText =
      button.getAttribute("title") || button.getAttribute("aria-label");
    if (!tooltipText) return; // Skip if neither attribute exists

    // Create tooltip element
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = tooltipText; // Add the content
    document.body.appendChild(tooltip);

    // Position tooltip
    const positionTooltip = (element) => {
      const rect = element.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 6}px`;
    };

    // Show tooltip
    const showTooltip = (event) => {
      tooltip.classList.add("visible");
      positionTooltip(event.target);
    };

    // Hide tooltip
    const hideTooltip = () => {
      tooltip.classList.remove("visible");
    };

    // Event listeners for both mouse and keyboard interactions
    button.addEventListener("mouseover", showTooltip);
    button.addEventListener("mouseout", hideTooltip);
    button.addEventListener("focus", showTooltip); // For keyboard focus
    button.addEventListener("blur", hideTooltip); // Hide on blur
  });
}


function observeAriaHidden() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "aria-hidden") {
        const target = mutation.target;
        if (target.tagName === "svg" && target.getAttribute("aria-hidden") === "false") {
          // Remove or correct the attribute
          target.removeAttribute("aria-hidden");
          console.log("Corrected aria-hidden on:", target);
        }
      }
    });
  });

  // Observe the entire document for changes
  observer.observe(document.body, {
    attributes: true,
    subtree: true,
  });
}

// Initialize the observer
document.addEventListener("DOMContentLoaded", observeAriaHidden);


function updateAccessibilityLabels() {

  const elements = document.querySelectorAll('.highcharts-a11y-proxy-element');
  elements.forEach((element) => {
    let ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel && (ariaLabel.includes("Show") || ariaLabel.includes("Anzeigen") || ariaLabel.includes("Afficher"))) {
      const updatedLabel = ariaLabel
        .replace(/Show/g, translationsCache["SHOW"])
        .replace(/Anzeigen/g, translationsCache["SHOW"])
        .replace(/Afficher/g, translationsCache["SHOW"]);
      element.setAttribute('aria-label', updatedLabel);
    }
  });
}
  document.addEventListener('DOMContentLoaded', updateAccessibilityLabels);