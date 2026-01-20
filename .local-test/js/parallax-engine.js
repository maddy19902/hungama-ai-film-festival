/**
 * PARALLAX ENGINE
 * Automatic layer registration and speed management
 * Works with ProductionScrollController
 */

class ParallaxEngine {
  constructor(scrollController) {
    this.scrollController = scrollController;
    
    // Layer definitions with responsive speeds
    this.layers = {
      background: {
        selector: '.parallax-bg',
        desktopSpeed: 0.08,
        tabletSpeed: 0.06,
        mobileSpeed: 0.04,
        maxOffset: 120
      },
      midground: {
        selector: '.parallax-mid',
        desktopSpeed: 0.15,
        tabletSpeed: 0.12,
        mobileSpeed: 0.08,
        maxOffset: 120
      },
      foreground: {
        selector: '.parallax-fg',
        desktopSpeed: 0.25,
        tabletSpeed: 0.18,
        mobileSpeed: 0.12,
        maxOffset: 120
      }
    };
    
    // Responsive state
    this.breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: Infinity
    };
    
    this.currentBreakpoint = this.detectBreakpoint();
    this.elements = [];
    
    // Debug mode
    this.debugMode = window.location.search.includes('debug=parallax');
    
    this.init();
  }
  
  init() {
    try {
      // Register all parallax elements
      this.registerElements();
      
      // Subscribe to scroll controller
      if (this.scrollController && this.scrollController.parallaxSubscribers) {
        this.scrollController.parallaxSubscribers.push({
          element: null,
          update: this.updateLayers.bind(this)
        });
      }
      
      // Handle responsive changes
      window.addEventListener('resize', this.handleResize.bind(this));
      
      // Listen for dynamically added parallax elements
      const observer = new MutationObserver(() => {
        this.registerElements();
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      if (this.debugMode) {
        console.log('✅ Parallax Engine initialized with', this.elements.length, 'elements');
      }
    } catch (error) {
      console.error('❌ Parallax Engine init failed:', error);
    }
  }
  
  registerElements() {
    const registered = new Set();
    
    Object.entries(this.layers).forEach(([layerKey, layerConfig]) => {
      document.querySelectorAll(layerConfig.selector).forEach(element => {
        // Skip if already registered
        const id = element.id || element.className;
        if (registered.has(id)) return;
        registered.add(id);
        
        // Get custom speed if provided
        const customSpeed = element.dataset.parallaxSpeed;
        const speed = customSpeed ? parseFloat(customSpeed) : this.getSpeed(layerKey);
        
        // Store element with config
        this.elements.push({
          element,
          layerKey,
          baseSpeed: speed,
          maxOffset: layerConfig.maxOffset,
          originalTransform: element.style.transform || '',
          originalZ: element.style.zIndex || 'auto'
        });
        
        // Ensure GPU acceleration
        element.style.transform = element.style.transform || 'translateZ(0)';
        element.style.willChange = 'transform';
      });
    });
  }
  
  getSpeed(layerKey) {
    const layer = this.layers[layerKey];
    if (!layer) return 0.1;
    
    switch (this.currentBreakpoint) {
      case 'mobile':
        return layer.mobileSpeed;
      case 'tablet':
        return layer.tabletSpeed;
      default:
        return layer.desktopSpeed;
    }
  }
  
  detectBreakpoint() {
    const width = window.innerWidth;
    if (width < this.breakpoints.mobile) return 'mobile';
    if (width < this.breakpoints.tablet) return 'tablet';
    return 'desktop';
  }
  
  handleResize() {
    const newBreakpoint = this.detectBreakpoint();
    
    if (newBreakpoint !== this.currentBreakpoint) {
      this.currentBreakpoint = newBreakpoint;
      
      // Update speeds for new breakpoint
      this.elements.forEach(item => {
        item.baseSpeed = this.getSpeed(item.layerKey);
      });
      
      if (this.debugMode) {
        console.log(`📱 Breakpoint changed to: ${newBreakpoint}`);
      }
    }
  }
  
  updateLayers(currentScroll) {
    if (!currentScroll && currentScroll !== 0) {
      currentScroll = this.scrollController.getCurrentScroll();
    }
    
    this.elements.forEach(item => {
      try {
        if (!item.element.isConnected) return;
        
        // Calculate parallax offset with clamping
        let offset = currentScroll * item.baseSpeed * -1;
        offset = Math.max(-item.maxOffset, Math.min(item.maxOffset, offset));
        
        // Apply transform
        item.element.style.transform = `translate3d(0, ${offset}px, 0)`;
        
        // Schedule removal if off-screen by large amount
        const rect = item.element.getBoundingClientRect();
        if (rect.top > window.innerHeight * 3 || rect.bottom < -window.innerHeight * 3) {
          item.element.style.willChange = 'auto';
        } else {
          item.element.style.willChange = 'transform';
        }
      } catch (e) {
        // Element may have been removed
      }
    });
  }
  
  // Register a new parallax element on the fly
  addElement(element, layerKey = 'midground', customSpeed = null) {
    const speed = customSpeed || this.getSpeed(layerKey);
    
    this.elements.push({
      element,
      layerKey,
      baseSpeed: speed,
      maxOffset: this.layers[layerKey].maxOffset,
      originalTransform: element.style.transform || '',
      originalZ: element.style.zIndex || 'auto'
    });
    
    element.style.transform = element.style.transform || 'translateZ(0)';
    element.style.willChange = 'transform';
    
    return element;
  }
  
  // Remove element from parallax system
  removeElement(element) {
    this.elements = this.elements.filter(item => item.element !== element);
    element.style.willChange = 'auto';
    element.style.transform = '';
  }
  
  // Get current parallax state for an element
  getElementState(element) {
    const item = this.elements.find(i => i.element === element);
    if (!item) return null;
    
    const scroll = this.scrollController.getCurrentScroll();
    const offset = scroll * item.baseSpeed * -1;
    
    return {
      currentScroll: scroll,
      speed: item.baseSpeed,
      offset: Math.max(-item.maxOffset, Math.min(item.maxOffset, offset)),
      layer: item.layerKey
    };
  }
  
  // Debug visualization
  toggleDebugMode() {
    this.debugMode = !this.debugMode;
    
    if (this.debugMode) {
      this.elements.forEach((item, index) => {
        item.element.style.outline = '2px dashed rgba(255, 0, 0, 0.5)';
        item.element.dataset.parallaxDebugIndex = index;
      });
      console.log('🔍 Parallax debug mode ON');
    } else {
      this.elements.forEach(item => {
        item.element.style.outline = '';
        delete item.element.dataset.parallaxDebugIndex;
      });
      console.log('🔍 Parallax debug mode OFF');
    }
  }
  
  // Statistics
  getStats() {
    return {
      totalElements: this.elements.length,
      currentBreakpoint: this.currentBreakpoint,
      avgSpeed: this.elements.reduce((sum, el) => sum + el.baseSpeed, 0) / this.elements.length || 0,
      scrollProgress: this.scrollController.getCurrentScroll() / this.scrollController.maxScroll
    };
  }
}

// Global initialization
(() => {
  function initParallaxEngine() {
    try {
      // Wait for scroll controller
      if (!window.scrollController) {
        setTimeout(initParallaxEngine, 100);
        return;
      }
      
      // Destroy existing engine if any
      if (window.parallaxEngine) {
        window.parallaxEngine.destroy();
      }
      
      // Initialize parallax engine
      window.parallaxEngine = new ParallaxEngine(window.scrollController);
    } catch (error) {
      console.error('❌ Parallax Engine failed:', error);
    }
  }
  
  // Wait for DOM and scroll controller
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallaxEngine);
  } else {
    initParallaxEngine();
  }
})();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.parallaxEngine) {
    window.parallaxEngine.destroy = () => {};
  }
});
