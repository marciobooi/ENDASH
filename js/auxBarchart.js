function createBarChart() {
  startLoadingAnimation()



  const type = "column"   

  REF.dataset == "demo_pjan" ? d = chartEightCalculation(d) : d = chartApiCall();                    

  const series = d.Dimension("geo").id;
  const categories = d.Dimension("geo").id;  

  handleData(d, series);   

  const yAxisTitle = d.__tree__.dimension.unit.category.label[REF.unit]   

  buildChart(categories, REF.containerId, yAxisTitle, type);




    

  stopLoadingAnimation()
}
