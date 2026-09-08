/**
 * KallaiDigitalService - Gallery & Lightbox JavaScript Logic
 * Handles Masonry filter tabs & Fullscreen Lightbox Modal Slider.
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  // 1. Gallery Filtering System
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || filterValue === itemCategory) {
          item.classList.remove('hide');
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // 2. Fullscreen Lightbox Modal System
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentGalleryList = [];
  let currentIndex = 0;

  // Open Lightbox on item click
  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      // Get all currently visible items for correct slider index
      currentGalleryList = Array.from(document.querySelectorAll('.gallery-item:not(.hide)'));
      currentIndex = currentGalleryList.indexOf(item);

      if (currentIndex !== -1) {
        updateLightboxContent(currentGalleryList[currentIndex]);
        lightboxModal?.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
      }
    });
  });

  function updateLightboxContent(item) {
    if (!item) return;

    const imgElement = item.querySelector('img');
    const titleElement = item.querySelector('.gallery-title');
    const categoryElement = item.querySelector('.gallery-category-badge');

    if (imgElement && lightboxImg) {
      lightboxImg.src = imgElement.src;
      lightboxImg.alt = imgElement.alt || 'Survey Project';
    }

    if (titleElement && lightboxTitle) {
      lightboxTitle.innerText = titleElement.innerText;
    }

    if (categoryElement && lightboxCategory) {
      lightboxCategory.innerText = categoryElement.innerText;
    }
  }

  // Next & Prev Controls
  lightboxNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentGalleryList.length === 0) return;
    currentIndex = (currentIndex + 1) % currentGalleryList.length;
    updateLightboxContent(currentGalleryList[currentIndex]);
  });

  lightboxPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentGalleryList.length === 0) return;
    currentIndex = (currentIndex - 1 + currentGalleryList.length) % currentGalleryList.length;
    updateLightboxContent(currentGalleryList[currentIndex]);
  });

  // Close Lightbox
  function closeLightbox() {
    lightboxModal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose?.addEventListener('click', closeLightbox);

  // Close on outside click
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard navigation (Escape, Arrow Left, Arrow Right)
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
