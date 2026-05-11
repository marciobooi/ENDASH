/**
 * Keyboard Navigation Logic — ES6 (no jQuery)
 *
 * Covers:
 *  1. Generic focus-trap helper.
 *  2. Language overlay (#language-list-overlay): activate/deactivate trap.
 *  3. ECL <dialog> modal (#iframeModal): trap focus, ESC closes, restore focus.
 *  4. Menubar arrow-key navigation for all [role="menubar"] toolbars.
 */

/* ─────────────────────────────────────────────
   Utility: collect visible, enabled, focusable elements.
   ───────────────────────────────────────────── */
function getFocusableElements(container) {
  const selector = [
    'a[href]:not([disabled]):not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  return Array.from(container.querySelectorAll(selector)).filter(
    (el) => !el.closest('[hidden]') && getComputedStyle(el).display !== 'none'
  );
}

/* ─────────────────────────────────────────────
   Generic focus-trap factory.
   Returns { activate, deactivate }.
   ───────────────────────────────────────────── */
function createFocusTrap(containerSelector, { onEscape } = {}) {
  let previouslyFocused = null;
  let handler = null;

  function activate() {
    const container = typeof containerSelector === 'string'
      ? document.querySelector(containerSelector)
      : containerSelector;
    if (!container) return;

    previouslyFocused = document.activeElement;

    const focusable = getFocusableElements(container);
    if (focusable.length) focusable[0].focus();

    handler = function (event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault();
        if (typeof onEscape === 'function') onEscape();
        deactivate();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(container);
      if (!focusable.length) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', handler);
  }

  function deactivate() {
    const container = typeof containerSelector === 'string'
      ? document.querySelector(containerSelector)
      : containerSelector;
    if (container && handler) {
      container.removeEventListener('keydown', handler);
      handler = null;
    }
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
      previouslyFocused = null;
    }
  }

  return { activate, deactivate };
}

/* ─────────────────────────────────────────────
   1. Language overlay focus-trap.
   navComponent handles Tab-cycling, Enter/Space and Escape
   internally.  These two globals let navComponent opt-in to
   the trap without duplicating any logic.
   ───────────────────────────────────────────── */
const _languageOverlayTrap = createFocusTrap('#language-list-overlay', {
  onEscape() {
    const overlay = document.querySelector('#language-list-overlay');
    if (overlay) overlay.classList.remove('visible');
    const toggleBtn = document.querySelector('#toggleLanguageBtn');
    if (toggleBtn) toggleBtn.focus();
  },
});

function activateLanguageOverlayTrap()   { _languageOverlayTrap.activate(); }
function deactivateLanguageOverlayTrap() { _languageOverlayTrap.deactivate(); }

/* ─────────────────────────────────────────────
   2. ECL <dialog> modal (#iframeModal) focus-trap.
   Native <dialog> traps Tab in supporting browsers; we add
   Escape-to-close and focus restoration.
   Deferred to DOMContentLoaded because this script is loaded
   in <head> before <body> is parsed.
   ───────────────────────────────────────────── */
function initModalFocusTrap() {
  const modal = document.getElementById('iframeModal');
  if (!modal) return;

  const trap = createFocusTrap(modal, {
    onEscape() {
      if (typeof closeModalUrl === 'function') closeModalUrl();
      if (modal.open) modal.close();
    },
  });

  // Activate / deactivate based on the [open] attribute
  const observer = new MutationObserver(() => {
    if (modal.open) {
      trap.activate();
    } else {
      trap.deactivate();
    }
  });

  observer.observe(modal, { attributes: true, attributeFilter: ['open'] });

  // Deactivate on any explicit close button click
  modal.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-ecl-modal-close], .ecl-modal__close');
    if (btn) trap.deactivate();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModalFocusTrap);
} else {
  initModalFocusTrap();
}

/* ─────────────────────────────────────────────
   3. Menubar arrow-key navigation (WAI-ARIA menubar pattern).
   Left/Right arrows navigate between sibling menuitems.
   Home/End jump to first/last.
   Wired on every [role="menubar"], including dynamically
   injected ones.
   ───────────────────────────────────────────── */
function initMenubarArrowNav(menubar) {
  if (!menubar || menubar.dataset.arrowNavInit) return;
  menubar.dataset.arrowNavInit = 'true';

  menubar.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

    const items = Array.from(
      menubar.querySelectorAll(':scope > li > [role="menuitem"]:not([disabled])')
    );
    if (!items.length) return;

    const current = document.activeElement;
    const idx = items.indexOf(current);
    if (idx === -1) return;

    event.preventDefault();

    let target;
    if (event.key === 'Home') {
      target = items[0];
    } else if (event.key === 'End') {
      target = items[items.length - 1];
    } else if (event.key === 'ArrowRight') {
      target = items[(idx + 1) % items.length];
    } else {
      target = items[(idx - 1 + items.length) % items.length];
    }
    target.focus();
  });
}

function initMenubars() {
  function initAll() {
    document.querySelectorAll('[role="menubar"]').forEach(initMenubarArrowNav);
  }

  const mo = new MutationObserver(initAll);
  mo.observe(document.body, { childList: true, subtree: true });
  initAll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMenubars);
} else {
  initMenubars();
}
