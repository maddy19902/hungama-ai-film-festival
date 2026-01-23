/**
 * HUNGAMA FESTIVAL - PREMIUM NAVIGATION SYSTEM
 * 
 * Liquid glass navbar with scroll hide behavior
 * Mobile-optimized hamburger + FAB system
 * Smooth scroll transitions
 */

class PremiumNavigation {
  constructor() {
    this.navbar = document.querySelector('nav');
    this.lastScrollY = 0;
    this.isScrolling = false;
    this.scrollTimeout = null;
    this.direction = 'up';
    this.threshold = 100; // Pixels scrolled before hide
    
    this.isMobile = () => window.innerWidth < 768;
    this.init();
  }

  init() {
    if (!this.navbar) return;
    
    this.navbar.classList.add('scroll-show');
    
    // Set active link based on current page
    this.setActiveLink();
    
    // Scroll listener with throttle
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    
    // Resize listener for responsive changes
    window.addEventListener('resize', () => this.handleResize(), { passive: true });
    
    // Initialize FAB
    this.initializeFAB();
    
    // Initialize mobile navbar visibility
    this.initializeMobileNavbar();
  }

  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a[href]:not(.logo)');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkPage = href.split('/').pop() || 'index.html';
      
      // Remove active class from all links
      link.classList.remove('active');
      
      // Add active class to matching link
      if (currentPage === linkPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Calculate scroll direction
    if (currentScrollY > this.lastScrollY + this.threshold) {
      this.direction = 'down';
    } else if (currentScrollY < this.lastScrollY - this.threshold) {
      this.direction = 'up';
    }
    
    // Handle navbar visibility
    if (this.direction === 'down' && currentScrollY > 100) {
      // Scrolling down: hide navbar
      this.navbar.classList.add('scroll-hide');
      this.navbar.classList.remove('scroll-show');
    } else {
      // Scrolling up or at top: show navbar
      this.navbar.classList.remove('scroll-hide');
      this.navbar.classList.add('scroll-show');
    }
    
    // Update last scroll position
    if (Math.abs(currentScrollY - this.lastScrollY) > this.threshold) {
      this.lastScrollY = currentScrollY;
    }
  }

  handleResize() {
    // Update mobile state on resize
    if (!this.isMobile()) {
      this.navbar.classList.remove('mobile-navbar-visible');
      this.navbar.classList.add('scroll-show');
    }
  }

  initializeMobileNavbar() {
    const mobileMenuButton = document.querySelector('[data-mobile-menu-toggle]');
    if (!mobileMenuButton) return;
    
    mobileMenuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (this.isMobile()) {
        this.navbar.classList.toggle('mobile-navbar-visible');
      }
    });
    
    // Close mobile menu when clicking links
    document.querySelectorAll('nav a:not([data-mobile-menu-toggle])').forEach(link => {
      link.addEventListener('click', () => {
        this.navbar.classList.remove('mobile-navbar-visible');
      });
    });
  }

  initializeFAB() {
    const fab = document.querySelector('.fab-cta');
    if (!fab) return;
    
    // Hide FAB when menu is open
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    if (mobileMenu) {
      const observer = new MutationObserver(() => {
        const isMenuOpen = this.navbar.classList.contains('mobile-navbar-visible');
        if (isMenuOpen) {
          fab.style.opacity = '0';
          fab.style.pointerEvents = 'none';
        } else {
          fab.style.opacity = '1';
          fab.style.pointerEvents = 'auto';
        }
      });
      
      observer.observe(this.navbar, { attributes: true, attributeFilter: ['class'] });
    }
  }
}

/* ============================================================
   INITIALIZE ON DOCUMENT READY
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize premium navigation system
  new PremiumNavigation();
  
  // Initialize enhanced button interactions
  initializeButtonInteractions();
  
  // Initialize card interactions
  initializeCardInteractions();
});

/**
 * BUTTON INTERACTIONS - Press feedback & state management
 */
function initializeButtonInteractions() {
  document.querySelectorAll('button, a.button, .btn').forEach(button => {
    // Add keyboard support
    if (button.tagName === 'A') {
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    }
  });
}

/**
 * CARD INTERACTIONS - Enhanced hover & focus states
 */
function initializeCardInteractions() {
  document.querySelectorAll('.card, [data-card], .nominee-card, .jury-card, .archive-item').forEach(card => {
    // Add role for accessibility
    if (!card.hasAttribute('role')) {
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');
    }
    
    // Handle Enter key on focusable cards
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const link = card.querySelector('a');
        if (link) {
          link.click();
        }
      }
    });
  });
}

/**
 * IMAGE LOADING - Fade-in effect
 */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
      
      img.addEventListener('error', () => {
        img.style.opacity = '1';
      });
    }
  });
});

/**
 * FORM INTERACTIONS - Sacred form experience
 */
class FormInteractionEnhancer {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        // Add floating label support if needed
        input.addEventListener('focus', () => {
          const label = input.parentElement.querySelector('label');
          if (label) {
            label.style.color = 'rgba(220, 20, 60, 1)';
          }
        });
        
        input.addEventListener('blur', () => {
          const label = input.parentElement.querySelector('label');
          if (label && !input.value) {
            label.style.color = 'var(--color-gray-400)';
          }
        });
      });
      
      // Form submission feedback
      form.addEventListener('submit', (e) => {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.setAttribute('aria-busy', 'true');
          submitButton.style.opacity = '0.7';
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FormInteractionEnhancer();
});

/**
 * ACCESSIBILITY ENHANCEMENTS
 */
function initializeA11y() {
  // Skip link functionality removed per design requirements
  // Native browser keyboard navigation provides sufficient accessibility
  
  // Add main landmark if not present
  let main = document.querySelector('main');
  if (!main) {
    main = document.querySelector('[data-main]') || document.querySelector('.container');
    if (main) {
      main.setAttribute('id', 'main');
      main.setAttribute('role', 'main');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initializeA11y();
});

/**
 * PERFORMANCE - Lazy load non-critical CSS
 */
function lazyLoadCSS() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './src/animations.css';
  document.head.appendChild(link);
}

// Load animations CSS after page render for performance
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => lazyLoadCSS());
} else {
  setTimeout(() => lazyLoadCSS(), 2000);
}

/**
 * EXPORT FOR EXTERNAL ACCESS
 */
window.PremiumNav = {
  reinitialize: () => new PremiumNavigation(),
};
