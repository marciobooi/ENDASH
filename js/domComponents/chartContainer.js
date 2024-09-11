class ChartContainer {
  constructor(targetSelector) {
    this.target = this.createTarget(targetSelector);
    this.chartItems = [];
    this.populateChartItems();

    this.selectedIndex = -1;

    this.firstSelectedIndex = -1;

    // this.target.setAttribute('role', 'listbox');

    // this.handleKeyDown = this.handleKeyDown.bind(this);

    this.toggleChartContainer = this.toggleChartContainer.bind(this);

    // document.addEventListener('keydown', this.handleKeyDown);

    this.initializeItemClickListeners();

    this.intersectionObserver = new IntersectionObserver(this.handleIntersection.bind(this), {
      root: null, // Use the viewport as the root
      threshold: 0.1, // Percentage of visibility required to trigger
    });

    this.chartItems.forEach(item => {
      this.intersectionObserver.observe(item);
    });
  }

 handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const chartItem = entry.target;
            REF.chartId = chartItem.id;

            const url = new URL(window.location.href);    
            const shareParam = url.searchParams.get("share");
  
            if (shareParam == "true") {
                REF.share = shareParam;
                hideForIframe();
                this.intersectionObserver.disconnect();
            } else {
                loadSkeleton(); 
                endash();
                this.intersectionObserver.unobserve(chartItem);
                setTimeout(() => {
                  unloadSkeleton();
                }, 2500);
            }
        } else {
          setTimeout(() => {
            unloadSkeleton();
          }, 2500);
        }
    });
}

  createTarget(targetSelector) {
    const existingTarget = document.querySelector(targetSelector);
    if (existingTarget) {
      return existingTarget;
    } else {
      const newTarget = document.createElement('div');
      document.body.appendChild(newTarget);
      return newTarget;
    }
  }



  populateChartItems() {

    const countryContainer = document.createElement('div');
    countryContainer.classList.add('col-12');
    countryContainer.setAttribute('id', 'countrySelect');

    this.target.appendChild(countryContainer);

    populateCountries();


    const chartContainer = document.createElement('div');
    chartContainer.classList.add('flex-container');


    const numberOfCharts = Object.keys(codesDataset).length;
  
    for (let i = 0; i < numberOfCharts; i++) {
      const chartItem = document.createElement('div');
      chartItem.classList.add('flex-item', 'chartContainer');
      chartItem.id = `chart_${i + 1}`;
      chartItem.tabIndex = 0;
      chartItem.draggable = true;
      chartItem.setAttribute('role', 'option');
      chartItem.setAttribute('aria-expanded', 'false');
      chartItem.addEventListener('dragstart', this.handleDragStart.bind(this));
      chartItem.addEventListener('dragover', this.handleDragOver.bind(this));
      chartItem.addEventListener('drop', this.handleDrop.bind(this));
  
      chartContainer.appendChild(chartItem);
  
      const containerNav = document.createElement('div');
      containerNav.classList.add('containerNav');
      containerNav.textContent = `Chart Item ${i + 1}`;

      const skeleton = document.createElement('div');
      skeleton.classList.add('skeletonContainer', 'd-none');

      const highchartsContainer = document.createElement('div');
      highchartsContainer.classList.add('highchartsContainer');
      highchartsContainer.id = `highchartsContainer_${i + 1}`;
  
      chartItem.appendChild(containerNav);
      chartItem.appendChild(highchartsContainer);
      chartItem.appendChild(skeleton);
  
      this.chartItems.push(chartItem); // Assuming you want to store chart items in this array
    }
  
    this.target.appendChild(chartContainer);
  }

  initializeItemClickListeners() {   
    for (let i = 0; i < this.chartItems.length; i++) {
      const chartItem = this.chartItems[i];
      chartItem.addEventListener('click', () => this.handleItemClick(chartItem));
    }
  }

  handleDragStart(event) {
    const sourceChartItem = event.target;
    sourceChartItem.style.opacity = '0.5';
    sourceChartItem.classList.add('dragged');
    event.dataTransfer.setData('text/plain', sourceChartItem.id);
    sourceChartItem.setAttribute('aria-grabbed', 'true');
  }

  handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
  }

  handleDrop(event) {
    event.preventDefault();
    const sourceChartItemId = event.dataTransfer.getData('text/plain');
    const sourceChartItem = document.getElementById(sourceChartItemId);

    const targetChartItem = event.currentTarget;
    const sourceIndex = this.chartItems.indexOf(sourceChartItem);
    const targetIndex = this.chartItems.indexOf(targetChartItem);

    if (sourceIndex !== -1 && targetIndex !== -1 && sourceIndex !== targetIndex) {
      this.swapChartItems(sourceIndex, targetIndex);
    }

    sourceChartItem.style.opacity = '1';
    sourceChartItem.classList.remove('dragged');
    sourceChartItem.setAttribute('aria-grabbed', 'false');

    event.currentTarget.classList.remove('dragover');
    $(this.target).find('.chartContainer').removeClass("dragover");
  }

  handleDragEnd(event) {
    const draggedChartItem = event.target;
    draggedChartItem.style.opacity = '1';
    draggedChartItem.classList.remove('dragged');
    draggedChartItem.setAttribute('aria-grabbed', 'false');
  }

  handleDragLeave(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
  }

  handleItemClick(i) {
    // Toggle chartContainer visibility
    this.toggleChartContainer(i);
  }

  toggleChartContainer(i) {
    
      const chartContainer = i;

      REF.chartExpanded = true

      REF.chartId = chartContainer.id    
      
      if(!$(chartContainer).hasClass('expand')){       
        $( ".flex-container" ).find( ".flex-item.chartContainer" ).css( "display", "none" );
        chartContainer.classList.add('expand');
        chartContainer.setAttribute('aria-expanded', 'true');
        $(chartContainer).css( "display", "initial" );
        chartContainer.querySelector('.highchartsContainer').classList.add('highchartsContainerExpand');  
        // REF.compare = true

       
        Highcharts.charts.forEach(chart => {
          if (chart) {
              chart.reflow();
          }
        });

      addAuxiliarBarGraphOptions()
      compareCountries()

      $(".containerNav").attr("id", "title")
      .css({'visibility': 'initial', "height": "4rem", "font-size": ".4em"})      
      .html(`${languageNameSpace.labels[REF.title]} - ${languageNameSpace.labels[REF.geos]}`)   

      document.querySelector("#title").innerHTML = `${languageNameSpace.labels[REF.title] } - ${languageNameSpace.labels[REF.geos]}`
      
      
    } 

    const $chartContainer = $(chartContainer);
    $chartContainer.find('.highcharts-credits').css('display', 'initial');    
    $('text.highcharts-axis-title').css('display', 'initial')
    getTitle()
    
    }

  swapChartItems(index1, index2) {
    const tempItem = this.chartItems[index1];
    this.chartItems[index1] = this.chartItems[index2];
    this.chartItems[index2] = tempItem;

    const chartContainer = this.chartItems[0].parentNode;
    while (chartContainer.firstChild) {
      chartContainer.removeChild(chartContainer.firstChild);
    }

    for (const item of this.chartItems) {
      chartContainer.appendChild(item);
    }
  }

    addToDOM(targetElementSelector) {
    const targetElement = document.querySelector(targetElementSelector);

    if (targetElement) {
      targetElement.appendChild(this.target);

    } else {
      console.error('Target element not found:', targetElementSelector);
    }
  }


}



