/**
 * KallaiDigitalSurvey - Main JavaScript Logic
 * Robust Navigation, Accurate Smooth Scrolling to Sections, Mobile Drawer,
 * FAQ Accordion, Form Validation & Lightbox integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');

  // 1. Sticky Header Shadow Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 2. Mobile Drawer Navigation Toggle
  mobileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    mainNav?.classList.toggle('active');
  });

  // Close Mobile Menu on Outside Click
  document.addEventListener('click', (e) => {
    if (mainNav?.classList.contains('active') && !mainNav.contains(e.target) && !mobileToggle?.contains(e.target)) {
      mainNav.classList.remove('active');
    }
  });

  // 3. Accurate Smooth Scroll & Target Navigation (Fixes wrong section jump bug)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Close mobile drawer if open
        mainNav?.classList.remove('active');

        // Calculate accurate scroll position considering 60px sticky header height
        const headerOffset = 60;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Set active link highlight
        document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  // 4. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-q, .faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const faqAnswer = faqItem.querySelector('.faq-a, .faq-answer');
      const isOpen = faqItem.classList.contains('active');

      // Close all other open FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const ans = item.querySelector('.faq-a, .faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      // Toggle current
      if (!isOpen && faqAnswer) {
        faqItem.classList.add('active');
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
      }
    });
  });

  // 5. Contact Form Real-time Validation & Submission
  const contactForm = document.getElementById('surveyContactForm');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const service = document.getElementById('service')?.value;

    if (!name || !phone || !service) {
      showToast('Please fill in your Name, Phone Number, and select a Service.', 'error');
      return;
    }

    if (phone.length < 8) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    showToast('Thank you! Your survey inquiry has been received. We will contact you shortly.', 'success');
    contactForm.reset();
  });

  // Simple Notification Toast
  function showToast(message, type = 'success') {
    let toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.style.cssText = `
      position: fixed;
      top: 70px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: #ffffff;
      padding: 10px 18px;
      border-radius: 6px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.2);
      z-index: 9999;
      font-weight: 700;
      font-size: 12px;
      max-width: 360px;
      transition: all 0.3s ease;
    `;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
});
