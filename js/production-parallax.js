/**
 * PRODUCTION-GRADE PARALLAX CONTROLLER
 * Single source of truth for all scroll-driven animations
 * Eliminates elastic banding, jitter, and sync issues
 */

class ProductionParallaxController {
  constructor() {
    // Virtual timeline - NEVER use window.scrollY directly
    this.targetScroll = 0;
    this.currentScroll = 0;
    this.maxScroll = 0;
    
    // Physics parameters (tuned for premium feel)
    this.easing = 0.08; // Critically damped easing
    this.velocity = 0;
    this.friction = 0.92;
    this.threshold = 0.01;
    
    // Layer management
    this.backgroundLayers = [];
    this.midgroundLayers = [];
    this.foregroundLayers = [];
    this.textLayers = [];
    
    // Performance
    this.rafId = null;
    this.lastTime = 0;
    this.isActive = true;
    this.isScrolling = false;
    this.scrollTimeout = null;
    
    // Boundary clamping
    this.isAtTop = true;
    this.isAtBottom = false;
    
    // Debug mode
    this.debugMode = window.location.search.includes('debug=parallax');
    
    this.init();
  }
  
  init() {
    try {
      // Calculate max scroll once
      this.calculateMaxScroll();
      
      // Single passive scroll listener
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
      
      // Handle resize
      window.addEventListener('resize', this.handleResize.bind(this));
      
      // Collect all parallax layers
      this.collectLayers();
      
      // Start animation loop
      this.startAnimationLoop();
      
      // Initial sync
      this.syncToScroll();
      
      if (this.debugMode) {
        console.log('✅ Production Parallax initialized');
        console.log('📊 Layers:', {
          background: this.backgroundLayers.length,
          midground: this.midgroundLayers.length,
          foreground: this.foregroundLayers.length,
          text: this.textLayers.length
        });
      }
    } catch (error) {
      console.error('❌ Parallax initialization failed:', error);
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
    
    // Clamp to prevent elastic banding
    this.maxScroll = Math.max(0, this.maxScroll);
  }
  
  handleScroll() {
    // Only update targetScroll - NO transforms here
    const rawScroll = window.scrollY;
    
    // CRITICAL: Clamp to boundaries to eliminate elastic banding
    this.targetScroll = Math.max(0, Math.min(rawScroll, this.maxScroll));
    
    // Update boundary states
    this.isAtTop = this.targetScroll <= 0;
    this.isAtBottom = this.targetScroll >= this.maxScroll;
    
    // Start animation if not running
    if (!this.rafId) {
      this.startAnimationLoop();
    }
    
    this.isScrolling = true;
    
    // Reset scrolling flag after delay
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 100);
  }
  
  handleResize() {
    this.calculateMaxScroll();
    
    // Re-clamp current position
    this.targetScroll = Math.max(0, Math.min(this.targetScroll, this.maxScroll));
    this.currentScroll = Math.max(0, Math.min(this.currentScroll, this.maxScroll));
    
    // Re-collect layers (DOM might have changed)
    this.collectLayers();
  }
  
  collectLayers() {
    // Clear existing layers
    this.backgroundLayers = [];
    this.midgroundLayers = [];
    this.foregroundLayers = [];
    this.textLayers = [];
    
    // Categorize all parallax elements
    document.querySelectorAll('[data-parallax-layer]').forEach(el => {
      const layerType = el.dataset.parallaxLayer;
      const speed = parseFloat(el.dataset.parallaxSpeed) || this.getDefaultSpeed(layerType);
      
      const layer = {
        element: el,
        speed: speed,
        originalTransform: el.style.transform || ''
      };
      
      switch(layerType) {
        case 'background':
          this.backgroundLayers.push(layer);
          break;
        case 'midground':
          this.midgroundLayers.push(layer);
          break;
        case 'foreground':
          this.foregroundLayers.push(layer);
          break;
        case 'text':
          this.textLayers.push(layer);
          break;
      }
    });
  }
  
  getDefaultSpeed(layerType) {
    const speeds = {
      'background': 0.15,
      'midground': 0.3,
      'foreground': 0.45,
      'text': 0
    };
    return speeds[layerType] || 0.3;
  }
  
  startAnimationLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    
    let frameCount = 0;
    let lastSecond = 0;
    let fps = 60;
    
    const animate = (timestamp) => {
      // FPS monitoring
      frameCount++;
      if (timestamp - lastSecond >= 1000) {
        fps = frameCount;
        if (this.debugMode && fps < 50) {
          console.warn(`⚠️ Low FPS: ${fps}`);
        }
        frameCount = 0;
        lastSecond = timestamp;
      }
      
      // Calculate delta time for frame-independent animation
      const deltaTime = this.lastTime ? timestamp - this.lastTime : 16;
      this.lastTime = timestamp;
      
      // CRITICAL: Virtual timeline easing with boundary damping
      const diff = this.targetScroll - this.currentScroll;
      
      // Apply stronger damping at boundaries to eliminate elastic effect
      let easingFactor = this.easing;
      if (this.isAtTop || this.isAtBottom) {
        easingFactor *= 0.5; // Reduce easing near boundaries
      }
      
      this.currentScroll += diff * easingFactor;
      
      // Apply friction to velocity
      this.velocity *= this.friction;
      
      // Stop animation when close enough to target AND not scrolling
      const isAtTarget = Math.abs(diff) < this.threshold;
      
      if (isAtTarget && !this.isScrolling) {
        // Snap to exact position at boundaries
        if (this.isAtTop) this.currentScroll = 0;
        if (this.isAtBottom) this.currentScroll = this.maxScroll;
        
        // Final update
        this.updateLayers();
        
        this.rafId = null;
        return;
      }
      
      // Update all layers from single currentScroll value
      this.updateLayers();
      
      // Continue loop
      this.rafId = requestAnimationFrame(animate);
    };
    
    this.rafId = requestAnimationFrame(animate);
  }
  
  updateLayers() {
    // Update each layer type with appropriate transforms
    this.updateLayerGroup(this.backgroundLayers, 0.5); // Slowest
    this.updateLayerGroup(this.midgroundLayers, 0.75); // Medium
    this.updateLayerGroup(this.foregroundLayers, 1); // Normal
    
    // Text layers: fade/scale only, no parallax
    this.updateTextLayers();
  }
  
  updateLayerGroup(layers, intensity) {
    layers.forEach(layer => {
      if (!layer.element.isConnected) return;
      
      try {
        // Calculate offset based on layer speed and current scroll
        const yOffset = this.currentScroll * layer.speed * intensity * -1;
        
        // Use transform3d for GPU acceleration
        layer.element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        layer.element.style.willChange = 'transform';
        
        // Force hardware acceleration
        layer.element.style.backfaceVisibility = 'hidden';
        layer.element.style.perspective = '1000px';
      } catch (e) {
        // Silently fail if element is removed
      }
    });
  }
  
  updateTextLayers() {
    this.textLayers.forEach(layer => {
      if (!layer.element.isConnected) return;
      
      try {
        // Text elements: scale only (no opacity manipulation to prevent visibility issues)
        const scrollProgress = this.currentScroll / window.innerHeight;
        const scale = 0.98 + (scrollProgress * 0.02);
        
        // Force opacity to 1 - parallax shouldn't hide text
        layer.element.style.opacity = '1';
        layer.element.style.transform = `scale(${scale})`;
      } catch (e) {
        // Silently fail if element is removed
      }
    });
  }
  
  syncToScroll() {
    this.targetScroll = window.scrollY;
    this.currentScroll = window.scrollY;
    this.updateLayers();
  }
  
  // Clean up
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
    }
    
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    
    // Reset all transforms
    [...this.backgroundLayers, ...this.midgroundLayers, ...this.foregroundLayers, ...this.textLayers]
      .forEach(layer => {
        try {
          layer.element.style.transform = layer.originalTransform;
          layer.element.style.willChange = 'auto';
        } catch (e) {
          // Silently fail
        }
      });
    
    if (this.debugMode) {
      console.log('🧹 Parallax destroyed');
    }
  }
}

// Initialize globally with error handling
document.addEventListener('DOMContentLoaded', () => {
  // Clean up any existing parallax systems
  if (window.parallaxController) {
    window.parallaxController.destroy();
  }
  
  try {
    window.parallaxController = new ProductionParallaxController();
    
    // Dispatch custom event for other systems to know parallax is ready
    const event = new CustomEvent('parallaxReady', { detail: { controller: window.parallaxController } });
    document.dispatchEvent(event);
  } catch (error) {
    console.error('❌ Parallax initialization failed:', error);
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.parallaxController) {
    window.parallaxController.destroy();
  }
});
