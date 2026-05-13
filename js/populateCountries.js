
function populateCountries() {

  const target = document.querySelector("#countrySelect");
  const elementId = "MENU_COUNTRY";
  const optionsArray = defaultGeos;
  const labelDescription = "MENU_COUNTRY";
  const activeElement = REF.geos;
  const textChange = "MENU_COUNTRY";

  const existingSingleSelect = document.getElementById(elementId);
    if (existingSingleSelect) {
        existingSingleSelect.parentElement.parentElement.remove();
    }

  const singleSelect = new Singleselect(elementId, optionsArray, labelDescription, activeElement, textChange, selectedValue => {
    REF.geos = selectedValue;      
    dataNameSpace.setRefURL();
    if (REF.chartExpanded == false) {
      const chartItems = document.querySelectorAll('.chartContainer');
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      chartItems.forEach((chartItem) => {
        chartItem.removeAttribute('data-render-key');

        const rect = chartItem.getBoundingClientRect();
        const isVisible = rect.bottom > 0 && rect.top < viewportHeight;

        if (isVisible) {
          REF.chartId = chartItem.id;
          loadSkeleton(chartItem);
          endash();
          setTimeout(() => {
            unloadSkeleton(chartItem);
          }, 600);
        }
      });
    } else {
      compareCountries();
    }
  });

  const singleSelectHTML = singleSelect.createSingleSelect();
  target.insertAdjacentHTML('beforeend', singleSelectHTML);

  // singleSelect.attachEventListeners();
}

