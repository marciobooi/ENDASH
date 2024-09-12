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

    $.ajaxSetup({
      async: false,
    });  
    $.getJSON("data/translations.json", function (data) {
      for (let key in data) {
        if (data[key][language]) {
          languageNameSpace.labels[key] = data[key][language];
        }
      }
    }).then(
      $.getJSON("data/tutorial_" + language + ".json", function (data) {
        languageNameSpace.tutorial = data;
      })
    );
    $.ajaxSetup({
      async: true,
    }); 
        populateCountries();

    const translateElements = (selector, attribute, targetAttr = "text") => {
      $(selector).each(function () {
        let key = $(this).data(attribute);
        let translation = languageNameSpace.labels[key] || key;
        if (targetAttr == "text") {
          $(this).text(translation);
        } else {
          $(this).attr(targetAttr, translation);
        }
      });
    };

    translateElements("[data-i18n]", "i18n", "text");
    translateElements("[data-i18n-label]", "i18n-label", "aria-label");
    translateElements("[data-i18n-labelledby]","i18n-labelledby","aria-labelledby");
    translateElements("[data-i18n-title]", "i18n-title", "title");
    translateElements("optgroup[data-i18n-label]", "i18n-label", "label");   



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