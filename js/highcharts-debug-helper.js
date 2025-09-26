/**
 * Highcharts Error Debugging Helper
 * This script helps identify and debug "Invalid attribute or tagName" errors
 */

// Enable debug mode for development
const DEBUG_HIGHCHARTS = true;

if (DEBUG_HIGHCHARTS && typeof console !== 'undefined') {
  
  // Override console.error and console.warn to catch Highcharts sanitization errors
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = function(...args) {
    const message = args.join(' ');
    
    if (message.includes('Invalid attribute') || message.includes('tagName')) {
      console.group('🔍 Highcharts Sanitization Error Debug');
      console.error('Original error:', ...args);
      
      // Try to extract the problematic tag/attribute
      const tagMatch = message.match(/tagName[:\s]+([^\s,]+)/i);
      const attrMatch = message.match(/attribute[:\s]+([^\s,]+)/i);
      
      if (tagMatch) {
        console.warn('Problematic tag:', tagMatch[1]);
        console.info('💡 Solution: Add this tag to allowedTags in highcharts-security-config.js');
      }
      
      if (attrMatch) {
        console.warn('Problematic attribute:', attrMatch[1]);
        console.info('💡 Solution: Add this attribute to allowedAttributes in highcharts-security-config.js');
        
        // Special handling for onclick
        if (attrMatch[1].toLowerCase() === 'onclick') {
          console.error('🚨 SECURITY ISSUE: onclick attribute detected!');
          console.info('🔧 FIX: Replace onclick with proper event listeners. See basics.js fix as example.');
        }
      }
      
      // Show current stack trace to help identify source
      console.trace('Error origin');
      console.groupEnd();
    }
    
    // Call original console.error
    originalError.apply(console, args);
  };

  // Also catch warnings (Highcharts sometimes uses warnings instead of errors)
  console.warn = function(...args) {
    const message = args.join(' ');
    
    if (message.includes('Highcharts warning') && message.includes('onclick')) {
      console.group('⚠️ Highcharts Security Warning Debug');
      console.warn('Original warning:', ...args);
      console.error('🚨 onclick attribute detected in chart configuration!');
      console.info('🔧 FIX: Remove onclick attributes and use proper event listeners instead.');
      console.info('📝 Check your chart configuration for any onclick attributes in:');
      console.info('   - tooltip.formatter return values');
      console.info('   - dataLabels.formatter return values'); 
      console.info('   - credits text');
      console.info('   - any other HTML strings passed to Highcharts');
      console.trace('Warning origin');
      console.groupEnd();
    }
    
    // Call original console.warn
    originalWarn.apply(console, args);
  };
  
  // Add a helper function to check chart configuration
  window.debugChartConfig = function(chartOptions) {
    console.group('📊 Chart Configuration Debug');
    
    // Check for common issues
    const issues = [];
    
    // Check tooltip formatter
    if (chartOptions.tooltip && typeof chartOptions.tooltip.formatter === 'function') {
      try {
        // Test with dummy data
        const testPoint = {
          name: 'Test Point',
          y: 100,
          percentage: 50,
          color: '#000'
        };
        const result = chartOptions.tooltip.formatter.call({ point: testPoint, points: [testPoint], x: 'Test' });
        console.log('Tooltip test result:', result);
      } catch (e) {
        issues.push('Tooltip formatter error: ' + e.message);
      }
    }
    
    // Check series data
    if (chartOptions.series) {
      chartOptions.series.forEach((series, index) => {
        if (series.dataLabels && series.dataLabels.formatter) {
          try {
            const testResult = series.dataLabels.formatter.call({
              point: { name: 'Test', y: 100, percentage: 50 }
            });
            console.log(`Series ${index} dataLabels test:`, testResult);
          } catch (e) {
            issues.push(`Series ${index} dataLabels formatter error: ` + e.message);
          }
        }
      });
    }
    
    if (issues.length > 0) {
      console.warn('Found issues:', issues);
    } else {
      console.info('✅ No obvious configuration issues found');
    }
    
    console.groupEnd();
    return issues;
  };
  
  console.log('🛠️ Highcharts debugging helper loaded');
}

// Function to safely test HTML content (compatible with older Highcharts)
window.testHTMLSafety = function(htmlString) {
  if (typeof Highcharts !== 'undefined' && Highcharts.AST && typeof Highcharts.AST.emptyHTML === 'function') {
    try {
      const result = Highcharts.AST.emptyHTML(htmlString);
      console.log('✅ HTML is safe (Highcharts AST):', result);
      return true;
    } catch (error) {
      console.error('❌ HTML is not safe (Highcharts AST):', error.message);
      console.info('Original HTML:', htmlString);
      return false;
    }
  } else {
    // Fallback test for older Highcharts versions
    console.log('ℹ️ Using fallback HTML safety test (Highcharts AST not available)');
    
    // Basic safety checks
    const dangerousPatterns = [
      /onclick\s*=/i,
      /onmouseover\s*=/i,
      /onmouseout\s*=/i,
      /onload\s*=/i,
      /onerror\s*=/i,
      /<script/i,
      /javascript:/i
    ];
    
    const isDangerous = dangerousPatterns.some(pattern => pattern.test(htmlString));
    
    if (isDangerous) {
      console.warn('❌ HTML contains potentially dangerous content:', htmlString);
      return false;
    } else {
      console.log('✅ HTML appears safe (basic check):', htmlString);
      return true;
    }
  }
};

// Function to scan for onclick attributes in your codebase
window.scanForOnclickIssues = function() {
  console.group('🔍 Scanning for onclick security issues...');
  
  const issues = [];
  
  // Check all script tags for onclick in string literals
  const scripts = document.getElementsByTagName('script');
  for (let script of scripts) {
    if (script.src && script.src.includes('js/')) {
      // This is one of your JS files - would need server-side scanning
      console.info(`📁 To scan ${script.src}, check the file manually for onclick attributes`);
    }
  }
  
  // Check DOM for any elements with onclick
  const elementsWithOnclick = document.querySelectorAll('[onclick]');
  if (elementsWithOnclick.length > 0) {
    console.warn(`Found ${elementsWithOnclick.length} DOM elements with onclick attributes:`);
    elementsWithOnclick.forEach((el, i) => {
      console.warn(`${i + 1}. ${el.tagName}:`, el);
      issues.push(`DOM element ${el.tagName} has onclick attribute`);
    });
  }
  
  // Test common HTML strings that might be used in charts
  const testStrings = [
    'Test with <span onclick="alert()">click</span>',
    'Safe <b>bold text</b>',
    '<tspan onclick="window.open()">link</tspan>'
  ];
  
  testStrings.forEach((str, i) => {
    console.log(`Testing string ${i + 1}: "${str}"`);
    if (!testHTMLSafety(str)) {
      issues.push(`Test string ${i + 1} failed safety check`);
    }
  });
  
  if (issues.length === 0) {
    console.log('✅ No obvious onclick security issues found');
  } else {
    console.warn('❌ Found potential security issues:', issues);
  }
  
  console.groupEnd();
  return issues;
};