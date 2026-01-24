/**
 * PRODUCTION SCROLL CONTROLLER - LOCKED SYSTEM
 * Single source of truth - eliminates elastic banding forever
 * NO direct scrollY access - virtual timeline only
 */

class ProductionScrollController {
  constructor() {
    // Virtual timeline - THE source of truth
    this.targetScroll = 0;      // Where we want to be
    this.currentScroll = 0;     // Where we are (animated)
    this.maxScroll = 0;         // Document max scroll
    
    // Physics (critically tuned for premium feel)
    this.easing = 0.07;         // Smooth interpolation
    this.damping = 0.85;        // Boundary damping multiplier
    this.threshold = 0.05;      // Stop threshold
    this.boundaryZone = 150;    // Pixels from edge where damping increases
    
    // State tracking
    this.isAtTop = true;
    this.isAtBottom = false;
    this.isScrolling = false;
    this.lastScrollTime = 0;
    this.scrollTimeout = null;
    
    // RAF management
    this.rafId = null;
    this.lastTimestamp = 0;
    
    // Touch tracking for boundary detection
    this.lastTouchY = 0;
    
    // Subscribers
    this.parallaxSubscribers = [];
    this.animationSubscribers = [];
    
    this.init();
  }
  
  init() {
    try {
      this.calculateMaxScroll();
      
      // CRITICAL: Change from passive to active to allow preventDefault
      window.addEventListener('scroll', this.handleScroll.bind(this), {
        passive: false,
        capture: false
      });
      
      // Intercept wheel events to prevent elastic bounce
      window.addEventListener('wheel', this.handleWheel.bind(this), {
        passive: false,
        capture: false
      });
      
      // Intercept touch events to prevent elastic bounce on mobile
      window.addEventListener('touchmove', this.handleTouchMove.bind(this), {
        passive: false,
        capture: false
      });
      
      // Handle resize
      window.addEventListener('resize', this.handleResize.bind(this));
      
      // Start animation loop
      this.startAnimation();
      
      console.log('✅ Production Scroll Controller: Initialized (with boundary interception)');
    } catch (error) {
      console.error('❌ Scroll Controller failed:', error);
    }
  }
  
  handleWheel(e) {
    // Get current scroll position
    const currentY = window.scrollY;
    const maxScroll = this.maxScroll;
    
    // If at top and scrolling up, or at bottom and scrolling down, prevent
    if ((currentY <= 0 && e.deltaY < 0) || (currentY >= maxScroll && e.deltaY > 0)) {
      e.preventDefault();
      return;
    }
  }
  
  handleTouchMove(e) {
    // Get current scroll position
    const currentY = window.scrollY;
    const maxScroll = this.maxScroll;
    
    // Calculate movement (0, 0) is always at start, so we check if would go out of bounds
    // Get the first touch point
    const touch = e.touches[0];
    const movementY = this.lastTouchY - touch.clientY;
    this.lastTouchY = touch.clientY;
    
    // If at boundaries and trying to move further
    if ((currentY <= 0 && movementY > 0) || (currentY >= maxScroll && movementY < 0)) {
      e.preventDefault();
      return;
    }
  }
  
  handleScroll() {
    const rawScroll = window.scrollY;
    const maxScroll = this.maxScroll;
    
    // CRITICAL: If browser scrolled past boundaries (elastic bounce), force it back
    if (rawScroll < 0 || rawScroll > maxScroll) {
      window.scrollTo(0, Math.max(0, Math.min(rawScroll, maxScroll)));
      return;
    }
    
    // Apply boundary-aware clamping (NO ELASTIC BAND)
    this.targetScroll = this.clampWithDamping(rawScroll);
    
    // Update states
    this.updateBoundaryStates();
    
    // Mark as scrolling
    this.isScrolling = true;
    this.lastScrollTime = Date.now();
    
    // Reset flag after inactivity
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 100);
    
    // Ensure animation loop runs
    if (!this.rafId) {
      this.startAnimation();
    }
  }
  
  clampWithDamping(rawScroll) {
    // Hard clamp to prevent overflow
    let clamped = Math.max(0, Math.min(rawScroll, this.maxScroll));
    
    // Calculate distances from boundaries
    const distanceFromTop = clamped;
    const distanceFromBottom = this.maxScroll - clamped;
    
    // Apply extra damping near top
    if (distanceFromTop < this.boundaryZone) {
      const progress = distanceFromTop / this.boundaryZone;
      const easedProgress = Math.pow(progress, 2); // Quadratic easing
      clamped = clamped * easedProgress;
    }
    
    // Apply extra damping near bottom
    if (distanceFromBottom < this.boundaryZone) {
      const progress = distanceFromBottom / this.boundaryZone;
      const easedProgress = Math.pow(progress, 2);
      clamped = this.maxScroll - ((this.maxScroll - clamped) * easedProgress);
    }
    
    return clamped;
  }
  
  updateBoundaryStates() {
    this.isAtTop = this.targetScroll <= 1;
    this.isAtBottom = this.targetScroll >= (this.maxScroll - 1);
  }
  
  startAnimation() {
    const animate = () => {
      const diff = this.targetScroll - this.currentScroll;
      
      // Apply easing with boundary awareness
      let ease = this.easing;
      if (this.isAtTop || this.isAtBottom) {
        ease *= this.damping; // Stronger damping at boundaries
      }
      
      this.currentScroll += diff * ease;
      
      // Hard snap at boundaries
      if (this.isAtTop && Math.abs(this.currentScroll) < 0.5) {
        this.currentScroll = 0;
      }
      if (this.isAtBottom && Math.abs(this.currentScroll - this.maxScroll) < 0.5) {
        this.currentScroll = this.maxScroll;
      }
      
      // Update all subscribers
      this.updateParallax();
      this.updateAnimations();
      
      // Continue or stop
      if (Math.abs(diff) > this.threshold || this.isScrolling) {
        this.rafId = requestAnimationFrame(animate);
      } else {
        this.rafId = null;
      }
    };
    
    this.rafId = requestAnimationFrame(animate);
  }
  
  updateParallax() {
    this.parallaxSubscribers.forEach(sub => {
      if (!sub.element?.isConnected) return;
      
      const offset = this.currentScroll * sub.speed * -1;
      if (sub.axis === 'x') {
        sub.element.style.transform = `translate3d(${offset}px, 0, 0)`;
      } else {
        sub.element.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
  }
  
  updateAnimations() {
    this.animationSubscribers.forEach(sub => {
      if (!sub.element?.isConnected) return;
      
      const rect = sub.element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * sub.threshold;
      
      if (isVisible && !sub.element.classList.contains('animated')) {
        sub.element.classList.add('animated', `animate-${sub.animation}`);
      }
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
    this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.maxScroll));
    this.currentScroll = Math.max(0, Math.min(this.currentScroll, this.maxScroll));
  }
  
  getCurrentScroll() {
    return this.currentScroll;
  }
  
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    clearTimeout(this.scrollTimeout);
  }
}

// Global initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ScrollController = new ProductionScrollController();
  });
} else {
  window.ScrollController = new ProductionScrollController();
}
