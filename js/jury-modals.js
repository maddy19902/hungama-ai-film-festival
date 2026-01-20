/**
 * PASS 1: JURY MODAL WIRING
 * Handles bio modal opens/closes for jury members
 */

(() => {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJuryModals);
  } else {
    initJuryModals();
  }

  function initJuryModals() {
    const jurorCards = document.querySelectorAll('.juror-card[data-modal]');
    const modals = document.querySelectorAll('.jury-modal');

    // Setup click handlers for juror cards
    jurorCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const modalId = card.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          openModal(modal);
        }
      });

      // Keyboard access
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });

      // Make card focusable
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
    });

    // Setup close handlers
    modals.forEach(modal => {
      // Close button
      const closeBtn = modal.querySelector('.jury-modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
      }

      // Click outside modal to close
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });

      // ESC key to close
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeModal(modal);
        }
      });
    });
  }

  function openModal(modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Focus management for accessibility
    const closeBtn = modal.querySelector('.jury-modal-close');
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    
    // Return focus to the triggering card
    const triggerCard = document.querySelector('.juror-card[data-modal]:focus');
    if (triggerCard) {
      triggerCard.focus();
    }
  }
})();
