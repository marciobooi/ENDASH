(function() {
  function getChartForElement(el) {
    if (!el || !window.Highcharts || !Highcharts.charts) return null;
    return Highcharts.charts.find((chart) => chart && chart.renderTo === el) || null;
  }

  function toElements(input) {
    if (input == null) return [];
    if (input === window || input === document) return [input];
    if (typeof input === "string") return Array.from(document.querySelectorAll(input));
    if (input instanceof Element) return [input];
    if (input instanceof NodeList || Array.isArray(input)) return Array.from(input);
    return [];
  }

  function api(elements) {
    return {
      elements,
      each(cb) {
        elements.forEach((el, i) => cb.call(el, i, el));
        return this;
      },
      find(selector) {
        const found = elements.flatMap((el) => Array.from(el.querySelectorAll(selector)));
        return api(found);
      },
      prev() {
        const prevEls = elements.map((el) => el.previousElementSibling).filter(Boolean);
        return api(prevEls);
      },
      css(prop, value) {
        if (typeof prop === "string" && value === undefined) {
          const first = elements[0];
          return first ? getComputedStyle(first)[prop] : undefined;
        }
        elements.forEach((el) => {
          if (!(el instanceof Element)) return;
          if (typeof prop === "object") {
            Object.entries(prop).forEach(([k, v]) => {
              el.style[k] = v;
            });
          } else {
            el.style[prop] = value;
          }
        });
        return this;
      },
      addClass(cls) {
        elements.forEach((el) => el.classList && el.classList.add(...String(cls).split(/\s+/).filter(Boolean)));
        return this;
      },
      removeClass(cls) {
        elements.forEach((el) => el.classList && el.classList.remove(...String(cls).split(/\s+/).filter(Boolean)));
        return this;
      },
      toggleClass(cls) {
        elements.forEach((el) => el.classList && el.classList.toggle(cls));
        return this;
      },
      hasClass(cls) {
        return elements.some((el) => el.classList && el.classList.contains(cls));
      },
      attr(name, value) {
        if (typeof name === "object") {
          elements.forEach((el) => {
            if (!(el instanceof Element)) return;
            Object.entries(name).forEach(([k, v]) => el.setAttribute(k, v));
          });
          return this;
        }
        if (value === undefined) {
          const first = elements[0];
          return first instanceof Element ? first.getAttribute(name) : undefined;
        }
        elements.forEach((el) => el instanceof Element && el.setAttribute(name, value));
        return this;
      },
      removeAttr(name) {
        elements.forEach((el) => el instanceof Element && el.removeAttribute(name));
        return this;
      },
      prop(name, value) {
        if (value === undefined) {
          const first = elements[0];
          return first ? first[name] : undefined;
        }
        elements.forEach((el) => {
          if (el) el[name] = value;
        });
        return this;
      },
      html(value) {
        if (value === undefined) {
          const first = elements[0];
          return first instanceof Element ? first.innerHTML : undefined;
        }
        elements.forEach((el) => el instanceof Element && (el.innerHTML = value));
        return this;
      },
      text(value) {
        if (value === undefined) {
          const first = elements[0];
          return first instanceof Element ? first.textContent : undefined;
        }
        elements.forEach((el) => el instanceof Element && (el.textContent = value));
        return this;
      },
      empty() {
        elements.forEach((el) => el instanceof Element && (el.innerHTML = ""));
        return this;
      },
      remove() {
        elements.forEach((el) => el && el.remove && el.remove());
        return this;
      },
      hide() {
        elements.forEach((el) => el instanceof Element && (el.style.display = "none"));
        return this;
      },
      show() {
        elements.forEach((el) => el instanceof Element && (el.style.display = ""));
        return this;
      },
      focus() {
        const first = elements[0];
        if (first && first.focus) first.focus();
        return this;
      },
      width() {
        const first = elements[0];
        if (first === window) return window.innerWidth;
        return first instanceof Element ? first.getBoundingClientRect().width : 0;
      },
      on(events, selectorOrHandler, maybeHandler) {
        const eventList = String(events).split(/\s+/).filter(Boolean);
        const delegated = typeof selectorOrHandler === "string";
        const handler = delegated ? maybeHandler : selectorOrHandler;
        elements.forEach((el) => {
          eventList.forEach((evt) => {
            el.addEventListener(evt, (event) => {
              if (!delegated) {
                handler.call(el, event);
                return;
              }
              const match = event.target.closest(selectorOrHandler);
              if (match && (el === document || el.contains(match))) {
                handler.call(match, event);
              }
            });
          });
        });
        return this;
      },
      submit() {
        const first = elements[0];
        if (first && first.submit) first.submit();
        return this;
      },
      highcharts() {
        const first = elements[0];
        if (!(first instanceof Element)) return null;
        return getChartForElement(first);
      }
    };
  }

  function $(input) {
    return api(toElements(input));
  }

  window.$ = $;
})();
