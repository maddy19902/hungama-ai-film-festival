/**
 * HUNGAMA FESTIVAL - ANIMATION UTILITIES & ENHANCEMENTS
 * 
 * This file provides additional utilities and debugging for animations
 */

// Performance monitoring for animations
const AnimationPerformance = {
  startTime: performance.now(),
  
  log(message, value = '') {
    const elapsed = (performance.now() - this.startTime).toFixed(2);
    console.log(`[${elapsed}ms] 🎬 ${message}`, value);
  },
  
  check() {
    this.log('✓ prefers-reduced-motion:', 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'REDUCED' : 'ENABLED');
    
    this.log('✓ Intersection Observer:', 
      'IntersectionObserver' in window ? 'SUPPORTED' : 'NOT SUPPORTED');
    
    this.log('✓ RequestAnimationFrame:',
      'requestAnimationFrame' in window ? 'SUPPORTED' : 'NOT SUPPORTED');
    
    this.log('✓ CSS Backdrop-filter:',
      CSS.supports('backdrop-filter', 'blur(10px)') ? 'SUPPORTED' : 'FALLBACK');
    
    // Count animated elements
    const animatedCount = document.querySelectorAll('[data-animate]').length;
    const parallaxCount = document.querySelectorAll('[data-parallax]').length;
    this.log(`✓ Animated elements: ${animatedCount}`);
    this.log(`✓ Parallax elements: ${parallaxCount}`);
  }
};

// Ensure animations work on page load even if scripts load late
window.addEventListener('load', () => {
  // Re-apply animation observer after all content loads
  if (window.HUNGAMA && window.HUNGAMA.animations && window.HUNGAMA.animations.enableAnimations) {
    const animateElements = document.querySelectorAll('[data-animate]:not(.animate-in)');
    if (animateElements.length > 0) {
      // Force trigger animations for visible elements
      animateElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('animate-in');
        }
      });
    }
  }
});

// Export diagnostics
if (typeof window !== 'undefined') {
  window.HUNGAMA = window.HUNGAMA || {};
  window.HUNGAMA.performance = AnimationPerformance;
}
