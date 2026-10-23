/**
 * HAMPTON ROADS PRIMARY CARE - SCRIPT 2
 * Matches the reference design layout interactions:
 * - Bio drawers toggle
 * - Mobile menu toggle
 * - Contact form handler
 * - Active scroll spy
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initBioDrawers();
  initScrollSpy();
  initFormHandler();
});

/* Mobile Menu Toggle */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    drawer.classList.toggle('is-open');
  });

  // Close when clicking on any mobile link
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('is-open');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      drawer.classList.remove('is-open');
    }
  });
}

/* Clinician Bio Drawer Expand/Collapse */
function initBioDrawers() {
  const buttons = document.querySelectorAll('.read-more-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const bioEl = document.getElementById(targetId);
      if (!bioEl) return;

      const isExpanded = bioEl.classList.contains('is-expanded');
      const labelSpan = btn.querySelector('span');
      const svgIcon = btn.querySelector('svg');

      if (isExpanded) {
        bioEl.classList.remove('is-expanded');
        if (labelSpan) labelSpan.textContent = 'Read Full Bio';
        if (svgIcon) svgIcon.style.transform = 'rotate(0deg)';
      } else {
        bioEl.classList.add('is-expanded');
        if (labelSpan) labelSpan.textContent = 'Show Less';
        if (svgIcon) svgIcon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* Active Navigation Scrollspy */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-split-link, .nav-link-anchor');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('is-active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('is-active');
        }
      });
    }
  }, { passive: true });
}

/* Contact Form Handler */
function initFormHandler() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  window.handleFormSubmit = function() {
    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      alert(`Thank you, ${name}! Your message has been received. Our clinic team at Hampton Roads Primary Care will contact you at ${phone || email} shortly.`);
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 800);
  };
}
