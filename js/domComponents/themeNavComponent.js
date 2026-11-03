// "Energy topics" nav: links to the themed sections the gallery is grouped
// into (see THEME_SECTIONS in codes.js). Built on ECL's real InpageNavigation
// component - markup/behavior from the component library's own "Default"
// story (https://ec.europa.eu/component-library/playground/ec/?path=/story/components-navigation-inpage-navigation--default)
// - so scroll-spy active-link highlighting and the collapsible "Page
// contents" trigger on narrow screens come from ECL's own JS
// (ECL.autoInit(), called in createComponents.js), not custom code. Laid
// out as a plain full-width row rather than ECL's usual sticky sidebar;
// see themeNav.css for the overrides that make that layout possible.
class ThemeNav {
  constructor() {
    const labels = (typeof languageNameSpace !== "undefined" && languageNameSpace.labels) || {};
    const navLabel = labels['THEME_NAV_LABEL'] || 'Energy topics';

    this.nav = document.createElement('nav');
    this.nav.id = 'themeNav';
    // ecl-inpage-navigation--visible: ECL normally toggles this itself via an
    // IntersectionObserver on a [data-ecl-inpage-navigation-container]
    // wrapper (the sidebar's 2-column layout, which we're not using), and
    // without it the component's own CSS keeps it display:none below
    // 996px. Setting it up front keeps the nav (and its mobile trigger)
    // visible at every width in our full-width-row layout.
    this.nav.classList.add('ecl-inpage-navigation', 'ecl-inpage-navigation--visible', 'theme-nav');
    this.nav.setAttribute('data-ecl-auto-init', 'InpageNavigation');
    this.nav.setAttribute('data-ecl-inpage-navigation', 'true');
    this.nav.setAttribute('aria-labelledby', 'themeNav-title');

    const title = document.createElement('div');
    title.classList.add('ecl-inpage-navigation__title');
    title.id = 'themeNav-title';
    title.setAttribute('data-i18n', 'THEME_NAV_LABEL');
    title.textContent = navLabel;

    const body = document.createElement('div');
    body.classList.add('ecl-inpage-navigation__body');

    const triggerWrapper = document.createElement('div');
    triggerWrapper.classList.add('ecl-inpage-navigation__trigger-wrapper');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.id = 'themeNav-trigger';
    trigger.classList.add('ecl-inpage-navigation__trigger');
    trigger.setAttribute('data-ecl-inpage-navigation-trigger', 'true');
    trigger.setAttribute('aria-controls', 'themeNav-list');
    trigger.setAttribute('aria-expanded', 'false');

    // Mirrors the first item's default-active state below: shows
    // "Sustainability and affordability" as the current section on mobile
    // too, until ECL's scroll-spy overwrites it as the user scrolls.
    const defaultTheme = THEME_SECTIONS[0];
    const triggerCurrent = document.createElement('span');
    triggerCurrent.classList.add('ecl-inpage-navigation__trigger-current');
    triggerCurrent.setAttribute('data-ecl-inpage-navigation-trigger-current', 'true');
    triggerCurrent.setAttribute('data-i18n', defaultTheme.labelKey);
    triggerCurrent.textContent = labels[defaultTheme.labelKey] || defaultTheme.labelKey;

    // ECL's own story uses a Phosphor icon font this app doesn't load -
    // same fas icon set the rest of the toolbar already uses instead.
    const triggerIcon = document.createElement('i');
    triggerIcon.classList.add('fas', 'fa-chevron-down', 'ecl-inpage-navigation__trigger-icon');
    triggerIcon.setAttribute('aria-hidden', 'true');

    trigger.appendChild(triggerCurrent);
    trigger.appendChild(triggerIcon);
    triggerWrapper.appendChild(trigger);

    const list = document.createElement('ul');
    list.id = 'themeNav-list';
    list.classList.add('ecl-inpage-navigation__list');
    list.setAttribute('data-ecl-inpage-navigation-list', 'true');

    THEME_SECTIONS.forEach((theme, index) => {
      const item = document.createElement('li');
      item.classList.add('ecl-inpage-navigation__item');
      // Default selection before the user has scrolled (or on a page that
      // opens shorter than the first section's scroll-spy offset): the
      // first theme, Sustainability and affordability, reads as selected
      // instead of nothing being highlighted. ECL's own scroll-spy
      // (gumshoe) takes over this class from here as the user scrolls.
      if (index === 0) {
        item.classList.add('ecl-inpage-navigation__item--active');
      }

      const link = document.createElement('a');
      link.href = '#' + theme.id;
      link.classList.add('ecl-link', 'ecl-inpage-navigation__link');
      link.setAttribute('data-ecl-inpage-navigation-link', 'true');
      link.setAttribute('data-i18n', theme.labelKey);
      link.textContent = labels[theme.labelKey] || theme.labelKey;

      item.appendChild(link);
      list.appendChild(item);
    });

    body.appendChild(triggerWrapper);
    body.appendChild(list);

    this.nav.appendChild(title);
    this.nav.appendChild(body);
  }

  addToDOM(targetElement) {
    // Inserted as a SIBLING right before targetElement (#themeNavContainer,
    // which stays in the DOM as an empty positional marker), not as its
    // child. position:sticky can only stay stuck while some part of its
    // own containing block (the direct parent) is still in the viewport -
    // #themeNavContainer is barely taller than the nav itself, so nesting
    // inside it meant the nav lost its "room to stick" within a few
    // hundred pixels of scrolling. Its new parent, #page, spans the whole
    // gallery, so the nav can stay pinned for the full scroll instead.
    const container = document.querySelector(targetElement);
    if (container && container.parentNode) {
      container.parentNode.insertBefore(this.nav, container);
    }
  }
}
