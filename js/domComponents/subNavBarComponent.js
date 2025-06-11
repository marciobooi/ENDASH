class SubNavbar {
  constructor() {
    this.subNavbar = document.createElement("nav");
    this.subNavbar.setAttribute("aria-label", "Menu toolbar");
    this.subNavbar.setAttribute("id", "menuToolbar");
    this.subNavbar.setAttribute(
      "class",
      "navbar navbar-expand-sm navbar-light bg-light"
    );

    const notMobileContent = /*html*/ `
      <div class="container-fluid">
        <ul id="chartBtns"  data-i18n-label="OPTIONS_GRAPH_TOOLBOX" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
          <li class="nav-item dropdown px-1" id="infoBtnChart" role="menuitem">
            <button class="ecl-button ecl-button--primary round-btn" type="button" data-i18n-label="INFO" data-i18n-title="INFO" data-bs-toggle="dropdown"  aria-haspopup="true" id="infoBtn">
              <i class="fas fa-info"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" role="menu" data-i18n-labelledby="INFO">
              <button class="dropdown-item ecl-link ecl-link--standalone"  onclick="tutorial()" data-i18n-label="TUTORIAL" data-i18n="TUTORIAL" value="Tutorial"></button>
              <button class="dropdown-item ecl-link ecl-link--standalone"  onclick="socialNameSpace.email()" data-i18n-label="FEED" value="Feedback" aria-label="FEED" data-i18n="FEED">FEED</button>
            </ul>
          </li>
          <li class="nav-item dropdown px-1" id="social-media-dropdown" role="menuitem">
            <button class="ecl-button ecl-button--primary round-btn" type="button" data-i18n-label="SHARE" aria-label="SHARE" data-bs-toggle="dropdown"  data-i18n-title="SHARE" aria-haspopup="true" id="shareChart1">
              <i class="fas fa-share-alt" aria-hidden="true"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" role="menu" data-i18n-labelledby="SHARE">
              <p id="SHARETITLE" class="ecl-social-media-share__description" style="font-weight: normal;" data-i18n="SHARE"></p>
              <button class="dropdown-item ecl-link ecl-link--standalone"  onclick="socialNameSpace.twitter()" data-i18n-label="TWITTER" aria-label="TWITTER">
                <span class="socialImg ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon">
                  <img class="ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon" src="img/social-media/twiter.svg" alt="Twitter Icon" width="24" height="24" focusable="false" aria-hidden="true">
                </span>
                <span class="ecl-link__label" data-i18n="TWITTER"></span>
              </button>
              <button class="dropdown-item ecl-link ecl-link--standalone"  onclick="socialNameSpace.facebook()" data-i18n-label="FACEBOOK" aria-label="FACEBOOK">
                <span class="socialImg ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon">
                  <img class="ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon" src="img/social-media/face.svg" alt="Facebook Icon" width="24" height="24" focusable="false" aria-hidden="true">
                </span>
                <span class="ecl-link__label" data-i18n="FACEBOOK"></span>
              </button>
              <button class="dropdown-item ecl-link ecl-link--standalone"  onclick="socialNameSpace.linkedin()" data-i18n-label="LINKEDIN" aria-label="LINKEDIN">
                <span class="socialImg ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon">
                  <img class="ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon" src="img/social-media/linkdin.svg" alt="Linkedin Icon" width="24" height="24" focusable="false" aria-hidden="true">
                </span>
                <span class="ecl-link__label" data-i18n="LINKEDIN"></span>
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
          <button id="tools" class="btnGroup" type="button" data-i18n-label="TOOLS" data-i18n="TOOLS" aria-haspopup="true">
            <i class="fas fa-ellipsis-h"></i>
            <span class="iconText" data-i18n="TOOLS"></span>
          </button>
        </div>
        <div class="chartMenuMobile d-none">
          <ul id="chartBtns"  aria-label="Options graph toolbox" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
            <li class="nav-item dropdown px-1" id="infoBtnChart" role="menuitem">
              <button class="ecl-button ecl-button--primary round-btn" type="button" data-i18n-label="INFO" data-i18n-title="INFO" data-bs-toggle="dropdown"  aria-haspopup="true" id="infoBtn">
                <i class="fas fa-info"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end" role="menu" data-i18n-labelledby="INFO">
                <button class="dropdown-item ecl-link ecl-link--standalone"  onclick="tutorial()" data-i18n-label="TUTORIAL" data-i18n="TUTORIAL" value="Tutorial"></button>
                <button class="dropdown-item ecl-link ecl-link--standalone"  onclick="socialNameSpace.email()" data-i18n-label="FEED" value="Feedback" aria-label="FEED" data-i18n="FEED">FEED</button>
              </ul>
            </li>
            <li class="nav-item dropdown px-1" id="shareChart" role="menuitem"> {/* Changed nav-item button to nav-item dropdown for consistency */}
              <button id="embebedBtn" type="button" class="btn btn-primary min-with--nav round-btn" data-i18n-label="SHARE" aria-label="SHARE" data-i18n-title="SHARE" data-bs-toggle="dropdown" aria-haspopup="true"> {/* Assuming this is the Share trigger for mobile */}
                <i class="fas fa-share-alt"></i> {/* Changed icon to share, was fa-code */}
              </button>
              <ul class="dropdown-menu dropdown-menu-end" role="menu" data-i18n-labelledby="SHARE"> {/* This menu will be controlled by embebedBtn now */}
                <button class="dropdown-item ecl-link ecl-link--standalone"  onclick="socialNameSpace.twitter()" data-i18n-label="TWITTER" aria-label="TWITTER">TWITTER</button>
                <button class="dropdown-item ecl-link ecl-link--standalone"  onclick="socialNameSpace.facebook()" data-i18n-label="FACEBOOK" aria-label="FACEBOOK">FACEBOOK</button>
                <button class="dropdown-item ecl-link ecl-link--standalone"  onclick="socialNameSpace.linkedin()" data-i18n-label="LINKEDIN" aria-label="LINKEDIN">LINKEDIN</button>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    `;

    const isMobile =
      /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

    if (isMobile) {
      this.subNavbar.innerHTML = mobileContent;
    } else {
      this.subNavbar.innerHTML = notMobileContent;
    }

    if (isMobile) {
      this.toolsButton = this.subNavbar.querySelector("#tools");
      this.chartToolsMenu = this.subNavbar.querySelector(".chartMenuMobile");
      this.menuButton = this.subNavbar.querySelector("#menu");
      this.chartOptionsMenu = this.subNavbar.querySelector("#chartOptionsMenu");
      this.chartMenuOpen = this.subNavbar.querySelector("#menu");

      this.toolsButton.addEventListener("click", () => {
        this.chartToolsMenu.classList.toggle("d-none");
      });
    }
  }

  toggleChartOptionsMenu() {
    this.chartOptionsMenu.classList.toggle("toggleMenu");
    this.chartMenuOpen.classList.toggle("menuOpen");
  }

  addToDOM(targetElement) {
    const container = document.querySelector(targetElement);
    container.appendChild(this.subNavbar);
    this.addAccessibilityFeatures(); // Call new method
  }

  addAccessibilityFeatures() {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

    let dropdownSystems;
    let contextElement;

    if (isMobile) {
      contextElement = this.subNavbar.querySelector('.chartMenuMobile');
      if (!contextElement) return; // No mobile menu container found

      dropdownSystems = [
        {
          triggerId: 'infoBtn', // Same ID for mobile trigger
          parentId: 'infoBtnChart', // Parent <li> to attach Bootstrap events
          menuId: 'INFO'
        },
        {
          triggerId: 'embebedBtn', // This is the button ID in mobile for the share-like functionality
          parentId: 'shareChart',  // Parent <li> ID in mobile
          menuId: 'SHARE'
        }
      ];
    } else {
      contextElement = this.subNavbar;
      dropdownSystems = [
        {
          triggerId: 'infoBtn',
          parentId: 'infoBtnChart',
          menuId: 'INFO'
        },
        {
          triggerId: 'shareChart1',
          parentId: 'social-media-dropdown',
          menuId: 'SHARE'
        }
      ];
    }

    dropdownSystems.forEach(system => {
      // Query within the correct context (either full subNavbar or .chartMenuMobile)
      const triggerButton = contextElement.querySelector(`#${system.triggerId}`);
      const parentLi = contextElement.querySelector(`#${system.parentId}`);
      const dropdownMenu = parentLi ? parentLi.querySelector(`ul.dropdown-menu`) : null;

      if (triggerButton && parentLi && dropdownMenu) {
        // Ensure the mobile "Share" trigger button has dropdown attributes if it's meant to be one
        if (isMobile && system.triggerId === 'embebedBtn') {
          triggerButton.setAttribute('data-bs-toggle', 'dropdown');
          triggerButton.setAttribute('aria-haspopup', 'true');
          // Remove onclick if it's now a dropdown trigger
          triggerButton.removeAttribute('onclick');
        }

        const menuItems = Array.from(dropdownMenu.querySelectorAll('.dropdown-item[role="menuitem"]'));

        $(parentLi).on('shown.bs.dropdown', () => {
          triggerButton.setAttribute('aria-expanded', 'true');
          if (menuItems.length > 0) {
            menuItems[0].focus();
          }
        });

        $(parentLi).on('hidden.bs.dropdown', () => {
          triggerButton.setAttribute('aria-expanded', 'false');
          const activeElement = document.activeElement;
          if (dropdownMenu.contains(activeElement) || activeElement === triggerButton) {
             triggerButton.focus();
          }
        });

        dropdownMenu.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            triggerButton.focus();
          } else if (event.key === 'Tab') {
            if (menuItems.length === 0) return;
            const firstFocusableElement = menuItems[0];
            const lastFocusableElement = menuItems[menuItems.length - 1];
            if (event.shiftKey) {
              if (document.activeElement === firstFocusableElement) {
                event.preventDefault();
                lastFocusableElement.focus();
              }
            } else {
              if (document.activeElement === lastFocusableElement) {
                event.preventDefault();
                firstFocusableElement.focus();
              }
            }
          }
        });
      }
    });
  }
}
