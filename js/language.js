var languageNameSpace = {
  //Label containers for the selected language
  labels: {},
  tutorial: {},

  //selected language
  languageSelected: "",

  // Apply translations to all data-i18n* elements currently in the DOM.
  // Safe to call multiple times (e.g. after dynamic components are injected).
  applyTranslations: function () {
    const updateLanguageToggleAriaLabel = () => {
      const toggleBtn = document.getElementById("toggleLanguageBtn");
      if (!toggleBtn) return;

      const selectedTextElement = document.getElementById("lang-selection-text");
      const selectedLanguage = selectedTextElement ? selectedTextElement.textContent.trim() : "";
      const prefix = languageNameSpace.labels["SELECTLANGUAGELABEL"] || "Change language, current language is ";

      toggleBtn.setAttribute("aria-label", `${prefix}${selectedLanguage}`);
    };

    const translateElements = (selector, attribute, targetAttr = "text") => {
      document.querySelectorAll(selector).forEach(element => {
        const key = element.getAttribute("data-" + attribute);
        const translation = languageNameSpace.labels[key] || key;
        if (targetAttr === "text") {
          element.textContent = translation;
        } else {
          element.setAttribute(targetAttr, translation);
        }
      });
    };

    translateElements("[data-i18n]", "i18n", "text");
    translateElements("[data-i18n-label]", "i18n-label", "aria-label");
    translateElements("[data-i18n-labelledby]", "i18n-labelledby", "aria-labelledby");
    translateElements("[data-i18n-title]", "i18n-title", "title");
    translateElements("optgroup[data-i18n-label]", "i18n-label", "label");

    // The language toggle aria-label needs dynamic suffix with current language.
    updateLanguageToggleAriaLabel();

    document.documentElement.lang = languageNameSpace.languageSelected.toLowerCase();
  },

  //init of the labels for the language defined in the URL
  initLanguage: function (val, language) {
    const resolvedLanguage = (language || val || "EN").toUpperCase();

    languageNameSpace.languageSelected = resolvedLanguage;
    languageNameSpace.labels = {};
    languageNameSpace.tutorial = {};

    return Promise.all([
      fetch("data/translations.json?v=6").then(response => response.json()),
      fetch("data/tutorial_" + resolvedLanguage + ".json").then(response => response.json())
    ]).then(([translations, tutorial]) => {
      for (let key in translations) {
        if (translations[key][resolvedLanguage]) {
          languageNameSpace.labels[key] = translations[key][resolvedLanguage];
        }
      }

      languageNameSpace.tutorial = tutorial;
      populateCountries();

      languageNameSpace.applyTranslations();

      setTimeout(() => {
        if (typeof cleanupTooltips === "function") {
          cleanupTooltips();
        }
        enableTooltips();
      }, 500);
    }).catch((error) => {
      console.error("Language loading error:", error);
    });
  },


  ChangeLanguage: function (val) {
    REF.language = val;

    // Load labels first, then re-render so titles/tooltips use fresh strings.
    languageNameSpace.initLanguage(REF.language).then(() => {
      dataNameSpace.setRefURL();

      if (REF.chartExpanded) {
        // One chart is expanded (bar/pie/line/insights) - refresh just that
        // chart's own content/controls, matching its current view type.
        // REF.chartType is always one of these four, so a switch here can
        // never miss a case the way the old chartType-based dispatch could.
        showHideTimeLine();
        showHideBarChartOptions();
        if (REF.chartType === "pieChart") {
          REF.chartCreated = false;
        }
        compareCountries();
      } else {
        // Gallery view: every card manages its own render/translation state
        // independently (via data-render-key, checked on scroll), not
        // through REF.chartId/compareCountries() - so refreshing "the
        // current chart" alone left every other visible card showing stale,
        // untranslated content. Rebuild the whole gallery instead.
        removeComponents();
        buildComponents();
        languageNameSpace.applyTranslations();
      }
    }).catch((err) => {
      console.error("ChangeLanguage: language init failed", err);
    });
  }
};