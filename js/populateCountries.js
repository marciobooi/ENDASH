
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
      REF.chartExpanded == false ? removeAuxiliarBarGraphOptions() : compareCountries();
  });

  const singleSelectHTML = singleSelect.createSingleSelect();
  target.insertAdjacentHTML('beforeend', singleSelectHTML);

  // singleSelect.attachEventListeners();
}

