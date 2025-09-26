/**
 * Highcharts Security Configuration
 * This file helps prevent "Invalid attribute or tagName" errors
 * by configuring allowed HTML tags and attributes
 */

// Add custom allowed tags and attributes to Highcharts AST
if (typeof Highcharts !== 'undefined' && Highcharts.AST) {
  
  // Extend allowed tags
  Highcharts.AST.allowedTags = Highcharts.AST.allowedTags.concat([
    'image', // SVG image element
    'linearGradient', // Ensure correct spelling
    'radialGradient',
    'defs',
    'pattern',
    'clipPath'
  ]);

  // Extend allowed attributes (but NOT onclick for security)
  Highcharts.AST.allowedAttributes = Highcharts.AST.allowedAttributes.concat([
    'x', 'y', 'x1', 'y1', 'x2', 'y2', // Position attributes
    'width', 'height', // Size attributes
    'href', 'xlink:href', // Link attributes
    'gradientUnits', 'gradientTransform', // Gradient attributes
    'offset', 'stop-color', 'stop-opacity', // Stop attributes
    'patternUnits', 'patternContentUnits', // Pattern attributes
    'clipPathUnits', // Clip path attributes
    'data-url', 'data-listener-added' // Custom data attributes for safe event handling
  ]);

  // Explicitly block dangerous attributes (these should never be allowed)
  const blockedAttributes = ['onclick', 'onmouseover', 'onmouseout', 'onload', 'onerror', 'onfocus', 'onblur'];
  
  // Remove blocked attributes if they somehow get added
  blockedAttributes.forEach(attr => {
    const index = Highcharts.AST.allowedAttributes.indexOf(attr);
    if (index > -1) {
      Highcharts.AST.allowedAttributes.splice(index, 1);
    }
  });

  // Custom sanitizer function for better error handling
  const originalSanitize = Highcharts.AST.prototype.sanitize;
  Highcharts.AST.prototype.sanitize = function(element) {
    try {
      return originalSanitize.call(this, element);
    } catch (error) {
      console.warn('Highcharts sanitization warning:', error.message);
      // Return a safe fallback
      return { tagName: 'span', textContent: 'Content sanitized' };
    }
  };
}

// Global error handler for Highcharts
if (typeof Highcharts !== 'undefined') {
  Highcharts.addEvent(Highcharts.Chart, 'render', function() {
    // Check for any remaining sanitization issues
    const container = this.container;
    if (container) {
      // Remove any potentially problematic elements
      const unknownElements = container.querySelectorAll('[data-z-index]');
      unknownElements.forEach(el => {
        if (el.tagName && el.tagName.toLowerCase().includes('unknown')) {
          console.warn('Removing unknown element:', el.tagName);
          el.remove();
        }
      });
    }
  });
}

// Utility function to safely create HTML strings (compatible with older Highcharts)
window.createSafeHTML = function(html) {
  if (typeof Highcharts !== 'undefined' && Highcharts.AST && typeof Highcharts.AST.emptyHTML === 'function') {
    try {
      return Highcharts.AST.emptyHTML(html);
    } catch (error) {
      console.warn('Highcharts HTML sanitization failed:', error.message);
      return sanitizeHTMLFallback(html);
    }
  } else {
    // Fallback for older Highcharts versions
    return sanitizeHTMLFallback(html);
  }
};

// Fallback HTML sanitization function
function sanitizeHTMLFallback(html) {
  if (!html || typeof html !== 'string') {
    return html;
  }
  
  // Create a temporary div to safely parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove any script tags and event attributes
  const scripts = tempDiv.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove dangerous attributes
  const dangerousAttributes = ['onclick', 'onmouseover', 'onmouseout', 'onload', 'onerror', 'onfocus', 'onblur', 'onchange'];
  const allElements = tempDiv.querySelectorAll('*');
  
  allElements.forEach(element => {
    dangerousAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
        console.warn(`Removed dangerous attribute ${attr} from ${element.tagName}`);
      }
    });
  });
  
  return tempDiv.innerHTML;
}

// Initialize security configuration
if (typeof Highcharts !== 'undefined') {
  if (!Highcharts.AST || typeof Highcharts.AST.emptyHTML !== 'function') {
    console.warn('Highcharts AST security features not available - using fallback sanitization');
  }
}