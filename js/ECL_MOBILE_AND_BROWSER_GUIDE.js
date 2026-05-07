/**
 * EC Library (ECL) - European Commission Design System
 * Mobile Responsiveness & Browser Support Guide
 */

// =============================================================================
// MOBILE RESPONSIVENESS
// =============================================================================

/*
The EC Library (ECL) provides built-in responsive grid system with breakpoints:

Breakpoint Classes:
- ecl-col-*          : Default (mobile-first)
- ecl-col-s-*        : Small screens (≥576px)
- ecl-col-m-*        : Medium screens (≥768px)  
- ecl-col-l-*        : Large screens (≥992px)
- ecl-col-xl-*       : Extra large screens (≥1200px)

Column Values: 1-12 (12-column grid)

Example:
<div class="ecl-container">
  <div class="ecl-row">
    <div class="ecl-col-12 ecl-col-m-6 ecl-col-l-4">
      Content takes full width on mobile, 50% on medium, 33% on large
    </div>
  </div>
</div>

Current Project Mapping:
Bootstrap Classes → ECL Equivalents
- col-12          → ecl-col-12
- col-6           → ecl-col-6
- col-4           → ecl-col-4
- container       → ecl-container
- container-fluid → ecl-container (full width)
*/

// =============================================================================
// BROWSER SUPPORT
// =============================================================================

/*
EC Library Browser Support:
✓ Chrome (latest 2 versions)
✓ Firefox (latest 2 versions)
✓ Safari (latest 2 versions)
✓ Edge (latest 2 versions)
✓ Mobile Safari iOS 11+
✓ Chrome Android 60+
✓ Samsung Internet 8+

Not Supported:
✗ Internet Explorer 11 and below
✗ Old Android browsers (<5.0)

The project uses:
- CSS Grid (via ECL)
- Flexbox (via ECL and custom CSS)
- CSS Variables (ECL relies on this)
- Modern JavaScript (ES6+)

All of these require modern browsers. IE11 support would require:
1. CSS Grid polyfills
2. CSS Variable fallbacks
3. ES6 transpilation
*/

// =============================================================================
// JAVASCRIPT COMPONENTS
// =============================================================================

/*
Custom JavaScript Components Used:

1. ECLDropdownHandler (js/ecl-dropdown-handler.js)
   - Replaces Bootstrap dropdown functionality
   - Handles: click, keyboard navigation, accessibility
   - Supports: data-ecl-toggle="dropdown" and data-bs-toggle="dropdown"
   - Features: 
     * Auto-close on Escape key
     * Arrow key navigation
     * Focus management
     * ARIA attributes

2. DOM Components (js/domComponents/)
   - SubNavbar: Navigation with language selection
   - Navbar: Header with logo and globan
   - ChartContainer: Main chart display area
   - ChartControls: Options and settings for charts
   - Timeline: Year/period selector (HTML5 range input)
   - Footer: Footer information
   - FloatingControls: Mobile floating menu

3. External Libraries Retained:
   - Highcharts (charts)
   - ECL JavaScript (ecl-eu.js)
   - Intro.js (tutorials)
   - jQuery-UI removed
   - Bootstrap removed
*/

// =============================================================================
// DROPDOWN FUNCTIONALITY
// =============================================================================

/*
Old Bootstrap Implementation:
- Used data-bs-toggle="dropdown"
- Automatic initialization via Bootstrap JS
- Limited keyboard support

New ECL Implementation:
- Uses data-ecl-toggle="dropdown"
- Custom handler: ECLDropdownHandler class
- Enhanced keyboard navigation:
  * Enter/Space: Open dropdown
  * Escape: Close dropdown
  * Arrow Down/Up: Navigate menu items
  * Tab: Move to next/previous element

Dropdown HTML Structure (ECL-compatible):
<li class="nav-item dropdown">
  <button data-ecl-toggle="dropdown" aria-expanded="false">
    Menu
  </button>
  <ul class="dropdown-menu" role="menu">
    <li role="none">
      <button role="menuitem" onclick="action()">Item 1</button>
    </li>
    <li role="none">
      <button role="menuitem" onclick="action()">Item 2</button>
    </li>
  </ul>
</li>
*/

// =============================================================================
// ACCESSIBILITY FEATURES
// =============================================================================

/*
Maintained Accessibility Features:

1. ARIA Labels & Descriptions
   - data-i18n-label: For translatable aria-label
   - data-i18n-title: For translatable title attributes
   - aria-expanded: For dropdown state
   - aria-haspopup: For dropdown trigger buttons
   - role="menu", role="menuitem": For semantic structure

2. Keyboard Navigation
   - All interactive elements reachable via Tab
   - Dropdown menus navigable with arrow keys
   - Escape key closes modals/dropdowns
   - Focus indicators maintained

3. Screen Reader Support
   - Proper heading hierarchy
   - Semantic HTML (nav, main, section)
   - Image alt text
   - Form labels associated

4. Color Contrast
   - ECL provides WCAG AA compliant colors
   - Button states clearly visible
   - Links distinguished from regular text
*/

// =============================================================================
// MOBILE-SPECIFIC FEATURES
// =============================================================================

/*
Mobile Optimizations:

1. Responsive Typography
   - Base font sizes scale with viewport
   - Touch-friendly button sizes (min 44x44px)
   - Readable line lengths on all screens

2. Touch Events
   - Buttons and links have adequate spacing
   - Dropdowns work on touch devices
   - No hover-only content

3. Mobile Menus
   - SubNavbar.js creates adaptive UI:
     * Desktop: Full toolbar visible
     * Mobile: Compact menu with d-none class toggle
   - ChartControls: Mobile layout available

4. Viewport Settings (in endash.html):
   - width=device-width
   - initial-scale=1
   - Prevents zooming issues

5. Mobile Performance
   - CSS uses media queries (ecl-utilities.css)
   - No unnecessary animations
   - Fast dropdown interactions
*/

// =============================================================================
// TESTING MOBILE RESPONSIVENESS
// =============================================================================

/*
How to Test Mobile Support:

1. Browser DevTools
   - F12 > Device Toggle (Ctrl+Shift+M)
   - Preset devices: iPhone, iPad, Android
   - Custom viewport sizes

2. Specific Tests
   - Dropdown menus open/close on touch
   - No horizontal scroll at any breakpoint
   - All buttons/links are tappable (44x44px minimum)
   - Text is readable without zoom
   - Images scale properly

3. Breakpoint Testing
   - Mobile: 320px - 575px (use min-width 320px)
   - Tablet: 576px - 991px (medium screens)
   - Desktop: 992px+ (large screens)

Key Files Using Responsive Classes:
- endash.html: Uses col-12, container-fluid
- subNavBarComponent.js: Uses d-none, col-12
- auxChartControls.js: Uses navbar, nav-item
- css/mediaqueries.css: Media query rules

Responsive Utilities in ecl-utilities.css:
- d-none: Display none (can use media queries)
- col-* classes: Flexible grid
- ms-auto: Margin-left auto (flexbox centering)
- mx-2, my-2: Spacing utilities
*/

// =============================================================================
// ECL COMPONENT LIBRARY FEATURES
// =============================================================================

/*
Available ECL Components in Your CSS Files:

1. Grid System (ecl-eu.css)
   - ecl-container: Max-width container
   - ecl-row: Flexbox row
   - ecl-col-*: Responsive columns

2. Buttons (ecl-eu.css)
   - ecl-button: Base button class
   - ecl-button--primary: Primary action
   - ecl-button--secondary: Secondary action
   - ecl-button--ghost: Transparent button

3. Typography (ecl-eu-default.css)
   - Heading sizes: h1-h6
   - Body text: Readable sizes
   - Links: ecl-link, ecl-link--standalone

4. Forms (ecl-eu.css)
   - ecl-form-group: Form wrapper
   - ecl-form-label: Label styling
   - ecl-select: Select styling
   - ecl-text-input: Input styling

5. Icons (ecl-eu.css)
   - ecl-icon: Icon wrapper
   - ecl-icon--s: Small
   - ecl-icon--m: Medium
   - ecl-icon--l: Large

6. Modal (ecl-eu.css)
   - ecl-modal: Modal container
   - ecl-modal__header: Header
   - ecl-modal__body: Content
   - ecl-modal__footer: Footer

Note: Your project already uses ecl-modal in endash.html for the iframe modal.
*/

// =============================================================================
// CUSTOM UTILITIES & EXTENSIONS
// =============================================================================

/*
Custom Extensions Created:

1. ecl-utilities.css
   Purpose: Provides Bootstrap-to-ECL mapping for utility classes
   
   Includes:
   - Display utilities (d-none, d-flex, etc.)
   - Margin utilities (ms-auto, mx-2, etc.)
   - Padding utilities (px-1, py-2, etc.)
   - Grid columns (col-*, col-md-*, etc.)
   - Flexbox utilities (justify-content, align-items)
   - Dropdown styles (dropdown-menu, dropdown-item)
   - Navbar styles (navbar, nav-item, nav-link)
   - Form styles (form-select)
   - Background colors (bg-light, bg-white)
   - Responsive utilities (media queries)

2. ecl-dropdown-handler.js
   Purpose: Provides dropdown functionality without Bootstrap
   
   Features:
   - Auto-initialization on DOM load
   - Multiple dropdown support
   - Keyboard navigation
   - Accessibility compliant
   - Focus management
   - Click outside to close

3. Custom CSS Files (preserved)
   - css/newStiles/*.css: Component-specific styles
   - css/mediaqueries.css: Responsive design rules
   - css/tutorial.css: Tutorial styles

These work together to replace Bootstrap completely
while maintaining all functionality and accessibility.
*/

console.log('EC Library - Mobile & Browser Support Documentation Loaded');
