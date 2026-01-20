/**
 * MAIN ENTRY POINT - PRODUCTION SYSTEM INITIALIZATION
 * Orchestrates all scroll, parallax, and animation systems
 * Zero terminal dependency - works standalone on any server
 */

class HungamaProductionSystem {
  constructor() {
    this.isInitialized = false;
    this.isMobile = window.innerWidth < 768;
    this.pageLoadTime = performance.now();
    
    // Performance monitoring
    this.metrics = {
      fps: 0,
      lastFrameTime: performance.now(),
      frameCount: 0
    };
    
    this.init();
  }
  
  init() {
    if (this.isInitialized) return;
    
    this.setupScrollSystems();
    this.setupIntersectionObserver();
    this.setupScrollProgress();
    this.setupPageTransitions();
    this.setupResponsiveHandling();
    this.setupPerformanceMonitoring();
    
    this.isInitialized = true;
    console.log('✅ Hungama Production System: Ready');
  }
  
  setupScrollSystems() {
    // Wait for scroll controller to initialize
    const checkScrollController = setInterval(() => {
      if (window.ScrollController && window.ParallaxEngine) {
        clearInterval(checkScrollController);
        console.log('✅ Scroll systems active');
        this.setupScrollAnimations();
      }
    }, 100);
    
    setTimeout(() => clearInterval(checkScrollController), 5000);
  }
  
  setupScrollAnimations() {
    // Connect scroll events to animation triggers
    let lastScrollTime = Date.now();
    
    window.addEventListener('scroll', () => {
      const now = Date.now();
      if (now - lastScrollTime > 16) { // ~60fps throttle
        this.triggerScrollAnimations();
        lastScrollTime = now;
      }
    }, { passive: true });
  }
  
  triggerScrollAnimations() {
    const scrollY = window.ScrollController?.currentScroll || window.scrollY;
    
    // Emit custom scroll events for page-specific handlers
    document.dispatchEvent(new CustomEvent('productionScroll', {
      detail: { scrollY, scrollPercent: this.getScrollPercent() }
    }));
  }
  
  getScrollPercent() {
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - windowHeight;
    return window.ScrollController 
      ? (window.ScrollController.currentScroll / docHeight) * 100 
      : 0;
  }
  
  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger entry animations
          entry.target.classList.add('is-in-view');
          entry.target.style.animation = `stagger-up 0.8s ${this.getStaggerDelay(entry.target)}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both`;
          
          // Optional: unobserve after animation
          if (entry.target.dataset.unobserveOnce === 'true') {
            observer.unobserve(entry.target);
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all elements with lazy-load class
    document.querySelectorAll('.lazy-load, [data-animate-in]').forEach(el => {
      observer.observe(el);
    });
  }
  
  getStaggerDelay(element) {
    // Calculate stagger based on position in parent
    const parent = element.parentElement;
    if (!parent) return 0;
    
    const children = Array.from(parent.children);
    const index = children.indexOf(element);
    return index * 50; // 50ms between each element
  }
  
  setupScrollProgress() {
    // Create scroll progress indicator if not exists
    if (!document.getElementById('scroll-progress')) {
      const progress = document.createElement('div');
      progress.id = 'scroll-progress';
      progress.className = 'scroll-progress-bar';
      progress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1);
        width: 0%;
        z-index: 10000;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        opacity: 0.9;
      `;
      document.body.appendChild(progress);
    }
    
    window.addEventListener('scroll', () => {
      const scrollPercent = this.getScrollPercent();
      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
      }
    }, { passive: true });
  }
  
  setupPageTransitions() {
    // Add page transition effects on navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      
      // Skip external links and anchors
      if (href?.startsWith('http') || href?.startsWith('mailto')) return;
      if (href?.startsWith('#')) return;
      
      // Animate page exit
      e.preventDefault();
      
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
    
    // Animate page entrance
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.animatePageEntrance();
      });
    } else {
      this.animatePageEntrance();
    }
  }
  
  animatePageEntrance() {
    document.body.style.opacity = '0';
    
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      document.body.style.opacity = '1';
    });
  }
  
  setupResponsiveHandling() {
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < 768;
      
      if (wasMobile !== this.isMobile) {
        console.log(`📱 Responsive: ${this.isMobile ? 'Mobile' : 'Desktop'} mode`);
        
        // Trigger responsive recalculation
        if (window.ParallaxEngine) {
          window.ParallaxEngine.setupResponsive();
        }
      }
    });
  }
  
  setupPerformanceMonitoring() {
    // Optional: FPS counter for debugging
    const monitorFPS = () => {
      const now = performance.now();
      const delta = now - this.metrics.lastFrameTime;
      this.metrics.fps = Math.round(1000 / delta);
      this.metrics.lastFrameTime = now;
      this.metrics.frameCount++;
      
      // Log FPS every 60 frames
      if (this.metrics.frameCount % 60 === 0 && location.search.includes('debug')) {
        console.log(`FPS: ${this.metrics.fps}`);
      }
      
      requestAnimationFrame(monitorFPS);
    };
    
    if (location.search.includes('debug')) {
      requestAnimationFrame(monitorFPS);
    }
  }
  
  // Public API for page-specific customization
  registerScrollTrigger(selector, callback) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(el => {
      el.addEventListener('productionScroll', (e) => {
        callback(e.detail);
      });
    });
  }
  
  registerEntranceAnimation(selector, animationName) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = animationName;
          observer.unobserve(entry.target);
        }
      });
    });
    
    document.querySelectorAll(selector).forEach(el => {
      observer.observe(el);
    });
  }
}

/* ================================
   VISIBILITY GUARANTEE SYSTEM
   ================================ */

function forceVisibility() {
  const html = document.documentElement;
  const body = document.body;

  html.classList.remove('page-load');
  html.classList.add('page-loaded');

  body.style.opacity = '1';
  body.style.visibility = 'visible';
  body.style.transform = 'none';

  body.classList.add('visible-fallback');

  console.log('✅ Visibility guaranteed');
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('page-load');
    window.HungamaSystem = new HungamaProductionSystem();

    /* Primary exit */
    setTimeout(forceVisibility, 500);

    /* Backup */
    setTimeout(forceVisibility, 2000);

    /* Interaction-based escape hatches */
    ['scroll', 'click', 'keydown'].forEach(evt => {
      document.addEventListener(evt, forceVisibility, { once: true });
    });

    /* Absolute last resort */
    window.addEventListener('load', forceVisibility);
  });
} else {
  document.documentElement.classList.add('page-load');
  window.HungamaSystem = new HungamaProductionSystem();

  /* Primary exit */
  setTimeout(forceVisibility, 500);

  /* Backup */
  setTimeout(forceVisibility, 2000);

  /* Interaction-based escape hatches */
  ['scroll', 'click', 'keydown'].forEach(evt => {
    document.addEventListener(evt, forceVisibility, { once: true });
  });

  /* Absolute last resort */
  window.addEventListener('load', forceVisibility);
}
