/**
 * NOMINEES PAGE SYSTEM
 * Deep Linking + Modal System + Category Navigation
 */

class NomineePageSystem {
  constructor() {
    this.currentSection = null;
    this.init();
  }

  init() {
    this.setupCategoryNavigation();
    this.setupDeepLinking();
    this.setupNomineeCards();
    this.handleInitialHash();
  }

  /**
   * Setup sticky category navigation
   */
  setupCategoryNavigation() {
    const navItems = document.querySelectorAll('.category-nav .nav-item');
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href').replace('#', '');
        this.scrollToSection(targetId);
      });
    });

    // Update active nav item on scroll
    window.addEventListener('scroll', () => {
      this.updateActiveNavItem();
    }, { passive: true });
  }

  /**
   * Update active navigation item based on scroll position
   */
  updateActiveNavItem() {
    const sections = document.querySelectorAll('.nominee-section[id]');
    const navItems = document.querySelectorAll('.category-nav .nav-item');
    
    let activeSection = null;
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 200) {
        activeSection = section.id;
      }
    });
    
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && href.includes(activeSection)) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /**
   * Scroll smoothly to a nominee section
   */
  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const navHeight = document.querySelector('.category-nav')?.offsetHeight || 80;
    const offset = section.offsetTop - navHeight - 20;

    window.scrollTo({
      top: offset,
      behavior: 'smooth'
    });

    // Update URL hash
    window.history.replaceState(null, null, `#${sectionId}`);
    this.updateActiveNavItem();
  }

  /**
   * Setup deep linking from Awards page
   */
  setupDeepLinking() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.handleHashNavigation();
    });
  }

  /**
   * Handle initial hash on page load
   */
  handleInitialHash() {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        this.handleHashNavigation();
      }, 100);
    }
  }

  /**
   * Process hash navigation
   */
  handleHashNavigation() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      this.scrollToSection(hash);
    }
  }

  /**
   * Setup nominee card interactions
   */
  setupNomineeCards() {
    // Video nominee cards
    document.querySelectorAll('.nominee-card[data-youtube-id]').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.nominee-info')) {
          const videoId = card.dataset.youtubeId;
          this.openVideoModal(videoId);
        }
      });

      // Add keyboard accessibility
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const videoId = card.dataset.youtubeId;
          this.openVideoModal(videoId);
        }
      });
    });

    // Legendary creator cards
    document.querySelectorAll('.legendary-card, .view-details-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const creatorId = el.dataset.creatorId || el.dataset.modal;
        if (creatorId) {
          this.openCreatorModal(creatorId);
        }
      });

      if (el.classList.contains('legendary-card')) {
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const creatorId = el.dataset.creatorId || el.dataset.modal;
            if (creatorId) {
              this.openCreatorModal(creatorId);
            }
          }
        });
      }
    });
  }

  /**
   * Open video modal
   */
  openVideoModal(videoId) {
    this.ensureModalExists();
    
    const modal = document.querySelector('.nominee-modal');
    const videoContainer = modal.querySelector('.video-container');
    const creatorContainer = modal.querySelector('.creator-container');
    const iframe = modal.querySelector('iframe');

    // Pause parallax
    if (window.parallaxSystem) {
      window.parallaxSystem.isAnimating = false;
    }

    // Set video source
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

    // Show video container, hide creator container
    videoContainer.style.display = 'block';
    creatorContainer.style.display = 'none';

    // Open modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    // Focus close button for accessibility
    setTimeout(() => {
      modal.querySelector('.modal-close').focus();
    }, 100);
  }

  /**
   * Open creator detail modal
   */
  openCreatorModal(creatorId) {
    this.ensureModalExists();

    const modal = document.querySelector('.nominee-modal');
    const videoContainer = modal.querySelector('.video-container');
    const creatorContainer = modal.querySelector('.creator-container');

    // Pause parallax
    if (window.parallaxSystem) {
      window.parallaxSystem.isAnimating = false;
    }

    // Get creator data
    const creatorData = this.getCreatorData(creatorId);
    
    // Build creator content
    creatorContainer.innerHTML = `
      <div class="creator-modal-content">
        <h2 class="creator-modal-title">${creatorData.name}</h2>
        <p class="creator-modal-subtitle">${creatorData.title}</p>
        <div class="creator-modal-body">
          ${creatorData.description}
        </div>
        ${creatorData.website ? `
          <a href="${creatorData.website}" class="creator-website" target="_blank" rel="noopener noreferrer">
            Visit Website
          </a>
        ` : ''}
      </div>
    `;

    // Show creator container, hide video
    videoContainer.style.display = 'none';
    creatorContainer.style.display = 'block';

    // Open modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');

    // Focus close button
    setTimeout(() => {
      modal.querySelector('.modal-close').focus();
    }, 100);
  }

  /**
   * Get creator data
   */
  getCreatorData(id) {
    // Fetch from data attribute or use mock data
    const creators = {
      '1': {
        name: 'DR. ARIS THORNE',
        title: 'Honorary Laureate',
        description: `
          <p>Dr. Aris Thorne's pioneering work in neural rendering has fundamentally transformed the landscape of AI-generated cinema. Over the past decade, his algorithms have enabled unprecedented levels of photorealism in synthetic media.</p>
          <p>His research at the Neural Cinematics Lab has produced groundbreaking techniques in temporal coherence, emotional expression synthesis, and multi-modal narrative generation.</p>
          <p>Key contributions include the Thorne Transform for style-consistent frame interpolation and the Emotive Latent Space theory that enables AI systems to understand and replicate human emotional arcs in visual storytelling.</p>
        `,
        website: 'https://example.com'
      },
      'neural-cinema-studios': {
        name: 'NEURAL CINEMA STUDIOS',
        title: 'Production Innovator',
        description: `
          <p>Neural Cinema Studios stands at the forefront of AI-assisted filmmaking, blending human creativity with machine intelligence. Founded in 2020, the studio has produced over 50 award-winning films using cutting-edge AI tools.</p>
          <p>Their signature approach combines traditional cinematography with neural rendering, creating a unique aesthetic that bridges human artistry and artificial intelligence.</p>
          <p>Studios continues to push boundaries in real-time rendering, AI-assisted editing, and generative visual effects.</p>
        `,
        website: 'https://example.com'
      },
      'echoes-of-tomorrow': {
        name: '\"ECHOES OF TOMORROW\"',
        title: 'Landmark Film',
        description: `
          <p>"Echoes of Tomorrow" represents a watershed moment in AI cinema. This feature-length film, entirely co-created with advanced AI systems, premiered at Sundance and won critical acclaim for its innovative approach to visual storytelling.</p>
          <p>The film demonstrates the potential for AI and human creators to collaborate seamlessly, pushing the boundaries of what's possible in modern cinema.</p>
          <p>Its success has inspired a new generation of filmmakers to explore AI-assisted production techniques.</p>
        `,
        website: 'https://example.com'
      }
    };

    return creators[id] || {
      name: 'UNKNOWN CREATOR',
      title: 'Award Nominee',
      description: '<p>Details coming soon.</p>',
      website: null
    };
  }

  /**
   * Ensure modal exists in DOM
   */
  ensureModalExists() {
    if (document.querySelector('.nominee-modal')) return;

    const modal = document.createElement('div');
    modal.className = 'nominee-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <div class="modal-content">
          <div class="video-container" style="display: none;">
            <iframe width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay"></iframe>
          </div>
          <div class="creator-container" style="display: none;"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup close handlers
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');

    overlay.addEventListener('click', () => this.closeModal());
    closeBtn.addEventListener('click', () => this.closeModal());

    // Escape key close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  /**
   * Close modal
   */
  closeModal() {
    const modal = document.querySelector('.nominee-modal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');

    // Stop video playback
    const iframe = modal.querySelector('iframe');
    if (iframe) {
      iframe.src = '';
    }

    // Resume parallax
    if (window.parallaxSystem) {
      window.parallaxSystem.isAnimating = true;
      window.parallaxSystem.animate();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.nomineeSystem = new NomineePageSystem();
    console.log('[Nominees] System initialized');
  } catch (error) {
    console.error('[Nominees] Initialization failed:', error);
  }
});

// Handle Awards page deep linking to nominees
class AwardsToNomineesBridge {
  static initialize() {
    const awardLinks = document.querySelectorAll('.award-category-link, [data-nominee-category]');
    
    awardLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetSection = link.getAttribute('href') || link.dataset.nomineeCategory;
        if (targetSection) {
          e.preventDefault();
          AwardsToNomineesBridge.navigateToNominees(targetSection);
        }
      });
    });
  }

  static navigateToNominees(sectionId) {
    const nomineePageUrl = '/nominees.html#' + sectionId;
    window.location.href = nomineePageUrl;
  }
}

// Initialize bridge if we're on awards/honors page
if (document.querySelector('.award-category-link, [data-nominee-category]')) {
  document.addEventListener('DOMContentLoaded', () => {
    AwardsToNomineesBridge.initialize();
    console.log('[Awards Bridge] Initialized');
  });
}

// Also initialize if we're on nominees page and have anchor links
if (window.location.pathname.includes('nominees')) {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.nomineeSystem) {
      console.log('[Deep Linking] Active on nominees page');
    }
  });
}
