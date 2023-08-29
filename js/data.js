const dataNameSpace = {
  version: "1",
  ref: {
    geos: "EU27_2020",    
    unit: "KWH",
    indicator: "",
    indicator2: "",
    language: "EN",
    dataset: "nrg_ind_eff",
    chartId: "chart_1",
    chartOpt: "mainChart",
    indicator_type:"",
    indicator2_type:"",
    title:"",
    compare: false,
    year: "2021",
    percentage:0,
    chartType: ""
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
  
    if (refURL.taxs !== undefined) {
      this.ref.taxs = refURL.taxs.split(",");
    }
  
    if (refURL.nrg_prc !== undefined) {
      this.ref.nrg_prc = refURL.nrg_prc.split(",");
    }
    if (refURL.percentage) {
      this.ref.percentage = parseFloat(refURL.percentage);
    }
  
    if (refURL.geos !== undefined) {
      if (refURL.geos.includes('all')) {
        this.ref.geos = "";
      } else {
        this.ref.geos = refURL.geos.split(",");
      }
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
