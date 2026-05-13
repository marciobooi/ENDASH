class Timeline {
    constructor(targetElement) {
        this.targetElement = targetElement;
        this.minYear = 1990;
        this.maxYear = 2022;
        this.currentYear = Number(REF.year) || this.minYear;
        this.createTimeline();
        this.addToDOM();
        this.initializeSlider();
    }

    createTimeline() {
        this.timeline = document.createElement('div');
        this.timeline.classList.add('timeline-wrapper');
        this.timeline.innerHTML = `
            <div id="timeLineComponent">
                <div id="timeline-slider" class="ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all">
                    <span class="ui-slider-handle ui-state-default ui-corner-all"
                          tabindex="0"
                          role="slider"
                          aria-orientation="horizontal"
                          aria-valuemin="${this.minYear}"
                          aria-valuemax="${this.maxYear}"
                          aria-valuenow="${this.currentYear}"
                          aria-label="Year slider">
                        <div id="sliderTimePeriod"><span>${this.currentYear}</span></div>
                    </span>
                    <div class="ui-slider-range ui-slider-range-after"></div>
                </div>
            </div>`;
    }

    initializeSlider() {
        const slider = this.timeline.querySelector('#timeline-slider');
        const handle = this.timeline.querySelector('.ui-slider-handle');
        const range = this.timeline.querySelector('.ui-slider-range-after');
        const valueDisplay = this.timeline.querySelector('#sliderTimePeriod span');

        const clamp = (value) => Math.min(this.maxYear, Math.max(this.minYear, value));
        const toPercent = (year) => ((year - this.minYear) / (this.maxYear - this.minYear)) * 100;
        const fromPointer = (clientX) => {
            const rect = slider.getBoundingClientRect();
            const ratio = rect.width > 0 ? (clientX - rect.left) / rect.width : 0;
            const year = Math.round(this.minYear + ratio * (this.maxYear - this.minYear));
            return clamp(year);
        };

        const renderYear = (year) => {
            this.currentYear = clamp(year);
            const percent = toPercent(this.currentYear);
            handle.style.left = `${percent}%`;
            range.style.width = `${percent}%`;
            valueDisplay.textContent = this.currentYear;
            handle.setAttribute('aria-valuenow', this.currentYear);
        };

        const commitYearChange = () => {
            REF.chartOpt = 'compareChart';
            REF.year = this.currentYear;

            switch (REF.chartType) {
                case 'barChart':
                    createBarChart();
                    break;
                case 'pieChart':
                case 'lineChart':
                default:
                    compareCountries();
                    break;
            }
        };

        renderYear(this.currentYear);

        let isDragging = false;

        const onMove = (event) => {
            if (!isDragging) return;
            renderYear(fromPointer(event.clientX));
        };

        const onUp = () => {
            if (!isDragging) return;
            isDragging = false;
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            commitYearChange();
        };

        handle.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            isDragging = true;
            handle.focus();
            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
        });

        slider.addEventListener('click', (event) => {
            if (event.target === handle || handle.contains(event.target)) return;
            renderYear(fromPointer(event.clientX));
            commitYearChange();
        });

        handle.addEventListener('keydown', (event) => {
            let nextYear = this.currentYear;

            if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                nextYear -= 1;
            } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                nextYear += 1;
            } else if (event.key === 'Home') {
                nextYear = this.minYear;
            } else if (event.key === 'End') {
                nextYear = this.maxYear;
            } else {
                return;
            }

            event.preventDefault();
            const prevYear = this.currentYear;
            renderYear(nextYear);

            if (this.currentYear !== prevYear) {
                commitYearChange();
            }
        });

        window.addEventListener('resize', () => {
            renderYear(this.currentYear);
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
