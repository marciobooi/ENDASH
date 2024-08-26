class SubNavbar {
    constructor() {
      this.subNavbar = document.createElement('nav');
      this.subNavbar.setAttribute('aria-label', 'Menu toolbar');
      this.subNavbar.setAttribute('id', 'menuToolbar');
      this.subNavbar.setAttribute('class', 'navbar navbar-expand-sm navbar-light bg-light');

      // const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768
  

      const notMobileContent = /*html*/`
      <div class="container-fluid">      
            <ul id="chartBtns" role="menubar" aria-label="Options graph toolbox" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
              <li class="nav-item dropdown px-1" id="infoBtnChart" role="none">
                <button class="ecl-button ecl-button--primary round-btn" type="button" aria-label="InfoBtn" data-bs-toggle="dropdown" role="menuitem" title="Info" aria-haspopup="true" aria-expanded="true" id="infoBtn">
                  <i class="fas fa-info"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" role="menu" aria-labelledby="infoBtn">     					
                  <button class="dropdown-item" role="menuitem" onclick="tutorial()" aria-label="${languageNameSpace.labels['TUTORIAL']}" value="Tutorial">${languageNameSpace.labels['TUTORIAL']}</button>
                  <button class="dropdown-item" role="menuitem" onclick="mailContact()" aria-label="${languageNameSpace.labels['FEED']}" value="Feedback">${languageNameSpace.labels['FEED']}</button>          		
                </ul>
              </li>
      
              <li class="nav-item dropdown px-1" id="social-media-dropdown" role="none">
                <button class="ecl-button ecl-button--primary round-btn" type="button" aria-label="Share in social media" data-bs-toggle="dropdown" role="menuitem" title="Share chart" aria-haspopup="true" aria-expanded="true" id="shareChart1">
                  <i class="fas fa-share-alt" aria-hidden="true"></i>
                </button>
      
                <ul class="dropdown-menu dropdown-menu-end" style="padding: 12px;" role="menu" aria-labelledby="Share chart">     	  					
                <p id="SHARETITLE" class="ecl-social-media-share__description" style="font-weight: normal;">${languageNameSpace.labels['SHARE']}</p>   		

                <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="socialNameSpace.twitter()" aria-label="${languageNameSpace.labels['twitter']}">                  
                    <span class="socialImg ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon">
                      <img class="ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon" src="img/social-media/twiter.svg" alt="Twitter Icon" width="24" height="24" focusable="false" aria-hidden="true">
                    </span>
                    <span class="ecl-link__label">${languageNameSpace.labels["twitter"]}</span>                  
                </button>  

                <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="socialNameSpace.facebook()" aria-label="${languageNameSpace.labels['facebook']}">
                  <span class="socialImg ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon">
                    <img class="ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon" src="img/social-media/face.svg" alt="Facebook Icon" width="24" height="24" focusable="false" aria-hidden="true">
                  </span>
                  <span class="ecl-link__label">${languageNameSpace.labels["facebook"]}</span>                  
                </button>

                <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="socialNameSpace.linkedin()" aria-label="${languageNameSpace.labels['linkedin']}">
                  <span class="socialImg ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon">
                    <img class="ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon" src="img/social-media/linkdin.svg" alt="Linkedin Icon" width="24" height="24" focusable="false" aria-hidden="true">
                  </span>
                  <span class="ecl-link__label">${languageNameSpace.labels["linkedin"]}</span>                  
                </button>
                  </ul>



















              </li>
            </ul>
    </div>
    `;


      const mobileContent = /*html*/ `
      <div class="col-12 subNavOne">
        <div class="subNavTwo">
          <div class="text-group">
            <h2 id="title" class="title"></h2>
          </div>
        </div>
        <div class="menuShare">
          <button id="tools" class="btnGroup" type="button" aria-label="${languageNameSpace.labels[" TOOLS"]}" title="${languageNameSpace.labels[" TOOLS"]}" aria-haspopup="true">
            <i class="fas fa-ellipsis-h"></i>
            <span class="iconText">${languageNameSpace.labels["TOOLS"]}</span>
          </button>
        </div>
        <div class="chartMenuMobile d-none">
        <ul id="chartBtns" role="menubar" aria-label="Options graph toolbox" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
          <li class="nav-item dropdown px-1" id="infoBtnChart" role="none">
            <button class="ecl-button ecl-button--primary round-btn" type="button" aria-label="InfoBtn" data-bs-toggle="dropdown" role="menuitem" title="Info" aria-haspopup="true" aria-expanded="true" id="infoBtn">
              <i class="fas fa-info"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" role="menu" aria-labelledby="infoBtn">
              <button class="dropdown-item" role="menuitem" onclick="tutorial()" aria-label="${languageNameSpace.labels['TUTORIAL']}" value="Tutorial">${languageNameSpace.labels['TUTORIAL']}</button>
              <button class="dropdown-item" role="menuitem" onclick="mailContact()" aria-label="${languageNameSpace.labels['FEED']}" value="Feedback">${languageNameSpace.labels['FEED']}</button>
            </ul>
          </li>
          <li class="nav-item button px-1" id="shareChart" role="none">
            <button id="embebedBtn" title="Embebed chart iframe" type="button" class="btn btn-primary  min-with--nav round-btn" aria-label="Embebed chart iframe" onclick="exportIframe()">
              <i class="fas fa-code" aria-hidden="true"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" role="menu" aria-labelledby="Download chart">
              <button class="dropdown-item" role="menuitem" onclick="socialNameSpace.twitter()" aria-label="${languageNameSpace.labels['twitter']}" value="twitter">${languageNameSpace.labels['twitter']}</button>
              <button class="dropdown-item" role="menuitem" onclick="socialNameSpace.facebook()" aria-label="${languageNameSpace.labels['linkedin']}" value="linkedin">${languageNameSpace.labels['linkedin']}</button>
              <button class="dropdown-item" role="menuitem" onclick="socialNameSpace.linkedIn()" aria-label="${languageNameSpace.labels['facebook']}" value="facebook">${languageNameSpace.labels['facebook']}</button>
            </ul>
          </li>
        </ul>
      </div>
      </div>
        `;




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
          // const geoDropdown = this.subNavbar.querySelector('#dropdown-geo-list');

          // geoDropdown.innerHTML = ''  

          // defaultGeos.forEach(geo => {
          //   const content = document.createElement('a');
          //   content.setAttribute('role', 'menuitem');
          //   content.classList.add('dropdown-item', 'd-flex', 'justify-content-between', 'align-items-center');
          //   if (REF.geos.includes(geo)) { // Check if `geo` is in the `REF.geos` array
          //     content.classList.add('active');
          //   }
          //   content.href = '#';
          //   content.setAttribute('data-geo', geo);
          //   content.setAttribute('data-bs-toggle', 'button');
            
          //   const innerContent = document.createElement('span');
          //   const flagImage = document.createElement('img');
          //   flagImage.classList.add('flag', 'me-2');
          //   flagImage.src = `img/country_flags/${geo.toLowerCase()}.webp`;
          //   flagImage.alt = '';
            
          //   const labelText = document.createTextNode(languageNameSpace.labels[geo]);
            
          //   innerContent.appendChild(flagImage);
          //   innerContent.appendChild(labelText);
          //   content.appendChild(innerContent);
            
          //   geoDropdown.appendChild(content);
          // });
          
          
          
          // const geoItems = geoDropdown.querySelectorAll('.dropdown-item');

          
          
          // geoItems.forEach((item) => {
          //   item.addEventListener('click', (event) => {
          //     event.preventDefault(); // Prevent the default link behavior
          //     geoItems.forEach((otherItem) => {
          //       otherItem.classList.remove('active');
          //     });
          //     item.classList.add('active');
              
          //     // Add your logic to handle the selected item here
          //     const selectedGeo = item.getAttribute('data-geo');

          //     REF.geos = selectedGeo

          //     dataNameSpace.setRefURL()

          //     removeComponents()
          //     buildComponents()
          //     endash();
          //   });
          // });




        

        

   
    



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











  