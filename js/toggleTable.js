function openVizTable() {
const chartId = codesDataset[REF.chartId].container

  $('#'+chartId).hide();

  setTimeout(function() {
    const chart = $('#'+chartId).highcharts();
    if (chart) {
      chart.viewData();
   
      $("table").removeAttr("summary");     
      $('#timelineContainer').css('display', 'none');
    }
  }, 100);
}

function closeTable() {
  const chartId = codesDataset[REF.chartId].container
  $("table").hide();
  $('#'+chartId).show();

  const dataTables = document.querySelectorAll('.highcharts-data-table');
    dataTables.forEach(table => {
        table.style.display = 'none';
    });

    $('#timelineContainer').css('display', 'initial');

}

