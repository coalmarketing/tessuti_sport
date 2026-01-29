/**
 * Product Gallery Lightbox
 * Vanilla JS implementation with keyboard navigation, accessibility, and mobile support
 */

class GalleryLightbox {
  constructor(galleryElement) {
    this.gallery = galleryElement;
    this.images = [];
    this.currentIndex = 0;
    this.lightboxElement = null;
    this.imageElement = null;
    this.prevButton = null;
    this.nextButton = null;
    this.closeButton = null;
    this.overlay = null;
    this.focusedElementBeforeOpen = null;

    // Touch handling for mobile swipe
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    // Collect all gallery images
    const galleryItems = this.gallery.querySelectorAll("[data-gallery-item]");
    this.images = Array.from(galleryItems).map((img) => ({
      src: img.src,
      alt: img.alt,
      element: img,
    }));

    if (this.images.length === 0) return;

    // Create lightbox markup
    this.createLightbox();

    // Add click listeners to gallery images
    galleryItems.forEach((img, index) => {
      img.addEventListener("click", () => this.open(index));
    });
  }

  createLightbox() {
    const lightbox = document.createElement("div");
    lightbox.className = "gallery-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Galerie obrázků");
    lightbox.style.display = "none";

    lightbox.innerHTML = `
      <div class="gallery-lightbox__overlay"></div>
      <div class="gallery-lightbox__container">
        <button class="gallery-lightbox__close" aria-label="Zavřít galerii" title="Zavřít (ESC)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        ${
          this.images.length > 1
            ? `
          <button class="gallery-lightbox__arrow gallery-lightbox__arrow--prev" aria-label="Předchozí obrázek" title="Předchozí (←)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button class="gallery-lightbox__arrow gallery-lightbox__arrow--next" aria-label="Další obrázek" title="Další (→)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        `
            : ""
        }
        
        <div class="gallery-lightbox__image-wrapper">
          <img class="gallery-lightbox__image" src="" alt="" />
        </div>
        
        ${
          this.images.length > 1
            ? `
          <div class="gallery-lightbox__counter">
            <span class="gallery-lightbox__counter-current">1</span> / <span class="gallery-lightbox__counter-total">${this.images.length}</span>
          </div>
        `
            : ""
        }
      </div>
    `;

    document.body.appendChild(lightbox);
    this.lightboxElement = lightbox;
    this.overlay = lightbox.querySelector(".gallery-lightbox__overlay");
    this.imageElement = lightbox.querySelector(".gallery-lightbox__image");
    this.closeButton = lightbox.querySelector(".gallery-lightbox__close");
    this.prevButton = lightbox.querySelector(".gallery-lightbox__arrow--prev");
    this.nextButton = lightbox.querySelector(".gallery-lightbox__arrow--next");

    this.bindEvents();
  }

  bindEvents() {
    // Close button
    this.closeButton.addEventListener("click", () => this.close());

    // Overlay click to close
    this.overlay.addEventListener("click", () => this.close());

    // Navigation buttons
    if (this.prevButton) {
      this.prevButton.addEventListener("click", () => this.prev());
    }
    if (this.nextButton) {
      this.nextButton.addEventListener("click", () => this.next());
    }

    // Keyboard navigation
    this.handleKeydown = (e) => {
      if (!this.isOpen()) return;

      switch (e.key) {
        case "Escape":
          this.close();
          break;
        case "ArrowLeft":
          this.prev();
          break;
        case "ArrowRight":
          this.next();
          break;
      }
    };

    // Touch/swipe handling for mobile
    this.handleTouchStart = (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    };

    this.handleTouchEnd = (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    };
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        this.next();
      } else {
        // Swipe right - previous image
        this.prev();
      }
    }
  }

  open(index) {
    this.currentIndex = index;
    this.focusedElementBeforeOpen = document.activeElement;

    // Update image
    this.updateImage();

    // Show lightbox
    this.lightboxElement.style.display = "flex";

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Add event listeners
    document.addEventListener("keydown", this.handleKeydown);
    if (this.images.length > 1) {
      this.lightboxElement.addEventListener(
        "touchstart",
        this.handleTouchStart
      );
      this.lightboxElement.addEventListener("touchend", this.handleTouchEnd);
    }

    // Focus close button for accessibility
    setTimeout(() => this.closeButton.focus(), 100);

    // Trap focus
    this.trapFocus();
  }

  close() {
    this.lightboxElement.style.display = "none";
    document.body.style.overflow = "";

    // Remove event listeners
    document.removeEventListener("keydown", this.handleKeydown);
    this.lightboxElement.removeEventListener(
      "touchstart",
      this.handleTouchStart
    );
    this.lightboxElement.removeEventListener("touchend", this.handleTouchEnd);

    // Return focus to clicked element
    if (this.focusedElementBeforeOpen) {
      this.focusedElementBeforeOpen.focus();
    }
  }

  next() {
    if (this.images.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  }

  prev() {
    if (this.images.length <= 1) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  }

  updateImage() {
    const currentImage = this.images[this.currentIndex];
    this.imageElement.src = currentImage.src;
    this.imageElement.alt = currentImage.alt;

    // Update counter if present
    const counterCurrent = this.lightboxElement.querySelector(
      ".gallery-lightbox__counter-current"
    );
    if (counterCurrent) {
      counterCurrent.textContent = this.currentIndex + 1;
    }
  }

  isOpen() {
    return (
      this.lightboxElement && this.lightboxElement.style.display !== "none"
    );
  }

  trapFocus() {
    const focusableElements = this.lightboxElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    this.handleFocusTrap = (e) => {
      if (!this.isOpen()) return;

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", this.handleFocusTrap);
  }
}

// Initialize lightbox for all galleries on page load
document.addEventListener("DOMContentLoaded", () => {
  const galleries = document.querySelectorAll("[data-gallery]");
  galleries.forEach((gallery) => {
    new GalleryLightbox(gallery);
  });
});
