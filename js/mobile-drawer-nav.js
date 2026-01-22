/**
 * CLEAN MOBILE DRAWER NAVIGATION
 * Plain vanilla JS - no frameworks
 * Right-side sliding drawer (75% viewport width)
 * Closes on: outside click, link click, hamburger toggle, escape key
 * Locks body scroll when open
 */

class MobileDrawerNav {
  constructor() {
    this.isOpen = false;
    this.isMobile = window.innerWidth < 768;
    
    // Bind methods to preserve 'this'
    this.handleResize = this.handleResize.bind(this);
    this.handleHamburgerClick = this.handleHamburgerClick.bind(this);
    this.handleDrawerBackdropClick = this.handleDrawerBackdropClick.bind(this);
    this.handleNavLinkClick = this.handleNavLinkClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
    
    this.init();
  }

  init() {
    // Build drawer HTML/CSS once
    this.buildDrawer();
    this.attachEventListeners();
    // Ensure body starts clean
    document.body.classList.remove('drawer-open');
    
    // Monitor window resize
    window.addEventListener('resize', this.handleResize);
  }

  buildDrawer() {
    // Create backdrop - append directly to body
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'mobile-drawer-backdrop';
    this.backdrop.innerHTML = '';
    document.body.appendChild(this.backdrop);

    // Create drawer content - append directly to body
    this.content = document.createElement('nav');
    this.content.className = 'mobile-drawer-content';
    this.content.innerHTML = `
      <div class="mobile-drawer-header">
        <button class="mobile-drawer-close" aria-label="Close menu">✕</button>
      </div>
      <ul class="mobile-drawer-menu">
        <li><a href="index.html" class="mobile-drawer-link">Home</a></li>
        <li><a href="vision.html" class="mobile-drawer-link">About</a></li>
        <li><a href="honors.html" class="mobile-drawer-link">Awards</a></li>
        <li><a href="nominees.html" class="mobile-drawer-link">Selections</a></li>
        <li><a href="jury.html" class="mobile-drawer-link">Jury</a></li>
        <li><a href="ceremony.html" class="mobile-drawer-link">Event</a></li>
        <li><a href="press.html" class="mobile-drawer-link">Press</a></li>
        <li><a href="sponsors.html" class="mobile-drawer-link">Partners</a></li>
      </ul>
      <div class="mobile-drawer-cta">
        <a href="submit.html" class="mobile-drawer-submit">Submit Your Film</a>
      </div>
    `;
    document.body.appendChild(this.content);
    
    this.injectStyles();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* MOBILE DRAWER STYLES */
      .mobile-drawer-backdrop {
        position: fixed;
        top: 62px;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(2px);
        z-index: 9998;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
        pointer-events: none;
      }

      body.drawer-open .mobile-drawer-backdrop {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
      }

      .mobile-drawer-content {
        position: fixed;
        right: 0;
        top: 62px;
        bottom: 0;
        width: 75vw;
        max-width: 320px;
        background-color: #0a0a0a;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.3s ease-out, visibility 0.3s ease-out;
        overflow-y: auto;
        overscroll-behavior: contain;
        z-index: 9999;
        visibility: hidden;
      }

      body.drawer-open .mobile-drawer-content {
        transform: translateX(0);
        visibility: visible;
      }

      .mobile-drawer-header {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        flex-shrink: 0;
      }

      .mobile-drawer-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.25rem;
        line-height: 1;
        transition: color 0.2s ease;
      }

      .mobile-drawer-close:active {
        color: rgba(255, 255, 255, 0.7);
      }

      .mobile-drawer-menu {
        list-style: none;
        margin: 0;
        padding: 1.5rem 0;
        flex: 1;
        overflow-y: auto;
      }

      .mobile-drawer-menu li {
        margin: 0;
      }

      .mobile-drawer-link {
        display: block;
        color: #ffffff;
        text-decoration: none;
        padding: 1rem 1.5rem;
        font-size: 1rem;
        font-weight: 500;
        letter-spacing: 0.02em;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        transition: background-color 0.2s ease, color 0.2s ease;
      }

      .mobile-drawer-link:active {
        background-color: rgba(220, 38, 38, 0.1);
        color: #ffffff;
      }

      .mobile-drawer-cta {
        padding: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        flex-shrink: 0;
      }

      .mobile-drawer-submit {
        display: block;
        width: 100%;
        text-align: center;
        background-color: #dc2626;
        color: white;
        padding: 0.875rem;
        border-radius: 0.375rem;
        font-weight: 600;
        text-decoration: none;
        font-size: 1rem;
        letter-spacing: 0.02em;
        transition: background-color 0.2s ease;
      }

      .mobile-drawer-submit:active {
        background-color: #991b1b;
      }

      /* Body scroll lock when drawer open */
      body.drawer-open {
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
  }

  attachEventListeners() {
    // Hamburger button
    const hamburger = document.querySelector('[data-mobile-menu-toggle]');
    console.log('🍔 Mobile Drawer: Looking for hamburger button...', hamburger);
    if (hamburger) {
      console.log('✅ Mobile Drawer: Hamburger found, attaching click listener');
      hamburger.addEventListener('click', this.handleHamburgerClick);
    } else {
      console.error('❌ Mobile Drawer: Hamburger button NOT found! Selector: [data-mobile-menu-toggle]');
    }

    // Close button
    const closeBtn = this.content.querySelector('.mobile-drawer-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click
    if (this.backdrop) {
      this.backdrop.addEventListener('click', this.handleDrawerBackdropClick);
    }

    // Nav links
    const navLinks = this.content.querySelectorAll('.mobile-drawer-link');
    navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavLinkClick);
    });

    // Submit link
    const submitLink = this.content.querySelector('.mobile-drawer-submit');
    if (submitLink) {
      submitLink.addEventListener('click', this.handleNavLinkClick);
    }

    // Escape key
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;

    // Close drawer if switching to desktop
    if (wasMobile && !this.isMobile && this.isOpen) {
      this.close();
    }
  }

  handleHamburgerClick() {
    console.log('🖱️ Mobile Drawer: Hamburger clicked! isOpen:', this.isOpen);
    if (this.isOpen) {
      console.log('📥 Mobile Drawer: Closing drawer');
      this.close();
    } else {
      console.log('📤 Mobile Drawer: Opening drawer');
      this.open();
    }
  }

  handleDrawerBackdropClick() {
    this.close();
  }

  handleNavLinkClick() {
    this.close();
  }

  handleEscapeKey(e) {
    if (e.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  open() {
    if (!this.isMobile) {
      console.log('⚠️ Mobile Drawer: Not mobile, skipping open');
      return;
    }
    console.log('✅ Opening drawer, adding "drawer-open" class');
    this.isOpen = true;
    document.body.classList.add('drawer-open');
    console.log('📊 Body classList:', document.body.className);
  }

  close() {
    console.log('✅ Closing drawer, removing "drawer-open" class');
    this.isOpen = false;
    document.body.classList.remove('drawer-open');
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MobileDrawerNav();
  });
} else {
  new MobileDrawerNav();
}
