class ChartControls {
  constructor() {
    this.controls = document.createElement("div");

    const notMobileContent = /*html*/ `
      <nav aria-label="Chart controls" id="chartControls" class="navbar navbar-expand-sm navChartControls">
        <div class="menu">
          <ul id="chartBtns" role="menubar" aria-label="Options graph toolbox" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
            <li class="nav-item button px-1" id="toggleBarChart" role="none"></li>
            <li class="nav-item button px-1" id="togglePieChart" role="none"></li>
            <li class="nav-item button px-1" id="toggleLineChart" role="none"></li>
            <li class="nav-item button px-1" id="toggleAuxTable" role="none" style="margin-right: 2rem;"></li>
            <li class="nav-item dropdown px-1" id="downloadChart" role="none"></li>
            <li class="nav-item button px-1" id="downloadExcel" role="none"></li>
            <li class="nav-item button px-1" id="embebedChart" role="none"></li>
            <li class="nav-item dropdown px-1" id="infoBtnChart" role="none" style="margin-right: 2rem;">
              <button class="ecl-button ecl-button--primary round-btn" type="button" data-i18n-label="INFO" data-ecl-toggle="dropdown" role="menuitem" data-i18n-title="INFO" aria-haspopup="true" aria-expanded="false" id="infoBtn">
                <i class="fas fa-info"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end" role="menu" aria-labelledby="infoBtn">
                <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="openMeta()" data-i18n="METADATA" data-i18n-label="METADATA" aria-label="Metadata" value="Metadata">Metadata</button>
                <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="openDataset()" data-i18n="DB" data-i18n-label="DB" aria-label="Dataset" value="Dataset">Dataset</button>
              </ul>
            </li>
            <li class="nav-item button" id="closeChart" role="none"></li>
          </ul>
        </div>
      </nav>
    `;

    const mobileContent = /*html*/ `
      <div id="chartOptions">
        <div class="col-12 subNavOne auxChartbtn">
          <div class="menu">
            <li class="nav-item button px-1" id="toggleBarChart" role="none"></li>
            <li class="nav-item button px-1" id="togglePieChart" role="none"></li>
            <li class="nav-item button px-1" id="toggleLineChart" role="none"></li>
            <li class="nav-item button px-1" id="toggleAuxTable" role="none"></li>
            <li class="nav-item dropdown px-1" id="downloadChart" role="none"></li>
            <li class="nav-item button px-1" id="downloadExcel" role="none"></li>
            <li class="nav-item button px-1" id="embebedChart" role="none"></li>
            <li class="nav-item button px-1" id="closeChart" role="none"></li>
          </div>
        </div>
      </div>
    `;

    this.controls.innerHTML = isMobile ? mobileContent : notMobileContent;
  }

  addToDOM(targetElement) {
    const menuToolbar = document.querySelector("#menuToolbar");
    if (menuToolbar) {
      menuToolbar.style.display = "none";
    }

    const container = document.querySelector(targetElement);
    container.insertBefore(this.controls, container.firstChild);

    const barChart = new Button("barChart", ["ecl-button", "ecl-button--primary", "round-btn"], "SHOW_BAR_CHART", "barChart", "false");
    const pieChart = new Button("pieChart", ["ecl-button", "ecl-button--primary", "round-btn"], "SHOW_PIE_CHART", "pieChart", "false");
    const lineChart = new Button("lineChart", ["ecl-button", "ecl-button--primary", "round-btn"], "SHOW_LINE_CHART", "lineChart", "true");
    const table = new Button("toggleTableBtn", ["ecl-button", "ecl-button--primary", "round-btn"], "SHOW_TABLE", "table", "false");
    const downloadChart = new Button("downloadBtn", ["ecl-button", "ecl-button--primary", "round-btn"], "DOWNLOAD_CHART_IMAGE", "false");
    const downloadExcel = new Button("excelBtn", ["ecl-button", "ecl-button--primary", "round-btn"], "DOWNLOAD_XLS", "false");
    const embebedeChart = new Button("embebedBtn", ["ecl-button", "ecl-button--primary", "round-btn"], "SHARE", "false");
    const closeChart = new Button("btnCloseModalChart", ["ecl-button", "ecl-button--primary", "round-btn", "close-chart-menu-btn"], "CLOSE", "false");

    barChart.setInnerHtml('<i class="fas fa-chart-bar"></i>');
    pieChart.setInnerHtml('<i class="fas fa-chart-pie"></i>');
    lineChart.setInnerHtml('<i class="fas fa-chart-line"></i>');
    table.setInnerHtml('<i class="fas fa-table"></i>');
    downloadChart.setInnerHtml('<i class="fas fa-download"></i>');
    downloadExcel.setInnerHtml('<i class="fas fa-file-excel"></i>');
    embebedeChart.setInnerHtml('<i class="fas fa-code"></i>');
    closeChart.setInnerHtml('<i class="fas fa-times"></i>');

    barChart.setClickHandler(function() {
      disableChatOptionsBtn(this.value);
      REF.chartType = "barChart";
      dataNameSpace.setRefURL();
      showHideTimeLine();
      compareCountries();
      showHideBarChartOptions();
    });

    pieChart.setClickHandler(function() {
      disableChatOptionsBtn(this.value);
      REF.chartType = "pieChart";
      REF.chartCreated = false;
      dataNameSpace.setRefURL();
      showHideTimeLine();
      compareCountries();
      showHideBarChartOptions();
    });

    lineChart.setClickHandler(function() {
      disableChatOptionsBtn(this.value);
      REF.chartType = "lineChart";
      dataNameSpace.setRefURL();
      showHideTimeLine();
      showHideBarChartOptions();
      compareCountries();
    });

    table.setClickHandler(function() {
      const tableBtn = document.querySelector("#toggleTableBtn");
      const tableIcon = document.querySelector("#toggleTableBtn > i");

      if (tableIcon.classList.contains("fa-table")) {
        tableIcon.classList.remove("fa-table");
        tableIcon.classList.add("fa-chart-bar");

        tableBtn.setAttribute("aria-label", "Toggle chart");
        tableBtn.setAttribute("title", "Toggle chart");

        ["barChart", "pieChart", "lineChart"].forEach((chart) => {
          const element = document.getElementById(chart);
          if (element) {
            element.setAttribute("disabled", "disabled");
            element.setAttribute("aria-disabled", "true");
          }
        });

        const chartElement = document.getElementById(REF.chartType);
        if (chartElement) {
          chartElement.classList.add("highlighDisbleBtn");
        }

        const floatingMenu = document.querySelector("#floatingMenu");
        if (floatingMenu) {
          floatingMenu.style.display = "none";
        }

        openVizTable();
        tableBtn.focus();
        setTimeout(() => tableBtn.focus(), 400);
      } else {
        tableIcon.classList.remove("fa-chart-bar");
        tableIcon.classList.add("fa-table");

        tableBtn.setAttribute("aria-label", "Toggle table");
        tableBtn.setAttribute("title", "Toggle table");

        closeTable();
        disableChatOptionsBtn(REF.chartId);

        const floatingMenu = document.querySelector("#floatingMenu");
        if (floatingMenu) {
          floatingMenu.style.display = "flex";
        }

        const chartElement = document.getElementById(REF.chartType);
        if (chartElement) {
          chartElement.classList.remove("highlighDisbleBtn");
        }

        setTimeout(() => tableBtn.focus(), 400);
      }
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
      REF.chartExpanded = false;
      REF.chartType = "lineChart";
      showHideTimeLine();
      removeAuxiliarBarGraphOptions();
    });

    const barChartButton = barChart.createButton();
    const pieChartButton = pieChart.createButton();
    const lineChartButton = lineChart.createButton();
    const tableButton = table.createButton();
    const downloadChartButton = downloadChart.createButton();
    const downloadExcelButton = downloadExcel.createButton();
    const embebedeChartButton = embebedeChart.createButton();
    const closeChartButton = closeChart.createButton();

    // Defensive fallback: keep an inline onclick attribute so modal opening
    // still works even if external DOM re-inits replace event listeners.
    embebedeChartButton.setAttribute("onclick", "exportIframe()");

    [
      barChartButton,
      pieChartButton,
      lineChartButton,
      tableButton,
      downloadChartButton,
      downloadExcelButton,
      embebedeChartButton,
      closeChartButton,
    ].forEach((button) => button.setAttribute("role", "menuitem"));

    document.getElementById("toggleBarChart").appendChild(barChartButton);
    document.getElementById("togglePieChart").appendChild(pieChartButton);
    document.getElementById("toggleLineChart").appendChild(lineChartButton);
    document.getElementById("toggleAuxTable").appendChild(tableButton);
    document.getElementById("downloadChart").appendChild(downloadChartButton);
    document.getElementById("downloadExcel").appendChild(downloadExcelButton);
    document.getElementById("embebedChart").appendChild(embebedeChartButton);
    document.getElementById("closeChart").appendChild(closeChartButton);

    lineChart.setDisabled(true);

    // Chart controls are dynamic (created on expand), so attach tooltip handlers now.
    if (typeof enableTooltips === "function") {
      setTimeout(() => enableTooltips(), 0);
    }
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

    const menuToolbar = document.querySelector("#menuToolbar");
    if (menuToolbar) {
      menuToolbar.style.display = "flex";
    }
  }
}

function disableChatOptionsBtn(chart) {
  REF.chartType = chart;
  const btns = ["barChart", "pieChart", "lineChart"];
  btns.forEach((btn) => {
    const element = document.getElementById(btn);
    if (element) {
      element.disabled = REF.chartType === btn;
    }
  });
}
