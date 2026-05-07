/**
 * ECL Dropdown Handler - Replaces Bootstrap dropdown functionality
 * Handles opening/closing dropdowns with data-ecl-toggle="dropdown" attribute
 */

class ECLDropdownHandler {
  constructor() {
    this.activeDropdown = null;
    this.init();
  }

  init() {
    document.addEventListener('click', (e) => this.handleClick(e));
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  handleClick(e) {
    const toggle = e.target.closest('[data-ecl-toggle="dropdown"], [data-bs-toggle="dropdown"]');
    
    if (toggle) {
      e.preventDefault();
      e.stopPropagation();
      this.toggleDropdown(toggle);
    } else if (this.activeDropdown && !e.target.closest('[role="menu"]')) {
      this.closeDropdown();
    }
  }

  handleKeydown(e) {
    if (e.key === 'Escape' && this.activeDropdown) {
      this.closeDropdown();
      const toggle = this.activeDropdown.previousElementSibling;
      if (toggle) toggle.focus();
    }

    // Handle arrow keys for menu navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const menu = e.target.closest('[role="menu"]');
      if (menu) {
        e.preventDefault();
        this.navigateMenu(menu, e.key === 'ArrowDown');
      }
    }
  }

  toggleDropdown(toggle) {
    const menu = toggle.nextElementSibling;
    
    if (!menu || menu.getAttribute('role') !== 'menu') {
      return;
    }

    if (this.activeDropdown && this.activeDropdown !== menu) {
      this.closeDropdown();
    }

    const isOpen = menu.classList.contains('show');
    
    if (isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown(toggle, menu);
    }
  }

  openDropdown(toggle, menu) {
    menu.classList.add('show');
    toggle.setAttribute('aria-expanded', 'true');
    this.activeDropdown = menu;

    // Focus first menu item
    const firstItem = menu.querySelector('[role="menuitem"]') || menu.querySelector('button');
    if (firstItem) {
      firstItem.focus();
    }
  }

  closeDropdown() {
    if (this.activeDropdown) {
      this.activeDropdown.classList.remove('show');
      const toggle = this.activeDropdown.previousElementSibling;
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
      this.activeDropdown = null;
    }
  }

  navigateMenu(menu, isDown) {
    const items = menu.querySelectorAll('[role="menuitem"], button');
    const focused = document.activeElement;
    const focusedIndex = Array.from(items).indexOf(focused);

    let nextIndex;
    if (isDown) {
      nextIndex = focusedIndex === -1 ? 0 : Math.min(focusedIndex + 1, items.length - 1);
    } else {
      nextIndex = focusedIndex === -1 ? items.length - 1 : Math.max(focusedIndex - 1, 0);
    }

    if (items[nextIndex]) {
      items[nextIndex].focus();
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ECLDropdownHandler();
  });
} else {
  new ECLDropdownHandler();
}
