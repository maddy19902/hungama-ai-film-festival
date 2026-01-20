/**
 * MOBILE MENU COMPONENT
 * Handles full-screen overlay mobile navigation across all pages
 * Single source of truth for mobile menu behavior
 */

class MobileMenuManager {
  constructor() {
    this.menuOpen = false;
    this.menuId = 'mobile-menu-overlay';
    this.scrollLocked = false;
    this.init();
  }

  init() {
    // Inject menu overlay once per page
    this.injectMenuOverlay();
    
    // Setup event listeners
    this.setupEventListeners();
    
    console.log('✅ Mobile Menu Manager initialized');
  }

  injectMenuOverlay() {
    // Don't inject if already present
    if (document.getElementById(this.menuId)) {
      return;
    }

    const menuHTML = `
      <div id="${this.menuId}" class="mobile-menu-overlay" role="navigation" aria-label="Mobile navigation">
        <!-- Backdrop -->
        <div class="mobile-menu-backdrop"></div>
        
        <!-- Menu Container -->
        <div class="mobile-menu-container">
          <!-- Close Button -->
          <button class="mobile-menu-close" aria-label="Close menu" aria-expanded="false">
            <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <!-- Menu Links -->
          <nav class="mobile-menu-links">
            <a href="index.html" class="mobile-menu-link" data-route="home">Home</a>
            <a href="vision.html" class="mobile-menu-link" data-route="vision">Vision</a>
            <a href="honors.html" class="mobile-menu-link" data-route="honors">Honors</a>
            <a href="nominees.html" class="mobile-menu-link" data-route="nominees">Nominees</a>
            <a href="jury.html" class="mobile-menu-link" data-route="jury">Jury</a>
            <a href="ceremony.html" class="mobile-menu-link" data-route="ceremony">Ceremony</a>
            <a href="winners.html" class="mobile-menu-link" data-route="winners">Winners</a>
            <a href="press.html" class="mobile-menu-link" data-route="press">Press</a>
            <a href="sponsors.html" class="mobile-menu-link" data-route="partners">Partners</a>
            <div class="mobile-menu-divider"></div>
            <a href="submit.html" class="mobile-menu-link mobile-menu-cta" data-route="submit">Submit</a>
          </nav>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', menuHTML);
  }

  setupEventListeners() {
    // Toggle button
    const toggleBtn = document.querySelector('[data-mobile-menu-toggle]');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.openMenu());
    }

    // Close button
    const closeBtn = document.querySelector('.mobile-menu-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeMenu());
    }

    // Backdrop click
    const backdrop = document.querySelector('.mobile-menu-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeMenu());
    }

    // Menu links
    const links = document.querySelectorAll('.mobile-menu-link');
    links.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.menuOpen) {
        this.closeMenu();
      }
    });
  }

  openMenu() {
    const overlay = document.getElementById(this.menuId);
    if (!overlay) return;

    this.menuOpen = true;
    overlay.classList.add('active');
    this.lockScroll();
    
    // Update button state
    const toggleBtn = document.querySelector('[data-mobile-menu-toggle]');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'true');
    }

    // Set focus to close button for accessibility
    const closeBtn = document.querySelector('.mobile-menu-close');
    if (closeBtn) {
      closeBtn.focus();
    }

    console.log('📱 Mobile menu opened');
  }

  closeMenu() {
    const overlay = document.getElementById(this.menuId);
    if (!overlay) return;

    this.menuOpen = false;
    overlay.classList.remove('active');
    this.unlockScroll();

    // Update button state
    const toggleBtn = document.querySelector('[data-mobile-menu-toggle]');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.focus();
    }

    console.log('📱 Mobile menu closed');
  }

  lockScroll() {
    if (this.scrollLocked) return;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
    this.scrollLocked = true;
  }

  unlockScroll() {
    if (!this.scrollLocked) return;
    
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    this.scrollLocked = false;
  }

  getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    
    const inner = document.createElement('div');
    outer.appendChild(inner);
    
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    
    return scrollbarWidth;
  }

  toggleMenu() {
    if (this.menuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.mobileMenuManager = new MobileMenuManager();
  });
} else {
  window.mobileMenuManager = new MobileMenuManager();
}
