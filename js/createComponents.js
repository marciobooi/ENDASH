
$( document ).ready(function() {
  dataNameSpace.getRefURL();

  languageNameSpace.initLanguage(REF.language);

  const euGlobanContainer = $('<div>').attr('id', 'euGlobanContainer')

  euGlobanContainer.prependTo('header');

    $wt.render("euGlobanContainer", {
      utility: "globan",
      lang: REF.language.toLowerCase(),
      theme: "dark",
    });

  buildComponents();

  // Call the createForm function and append the form to the "hiddenFormDiv"
// const actionURL = "https://formsubmit.co/e466de393c51be5bb8265025772c5712";
// const nextURL = "https://ec.europa.eu/eurostat/cache/infographs/energy_prices/404.html";
// const formElement = createForm(actionURL, nextURL);
// formElement.addEventListener("submit", handleFormSubmit);
// document.getElementById("hiddenFormDiv").appendChild(formElement);

initEndash()


})

function buildComponents() {
  const components = [
    { instance: new SubNavbar(), target: '#subnavbar-container' },   
    { instance: new Navbar(), target: '#navbar-container' },
    { instance: new ChartContainer(), target: '#endash' },
    { instance: new Footer(), target: '#componentFooter' },
  ];

  components.forEach(({ instance, target }) => {
    instance.addToDOM(target);
  });

}

function removeComponents() {
  $('#navbar-container').empty();
  $('#subnavbar-container').empty();
  $('#endash').empty();
  $('#menuSwitch').remove();
  $('#floatingMenu').empty();
  $('#componentFooter').empty();
  $('#menuToolbar').css('display', "flex");
}


