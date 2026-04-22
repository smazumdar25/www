'use strict';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const toggleClass = (element, className = 'active') => {
  if (element) element.classList.toggle(className);
};

window.addEventListener('DOMContentLoaded', () => {
  /* =========================
     Sidebar toggle (mobile)
     ========================= */
  // const sidebar = $('[data-sidebar]');
  // const sidebarBtn = $('[data-sidebar-btn]');

  // if (sidebar && sidebarBtn) {
  //   sidebarBtn.addEventListener('click', () => toggleClass(sidebar));
  // }

  /* =========================
     Typing "I am ..." effect
     ========================= */
  const dynamicText = $('.dynamic');

  if (dynamicText) {
    const titles = [
      'Data Scientist',
      'Researcher',
      'Student',
      'Tech Enthusiast',
      'Author',
      'Innovator',
      'Entrepreneur'
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = () => {
      const currentTitle = titles[titleIndex];
      dynamicText.textContent = currentTitle.substring(0, charIndex);

      if (!isDeleting && charIndex < currentTitle.length) {
        charIndex++;
        setTimeout(typeEffect, 90);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 45);
      } else if (!isDeleting && charIndex === currentTitle.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1200);
      } else {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        setTimeout(typeEffect, 250);
      }
    };

    typeEffect();
  }

  /* =========================
     Portfolio/project filter
     ========================= */
  const select = $('[data-select]');
  const selectValue = $('[data-selecct-value]');
  const selectItems = $$('[data-select-item]');
  const filterButtons = $$('[data-filter-btn]');
  const filterItems = $$('[data-filter-item]');

  const runFilter = (selectedValue) => {
    filterItems.forEach((item) => {
      const matched =
        selectedValue === 'all' || selectedValue === item.dataset.category;
      item.classList.toggle('active', matched);
    });
  };

  if (select) {
    select.addEventListener('click', () => toggleClass(select));
  }

  selectItems.forEach((item) => {
    item.addEventListener('click', function () {
      const selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      if (select) select.classList.remove('active');
      runFilter(selectedValue);
    });
  });

  let lastFilterButton = filterButtons[0] || null;

  filterButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const selectedValue = this.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = this.innerText;
      runFilter(selectedValue);

      if (lastFilterButton) lastFilterButton.classList.remove('active');
      this.classList.add('active');
      lastFilterButton = this;
    });
  });

  /* =========================
     Page navigation
     ========================= */
  const navLinks = $$('[data-nav-link]');
  const pages = $$('[data-page]');
  const pageTitle = $('#content-page-title');

  const titleMap = {
    about: 'About Me',
    experience: 'Experience',
    publications: 'Publications',
    contact: 'Contact'
  };

  const updatePageTitle = (targetPage) => {
    if (!pageTitle) return;
    pageTitle.textContent = titleMap[targetPage] || targetPage;
  };

  const goToPage = (targetPage) => {
    navLinks.forEach((nav) => {
      const isTarget = nav.textContent.trim().toLowerCase() === targetPage;
      nav.classList.toggle('active', isTarget);
    });

    pages.forEach((page) => {
      const isTarget = page.dataset.page.toLowerCase() === targetPage;
      page.classList.toggle('active', isTarget);

      if (isTarget) {
        page.scrollTop = 0;
      }
    });

    updatePageTitle(targetPage);
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetPage = link.textContent.trim().toLowerCase();
      goToPage(targetPage);
    });
  });

  const activeLink = $('.navbar-link.active');
  if (activeLink) {
    updatePageTitle(activeLink.textContent.trim().toLowerCase());
  }

  /* =========================
     Sidebar shortcut -> Contact
     ========================= */
  const contactShortcut = $('#contact-shortcut');

  if (contactShortcut) {
    contactShortcut.addEventListener('click', (event) => {
      event.preventDefault();
      goToPage('contact');
    });
  }

  /* =========================
     Publications filter
     ========================= */
  const pubFilterButtons = $$('[data-filter]');
  const publicationItems = $$('.pub-list li');

  pubFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.getAttribute('data-filter');

      pubFilterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');

      publicationItems.forEach((item) => {
        const matched = selected === 'all' || item.dataset.type === selected;
        item.style.display = matched ? 'block' : 'none';
      });
    });
  });

  /* =========================
     Skills auto-scroll + manual drag
     ========================= */
  const skillsList = $('.skills-marquee .clients-list');

  if (skillsList) {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const isDesktop = () => window.innerWidth >= 1024;

    if (!skillsList.dataset.loopReady) {
      const originals = [...skillsList.children];
      originals.forEach((item) => {
        skillsList.appendChild(item.cloneNode(true));
      });
      skillsList.dataset.loopReady = 'true';
    }

    let autoMove = true;
    let dragging = false;
    let startX = 0;
    let startLeft = 0;

    const animateSkills = () => {
      if (autoMove && !dragging && isDesktop() && !prefersReducedMotion) {
        skillsList.scrollLeft += 1;

        if (skillsList.scrollLeft >= skillsList.scrollWidth / 2) {
          skillsList.scrollLeft = 0;
        }
      }

      requestAnimationFrame(animateSkills);
    };

    skillsList.addEventListener('mouseenter', () => {
      autoMove = false;
    });

    skillsList.addEventListener('mouseleave', () => {
      if (!dragging) autoMove = true;
    });

    skillsList.addEventListener('pointerdown', (event) => {
      dragging = true;
      autoMove = false;
      startX = event.clientX;
      startLeft = skillsList.scrollLeft;
      skillsList.classList.add('dragging');

      if (skillsList.setPointerCapture) {
        skillsList.setPointerCapture(event.pointerId);
      }
    });

    skillsList.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      skillsList.scrollLeft = startLeft - delta;
    });

    const stopDragging = () => {
      dragging = false;
      autoMove = true;
      skillsList.classList.remove('dragging');
    };

    skillsList.addEventListener('pointerup', stopDragging);
    skillsList.addEventListener('pointercancel', stopDragging);
    skillsList.addEventListener('pointerleave', () => {
      if (dragging) stopDragging();
    });

    skillsList.addEventListener(
      'wheel',
      (event) => {
        event.preventDefault();
        skillsList.scrollLeft += event.deltaY + event.deltaX;
      },
      { passive: false }
    );

    animateSkills();
  }

  /* =========================
     Contact form validation
     ========================= */
  const form = $('[data-form]');
  const formInputs = $$('[data-form-input]');
  const formBtn = $('[data-form-btn]');

  const syncFormButton = () => {
    if (!form || !formBtn) return;

    if (form.checkValidity()) {
      formBtn.removeAttribute('disabled');
    } else {
      formBtn.setAttribute('disabled', '');
    }
  };

  formInputs.forEach((input) => {
    input.addEventListener('input', syncFormButton);
  });

  syncFormButton();

  /* =========================
     Contact form submission
     ========================= */
  const contactForm = $('#contact-form');
  const status = $('#form-status');

  if (contactForm && status) {
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    const submitBtn = contactForm.querySelector(
      'button[type="submit"], [data-form-btn]'
    );

    const setStatus = (text, cssClass = '') => {
      status.className = `form-status ${cssClass}`.trim();
      status.textContent = text;
    };

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const fullname = contactForm.fullname?.value?.trim();
      const email = contactForm.email?.value?.trim();
      const message = contactForm.message?.value?.trim();

      if (!fullname || !email || !message) {
        setStatus('❗ Please fill out all fields.', 'error show');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-disabled', 'true');
      }

      setStatus('⏳ Sending...', 'loading show');

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      try {
        const data = {
          fullname,
          email,
          message
        };

        const res = await fetch(
          'https://script.google.com/macros/s/AKfycbxejQ_fRiPJ6XD8bNem8l-ToDuSkNkYnXQNpM36HrsMZBVNzxt_fq209LLY_ZyRBzt7yQ/exec',
          {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            signal: controller.signal
          }
        );

        clearTimeout(timeout);

        const wasOpaque = res && res.type === 'opaque';

        if (wasOpaque || (res && res.ok)) {
          setStatus('✅ Message sent successfully!', 'success show');
          contactForm.reset();
          syncFormButton();
          setTimeout(() => status.classList.remove('show'), 3000);
        } else {
          setStatus('❌ Failed to send. Please try again.', 'error show');
        }
      } catch (error) {
        console.error(error);
        setStatus(
          '❌ Failed to send. Please check your connection and try again.',
          'error show'
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.setAttribute('aria-disabled', 'false');
        }
      }
    });
  }
});