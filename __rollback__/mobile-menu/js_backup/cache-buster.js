/**
 * PHASE 7: CACHE BUSTING SYSTEM
 * Forces CSS and JS reload in development
 */

class CacheBuster {
  constructor() {
    this.isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    this.version = this.generateVersion();
    
    this.init();
  }
  
  init() {
    if (this.isDevelopment) {
      this.bustCSSCache();
      this.bustJSCache();
      this.setupWatchForChanges();
      
      if (window.location.search.includes('debug=cache')) {
        console.log('🔄 Cache Buster Active');
        console.log('Version:', this.version);
        console.log('Development Mode:', this.isDevelopment);
      }
    }
  }
  
  generateVersion() {
    // Use current timestamp for version
    return Math.floor(Date.now() / 60000); // Changes every minute
  }
  
  bustCSSCache() {
    // Add version query parameter to all link tags
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href');
      
      // Skip external stylesheets
      if (href.startsWith('http')) return;
      
      // Add version parameter if not already present
      if (!href.includes('?v=') && !href.includes('&v=')) {
        const separator = href.includes('?') ? '&' : '?';
        link.setAttribute('href', `${href}${separator}v=${this.version}`);
      }
    });
  }
  
  bustJSCache() {
    // Add version query parameter to all script tags
    document.querySelectorAll('script[src]').forEach(script => {
      const src = script.getAttribute('src');
      
      // Skip external scripts
      if (src.startsWith('http')) return;
      
      // Skip asset-check script
      if (src.includes('asset-check')) return;
      
      // Add version parameter if not already present
      if (!src.includes('?v=') && !src.includes('&v=')) {
        const separator = src.includes('?') ? '&' : '?';
        script.setAttribute('src', `${src}${separator}v=${this.version}`);
      }
    });
  }
  
  setupWatchForChanges() {
    // Check for version changes every 5 seconds
    setInterval(() => {
      const newVersion = this.generateVersion();
      
      if (newVersion !== this.version) {
        this.version = newVersion;
        
        if (window.location.search.includes('debug=cache')) {
          console.log('📝 Version updated to:', this.version);
        }
      }
    }, 5000);
  }
  
  // Force immediate cache refresh
  forceRefresh() {
    if (!this.isDevelopment) {
      console.warn('Cache busting only available in development mode');
      return;
    }
    
    this.version = this.generateVersion();
    this.bustCSSCache();
    this.bustJSCache();
    
    console.log('🔄 Cache refreshed');
  }
  
  // Reload all CSS files
  reloadCSS() {
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href');
      const url = new URL(href, window.location.href);
      url.searchParams.set('t', Date.now());
      link.href = url.toString();
    });
    
    console.log('✅ CSS reloaded');
  }
  
  // Reload all JS files
  reloadJS() {
    // Note: Reloading JS is more complex and may not work after execution
    console.log('⚠️ JS reload requires page refresh');
    window.location.reload();
  }
}

// Global initialization
(() => {
  function initCacheBuster() {
    try {
      if (window.cacheBuster) {
        return;
      }
      
      window.cacheBuster = new CacheBuster();
    } catch (error) {
      console.error('❌ Cache Buster failed:', error);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCacheBuster);
  } else {
    initCacheBuster();
  }
})();

// Make available globally for console debugging
window.reloadCSS = () => {
  if (window.cacheBuster) {
    window.cacheBuster.reloadCSS();
  }
};

window.forceRefresh = () => {
  if (window.cacheBuster) {
    window.cacheBuster.forceRefresh();
  }
};
