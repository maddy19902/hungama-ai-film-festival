/**
 * NAVBAR CONTROLLER
 * Handles scroll state, mobile menu, active links
 */

class NavbarController {
  constructor() {
    this.nav = document.querySelector('nav');
    this.mobileToggle = document.querySelector('[data-mobile-menu-toggle]');
    this.mobileMenu = document.querySelector('.nav-mobile-menu');
    this.navLinks = document.querySelectorAll('.nav-links a');
    this.mobileLinks = document.querySelectorAll('.nav-mobile-links a');
    
    this.isMenuOpen = false;
    this.scrollThreshold = 50;
    this.currentPath = window.location.pathname;
    
    this.init();
  }
  
  init() {
    try {
      // Handle mobile menu toggle
      if (this.mobileToggle) {
        this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
      }
      
      // Close menu on link click
      this.mobileLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMobileMenu());
      });
      
      // Close menu on outside click
      document.addEventListener('click', (e) => {
        if (!this.nav.contains(e.target) && this.isMenuOpen) {
          this.closeMobileMenu();
        }
      });
      
      // Handle scroll events
      if (window.scrollController) {
        window.scrollController.parallaxSubscribers.push({
          element: null,
          update: this.handleScroll.bind(this)
        });
      } else {
        window.addEventListener('scroll', this.handleScroll.bind(this), {
          passive: true,
          capture: false
        });
      }
      
      // Set active link on page load
      this.updateActiveLink();
      
      // Handle window resize
      window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && this.isMenuOpen) {
          this.closeMobileMenu();
        }
      });
      
      if (window.location.search.includes('debug=nav')) {
        console.log('✅ Navbar Controller initialized');
      }
    } catch (error) {
      console.error('❌ Navbar Controller init failed:', error);
    }
  }
  
  handleScroll() {
    try {
      const scrollY = window.scrollController 
        ? window.scrollController.getCurrentScroll()
        : window.scrollY;
      
      if (scrollY > this.scrollThreshold) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    } catch (e) {
      // Fallback if scroll controller unavailable
    }
  }
  
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    this.isMenuOpen = true;
    this.mobileMenu.classList.add('expanded');
    if (this.mobileToggle) {
      this.mobileToggle.setAttribute('aria-expanded', 'true');
      this.mobileToggle.textContent = 'Close';
    }
  }
  
  closeMobileMenu() {
    this.isMenuOpen = false;
    this.mobileMenu.classList.remove('expanded');
    if (this.mobileToggle) {
      this.mobileToggle.setAttribute('aria-expanded', 'false');
      this.mobileToggle.textContent = 'Menu';
    }
  }
  
  updateActiveLink() {
    const allLinks = [...this.navLinks, ...this.mobileLinks];
    
    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Check if current page
      if (this.currentPath.endsWith(href) || 
          (href === '/' && this.currentPath === '/') ||
          (href === 'index.html' && (this.currentPath === '/' || this.currentPath.endsWith('index.html')))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  setPageContext(context) {
    // context can be 'hero', 'dark', or 'default'
    this.nav.classList.remove('nav-hero', 'nav-dark');
    
    if (context === 'hero') {
      this.nav.classList.add('nav-hero');
    } else if (context === 'dark') {
      this.nav.classList.add('nav-dark');
    }
  }
}

// Global initialization
(() => {
  function initNavbar() {
    try {
      if (window.navbarController) {
        // Already initialized
        return;
      }
      
      window.navbarController = new NavbarController();
    } catch (error) {
      console.error('❌ Navbar init failed:', error);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }
})();

// Cleanup
window.addEventListener('beforeunload', () => {
  if (window.navbarController) {
    // Cleanup if needed
  }
});
