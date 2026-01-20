/**
 * SPLIT-LAYER PARALLAX CONTROLLER
 * High-performance parallax system with split-layer architecture
 * Eliminates jitter with velocity damping and frame-rate limiting
 */

class SplitLayerParallax {
  constructor() {
    // Scroll state
    this.targetScroll = 0;
    this.currentScroll = 0;
    this.lastScrollY = 0;
    
    // Velocity tracking for inertial easing
    this.velocity = 0;
    this.acceleration = 0;
    this.maxVelocity = 30;
    this.friction = 0.92;
    this.elasticity = 0.1;
    
    // Easing configuration
    this.easingFactor = 0.05; // Smooth easing toward target
    
    // Layer management
    this.backgroundLayers = [];
    this.contentLayers = [];
    this.textLayers = [];
    this.allLayers = [];
    
    // Performance optimization
    this.isAnimating = false;
    this.lastTimestamp = 0;
    this.fps = 60;
    this.frameInterval = 1000 / this.fps; // ~16.67ms
    
    // Event management
    this.scrollTimeout = null;
    this.usePassiveEvents = true;
    
    // Lifecycle
    this.initialized = false;
    
    this.init();
  }
  
  /**
   * Initialize the parallax system
   */
  init() {
    if (this.initialized) return;
    
    try {
      // Collect all parallax elements
      this.collectLayers();
      
      // Setup scroll listener
      const scrollOptions = this.usePassiveEvents ? { passive: true } : false;
      window.addEventListener('scroll', this.handleScroll.bind(this), scrollOptions);
      
      // Start animation loop
      this.animate();
      
      // Listen for resize to recalculate layer positions
      window.addEventListener('resize', () => this.collectLayers(), scrollOptions);
      
      this.initialized = true;
      console.log('[SplitLayerParallax] Initialized with layers:', this.allLayers.length);
    } catch (error) {
      console.error('[SplitLayerParallax] Initialization error:', error);
    }
  }
  
  /**
   * Scroll event handler with RAF debouncing
   */
  handleScroll() {
    if (this.scrollTimeout) {
      window.cancelAnimationFrame(this.scrollTimeout);
    }
    
    this.scrollTimeout = window.requestAnimationFrame(() => {
      this.targetScroll = window.scrollY;
      
      if (!this.isAnimating) {
        this.isAnimating = true;
        this.lastTimestamp = performance.now();
        this.animate();
      }
    });
  }
  
  /**
   * Collect all parallax elements and categorize them
   */
  collectLayers() {
    this.backgroundLayers = [];
    this.contentLayers = [];
    this.textLayers = [];
    this.allLayers = [];
    
    // Background layers (slow parallax - 0.1 to 0.2 speed)
    const bgSelectors = ['[data-parallax-bg]', '.parallax-bg', '.background-layer', '.hero-background'];
    bgSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.dataset.parallaxId) {
          const speed = parseFloat(el.dataset.speed) || 0.15;
          const id = 'parallax_bg_' + this.allLayers.length;
          el.dataset.parallaxId = id;
          
          const layer = {
            element: el,
            speed: speed,
            id: id,
            type: 'background',
            originalTransform: el.style.transform || ''
          };
          
          this.backgroundLayers.push(layer);
          this.allLayers.push(layer);
        }
      });
    });
    
    // Content layers (medium parallax - 0.2 to 0.4 speed)
    const contentSelectors = ['[data-parallax-content]', '.parallax-content', '.section-container', '.card-grid'];
    contentSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.dataset.parallaxId) {
          const speed = parseFloat(el.dataset.speed) || 0.3;
          const id = 'parallax_content_' + this.allLayers.length;
          el.dataset.parallaxId = id;
          
          const layer = {
            element: el,
            speed: speed,
            id: id,
            type: 'content',
            originalTransform: el.style.transform || ''
          };
          
          this.contentLayers.push(layer);
          this.allLayers.push(layer);
        }
      });
    });
    
    // Text layers (fade only - no movement)
    const textSelectors = ['[data-parallax-text]', '.parallax-text', '.text-block'];
    textSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (!el.dataset.parallaxId) {
          const id = 'parallax_text_' + this.allLayers.length;
          el.dataset.parallaxId = id;
          
          const layer = {
            element: el,
            speed: 0,
            id: id,
            type: 'text',
            originalTransform: el.style.transform || ''
          };
          
          this.textLayers.push(layer);
          this.allLayers.push(layer);
        }
      });
    });
  }
  
  /**
   * Update velocity with acceleration/friction
   */
  updateVelocity() {
    const currentScrollY = window.scrollY;
    const rawVelocity = currentScrollY - this.lastScrollY;
    
    // Acceleration when velocity changes
    this.acceleration = rawVelocity - this.velocity;
    
    // Smooth velocity update
    this.velocity = this.velocity * this.friction + rawVelocity * (1 - this.friction);
    
    // Clamp velocity to prevent extreme values
    if (Math.abs(this.velocity) > this.maxVelocity) {
      this.velocity = this.maxVelocity * Math.sign(this.velocity);
    }
    
    this.lastScrollY = currentScrollY;
  }
  
  /**
   * Main animation loop with frame-rate limiting
   */
  animate(timestamp = performance.now()) {
    // Frame-rate limiting (60fps)
    const deltaTime = timestamp - this.lastTimestamp;
    
    if (deltaTime < this.frameInterval) {
      if (this.isAnimating) {
        window.requestAnimationFrame((t) => this.animate(t));
      }
      return;
    }
    
    this.lastTimestamp = timestamp - (deltaTime % this.frameInterval);
    
    // Update velocity based on scroll
    this.updateVelocity();
    
    // Calculate easing toward target scroll
    const diff = this.targetScroll - this.currentScroll;
    const inertia = this.velocity * 0.05; // Inertial component
    const damping = 0.05 + (Math.abs(diff) * 0.001); // Dynamic easing
    
    this.currentScroll += (diff * damping) + inertia;
    
    // Update all layer types
    this.updateBackgroundLayers();
    this.updateContentLayers();
    this.updateTextLayers();
    
    // Continue animation if there's meaningful movement
    const shouldContinue = Math.abs(diff) > 0.5 || Math.abs(this.velocity) > 0.1;
    
    if (shouldContinue) {
      window.requestAnimationFrame((t) => this.animate(t));
    } else {
      this.isAnimating = false;
    }
  }
  
  /**
   * Update background layers with slow parallax
   */
  updateBackgroundLayers() {
    this.backgroundLayers.forEach(layer => {
      if (!layer.element.isConnected) return;
      
      const yOffset = this.currentScroll * layer.speed * -0.5;
      
      layer.element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      layer.element.style.willChange = 'transform';
      layer.element.style.backfaceVisibility = 'hidden';
    });
  }
  
  /**
   * Update content layers with medium parallax
   */
  updateContentLayers() {
    this.contentLayers.forEach(layer => {
      if (!layer.element.isConnected) return;
      
      const yOffset = this.currentScroll * layer.speed * -0.3;
      
      layer.element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
      layer.element.style.willChange = 'transform';
      layer.element.style.backfaceVisibility = 'hidden';
    });
  }
  
  /**
   * Update text layers with opacity fade only
   */
  updateTextLayers() {
    const viewportHeight = window.innerHeight;
    const scrollProgress = Math.min(this.currentScroll / viewportHeight, 1);
    
    this.textLayers.forEach(layer => {
      if (!layer.element.isConnected) return;
      
      const opacity = 1 - (scrollProgress * 0.3);
      const scale = 0.95 + (scrollProgress * 0.05);
      
      layer.element.style.opacity = opacity;
      layer.element.style.transform = `translate3d(0, 0, 0) scale(${scale})`;
      layer.element.style.willChange = 'opacity, transform';
    });
  }
  
  /**
   * Cleanup and destroy the parallax system
   */
  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
    
    this.allLayers.forEach(layer => {
      if (layer.element.isConnected) {
        layer.element.style.transform = layer.originalTransform;
        layer.element.style.willChange = 'auto';
        delete layer.element.dataset.parallaxId;
      }
    });
    
    if (this.scrollTimeout) {
      window.cancelAnimationFrame(this.scrollTimeout);
    }
    
    this.allLayers = [];
    this.backgroundLayers = [];
    this.contentLayers = [];
    this.textLayers = [];
    this.isAnimating = false;
    this.initialized = false;
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Destroy existing instance if any
    if (window.parallaxSystem) {
      window.parallaxSystem.destroy();
    }
    
    // Create new instance
    window.parallaxSystem = new SplitLayerParallax();
    console.log('[Parallax] Split-layer system initialized');
  } catch (error) {
    console.error('[Parallax] Initialization failed:', error);
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.parallaxSystem) {
    window.parallaxSystem.destroy();
  }
});
