
function exportIframe() {
    REF.share = true

    $(".ecl-modal__header-content").html(languageNameSpace.labels["EMBEDDED"]);
    $('.targetUrl').html(window.location.href)     
 
    const modal = document.getElementById('iframeModal');

    // Open the modal
    modal.showModal();

    ECL.autoInit();
}



function closeModalUrl(params) {
    REF.share = false
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