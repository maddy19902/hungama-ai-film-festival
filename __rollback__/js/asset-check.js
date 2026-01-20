// Lightweight asset verification for production deployment
// Non-blocking warnings only - does NOT prevent page rendering

(function() {
  'use strict';
  
  const checkAsset = (url, type = 'asset') => {
    return fetch(url, { method: 'HEAD', cache: 'no-store' })
      .then(res => !res.ok && console.warn(`[Hungama] Warning: ${type} failed to load: ${url}`))
      .catch(() => console.warn(`[Hungama] Warning: Unable to verify ${type}: ${url}`));
  };

  // Check critical assets on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', verify);
  } else {
    verify();
  }

  function verify() {
    const checks = [
      // Core CSS files
      ...document.querySelectorAll('link[rel="stylesheet"][href^="/css/"]').length > 0 ? [] : [checkAsset('/css/output.css', 'CSS')],
      
      // Core JS modules
      ...['/js/view-transitions.js', '/js/premium-nav.js'].map(url => 
        new Promise((resolve) => {
          if (!document.querySelector(`script[src="${url}"]`)) {
            console.warn(`[Hungama] Warning: Expected script not loaded: ${url}`);
          }
          resolve();
        })
      )
    ];
    
    Promise.allSettled(checks);
  }
})();
