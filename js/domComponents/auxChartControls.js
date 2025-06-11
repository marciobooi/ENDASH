class ChartControls {
	constructor() {
	  this.controls = document.createElement("div");
  
	  const select = document.createElement("select");
	  // select.id = REF.chartId;
	  select.classList.add("form-select", "mx-2");
	  select.setAttribute("aria-label", "Select flow");
  
	  const notMobileContent = /*html*/ `

		  <nav aria-label="Chart controls" id="chartControls" class="navbar navbar-expand-sm navChartControls">			
				<div class="menu">

				<ul id="chartBtns" aria-label="Chart controls" role="toolbar" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
						<li class="nav-item button px-1" id="toggleBarChart" role="none"></li>
						<li class="nav-item button px-1" id="togglePieChart" role="none"></li>
						<li class="nav-item button px-1" id="toggleLineChart" role="none"></li>
						<li class="nav-item button px-1" id="toggleAuxTable" role="none" style="margin-right: 2rem;"></li>
						<li class="nav-item button px-1" id="printChart" role="none"></li>
						<li class="nav-item dropdown px-1" id="downloadChart" role="none"></li>
						<li class="nav-item button px-1" id="downloadExcel" role="none"></li>
						<li class="nav-item button px-1" id="embebedChart" role="none"></li>
						<li class="nav-item dropdown px-1" id="infoBtnChart" role="none"  style="margin-right: 2rem;">
							<button class="btn btn-primary min-with--nav round-btn" type="button" data-i18n-label="INFO" data-bs-toggle="dropdown" role="menuitem" data-i18n-title="INFO" aria-haspopup="true" id="infoBtn">
								<i class="fas fa-info"></i>
							</button>
							<ul class="dropdown-menu dropdown-menu-end" role="menu" aria-labelledby="infoBtn">     					
								<button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="openMeta()" aria-label="${languageNameSpace.labels["meta"]}" value="Metadata" >${languageNameSpace.labels["meta"]}</button>
								<button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="openDataset()" aria-label="${languageNameSpace.labels["DB"]}" value="Dataset">${languageNameSpace.labels["DB"]}</button>          		
							</ul>
						</li>
						<li class="nav-item button" id="closeChart" role="none"></li>
					</ul>

			
			</div>
		  </nav>
		`;
  
	  const mobileContent = /*html*/`
		<div id="chartOptions">
		  <div class="col-12 subNavOne auxChartbtn">

			<div class="menu">	
			  <li class="nav-item button px-1" id="toggleBarChart" role="none"></li>
				<li class="nav-item button px-1" id="togglePieChart" role="none"></li>
				<li class="nav-item button px-1" id="toggleLineChart" role="none"></li>
				<li class="nav-item button px-1" id="toggleAuxTable" role="none"></li>
				<li class="nav-item button px-1" id="printChart" role="none"></li>
				<li class="nav-item dropdown px-1" id="downloadChart" role="none"></li>
				<li class="nav-item button px-1" id="downloadExcel" role="none"></li>
				<li class="nav-item button px-1" id="embebedChart" role="none"></li>
				<li class="nav-item button px-1" id="closeChart" role="none"></li>
			  </ul>
			</div>
		  </div>
		</div>
		`;	
		
  
	  if (isMobile) {
		// log(isMobile);
		this.controls.innerHTML = mobileContent;
		// this.toolsButton = this.controls.querySelector("#tools");
		// this.chartToolsMenu = this.controls.querySelector(".menu");
  
		// this.toolsButton.addEventListener("click", () => {
		//   this.chartToolsMenu.classList.toggle("d-none");
		//   this.toolsButton.style.display = "none";
		// });
	  } else {
		this.controls.innerHTML = notMobileContent;
	  }
	}
  
	addToDOM(targetElement) {
	  $("#menuToolbar").css('display', 'none');	
	  const container = document.querySelector(targetElement);
	  container.insertBefore(this.controls, container.firstChild);

	    // Create the button instances
		const barChart = new Button("barChart", ["ecl-button", "ecl-button--primary", "round-btn"], "SHOW_BAR_CHART", "barChart", {"aria-pressed": "false"});
		const pieChart = new Button("pieChart", ["ecl-button", "ecl-button--primary", "round-btn"], "SHOW_PIE_CHART", "pieChart", {"aria-pressed": "false"});
		const lineChart = new Button("lineChart", ["ecl-button", "ecl-button--primary", "round-btn"], "SHOW_PIE_CHART", "lineChart", {"aria-pressed": "true"});
		const table = new Button("toggleTableBtn", ["ecl-button", "ecl-button--primary", "round-btn"], "SHOW_TABLE", "table", {"aria-pressed": "false"});
		const createprintChart = new Button("printBtn", ["ecl-button", "ecl-button--primary", "round-btn"], "PRINT_CHART", "false");
		const downloadChart = new Button("downloadBtn", ["ecl-button", "ecl-button--primary", "round-btn"], "DOWNLOAD_CHART_IMAGE", "false");
		const downloadExcel = new Button("excelBtn", ["ecl-button", "ecl-button--primary", "round-btn"], "DOWNLOAD_XLS", "false");
		const embebedeChart = new Button("embebedBtn", ["ecl-button", "ecl-button--primary", "round-btn"], "SHARE", "false");
		// REF.chartId should give the chart like 'chart_1', 'chart_2'.
		// codesDataset[REF.chartId].container should give the actual DOM ID like 'highchartsContainer_0'
		const chartContainerId = codesDataset[REF.chartId] ? codesDataset[REF.chartId].container : '';
		const closeChart = new Button(
			"btnCloseModalChart",
			["ecl-button", "ecl-button--primary", "round-btn", "close-chart-menu-btn"],
			"CLOSE",
			"false", // value not particularly relevant here
			{"aria-expanded": "false", "aria-controls": chartContainerId}
		);
		
		// Set inner HTML content for each button
		barChart.setInnerHtml('<i class="fas fa-chart-bar"></i>');
		pieChart.setInnerHtml('<i class="fas fa-chart-pie"></i>');
		lineChart.setInnerHtml('<i class="fas fa-chart-line"></i>');
		table.setInnerHtml('<i class="fas fa-table"></i>');
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
		table.setClickHandler(function() {		
	

			const tableBtn = document.querySelector("#toggleTableBtn");
			const tableIcon = document.querySelector("#toggleTableBtn > i");
			
			if (tableIcon.classList.contains("fa-table")) {
				tableIcon.classList.remove("fa-table");
				tableIcon.classList.add("fa-chart-bar");
			
				tableBtn.setAttribute('aria-label', 'Toggle chart');
				tableBtn.setAttribute('title', 'Toggle chart');
				tableBtn.setAttribute('aria-pressed', 'true');

				log(REF.chartType)

				const charts = ["barChart", "pieChart", "lineChart"];  
				charts.forEach(chart => {
					$("#" + chart).attr("disabled", "disabled")
					$("#" + chart).attr("aria-disabled", "true")
				})

				

				$("#"+REF.chartType).addClass('highlighDisbleBtn');
				

				log($("#"+REF.chartType))

				$('#floatingMenu').css('display','none')
			
				openVizTable();

				tableBtn.focus();
		
				setTimeout(() => {
					$("#toggleTableBtn").focus()
				}, 400);
			} else {
				tableIcon.classList.remove("fa-chart-bar");
				tableIcon.classList.add("fa-table");
			
				tableBtn.setAttribute('aria-label', 'Toggle table');
				tableBtn.setAttribute('title', 'Toggle table');
				tableBtn.setAttribute('aria-pressed', 'false');
			
				closeTable();

				disableChatOptionsBtn(REF.chartId)		
				$('#floatingMenu').css('display','flex')		
				$("#"+REF.chartType).removeClass('highlighDisbleBtn');

				setTimeout(() => {
					$("#toggleTableBtn").focus()
				}, 400);
			}			
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
		  REF.chartType = "lineChart"	
		  showHideTimeLine()		  
		  removeAuxiliarBarGraphOptions();
		});

	  	  // Create the button elements
			const barChartElement = barChart.createButton();
			const pieChartElement = pieChart.createButton();
			const lineChartElement = lineChart.createButton();
			const tableChartElement = table.createButton();
			const printChartElement = createprintChart.createButton();
			const downloadChartElement = downloadChart.createButton();
			const downloadExcelElement = downloadExcel.createButton();
			const embebedeChartElement = embebedeChart.createButton();
			const closeChartElement = closeChart.createButton();

		
			// Append the button elements to the document
			document.getElementById("toggleBarChart").appendChild(barChartElement);
			document.getElementById("togglePieChart").appendChild(pieChartElement);
			document.getElementById("toggleLineChart").appendChild(lineChartElement);
			document.getElementById("toggleAuxTable").appendChild(tableChartElement);
			// document.getElementById("printChart").appendChild(printChartElement);
			document.getElementById("downloadChart").appendChild(downloadChartElement);
			document.getElementById("downloadExcel").appendChild(downloadExcelElement);
			document.getElementById("embebedChart").appendChild(embebedeChartElement);
			document.getElementById("closeChart").appendChild(closeChartElement);

		lineChart.setDisabled(true);
		

		languageNameSpace.initLanguage(REF.language);

		// Toolbar keyboard navigation
		const toolbar = this.controls.querySelector('#chartBtns');
		if (toolbar) {
			// Select only buttons that are direct children of li.nav-item and are intended for toolbar navigation
			const buttons = Array.from(toolbar.querySelectorAll('li.nav-item > button.ecl-button'));

			if (buttons.length > 0) {
				toolbar.addEventListener('keydown', (event) => {
					const target = event.target;
					// Ensure the event target is one of the toolbar buttons
					if (!buttons.includes(target)) {
						return;
					}

					let currentIndex = buttons.indexOf(target);
					let nextIndex;

					switch (event.key) {
						case 'ArrowLeft':
							event.preventDefault();
							nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
							buttons[nextIndex].focus();
							break;
						case 'ArrowRight':
							event.preventDefault();
							nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
							buttons[nextIndex].focus();
							break;
						case 'Home':
							event.preventDefault();
							buttons[0].focus();
							break;
						case 'End':
							event.preventDefault();
							buttons[buttons.length - 1].focus();
							break;
					}
				});
			}
		}

		// Info Dropdown Accessibility
		const infoButtonContainer = this.controls.querySelector('#infoBtnChart');
		const infoButton = this.controls.querySelector('#infoBtn');
		const infoDropdownMenu = this.controls.querySelector('ul.dropdown-menu[aria-labelledby="infoBtn"]');

		if (infoButtonContainer && infoButton && infoDropdownMenu) {
			const dropdownItems = Array.from(infoDropdownMenu.querySelectorAll('.dropdown-item[role="menuitem"]'));

			$(infoButtonContainer).on('shown.bs.dropdown', function () {
				infoButton.setAttribute('aria-expanded', 'true');
				if (dropdownItems.length > 0) {
					dropdownItems[0].focus();
				}
			});

			$(infoButtonContainer).on('hidden.bs.dropdown', function () {
				infoButton.setAttribute('aria-expanded', 'false');
				// Return focus to the info button, but only if the focus is still within the dropdown menu
                // or on the button itself, to avoid overriding focus set elsewhere by user interaction.
                const activeElement = document.activeElement;
                if (infoDropdownMenu.contains(activeElement) || activeElement === infoButton) {
                    infoButton.focus();
                }
			});

			infoDropdownMenu.addEventListener('keydown', (event) => {
				if (event.key === 'Escape') {
					// Bootstrap should close the dropdown.
					// The 'hidden.bs.dropdown' event will handle returning focus.
					// We just ensure the button itself is focused if Bootstrap's event doesn't fire for some reason or focus is lost.
					// $(infoButtonContainer).dropdown('hide'); // Manually hide if necessary
					infoButton.focus();
				} else if (event.key === 'Tab') {
					if (dropdownItems.length === 0) return;

					const firstFocusableElement = dropdownItems[0];
					const lastFocusableElement = dropdownItems[dropdownItems.length - 1];

					if (event.shiftKey) { // Shift + Tab
						if (document.activeElement === firstFocusableElement) {
							event.preventDefault();
							lastFocusableElement.focus();
						}
					} else { // Tab
						if (document.activeElement === lastFocusableElement) {
							event.preventDefault();
							firstFocusableElement.focus();
						}
					}
				}
			});
		}
	}
  
	// countriesHandler(geoDropdown) {
	// 	const geoItems = geoDropdown.querySelectorAll('.dropdown-item ecl-link ecl-link--standalone');			

	// 	geoItems.forEach((item) => {
	// 		item.addEventListener('click', (event) => {
	// 			event.preventDefault(); // Prevent the default link behavior
	// 			geoItems.forEach((otherItem) => {
	// 				otherItem.classList.remove('active');
	// 			});
	// 			item.classList.add('active');

	// 			// Add your logic to handle the selected item here
	// 			const selectedGeo = item.getAttribute('data-geo');

	// 			// log(selectedGeo)

	// 			REF.geos = selectedGeo;

	// 			dataNameSpace.setRefURL();
	// 			compareCountries();

			
	// 		});
	// 	});
	// }

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
	  $("#menuToolbar").css('display', "flex");

	}
  }
  
  function disableChatOptionsBtn(chart) {
	REF.chartType = chart;  
	const btns = ["barChart", "pieChart", "lineChart"];  
	btns.forEach(btn => {
    if (REF.chartType === btn) {
      $("#" + btn).prop("disabled", true).attr("aria-pressed", "true");
    } else {
      $("#" + btn).prop("disabled", false).attr("aria-pressed", "false");
    }
	});
  }
  