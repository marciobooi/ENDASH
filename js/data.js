const dataNameSpace = {
  version: "1",
  ref: {
    geos: "BE",    
    // geos: ["EU27_2020", "BE", "FR", "DE"],    
    unit: "KWH",
    indicator: "",
    indicator2: "",
    language: "EN",
    dataset: "nrg_ind_eff",
    chartId: "chart_1",
    // chartOpt: "lineChart",
    indicator_type:"",
    indicator2_type:"",
    title:"",
    compare: false,
    // Default to last year, matching the Timeline's maxYear heuristic, so the
    // bar/pie views open on the most recent year instead of a fixed year that
    // goes stale as new data is published.
    year: String(new Date().getFullYear() - 1),
    percentage: 0,
    chartType: "lineChart",
    chartCreated: false,
    chartExpanded: false,
    share:"false",
    meta: ""
  },
  setRefURL() {
    const url = new URL(window.location.href);
    const refParams = Object.entries(this.ref).map(([ref, value]) => `${ref}=${value}`);
    url.search = refParams.join("&");
    this.changeUrl("title", url.toString());
  },
  getRefURL() {
    const getUrlVars = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const vars = {};
      urlParams.forEach((value, key) => {
        vars[key] = value;
      });
      return vars;
    };
  
    const refURL = getUrlVars();  
    Object.entries(this.ref).forEach(([ref, value]) => {
      if (refURL[ref] !== undefined) {
        this.ref[ref] = refURL[ref];
      }
    });    
    if (refURL.percentage) {
      this.ref.percentage = parseFloat(refURL.percentage);
    }  

    if (refURL.geos !== undefined) {
        this.ref.geos = refURL.geos.split(",");
    }

    // URLSearchParams always yields strings, but these are boolean fields
    // (default false) - without this, a reloaded/shared URL containing
    // "...&chartExpanded=false&..." (which setRefURL() always writes) sets
    // REF.chartExpanded to the STRING "false", which is truthy in JS. Every
    // `if (REF.chartExpanded)` check in the app then behaves as if a chart
    // were expanded even though none is - breaking the global insights
    // button (silent no-op) and the gallery-wide refresh on language change
    // (it took the "just refresh the expanded chart" path instead).
    ["chartExpanded", "compare", "chartCreated"].forEach((key) => {
      if (refURL[key] !== undefined) {
        this.ref[key] = refURL[key] === "true";
      }
    });

  },
  changeUrl(title, url) {
    if (typeof history.pushState !== "undefined") {
      var obj = {
        Title: title,
        Url: url,
      };
      history.pushState(obj, obj.Title, obj.Url);
    } else {
      alert(languageNameSpace.labels["MSG_BROWSER"]);
    }
  },
};

const REF = dataNameSpace.ref;
