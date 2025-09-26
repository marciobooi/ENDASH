/**
 * Highcharts Compatibility Shim
 * Provides missing functions for older Highcharts versions
 */

// Add missing AST functionality for older Highcharts versions
if (typeof Highcharts !== 'undefined' && (!Highcharts.AST || !Highcharts.AST.emptyHTML)) {
  
  // Initialize AST object if it doesn't exist
  if (!Highcharts.AST) {
    Highcharts.AST = {};
  }
  
  // Add emptyHTML function if missing
  if (!Highcharts.AST.emptyHTML) {
    Highcharts.AST.emptyHTML = function(html) {
      // Simple fallback implementation
      if (!html || typeof html !== 'string') {
        return html;
      }
      
      // Remove script tags and dangerous attributes
      let sanitized = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/\son\w+\s*=\s*[^>\s]+/gi, '');
      
      return sanitized;
    };
  }
  
  // Add allowedTags if missing
  if (!Highcharts.AST.allowedTags) {
    Highcharts.AST.allowedTags = [
      'a', 'abbr', 'b', 'br', 'button', 'caption', 'circle', 'code', 'dd', 'defs',
      'div', 'dl', 'dt', 'em', 'g', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i',
      'img', 'li', 'linearGradient', 'ol', 'p', 'path', 'span', 'stop', 'strong',
      'style', 'sub', 'sup', 'svg', 'table', 'text', 'tbody', 'td', 'tspan', 'th',
      'thead', 'title', 'tr', 'u', 'ul', 'image'
    ];
  }
  
  // Add allowedAttributes if missing
  if (!Highcharts.AST.allowedAttributes) {
    Highcharts.AST.allowedAttributes = [
      'alt', 'aria-describedby', 'aria-hidden', 'aria-label', 'aria-labelledby',
      'aria-live', 'class', 'clip-path', 'color', 'colspan', 'cx', 'cy', 'd',
      'dx', 'dy', 'fill', 'fillOpacity', 'height', 'href', 'id', 'opacity', 'r',
      'role', 'rowspan', 'rx', 'ry', 'stroke', 'stroke-linecap', 'stroke-width',
      'style', 'tabindex', 'text-anchor', 'title', 'transform', 'valign', 'width',
      'x', 'x1', 'x2', 'xlink:href', 'y', 'y1', 'y2', 'zIndex'
    ];
  }
}