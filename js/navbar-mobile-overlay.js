/**
 * Mobile Navbar Overlay System
 * Handles full-screen mobile menu with animations
 * Only renders on mobile (<768px)
 */

class MobileNavbarOverlay {
  constructor() {
    this.isOpen = false;
    this.isMobile = window.innerWidth < 768;
    this.init();
  }

  init() {
    // Only create overlay on mobile
    if (!this.isMobile) return;
    
    this.createOverlay();
    this.attachEventListeners();
    
    // Re-check mobile status on resize
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < 768;
      
      if (!wasMobile && this.isMobile && !this.overlay) {
        this.createOverlay();
        this.attachEventListeners();
      }
      
      if (wasMobile && !this.isMobile && this.overlay) {
        this.close();
      }
    });
  }

  createOverlay() {
    // Check if overlay already exists
    if (document.getElementById('mobile-navbar-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'mobile-navbar-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      background-color: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(10px);
      display: none;
      flex-direction: column;
      opacity: 0;
      transition: opacity 0.3s ease-out;
      overflow-y: auto;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      border-bottom: 1px solid rgba(55, 65, 81, 0.5);
      margin-bottom: 2.5rem;
    `;
    header.innerHTML = `
      <a href="index.html" style="font-size: 1.25rem; font-weight: bold; letter-spacing: 0.05em; color: white; text-decoration: none;">HUNGAMA</a>
      <button data-mobile-menu-close style="font-size: 1.875rem; color: white; background: none; border: none; cursor: pointer; padding: 0; line-height: 1;" aria-label="Close menu">✕</button>
    `;

    // Navigation links
    const nav = document.createElement('nav');
    nav.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 0 2rem;
    `;
    nav.innerHTML = `
      <ul style="display: flex; flex-direction: column; gap: 1.5rem; list-style: none; padding: 0; margin: 0;">
        <li><a href="index.html" class="mobile-nav-link" style="display: block; color: white; text-decoration: none; font-size: 1.25rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(17, 24, 39, 0.5); transition: color 0.3s ease;">Home</a></li>
        <li><a href="vision.html" class="mobile-nav-link" style="display: block; color: white; text-decoration: none; font-size: 1.25rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(17, 24, 39, 0.5); transition: color 0.3s ease;">Vision</a></li>
        <li><a href="honors.html" class="mobile-nav-link" style="display: block; color: white; text-decoration: none; font-size: 1.25rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(17, 24, 39, 0.5); transition: color 0.3s ease;">Honors</a></li>
        <li><a href="nominees.html" class="mobile-nav-link" style="display: block; color: white; text-decoration: none; font-size: 1.25rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(17, 24, 39, 0.5); transition: color 0.3s ease;">Nominees</a></li>
        <li><a href="jury.html" class="mobile-nav-link" style="display: block; color: white; text-decoration: none; font-size: 1.25rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(17, 24, 39, 0.5); transition: color 0.3s ease;">Jury</a></li>
        <li><a href="ceremony.html" class="mobile-nav-link" style="display: block; color: white; text-decoration: none; font-size: 1.25rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(17, 24, 39, 0.5); transition: color 0.3s ease;">Ceremony</a></li>
        <li><a href="winners.html" class="mobile-nav-link" style="display: block; color: white; text-decoration: none; font-size: 1.25rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(17, 24, 39, 0.5); transition: color 0.3s ease;">Winners</a></li>
        <li><a href="press.html" class="mobile-nav-link" style="display: block; color: white; text-decoration: none; font-size: 1.25rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(17, 24, 39, 0.5); transition: color 0.3s ease;">Press</a></li>
        <li><a href="sponsors.html" class="mobile-nav-link" style="display: block; color: white; text-decoration: none; font-size: 1.25rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(17, 24, 39, 0.5); transition: color 0.3s ease;">Partners</a></li>
      </ul>
    `;

    // Submit CTA section
    const cta = document.createElement('div');
    cta.style.cssText = `
      margin-top: 2.5rem;
      padding: 1.5rem 2rem;
      border-top: 1px solid rgba(55, 65, 81, 0.5);
    `;
    cta.innerHTML = `
      <a href="submit.html" style="display: block; width: 100%; text-align: center; background-color: #dc2626; color: white; padding: 1rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none; font-size: 1.125rem; transition: background-color 0.3s ease;" onmouseover="this.style.backgroundColor='#b91c1c'" onmouseout="this.style.backgroundColor='#dc2626'">Submit Your Work</a>
    `;

    overlay.appendChild(header);
    overlay.appendChild(nav);
    overlay.appendChild(cta);

    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  attachEventListeners() {
    const hamburger = document.querySelector('[data-mobile-menu-toggle]');
    const closeBtn = document.querySelector('[data-mobile-menu-close]');
    const navLinks = document.querySelectorAll('.mobile-nav-link');
    const backdrop = document.querySelector('#mobile-navbar-overlay');

    if (hamburger) {
      hamburger.addEventListener('click', () => this.open());
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.close();
      });
    }

    navLinks.forEach(link => {
      link.addEventListener('click', () => this.close());
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  open() {
    if (!this.overlay) return;
    this.isOpen = true;
    this.overlay.style.display = 'flex';
    requestAnimationFrame(() => {
      this.overlay.style.opacity = '1';
      this.overlay.style.pointerEvents = 'auto';
    });
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.overlay) return;
    this.isOpen = false;
    this.overlay.style.opacity = '0';
    this.overlay.style.pointerEvents = 'none';
    setTimeout(() => {
      if (!this.isOpen && this.overlay) {
        this.overlay.style.display = 'none';
      }
      document.body.style.overflow = '';
    }, 300);
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MobileNavbarOverlay();
  });
} else {
  new MobileNavbarOverlay();
}
