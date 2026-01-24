/**
 * Autoscroll System for Sponsor Rails
 * Provides smooth auto-scroll with manual control capability
 */

class SponsorRailScroller {
  constructor(railSelector, options = {}) {
    this.rail = document.querySelector(railSelector);
    if (!this.rail) return;

    this.scrollSpeed = options.scrollSpeed || 1; // pixels per frame
    this.autoScrollEnabled = true;
    this.isPaused = false;
    this.direction = 1; // 1 for right, -1 for left
    this.animationId = null;

    this.init();
  }

  init() {
    // Check if scrolling is needed
    if (this.rail.scrollWidth <= this.rail.clientWidth) {
      return; // No scroll needed
    }

    // Enable scroll behavior
    this.rail.style.overflowX = 'auto';
    this.rail.style.scrollBehavior = 'smooth';

    // Add scroll indicators
    this.addScrollIndicators();

    // Start auto-scroll
    this.startAutoScroll();

    // Add event listeners
    this.rail.addEventListener('mouseenter', () => this.pauseAutoScroll());
    this.rail.addEventListener('mouseleave', () => this.resumeAutoScroll());
    
    // Touch events for mobile
    this.rail.addEventListener('touchstart', () => this.pauseAutoScroll());
    this.rail.addEventListener('touchend', () => this.resumeAutoScroll());

    // Wheel event for manual scroll
    this.rail.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Horizontal scroll detected
        this.pauseAutoScroll();
        setTimeout(() => this.resumeAutoScroll(), 3000); // Resume after 3 seconds of inactivity
      }
    });

    // Listen for scroll changes
    this.rail.addEventListener('scroll', () => this.onScroll());
  }

  addScrollIndicators() {
    const indicator = document.createElement('div');
    indicator.className = 'sponsor-rail-scroll-indicator';
    indicator.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      background: linear-gradient(to right, #dc2626, #991b1b);
      transition: width 0.2s ease;
      z-index: 10;
    `;
    this.rail.parentElement.style.position = 'relative';
    this.rail.parentElement.appendChild(indicator);
    this.indicator = indicator;
  }

  updateScrollIndicator() {
    if (!this.indicator || this.rail.scrollWidth <= this.rail.clientWidth) return;
    const scrollPercentage = this.rail.scrollLeft / (this.rail.scrollWidth - this.rail.clientWidth);
    this.indicator.style.width = (scrollPercentage * 100) + '%';
  }

  startAutoScroll() {
    const scrollStep = () => {
      if (!this.isPaused && this.autoScrollEnabled) {
        const maxScroll = this.rail.scrollWidth - this.rail.clientWidth;
        const currentScroll = this.rail.scrollLeft;

        // Check bounds
        if (currentScroll >= maxScroll) {
          this.direction = -1;
        } else if (currentScroll <= 0) {
          this.direction = 1;
        }

        this.rail.scrollLeft += this.scrollSpeed * this.direction;
      }

      this.animationId = requestAnimationFrame(scrollStep);
    };

    scrollStep();
  }

  pauseAutoScroll() {
    this.isPaused = true;
  }

  resumeAutoScroll() {
    this.isPaused = false;
  }

  stopAutoScroll() {
    this.autoScrollEnabled = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  onScroll() {
    this.updateScrollIndicator();
  }
}

/**
 * Initialize all sponsor rail scrollers
 */
document.addEventListener('DOMContentLoaded', () => {
  // Check if page has sponsor rails
  const rails = document.querySelectorAll('.sponsor-rail');
  
  rails.forEach((rail, index) => {
    new SponsorRailScroller(`.sponsor-rail:nth-of-type(${index + 1})`, {
      scrollSpeed: 0.5
    });
  });

  // Alternative: Initialize by class if sponsor-rail class is used
  document.querySelectorAll('[data-sponsor-rail]').forEach((rail) => {
    const railSelector = `.${rail.className.split(' ')[0]}`;
    new SponsorRailScroller(railSelector, {
      scrollSpeed: 0.5
    });
  });
});

// Export for manual initialization if needed
if (typeof window !== 'undefined') {
  window.SponsorRailScroller = SponsorRailScroller;
}
