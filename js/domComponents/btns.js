class Button {
    constructor(id, classes, ariaLabel, value, otherAccessibilityParams, title) {
      this.id = id;
      this.classes = classes;
      this.ariaLabel = ariaLabel;
      this.value = value;
      this.otherAccessibilityParams = otherAccessibilityParams;
      this.clickHandler = null;
      this.buttonElement = null;
      this.innerHtml = "";
      this.title = title;

    }
  
    setClickHandler(handler) {
        this.clickHandler = handler;
        if (this.buttonElement) {
          this.buttonElement.addEventListener("click", this.clickHandler);
        }
      }
  
    setInnerHtml(html) {
      this.innerHtml = html;
      if (this.buttonElement) {
        this.buttonElement.innerHTML = html;
      }
    }

    setDisabled(disabled) {
        if (this.buttonElement) {
          this.buttonElement.disabled = disabled;
        }
      }
  
      createButton() {
        this.buttonElement = document.createElement("button");
        this.buttonElement.id = this.id;
        this.buttonElement.classList.add(...this.classes);
        this.buttonElement.setAttribute("value", this.value);
        this.buttonElement.setAttribute("data-i18n-label", this.ariaLabel);
        this.buttonElement.setAttribute("data-i18n-title", this.ariaLabel);
        // Resolve label immediately (labels are already loaded when components build)
        const resolvedLabel = (languageNameSpace && languageNameSpace.labels && languageNameSpace.labels[this.ariaLabel]) || this.ariaLabel;
        this.buttonElement.setAttribute("aria-label", resolvedLabel);
        this.buttonElement.setAttribute("title", resolvedLabel);
        this.buttonElement.innerHTML = this.innerHtml;
        // Apply other accessibility parameters as needed
        if (this.clickHandler) {
          this.buttonElement.addEventListener("click", this.clickHandler);
        }
        return this.buttonElement;
      }
  }