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
              chart.update({ legend: legendBig }, true); // true for redraw
            } else {
              chart.update({ legend: legendSmall }, true); // true for redraw
            }
            chart.redraw()
        }        
      }
  });
}



formMessage = (/The endash tool is down since:     (.*)/)

// function to openMeta link when press the link btn
function openMeta() {
  		var metadata = "";
		if(REF.products == "4100") {
			metadata = "nrg_pc_202";
		} else {
			metadata = "nrg_pc_204";
		}
  window.open("https://ec.europa.eu/eurostat/cache/metadata/"+REF.language+"/"+metadata+"_sims.htm");	
}

 orderByPiles = (countriesAndValues, x, y) => {
  const categories = Object.values(x).map(country => languageNameSpace.labels[country]);
  const fuelTypes = Object.values(y).map(fuel => languageNameSpace.labels[fuel]);

  const mySeries = fuelTypes.map((fuel, i) => ({
    name: fuel,
    data: countriesAndValues[i].data.map(element => element)
  }));

  const categoriesAndPiles = categories.map((name, index) => ({
    name,
    piles: mySeries.map(serie => ({
      name: serie.name,
      value: serie.data[index]
    }))
  }));

  categoriesAndPiles.sort((a, b) => {
    const sumA = a.piles.reduce((sum, pile) => sum + pile.value, 0);
    const sumB = b.piles.reduce((sum, pile) => sum + pile.value, 0);
    return sumB - sumA;
  });

  const myXAxis = categoriesAndPiles.map(category => category.name);

  mySeries.forEach(serie => {
    serie.data = categoriesAndPiles.map(category => category.piles.find(pile => pile.name == serie.name).value);
  });

  return {
    myXAxis,
    mySeries
  };
};


 makeOrderedSeries = (categoriesAndStacks) => {
  const ordSeries = [];

  bardata = REF.chartId == "lineChart" ? linedata : bardata;

  for (let i = 0; i < categoriesAndStacks[0].y.length; i++) {
    const temp = categoriesAndStacks.map(category => category.y[i]);
    ordSeries.push({
      index: bardata[i].index,
      name: bardata[i].name,
      legendIndex: bardata[i].legendIndex,
      id: bardata[i].id,
      data: temp
    });
  }

  const [temp] = ordSeries.splice(1, 1);
  ordSeries.push(temp);

  return ordSeries;
};




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

function mailContact() {
  document.location = "mailto:ESTAT-ENERGY@ec.europa.eu?subject=ENERGY%20PRICES%20CONTACT&body=" +
  encodeURIComponent(window.location.href);
}

function exportTable() {
  window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('.highcharts-data-table').html()));
}

function showHideBarChartOptions() {
  if (REF.chartType === "pieChart") {
      $("#togglePercentage, #Agregates").css('display', 'none');
  } else {
      $("#togglePercentage, #Agregates").css('display', '');
  }
}









function addAuxiliarBarGraphOptions() {
  auxiliarBarGraphOptions = new ChartControls();
  auxiliarBarGraphOptions.addToDOM("#subnavbar-container"); 

  FloatingControls = new FloatingChartControls();
  FloatingControls.addToDOM("#componentFooter"); 
}

function removeAuxiliarBarGraphOptions() {

  const query = ['EU27_2020'];

  const hasQuery = query.every(item => defaultGeos.includes(item));
  if (!hasQuery) {
    defaultGeos = defaultGeos.concat(query);
  } 

  $("#switchCompare").prop("checked", false);
  REF.compare = false
  REF.chartOpt = "mainChart"
  compareCountries()
  REF.chartOpt = "mainChart"
  REF.chartType =  ""

  getTitle()


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


  const auxiliarBarGraphOptions = new ChartControls();
  auxiliarBarGraphOptions.removeFromDOM("#subnavbar-container");

  const FloatingControls = new FloatingChartControls();
  FloatingControls.removeFromDOM();

  $('#chartSlider').remove();
  $(".containerNav").css('visibility', 'initial')
}

function showMenuSwitch() {
  $("#menuSwitch > div:nth-child(1)").css('display', "block") 
  $('#ChartOrder').css('display', "initial") 
}
function hideMenuSwitch() {
  $("#menuSwitch > div:nth-child(1)").css('display', "none") 
  $('#ChartOrder').css('display', "none") 
}

function sortArrayAlphabetically() {
  if (REF.detail == 1) {
    categoriesAndStacks.sort((a, b) => a.x.localeCompare(b.x));
  } else {
    bardata.sort((a, b) => a.name.localeCompare(b.name, undefined, { ignorePunctuation: true, sensitivity: 'base' }));
  }
}

function sortArrayByAscValues(arr) {
  if (REF.detail == 1) {
    arr.sort((a, b) => {
      const sumA = a.y.reduce((acc, val) => acc + val, 0);
      const sumB = b.y.reduce((acc, val) => acc + val, 0);
      return sumA - sumB;
    });
  } else {
    arr.sort((a, b) => a.y % 2 - b.y % 2 || a.y - b.y);
  }
}

function sortArrayByDescValues(arr) {
  if (REF.detail == 1) {
    arr.sort((a, b) => {
      const sumA = a.y.reduce((acc, val) => acc + val, 0);
      const sumB = b.y.reduce((acc, val) => acc + val, 0);
      return sumB - sumA;
    });
  } else {
    arr.sort((a, b) => b.y % 2 - a.y % 2 || b.y - a.y);
  }
}

function sortArrayByProtocolOrder(arr) {
  if (REF.detail == 1) {
    const energyCountriesCodes = REF.geos;
    arr.sort((a, b) => {
      if (a.code === "all") return -1; // Move "all" to the beginning
      if (b.code === "all") return 1; // Move "all" to the beginning
      return energyCountriesCodes.indexOf(a.code) - energyCountriesCodes.indexOf(b.code);
    });
    orderedSeries = makeOrderedSeries(categoriesAndStacks);
  } else {
    barproto = [];
    bardata = barproto;

    const geosProto = REF.geos.filter(geop => geop !== "all"); // Ignore "all" in REF.geos

    geosProto.map((geop, gIdx) => {
      geos.map((geo, yIdx) => {
        if (geop == geo && geop !== "all") {
          values = tax.map((tax, cIdx) => {
            return (num = arr.value[cIdx * geos.length + yIdx]);
          });
        }
      });

      const taxValue = REF.component == 1
        ? parseFloat((values.reduce((a, b) => a + Number(b), 0) * factor).toFixed(dec))
        : parseFloat((values[0] * factor).toFixed(dec));

      barcateg.push(languageNameSpace.labels[geop]);

      const languageLabel = languageNameSpace.labels[geop];
      const color = geop == "EU27_2020" ? '#14375a' : (geop == "EA" ? '#800000' : "#32afaf");

      barproto.push({ name: languageLabel, y: taxValue, color });
    });
  }
}



function chartNormalTooltip(points) {
  const value = Highcharts.numberFormat(points[0].y, 4);
  const unit = `${languageNameSpace.labels["S_" + REF.currency]}/${languageNameSpace.labels["S_" + REF.unit]}`;
  const na = languageNameSpace.labels['FLAG_NA'];
  const title = REF.chartId==="mainChart" ?  points[0].key : points[0].x
  return this.y == 0 ? `<b>${title}<br>Total: <b>${na}</b>` : `<b>${title}<br>Total: <b>${value}</b> ${unit}`;
}

function tooltipTable(points) {

  const decimals = REF.dataset == "demo_pjan" ? 0 : 3

  if(REF.percentage == 1 ){
    let html = "";
    html += `<table id="tooltipTable" class="table">                
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
    let totalColor = "#7cb5ec";
    
    // Sort the points so that the "Total" item is at the last place
    const sortedPoints = points.sort(function (a, b) {
      if (a.series.name == languageNameSpace.labels['TOTAL']) return 1;
      if (b.series.name == languageNameSpace.labels['TOTAL']) return -1;
      return 0;
    });
    
    html += `<table id="tooltipTable" class="table">                
      <thead>
        <tr>
          <th scope="cols">${sortedPoints[0].key}</th>                    
          <th scope="cols"></th>                    
        </tr>
      </thead>`;
    
    sortedPoints.forEach(function (point) {
      const color = point.series.color;
      const value = point.y.toFixed(decimals); // Limit decimals to three places
      const category = point.series.name;
    
      html += `<tr>
        <td><svg width="10" height="10" style="vertical-align: baseline;"><circle cx="5" cy="5" r="3" fill="${color}" /></svg> ${category}</td>
        <td>${value}</td>
      </tr>`;
    
      // Check if point is "Total" and set the flag if found
      if (category == languageNameSpace.labels['TOTAL']) {
        totalAdded = true;
      }
    });
    
    // Check if all values are zero and display a message if they are
    const allValuesZero = sortedPoints.every(function (point) {
      return point.y === 0;
    });
    
    // if (allValuesZero) {
    //   html = "<p>All values are zero.</p>"; // Replace the table with the message
    // } else {
      // Add a row for the total if not already added
      if (!totalAdded) {
        // Calculate the total sum of all values
        const totalSum = sortedPoints.reduce(function (sum, point) {
          return sum + point.y;
        }, 0);
    
        // Format the total sum with three decimal places
        const totalValue = totalSum.toFixed(decimals);
    
        // Add a row for the total
        html += `<tr>
          <td><svg width="10" height="10" style="vertical-align: baseline;"><circle cx="5" cy="5" r="3" fill="${totalColor}" /></svg> ${languageNameSpace.labels['TOTAL']}</td>
          <td>${totalValue}</td>
        </tr>`;
      }
    // }
    
    html += `</table>`;
    
    return `<div>${html}</div>`;
    
  }
}

function getTitle() {

  const titleElement = $(`#${containerId}`).prev();
  let title

switch (REF.chartType) {
  case "barChart":
    title = `${languageNameSpace.labels[REF.title] } - all countries - ${REF.year}`
    $("#title").html(title)
    break;
  case "pieChart":
    title = `${languageNameSpace.labels[REF.title] } - ${languageNameSpace.labels[REF.geos]} - ${REF.year}`
    $("#title").html(title)
    break;

  default:
      title = `${languageNameSpace.labels[REF.title] }`   
      $("#title").html(languageNameSpace.labels[REF.geos])
    break;
}

titleElement.text(title)
  return title;
 
}

function credits() {
  const chartCredits = `<span style="font-size: .75rem;">${languageNameSpace.labels["EXPORT_FOOTER_TITLE"]} - </span>
  <a style="color:blue; text-decoration: underline; font-size: .75rem;"
  href="https://ec.europa.eu/eurostat/databrowser/view/${REF.dataset}/default/table?lang=${REF.language}">${languageNameSpace.labels['DB']}</a>,
  <span style="font-size: .875rem;">                           
</span>`;

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

  switch (REF.chartOpt) {
    case "mainChart":
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
    default:    
    

    if(REF.chartType === "barChart") {
      url += "&unit=" + REF.unit; 
      if(REF.indicator.length > 0) { for (let i = 0; i < REF.indicator.length; i++) url += indicator_type + REF.indicator[i]}
      if(REF.indicator2.length > 0) {for (let i = 0; i < REF.indicator2.length; i++) url += indicator2_type + REF.indicator2[i];}
      for (let i = 0; i < geos.length; i++) url += "&geo=" + geos[i]; 
      url += "&time=" + REF.year; 
  
      break;
    } else {
      if(REF.indicator.length > 0) { for (let i = 0; i < REF.indicator.length; i++) url += indicator_type + REF.indicator[i]}
      if(REF.indicator2.length > 0) {for (let i = 0; i < REF.indicator2.length; i++) url += indicator2_type + REF.indicator2[i];}
      url += "&unit=" + REF.unit; 
      url += "&time=" + REF.year;
      url += "&geo=" + REF.geos;
      break;
    }  
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

function chartToDisplay(d) { 

  if(REF.chartId == "mainChart") {
    endash(d)  
  }
  if(REF.chartId == "pieChart") {
    createPieChart();
  }
  if(REF.chartId == "barChart") {
    auxiliarBarGraph();
  }
  if(REF.chartId == "lineChart") {
    createLineChart();
  }

}





   


   

