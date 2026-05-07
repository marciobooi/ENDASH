class Timeline {
    constructor(targetElement) {
        this.targetElement = targetElement;
        this.minYear = 1990;
        this.maxYear = 2022;
        this.createTimeline();
        this.addToDOM();
        this.initializeSlider();
    }

    createTimeline() {
        this.timeline = document.createElement('div');
        this.timeline.innerHTML = `
            <div id="chartSliderContainer">
                <div class="chart-slider-wrapper">
                    <input type="range" 
                           id="chartSlider" 
                           class="chart-slider" 
                           min="${this.minYear}" 
                           max="${this.maxYear}" 
                           value="${REF.year}"
                           role="slider" 
                           aria-valuenow="${REF.year}" 
                           aria-valuemin="${this.minYear}" 
                           aria-valuemax="${this.maxYear}">
                    <div id="sliderTimePeriod" class="slider-value-display">
                        <span>${REF.year}</span>
                    </div>
                </div>
            </div>`;
    }

    initializeSlider() {
        const slider = this.timeline.querySelector("#chartSlider");
        const valueDisplay = this.timeline.querySelector("#sliderTimePeriod span");

        // Update display on input
        slider.addEventListener('input', (event) => {
            const value = parseInt(event.target.value);
            valueDisplay.textContent = value;
            slider.setAttribute('aria-valuenow', value);
        });

        // Handle slider change
        slider.addEventListener('change', (event) => {
            const value = parseInt(event.target.value);
            REF.chartOpt = "compareChart";
            REF.year = value;
            
            if (REF.chartCreated === true) {
                if (REF.chartType === "barChart") {
                    createBarChart();
                } else {
                    piechartdata();
                }
            } else {
                compareCountries();
            }
        });
    }

    addToDOM() {
        this.targetElement.appendChild(this.timeline);
    }

    removeFromDOM() {
        if (this.timeline.parentNode) {
            this.timeline.parentNode.removeChild(this.timeline);
        }
    }
}
