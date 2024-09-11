
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

initEndash()
  languageNameSpace.initLanguage(REF.language);

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


