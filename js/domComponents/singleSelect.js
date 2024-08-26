class Singleselect {
    constructor(elementId, optionsArray, labelDescription, activeElement, textChange, changeCallback) {
        // Assigning constructor parameters to class properties
        this.elementId = elementId;
        this.optionsArray = optionsArray;
        this.labelDescription = labelDescription;
        this.activeElement = activeElement;
        this.textChange = textChange;
        this.changeHandler = changeCallback;
        this.svgArrow = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 24 24" enable-background="new 0 0 24 24" focusable="false" aria-hidden="true" class="ecl-icon ecl-icon--s ecl-select__icon-shape ecl-icon--rotate-180"><path d="M18.2 17.147c.2.2.4.3.7.3.3 0 .5-.1.7-.3.4-.4.4-1 0-1.4l-7.1-7.1c-.4-.4-1-.4-1.4 0l-7 7c-.3.4-.3 1 .1 1.4.4.4 1 .4 1.4 0l6.2-6.2 6.4 6.3z"></path></svg>';

        // Adding event listener to handle change events
        document.addEventListener('change', (event) => {
            if (event.target.id === this.elementId && this.changeHandler) {
                this.changeHandler(event.target.value);
            }
        });
    }

    createSingleSelect() {
        let optionsHTML = '';   
        if (this.elementId === "selectCountry") {
            optionsHTML = `
                <optgroup label="${languageNameSpace.labels['AGGREGATES_COUNTRY_CODES']}">
                    ${AGGREGATES_COUNTRY_CODES.map(elm => `<option value="${elm}" ${this.activeElement[0] === elm  || this.activeElement === elm ? 'selected' : ''}>${languageNameSpace.labels[elm]}</option>`).join('')}
                </optgroup>
                <optgroup label="${languageNameSpace.labels['EU_COUNTRY_CODES']}">
                    ${EU_COUNTRY_CODES.map(elm => `<option value="${elm}" ${this.activeElement[0] === elm  || this.activeElement === elm ? 'selected' : ''}>${languageNameSpace.labels[elm]}</option>`).join('')}
                </optgroup>
                <optgroup label="${languageNameSpace.labels['EFTA_COUNTRY_CODES']}">
                    ${EFTA_COUNTRY_CODES.map(elm => `<option value="${elm}" ${this.activeElement[0] === elm  || this.activeElement === elm ? 'selected' : ''}>${languageNameSpace.labels[elm]}</option>`).join('')}
                </optgroup>
                <optgroup label="${languageNameSpace.labels['ENLARGEMENT_COUNTRY_CODES']}">
                    ${ENLARGEMENT_COUNTRY_CODES.map(elm => `<option value="${elm}" ${this.activeElement[0] === elm  || this.activeElement === elm ? 'selected' : ''}>${languageNameSpace.labels[elm]}</option>`).join('')}
                </optgroup>
                <optgroup label="${languageNameSpace.labels['OTHER_THIRD_COUNTRY_CODES']}">
                    ${OTHER_THIRD_COUNTRY_CODES.map(elm => `<option value="${elm}" ${this.activeElement[0] === elm  || this.activeElement === elm ? 'selected' : ''}>${languageNameSpace.labels[elm]}</option>`).join('')}
                </optgroup>
        `;
        } else {
            // For other elementIds, create options based on the provided optionsArray
            optionsHTML = this.optionsArray.map(option => `
                <option value="${option}" ${this.activeElement === option ? 'selected' : ''}>
                    ${languageNameSpace.labels[option] !== undefined ? languageNameSpace.labels[option] : option}
                </option>
            `).join('');
        }

        // Generate the full HTML for the single select element
        const singleSelectHTML = `
            <div class="ecl-form-group" role="application">
                <div class="ecl-select__container ecl-select__container--l">
                    <select class="ecl-select" id="${this.elementId}" name="country" required="">
                        ${optionsHTML}
                    </select>
                    <div class="ecl-select__icon">
                        ${this.svgArrow}
                    </div>
                </div>
            </div>
        `;

        return singleSelectHTML;
    }

    // attachEventListeners() {
    //     // Attach event listeners for mouseenter and mouseleave events to show/hide textChange
    //     const labelElement = document.querySelector(`label[for="${this.elementId}"]`);
    //     const selectElement = document.getElementById(this.elementId);

    //     selectElement.addEventListener('mouseenter', () => {
    //         labelElement.textContent = this.textChange;
    //     });

    //     selectElement.addEventListener('mouseleave', () => {
    //         labelElement.textContent = this.labelDescription;
    //     });
    // }
}
