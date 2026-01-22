/**
 * CLEAN MOBILE DRAWER NAVIGATION - SURGICAL REBUILD
 * 
 * GUARANTEES:
 * - Single event listener (no conflicts)
 * - Direct body children (no positioning constraints)
 * - Full visibility of menu items
 * - No phantom overlays
 * - Works on all pages identically
 */

class MobileDrawerNav {
  constructor() {
    this.isOpen = false;
    this.isMobile = window.innerWidth < 768;
    this.backdropEl = null;
    this.drawerEl = null;
    this.hamburgerEl = null;
    
    this.init();
  }

  init() {
    // Build drawer structure (direct body children only)
    this.buildStructure();
    
    // Inject CSS (CRITICAL: visible by default, hidden state managed by class)
    this.injectStyles();
    
    // Attach event listeners (AFTER elements exist)
    this.attachListeners();
    
    // Ensure clean state on init
    document.body.classList.remove('drawer-open');
  }

  buildStructure() {
    // BACKDROP - Direct body child
    this.backdropEl = document.createElement('div');
    this.backdropEl.id = 'mobile-drawer-backdrop';
    this.backdropEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.backdropEl);

    // DRAWER - Direct body child
    this.drawerEl = document.createElement('nav');
    this.drawerEl.id = 'mobile-drawer-content';
    this.drawerEl.setAttribute('aria-label', 'Mobile navigation');
    this.drawerEl.innerHTML = `
      <div class="drawer-header">
        <button class="drawer-close-btn" type="button" aria-label="Close menu">
          <span class="close-icon">✕</span>
        </button>
      </div>
      <div class="drawer-menu-container">
        <ul class="drawer-menu">
          <li><a href="index.html" class="drawer-link">Home</a></li>
          <li><a href="vision.html" class="drawer-link">About</a></li>
          <li><a href="honors.html" class="drawer-link">Awards</a></li>
          <li><a href="nominees.html" class="drawer-link">Selections</a></li>
          <li><a href="jury.html" class="drawer-link">Jury</a></li>
          <li><a href="ceremony.html" class="drawer-link">Event</a></li>
          <li><a href="press.html" class="drawer-link">Press</a></li>
          <li><a href="sponsors.html" class="drawer-link">Partners</a></li>
        </ul>
      </div>
      <div class="drawer-footer">
        <a href="submit.html" class="drawer-cta">Submit Your Film</a>
      </div>
    `;
    document.body.appendChild(this.drawerEl);
  }

  injectStyles() {
    const style = document.createElement('style');
    style.id = 'mobile-drawer-styles';
    style.textContent = `
      /* BACKDROP */
      #mobile-drawer-backdrop {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        z-index: 9998;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease-out;
      }

      body.drawer-open #mobile-drawer-backdrop {
        display: block;
        opacity: 1;
      }

      /* DRAWER CONTENT */
      #mobile-drawer-content {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 75vw;
        max-width: 320px;
        background: #0a0a0a;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        overflow: hidden;
      }

      body.drawer-open #mobile-drawer-content {
        transform: translateX(0);
      }

      /* DRAWER HEADER */
      .drawer-header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        flex-shrink: 0;
      }

      .drawer-close-btn {
        background: none;
        border: none;
        color: #fff;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        transition: color 0.2s ease;
      }

      .drawer-close-btn:hover {
        color: rgba(255, 255, 255, 0.8);
      }

      .close-icon {
        display: block;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* MENU CONTAINER */
      .drawer-menu-container {
        flex: 1;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }

      /* MENU */
      .drawer-menu {
        list-style: none;
        margin: 0;
        padding: 1rem 0;
      }

      .drawer-menu li {
        margin: 0;
        padding: 0;
      }

      /* MENU LINKS - GUARANTEED VISIBILITY */
      .drawer-link {
        display: block;
        color: #ffffff;
        text-decoration: none;
        padding: 1rem 1.5rem;
        font-size: 1rem;
        font-weight: 500;
        letter-spacing: 0.02em;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        transition: background-color 0.2s ease;
      }

      .drawer-link:visited {
        color: #ffffff;
      }

      .drawer-link:active {
        background-color: rgba(220, 38, 38, 0.1);
        color: #ffffff;
      }

      /* FOOTER/CTA */
      .drawer-footer {
        padding: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        flex-shrink: 0;
      }

      .drawer-cta {
        display: block;
        width: 100%;
        text-align: center;
        background: #dc2626;
        color: white;
        padding: 0.875rem 1rem;
        border-radius: 0.375rem;
        font-weight: 600;
        font-size: 1rem;
        letter-spacing: 0.02em;
        text-decoration: none;
        transition: background-color 0.2s ease;
      }

      .drawer-cta:visited {
        color: white;
      }

      .drawer-cta:active {
        background-color: #991b1b;
      }

      /* BODY SCROLL LOCK */
      body.drawer-open {
        overflow: hidden !important;
      }

      /* PREVENT INTERACTION OUTSIDE DRAWER */
      body:not(.drawer-open) #mobile-drawer-backdrop {
        pointer-events: none;
      }

      body.drawer-open #mobile-drawer-backdrop {
        pointer-events: auto;
      }

      /* Hide drawer on desktop */
      @media (min-width: 768px) {
        #mobile-drawer-backdrop,
        #mobile-drawer-content {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  attachListeners() {
    // Find hamburger
    this.hamburgerEl = document.querySelector('[data-mobile-menu-toggle]');
    
    if (!this.hamburgerEl) {
      console.warn('⚠️ Mobile drawer: Hamburger button not found');
      return;
    }

    // SINGLE event listener with arrow function (preserves this context)
    this.hamburgerEl.addEventListener('click', () => {
      this.isOpen ? this.close() : this.open();
    });

    // Close button
    const closeBtn = this.drawerEl.querySelector('.drawer-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click
    this.backdropEl.addEventListener('click', () => this.close());

    // Menu links - close drawer when clicked
    const links = this.drawerEl.querySelectorAll('.drawer-link, .drawer-cta');
    links.forEach(link => {
      link.addEventListener('click', () => this.close());
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      const nowMobile = window.innerWidth < 768;
      if (this.isMobile && !nowMobile) {
        // Switched to desktop
        this.close();
      }
      this.isMobile = nowMobile;
    });
  }

  open() {
    if (!this.isMobile) return;
    
    this.isOpen = true;
    document.body.classList.add('drawer-open');
  }

  close() {
    this.isOpen = false;
    document.body.classList.remove('drawer-open');
  }
}

// Initialize immediately or on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MobileDrawerNav();
  });
} else {
  new MobileDrawerNav();
}
