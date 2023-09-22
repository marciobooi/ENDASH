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
      threshold: 0.2, // Percentage of visibility required to trigger
    });

    this.chartItems.forEach(item => {
      this.intersectionObserver.observe(item);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const chartItem = entry.target;
        REF.chartId = chartItem.id
        endash()
        // // Unobserve the element to avoid duplicate loading
        this.intersectionObserver.unobserve(chartItem);
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

      const highchartsContainer = document.createElement('div');
      highchartsContainer.classList.add('highchartsContainer');
      highchartsContainer.id = `highchartsContainer_${i + 1}`;
  
      chartItem.appendChild(containerNav);
      chartItem.appendChild(highchartsContainer);
  
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

        $(".containerNav").css('visibility', 'hidden')
        Highcharts.charts.forEach(chart => {
          if (chart) {
              chart.reflow();
          }
        });

      addAuxiliarBarGraphOptions()
      compareCountries()
      document.querySelector("#title").innerHTML = `${languageNameSpace.labels[REF.title] } - ${languageNameSpace.labels[REF.geos]}`
      } 
    
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

  // handleKeyDown(event) {
  //   if ($('.expand').length > 0) {
  //    return
  //   } else {
  //     if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
  //       event.preventDefault();
    
  //       // Calculate the new index based on the arrow key
  //       const newIndex = event.key === 'ArrowUp' ? this.selectedIndex - 1 : this.selectedIndex + 1;
    
  //       // Ensure the new index is within bounds
  //       if (newIndex >= 0 && newIndex < this.chartItems.length) {
  //         // Remove selection from the previous item
  //         if (this.selectedIndex >= 0) {
  //           this.chartItems[this.selectedIndex].classList.remove('selected');
  //         }
    
  //         // Update the selected index and add selection to the new item
  //         this.selectedIndex = newIndex;
  //         this.chartItems[this.selectedIndex].classList.add('selected');
  //         this.chartItems[this.selectedIndex].focus();
  //       }
  //     } else if (event.key === ' ') {
   
  //       event.preventDefault();
  //       if (this.firstSelectedIndex === -1) {
  //         // First Enter key press: Store the first selected item
  //         if (this.selectedIndex !== -1) {
  //           this.firstSelectedIndex = this.selectedIndex;
  //           this.chartItems[this.selectedIndex].classList.add('first-selected');
  //           this.chartItems[this.selectedIndex].setAttribute('tabindex', '0');
  
  //         }
  //       } else {
  //         // Second Enter key press: Swap the first and second selected items
  //         if (this.selectedIndex !== -1 && this.selectedIndex !== this.firstSelectedIndex) {
  //           this.swapChartItems(this.firstSelectedIndex, this.selectedIndex);
  //           this.chartItems[this.firstSelectedIndex].classList.remove('first-selected');
  //           this.firstSelectedIndex = -1;  
  
  //           // Remove the 'selected' class from both items after swap
  //           this.chartItems[this.selectedIndex].classList.remove('selected');
  //           this.chartItems[this.selectedIndex].blur();
  //           $(this.target).find('.chartContainer').removeClass("selected");
  
  //         }
  //       }
  //     } else if (event.key === 'Enter') {
  //       log('here')
  //       event.preventDefault(); 
  //       if (this.selectedIndex >= 0) {
  //         this.selectedChartItem = this.chartItems[this.selectedIndex];
  //       }
  //       this.handleItemClick(this.selectedChartItem)
  //       // this.toggleChartContainer(this.selectedChartItem);
  //     }
  //   }

  // } 


  addToDOM(targetElementSelector) {
    const targetElement = document.querySelector(targetElementSelector);

    if (targetElement) {
      targetElement.appendChild(this.target);
    } else {
      console.error('Target element not found:', targetElementSelector);
    }


    // $(document).on('click', '.close-button', function() {
    //   console.log('close button clicked');  

    //   const parentContainer = $(this).parent().parent();
    //   parentContainer.removeClass("expand");
    //   parentContainer.attr('aria-expanded', 'false');
    //   $(this).remove();

    //   $( ".flex-container" ).find( ".flex-item.chartContainer" ).css( "display", "initial" );
    //   parentContainer.find( ".highchartsContainerExpand" ).removeClass('highchartsContainerExpand')
    //   Highcharts.charts.forEach(chart => {
    //     if (chart) {
    //         chart.reflow();
    //     }
    // });

    // removeAuxiliarBarGraphOptions()

    // REF.chartOpt = "mainChart"





    // });


  }


}



