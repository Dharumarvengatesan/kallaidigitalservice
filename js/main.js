/**
 * KallaiDigitalService - Main JavaScript Logic
 * Handles Sticky Navigation, Mobile Menu, Animated Stat Counters,
 * FAQ Accordion, Form Validation & Scroll Effects.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar & Shadow Effect
  const header = document.querySelector('.header');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
      backToTopBtn?.classList.add('show');
    } else {
      header?.classList.remove('scrolled');
      backToTopBtn?.classList.remove('show');
    }
    
    // Highlight Active Nav Link based on scroll position
    highlightActiveNavLink();
  });

  // Back to Top Scroll
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('active');
      const icon = mobileToggle?.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    });
  });

  // 3. Highlight Active Link on Scroll
  function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        link?.classList.add('active');
      } else {
        link?.classList.remove('active');
      }
    });
  }

  // 4. Animated Counters for Statistics Section
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  function animateCounters() {
    const whySection = document.querySelector('.why-choose-section');
    if (!whySection) return;

    const sectionPos = whySection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.3;

    if (sectionPos < screenPos && !animated) {
      statNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        let count = 0;
        const speed = target / 50;

        const updateCount = () => {
          count += speed;
          if (count < target) {
            counter.innerText = Math.ceil(count) + suffix;
            setTimeout(updateCount, 30);
          } else {
            counter.innerText = target + suffix;
          }
        };

        updateCount();
      });
      animated = true;
    }
  }

  window.addEventListener('scroll', animateCounters);

  // 5. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const faqAnswer = faqItem.querySelector('.faq-answer');
      const isOpen = faqItem.classList.contains('active');

      // Close all other open FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      // Toggle current
      if (!isOpen && faqAnswer) {
        faqItem.classList.add('active');
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
      }
    });
  });

  // 6. Contact Form Real-time Validation & Submission
  const contactForm = document.getElementById('surveyContactForm');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;

    if (!name || !phone || !service) {
      showNotification('Please fill in your Name, Phone Number, and select a Service.', 'error');
      return;
    }

    // Phone number basic check
    if (phone.length < 8) {
      showNotification('Please enter a valid phone number.', 'error');
      return;
    }

    // Success feedback
    showNotification('Thank you! Your survey inquiry has been submitted. Our chief engineer will call you shortly.', 'success');
    contactForm.reset();
  });

  // Simple Notification Toast
  function showNotification(message, type = 'success') {
    let toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: #ffffff;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      z-index: 9999;
      font-weight: 600;
      font-size: 0.95rem;
      max-width: 380px;
      transition: all 0.3s ease;
    `;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
});
