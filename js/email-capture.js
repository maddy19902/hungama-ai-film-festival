/**
 * HUNGAMA FESTIVAL - NOTION EMAIL CAPTURE
 * 
 * Client-side email validation and Notion DB integration
 * Fails silently on network issues
 */

class EmailCapture {
  constructor() {
    this.apiToken = 'NOTION_TOKEN_HERE'; // Replace with env var
    this.databaseId = 'NOTION_DB_ID_HERE'; // Replace with env var
    this.init();
  }

  init() {
    // Wire up all email capture forms
    document.querySelectorAll('[data-email-capture]').forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('[type="email"]');
    const button = form.querySelector('button');
    
    if (!emailInput || !emailInput.value.trim()) {
      this.showMessage('Please enter your email', 'error', form);
      this.setFieldState(emailInput, 'error');
      return;
    }

    // Validate email
    if (!this.validateEmail(emailInput.value)) {
      this.showMessage('Please enter a valid email', 'error', form);
      this.setFieldState(emailInput, 'error');
      return;
    }

    // Show valid state
    this.setFieldState(emailInput, 'valid');

    // Store email in Notion (fire and forget)
    this.captureEmail(emailInput.value, form.dataset.source);

    // Show success UI
    this.showMessage('✓ Thank you! Confirmation sent to your email.', 'success', form);
    
    // Reset form after success
    setTimeout(() => {
      emailInput.value = '';
      this.setFieldState(emailInput, 'default');
    }, 2000);
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  setFieldState(input, state) {
    // Remove previous state
    input.classList.remove('email-valid', 'email-error', 'email-default');
    
    if (state === 'valid') {
      input.style.borderColor = 'rgba(16, 185, 129, 0.5)';
      input.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.1)';
      input.classList.add('email-valid');
    } else if (state === 'error') {
      input.style.borderColor = 'rgba(239, 68, 68, 0.5)';
      input.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.1)';
      input.classList.add('email-error');
    } else {
      input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      input.style.boxShadow = '';
      input.classList.add('email-default');
    }
  }

  async captureEmail(email, source = 'unknown') {
    try {
      const response = await fetch('/api/capture-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiToken}`
        },
        body: JSON.stringify({
          email,
          source,
          timestamp: new Date().toISOString()
        })
      });

      // Fail silently but log for debugging
      if (!response.ok) {
        console.warn('Email capture failed:', response.status);
      }
    } catch (error) {
      console.warn('Email capture network error:', error.message);
    }
  }

  showMessage(text, type, form) {
    // Remove existing message
    const existing = form.querySelector('[data-message]');
    if (existing) existing.remove();

    const message = document.createElement('div');
    message.setAttribute('data-message', type);
    message.style.cssText = `
      margin-top: 0.75rem;
      padding: 0.75rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      text-align: center;
      animation: fadeIn 300ms ease-out;
    `;

    if (type === 'success') {
      message.style.background = 'rgba(16, 185, 129, 0.1)';
      message.style.color = 'rgba(16, 185, 129, 1)';
      message.style.borderLeft = '3px solid rgba(16, 185, 129, 0.8)';
    } else {
      message.style.background = 'rgba(239, 68, 68, 0.1)';
      message.style.color = 'rgba(239, 68, 68, 1)';
      message.style.borderLeft = '3px solid rgba(239, 68, 68, 0.8)';
    }

    message.textContent = text;
    form.appendChild(message);

    // Auto-remove after 3 seconds
    if (type === 'success') {
      setTimeout(() => message.remove(), 3000);
    }
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new EmailCapture();
  });
} else {
  new EmailCapture();
}
