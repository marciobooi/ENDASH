var languageNameSpace = {
  //Label containers for the selected language
  labels: {},
  tutorial: {},

  //selected language
  languageSelected: "",

  //init of the labels for the language defined in the URL
  initLanguage: function (val, language) {
    language == "" ? language = "EN" : language = val 
    
    languageNameSpace.languageSelected = language;

    Promise.all([
      fetch("data/translations.json").then(response => response.json()),
      fetch("data/tutorial_" + language + ".json").then(response => response.json())
    ]).then(([translations, tutorial]) => {
      for (let key in translations) {
        if (translations[key][language]) {
          languageNameSpace.labels[key] = translations[key][language];
        }
      }

      languageNameSpace.tutorial = tutorial;
      populateCountries();

    const translateElements = (selector, attribute, targetAttr = "text") => {
      document.querySelectorAll(selector).forEach(element => {
        let key = element.dataset[attribute];
        let translation = languageNameSpace.labels[key] || key;
        if (targetAttr === "text") {
          element.textContent = translation;
        } else {
          element.setAttribute(targetAttr, translation);
        }
      });
    };

      translateElements("[data-i18n]", "i18n", "text");
      translateElements("[data-i18n-label]", "i18n-label", "aria-label");
      translateElements("[data-i18n-labelledby]","i18n-labelledby","aria-labelledby");
      translateElements("[data-i18n-title]", "i18n-title", "title");
      translateElements("optgroup[data-i18n-label]", "i18n-label", "label");   


      document.documentElement.lang = language.toLowerCase();

      setTimeout(() => {
        enableTooltips()
      }, 500);
    }).catch((error) => {
      console.error("Language loading error:", error);
    });
  },


  ChangeLanguage: function (val) {
    REF.language = val;
        switch (REF.chartType) {
          case "barChart":
            dataNameSpace.setRefURL();
            showHideTimeLine();
            compareCountries();
            showHideBarChartOptions();
            break;
          case "pieChart":
            REF.chartCreated = false;
            dataNameSpace.setRefURL();
            showHideTimeLine();
            compareCountries();
            showHideBarChartOptions();
            break;
          case "lineChart":
              REF.chartType = "lineChart";
              dataNameSpace.setRefURL();
              showHideTimeLine();
              showHideBarChartOptions();
              compareCountries();
            break;

          default:
            dataNameSpace.setRefURL();
            removeComponents()
            buildComponents()
            compareCountries();
            break;
            }    
          languageNameSpace.initLanguage(REF.language);
          }
};