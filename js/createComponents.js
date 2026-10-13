
document.addEventListener('DOMContentLoaded', function() {
  dataNameSpace.getRefURL();

  const euGlobanContainer = document.createElement('div');
  euGlobanContainer.id = 'euGlobanContainer';
  
  const header = document.querySelector('header');
  if (header) {
    header.insertBefore(euGlobanContainer, header.firstChild);
  }

  if (window.$wt && typeof window.$wt.render === "function") {
    window.$wt.render("euGlobanContainer", {
      utility: "globan",
      lang: REF.language.toLowerCase(),
      theme: "dark",
      logo: true,
      link: true,
      mode: false,
      zindex : 40
    });
  }

  // Load labels first, then build components so charts render with translated strings.
  languageNameSpace.initLanguage(REF.language).then(() => {
    buildComponents();
    // Re-run translation pass so dynamically-created components (footer, navbar)
    // get their data-i18n text filled in.
    languageNameSpace.applyTranslations();
    checkAndShowTutorial();
  }).catch((err) => {
    console.error("initLanguage failed on startup", err);
    buildComponents();
    checkAndShowTutorial();
  });
});

function buildComponents() {
  const components = [
    { instance: new SubNavbar(), target: "#subnavbar-container" },
    { instance: new Navbar(), target: "#navbar-container" },
    { instance: new Footer(), target: "#componentFooter" },
    { instance: new ThemeNav(), target: "#themeNavContainer" },
    { instance: new ChartContainer(), target: "#endash" },
  ];

  components.forEach(({ instance, target }) => {
    instance.addToDOM(target);
  });
ECL.autoInit();

  // ChartContainer's IntersectionObserver fires its "initial state" callback
  // asynchronously; relying on it alone after a full rebuild (e.g. a language
  // switch, which wipes #endash and recreates every card from scratch) has
  // shown to occasionally leave the first couple of already-visible cards
  // stuck on stale content instead of getting a fresh render pass. The same
  // ChartContainer already has a scroll-settle fallback sweep for exactly
  // this class of "observer missed a visible card" issue (built for fast
  // scrolling); trigger it here too, once the DOM has had a chance to paint.
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 0);
}

function removeComponents() {
  const navbarContainer = document.querySelector('#navbar-container');
  const subnavbarContainer = document.querySelector('#subnavbar-container');
  const themeNavContainer = document.querySelector('#themeNavContainer');
  const endash = document.querySelector('#endash');
  const menuSwitch = document.querySelector('#menuSwitch');
  const floatingMenu = document.querySelector('#floatingMenu');
  const componentFooter = document.querySelector('#componentFooter');
  const menuToolbar = document.querySelector('#menuToolbar');

  if (navbarContainer) navbarContainer.innerHTML = '';
  if (subnavbarContainer) subnavbarContainer.innerHTML = '';
  if (themeNavContainer) themeNavContainer.innerHTML = '';
  if (endash) endash.innerHTML = '';
  if (menuSwitch) menuSwitch.remove();
  if (floatingMenu) floatingMenu.innerHTML = '';
  if (componentFooter) componentFooter.innerHTML = '';
  if (menuToolbar) menuToolbar.style.display = 'flex';
}


