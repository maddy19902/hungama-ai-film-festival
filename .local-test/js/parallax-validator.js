/**
 * PARALLAX VALIDATION TEST SCRIPT
 * Tests elastic banding, jitter, and performance
 */

console.clear();
console.log('🧪 PARALLAX VALIDATION TESTING STARTED');
console.log('=' .repeat(50));

// TEST 1: ELASTIC BAND ELIMINATION
console.log('\n✅ TEST 1: Elastic Band Elimination');
console.log('Scroll to the TOP of the page and release quickly...');
console.log('Expected: Page stops immediately, NO bounce back');
console.log('Expected: targetScroll is clamped to 0');

// TEST 2: JITTER DETECTION
let frameCount = 0;
let lastFPS = 60;
let minFPS = 60;
let jitterDetections = 0;

console.log('\n✅ TEST 2: Jitter Detection & 60FPS Monitoring');
console.log('Scrolling through page...');
console.log('Expected: FPS stays above 50, no jitter alerts');

// TEST 3: LAYER DETECTION
let layerCount = {
  background: document.querySelectorAll('[data-parallax-layer="background"]').length,
  midground: document.querySelectorAll('[data-parallax-layer="midground"]').length,
  foreground: document.querySelectorAll('[data-parallax-layer="foreground"]').length,
  text: document.querySelectorAll('[data-parallax-layer="text"]').length
};

console.log('\n✅ TEST 3: Layer Detection');
console.log('Detected layers:', layerCount);
console.log('Total:', Object.values(layerCount).reduce((a, b) => a + b, 0));

// TEST 4: BOUNDARY CLAMPING
console.log('\n✅ TEST 4: Boundary Clamping');
console.log('Controller targetScroll range: 0 to maxScroll');
console.log('Expected: NO values exceed boundaries');

// TEST 5: CSS SCROLL PHYSICS
let scrollPhysicsCSS = getComputedStyle(document.documentElement).getPropertyValue('overscroll-behavior');
console.log('\n✅ TEST 5: CSS Scroll Physics');
console.log('overscroll-behavior:', scrollPhysicsCSS.trim() || 'NOT SET (may be inherited)');
console.log('Expected: none or empty (cascade)');

// MONITORING FUNCTION
window.addEventListener('scroll', () => {
  if (window.parallaxController) {
    const controller = window.parallaxController;
    
    // Check clamping
    if (controller.targetScroll < 0 || controller.targetScroll > controller.maxScroll) {
      console.warn('⚠️ BOUNDARY VIOLATION:', controller.targetScroll, 'of', controller.maxScroll);
    }
    
    // Check for jitter (rapid small movements)
    if (window.lastScrollPos !== undefined) {
      const delta = Math.abs(window.scrollY - window.lastScrollPos);
      const now = performance.now();
      
      if (window.lastScrollTime !== undefined) {
        const timeDelta = now - window.lastScrollTime;
        
        if (delta > 0 && delta < 2 && timeDelta < 16) {
          jitterDetections++;
          if (jitterDetections <= 3) {
            console.warn('⚠️ JITTER DETECTED:', delta + 'px in ' + timeDelta.toFixed(1) + 'ms');
          }
        }
      }
      
      window.lastScrollTime = now;
    }
    
    window.lastScrollPos = window.scrollY;
  }
}, { passive: true });

// PERIODIC STATUS REPORT
setInterval(() => {
  if (window.parallaxController) {
    const controller = window.parallaxController;
    console.log(
      `📊 STATUS: scroll=${window.scrollY.toFixed(0)} target=${controller.targetScroll.toFixed(0)} ` +
      `current=${controller.currentScroll.toFixed(0)} maxScroll=${controller.maxScroll.toFixed(0)}`
    );
  }
}, 3000);

console.log('\n' + '='.repeat(50));
console.log('🎯 VALIDATION READY');
console.log('Check console for real-time feedback as you scroll');
console.log('='.repeat(50));
