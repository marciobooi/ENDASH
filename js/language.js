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
    languageNameSpace.initLanguage(REF.language);

    REF.chartExpanded === true ? endash() : (removeComponents(), buildComponents(), compareCountries());


      if(REF.chartType === "barChart") {
        dataNameSpace.setRefURL()
        showHideTimeLine()
        compareCountries();
        showHideBarChartOptions()
      } else if (REF.chartType === "pieChart") {
        REF.chartCreated = false;
        dataNameSpace.setRefURL()
        showHideTimeLine()
        compareCountries();
        showHideBarChartOptions();
      } else {
        REF.chartType = "lineChart";
        dataNameSpace.setRefURL()
        showHideTimeLine()
        showHideBarChartOptions();
        compareCountries();
      }    
    
    
    const elementsBtn = [ "barChart", "pieChart",  "lineChart",  "toggleAgregates",  "tb-togle-percentage",  "tb-togle-table",   
    "printBtn",  "downloadBtn",  "excelBtn",  "embebedBtn",  "btnCloseModalChart", "infoBtn", "shareChart1" ]

    const elementsBtnTranslations = [
      "BTNBARCHART", "BTNPIECHART", "BTNLINECHART", "BTNAGREGATESCHART", "BTNPERCENTAGECHART", "BTNTABLECHART", 
      "BTNPRINTCHART", "BTNDOWNLOADCHART", "BTNEXCELCHART", "BTNBSHARECHART", "BTNCLOSECHART", "BTNINFICHART", "BTNBSHARECHART",
    ]

    elementsBtn.forEach((id, idx) => {
      const element = document.getElementById(id);
      if (!element) {
          return; 
      }
      const label = languageNameSpace.labels[elementsBtnTranslations[idx]];
      element.setAttribute('title', label);
      element.setAttribute('data-original-title', label);
      element.setAttribute('aria-label', label);
  });
  

  }
};