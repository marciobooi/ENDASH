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
        <ul id="chartBtns" role="menubar" data-i18n-label="OPTIONS_GRAPH_TOOLBOX" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
          <li class="nav-item dropdown px-1" id="infoBtnChart" role="none">
            <button class="ecl-button ecl-button--primary round-btn" type="button" data-i18n-label="INFO" data-i18n-title="INFO" data-bs-toggle="dropdown" role="menuitem" aria-haspopup="true" aria-expanded="true" id="infoBtn">
              <i class="fas fa-info"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" role="menu" data-i18n-labelledby="INFO">
              <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="tutorial()" data-i18n-label="TUTORIAL" data-i18n="TUTORIAL" value="Tutorial"></button>
              <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="socialNameSpace.email()" data-i18n-label="FEED" value="Feedback" aria-label="FEED" data-i18n="FEED">FEED</button>
            </ul>
          </li>
          <li class="nav-item dropdown px-1" id="social-media-dropdown" role="none">
            <button class="ecl-button ecl-button--primary round-btn" type="button" data-i18n-label="SHARE" aria-label="SHARE" data-bs-toggle="dropdown" role="menuitem" data-i18n-title="SHARE" aria-haspopup="true" aria-expanded="true" id="shareChart1">
              <i class="fas fa-share-alt" aria-hidden="true"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" role="menu" data-i18n-labelledby="SHARE">
              <p id="SHARETITLE" class="ecl-social-media-share__description" style="font-weight: normal;" data-i18n="SHARE"></p>
              <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="socialNameSpace.twitter()" data-i18n-label="TWITTER" aria-label="TWITTER">
                <span class="socialImg ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon">
                  <img class="ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon" src="img/social-media/twiter.svg" alt="Twitter Icon" width="24" height="24" focusable="false" aria-hidden="true">
                </span>
                <span class="ecl-link__label" data-i18n="TWITTER"></span>
              </button>
              <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="socialNameSpace.facebook()" data-i18n-label="FACEBOOK" aria-label="FACEBOOK">
                <span class="socialImg ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon">
                  <img class="ecl-icon ecl-icon--m ecl-link__icon ecl-social-media-share__icon" src="img/social-media/face.svg" alt="Facebook Icon" width="24" height="24" focusable="false" aria-hidden="true">
                </span>
                <span class="ecl-link__label" data-i18n="FACEBOOK"></span>
              </button>
              <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="socialNameSpace.linkedin()" data-i18n-label="LINKEDIN" aria-label="LINKEDIN">
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
          <ul id="chartBtns" role="menubar" aria-label="Options graph toolbox" class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 50vw;">
            <li class="nav-item dropdown px-1" id="infoBtnChart" role="none">
              <button class="ecl-button ecl-button--primary round-btn" type="button" data-i18n-label="INFO" data-i18n-title="INFO" data-bs-toggle="dropdown" role="menuitem" aria-haspopup="true" aria-expanded="true" id="infoBtn">
                <i class="fas fa-info"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end" role="menu" data-i18n-labelledby="INFO">
                <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="tutorial()" data-i18n-label="TUTORIAL" data-i18n="TUTORIAL" value="Tutorial"></button>
                <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="socialNameSpace.email()" data-i18n-label="FEED" value="Feedback" aria-label="FEED" data-i18n="FEED">FEED</button>
              </ul>
            </li>
            <li class="nav-item button px-1" id="shareChart" role="none">
              <button id="embebedBtn" type="button" class="btn btn-primary min-with--nav round-btn" data-i18n-label="EMBEDDED" aria-label="EMBEDDED" data-i18n-title="EMBEDDED" onclick="exportIframe()">
                <i class="fas fa-code"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end" role="menu" data-i18n-labelledby="SHARE">
                <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="socialNameSpace.twitter()" data-i18n-label="TWITTER" aria-label="TWITTER">TWITTER</button>
                <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="socialNameSpace.facebook()" data-i18n-label="FACEBOOK" aria-label="FACEBOOK">FACEBOOK</button>
                <button class="dropdown-item ecl-link ecl-link--standalone" role="menuitem" onclick="socialNameSpace.linkedin()" data-i18n-label="LINKEDIN" aria-label="LINKEDIN">LINKEDIN</button>
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
  }
}
