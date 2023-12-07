class ChartControls {
	constructor() {
	  this.controls = document.createElement("div");
  
	  const select = document.createElement("select");
	  // select.id = REF.chartId;
	  select.classList.add("form-select", "mx-2");
	  select.setAttribute("aria-label", "Select flow");
  
	  const notMobileContent = `
		<div class="container-fluid">
		  <nav aria-label="Chart controls" id="chartControls" class="navbar navbar-expand-sm navbar-light bg-light navChartControls">
			<div class="container-fluid">

				<div>
					<li class="nav-item dropdown px-1" id="tb-country" role="none">
						<button class="btn btn-primary min-with--nav round-btn" type="button" aria-label="Select country" data-bs-toggle="dropdown" role="menuitem" title="Select country" aria-haspopup="true" aria-expanded="false" id="selectCounty">
							<i class="fas fa-globe" aria-hidden="true"></i>
						</button>
						<ul id="dropdown-geo-list" class="dropdown-menu dropdown-menu-end form-control" role="menu" aria-labelledby="selectCountry"></ul>
					</li>	
				</div>

				<div class="menu">
					<ul id="chartBtns" role="menubar" aria-label="options graph toolbox" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
						<li class="nav-item button px-1" id="toggleBarChart" role="none"></li>
						<li class="nav-item button px-1" id="togglePieChart" role="none"></li>
						<li class="nav-item button px-1" id="toggleLineChart" role="none" style="margin-right: 2rem;"></li>
						<li class="nav-item button px-1" id="printChart" role="none"></li>
						<li class="nav-item dropdown px-1" id="downloadChart" role="none"></li>
						<li class="nav-item button px-1" id="downloadExcel" role="none"></li>
						<li class="nav-item button px-1" id="embebedChart" role="none"></li>
						<li class="nav-item dropdown px-1" id="infoBtnChart" role="none"  style="margin-right: 2rem;">
						<button class="btn btn-primary min-with--nav round-btn" type="button" aria-label="InfoBtn" data-bs-toggle="dropdown" role="menuitem" title="${languageNameSpace.labels['BTNINFICHART']}" aria-haspopup="true" aria-expanded="true" id="infoBtn">
							<i class="fas fa-info"></i>
						</button>
						<ul class="dropdown-menu dropdown-menu-end" role="menu" aria-labelledby="infoBtn">     					
							<!-- <button class="dropdown-item" role="menuitem" onclick="tutorial()" aria-label="${languageNameSpace.labels['TUTORIAL']}" value="Tutorial">${languageNameSpace.labels['TUTORIAL']}</button> -->
							<button class="dropdown-item" role="menuitem" onclick="openMeta()" aria-label="${languageNameSpace.labels['meta']}" value="Metadata" >${languageNameSpace.labels['meta']}</button>
							<button class="dropdown-item" role="menuitem" onclick="openDataset()" aria-label="${languageNameSpace.labels['DB']}" value="Dataset">${languageNameSpace.labels['DB']}</button>          		
						</ul>
						</li>
						<li class="nav-item button px-1" id="closeChart" role="none"></li>
					</ul>
				</div>
			</div>
		  </nav>
		</div>`;
  
	  const mobileContent = `
		<div id="chartOptions">
		  <div class="col-12 subNavOne auxChartbtn">
			<button id="tools" class="btnGroup pe-2" type="button" aria-label="${languageNameSpace.labels["TOOLS"]}" title="${languageNameSpace.labels["TOOLS"]}" aria-haspopup="true">
			  <i class="fas fa-ellipsis-h"></i>
			  <span class="iconText">${languageNameSpace.labels["TOOLS"]}</span>
			</button>
			<div class="menu d-none">
			  <ul id="chartBtns" role="menubar" aria-label="options graph toolbox" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
			  <li class="nav-item dropdown px-1" id="tb-country" role="none">
			  <button class="btn btn-primary min-with--nav" type="button" aria-label="Select country" data-bs-toggle="dropdown" role="menuitem" title="Select country" aria-haspopup="true" aria-expanded="false" id="selectCounty">
				<i class="fas fa-globe" aria-hidden="true"></i>
			  </button>
			  <ul id="dropdown-geo-list" class="dropdown-menu dropdown-menu-end form-control" role="menu" aria-labelledby="selectCountry" ></ul>
			  </li>				
			  <li class="nav-item button px-1" id="toggleBarChart" role="none"></li>
				<li class="nav-item button px-1" id="togglePieChart" role="none"></li>
				<li class="nav-item button px-1" id="toggleLineChart" role="none"></li>
				<li class="nav-item button px-1" id="printChart" role="none"></li>
				<li class="nav-item dropdown px-1" id="downloadChart" role="none"></li>
				<li class="nav-item button px-1" id="downloadExcel" role="none"></li>
				<li class="nav-item button px-1" id="embebedChart" role="none"></li>
				<li class="nav-item button px-1" id="closeChart" role="none"></li>
			  </ul>
			</div>
		  </div>
		  <div class="col-12 subNavTwo">
			<div id="auxChartTitle">
			  <h2 id="title" class="title">title</h2>
			  <!-- <h6 id="subtitle" class="subtitle">subtitle</h6> -->
			</div>
		  </div>
		</div>`;	
		
  
	  if (isMobile) {
		// log(isMobile);
		this.controls.innerHTML = mobileContent;
		this.toolsButton = this.controls.querySelector("#tools");
		this.chartToolsMenu = this.controls.querySelector(".menu");
  
		this.toolsButton.addEventListener("click", () => {
		  this.chartToolsMenu.classList.toggle("d-none");
		  this.toolsButton.style.display = "none";
		});
	  } else {
		this.controls.innerHTML = notMobileContent;
	  }
	}
  
	addToDOM(targetElement) {
	  $("#menuToolbar").toggle();	
	  const container = document.querySelector(targetElement);
	  container.insertBefore(this.controls, container.firstChild);

	  

	    // Create the button instances
		const barChart = new Button("barChart", ["btn", "btn-primary", "min-with--nav", "round-btn"], languageNameSpace.labels['BTNBARCHART'], "barChart", "false");
		const pieChart = new Button("pieChart", ["btn", "btn-primary", "min-with--nav", "round-btn"], languageNameSpace.labels['BTNPIECHART'], "pieChart", "false");
		const lineChart = new Button("lineChart", ["btn", "btn-primary", "min-with--nav", "round-btn"], languageNameSpace.labels['BTNLINECHART'], "lineChart", "true");
		const createprintChart = new Button("printBtn", ["btn", "btn-primary", "min-with--nav", "round-btn"], languageNameSpace.labels['BTNPRINTCHART'], "false");
		const downloadChart = new Button("downloadBtn", ["btn", "btn-primary", "min-with--nav", "round-btn"], languageNameSpace.labels['BTNDOWNLOADCHART'], "false");
		const downloadExcel = new Button("excelBtn", ["btn", "btn-primary", "min-with--nav", "round-btn"], languageNameSpace.labels['BTNEXCELCHART'], "false");
		const embebedeChart = new Button("embebedBtn", ["btn", "btn-primary", "min-with--nav", "round-btn"], languageNameSpace.labels['BTNBSHARECHART'], "false");
		const closeChart = new Button("btnCloseModalChart", ["btn", "btn-primary", "min-with--nav", "btnClose", "round-btn"], languageNameSpace.labels['BTNCLOSECHART'], "false");
	
		// Set inner HTML content for each button
		barChart.setInnerHtml('<i class="fas fa-chart-bar"></i>');
		pieChart.setInnerHtml('<i class="fas fa-chart-pie"></i>');
		lineChart.setInnerHtml('<i class="fas fa-chart-line"></i>');
		createprintChart.setInnerHtml('<i class="fas fa-print"></i>');
		downloadChart.setInnerHtml('<i class="fas fa-download"></i>');
		downloadExcel.setInnerHtml('<i class="fas fa-file-excel"></i>');
		embebedeChart.setInnerHtml('<i class="fas fa-code"></i>');
		closeChart.setInnerHtml('<i class="fas fa-times"></i>');
	
		// Set click handlers for each button
		barChart.setClickHandler(function() {
		  disableChatOptionsBtn(this.value);
		  REF.chartType = "barChart";
		  dataNameSpace.setRefURL()
		//   REF.chartOpt = "compareChart"
		  showHideTimeLine()
		  compareCountries();
		  showHideBarChartOptions();
		});
		pieChart.setClickHandler(function() {
		  disableChatOptionsBtn(this.value);
		  REF.chartType = "pieChart";
		  REF.chartCreated = false;
		  dataNameSpace.setRefURL()
		//   REF.chartOpt = "compareChart"
		  showHideTimeLine()
		  compareCountries();
		  showHideBarChartOptions();
		});
		lineChart.setClickHandler(function() {
			disableChatOptionsBtn(this.value);
			REF.chartType = "lineChart";
			dataNameSpace.setRefURL()
		  //   REF.chartOpt = "compareChart"
		    showHideTimeLine()
			showHideBarChartOptions();
			compareCountries();

		});
		createprintChart.setClickHandler(function() {
			exportHandling(this.id);
		});
		downloadChart.setClickHandler(function() {
		  exportHandling(this.id);
		});
		downloadExcel.setClickHandler(function() {
			exportHandling(this.id);
		});
		embebedeChart.setClickHandler(function() {
			exportIframe();
		});
		closeChart.setClickHandler(function() {
		  REF.chartExpanded = false		
		  showHideTimeLine()		  
		  removeAuxiliarBarGraphOptions();
		});

	  	  // Create the button elements
			const barChartElement = barChart.createButton();
			const pieChartElement = pieChart.createButton();
			const lineChartElement = lineChart.createButton();
			const printChartElement = createprintChart.createButton();
			const downloadChartElement = downloadChart.createButton();
			const downloadExcelElement = downloadExcel.createButton();
			const embebedeChartElement = embebedeChart.createButton();
			const closeChartElement = closeChart.createButton();

		
			// Append the button elements to the document
			document.getElementById("toggleBarChart").appendChild(barChartElement);
			document.getElementById("togglePieChart").appendChild(pieChartElement);
			document.getElementById("toggleLineChart").appendChild(lineChartElement);
			document.getElementById("printChart").appendChild(printChartElement);
			document.getElementById("downloadChart").appendChild(downloadChartElement);
			document.getElementById("downloadExcel").appendChild(downloadExcelElement);
			document.getElementById("embebedChart").appendChild(embebedeChartElement);
			document.getElementById("closeChart").appendChild(closeChartElement);



          // Handle desktop-specific logic
          const geoDropdown = this.controls.querySelector('#dropdown-geo-list');

          geoDropdown.innerHTML = ''  

          defaultGeos.forEach(geo => {
            const content = document.createElement('a');
            content.setAttribute('role', 'menuitem');
            content.classList.add('dropdown-item', 'd-flex', 'justify-content-between', 'align-items-center');
            if (REF.geos.includes(geo)) { // Check if `geo` is in the `REF.geos` array
              content.classList.add('active');
            }
            content.href = '#';
            content.setAttribute('data-geo', geo);
            content.setAttribute('data-bs-toggle', 'button');
            
            const innerContent = document.createElement('span');
            const flagImage = document.createElement('img');
            flagImage.classList.add('flag', 'me-2');
            flagImage.src = `img/country_flags/${geo.toLowerCase()}.webp`;
            flagImage.alt = '';
            
            const labelText = document.createTextNode(languageNameSpace.labels[geo]);
            
            innerContent.appendChild(flagImage);
            innerContent.appendChild(labelText);
            content.appendChild(innerContent);
            
            geoDropdown.appendChild(content);
          });
          
	
          	this.countriesHandler(geoDropdown);
			lineChart.setDisabled(true);
	}
  
	countriesHandler(geoDropdown) {
		const geoItems = geoDropdown.querySelectorAll('.dropdown-item');			

		geoItems.forEach((item) => {
			item.addEventListener('click', (event) => {
				event.preventDefault(); // Prevent the default link behavior
				geoItems.forEach((otherItem) => {
					otherItem.classList.remove('active');
				});
				item.classList.add('active');

				// Add your logic to handle the selected item here
				const selectedGeo = item.getAttribute('data-geo');

				// log(selectedGeo)

				REF.geos = selectedGeo;

				dataNameSpace.setRefURL();
				compareCountries();

			
			});
		});
	}

	removeFromDOM() {
	  let navElement;
	  if (isMobile) {
		navElement = document.querySelector("#chartOptions");
	  } else {
		navElement = document.querySelector("div > nav.navChartControls");
	  }
  
	  if (navElement) {
		const parentContainer = navElement.closest("#subnavbar-container > div");
		if (parentContainer) {
		  parentContainer.parentNode.removeChild(parentContainer);
		}
	  }
	  $("#menuToolbar").toggle();
	//   showMenuSwitch();
	//   REF.compare = false
	}
  }
  
  function disableChatOptionsBtn(chart) {
	REF.chartType = chart;  
	const btns = ["barChart", "pieChart", "lineChart"];  
	btns.forEach(btn => {
    REF.chartType === btn ? $("#" + btn).prop("disabled", true) : $("#" + btn).prop("disabled", false)
	REF.chartType === "barChart" ? $('#selectCounty').prop("disabled", true) : $('#selectCounty').prop("disabled", false);
	});
  }
  