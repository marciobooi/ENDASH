// "Energy topics" jump-nav row: links to the themed sections the gallery is
// grouped into (see THEME_SECTIONS in codes.js). Plain same-page anchor
// links - no click handler needed: html{scroll-behavior:smooth} (main.css)
// already animates the jump, and each target heading has tabindex="-1"
// (chartContainer.js), which makes native anchor navigation also move focus
// to it so screen reader users land on the section, not just scroll past it.
class ThemeNav {
  constructor() {
    const labels = (typeof languageNameSpace !== "undefined" && languageNameSpace.labels) || {};

    this.nav = document.createElement('nav');
    this.nav.id = 'themeNav';
    this.nav.classList.add('theme-nav');
    this.nav.setAttribute('data-i18n-label', 'THEME_NAV_LABEL');
    this.nav.setAttribute('aria-label', labels['THEME_NAV_LABEL'] || 'Energy topics');

    const list = document.createElement('ul');
    list.classList.add('theme-nav__list');

    THEME_SECTIONS.forEach(theme => {
      const item = document.createElement('li');
      item.classList.add('theme-nav__item');

      // Matches the ECL component library's standalone-link pattern exactly:
      // https://ec.europa.eu/component-library/playground/eu/?path=/story/components-navigation-link--standalone
      // <div class="ecl-u-type-m"><a class="ecl-link ecl-link--standalone">...</a></div>
      const typeWrapper = document.createElement('div');
      typeWrapper.classList.add('ecl-u-type-m');

      const link = document.createElement('a');
      link.href = '#' + theme.id;
      // ecl-link--no-visited: these are same-page jump links, not content
      // links - they shouldn't change color once clicked (ECL's default
      // :visited color made already-clicked links look inconsistent/greyed
      // out next to the unvisited ones).
      link.classList.add('ecl-link', 'ecl-link--standalone', 'ecl-link--no-visited', 'theme-nav__link');
      link.setAttribute('data-i18n', theme.labelKey);
      link.textContent = labels[theme.labelKey] || theme.labelKey;

      typeWrapper.appendChild(link);
      item.appendChild(typeWrapper);
      list.appendChild(item);
    });

    this.nav.appendChild(list);
  }

  addToDOM(targetElement) {
    const container = document.querySelector(targetElement);
    if (container) {
      container.appendChild(this.nav);
    }
  }
}
