function openVizTable() {
  const chartId = codesDataset[REF.chartId].container;
  const chartElement = document.querySelector('#' + chartId);

  if (chartElement) {
    chartElement.style.display = 'none';

    setTimeout(function() {
      const chart = Highcharts.charts.find(c => c && c.renderTo && c.renderTo.id === chartId);
      if (chart) {
        chart.viewData();
        
        const tables = document.querySelectorAll("table");
        tables.forEach(table => {
          table.removeAttribute("summary");
        });
        
        const timelineContainer = document.querySelector('#timelineContainer');
        if (timelineContainer) {
          timelineContainer.style.display = 'none';
        }
      }
    }, 100);
  }
}

function closeTable() {
  const chartId = codesDataset[REF.chartId].container;
  const chartElement = document.querySelector('#' + chartId);

  const tables = document.querySelectorAll("table");
  tables.forEach(table => {
    table.style.display = 'none';
  });

  if (chartElement) {
    chartElement.style.display = '';
  }

  const dataTables = document.querySelectorAll('.highcharts-data-table');
  dataTables.forEach(table => {
    table.style.display = 'none';
  });

  const timelineContainer = document.querySelector('#timelineContainer');
  if (timelineContainer) {
    timelineContainer.style.display = 'initial';
  }
}

