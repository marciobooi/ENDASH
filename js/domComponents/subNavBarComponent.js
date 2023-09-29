class SubNavbar {
    constructor() {
      this.subNavbar = document.createElement('nav');
      this.subNavbar.setAttribute('aria-label', 'Menu toolbar');
      this.subNavbar.setAttribute('id', 'menuToolbar');
      this.subNavbar.setAttribute('class', 'navbar navbar-expand-sm navbar-light bg-light');

      // const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768
  

      const notMobileContent = `<div class="container-fluid">
            <div class="col-8">
              <div class="text-group">
                <h2 id="title" class="title">teste</h2>
              </div>
            </div>



            <div class="col-4">
              <ul id="chartBtns" role="menubar" aria-label="Options graph toolbox" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
              

              <li class="nav-item dropdown px-1" id="tb-country" role="none">
                  <button class="btn btn-primary min-with--nav" type="button" aria-label="tb-country-btn" data-bs-toggle="dropdown" role="menuitem" title="Select country" aria-haspopup="true" aria-expanded="true" id="selectCounty">
                    <i class="fas fa-globe"></i>
                  </button>
                  <ul id="dropdown-geo-list" class="dropdown-menu dropdown-menu-end form-control" role="menu" aria-labelledby="Select country"></ul>
              </li>
              <li class="nav-item dropdown px-1" id="infoBtnChart" role="none">
                  <button class="btn btn-primary min-with--nav" onclick="tutorial()" title="${languageNameSpace.labels['TUTORIAL']}" value="Tutorial">
                  <i class="fas fa-book-open"></i>
                  </button>



                  <!-- <ul class="dropdown-menu dropdown-menu-end" role="menu" aria-labelledby="infoBtn">     					
                    <button class="dropdown-item" role="menuitem" onclick="tutorial()" aria-label="${languageNameSpace.labels['TUTORIAL']}" value="Tutorial">${languageNameSpace.labels['TUTORIAL']}</button>
                    <button class="dropdown-item" role="menuitem" onclick="openMeta()" aria-label="${languageNameSpace.labels['meta']}" value="Metadata" >${languageNameSpace.labels['meta']}</button>
                    <button class="dropdown-item" role="menuitem" onclick="mailContact()" aria-label="${languageNameSpace.labels['FEED']}" value="Feedback">${languageNameSpace.labels['FEED']}</button>          		
                  </ul> -->
                </li>
              </ul>
          </div>`;


      const mobileContent = `<div class="">
        <div class="col-12 subNavOne">
          <div class="">              
              <button id="tools" class="btnGroup" type="button" aria-label="${languageNameSpace.labels["TOOLS"]}" title="${languageNameSpace.labels["TOOLS"]}" aria-haspopup="true">
                <i class="fas fa-ellipsis-h"></i>      
                <span class="iconText">${languageNameSpace.labels["TOOLS"]}</span>    
              </button>
          </div>
          <div class="">              
              <button id="menu" class="btnGroup" type="button" aria-label="${languageNameSpace.labels["MAINMENU"]}" title="${languageNameSpace.labels["MAINMENU"]}" aria-haspopup="true">
                <i class="fas fa-bars"></i>                    
                <span class="iconText">${languageNameSpace.labels["MAINMENU"]}</span>           
              </button>
          </div>

        <div class="chartMenuMobile d-none">
          <ul id="chartBtns" role="menubar" aria-label="Options graph toolbox" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
              <li class="nav-item dropdown px-1" id="infoBtnChart" role="none">
                <button class="btn btn-primary min-with--nav" type="button" aria-label="InfoBtn" data-bs-toggle="dropdown" role="menuitem" title="Info" aria-haspopup="true" aria-expanded="true" id="infoBtn">
                  <i class="fas fa-info"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" role="menu" aria-labelledby="infoBtn">     					
                  <button class="dropdown-item" role="menuitem" onclick="tutorial()" aria-label="${languageNameSpace.labels['TUTORIAL']}" value="Tutorial">${languageNameSpace.labels['TUTORIAL']}</button>
                  <button class="dropdown-item" role="menuitem" onclick="openMeta()" aria-label="${languageNameSpace.labels['meta']}" value="Metadata" >${languageNameSpace.labels['meta']}</button>
                  <button class="dropdown-item" role="menuitem" onclick="mailContact()" aria-label="${languageNameSpace.labels['FEED']}" value="Feedback">${languageNameSpace.labels['FEED']}</button>          		
                </ul>
              </li>
              <li class="nav-item dropdown px-1" id="downloadChart" role="none">
                <button class="btn btn-primary min-with--nav" type="button" aria-label="download chart image" data-bs-toggle="dropdown" role="menuitem" title="Download chart image" aria-haspopup="true" aria-expanded="true" id="downloadBtn">
                  <i class="fas fa-download"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" role="menu" aria-labelledby="Download chart">     					
                  <button class="dropdown-item" role="menuitem" onclick="exportPngChart()" aria-label="${languageNameSpace.labels['downloadPNG']}">${languageNameSpace.labels["downloadPNG"]}</button>
                  <button class="dropdown-item" role="menuitem" onclick="exportJpegChart()" aria-label="${languageNameSpace.labels['downloadJPEG']}">${languageNameSpace.labels["downloadJPEG"]}</button>
                  <button class="dropdown-item" role="menuitem" onclick="exportXlsChart()" aria-label="${languageNameSpace.labels['downloadXLS']}">${languageNameSpace.labels["downloadXLS"]}</button>        		
                </ul>
              </li>     
              <li class="nav-item button px-1" id="shareChart" role="none">
                <button id="shareBtn" title="share chart" type="button" class="btn btn-primary min-with--nav" aria-label="share chart" onclick="">
                  <i class="fas fa-share-alt"></i>
                </button>
              </li>
              <li class="nav-item button px-1" id="embebedChart" role="none">
                <button id="embebedBtn" title="Embebed chart iframe" type="button" class="btn btn-primary min-with--nav" aria-label="Embebed chart iframe" onclick="exportIframe()">
                  <i class="fas fa-code"></i>
                </button>
              </li>
          </ul>
        </div>

            <div id="chartOptionsMenu" class="toggleMenu">
              <div class="close-button-container">
                <button id="closeChartMenuBtn" class="btn btn-primary close-chart-menu-btn" aria-label="Close chart menu">
                <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="dropdown-grid">
                <div class="row">        
                </div>
              </div>
            </div>


        </div>
        <div class="col-12 subNavTwo">
          <div class="text-group">
              <h2 id="title" class="title"></h2>
              <!-- <h6 id="subtitle" class="subtitle"></h6>       -->
            </div>
        </div>
      </div>`;


         


        // if (isMobile) {          
        //   this.subNavbar.innerHTML = mobileContent         
          
        //   this.toolsButton = this.subNavbar.querySelector('#tools');
        //   this.chartToolsMenu = this.subNavbar.querySelector('.chartMenuMobile');
        //   this.menuButton = this.subNavbar.querySelector('#menu');
        //   this.chartOptionsMenu = this.subNavbar.querySelector('#chartOptionsMenu');
        //   this.chartMenuOpen = this.subNavbar.querySelector('#menu');
      
        //   this.toolsButton.addEventListener('click', () => {        
        //     this.chartOptionsMenu.classList.contains("toggleMenu") ? "" : this.toggleChartOptionsMenu();
        //     this.chartToolsMenu.classList.toggle('d-none');
        //   });

        //   this.menuButton.addEventListener('click', () => {
        //     this.chartToolsMenu.classList.contains("d-none") ? "" : this.chartToolsMenu.classList.toggle('d-none');
        //     this.toggleChartOptionsMenu();
        //   });

        // } else {

          this.subNavbar.innerHTML = notMobileContent;
          // Handle desktop-specific logic
          const geoDropdown = this.subNavbar.querySelector('#dropdown-geo-list');

          geoDropdown.innerHTML = ''
    
          // You need to define `defaultGeos`, `active`, and `visible` variables.
          defaultGeos.forEach(geo => {
            const content = `<a role="menuitem" class="dropdown-item d-flex justify-content-between align-items-center ${REF.geos === geo ? "active" : ''}" href="#"  data-geo="${geo}" data-bs-toggle="button">
              <span>  
                <img class="flag me-2" src="img/country_flags/${geo}.webp" alt="">${languageNameSpace.labels[geo]}
              </span>
            </a>`;
            geoDropdown.innerHTML += content;
          });     
          
          
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

              REF.geos = selectedGeo

              dataNameSpace.setRefURL()

              removeComponents()
              buildComponents()
              endash();
              // Example: Call a function or update a variable with the selected value
              // handleSelectedGeo(selectedGeo);
            });
          });






        // }     





    }

    addToDOM(targetElement) {
      const container = document.querySelector(targetElement);
      container.appendChild(this.subNavbar);
 
    }
  }











  