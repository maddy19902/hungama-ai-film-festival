/**
 * LEGENDARY CREATOR CAROUSEL
 * Auto-rotating carousel with 8-second interval, pause on hover
 * Supports touch navigation on mobile
 */

class LegendaryCreatorCarousel {
  constructor() {
    this.carousel = document.querySelector('[data-carousel="legendary-creator"]');
    
    if (!this.carousel) {
      console.log('[Carousel] Legendary Creator carousel not found');
      return;
    }
    
    this.container = this.carousel.querySelector('.carousel-container');
    this.slides = this.carousel.querySelectorAll('.carousel-slide');
    // Support both old (.carousel-dot) and new (.carousel-indicator) selectors
    this.dots = this.carousel.querySelectorAll('.carousel-dot, .carousel-indicator');
    
    this.currentIndex = 0;
    this.autoPlayInterval = 8000; // 8 seconds
    this.autoPlayTimer = null;
    this.isHovering = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }

  init() {
    if (this.slides.length === 0) {
      console.log('[Carousel] No slides found');
      return;
    }

    // Set up dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToSlide(index);
        this.resetAutoPlay();
      });
    });

    // Set up hover pause
    this.carousel.addEventListener('mouseenter', () => {
      this.isHovering = true;
      this.pauseAutoPlay();
    });

    this.carousel.addEventListener('mouseleave', () => {
      this.isHovering = false;
      this.startAutoPlay();
    });

    // Set up touch/swipe navigation
    this.carousel.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.carousel.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
      this.resetAutoPlay();
    }, { passive: true });

    // Initial setup
    this.goToSlide(0);
    this.startAutoPlay();

    console.log(`[Carousel] Initialized with ${this.slides.length} slides`);
  }

  goToSlide(index) {
    // Ensure index is within bounds
    index = Math.max(0, Math.min(index, this.slides.length - 1));
    this.currentIndex = index;

    // Update slides opacity
    this.slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.remove('opacity-0', 'pointer-events-none');
        slide.classList.add('opacity-100');
        slide.style.opacity = '1';
        slide.style.pointerEvents = 'auto';
      } else {
        slide.classList.remove('opacity-100');
        slide.classList.add('opacity-0', 'pointer-events-none');
        slide.style.opacity = '0';
        slide.style.pointerEvents = 'none';
      }
    });

    // Update dots
    this.updateDots();
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        // Active dot
        dot.style.background = '#dc2626';
        dot.style.border = '2px solid #dc2626';
        dot.style.boxShadow = '0 0 12px rgba(220, 38, 38, 0.4)';
      } else {
        // Inactive dot
        dot.style.background = 'rgba(128, 0, 0, 0.4)';
        dot.style.border = '1px solid rgba(220, 38, 38, 0.5)';
        dot.style.boxShadow = 'none';
      }
    });
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  previousSlide() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  handleSwipe() {
    const swipeThreshold = 50; // Minimum swipe distance
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - show next slide
        this.nextSlide();
      } else {
        // Swiped right - show previous slide
        this.previousSlide();
      }
    }
  }

  startAutoPlay() {
    if (this.isHovering) return;

    this.autoPlayTimer = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayInterval);

    console.log('[Carousel] Auto-play started');
  }

  pauseAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
      console.log('[Carousel] Auto-play paused');
    }
  }

  resetAutoPlay() {
    this.pauseAutoPlay();
    if (!this.isHovering) {
      this.startAutoPlay();
    }
  }

  destroy() {
    this.pauseAutoPlay();
  }
}

// Initialize on DOM ready
let legendaryCarousel = null;

document.addEventListener('DOMContentLoaded', () => {
  legendaryCarousel = new LegendaryCreatorCarousel();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (legendaryCarousel) {
    legendaryCarousel.destroy();
  }
});
