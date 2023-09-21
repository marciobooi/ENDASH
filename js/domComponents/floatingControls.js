let clonedContainer = null;
let clickedChart = null;

class FloatingChartControls {
  constructor() {
    this.chartControls = document.createElement('div');
    this.chartControls.className = 'menuSwitch';
    this.chartControls.id = 'menuSwitch';

    this.chartControls.innerHTML = `
      <!-- <div>
        <div class="form-check form-switch form-check-reverse">
          <input class="form-check-input focus-ring" type="checkbox" value="${REF.compare == 'true' ? false : true}" role="switch" id="switchCompare" ${REF.compare == true ? '' : 'checked'}>
          <label class="form-check-label" for="switchCompare">${languageNameSpace.labels['compare']}</label>
        </div>
      </div> -->
      
      <div>  
        <ul id="floatingMenu">   
        <li class="nav-item px-1" id="togglePercentage" role="none" style="display:none"></li>
        <li class="nav-item px-1" id="Agregates" role="none" style="display:none"></li>			  
        <li class="nav-item px-1" id="toggleTable" role="none"></li>
        </ul>
      </div>`;




    // Get all the switch elements
    // const switchElements = this.chartControls.querySelectorAll('[role="switch"]');

    // Add event listeners for keyboard navigation
    // switchElements.forEach(switchElement => {
    //   switchElement.addEventListener('keyup', e => {
    //     if (e.keyCode === 13 || e.keyCode === 32) {
    //       // Prevent scrolling when the spacebar or enter key is pressed
    //       e.preventDefault();

    //       switchElement.value = switchElement.value === 'true' ? false : true;

    //       REF.chartType = switchElement.value == 'false' ? "barChart" : '';
    //       REF.percentage = 0        
          
    //       switchElement.value == 'false' ? REF.chartOpt = "compareChart" : REF.chartOpt = "lineChart"
    //       switchElement.value == 'false' ? REF.chartType = 'barChart' : REF.chartType = ""

    //       if (switchElement.value === 'false') {
    //         // Add the Timeline instance to the DOM
    //         const timelineContainer = document.getElementById('timelineContainer');
    //         const timeline = new Timeline(timelineContainer);
    //         // Save the timeline instance to access it later for removal
    //         this.timeline = timeline;
    //     } else {
    //         // Remove the Timeline instance from the DOM
    //         if (this.timeline) {
    //             this.timeline.removeFromDOM();
    //             this.timeline = null;
    //         }

    //         const pieButton = document.querySelector("#pieChart");
    //         const barButton = document.querySelector("#barChart");
    //         pieButton.setAttribute("disabled", "");
    //         barButton.setAttribute("disabled", "");
    //         showHideBarChartOptions();
  
  
    //         $('#togglePercentage').css('display', 'none')
    //         $('#Agregates').css('display', 'none')
    //     }
           
    //       compareCountries();
    //       const button = document.querySelector("#pieChart");
    //       button.removeAttribute("disabled");
    //       showHideBarChartOptions();
    //     }
    //   });

      


    //   switchElement.addEventListener('click', () => {

    //     switchElement.value = switchElement.value === 'true' ? false : true;
    //     switchElement.value == 'false' ? REF.chartOpt = "compareChart" : REF.chartOpt = "lineChart"
    //     switchElement.value == 'false' ? REF.chartType = 'barChart' : REF.chartType = ""
    //     REF.percentage = 0     

    //     if (switchElement.value === 'false') {
    //       // Add the Timeline instance to the DOM
    //       const timelineContainer = document.getElementById('timelineContainer');
    //       const timeline = new Timeline(timelineContainer);
    //       // Save the timeline instance to access it later for removal
    //       this.timeline = timeline;

    //       REF.chartCreated = false

    //       const button = document.querySelector("#pieChart");
    //       button.removeAttribute("disabled");
    //       showHideBarChartOptions();

    //   } else {
    //       // Remove the Timeline instance from the DOM
    //       if (this.timeline) {
    //           this.timeline.removeFromDOM();
    //           this.timeline = null;
    //       }
    //       const pieButton = document.querySelector("#pieChart");
    //       const barButton = document.querySelector("#barChart");
    //       pieButton.setAttribute("disabled", "");
    //       barButton.setAttribute("disabled", "");
    //       showHideBarChartOptions();

    //       $('#togglePercentage').css('display', 'none')
    //       $('#Agregates').css('display', 'none')
    //   }         
    
    //     compareCountries();

    // });
    
    // });
  }

  toggleChartPercentage() {
    REF.percentage = REF.percentage == 0 ? 1 : 0;
        
    const categories = defaultGeos.map(geo => languageNameSpace.labels[geo]);
    const containerId = codesDataset[REF.chartId].container;
    const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit] 
    const type = "column"

    buildChart(categories, containerId, yAxisTitle, type);  
  }

  toggleChartAgregates() {

      REF.chartOpt = "compareChart"

      const query = ['EU27_2020'];
  
      const toggleAgregates = this.chartControls.querySelector('#toggleAgregates');   
    
      const hasQuery = query.every(item => defaultGeos.includes(item));
      if (hasQuery) {
        defaultGeos = defaultGeos.filter(item => !query.includes(item));
        toggleAgregates.innerHTML = nonagregateIcon();
      } else {
        defaultGeos = defaultGeos.concat(query);
        toggleAgregates.innerHTML = agregateIcon();
      }
      compareCountries();
    }


    


  toggleIcons() {
    const tableIcon = this.chartControls.querySelector('#table-icon');
    const chartIcon = this.chartControls.querySelector('#chart-icon');
    const toggleButton = this.chartControls.querySelector('#tb-togle-table');
  
  
    tableIcon.style.display = tableIcon.style.display === 'none' ? '' : 'none';
    chartIcon.style.display = chartIcon.style.display === 'none' ? '' : 'none';
  
    if (tableIcon.style.display === 'none') {
      toggleButton.setAttribute('aria-label', 'Toggle chart');
      toggleButton.title = 'Toggle chart';
      openVizTable()
    } else {
      toggleButton.setAttribute('aria-label', 'Toggle table');
      toggleButton.title = 'Toggle table';      
      closeTable()
    }
  }


  
  addToDOM(targetElement) {
    const container = document.querySelector(targetElement);
    container.appendChild(this.chartControls);

    const self = this; 

		const percentageButton = new Button("tb-togle-percentage", ["btn", "btn-primary", "min-with--nav"], "Toggle percentage", "", "true");
		const agregatesButton = new Button("toggleAgregates", ["btn", "btn-primary", "min-with--nav"], languageNameSpace.labels["TOGGLEAGREGATES"], "", "true");
		const tableButton = new Button("tb-togle-table", ["btn", "btn-primary", "min-with--nav"], "Toggle table", "", "true");
		// const orderButton = new Button("tb-togle-order", ["btn", "btn-primary", "min-with--nav"], "Select order of the chart", "", "true");

    percentageButton.setInnerHtml('<i id="percentage-icon" class="fas fa-percentage"></i>');
    agregatesButton.setInnerHtml(agregateIcon())
    tableButton.setInnerHtml('<i id="table-icon" class="fas fa-table"></i><i id="chart-icon" class="fas fa-chart-bar" style="display: none;"></i>');
    // orderButton.setInnerHtml('<i class="fas fa-sort-amount-down"></i>');

    percentageButton.setClickHandler(function() {
      self.toggleChartPercentage(); // Call the class method using the stored reference
    });

    agregatesButton.setClickHandler(function() {
      self.toggleChartAgregates(); // Call the class method using the stored reference
    });

    tableButton.setClickHandler(function() {
      self.toggleIcons(); // Call the class method using the stored reference
    });

    const percentageElement = percentageButton.createButton();
    const agregatesElement = agregatesButton.createButton();
    const tableElement = tableButton.createButton();
    // const orderElement = orderButton.createButton();
    

    document.getElementById("togglePercentage").appendChild(percentageElement);
    document.getElementById("Agregates").appendChild(agregatesElement);
    document.getElementById("toggleTable").appendChild(tableElement);

  }

  removeFromDOM(targetElement) {
    $('#menuSwitch').remove();
  }

	
}




