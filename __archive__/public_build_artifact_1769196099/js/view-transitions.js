/**
 * HUNGAMA FESTIVAL - VIEW TRANSITIONS
 * 
 * Graceful page transitions using View Transitions API
 * Falls back to fade if not supported
 */

class ViewTransitioner {
  constructor() {
    this.supportsViewTransitions = 'startViewTransition' in document;
    this.init();
  }

  init() {
    // Intercept all navigation links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      
      if (!link) return;
      
      // Only handle same-origin navigation
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http')) return;
      if (link.hasAttribute('target')) return;
      
      e.preventDefault();
      this.transition(href);
    });

    // Also handle browser back/forward
    window.addEventListener('popstate', () => {
      this.transition(window.location.href, false);
    });
  }

  async transition(url, pushState = true) {
    if (this.supportsViewTransitions) {
      // Use native View Transitions API
      if (!document.startViewTransition) {
        this.fallbackTransition(url, pushState);
        return;
      }

      const transition = document.startViewTransition(async () => {
        await this.loadPage(url);
      });

      if (pushState && url !== window.location.href) {
        window.history.pushState({}, '', url);
      }
    } else {
      // Fallback to fade transition
      this.fallbackTransition(url, pushState);
    }
  }

  fallbackTransition(url, pushState = true) {
    document.documentElement.style.opacity = '0.95';
    document.documentElement.style.filter = 'blur(2px)';
    document.documentElement.style.transition = 'all 300ms ease-out';

    setTimeout(async () => {
      await this.loadPage(url);
      document.documentElement.style.opacity = '1';
      document.documentElement.style.filter = 'blur(0)';
      
      if (pushState && url !== window.location.href) {
        window.history.pushState({}, '', url);
      }
    }, 300);
  }

  async loadPage(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'X-Requested-With': 'fetch'
        }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const html = await response.text();
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(html, 'text/html');

      // Replace body
      document.body.innerHTML = newDoc.body.innerHTML;
      
      // Update head (preserve scripts/styles)
      const newHead = newDoc.head;
      const oldHead = document.head;
      
      // Update title
      document.title = newDoc.title;

      // Re-run any scripts that need to initialize
      window.scrollTo(0, 0);
      
      // Reinitialize handlers
      if (window.ScrollObserver) {
        window.scrollObserver = new ScrollObserver();
      }
      
      if (window.PremiumNavigation) {
        window.premiumNav = new PremiumNavigation();
      }

      // Trigger custom event for other listeners
      window.dispatchEvent(new CustomEvent('page-loaded'));
    } catch (error) {
      console.error('Page transition failed:', error);
      window.location.href = url;
    }
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ViewTransitioner();
  });
} else {
  new ViewTransitioner();
}
