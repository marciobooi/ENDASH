let clonedContainer = null;
let clickedChart = null;

class FloatingChartControls {
  constructor() {
    this.chartControls = document.createElement('div');
    this.chartControls.className = 'menuSwitch';
    this.chartControls.id = 'menuSwitch';

    this.chartControls.innerHTML = `<ul id="floatingMenu" role="menubar" data-i18n-label="OPTIONS_GRAPH_TOOLBOX">    
      <li class="nav-item px-1" id="togglePercentage" role="none">
      </li>
      <li class="nav-item px-1" id="Agregates" role="none">
      </li>
        </ul>`;  }

  toggleChartPercentage() {
    REF.percentage = REF.percentage == 0 ? 1 : 0;
    dataNameSpace.setRefURL()
    createBarChart();  
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

      dataNameSpace.setRefURL()

      compareCountries();
    }

  
  addToDOM(targetElement) {
    const container = document.querySelector(targetElement);
    container.appendChild(this.chartControls);

    const self = this;     

		const percentageButton = new Button("tb-togle-percentage", [ "ecl-button", "ecl-button--primary", "round-btn"], 'SHOW_PERCENTAGE', "", "true");
		const agregatesButton = new Button("toggleAgregates", [ "ecl-button", "ecl-button--primary", "round-btn"], "SHOW_AGGREGATES", "", "true");

    percentageButton.setInnerHtml('<i id="percentage-icon" class="fas fa-percentage"></i>');
    agregatesButton.setInnerHtml(agregateIcon())

    percentageButton.setClickHandler(function() {
      self.toggleChartPercentage(); // Call the class method using the stored reference
    });

    agregatesButton.setClickHandler(function() {
      self.toggleChartAgregates(); // Call the class method using the stored reference
    });

    const percentageElement = percentageButton.createButton();
    const agregatesElement = agregatesButton.createButton();

    document.getElementById("togglePercentage").appendChild(percentageElement);
    document.getElementById("Agregates").appendChild(agregatesElement);
    
    languageNameSpace.initLanguage(REF.language);
  }

  removeFromDOM(targetElement) {
    $('#menuSwitch').remove();
  }

	
}




