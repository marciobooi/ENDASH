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
      ${isMedianChart(REF.chartId) ? '<li class="nav-item px-1" id="medianToggle" role="none"></li>' : ''}
        </ul>`;  }

  // Flips a median-split chart (chart_24) between the countries above and
  // below the median, then redraws it.
  toggleMedianGroup() {
    REF.medianGroup = REF.medianGroup === "below" ? "above" : "below";
    dataNameSpace.setRefURL();
    this.syncMedianButton();
    compareCountries();
  }

  // The button names (and shows an arrow for) the group a click will switch
  // TO, so its label and icon always agree.
  syncMedianButton() {
    const button = document.getElementById("toggleMedianGroup");
    if (!button) return;

    const showingBelow = REF.medianGroup === "below";
    const key = showingBelow ? "SHOW_ABOVE_MEDIAN" : "SHOW_BELOW_MEDIAN";
    const label = languageNameSpace.labels[key] || key;

    button.setAttribute("data-i18n-label", key);
    button.setAttribute("data-i18n-title", key);
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.innerHTML = `<i class="fas ${showingBelow ? "fa-arrow-up" : "fa-arrow-down"}" aria-hidden="true"></i>`;
  }

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

    if (document.getElementById("medianToggle")) {
      const medianButton = new Button("toggleMedianGroup", [ "ecl-button", "ecl-button--primary", "round-btn"], "SHOW_BELOW_MEDIAN", "", "true");
      medianButton.setClickHandler(function() {
        self.toggleMedianGroup();
      });
      document.getElementById("medianToggle").appendChild(medianButton.createButton());
      this.syncMedianButton();
    }
  }

  removeFromDOM(targetElement) {
    const menuSwitch = document.querySelector('#menuSwitch');
    if (menuSwitch) {
      menuSwitch.remove();
    }
  }

	
}






// The on-card above/below toggle of median-split charts (chart_24). Captured
// before the card's own click handler so toggling doesn't also expand the card.
document.addEventListener('click', function (event) {
  const button = event.target.closest && event.target.closest('.medianGroupBtn');
  if (!button) return;

  event.stopPropagation();
  REF.chartId = button.getAttribute('data-chart-id');
  REF.medianGroup = REF.medianGroup === "below" ? "above" : "below";
  dataNameSpace.setRefURL();

  const card = document.getElementById(REF.chartId);
  if (card && card.classList.contains('expand')) {
    compareCountries();
    if (typeof FloatingControls !== "undefined" && FloatingControls.syncMedianButton) FloatingControls.syncMedianButton();
  } else {
    endash();
  }
}, true);
