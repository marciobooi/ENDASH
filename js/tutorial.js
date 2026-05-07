let buttonTimer;
let currentStep;
let isOpen = false

function setCookie(name, value, days = 30) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(nameEQ) == 0)
      return cookie.substring(nameEQ.length, cookie.length);
  }
  return null;
}

function checkAndShowTutorial() {
  const tutorialCookie = getCookie("tutorialEndashShown");
  if (!tutorialCookie) {
    // If the cookie doesn't exist, show the tutorial and set the cookie
    setTimeout(() => {
      tutorial(); // Function to show the tutorial
      setCookie("tutorialEndashShown", "true", 30); // Set cookie for 30 days
    }, 600);
  }
}


function tutorial(buttonTimer) {	

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
		  element: document.querySelector("#selectCountry"),
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
		  element: document.querySelector("#shareChart1"),
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
		nextLabel:  languageNameSpace.labels['NEXT'],
		prevLabel: languageNameSpace.labels['BACK'],
		doneLabel: languageNameSpace.labels['FINISH'],
		steps: itens
	  });  	 
	  
	  introProfile.onexit(function () { window.scrollTo(0, 0) });

	  const observer = new MutationObserver(() => {
		// Locate the tooltip and title elements
		const tooltip = document.querySelector('.introjs-tooltip');
		const currentStep = introProfile._currentStep; 

		if (tooltip && itens[currentStep].title) {
		  const titleId = `introjs-title-${currentStep}`;

		  const titleElement = tooltip.querySelector('.introjs-tooltip-title');
		  if (titleElement) {
			titleElement.id = titleId;
			tooltip.setAttribute('aria-labelledby', titleId);
		  }
		}
	  });

	  observer.observe(
		document.body,
		{
		  childList: true, 
		  subtree: true,
		}
	);

	  introProfile.start();
  
	  isOpen = true

	  introProfile.onchange(function () {

		currentStep = this._currentStep

	if (currentStep === 0) {
		const prevButton = document.querySelector("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton");
		if (prevButton) {
			prevButton.innerHTML = languageNameSpace.labels['FINISH'];
			setTimeout(() => {
				prevButton.classList.add("close");
			}, 100);
		}
	} else {
		const prevButton = document.querySelector("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton");
		if (prevButton) {
			prevButton.innerHTML = languageNameSpace.labels['BACK'];
			prevButton.classList.remove("close");
		}

		const tooltip = document.querySelector(".introjs-tooltip.customTooltip.introjs-auto");
		if (tooltip) {
			tooltip.style.left = "50% !important";
			tooltip.style.top = "50%";
			tooltip.style.marginLeft = "auto";
			tooltip.style.marginTop = "auto";
			tooltip.style.transform = "translate(-50%,-50%)";
		}
	}

			});

	const headerButton = document.querySelector("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltip-header > a");
	if (headerButton) {
		headerButton.setAttribute("alt", "Close");
		headerButton.setAttribute("id", "tutorialClose");
		headerButton.setAttribute("tabindex", "0");
		headerButton.setAttribute("href", "javascript:");
		headerButton.setAttribute("class", "btn btn-primary min-with--nav");
	}

	const prevButton = document.querySelector("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-prevbutton");
	if (prevButton) {
		prevButton.innerHTML = languageNameSpace.labels['FINISH'];
		prevButton.classList.add("close");
	}

	traptutorialfocus()
}

function closeTutorial() {
	buttonTimer = setTimeout("introJs().exit()", 4000);	
	isOpen = false;
	const infoBtn = document.querySelector('button#infoBtn');
	if (infoBtn) {
		infoBtn.focus();
	}
}

const nextButton = document.querySelector("body > div.introjs-tooltipReferenceLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-nextbutton");
if (nextButton) {
	nextButton.addEventListener('click', function() {
		clearTimeout(buttonTimer);
	});
}

function closeProcess(evt) {
	if (evt) {
		evt.preventDefault();
	}
	introJs().exit();
	buttonTimer = setTimeout("introJs().exit()", 4000);
	clearTimeout(buttonTimer);
	document.querySelector("#tb-tutorial-btn");
	// const button = document.getElementById('tb-tutorial-btn');
	// button.focus();
	const infoBtn = document.querySelector('button#infoBtn');
	if (infoBtn) {
		infoBtn.focus();
	}
	isOpen = false
}

document.addEventListener("click", function(event) {
	if (event.target.closest("#tutorialClose") || event.target.closest(".close")) {
		closeProcess(event);
	}
});

document.addEventListener("keydown", function(event) {
	const isKeyEvent = event.key === "Escape" || event.key === "Enter" || event.keyCode === 13;
	if (isKeyEvent && (event.target.closest("#tutorialClose") || event.target.closest(".close"))) {
		closeProcess(event);
	}
});

  document.addEventListener('keydown', function(event) {
	if (event.key === 'Escape') {
		if(isOpen){
			closeProcess()
		} 
	}
  });

  function traptutorialfocus() {	

	const focusableElements = '.introjs-tooltip.customTooltip.introjs-floating a[role="button"][tabindex="0"]:not([tabindex="-1"])';
	const element = document.querySelector('.introjs-tooltip.customTooltip.introjs-floating');

	log(element)

	if (element) {
	  const focusableContent = element.querySelectorAll(focusableElements);
	  const firstFocusableElement = focusableContent[0];
	  const lastFocusableElement = focusableContent[focusableContent.length - 1];

	  document.addEventListener('keydown', function (e) {
		const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

		if (!isTabPressed) {
		  return;
		}

		if (e.shiftKey) {
		  if (document.activeElement === firstFocusableElement) {
			lastFocusableElement.focus();
			e.preventDefault();
		  }
		} else {
		  if (document.activeElement === lastFocusableElement) {
			firstFocusableElement.focus();
			e.preventDefault();
		  }
		}
	  });

	  // Set initial focus on the first focusable element
	  if (focusableContent.length > 0) {
		firstFocusableElement.focus();
	  }
	}
  };


