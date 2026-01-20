/**
 * ELASTIC-FREE PARALLAX CONTROLLER
 * Single source of truth - eliminates bounce forever
 * Production-grade virtual timeline system
 */

class ElasticFreeParallax {
  constructor() {
    // Virtual timeline - NEVER uses raw scrollY
    this.targetScroll = 0;
    this.currentScroll = 0;
    this.maxScroll = 0;
    
    // CRITICAL: Boundary damping parameters
    this.easing = 0.07;
    this.damping = 0.15; // Increased damping at boundaries
    this.threshold = 0.05;
    
    // Boundary detection
    this.isAtTop = true;
    this.isAtBottom = false;
    this.isNearBoundary = false;
    this.boundaryZone = 100; // Pixels from edge where damping increases
    
    // Scroll state
    this.isScrolling = false;
    this.scrollTimeout = null;
    
    // Layer management
    this.layers = new Map();
    this.layerGroups = {
      background: [],
      midground: [],
      foreground: [],
      text: []
    };
    
    // Animation
    this.rafId = null;
    this.lastTime = 0;
    this.isPaused = false;
    
    // Debug mode
    this.debugMode = window.location.search.includes('debug=parallax');
    
    this.init();
  }
  
  init() {
    try {
      this.calculateMaxScroll();
      
      // SINGLE scroll listener - passive for performance
      window.addEventListener('scroll', this.handleScroll.bind(this), { 
        passive: true,
        capture: false
      });
      
      // Handle resize
      window.addEventListener('resize', this.handleResize.bind(this));
      
      // Initial layer collection
      this.collectLayers();
      
      // Start the animation loop
      this.startAnimation();
      
      if (this.debugMode) {
        console.log('🚀 ElasticFreeParallax initialized with boundary zone:', this.boundaryZone);
      }
    } catch (error) {
      console.error('❌ ElasticFreeParallax init failed:', error);
    }
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
  
  handleScroll() {
    if (this.isPaused) return;
    
    const rawScroll = window.scrollY;
    
    // CRITICAL: Apply boundary clamping BEFORE setting target
    const clampedScroll = this.clampWithDamping(rawScroll);
    this.targetScroll = clampedScroll;
    
    // Update boundary states
    this.updateBoundaryStates();
    
    // Mark as scrolling
    this.isScrolling = true;
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 150);
    
    // Ensure animation is running
    if (!this.rafId) {
      this.startAnimation();
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
    
    // Apply damping when near top
    if (distanceFromTop < this.boundaryZone) {
      const progress = distanceFromTop / this.boundaryZone;
      const easedProgress = progress * progress; // Quadratic easing
      return hardClamped * easedProgress;
    }
    
    // Apply damping when near bottom
    if (distanceFromBottom < this.boundaryZone) {
      const progress = distanceFromBottom / this.boundaryZone;
      const easedProgress = progress * progress;
      return this.maxScroll - ((this.maxScroll - hardClamped) * easedProgress);
    }
    
    return hardClamped;
  }
  
  updateBoundaryStates() {
    const prevAtTop = this.isAtTop;
    const prevAtBottom = this.isAtBottom;
    
    this.isAtTop = this.targetScroll <= 0;
    this.isAtBottom = this.targetScroll >= this.maxScroll;
    
    // Update UI classes
    if (this.isAtTop && !prevAtTop) {
      document.body.classList.add('at-scroll-top');
    } else if (!this.isAtTop && prevAtTop) {
      document.body.classList.remove('at-scroll-top');
    }
    
    if (this.isAtBottom && !prevAtBottom) {
      document.body.classList.add('at-scroll-bottom');
    } else if (!this.isAtBottom && prevAtBottom) {
      document.body.classList.remove('at-scroll-bottom');
    }
  }
  
  startAnimation() {
    const animate = (timestamp) => {
      if (this.isPaused) {
        this.rafId = requestAnimationFrame(animate);
        return;
      }
      
      // Calculate frame delta time
      const deltaTime = this.lastTime ? timestamp - this.lastTime : 16;
      this.lastTime = timestamp;
      
      // CRITICAL: Boundary-aware easing
      let currentEasing = this.easing;
      
      // Increase damping at boundaries to eliminate bounce
      if (this.isNearBoundary) {
        currentEasing *= this.damping;
      }
      
      // Apply easing with boundary damping
      const diff = this.targetScroll - this.currentScroll;
      this.currentScroll += diff * currentEasing;
      
      // CRITICAL: Hard snap at boundaries when close enough
      if (this.isAtTop && Math.abs(this.currentScroll) < 0.5) {
        this.currentScroll = 0;
      }
      
      if (this.isAtBottom && Math.abs(this.currentScroll - this.maxScroll) < 0.5) {
        this.currentScroll = this.maxScroll;
      }
      
      // Update all layers
      this.updateLayers();
      
      // Stop animation when at target AND not scrolling
      if (Math.abs(diff) < this.threshold && !this.isScrolling) {
        this.rafId = null;
        return;
      }
      
      // Continue animation
      this.rafId = requestAnimationFrame(animate);
    };
    
    this.rafId = requestAnimationFrame(animate);
  }
  
  collectLayers() {
    // Clear existing
    Object.keys(this.layerGroups).forEach(key => {
      this.layerGroups[key] = [];
    });
    
    // Collect all parallax layers
    document.querySelectorAll('[data-parallax-layer]').forEach(el => {
      const type = el.dataset.parallaxLayer || 'background';
      const speed = parseFloat(el.dataset.parallaxSpeed) || this.getDefaultSpeed(type);
      
      const layer = {
        element: el,
        type: type,
        speed: speed
      };
      
      if (this.layerGroups[type]) {
        this.layerGroups[type].push(layer);
      }
    });
    
    if (this.debugMode) {
      console.log('📊 Layers collected:', {
        background: this.layerGroups.background.length,
        midground: this.layerGroups.midground.length,
        foreground: this.layerGroups.foreground.length,
        text: this.layerGroups.text.length
      });
    }
  }
  
  getDefaultSpeed(type) {
    const speeds = {
      'background': 0.1,
      'midground': 0.2,
      'foreground': 0.3,
      'text': 0
    };
    return speeds[type] || 0.15;
  }
  
  updateLayers() {
    // Update each layer type with boundary-aware transforms
    this.layerGroups.background.forEach(layer => this.updateBackgroundLayer(layer));
    this.layerGroups.midground.forEach(layer => this.updateMidgroundLayer(layer));
    this.layerGroups.foreground.forEach(layer => this.updateForegroundLayer(layer));
    this.layerGroups.text.forEach(layer => this.updateTextLayer(layer));
  }
  
  updateBackgroundLayer(layer) {
    if (!layer.element.isConnected) return;
    
    try {
      // Slowest movement with boundary damping
      let yOffset = this.currentScroll * layer.speed * -0.3;
      
      // Apply extra damping near boundaries
      if (this.isNearBoundary) {
        yOffset *= 0.5;
      }
      
      layer.element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
    } catch (e) {}
  }
  
  updateMidgroundLayer(layer) {
    if (!layer.element.isConnected) return;
    
    try {
      // Medium movement
      let yOffset = this.currentScroll * layer.speed * -0.5;
      
      if (this.isNearBoundary) {
        yOffset *= 0.7;
      }
      
      layer.element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
    } catch (e) {}
  }
  
  updateForegroundLayer(layer) {
    if (!layer.element.isConnected) return;
    
    try {
      // Normal movement
      let yOffset = this.currentScroll * layer.speed * -0.8;
      
      if (this.isNearBoundary) {
        yOffset *= 0.9;
      }
      
      layer.element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
    } catch (e) {}
  }
  
  updateTextLayer(layer) {
    if (!layer.element.isConnected) return;
    
    try {
      // No parallax for text, only opacity/scale
      const scrollProgress = this.currentScroll / window.innerHeight;
      const opacity = Math.max(0.8, 1 - (scrollProgress * 0.3));
      const scale = 0.95 + (scrollProgress * 0.05);
      
      layer.element.style.opacity = opacity;
      layer.element.style.transform = `scale(${scale})`;
    } catch (e) {}
  }
  
  handleResize() {
    this.calculateMaxScroll();
    this.collectLayers();
  }
  
  pause() {
    this.isPaused = true;
  }
  
  resume() {
    this.isPaused = false;
    if (!this.rafId) {
      this.startAnimation();
    }
  }
  
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    // Reset transforms
    Object.values(this.layerGroups).forEach(group => {
      group.forEach(layer => {
        try {
          layer.element.style.transform = '';
          layer.element.style.opacity = '';
        } catch (e) {}
      });
    });
  }
}

// GLOBAL INITIALIZATION WITH ERROR HANDLING
(() => {
  function initParallax() {
    try {
      // Clean up any existing systems
      if (window.parallaxController) {
        window.parallaxController.destroy();
      }
      
      // Initialize new system
      window.parallaxController = new ElasticFreeParallax();
      
      // Dispatch ready event
      const event = new CustomEvent('elasticFreeParallaxReady', { 
        detail: { controller: window.parallaxController } 
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error('💥 Parallax initialization failed:', error);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
  } else {
    initParallax();
  }
})();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.parallaxController) {
    window.parallaxController.destroy();
  }
});
