/**
 * MOBILE MENU - ZERO-HALLUCINATION VERSION
 * Single-screen overlay navigation
 * NO editorial styling, NO invented colors
 * Uses desktop nav as truth source
 */

class MobileMenu {
  constructor() {
    this.isOpen = false;
    this.overlay = null;
    this.init();
  }

  init() {
    this.createOverlay();
    this.attachListeners();
  }

  createOverlay() {
    // Only inject once
    if (document.getElementById('mobile-nav-overlay')) {
      this.overlay = document.getElementById('mobile-nav-overlay');
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'mobile-nav-overlay';
    overlay.innerHTML = `
      <div class="mobile-nav-backdrop"></div>
      <div class="mobile-nav-panel">
        <button class="mobile-nav-close" type="button" aria-label="Close menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <nav class="mobile-nav-links">
          <a href="index.html" class="mobile-nav-link">Home</a>
          <a href="vision.html" class="mobile-nav-link">Vision</a>
          <a href="honors.html" class="mobile-nav-link">Honors</a>
          <a href="nominees.html" class="mobile-nav-link">Nominees</a>
          <a href="jury.html" class="mobile-nav-link">Jury</a>
          <a href="ceremony.html" class="mobile-nav-link">Ceremony</a>
          <a href="winners.html" class="mobile-nav-link">Winners</a>
          <a href="press.html" class="mobile-nav-link">Press</a>
          <a href="sponsors.html" class="mobile-nav-link">Partners</a>
          <a href="submit.html" class="mobile-nav-link mobile-nav-submit">Submit</a>
        </nav>
      </div>
    `;
    
    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  attachListeners() {
    // Toggle button
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-mobile-menu-toggle]')) {
        e.preventDefault();
        this.toggle();
      }
    });

    // Close button
    this.overlay.addEventListener('click', (e) => {
      if (e.target.closest('.mobile-nav-close')) {
        this.close();
      }
    });

    // Backdrop click
    this.overlay.addEventListener('click', (e) => {
      if (e.target.classList.contains('mobile-nav-backdrop')) {
        this.close();
      }
    });

    // Link clicks
    this.overlay.addEventListener('click', (e) => {
      if (e.target.classList.contains('mobile-nav-link')) {
        this.close();
      }
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.mobileMenu = new MobileMenu();
  });
} else {
  window.mobileMenu = new MobileMenu();
}
