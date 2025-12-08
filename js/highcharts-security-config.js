/**
 * Highcharts Security Configuration
 * Extends allowed HTML tags and attributes for Highcharts AST
 * Compatible with Highcharts v12.4.0+
 */

(function() {
  'use strict';
  
  // Wait for Highcharts to be available
  if (typeof Highcharts === 'undefined') {
    console.warn('Highcharts not loaded - security config skipped');
    return;
  }
  
  // Only extend if AST exists (Highcharts 9.x+)
  if (Highcharts.AST) {
    
    // Additional tags that may be needed
    var additionalTags = [
      'image',
      'radialGradient',
      'pattern',
      'clipPath',
      'mask',
      'use',
      'symbol'
    ];
    
    // Additional attributes that may be needed
    var additionalAttributes = [
      'gradientUnits',
      'gradientTransform',
      'patternUnits',
      'patternContentUnits',
      'clipPathUnits',
      'maskUnits',
      'maskContentUnits',
      'stop-color',
      'stop-opacity',
      'offset',
      'data-url',
      'data-listener-added'
    ];
    
    // Safely extend allowedTags
    if (Array.isArray(Highcharts.AST.allowedTags)) {
      additionalTags.forEach(function(tag) {
        if (Highcharts.AST.allowedTags.indexOf(tag) === -1) {
          Highcharts.AST.allowedTags.push(tag);
        }
      });
    }
    
    // Safely extend allowedAttributes
    if (Array.isArray(Highcharts.AST.allowedAttributes)) {
      additionalAttributes.forEach(function(attr) {
        if (Highcharts.AST.allowedAttributes.indexOf(attr) === -1) {
          Highcharts.AST.allowedAttributes.push(attr);
        }
      });
    }
    
    // Ensure dangerous event handlers are never allowed
    var dangerousAttributes = [
      'onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover',
      'onmouseout', 'onmousemove', 'onkeydown', 'onkeyup', 'onkeypress',
      'onfocus', 'onblur', 'onload', 'onerror', 'onchange', 'onsubmit'
    ];
    
    if (Array.isArray(Highcharts.AST.allowedAttributes)) {
      dangerousAttributes.forEach(function(attr) {
        var index = Highcharts.AST.allowedAttributes.indexOf(attr);
        if (index > -1) {
          Highcharts.AST.allowedAttributes.splice(index, 1);
        }
      });
    }
  }
  
  // Simple helper function for safe HTML - just returns the input as-is
  // Highcharts 12.x handles its own sanitization internally
  window.createSafeHTML = function(html) {
    if (!html || typeof html !== 'string') {
      return html || '';
    }
    // Just return the HTML - Highcharts will sanitize it internally
    return html;
  };
  
})();