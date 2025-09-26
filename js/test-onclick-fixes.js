/**
 * Test file to verify onclick security fixes
 * Run this in browser console after loading the page
 */

// Test function to verify the fixes work
function testOnclickFixes() {
  console.group('🧪 Testing onclick security fixes...');
  
  // Test 1: Check if the credits function no longer generates onclick
  console.log('Test 1: Credits function onclick check');
  try {
    // Temporarily set REF if not available
    if (typeof REF === 'undefined') {
      window.REF = { chartId: 'test' };
    }
    
    // Test the credits function
    if (typeof credits === 'function') {
      const creditsHTML = credits();
      console.log('Credits HTML generated:', creditsHTML);
      
      if (creditsHTML.includes('onclick')) {
        console.error('❌ FAIL: Credits still contains onclick attribute');
      } else {
        console.log('✅ PASS: Credits no longer contains onclick attribute');
      }
      
      // Test if it's safe for Highcharts
      if (typeof testHTMLSafety === 'function') {
        testHTMLSafety(creditsHTML);
      }
      
      // Test createSafeHTML function
      if (typeof createSafeHTML === 'function') {
        const testHTML = '<b>Test</b> with <span>formatting</span>';
        const safeHTML = createSafeHTML(testHTML);
        console.log('createSafeHTML test - Input:', testHTML);
        console.log('createSafeHTML test - Output:', safeHTML);
      }
    } else {
      console.warn('Credits function not available for testing');
    }
  } catch (e) {
    console.error('Error testing credits:', e.message);
  }
  
  // Test 2: Check if event listeners are properly attached
  console.log('\\nTest 2: Event listener attachment');
  setTimeout(() => {
    const links = document.querySelectorAll('[id^="dataset-link-"]');
    console.log(`Found ${links.length} dataset links`);
    
    links.forEach((link, i) => {
      if (link.hasAttribute('data-listener-added')) {
        console.log(`✅ Link ${i + 1}: Event listener attached`);
      } else {
        console.warn(`⚠️ Link ${i + 1}: Event listener not yet attached`);
      }
    });
  }, 200);
  
  // Test 3: Scan for any remaining onclick issues
  console.log('\\nTest 3: Full onclick scan');
  if (typeof scanForOnclickIssues === 'function') {
    scanForOnclickIssues();
  }
  
  console.groupEnd();
}

// Auto-run if debug mode is enabled
if (typeof DEBUG_HIGHCHARTS !== 'undefined' && DEBUG_HIGHCHARTS) {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testOnclickFixes);
  } else {
    setTimeout(testOnclickFixes, 1000);
  }
}

console.log('🧪 Onclick security test functions loaded. Run testOnclickFixes() to test manually.');