/**
 * HAMPTON ROADS PRIMARY CARE - INDEX3 JAVASCRIPT
 * Agriko-Inspired Healthcare UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initHeroSlider();
  initServiceFilters();
  initInsuranceDeck();
  initBookingModal();
  initAppointmentForms();
  initBackToTop();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   STICKY HEADER ON SCROLL
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
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
    if (drawer.classList.contains('is-open')) {
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
   HERO SLIDER (SMOOTH FADE IN CROSSFADE TRANSITIONS)
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-bg-layer .hero-bg-img');
  const prevBtn = document.querySelector('#heroPrevBtn');
  const nextBtn = document.querySelector('#heroNextBtn');
  if (!slides.length) return;

  let currentIdx = 0;
  let isTransitioning = false;

  function setSlide(newIdx) {
    if (isTransitioning) return;
    isTransitioning = true;

    const nextIdx = (newIdx + slides.length) % slides.length;
    if (nextIdx === currentIdx) {
      isTransitioning = false;
      return;
    }

    slides[currentIdx].classList.remove('active');
    slides[nextIdx].classList.add('active');
    currentIdx = nextIdx;

    setTimeout(() => {
      isTransitioning = false;
    }, 1400);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      setSlide(currentIdx - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      setSlide(currentIdx + 1);
    });
  }

  // Auto rotate every 8 seconds
  setInterval(() => {
    setSlide(currentIdx + 1);
  }, 8000);
}

/* --------------------------------------------------------------------------
   SERVICES FILTER TABS
   -------------------------------------------------------------------------- */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.agriko-filter-btn');
  const serviceCards = document.querySelectorAll('.service-agriko-card');
  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal || (category && category.includes(filterVal))) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
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
  const openTriggers = document.querySelectorAll('[data-open-modal="booking"]');
  const serviceSelect = modalBackdrop.querySelector('#modalService');
  const providerSelect = modalBackdrop.querySelector('#modalProvider');

  function openModal(serviceName = '', providerName = '', insuranceName = '') {
    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (serviceSelect && serviceName) {
      serviceSelect.value = serviceName;
    }
    if (providerSelect && providerName) {
      providerSelect.value = providerName;
    }
    const timingInput = modalBackdrop.querySelector('#modalTiming');
    if (timingInput && insuranceName) {
      timingInput.value = `Verify Insurance Coverage: ${insuranceName}`;
    }
  }

  function closeModal() {
    modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  openTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const s = trigger.getAttribute('data-service') || '';
      const p = trigger.getAttribute('data-provider') || '';
      const ins = trigger.getAttribute('data-insurance') || '';
      openModal(s, p, ins);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   APPOINTMENT FORM SUBMISSIONS & VALIDATION
   -------------------------------------------------------------------------- */
function initAppointmentForms() {
  const forms = document.querySelectorAll('.appointment-booking-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="fullName"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const emailInput = form.querySelector('[name="email"]');
      const serviceSelect = form.querySelector('[name="service"]');
      const feedbackEl = form.querySelector('.form-alert-feedback') || createFeedbackEl(form);

      if (!nameInput.value.trim() || !phoneInput.value.trim() || !emailInput.value.trim()) {
        showFeedback(feedbackEl, 'Please fill in all required fields (Full Name, Phone, and Email).', 'is-error');
        return;
      }

      const phonePattern = /^[0-9+()#&*-=\s.]{7,}$/;
      if (!phonePattern.test(phoneInput.value.trim())) {
        showFeedback(feedbackEl, 'Please enter a valid phone number so our clinic team can contact you.', 'is-error');
        return;
      }

      const patientName = nameInput.value.trim();
      const serviceSelected = serviceSelect ? serviceSelect.value : 'Primary Care';

      const successHtml = `
        <strong>Thank you, ${patientName}!</strong><br>
        Your appointment request for <strong>${serviceSelected}</strong> has been received. Our clinic coordinator will contact you at <strong>${phoneInput.value.trim()}</strong> during business hours to confirm your scheduled time.
        <br><br>
        <a href="https://www.optimantra.com/optimus/patient/patientaccess/servicesall?pid=UlpEbWIxZStkWGpjZ2NWYVVuY1ppdz09&lid=MlQxVktvUUJPbnI1WXJ2Uk9ISmFtZz09" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="display:inline-flex; margin-top:4px;">
          Book Directly on OptiMantra Portal &rarr;
        </a>
      `;

      showFeedback(feedbackEl, successHtml, 'is-success');
      form.reset();
    });
  });

  function createFeedbackEl(form) {
    const div = document.createElement('div');
    div.className = 'form-alert-feedback';
    form.insertBefore(div, form.firstChild);
    return div;
  }

  function showFeedback(el, html, statusClass) {
    el.className = `form-alert-feedback ${statusClass}`;
    el.innerHTML = html;
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* --------------------------------------------------------------------------
   BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.querySelector('#backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   SMOOTH SCROLLING FOR INTERNAL ANCHORS
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   EDUCATION INFO CONSULTATION HANDLER
   -------------------------------------------------------------------------- */
window.openEducationInfo = function(topic) {
  const modal = document.querySelector('#bookingModal');
  const serviceSelect = document.querySelector('#modalService');
  const notesField = document.querySelector('#modalNotes');
  
  if (serviceSelect) {
    if (topic === 'hypertension' || topic === 'heart') {
      serviceSelect.value = 'Chronic Disease Management';
    } else if (topic === 'diabetes') {
      serviceSelect.value = 'Preventive Health Screenings';
    } else if (topic === 'stroke' || topic === 'cardiac') {
      serviceSelect.value = 'General Medical Consultation';
    } else if (topic === 'smoking') {
      serviceSelect.value = 'Nutrition and Weight Management Advice';
    }
  }

  if (notesField && !notesField.value) {
    notesField.value = `Interested in clinical guidance and preventive wellness regarding ${topic}.`;
  }

  if (modal) {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
};

/* --------------------------------------------------------------------------
   INTERACTIVE CARE & COVERAGE COMMAND DECK
   -------------------------------------------------------------------------- */
function initInsuranceDeck() {
  const deck = document.querySelector('#insurance');
  if (!deck) return;

  const filterPills = deck.querySelectorAll('.insurance-filter-pill');
  const searchInput = deck.querySelector('#insuranceSearchInput');
  const searchClear = deck.querySelector('#insuranceSearchClear');
  const cards = deck.querySelectorAll('.coverage-matrix-card');
  const statusText = deck.querySelector('#insuranceShowingText');
  const noMatchBox = deck.querySelector('#insuranceNoMatch');

  let activeFilter = 'all';

  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let matchCount = 0;

    cards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const keywords = card.getAttribute('data-keywords') || '';
      const cardText = card.textContent.toLowerCase();

      const matchesCategory = (activeFilter === 'all') || (category === activeFilter);
      const matchesSearch = !query || keywords.includes(query) || cardText.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        matchCount++;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(8px)';
        card.style.display = 'none';
      }
    });

    // Update status text
    if (statusText) {
      if (query) {
        statusText.textContent = `Found ${matchCount} network${matchCount === 1 ? '' : 's'} matching "${query}"`;
      } else if (activeFilter === 'all') {
        statusText.textContent = `Showing all 8 verified coverage networks`;
      } else if (activeFilter === 'gov') {
        statusText.textContent = `Showing 3 state & military networks`;
      } else if (activeFilter === 'commercial') {
        statusText.textContent = `Showing 3 commercial health networks`;
      } else if (activeFilter === 'financial') {
        statusText.textContent = `Showing 2 financial assistance & HSA programs`;
      }
    }

    // Toggle No Match state
    if (noMatchBox) {
      if (matchCount === 0) {
        noMatchBox.style.display = 'block';
      } else {
        noMatchBox.style.display = 'none';
      }
    }
  }

  // Filter Pill Click Handlers
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      activeFilter = pill.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  // Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const val = searchInput.value.trim();
      if (searchClear) {
        searchClear.style.display = val.length > 0 ? 'flex' : 'none';
      }
      if (val.length > 0 && activeFilter !== 'all') {
        filterPills.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });
        const allPill = deck.querySelector('.insurance-filter-pill[data-filter="all"]');
        if (allPill) {
          allPill.classList.add('active');
          allPill.setAttribute('aria-selected', 'true');
        }
        activeFilter = 'all';
      }
      applyFilters();
    });
  }

  // Search Clear Handler
  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.style.display = 'none';
      searchInput.focus();
      applyFilters();
    });
  }
}

