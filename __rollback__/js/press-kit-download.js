/**
 * Press Kit Download Flow
 * Requires email validation before triggering ZIP download
 * Stores email in database (via email-capture system)
 */

class PressKitDownload {
  constructor() {
    this.button = document.querySelector('[data-download-kit]');
    if (!this.button) return;
    
    this.init();
  }

  init() {
    this.button.addEventListener('click', (e) => this.handleClick(e));
  }

  handleClick(e) {
    e.preventDefault();
    this.showEmailModal();
  }

  showEmailModal() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50';
    
    modal.innerHTML = `
      <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <h3 class="text-2xl font-bold mb-2 tracking-tight">Download Press Kit</h3>
        <p class="text-sm text-gray-400 mb-6 font-light">Enter your email to download press materials.</p>
        
        <form class="space-y-4" data-press-kit-form>
          <div>
            <input 
              type="email" 
              required 
              placeholder="your@email.com"
              class="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition"
            >
          </div>
          
          <div class="flex gap-3">
            <button 
              type="submit"
              class="flex-1 bg-brandRed hover:bg-red-700 transition px-6 py-3 rounded font-semibold text-white tracking-wide uppercase text-sm"
            >
              Download
            </button>
            <button 
              type="button"
              class="flex-1 bg-gray-800 hover:bg-gray-700 transition px-6 py-3 rounded font-semibold text-white tracking-wide uppercase text-sm"
              onclick="this.closest('.fixed').remove()"
            >
              Cancel
            </button>
          </div>
          
          <div data-status class="hidden text-sm text-center py-2 rounded"></div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = modal.querySelector('[data-press-kit-form]');
    const emailInput = form.querySelector('input[type="email"]');
    const statusDiv = form.querySelector('[data-status]');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      
      if (!this.validateEmail(email)) {
        this.showStatus(statusDiv, 'Invalid email format', 'error');
        return;
      }
      
      // Capture email via email-capture system
      this.captureEmail(email, 'press-kit-download', () => {
        // On success, trigger download
        this.triggerDownload();
        
        // Show success message
        this.showStatus(statusDiv, 'Download started! 🎬', 'success');
        
        // Close modal after 2 seconds
        setTimeout(() => modal.remove(), 2000);
      });
    });
    
    // Focus email input
    emailInput.focus();
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async captureEmail(email, source, onSuccess) {
    try {
      const response = await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
          timestamp: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        // Still trigger download even if capture fails (graceful degradation)
        onSuccess();
      }
    } catch (error) {
      console.error('Error capturing email:', error);
      // Still trigger download on network error (graceful degradation)
      onSuccess();
    }
  }

  triggerDownload() {
    const link = document.createElement('a');
    link.href = './public/press/laurels.zip';
    link.download = 'hungama-press-kit.zip';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  showStatus(statusDiv, message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `block text-sm text-center py-2 rounded ${
      type === 'error' ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'
    }`;
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PressKitDownload());
} else {
  new PressKitDownload();
}
