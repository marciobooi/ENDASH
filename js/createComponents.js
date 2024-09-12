
$( document ).ready(function() {
  dataNameSpace.getRefURL();

  const euGlobanContainer = $('<div>').attr('id', 'euGlobanContainer')

  euGlobanContainer.prependTo('header');

    $wt.render("euGlobanContainer", {
      utility: "globan",
      lang: REF.language.toLowerCase(),
      theme: "dark",
    });

  buildComponents();
  ECL.autoInit();
  languageNameSpace.initLanguage(REF.language);
  checkAndShowTutorial()
})

function buildComponents() {
  const components = [
    { instance: new SubNavbar(), target: "#subnavbar-container" },
    { instance: new Navbar(), target: "#navbar-container" },
    { instance: new Footer(), target: "#componentFooter" },
    { instance: new ChartContainer(), target: "#endash" },
  ];

  components.forEach(({ instance, target }) => {
    instance.addToDOM(target);
  });
ECL.autoInit();
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


