/**
 * INERTIAL PARALLAX SYSTEM - CINEMATIC MOTION
 * Virtual timeline model with easing factor
 * NO bounce, smooth continuous motion
 * GPU-accelerated with translate3d
 */

class InertialParallax {
  constructor() {
    this.targetScroll = 0;
    this.currentScroll = 0;
    this.easingFactor = 0.08; // Inertial feel (lower = smoother but slower)
    this.layers = [];
    this.rafId = null;
    this.ticking = false;
    this.mobileMode = window.innerWidth < 768;
    this.mobileEasingFactor = 0.06; // Slightly smoother on mobile
    
    this.init();
  }

  init() {
    // Collect parallax layers
    this.collectLayers();
    
    // Set up scroll listener
    this.setupScrollListener();
    
    // Start animation loop
    this.startAnimationLoop();
    
    // Handle mobile detection
    window.addEventListener('resize', () => {
      const wasMobile = this.mobileMode;
      this.mobileMode = window.innerWidth < 768;
      if (wasMobile !== this.mobileMode) {
        console.log(`[Inertial Parallax] Mobile mode: ${this.mobileMode}`);
      }
    }, { passive: true });
    
    console.log('[Inertial Parallax] Initialized - No bounce, smooth easing');
  }

  collectLayers() {
    // Collect elements with parallax data attributes
    document.querySelectorAll('[data-parallax], [data-card-parallax]').forEach(el => {
      const speedAttr = el.getAttribute('data-parallax-speed');
      const cardSpeed = el.getAttribute('data-card-parallax');
      const speed = parseFloat(speedAttr) || parseFloat(cardSpeed) || 0.2;
      
      this.layers.push({
        element: el,
        speed: speed,
        type: el.getAttribute('data-parallax') || 'card'
      });
    });
    
    console.log(`[Inertial Parallax] Found ${this.layers.length} layers`);
  }

  setupScrollListener() {
    let lastTime = Date.now();
    
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          // Update target with current scroll position
          this.updateTarget(window.scrollY);
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });
  }

  updateTarget(scrollY) {
    // Store target without immediately applying it
    this.targetScroll = scrollY;
    
    // Ensure animation loop is running
    if (!this.rafId) {
      this.startAnimationLoop();
    }
  }

  startAnimationLoop() {
    const animate = () => {
      // INERTIAL EASING: Smooth approach to target (NO SNAPPING)
      const easing = this.mobileMode ? this.mobileEasingFactor : this.easingFactor;
      const diff = this.targetScroll - this.currentScroll;
      this.currentScroll += diff * easing;
      
      // Update all layers with eased scroll value
      this.updateLayers();
      
      // Continue animation (don't stop at target, maintain fluidity)
      this.rafId = requestAnimationFrame(animate);
    };
    
    this.rafId = requestAnimationFrame(animate);
  }

  updateLayers() {
    // All layers use currentScroll (eased), NEVER direct window.scrollY
    this.layers.forEach(layer => {
      const offset = this.currentScroll * layer.speed;
      
      // GPU-accelerated transform (translate3d for hardware acceleration)
      layer.element.style.transform = `translate3d(0, ${-offset}px, 0)`;
    });
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

// GLOBAL INSTANCE
let inertialParallax = null;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  inertialParallax = new InertialParallax();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (inertialParallax) {
    inertialParallax.destroy();
  }
});
