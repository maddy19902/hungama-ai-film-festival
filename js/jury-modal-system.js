/**
 * JURY MODAL SYSTEM - Hungama AI Film Festival
 * Handles modal opening, closing, and interactions on the jury page
 */

// Store references to modal elements
let juryModalBackdrop;
let juryModal;
let juryModalImage;
let juryModalName;
let juryModalDesignation;
let juryModalCompany;
let juryModalBio;
let juryModalClose;
let scrollPosition = 0;

document.addEventListener('DOMContentLoaded', function() {
  // Only initialize modal system on jury.html page
  const isJuryPage = window.location.pathname.includes('jury.html') || window.location.pathname.endsWith('/jury/');
  
  if (!isJuryPage && !document.body.classList.contains('jury-page')) {
    return;
  }

  // Create modal HTML structure
  createJuryModal();

  // Get all modal element references
  juryModalBackdrop = document.getElementById('juryModalBackdrop');
  juryModal = document.getElementById('juryModal');
  juryModalImage = document.getElementById('juryModalImage');
  juryModalName = document.getElementById('juryModalName');
  juryModalDesignation = document.getElementById('juryModalDesignation');
  juryModalCompany = document.getElementById('juryModalCompany');
  juryModalBio = document.getElementById('juryModalBio');
  juryModalClose = document.getElementById('juryModalClose');

  // Verify modal elements exist
  if (!juryModalBackdrop || !juryModal) {
    console.error('Modal elements not created properly');
    return;
  }

  // Setup event listeners
  setupEventListeners();

  // Add click listeners to all jury cards
  const juryCards = document.querySelectorAll('.jury-card');
  juryCards.forEach((card, index) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function() {
      openJuryModal(index);
    });
  });
});

/**
 * Create the modal HTML structure
 */
function createJuryModal() {
  const modalHTML = `
    <div class="jury-modal-backdrop" id="juryModalBackdrop">
      <div class="jury-modal" id="juryModal">
        <button class="jury-modal__close" id="juryModalClose">&times;</button>
        <div class="jury-modal__content">
          <div class="jury-modal__image-section">
            <img src="" alt="" class="jury-modal__image" id="juryModalImage">
          </div>
          <div class="jury-modal__info">
            <h2 class="jury-modal__name" id="juryModalName"></h2>
            <p class="jury-modal__designation" id="juryModalDesignation"></p>
            <p class="jury-modal__company" id="juryModalCompany"></p>
            <p class="jury-modal__bio" id="juryModalBio"></p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

/**
 * Setup all event listeners for modal interactions
 */
function setupEventListeners() {
  if (!juryModalBackdrop) return;

  // Close button click
  if (juryModalClose) {
    juryModalClose.addEventListener('click', function(e) {
      e.stopPropagation();
      closeJuryModal();
    });
  }

  // Backdrop click (but not on modal itself)
  juryModalBackdrop.addEventListener('click', function(e) {
    if (e.target === this) {
      closeJuryModal();
    }
  });

  // Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (juryModalBackdrop && juryModalBackdrop.classList.contains('active')) {
        closeJuryModal();
      }
    }
  });
}

/**
 * Open modal with juror information
 * @param {number} jurorIndex - Index of the juror (0-11)
 */
function openJuryModal(jurorIndex) {
  // Check if juryMembers data exists
  if (typeof juryMembers === 'undefined') {
    console.error('Jury members data not loaded');
    return;
  }

  const juror = juryMembers[jurorIndex];
  if (!juror) {
    console.error('Juror data not found for index:', jurorIndex);
    return;
  }

  // Populate modal with juror data
  if (juryModalImage) {
    juryModalImage.src = juror.image;
    juryModalImage.alt = juror.name;
  }
  if (juryModalName) juryModalName.textContent = juror.name;
  if (juryModalDesignation) juryModalDesignation.textContent = juror.title;
  if (juryModalCompany) juryModalCompany.textContent = juror.company;
  if (juryModalBio) juryModalBio.textContent = juror.bio;

  // Show modal
  if (juryModalBackdrop) {
    // Save current scroll position before locking
    scrollPosition = window.scrollY;
    
    juryModalBackdrop.classList.add('active');
    
    // Lock scroll without jumping - use negative top position
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = -scrollPosition + 'px';
    document.body.style.width = '100%';
  }
}

/**
 * Close the modal
 */
function closeJuryModal() {
  if (juryModalBackdrop) {
    juryModalBackdrop.classList.remove('active');
    
    // Disable smooth scroll temporarily to prevent animation effect
    const htmlElement = document.documentElement;
    const originalScrollBehavior = htmlElement.style.scrollBehavior || window.getComputedStyle(htmlElement).scrollBehavior;
    htmlElement.style.scrollBehavior = 'auto';
    
    // Clear the body styles that were locking the scroll
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    
    // Restore scroll position immediately without animation
    window.scrollTo(0, scrollPosition);
    
    // Restore original scroll behavior after scroll completes
    requestAnimationFrame(() => {
      htmlElement.style.scrollBehavior = originalScrollBehavior;
    });
  }
}
