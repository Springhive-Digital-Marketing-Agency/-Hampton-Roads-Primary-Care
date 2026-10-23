/**
 * HAMPTON ROADS PRIMARY CARE - HOMEPAGE INTERACTIONS
 * Verified Reference: https://htrpc.com/
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initSmoothScrollSpy();
  initServiceFilters();
  initBookingModal();
  initAppointmentForms();
  initBackToTop();
  initDisconnectedButtons();
  initHeroSlider();
  initProviderBioToggles();
});

/* --------------------------------------------------------------------------
   STICKY HEADER SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');
  const closeBtn = document.querySelector('.drawer-close-btn');
  const navLinks = document.querySelectorAll('.mobile-nav-list a');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   SMOOTH ANCHOR SCROLLING & ACTIVE LINK SPY
   -------------------------------------------------------------------------- */
function initSmoothScrollSpy() {
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id], div[id].section-wrapper');

  // Active section indicator on scroll
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* --------------------------------------------------------------------------
   SERVICES FILTER TABS
   -------------------------------------------------------------------------- */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || (category && category.includes(filterValue))) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   APPOINTMENT BOOKING MODAL
   -------------------------------------------------------------------------- */
function initBookingModal() {
  const modalBackdrop = document.querySelector('#bookingModal');
  if (!modalBackdrop) return;

  const closeBtn = modalBackdrop.querySelector('.modal-close-btn');
  const modalOpenTriggers = document.querySelectorAll('[data-open-modal="booking"]');
  const serviceSelect = modalBackdrop.querySelector('#modalService');
  const providerSelect = modalBackdrop.querySelector('#modalProvider');

  function openModal(serviceName = '', providerName = '') {
    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (serviceSelect && serviceName) {
      serviceSelect.value = serviceName;
    }
    if (providerSelect && providerName) {
      providerSelect.value = providerName;
    }
  }

  function closeModal() {
    modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  modalOpenTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const service = trigger.getAttribute('data-service') || '';
      const provider = trigger.getAttribute('data-provider') || '';
      openModal(service, provider);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   FORM SUBMISSION & VALIDATION HANDLING
   -------------------------------------------------------------------------- */
function initAppointmentForms() {
  const forms = document.querySelectorAll('.appointment-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="fullName"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const emailInput = form.querySelector('[name="email"]');
      const serviceSelect = form.querySelector('[name="service"]');
      const feedbackEl = form.querySelector('.form-feedback') || createFeedbackEl(form);

      // Simple validation
      if (!nameInput.value.trim() || !phoneInput.value.trim() || !emailInput.value.trim()) {
        showFeedback(feedbackEl, 'Please complete all required fields (Name, Phone, and Email).', 'error');
        return;
      }

      // Phone regex check
      const phonePattern = /^[0-9+()#&*-=\s.]{7,}$/;
      if (!phonePattern.test(phoneInput.value.trim())) {
        showFeedback(feedbackEl, 'Please enter a valid telephone contact number.', 'error');
        return;
      }

      // Success State
      const patientName = nameInput.value.trim();
      const serviceSelected = serviceSelect ? serviceSelect.value : 'Appointment';
      
      const successMessage = `
        <strong>Thank you, ${patientName}!</strong><br>
        Your inquiry for <em>${serviceSelected}</em> has been received. Our clinic team at Hampton Roads Primary Care will call you at <strong>${phoneInput.value.trim()}</strong> during business hours to confirm your scheduled time.
        <br><br>
        <div style="margin-top: 10px;">
          <a href="https://www.optimantra.com/optimus/patient/patientaccess/servicesall?pid=UlpEbWIxZStkWGpjZ2NWYVVuY1ppdz09&lid=MlQxVktvUUJPbnI1WXJ2Uk9ISmFtZz09" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="display:inline-flex;">
            Book Instantly on OptiMantra Portal &rarr;
          </a>
        </div>
      `;

      showFeedback(feedbackEl, successMessage, 'success');
      form.reset();
    });
  });

  function createFeedbackEl(form) {
    const div = document.createElement('div');
    div.className = 'form-feedback';
    form.insertBefore(div, form.firstChild);
    return div;
  }

  function showFeedback(el, message, type) {
    el.className = `form-feedback ${type}`;
    el.innerHTML = message;
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* --------------------------------------------------------------------------
   BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backBtn = document.querySelector('.back-to-top-btn');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('is-visible');
    } else {
      backBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   DISCONNECTED PROTOTYPE BUTTONS (NAV MENU REMAINS CONNECTED)
   -------------------------------------------------------------------------- */
function initDisconnectedButtons() {
  document.querySelectorAll('a[href^="javascript:"], a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
}

/* --------------------------------------------------------------------------
   HERO IMAGE SLIDER & FADE-IN / FADE-OUT ANIMATION
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const sliderContainer = document.querySelector('.hero-slider-container');
  if (!sliderContainer) return;

  const slides = sliderContainer.querySelectorAll('.hero-slide');
  const dots = sliderContainer.querySelectorAll('.slider-dot');
  const prevBtn = sliderContainer.querySelector('#heroPrevBtn');
  const nextBtn = sliderContainer.querySelector('#heroNextBtn');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  let isTransitioning = false;
  const slideInterval = 5500; // 5.5s display duration

  function goToSlide(newIndex) {
    if (isTransitioning || newIndex === currentIndex) return;
    isTransitioning = true;

    const currentSlide = slides[currentIndex];
    const nextSlide = slides[newIndex];

    // Keep current slide underneath at full opacity to prevent dimming
    currentSlide.classList.add('is-underneath');
    currentSlide.classList.remove('active');

    // Smooth fade in of incoming slide on top
    nextSlide.classList.add('active');

    // Update pagination indicators
    dots.forEach((dot, idx) => {
      const isActive = idx === newIndex;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    currentIndex = newIndex;

    // Reset transitioning flag and remove underneath state after crossfade
    setTimeout(() => {
      currentSlide.classList.remove('is-underneath');
      isTransitioning = false;
    }, 1150);
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    goToSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, slideInterval);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Next & Previous buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
      startAutoplay();
    });
  }

  // Dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(targetIndex)) {
        goToSlide(targetIndex);
        startAutoplay();
      }
    });
  });

  // Pause on hover so users can examine visual details
  sliderContainer.addEventListener('mouseenter', stopAutoplay);
  sliderContainer.addEventListener('mouseleave', startAutoplay);

  // Keyboard navigation
  sliderContainer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
      startAutoplay();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      startAutoplay();
    }
  });

  // Start rotation
  startAutoplay();
}

/* --------------------------------------------------------------------------
   PROVIDER BIO ACCORDION ("READ MORE")
   -------------------------------------------------------------------------- */
function initProviderBioToggles() {
  const wrappers = document.querySelectorAll('.provider-bio-wrapper');
  if (!wrappers.length) return;

  wrappers.forEach(wrapper => {
    const btn = wrapper.querySelector('.btn-read-bio');
    const content = wrapper.querySelector('.provider-bio-content');
    if (!btn || !content) return;

    btn.addEventListener('click', () => {
      const isOpen = content.classList.contains('is-open');
      const label = btn.querySelector('span');

      if (isOpen) {
        content.classList.remove('is-open');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        if (label) label.textContent = 'Read More';
      } else {
        content.classList.add('is-open');
        btn.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        if (label) label.textContent = 'Read Less';
      }
    });
  });
}

