/**
 * PHASE 6: SUBMIT CTA WIRING
 * Manages Submit button navigation and email capture
 */

class SubmitCTAController {
  constructor() {
    this.ctaButtons = document.querySelectorAll('[data-cta="submit"]');
    this.emailCapture = document.querySelector('[data-email-capture]');
    this.submitPage = '/submit.html';
    
    this.init();
  }
  
  init() {
    try {
      this.wireUpButtons();
      this.setupEmailCapture();
      
      if (window.location.search.includes('debug=cta')) {
        console.log('✅ Submit CTA Controller initialized');
        console.log('Found CTA buttons:', this.ctaButtons.length);
      }
    } catch (error) {
      console.error('❌ Submit CTA init failed:', error);
    }
  }
  
  wireUpButtons() {
    this.ctaButtons.forEach(btn => {
      // Remove href if present to prevent default navigation
      const href = btn.getAttribute('href');
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToSubmit();
      });
      
      // Add hover effect
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
      });
      
      // Keyboard navigation
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.navigateToSubmit();
        }
      });
      
      // Add ripple effect on click
      btn.addEventListener('mousedown', (e) => {
        this.createRipple(e, btn);
      });
    });
  }
  
  createRipple(event, element) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = diameter + 'px';
    circle.style.left = event.clientX - element.offsetLeft - radius + 'px';
    circle.style.top = event.clientY - element.offsetTop - radius + 'px';
    circle.classList.add('ripple');
    
    const ripple = element.querySelector('.ripple');
    if (ripple) {
      ripple.remove();
    }
    
    element.appendChild(circle);
    
    setTimeout(() => {
      circle.remove();
    }, 600);
  }
  
  navigateToSubmit() {
    // Add page transition effect
    this.applyTransition(() => {
      window.location.href = this.submitPage;
    });
  }
  
  applyTransition(callback) {
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.4s ease-out;
      pointer-events: none;
    `;
    
    document.body.appendChild(overlay);
    
    // Trigger animation
    setTimeout(() => {
      overlay.style.opacity = '1';
      setTimeout(callback, 400);
    }, 10);
  }
  
  setupEmailCapture() {
    if (!this.emailCapture) return;
    
    // Listen for email capture submissions
    const handleEmailCapture = (event) => {
      const detail = event.detail || {};
      
      // Optional: Store email in session storage for submit page
      if (detail.email) {
        sessionStorage.setItem('userEmail', detail.email);
      }
      
      // Navigate to submit after email capture
      this.navigateToSubmit();
    };
    
    document.addEventListener('emailCaptured', handleEmailCapture);
  }
  
  // Public method to programmatically trigger submission
  triggerSubmit() {
    this.navigateToSubmit();
  }
}

// Global initialization
(() => {
  function initCTA() {
    try {
      if (window.submitCTAController) {
        return;
      }
      
      window.submitCTAController = new SubmitCTAController();
    } catch (error) {
      console.error('❌ CTA init failed:', error);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCTA);
  } else {
    initCTA();
  }
})();

// Add ripple effect CSS
const style = document.createElement('style');
style.textContent = `
  button, a[data-cta],  input[type="submit"] {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: rippleAnimation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes rippleAnimation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
