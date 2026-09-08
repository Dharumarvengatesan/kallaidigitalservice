/**
 * KallaiDigitalService - Gallery & Image Viewer Logic
 * Handles Masonry filter tabs & Fullscreen Lightbox Modal for Home Screen Images.
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn, .filter-btn-sm');
  const galleryItems = document.querySelectorAll('.gallery-item');

  // 1. Gallery Filter System
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === itemCategory) {
          item.style.display = 'block';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 2. Fullscreen Lightbox Modal System for Home Screen Images
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  // Target all clickable image containers across the Home Screen
  const clickableElements = document.querySelectorAll('.gallery-item, .equipment-card-sm, .about-img-box, .hero-img-card');
  let currentList = [];
  let currentIndex = 0;

  clickableElements.forEach((el) => {
    el.style.cursor = 'pointer';
    
    el.addEventListener('click', () => {
      // Build active list of visible elements
      currentList = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"]), .equipment-card-sm, .about-img-box, .hero-img-card'));
      currentIndex = currentList.indexOf(el);

      if (currentIndex !== -1) {
        updateLightboxContent(currentList[currentIndex]);
        lightboxModal?.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function updateLightboxContent(element) {
    if (!element) return;

    const imgElement = element.querySelector('img');
    const titleElement = element.querySelector('h4, h5, .gallery-title, .panel-title');
    const categoryElement = element.querySelector('.gallery-category-badge, span, p');

    if (imgElement && lightboxImg) {
      lightboxImg.src = imgElement.src;
      lightboxImg.alt = imgElement.alt || 'KallaiDigitalService Survey Image';
    }

    if (lightboxTitle) {
      lightboxTitle.innerText = titleElement ? titleElement.innerText : 'KallaiDigitalService Survey Project';
    }

    if (lightboxCategory) {
      lightboxCategory.innerText = categoryElement ? categoryElement.innerText : 'Land & Engineering Digital Survey';
    }
  }

  // Next & Prev Slider Controls
  lightboxNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentList.length === 0) return;
    currentIndex = (currentIndex + 1) % currentList.length;
    updateLightboxContent(currentList[currentIndex]);
  });

  lightboxPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentList.length === 0) return;
    currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    updateLightboxContent(currentList[currentIndex]);
  });

  // Close Lightbox Function
  function closeLightbox() {
    lightboxModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose?.addEventListener('click', closeLightbox);

  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard Shortcuts (Esc to close, Left/Right arrows to navigate)
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal?.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      lightboxNext?.click();
    } else if (e.key === 'ArrowLeft') {
      lightboxPrev?.click();
    }
  });
});
