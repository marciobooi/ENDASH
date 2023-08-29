function openVizTable() {
const chartId = codesDataset[REF.chartId].container

  $('#'+chartId).hide();

  setTimeout(function() {
    const chart = $('#'+chartId).highcharts();
    if (chart) {
      chart.viewData();

      // Change the text of table highcharts-data-table-0 header summary to "Data Table"
      $("table").removeAttr("summary");
      hideMenuSwitch()
      $("#ChartOrder").hide();  
    }
  }, 100);
}

function closeTable() {
  const chartId = codesDataset[REF.chartId].container
  $("table").hide();
  $('#'+chartId).show();

    showMenuSwitch();
 

}
