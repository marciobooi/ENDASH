function openVizTable() {
const chartId = codesDataset[REF.chartId].container

  $('#'+chartId).hide();

  setTimeout(function() {
    const chart = $('#'+chartId).highcharts();
    if (chart) {
      chart.viewData();
   
      $("table").removeAttr("summary");
      hideChartMenuOptions()
     
    }
  }, 100);
}

function closeTable() {
  const chartId = codesDataset[REF.chartId].container
  $("table").hide();
  $('#'+chartId).show();

    showChartMenuOptions();
 

}
