/**
 * HUNGAMA FESTIVAL - CINEMATIC ANIMATIONS & INTERACTIONS
 * 
 * Features:
 * - Scroll-triggered fade-in animations (Intersection Observer)
 * - Mobile menu overlay with accessibility
 * - Respects prefers-reduced-motion
 * - Performance-optimized
 */

// ============================================================
// 1. SCROLL-TRIGGERED ANIMATIONS (Intersection Observer API)
// ============================================================

const enableAnimations = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Auto-add data-animate to cards for scroll-in effects
if (enableAnimations && document.readyState !== 'loading') {
  document.querySelectorAll('.nominee-card, .jury-card, .partner-card, .winner-card').forEach(card => {
    if (!card.hasAttribute('data-animate')) {
      card.setAttribute('data-animate', '');
    }
  });
}

if (enableAnimations) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px' // Trigger slightly before element enters viewport
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  // Observe all sections with animation class
  const animateElements = () => {
    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });
  };

  // Run on page load and after DOM changes
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateElements);
  } else {
    animateElements();
  }
}

// ============================================================
// 2. MOBILE MENU OVERLAY
// ============================================================

const MobileMenu = {
  isOpen: false,
  menuButton: null,
  closeButton: null,
  overlay: null,
  menu: null,
  backdrop: null,

  init() {
    // Find existing menu button or create one
    this.menuButton = document.querySelector('[data-mobile-menu-toggle]') || this.createMenuButton();
    
    // Create menu overlay structure
    this.createMenuOverlay();
    
    // Event listeners
    this.menuButton.addEventListener('click', () => this.toggle());
    this.closeButton.addEventListener('click', () => this.close());
    this.backdrop.addEventListener('click', () => this.close());
    
    // Close menu on link click
    this.menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.close());
    });

    // Keyboard: ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Focus trap
    this.setupFocusTrap();
  },

  createMenuButton() {
    const button = document.querySelector('.md\\:hidden button');
    if (button) {
      button.setAttribute('data-mobile-menu-toggle', 'true');
      button.setAttribute('aria-label', 'Open menu');
      button.setAttribute('aria-expanded', 'false');
      button.innerHTML = '☰'; // Mobile menu icon
      return button;
    }
    return null;
  },

  createMenuOverlay() {
    // Create backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'mobile-menu-backdrop';
    this.backdrop.setAttribute('aria-hidden', 'true');

    // Create menu container
    this.overlay = document.createElement('div');
    this.overlay.className = 'mobile-menu-overlay';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-label', 'Navigation menu');

    // Create close button
    this.closeButton = document.createElement('button');
    this.closeButton.className = 'mobile-menu-close';
    this.closeButton.setAttribute('aria-label', 'Close menu');
    this.closeButton.innerHTML = '✕';

    // Create menu items
    const nav = document.querySelector('nav .hidden.md\\:flex');
    if (nav) {
      this.menu = nav.cloneNode(true);
      this.menu.className = 'mobile-menu-items';
      this.menu.setAttribute('role', 'navigation');

      // Remove submit button styling (will be full-width)
      const submitBtn = this.menu.querySelector('[href="submit.html"]');
      if (submitBtn) {
        submitBtn.className = 'mobile-menu-cta';
      }
    }

    // Assemble overlay
    this.overlay.appendChild(this.closeButton);
    this.overlay.appendChild(this.menu);

    // Add to DOM
    document.body.appendChild(this.backdrop);
    document.body.appendChild(this.overlay);
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  open() {
    this.isOpen = true;
    this.backdrop.classList.add('active');
    this.overlay.classList.add('active');
    this.menuButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    
    // Focus first menu item
    const firstMenuItem = this.menu.querySelector('a');
    if (firstMenuItem) {
      setTimeout(() => firstMenuItem.focus(), 300);
    }
  },

  close() {
    this.isOpen = false;
    this.backdrop.classList.remove('active');
    this.overlay.classList.remove('active');
    this.menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    
    // Return focus to menu button
    this.menuButton.focus();
  },

  setupFocusTrap() {
    const focusableElements = 'a, button';
    const focusables = Array.from(this.overlay.querySelectorAll(focusableElements));
    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];

    this.overlay.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    });
  }
};

// ============================================================
// 3. CTA DEEP-LINKING WITH SCROLL OFFSET
// ============================================================

function setupCTALinks() {
  // Submit button smooth scroll with navbar offset
  document.querySelectorAll('[href="submit.html"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('href');
      if (target === 'submit.html') {
        // Navigation link - let default behavior work
        return;
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      const target = document.querySelector(hash);
      
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('nav')?.offsetHeight || 80;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================================
// 4. HOVER EFFECTS FOR CARDS & CTAs
// ============================================================

function setupHoverEffects() {
  // Apply to cards, nominee cards, jury cards, etc.
  const hoverElements = document.querySelectorAll(
    '.nominee-card, .jury-card, .partner-card, [data-hover-lift]'
  );

  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (!el.classList.contains('no-hover')) {
        el.classList.add('hover-lifted');
      }
    });

    el.addEventListener('mouseleave', () => {
      el.classList.remove('hover-lifted');
    });
  });
}

// ============================================================
// 5. PARALLAX EFFECT (CSS-based, respects motion preferences)
// ============================================================

function setupParallax() {
  if (!enableAnimations) return;

  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        parallaxElements.forEach(el => {
          const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
          const yOffset = window.scrollY * speed;
          el.style.transform = `translateY(${yOffset}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ============================================================
// 6. INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Only initialize mobile menu on small screens
  if (window.innerWidth < 768) {
    MobileMenu.init();
  }

  // Reinit on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth < 768 && !MobileMenu.menuButton) {
      MobileMenu.init();
    }
  });

  setupCTALinks();
  setupHoverEffects();
  setupParallax();
});

// Export for testing
if (typeof window !== 'undefined') {
  window.HUNGAMA = {
    MobileMenu,
    animations: { enableAnimations }
  };
}
