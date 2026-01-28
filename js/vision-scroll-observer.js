/**
 * VISION PAGE SCROLL OBSERVER
 * Handles scroll-linked reveals for timeline
 */

class VisionScrollObserver {
  constructor() {
    this.timelineItems = document.querySelectorAll('.vision-item');
    this.observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };
    
    this.init();
  }
  
  init() {
    try {
      if (!this.timelineItems.length) {
        return;
      }
      
      const observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        this.observerOptions
      );
      
      this.timelineItems.forEach(item => {
        observer.observe(item);
      });
      
      if (window.location.search.includes('debug=vision')) {
        console.log('✅ Vision Scroll Observer initialized');
        console.log('Timeline items:', this.timelineItems.length);
      }
    } catch (error) {
      console.error('❌ Vision Scroll Observer failed:', error);
    }
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add 'in-view' class to trigger animation
        entry.target.classList.add('in-view');
      }
    });
  }
}

// Global initialization
(() => {
  function initVisionObserver() {
    try {
      if (window.visionScrollObserver) {
        return;
      }
      
      window.visionScrollObserver = new VisionScrollObserver();
    } catch (error) {
      console.error('❌ Vision Observer init failed:', error);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisionObserver);
  } else {
    initVisionObserver();
  }
})();
