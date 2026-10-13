// Charts whose Eurostat source dataset is currently down upstream (errors on
// every query). Hidden from the gallery entirely rather than showing a "no
// data" card. Remove an id once its dataset is back.
// chart_20 was here (nrg_ind_market, permanently erroring) until it was
// replaced with the "Rate of electrification" chart (nrg_ind_re).
const HIDDEN_CHART_IDS = [];

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

    // Fallback for fast scrolling: chartApiCall() is a synchronous XHR, so
    // while one chart is loading the main thread can't run layout/intersection
    // checks at all. A card that scrolls fully into and back out of view
    // during that block never gets an "isIntersecting" event and is
    // permanently skipped. After scrolling settles, sweep for any item
    // that's currently visible but was never rendered, and catch it up.
    this.handleScrollSettle = this.handleScrollSettle.bind(this);
    window.addEventListener('scroll', () => {
      clearTimeout(this.scrollSettleTimer);
      this.scrollSettleTimer = setTimeout(this.handleScrollSettle, 200);
    }, { passive: true });
  }

  isChartItemVisible(chartItem) {
    const rect = chartItem.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    return rect.bottom > 0 && rect.right > 0 && rect.top < viewportHeight && rect.left < viewportWidth;
  }

  handleScrollSettle() {
    this.chartItems.forEach(chartItem => {
      if (chartItem.getAttribute('data-rendered') === 'true') return;
      if (this.isChartItemVisible(chartItem)) {
        this.renderChartItem(chartItem);
      }
    });
  }

  getRenderKey(chartId) {
    const chartData = codesDataset[chartId] || {};
    const geos = Array.isArray(REF.geos) ? REF.geos.join(',') : REF.geos;
    const indicator = Array.isArray(chartData.indicator) ? chartData.indicator.join(',') : chartData.indicator;
    const indicator2 = Array.isArray(chartData.indicator2) ? chartData.indicator2.join(',') : chartData.indicator2;

    return [
      chartId,
      REF.language,
      geos,
      REF.year,
      REF.percentage,
      REF.chartType,
      chartData.dataset,
      chartData.unit,
      indicator,
      indicator2
    ].join('|');
  }

 handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            this.renderChartItem(entry.target);
        } else {
          setTimeout(() => {
            unloadSkeleton(entry.target);
          }, 2500);
        }
    });
}

  renderChartItem(chartItem) {
    REF.chartId = chartItem.id;
    const highchartsContainer = chartItem.querySelector('.highchartsContainer');
    const renderKey = this.getRenderKey(chartItem.id);
    const previousRenderKey = chartItem.getAttribute('data-render-key');
    const hasChartDom = highchartsContainer && highchartsContainer.childElementCount > 0;
    const shouldRender = previousRenderKey !== renderKey || !hasChartDom;

    const url = new URL(window.location.href);
    const shareParam = url.searchParams.get("share");

    if (shareParam == "true") {
        REF.share = shareParam;
        hideForIframe();
        this.intersectionObserver.disconnect();
    } else {
        if (shouldRender) {
          loadSkeleton(chartItem);
          endash();
          chartItem.setAttribute('data-rendered', 'true');
          chartItem.setAttribute('data-render-key', renderKey);
        }
        setTimeout(() => {
          unloadSkeleton(chartItem);
        }, 2500);
    }
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

    const labels = (typeof languageNameSpace !== "undefined" && languageNameSpace.labels) || {};
    const galleryRoot = document.createDocumentFragment();

    THEME_SECTIONS.forEach(theme => {
      const section = document.createElement('section');
      section.classList.add('theme-section');

      // The heading doubles as the jump-nav's scroll/focus target (id
      // matches the nav link's href="#theme-id"); tabindex="-1" lets JS
      // focus it after the jump so screen reader users land on it too,
      // without adding it to the normal Tab order.
      const heading = document.createElement('h2');
      heading.id = theme.id;
      heading.tabIndex = -1;
      // ecl-u-type-heading-2 matches the ECL component library's heading
      // scale exactly (H1-H6: ecl-u-type-heading-1..6); theme-section__heading
      // only adds spacing/color/scroll-margin on top of it.
      heading.classList.add('ecl-u-type-heading-2', 'theme-section__heading');
      heading.setAttribute('data-i18n', theme.labelKey);
      heading.textContent = labels[theme.labelKey] || theme.labelKey;
      section.appendChild(heading);

      const chartIdsForTheme = theme.charts.filter(chartId => !HIDDEN_CHART_IDS.includes(chartId));

      if (chartIdsForTheme.length === 0) {
        const comingSoon = document.createElement('p');
        comingSoon.classList.add('theme-section__empty');
        comingSoon.setAttribute('data-i18n', 'THEME_COMING_SOON');
        comingSoon.textContent = labels['THEME_COMING_SOON'] || 'THEME_COMING_SOON';
        section.appendChild(comingSoon);
        galleryRoot.appendChild(section);
        return;
      }

      const chartContainer = document.createElement('div');
      chartContainer.classList.add('flex-container');

      chartIdsForTheme.forEach(chartId => {
        const chartData = codesDataset[chartId] || {};

        const chartItem = document.createElement('div');
        chartItem.classList.add('flex-item', 'chartContainer');
        chartItem.id = chartId;
        chartItem.draggable = true;
        chartItem.setAttribute('data-expanded', 'false');
        chartItem.addEventListener('dragstart', this.handleDragStart.bind(this));
        chartItem.addEventListener('dragover', this.handleDragOver.bind(this));
        chartItem.addEventListener('drop', this.handleDrop.bind(this));

        chartContainer.appendChild(chartItem);

        const containerNav = document.createElement('div');
        containerNav.classList.add('containerNav');
        // Show the real (already-translated) title immediately instead of a
        // generic "Chart Item N" placeholder - languageNameSpace.labels is
        // already loaded by the time this runs (buildComponents() only runs
        // after initLanguage() resolves), so there's no need to wait for
        // endash() to replace it once the card scrolls into view.
        containerNav.textContent = labels[chartData.title] || chartData.title || chartId;

        const skeleton = document.createElement('div');
        skeleton.classList.add('skeletonContainer', 'd-none');

        const highchartsContainer = document.createElement('div');
        highchartsContainer.classList.add('highchartsContainer');
        // Use the chart's own configured container id rather than deriving
        // it from loop position, since charts are no longer rendered in
        // chart_1..chart_N order.
        highchartsContainer.id = chartData.container || `highchartsContainer_${chartId.replace('chart_', '')}`;

        chartItem.appendChild(containerNav);
        chartItem.appendChild(highchartsContainer);
        chartItem.appendChild(skeleton);

        this.chartItems.push(chartItem);
      });

      section.appendChild(chartContainer);
      galleryRoot.appendChild(section);
    });

    this.target.appendChild(galleryRoot);
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

      // REF.year/REF.yearManuallySet are shared globals, not per-chart - a
      // year picked on a previous chart's timeline (and the "respect it,
      // don't fall back" flag that comes with it) would otherwise leak into
      // this freshly-opened chart's bar/pie view, even though its dataset
      // may not have that year at all. Reset so every newly-opened chart
      // starts with the automatic last-available-year safety net active
      // again, same as a first load.
      REF.yearManuallySet = false;

      if(!$(chartContainer).hasClass('expand')){
        $( ".flex-container" ).find( ".flex-item.chartContainer" ).css( "display", "none" );
        // The gallery is grouped into themed sections with their own
        // headings/"coming soon" text now - hide those too, or they're left
        // floating above/below the expanded chart with no cards under them.
        // Also hide the "Energy topics" jump-nav itself - jumping to a
        // different theme while one chart is expanded doesn't make sense.
        $( ".theme-section__heading, .theme-section__empty, .theme-nav" ).css( "display", "none" );
        chartContainer.classList.add('expand');
        chartContainer.setAttribute('data-expanded', 'true');
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

      const containerNav = document.querySelector(".containerNav");
      if (containerNav) {
        containerNav.id = "title";
        containerNav.style.visibility = "initial";
        containerNav.style.height = "4rem";
        containerNav.style.fontSize = ".4em";
        const titleLabel = languageNameSpace.labels[REF.title] || REF.title || "";
        const geoLabel = languageNameSpace.labels[REF.geos] || REF.geos || "";
        containerNav.innerHTML = `${titleLabel} - ${geoLabel}`;
      }

      const titleElement = document.querySelector("#title");
      if (titleElement) {
        const titleLabel = languageNameSpace.labels[REF.title] || REF.title || "";
        const geoLabel = languageNameSpace.labels[REF.geos] || REF.geos || "";
        titleElement.innerHTML = `${titleLabel} - ${geoLabel}`;
      }
      
    } 

    const $chartContainer = $(chartContainer);
    $chartContainer.find('.highcharts-credits').css('display', 'initial');    
    $('text.highcharts-axis-title').css('display', 'initial')
    getTitle()
    
    }

  swapChartItems(index1, index2) {
    const item1 = this.chartItems[index1];
    const item2 = this.chartItems[index2];

    // Cards are now grouped into per-theme flex containers rather than one
    // shared container, so only swap within the same theme section - the
    // old "rebuild one shared container from this.chartItems" approach
    // would otherwise yank cards out of their theme section.
    if (!item1 || !item2 || item1.parentNode !== item2.parentNode) return;

    this.chartItems[index1] = item2;
    this.chartItems[index2] = item1;

    const parent = item1.parentNode;
    const placeholder = document.createComment('');
    parent.insertBefore(placeholder, item1);
    parent.insertBefore(item1, item2);
    parent.insertBefore(item2, placeholder);
    parent.removeChild(placeholder);
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



