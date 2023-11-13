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
                <h2 id="title" class="title"></h2>
              </div>
            </div>



            <div class="col-4">
              <ul id="chartBtns" role="menubar" aria-label="Options graph toolbox" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
              

              <li class="nav-item dropdown px-1" id="tb-country" role="none">
                  <button class="btn btn-primary min-with--nav" type="button" aria-label="Select country" data-bs-toggle="dropdown" role="menuitem" title="Select country" aria-haspopup="true" aria-expanded="false" id="selectCounty">
                    <i class="fas fa-globe" aria-hidden="true"></i>
                  </button>
                  <ul id="dropdown-geo-list" class="dropdown-menu dropdown-menu-end form-control" role="menu" aria-labelledby="selectCountry"></ul>
              </li>
              <li class="nav-item dropdown px-1" id="infoBtnChart" role="none">
                  <button class="btn btn-primary min-with--nav" onclick="tutorial()" title="${languageNameSpace.labels['TUTORIAL']}" value="Tutorial">
                  <i class="fas fa-book-open"></i>
                  </button>
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
          <div id="chartBtns" role="menubar" aria-label="Options graph toolbox" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">     
              <li class="nav-item dropdown px-1" id="tb-country" role="none">
                  <button class="btn btn-primary min-with--nav" type="button" aria-label="tb-country-btn" data-bs-toggle="dropdown" role="menuitem" title="Select country" aria-haspopup="true" aria-expanded="true" id="selectCounty">
                    <i class="fas fa-globe"></i>
                  </button>
                  <ul id="dropdown-geo-list" style="top:7.9rem!important" class="dropdown-menu dropdown-menu-end form-control" role="menu" aria-labelledby="Select country"></ul>
              </li>             
              </div>
          </div>

          <div class="chartMenuMobile d-none">
            <ul id="chartBtns" role="menubar" aria-label="Options graph toolbox" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
                <li class="nav-item dropdown px-1" id="infoBtnChart" role="none">
                  <button class="btn btn-primary min-with--nav" type="button" aria-label="InfoBtn" data-bs-toggle="dropdown" role="menuitem" title="Info" aria-haspopup="true" aria-expanded="true" id="infoBtn">
                    <i class="fas fa-info"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end" role="menu" aria-labelledby="infoBtn">     					
                    <button class="dropdown-item" role="menuitem" onclick="tutorial()" aria-label="${languageNameSpace.labels['TUTORIAL']}" value="Tutorial">${languageNameSpace.labels['TUTORIAL']}</button>
                    <button class="dropdown-item" role="menuitem" onclick="mailContact()" aria-label="${languageNameSpace.labels['FEED']}" value="Feedback">${languageNameSpace.labels['FEED']}</button>          		
                  </ul>
                </li>
                <li class="nav-item button px-1" id="shareChart" role="none">
                  <button class="btn btn-primary min-with--nav" type="button" aria-label="share chart" data-bs-toggle="dropdown" role="menuitem" title="share chart" aria-haspopup="true" aria-expanded="true" id="shareBtn">
                    <i class="fas fa-share-alt"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end" role="menu" aria-labelledby="Download chart">     					
                    <button class="dropdown-item" role="menuitem" onclick="socialNameSpace.twitter()" aria-label="${languageNameSpace.labels['twitter']}" value="twitter">${languageNameSpace.labels['twitter']}</button>
                    <button class="dropdown-item" role="menuitem" onclick="socialNameSpace.facebook()" aria-label="${languageNameSpace.labels['linkedin']}" value="linkedin" >${languageNameSpace.labels['linkedin']}</button>
                    <button class="dropdown-item" role="menuitem" onclick="socialNameSpace.linkedIn()" aria-label="${languageNameSpace.labels['facebook']}" value="facebook">${languageNameSpace.labels['facebook']}</button>          		
                  </ul>
                </li>
            </ul>
          </div>

      
           
          


        </div>
        <div class="col-12 subNavTwo">
          <div class="text-group">
              <h2 id="title" class="title"></h2>
              <!-- <h6 id="subtitle" class="subtitle"></h6>       -->
            </div>
        </div>
      </div>`;




      if (isMobile) { 
        this.subNavbar.innerHTML = mobileContent
      } else {
        this.subNavbar.innerHTML = notMobileContent
      }


        if (isMobile) {          
              
          
          this.toolsButton = this.subNavbar.querySelector('#tools');
          this.chartToolsMenu = this.subNavbar.querySelector('.chartMenuMobile');
          this.menuButton = this.subNavbar.querySelector('#menu');
          this.chartOptionsMenu = this.subNavbar.querySelector('#chartOptionsMenu');
          this.chartMenuOpen = this.subNavbar.querySelector('#menu');
      
          this.toolsButton.addEventListener('click', () => {        
            this.chartToolsMenu.classList.toggle('d-none');
          });

        } 

          // Handle desktop-specific logic
          const geoDropdown = this.subNavbar.querySelector('#dropdown-geo-list');

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
            });
          });




        

        

   
    



    }

    toggleChartOptionsMenu() {
      this.chartOptionsMenu.classList.toggle('toggleMenu');
      this.chartMenuOpen.classList.toggle('menuOpen');
    }

    addToDOM(targetElement) {
      const container = document.querySelector(targetElement);
      container.appendChild(this.subNavbar);
 
    }
  }











  