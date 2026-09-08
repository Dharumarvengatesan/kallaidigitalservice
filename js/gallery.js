/**
 * KallaiDigitalSurvey - Gallery Filtering & Lightbox Modal System
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.gal-filter-btn, .filter-btn, .filter-btn-sm');
  const galleryItems = document.querySelectorAll('.gal-item, .gallery-item');
  const viewAllBtn = document.getElementById('btn-view-all-projects');

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
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 2. Fullscreen Lightbox Modal System
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose') || document.querySelector('.lightbox-close');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentList = [];
  let currentIndex = 0;

  function getActiveGalleryList() {
    return Array.from(document.querySelectorAll('.gal-item:not([style*="display: none"]), .gallery-item:not([style*="display: none"]), .eq-card, .about-img-box'));
  }

  function updateLightboxContent(index) {
    if (!currentList || currentList.length === 0) return;
    if (index < 0) index = currentList.length - 1;
    if (index >= currentList.length) index = 0;
    currentIndex = index;

    const element = currentList[currentIndex];
    if (!element) return;

    const imgElement = element.querySelector('img');
    const titleElement = element.querySelector('span, h3, h4, h5, .eq-title');
    const categoryElement = element.querySelector('small, p, .eq-sub');

    if (imgElement && lightboxImg) {
      lightboxImg.src = imgElement.src;
      lightboxImg.alt = imgElement.alt || 'KallaiDigitalSurvey Survey Image';
    }

    if (lightboxTitle) {
      lightboxTitle.innerText = titleElement ? titleElement.innerText : 'KallaiDigitalSurvey Survey Project';
    }

    if (lightboxCategory) {
      lightboxCategory.innerText = categoryElement ? categoryElement.innerText : 'Land & Engineering Digital Survey';
    }

    if (lightboxCounter) {
      lightboxCounter.innerText = `${currentIndex + 1} / ${currentList.length}`;
    }
  }

  function openLightbox(index = 0) {
    currentList = getActiveGalleryList();
    if (currentList.length === 0) return;

    updateLightboxContent(index);
    if (lightboxModal) {
      lightboxModal.style.display = 'flex';
      lightboxModal.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.style.display = 'none';
      lightboxModal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  // Click on any gallery image to open Lightbox
  const clickableElements = document.querySelectorAll('.gal-item, .gallery-item, .eq-card, .about-img-box');
  clickableElements.forEach((el) => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      currentList = getActiveGalleryList();
      const idx = currentList.indexOf(el);
      openLightbox(idx !== -1 ? idx : 0);
    });
  });

  // Next / Previous Navigation
  lightboxNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightboxContent(currentIndex + 1);
  });

  lightboxPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightboxContent(currentIndex - 1);
  });

  // Close Lightbox
  lightboxClose?.addEventListener('click', closeLightbox);

  lightboxModal?.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard Arrow & Escape controls
  document.addEventListener('keydown', (e) => {
    if (lightboxModal?.style.display === 'flex') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') updateLightboxContent(currentIndex + 1);
      if (e.key === 'ArrowLeft') updateLightboxContent(currentIndex - 1);
    }
  });

  // "View All Projects" Button Action: Reset filter, scroll, and open Lightbox Image Viewer
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 1. Reset filter to 'all'
      filterBtns.forEach(b => {
        if (b.getAttribute('data-filter') === 'all') {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      galleryItems.forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
      });

      // 2. Scroll to gallery section
      const gallerySec = document.getElementById('gallery');
      if (gallerySec) {
        const topPos = gallerySec.getBoundingClientRect().top + window.pageYOffset - 65;
        window.scrollTo({ top: topPos, behavior: 'smooth' });
      }

      // 3. Open full Lightbox viewer starting with 1st image
      setTimeout(() => {
        openLightbox(0);
      }, 300);
    });
  }
});
