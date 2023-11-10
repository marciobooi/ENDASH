const dataNameSpace = {
  version: "1",
  ref: {
    geos: "EU27_2020",    
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
    year: "2021",
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
