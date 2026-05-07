let isOpen = false;
let driverInstance = null;

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
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

function checkAndShowTutorial() {
  const tutorialCookie = getCookie("tutorialEndashShown");
  if (!tutorialCookie) {
    setTimeout(() => {
      tutorial();
      setCookie("tutorialEndashShown", "true", 30);
    }, 600);
  }
}

function getDriverFactory() {
  if (window.driver && window.driver.js && typeof window.driver.js.driver === "function") {
    return window.driver.js.driver;
  }
  if (window.driver && typeof window.driver.driver === "function") {
    return window.driver.driver;
  }
  if (typeof window.driver === "function") {
    return window.driver;
  }
  return null;
}

function tutorial() {
  const factory = getDriverFactory();
  if (!factory) {
    console.error("Driver.js is not available.");
    return;
  }

  const rawSteps = [
    {
      element: "#find-more-menu-icon",
      popover: {
        title: languageNameSpace.tutorial["TUTO_1"],
        description: languageNameSpace.tutorial["TUTO_2"],
        side: "bottom",
        align: "start"
      }
    },
    {
      element: ".flex-container",
      popover: {
        title: languageNameSpace.tutorial["TUTO_3"],
        description: languageNameSpace.tutorial["TUTO_4"],
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#chart_1",
      popover: {
        title: languageNameSpace.tutorial["TUTO_5"],
        description: languageNameSpace.tutorial["TUTO_6"],
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#selectCountry",
      popover: {
        title: languageNameSpace.tutorial["TUTO_7"],
        description: languageNameSpace.tutorial["TUTO_8"],
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#lang-selection",
      popover: {
        title: languageNameSpace.tutorial["TUTO_9"],
        description: languageNameSpace.tutorial["TUTO_10"],
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#shareChart1",
      popover: {
        title: languageNameSpace.tutorial["TUTO_11"],
        description: languageNameSpace.tutorial["TUTO_12"],
        side: "bottom",
        align: "start"
      }
    }
  ];

  const steps = rawSteps.filter((step) => document.querySelector(step.element));
  if (!steps.length) {
    return;
  }

  driverInstance = factory({
    showProgress: false,
    animate: true,
    allowClose: true,
    overlayClickBehavior: "close",
    nextBtnText: languageNameSpace.labels["NEXT"],
    prevBtnText: languageNameSpace.labels["BACK"],
    doneBtnText: languageNameSpace.labels["FINISH"],
    onDestroyed: () => {
      isOpen = false;
      window.scrollTo(0, 0);
      const infoBtn = document.querySelector("button#infoBtn");
      if (infoBtn) {
        infoBtn.focus();
      }
    }
  });

  if (typeof driverInstance.setSteps === "function") {
    driverInstance.setSteps(steps);
  } else {
    driverInstance.steps = steps;
  }

  isOpen = true;

  if (typeof driverInstance.drive === "function") {
    driverInstance.drive();
  }
}

function closeTutorial() {
  if (driverInstance && typeof driverInstance.destroy === "function") {
    driverInstance.destroy();
  }
  isOpen = false;
}

function closeProcess(evt) {
  if (evt) {
    evt.preventDefault();
  }
  closeTutorial();
}

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape" && isOpen) {
    closeProcess(event);
  }
});
