/**
 * PRODUCTION SCROLL CONTROLLER
 * Single source of truth for all scroll-driven animations
 * Virtual timeline architecture - NO direct window.scrollY usage
 */

class ProductionScrollController {
  constructor() {
    // Virtual timeline - the source of truth
    this.targetScroll = 0;      // Where we want to be
    this.currentScroll = 0;     // Where we are (animated)
    this.maxScroll = 0;         // Document max scroll
    
    // Physics tuning (critically damped for premium feel)
    this.easing = 0.07;         // Smooth interpolation
    this.damping = 0.85;        // Boundary damping multiplier
    this.threshold = 0.05;      // Stop threshold
    this.boundaryZone = 100;    // Pixels from edge where damping increases
    
    // State tracking
    this.isAtTop = true;
    this.isAtBottom = false;
    this.isNearBoundary = false;
    this.isScrolling = false;
    this.lastScrollTime = 0;
    this.scrollTimeout = null;
    
    // RAF management
    this.rafId = null;
    this.lastTimestamp = 0;
    
    // Subscribers for parallax and animations
    this.parallaxSubscribers = [];
    this.animationSubscribers = [];
    
    // Debug mode
    this.debugMode = window.location.search.includes('debug=scroll');
    
    this.init();
  }
  
  init() {
    try {
      this.calculateMaxScroll();
      
      // Single passive scroll listener - no blocking
      window.addEventListener('scroll', this.handleScroll.bind(this), {
        passive: true,
        capture: false
      });
      
      // Handle window resize
      window.addEventListener('resize', this.handleResize.bind(this));
      
      // Collect subscribers
      this.collectSubscribers();
      
      // Start animation loop
      this.startAnimationLoop();
      
      // Dispatch ready event
      document.dispatchEvent(new CustomEvent('scrollController:ready', {
        detail: { controller: this }
      }));
      
      if (this.debugMode) {
        console.log('✅ Production Scroll Controller initialized');
      }
    } catch (error) {
      console.error('❌ Scroll Controller init failed:', error);
    }
  }
  
  handleScroll() {
    const rawScroll = window.scrollY;
    
    // Apply boundary-aware clamping
    this.targetScroll = this.clampWithDamping(rawScroll);
    
    // Update boundary states
    this.updateBoundaryStates();
    
    // Mark as scrolling
    this.isScrolling = true;
    this.lastScrollTime = Date.now();
    
    // Reset scrolling flag after 100ms of inactivity
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 100);
    
    // Ensure animation loop is running
    if (!this.rafId) {
      this.startAnimationLoop();
    }
  }
  
  clampWithDamping(rawScroll) {
    // Hard clamp to document boundaries
    const hardClamped = Math.max(0, Math.min(rawScroll, this.maxScroll));
    
    // Calculate distances from boundaries
    const distanceFromTop = hardClamped;
    const distanceFromBottom = this.maxScroll - hardClamped;
    
    // Check if near boundary
    this.isNearBoundary = distanceFromTop < this.boundaryZone || 
                         distanceFromBottom < this.boundaryZone;
    
    // Apply extra damping near top
    if (distanceFromTop < this.boundaryZone) {
      const progress = distanceFromTop / this.boundaryZone;
      const easedProgress = Math.pow(progress, 2); // Quadratic easing
      return hardClamped * easedProgress;
    }
    
    // Apply extra damping near bottom
    if (distanceFromBottom < this.boundaryZone) {
      const progress = distanceFromBottom / this.boundaryZone;
      const easedProgress = Math.pow(progress, 2);
      return this.maxScroll - ((this.maxScroll - hardClamped) * easedProgress);
    }
    
    return hardClamped;
  }
  
  updateBoundaryStates() {
    this.isAtTop = this.targetScroll <= 0;
    this.isAtBottom = this.targetScroll >= this.maxScroll;
  }
  
  startAnimationLoop() {
    const animate = (timestamp) => {
      // Calculate frame delta time
      const deltaTime = this.lastTimestamp ? timestamp - this.lastTimestamp : 16;
      this.lastTimestamp = timestamp;
      
      // Calculate boundary-aware easing
      let currentEasing = this.easing;
      if (this.isNearBoundary) {
        currentEasing *= this.damping;
      }
      
      // Ease toward target (frame-rate independent)
      const diff = this.targetScroll - this.currentScroll;
      this.currentScroll += diff * currentEasing * (deltaTime / 16);
      
      // Hard snap at boundaries when close
      if (this.isAtTop && Math.abs(this.currentScroll) < 1) {
        this.currentScroll = 0;
      }
      if (this.isAtBottom && Math.abs(this.currentScroll - this.maxScroll) < 1) {
        this.currentScroll = this.maxScroll;
      }
      
      // Update all subscribers
      this.updateSubscribers();
      
      // Continue or stop animation
      const shouldContinue = Math.abs(diff) > this.threshold || 
                            this.isScrolling || 
                            (Date.now() - this.lastScrollTime < 100);
      
      if (shouldContinue) {
        this.rafId = requestAnimationFrame(animate);
      } else {
        this.rafId = null;
        this.lastTimestamp = 0;
      }
    };
    
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(animate);
    }
  }
  
  collectSubscribers() {
    // Parallax elements
    document.querySelectorAll('[data-parallax]').forEach(el => {
      this.parallaxSubscribers.push({
        element: el,
        speed: parseFloat(el.dataset.parallaxSpeed) || 0.1,
        axis: el.dataset.parallaxAxis || 'y',
        originalTransform: el.style.transform || ''
      });
    });
    
    // Animation subscribers
    document.querySelectorAll('[data-animate-on-scroll]').forEach(el => {
      this.animationSubscribers.push({
        element: el,
        threshold: parseFloat(el.dataset.animateThreshold) || 0.5,
        animation: el.dataset.animateType || 'fade-up'
      });
    });
  }
  
  updateSubscribers() {
    // Update parallax elements
    this.parallaxSubscribers.forEach(sub => {
      if (!sub.element.isConnected) return;
      
      try {
        const offset = this.currentScroll * sub.speed * -1;
        
        if (sub.axis === 'x') {
          sub.element.style.transform = `translate3d(${offset}px, 0, 0) ${sub.originalTransform}`;
        } else {
          sub.element.style.transform = `translate3d(0, ${offset}px, 0) ${sub.originalTransform}`;
        }
        
        sub.element.style.willChange = 'transform';
      } catch (e) {}
    });
    
    // Update animation elements
    this.animationSubscribers.forEach(sub => {
      if (!sub.element.isConnected) return;
      
      try {
        const rect = sub.element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementVisible = elementTop < viewportHeight * sub.threshold;
        
        if (elementVisible && !sub.element.classList.contains('animated')) {
          sub.element.classList.add('animated', `animate-${sub.animation}`);
        }
      } catch (e) {}
    });
  }
  
  calculateMaxScroll() {
    const body = document.body;
    const html = document.documentElement;
    
    this.maxScroll = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    ) - window.innerHeight;
    
    this.maxScroll = Math.max(0, this.maxScroll);
  }
  
  handleResize() {
    this.calculateMaxScroll();
    
    // Re-clamp current position
    this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.maxScroll));
    this.currentScroll = Math.max(0, Math.min(this.currentScroll, this.maxScroll));
  }
  
  // Public API
  getCurrentScroll() {
    return this.currentScroll;
  }
  
  getTargetScroll() {
    return this.targetScroll;
  }
  
  scrollTo(position, duration = 1000) {
    const start = this.currentScroll;
    const distance = position - start;
    let startTime = null;
    
    const animateScroll = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // EaseInOutCubic
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      this.targetScroll = start + (distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }
  
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    clearTimeout(this.scrollTimeout);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }
}

// Global initialization
(() => {
  function initScrollController() {
    try {
      // Destroy existing controller if any
      if (window.scrollController) {
        window.scrollController.destroy();
      }
      
      // Initialize new controller
      window.scrollController = new ProductionScrollController();
    } catch (error) {
      console.error('❌ Scroll Controller failed:', error);
    }
  }
  
  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollController);
  } else {
    initScrollController();
  }
})();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.scrollController) {
    window.scrollController.destroy();
  }
});
