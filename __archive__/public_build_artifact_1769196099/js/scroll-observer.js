/**
 * HUNGAMA FESTIVAL - ENHANCED SCROLL OBSERVER
 * 
 * Manages all scroll-triggered section animations
 * Works alongside existing cinematic.js
 * Respects prefers-reduced-motion
 */

class ScrollObserver {
  constructor() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.sections = new Set();
    this.init();
  }

  init() {
    if (this.isReducedMotion) {
      // Skip animations, but ensure all sections are visible
      this.showAllSections();
      return;
    }

    // Create Intersection Observer for sections
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSection(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Start observing on document ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.observeSections());
    } else {
      this.observeSections();
    }

    // Watch for dynamic content
    this.watchForNewSections();
  }

  observeSections() {
    // Observe all sections
    document.querySelectorAll('section, [data-section], .hero, .gallery, .testimonials, .timeline, .form-section').forEach(section => {
      // Skip hero sections that are already visible
      if (!section.classList.contains('hero-active')) {
        this.observer.observe(section);
        this.sections.add(section);
      }
    });

    // Observe all staggered items within sections
    document.querySelectorAll('[data-stagger]').forEach(item => {
      this.observer.observe(item);
    });

    // Observe all animated elements
    document.querySelectorAll('[data-animation]').forEach(item => {
      this.observer.observe(item);
    });
  }

  animateSection(element) {
    // Add animate-in class with slight delay for smooth entrance
    setTimeout(() => {
      element.classList.add('animate-in');
    }, 10);
  }

  showAllSections() {
    document.querySelectorAll('section, [data-section], .hero, .gallery, .testimonials, .timeline, .form-section, [data-stagger], [data-animation]').forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'none';
    });
  }

  watchForNewSections() {
    const mutationObserver = new MutationObserver(() => {
      document.querySelectorAll('section, [data-section], [data-stagger], [data-animation]').forEach(section => {
        if (!this.sections.has(section) && !section.classList.contains('animate-in')) {
          this.observer.observe(section);
          this.sections.add(section);
        }
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize scroll observer on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.scrollObserver = new ScrollObserver();
  });
} else {
  window.scrollObserver = new ScrollObserver();
}

/**
 * SCROLL-LINKED IMAGE LOADING
 * 
 * Images fade in as they become visible
 */
class LazyImageLoader {
  constructor() {
    this.init();
  }

  init() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.01,
      rootMargin: '50px'
    });

    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  loadImage(img) {
    img.style.opacity = '1';
    img.classList.add('loaded');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new LazyImageLoader();
});

/**
 * KEYBOARD NAVIGATION - Arrow keys for page sections
 */
class KeyboardNavigator {
  constructor() {
    this.sections = [];
    this.currentIndex = 0;
    this.init();
  }

  init() {
    // Collect all major sections
    this.sections = Array.from(document.querySelectorAll('section, [data-section], .hero'));
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.scrollToNextSection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.scrollToPreviousSection();
      }
    });
  }

  scrollToNextSection() {
    if (this.currentIndex < this.sections.length - 1) {
      this.currentIndex++;
      this.sections[this.currentIndex].scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToPreviousSection() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.sections[this.currentIndex].scrollIntoView({ behavior: 'smooth' });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new KeyboardNavigator();
});

/**
 * SCROLL PERFORMANCE MONITORING
 */
class PerformanceMonitor {
  constructor() {
    this.lastScrollTime = 0;
    this.fps = 60;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.measureScroll(), { passive: true });
  }

  measureScroll() {
    const now = performance.now();
    const delta = now - this.lastScrollTime;
    
    // Calculate approximate FPS
    if (delta > 0) {
      this.fps = Math.round(1000 / delta);
    }
    
    this.lastScrollTime = now;
    
    // Log performance if slow
    if (this.fps < 50) {
      console.warn(`⚠️ Low scroll FPS: ${this.fps}`);
    }
  }

  getMetrics() {
    return {
      fps: this.fps,
      timestamp: performance.now()
    };
  }
}

window.performanceMonitor = new PerformanceMonitor();

/**
 * EXPORT FOR EXTERNAL USE
 */
window.ScrollAnimations = {
  observer: () => window.scrollObserver,
  monitor: () => window.performanceMonitor,
  forceLazyLoad: () => {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.style.opacity = '1';
      img.classList.add('loaded');
    });
  }
};
