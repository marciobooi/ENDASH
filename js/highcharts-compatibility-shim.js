/**
 * Highcharts Compatibility Shim
 * Provides missing functions for older Highcharts versions
 * Note: Highcharts 12.4.0+ has full AST support - this is only for fallback
 */

// Only add polyfills for very old Highcharts versions without AST
(function() {
  'use strict';
  
  // Exit early if Highcharts is not loaded or already has full AST support
  if (typeof Highcharts === 'undefined') {
    console.warn('Highcharts not loaded yet - compatibility shim skipped');
    return;
  }
  
  // Highcharts 12.x has full AST support, no polyfills needed
  if (Highcharts.AST && typeof Highcharts.AST.prototype !== 'undefined') {
    console.log('Highcharts AST available - no polyfills needed');
    return;
  }
  
  // Only for older versions without AST
  if (!Highcharts.AST) {
    console.log('Adding AST polyfills for older Highcharts version');
    
    Highcharts.AST = {
      allowedTags: [
        'a', 'abbr', 'b', 'br', 'button', 'caption', 'circle', 'code', 'dd', 'defs',
        'div', 'dl', 'dt', 'em', 'g', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i',
        'img', 'li', 'linearGradient', 'ol', 'p', 'path', 'span', 'stop', 'strong',
        'style', 'sub', 'sup', 'svg', 'table', 'text', 'tbody', 'td', 'tspan', 'th',
        'thead', 'title', 'tr', 'u', 'ul', 'image'
      ],
      allowedAttributes: [
        'alt', 'aria-describedby', 'aria-hidden', 'aria-label', 'aria-labelledby',
        'aria-live', 'class', 'clip-path', 'color', 'colspan', 'cx', 'cy', 'd',
        'dx', 'dy', 'fill', 'fillOpacity', 'height', 'href', 'id', 'opacity', 'r',
        'role', 'rowspan', 'rx', 'ry', 'stroke', 'stroke-linecap', 'stroke-width',
        'style', 'tabindex', 'text-anchor', 'title', 'transform', 'valign', 'width',
        'x', 'x1', 'x2', 'xlink:href', 'y', 'y1', 'y2', 'zIndex'
      ]
    };
  }
})();