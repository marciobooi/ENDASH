
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

    if (isAccessibilityMode()) {
      // Statement page: footer/navbar are built above (translated, mode-aware
      // buildComponents() skips the rest), just reveal the statement and
      // skip the tour - do not start the tool (no chart init, no data calls).
      showAccessibilityView();
      return;
    }

    checkAndShowTutorial();
  }).catch((err) => {
    console.error("initLanguage failed on startup", err);
    buildComponents();
    if (isAccessibilityMode()) {
      showAccessibilityView();
      return;
    }
    checkAndShowTutorial();
  });
});

function buildComponents() {
  const components = isAccessibilityMode()
    ? [
        { instance: new Footer(), target: "#componentFooter" },
        { instance: new Navbar(), target: "#navbar-container" },
      ]
    : [
        { instance: new SubNavbar(), target: "#subnavbar-container" },
        { instance: new Navbar(), target: "#navbar-container" },
        { instance: new Footer(), target: "#componentFooter" },
        { instance: new ThemeNav(), target: "#themeNavContainer" },
        { instance: new ChartContainer(), target: "#endash" },
      ];

  components.forEach(({ instance, target }) => {
    instance.addToDOM(target);
  });

  // ECL's InpageNavigation (the Energy topics nav) runs its own scroll-spy
  // (gumshoe) to decide which link is "active", defaulting to a 20px
  // offset - i.e. it only considers a section "reached" once its heading
  // scrolls to within 20px of the viewport top. But the sticky nav itself
  // covers the top ~89px of the viewport, so a heading sitting right below
  // it (visually "current") was still ~70px short of that threshold - the
  // nav kept showing the PREVIOUS section active until the user scrolled
  // much further than where the section actually appears. Pass the nav's
  // real rendered height as the offset so "reached" lines up with "visible
  // just below the sticky nav" instead of ECL's generic default.
  const themeNav = document.getElementById('themeNav');
  // +150 (not just the nav's own height) so a section reads as "current"
  // once the user has clearly scrolled into it, rather than only the exact
  // instant its heading's top edge crosses the line right under the nav.
  const themeNavSpyOffset = themeNav ? Math.ceil(themeNav.getBoundingClientRect().height) + 150 : 20;
  ECL.autoInit({ INPAGE_NAVIGATION: { spyOffset: themeNavSpyOffset } });

  if (isAccessibilityMode()) return;

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
  // ThemeNav.addToDOM() inserts #themeNav as a sibling BEFORE
  // #themeNavContainer now (see that file for why), not as its child, so
  // clearing the container's innerHTML no longer reaches it - remove the
  // nav itself by id instead.
  const themeNav = document.querySelector('#themeNav');
  const endash = document.querySelector('#endash');
  const menuSwitch = document.querySelector('#menuSwitch');
  const floatingMenu = document.querySelector('#floatingMenu');
  const componentFooter = document.querySelector('#componentFooter');
  const menuToolbar = document.querySelector('#menuToolbar');

  if (navbarContainer) navbarContainer.innerHTML = '';
  if (subnavbarContainer) subnavbarContainer.innerHTML = '';
  if (themeNav) themeNav.remove();
  if (endash) endash.innerHTML = '';
  if (menuSwitch) menuSwitch.remove();
  if (floatingMenu) floatingMenu.innerHTML = '';
  if (componentFooter) componentFooter.innerHTML = '';
  if (menuToolbar) menuToolbar.style.display = 'flex';
}


