let buttonTimer;
let currentStep;
let isOpen = false


function tutorial(buttonTimer) {

	closeTutorial()

	const introProfile = introJs();

	itens = [
		{
			element: document.querySelector("#find-more-menu-icon"),
			title: languageNameSpace.tutorial["TUTO_1"],
			intro: languageNameSpace.tutorial["TUTO_2"],
			position: 'auto'
		},
		{			
		  element: document.querySelector(".flex-container"),
		  title: languageNameSpace.tutorial["TUTO_3"],
		  intro: languageNameSpace.tutorial["TUTO_4"],
		  position: 'auto'
		},
		{
		  element: document.querySelector("#chart_1"),
		  title: languageNameSpace.tutorial["TUTO_5"],
		  intro: languageNameSpace.tutorial["TUTO_6"],
		  position: 'auto'
		},
		{
		  element: document.querySelector("#selectCounty"),
		  title: languageNameSpace.tutorial["TUTO_7"],
		  intro: languageNameSpace.tutorial["TUTO_8"],
		  position: 'auto'
		},
		{
		  element: document.querySelector("#lang-selection"),
		  title: languageNameSpace.tutorial["TUTO_9"],
		  intro: languageNameSpace.tutorial["TUTO_10"],
		  position: 'auto'
		},
	
		{			
		  element: document.querySelector("#social-media"),
		  title: languageNameSpace.tutorial["TUTO_11"],
		  intro: languageNameSpace.tutorial["TUTO_12"],
		  position: 'auto'
		},
		]

	introProfile.setOptions({
		showProgress: false,
		scrollToElement: false,
		showBullets: false,
		autoPosition:false,
		tooltipClass: "customTooltip",
		exitOnEsc: true,
		nextLabel:  languageNameSpace.labels['tutNEXT'],
		prevLabel: languageNameSpace.labels['tutBACK'],
		doneLabel: languageNameSpace.labels['tutFINISH'],
		steps: itens
	  });  	 
	  
	  introProfile.onexit(function () { window.scrollTo(0, 0) });

	  introProfile.start();
  
	  isOpen = true

	  introProfile.onchange(function () {

		currentStep = this._currentStep

		if (currentStep === 0) {
			document.querySelector("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton").innerHTML = languageNameSpace.labels['tutFINISH']
			setTimeout(() => {
				$("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton.introjs-disabled").addClass( "close" )
			}, 100);
		} else {
			document.querySelector("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton").innerHTML = languageNameSpace.labels['tutBACK']
			$("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton").removeClass( "close" )

			$(".introjs-tooltip.customTooltip.introjs-auto").css({
				"left": "50% !important",
				"top": "50%",
				"margin-left": "auto",
				"margin-top": "auto",
				"transform": "translate(-50%,-50%)"
			})
	}

			});

	$("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltip-header > a").attr({
		"alt": "Close",
		"id": "tutorialClose",
		"tabindex": "0",
		"href": "javascript:",
		"class": "btn btn-primary min-with--nav"
	});

	document.querySelector("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton").innerHTML = languageNameSpace.labels['tutFINISH']
	$("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton").addClass( "close " )


}

function closeTutorial() {
	buttonTimer = setTimeout("introJs().exit()", 4000);	
	isOpen = false
}

btn = document.querySelector("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-nextbutton")
$(document).on('click', btn, function() {
	clearTimeout(buttonTimer)	
});

function closeProcess(params) {
	event.preventDefault();
	introJs().exit()
	buttonTimer = setTimeout("introJs().exit()", 4000);
	clearTimeout(buttonTimer);
	document.querySelector("#tb-tutorial-btn");
	// const button = document.getElementById('tb-tutorial-btn');
	// button.focus();
	isOpen = false
}

$(document).on("click keydown", "#tutorialClose", function(event) {
	const isClickEvent = event.type === "click";
	const isKeyEvent = event.type === "keydown" && (event.key === "Escape" || event.key === "Enter" || event.keyCode === 13);
	if (isClickEvent || isKeyEvent) {
		closeProcess();
	}
  });


$(document).on("click keydown", ".close", function(event) {
	const isClickEvent = event.type === "click";
	const isKeyEvent = event.type === "keydown" && (event.key === "Escape" || event.key === "Enter" || event.keyCode === 13);
	if (isClickEvent || isKeyEvent) {
		closeProcess();
	}
});

  document.addEventListener('keydown', function(event) {
	if (event.key === 'Escape') {
		if(isOpen){
			closeProcess()
		} 
	}
  });


