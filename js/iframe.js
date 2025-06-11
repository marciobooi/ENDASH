
// Store the element that triggered the modal
let iframeModalTriggerElement = null;
// Store the keydown event listener for focus trapping
let iframeModalKeydownListener = null;

function exportIframe() {
    REF.share = true;

    iframeModalTriggerElement = document.activeElement; // Store focused element before opening

    const modal = document.getElementById('iframeModal');
    const modalTitleElement = document.getElementById('iframeModalTitle');
    const modalCloseButton = modal.querySelector('.ecl-modal__close');
    const copyUrlButton = modal.querySelector('#share'); // Assuming #share is the "Copy the URL" button
    const footerCloseButton = modal.querySelector('#close');


    if (modalTitleElement) {
        modalTitleElement.textContent = languageNameSpace.labels["EMBEDDED"] || 'Embed Chart';
    }

    $('.targetUrl').html(window.location.href); // This sets the body content

    // Open the modal
    if (modal && typeof modal.showModal === 'function') {
        modal.showModal();
    } else {
        console.error('iframeModal not found or showModal is not a function');
        return;
    }

    ECL.autoInit(); // Re-initialize ECL components if necessary, though dialog.showModal() is standard

    // Set initial focus
    if (modalCloseButton) {
        modalCloseButton.focus();
    }

    // Focus Trapping
    const focusableElements = [modalCloseButton, copyUrlButton, footerCloseButton].filter(el => el); // Add other focusable elements if any

    iframeModalKeydownListener = function(event) {
        if (event.key === 'Tab') {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        } else if (event.key === 'Escape') {
            // ECL should handle closing on Escape.
            // The 'close' event on the dialog will handle focus return.
        }
    };

    modal.addEventListener('keydown', iframeModalKeydownListener);

    // Listen for the native dialog 'close' event
    modal.addEventListener('close', function handleDialogClose() {
        closeModalUrl(); // Ensure our cleanup logic is called
        // Remove this specific listener after it runs to avoid multiple bindings if modal is reopened
        modal.removeEventListener('close', handleDialogClose);
    }, { once: true }); // Ensure it only runs once per modal opening
}


function closeModalUrl() {
    REF.share = false;
    const modal = document.getElementById('iframeModal');

    if (modal && iframeModalKeydownListener) {
        modal.removeEventListener('keydown', iframeModalKeydownListener);
        iframeModalKeydownListener = null;
    }

    if (iframeModalTriggerElement) {
        iframeModalTriggerElement.focus();
        iframeModalTriggerElement = null;
    }
    // Note: If modal.close() is called by ECL, this function might be called again by the 'close' event.
    // The REF.share = false and focus return should be idempotent or handled carefully.
    // The native dialog's close() method doesn't recursively trigger 'close' events if already closed.
}

function copyUrl() {
    dataNameSpace.setRefURL()
    var currentUrl = window.location.href;
    
    // Modify the "share" parameter to "true" in the URL
    currentUrl = currentUrl.replace("share=false", "share=true");
    
    // Create a temporary input element
    var tempInput = document.createElement("input");
    tempInput.setAttribute("type", "text");

    // Create a text node with the iframe code and append it to the tempInput
    var iframeCode = '<iframe frameborder="0" scrolling="yes" seamless="seamless" style="display:block; width:100%; height:100vh;" src="'+ currentUrl +'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
    tempInput.appendChild(document.createTextNode(iframeCode));

    document.body.appendChild(tempInput);

    // Select the input content
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    // Use the Clipboard API to copy the text to the clipboard
    navigator.clipboard.writeText(iframeCode).then(function() {
        // Success callback (optional)
        // alert("URL copied to clipboard= " + currentUrl);
    }).catch(function(error) {
        // Error callback (optional)
        console.error("Unable to copy URL to clipboard= ", error);
    });

    // Remove the temporary input element
    document.body.removeChild(tempInput);
    
}

function hideForIframe() {

    if(REF.share == "false") return  

    const url = new URL(window.location.href);

    const params = {};
    
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    startLoadingAnimation()

    REF.chartId= url.searchParams.get("chartId");

    const chart = url.searchParams.get("chartId")
    const chartElement = document.getElementById(chart);

    const chartContainer = chartElement;

    REF.chartId = chartContainer.id    
    REF.chartCreated= url.searchParams.get("chartCreated");
    REF.chartExpanded= url.searchParams.get("chartExpanded");
    REF.chartOpt= url.searchParams.get("chartOpt");
    REF.chartType= url.searchParams.get("chartType");
    REF.compare= url.searchParams.get("compare");
    REF.dataset= url.searchParams.get("dataset");
    REF.geos= url.searchParams.get("geos");
    REF.indicator= url.searchParams.get("indicator");
    REF.indicator2= url.searchParams.get("indicator2");
    REF.indicator2_type= url.searchParams.get("indicator2_type");
    REF.indicator_type= url.searchParams.get("indicator_type");
    REF.language= url.searchParams.get("language");
    REF.meta= url.searchParams.get("meta");
    REF.percentage= url.searchParams.get("percentage");
    REF.share= "false";
    REF.title= url.searchParams.get("title");
    REF.unit= url.searchParams.get("unit");
    REF.year= url.searchParams.get("year");
    
    
    $( ".flex-container" ).find( ".flex-item.chartContainer" ).css( "display", "none" );
    chartContainer.classList.add('expand');
    chartContainer.setAttribute('aria-expanded', 'true');
    $(chartContainer).css( "display", "initial" );
    chartContainer.querySelector('.highchartsContainer').classList.add('highchartsContainerExpand');  
    $(".containerNav").css('visibility', 'hidden')

    log(REF.chartType)

    languageNameSpace.initLanguage(REF.language);   
    compareCountries();

    document.querySelector("#title").innerHTML = `${languageNameSpace.labels[REF.title] } - ${languageNameSpace.labels[REF.geos]}`        
    
    Highcharts.charts.forEach(chart => {
        if (chart) {
            chart.reflow();
        }
    });

   
    document.querySelector("header").style.display = "none";
    document.getElementById("subnavbar-container").style.display = "none";
    document.getElementById("componentFooter").style.display = "none";
    document.getElementById("timelineContainer").style.display = "none";
    setTimeout(() => {
        $('#cookie-consent-banner').css('display', 'none !important');
    }, 1400);
    


    $(".containerNav").attr("id", "title")
    .css({'visibility': 'initial', "height": "4rem", "font-size": ".4em"})      
    .html(`${languageNameSpace.labels[REF.title]} - ${languageNameSpace.labels[REF.geos]}`)   

    document.querySelector("#title").innerHTML = `${languageNameSpace.labels[REF.title] } - ${languageNameSpace.labels[REF.geos]}`

    stopLoadingAnimation()

    REF.share = "false"
       
}