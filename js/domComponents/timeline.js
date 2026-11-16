class Timeline {
    // options.labels (e.g. ["2025-09", "2025-10", ...]) turns the slider into a
    // month slider over those entries: positions are indexes, the handle shows
    // the formatted month, and committing sets REF.month instead of REF.year.
    constructor(targetElement, maxYear, options = {}) {
        this.targetElement = targetElement;
        this.labels = options.labels || null;
        this.minYear = 1990;
        // maxYear is the dataset's own last year with real data (probed by
        // getLastAvailableYear() in basics.js), not a fixed calendar
        // heuristic - different datasets publish up to different years.
        this.maxYear = Number.isFinite(maxYear) ? maxYear : new Date().getFullYear() - 1;
        this.currentYear = Math.min(this.maxYear, Math.max(this.minYear, Number(REF.year) || this.minYear));
        if (this.labels) {
            this.minYear = 0;
            this.maxYear = this.labels.length - 1;
            const index = this.labels.indexOf(REF.month);
            this.currentYear = index >= 0 ? index : this.maxYear;
        }
        this.createTimeline();
        this.addToDOM();
        this.initializeSlider();
    }

    // What the handle shows for a slider position.
    display(value) {
        return this.labels ? formatMonthId(this.labels[value], { month: "short", year: "numeric" }) : value;
    }

    // Accessible name of the slider, in the page language.
    sliderLabel() {
        const labels = (typeof languageNameSpace !== "undefined" && languageNameSpace.labels) || {};
        return this.labels ? (labels.TIMELINE_MONTH_SLIDER || 'Month slider') : (labels.TIMELINE_YEAR_SLIDER || 'Year slider');
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
                          aria-valuetext="${this.display(this.currentYear)}"
                          aria-label="${this.sliderLabel()}"
                          aria-controls="${(codesDataset[REF.chartId] || {}).container || ''}">
                        <div id="sliderTimePeriod"><span>${this.display(this.currentYear)}</span></div>
                    </span>
                    <div class="ui-slider-range ui-slider-range-after"></div>
                </div>
                <!-- Tells screen readers the chart changed (the slider's own value is read as it moves). -->
                <div id="timelineStatus" role="status" aria-live="polite" aria-atomic="true"
                     style="position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;"></div>
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
            valueDisplay.textContent = this.display(this.currentYear);
            handle.setAttribute('aria-valuenow', this.currentYear);
            handle.setAttribute('aria-valuetext', this.display(this.currentYear));
        };

        const commitYearChange = () => {
            REF.chartOpt = 'compareChart';
            if (this.labels) {
                REF.month = this.labels[this.currentYear];
            } else {
                REF.year = this.currentYear;
                REF.yearManuallySet = true;
            }

            const status = this.timeline.querySelector('#timelineStatus');
            if (status) {
                const labels = (typeof languageNameSpace !== "undefined" && languageNameSpace.labels) || {};
                status.textContent = `${labels.TIMELINE_SHOWING || 'Showing'} ${this.display(this.currentYear)}`;
            }

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
            } else if (event.key === 'PageDown') {
                nextYear -= this.labels ? 3 : 10;
            } else if (event.key === 'PageUp') {
                nextYear += this.labels ? 3 : 10;
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

        // Removed again in removeFromDOM(), or every rebuilt timeline would leave one behind.
        this.onResize = () => renderYear(this.currentYear);
        window.addEventListener('resize', this.onResize);
    }

    addToDOM() {
        this.targetElement.appendChild(this.timeline);
    }

    removeFromDOM() {
        if (this.onResize) window.removeEventListener('resize', this.onResize);
        if (this.timeline.parentNode) {
            this.timeline.parentNode.removeChild(this.timeline);
        }
    }
}
