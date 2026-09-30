/**
 * ResiVolt - Home Generator & Inverter Service Center
 * Core Shared JavaScript
 */

(function () {
  'use strict';

  // 1. Initial State Restoration (Dark Mode & RTL)
  const savedTheme = localStorage.getItem('resivolt_theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  }

  const savedDir = localStorage.getItem('resivolt_dir') || 'ltr';
  document.documentElement.dir = savedDir;

  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initThemeToggle();
    initRtlToggle();
    initDropdowns();
    initMobileMenu();
    initAuthModal();
    initScrollEffects();
    initActiveNav();
    initLoadCalculator();
    initBookingStudio();
    initDiagnosticPills();
    initZoneMapSwitcher();
    initCustomSelects();
  });

  // 2. Branded Preloader
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const hidePreloader = () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 400);
    };

    if (document.readyState === 'complete') {
      hidePreloader();
    } else {
      window.addEventListener('load', hidePreloader);
    }
  }

  // 3. Dark Mode Toggle (#000000 strictly in dark mode)
  function initThemeToggle() {
    const themeBtns = document.querySelectorAll('[data-toggle-theme]');
    themeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        const theme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('resivolt_theme', theme);
        updateThemeIcons();
      });
    });
    updateThemeIcons();
  }

  function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    const sunIcons = document.querySelectorAll('.theme-icon-sun');
    const moonIcons = document.querySelectorAll('.theme-icon-moon');

    sunIcons.forEach((el) => {
      el.style.display = isDark ? 'block' : 'none';
    });
    moonIcons.forEach((el) => {
      el.style.display = isDark ? 'none' : 'block';
    });
  }

  // 4. RTL / LTR Toggle
  function initRtlToggle() {
    const rtlBtns = document.querySelectorAll('[data-toggle-rtl]');
    rtlBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const currentDir = document.documentElement.dir || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        document.documentElement.dir = newDir;
        localStorage.setItem('resivolt_dir', newDir);
        updateRtlBadges(newDir);
      });
    });
    updateRtlBadges(document.documentElement.dir || 'ltr');
  }

  function updateRtlBadges(dir) {
    const badges = document.querySelectorAll('.rtl-text-indicator');
    badges.forEach((b) => {
      b.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  // 5. Desktop Dropdowns - STRICTLY CLICK ONLY (Never Hover)
  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = dropdown.classList.contains('open');

        // Close any other open dropdowns first
        dropdowns.forEach((d) => {
          if (d !== dropdown) {
            d.classList.remove('open');
            d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          dropdown.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        } else {
          dropdown.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
          dropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdowns.forEach((d) => {
          d.classList.remove('open');
          d.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // 6. Mobile Drawer & Accordion
  function initMobileMenu() {
    const openBtn = document.getElementById('mobileMenuOpen');
    const closeBtn = document.getElementById('mobileMenuClose');
    const drawer = document.getElementById('mobileDrawer');
    const backdrop = document.getElementById('mobileBackdrop');
    if (!drawer || !backdrop) return;

    const accordionToggle = drawer.querySelector('.mobile-accordion-toggle');
    const accordionContainer = drawer.querySelector('.mobile-accordion');

    function openMenu() {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
      // Ensure accordion starts closed when opening the drawer
      if (accordionContainer) accordionContainer.classList.remove('open');
    }

    function closeMenu() {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      // Automatically reset accordion on close
      if (accordionContainer) accordionContainer.classList.remove('open');
    }

    if (openBtn) openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);

    // Close mobile menu when any nav item / sub-link is clicked
    const links = drawer.querySelectorAll('a');
    links.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Mobile Accordion for Home: ONLY opens when clicking Home, otherwise automatically closes
    if (accordionToggle && accordionContainer) {
      accordionToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        accordionContainer.classList.toggle('open');
      });

      // Automatically close accordion if clicking anywhere else inside the drawer
      drawer.addEventListener('click', (e) => {
        if (!accordionContainer.contains(e.target)) {
          accordionContainer.classList.remove('open');
        }
      });
    }

    // Automatically close mobile menu and reset page scroll when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1370) {
        closeMenu();
      }
    });
  }

  // 7. Login / Register Modal
  function initAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;

    const openBtns = document.querySelectorAll('[data-open-auth]');
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal;

    function openModal(defaultTab = 'login') {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      switchTab(defaultTab);
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    // Tab switching between Sign In & Register
    const tabBtns = modal.querySelectorAll('.auth-tab-btn');
    const panels = modal.querySelectorAll('.auth-form-panel');

    function switchTab(target) {
      tabBtns.forEach((btn) => {
        if (btn.dataset.tab === target) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      panels.forEach((p) => {
        if (p.id === `authPanel-${target}`) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
      });
    });
  }

  // 8. Scroll Effects & Scroll-to-Top
  function initScrollEffects() {
    const header = document.querySelector('.site-header');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
      const top = window.scrollY || document.documentElement.scrollTop;

      // Header shadow
      if (header) {
        if (top > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Scroll to top visibility
      if (scrollTopBtn) {
        if (top > 400) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      }
    }, { passive: true });

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // 9. Active Navigation Link Highlighting
  function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .desktop-nav .dropdown-item, .mobile-drawer a');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
        // If it's a desktop dropdown child, also highlight the parent dropdown toggle
        const dropdownParent = link.closest('.nav-dropdown');
        if (dropdownParent) {
          const toggle = dropdownParent.querySelector('.dropdown-toggle');
          if (toggle) toggle.classList.add('active');
        }

        // If it's a mobile accordion child (Home 1 or Home 2), highlight the mobile Home toggle
        const mobileAccordionParent = link.closest('.mobile-accordion');
        if (mobileAccordionParent) {
          const mobileToggle = mobileAccordionParent.querySelector('.mobile-accordion-toggle');
          if (mobileToggle) mobileToggle.classList.add('active');
        }
      }
    });
  }

  // 10. Household Load Calculator (Products Page)
  function initLoadCalculator() {
    const checklist = document.getElementById('calcChecklist');
    if (!checklist) return;

    const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
    const totalWattsEl = document.getElementById('calcTotalWatts');
    const inverterEl = document.getElementById('calcInverterRating');
    const batteryEl = document.getElementById('calcBatteryAh');
    const backupEl = document.getElementById('calcBackupHours');

    function update() {
      let totalWatts = 0;
      checkboxes.forEach((cb) => {
        if (cb.checked) {
          totalWatts += parseInt(cb.dataset.watts || 0, 10);
        }
      });

      if (totalWattsEl) totalWattsEl.textContent = totalWatts + ' W';

      if (!inverterEl || !batteryEl || !backupEl) return;

      if (totalWatts <= 500) {
        inverterEl.textContent = '900 VA Pure Sine';
        batteryEl.textContent = '150 Ah (12V Single)';
        backupEl.textContent = '5.0 – 6.5 Hrs';
      } else if (totalWatts <= 1000) {
        inverterEl.textContent = '1450 VA Pure Sine';
        batteryEl.textContent = '200 Ah (12V Single)';
        backupEl.textContent = '4.0 – 5.5 Hrs';
      } else if (totalWatts <= 1800) {
        inverterEl.textContent = '2.5 kVA Dual Battery';
        batteryEl.textContent = '2 x 150 Ah (24V Bank)';
        backupEl.textContent = '4.5 – 6.0 Hrs';
      } else {
        inverterEl.textContent = '3.5 kVA – 5.0 kVA System';
        batteryEl.textContent = '4 x 150 Ah or 5kWh Lithium';
        backupEl.textContent = '5.0 – 7.0 Hrs';
      }
    }

    checkboxes.forEach((cb) => {
      cb.addEventListener('change', update);
    });

    update();
  }

  // 11. Residential Booking Studio (Contact Page)
  function initBookingStudio() {
    const pills = document.querySelectorAll('.equip-pill-btn');
    const hiddenEquipInput = document.getElementById('selectedEquipmentInput');
    const bookingForm = document.getElementById('residentialBookingForm');
    const feedbackAlert = document.getElementById('bookingFeedbackAlert');

    if (pills.length && hiddenEquipInput) {
      pills.forEach((pill) => {
        pill.addEventListener('click', () => {
          pills.forEach((p) => p.classList.remove('active'));
          pill.classList.add('active');
          hiddenEquipInput.value = pill.dataset.equip || pill.textContent.trim();
        });
      });
    }

    if (bookingForm && feedbackAlert) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedEquip = hiddenEquipInput ? hiddenEquipInput.value : 'Residential Equipment';
        const nameVal = document.getElementById('homeownerName')?.value || 'Homeowner';
        feedbackAlert.innerHTML = `<strong>Booking Confirmed for ${nameVal}!</strong> Our certified residential technician has been dispatched for your <em>${selectedEquip}</em>. Check SMS for real-time tracking.`;
        feedbackAlert.style.display = 'block';
        bookingForm.reset();
        if (pills.length > 0) {
          pills.forEach((p) => p.classList.remove('active'));
          pills[0].classList.add('active');
          if (hiddenEquipInput) hiddenEquipInput.value = pills[0].dataset.equip;
        }
      });
    }
  }

  // 12. Quick Diagnostic Pills (Home 2)
  function initDiagnosticPills() {
    const diagPills = document.querySelectorAll('.h2-diag-pill');
    if (!diagPills.length) return;

    diagPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        diagPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }

  // 13. Doorstep Coverage Zone Map Switcher (Contact Page)
  function initZoneMapSwitcher() {
    const zoneCards = document.querySelectorAll('.zone-chip-card[data-zone-map]');
    const liveMapIframe = document.querySelector('.zones-live-map');
    if (!zoneCards.length || !liveMapIframe) return;

    zoneCards.forEach((card) => {
      card.addEventListener('click', () => {
        zoneCards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        const mapSrc = card.getAttribute('data-zone-map');
        if (mapSrc && liveMapIframe.src !== mapSrc) {
          liveMapIframe.src = mapSrc;
        }
      });
    });
  }

  // 14. Modern Custom Select Dropdown Enhancement (Prevents native OS popup blowout)
  function initCustomSelects() {
    const selects = document.querySelectorAll('select.form-input, select.form-field-select, select.login-input-field');
    selects.forEach((select) => {
      // Prevent double init
      if (select.closest('.custom-select-wrap')) return;

      const wrap = document.createElement('div');
      wrap.className = 'custom-select-wrap';
      if (select.classList.contains('login-input-field')) {
        wrap.classList.add('login-select-wrap');
      }

      // Hide native select visually while keeping it form-valid and accessible
      select.parentNode.insertBefore(wrap, select);
      wrap.appendChild(select);
      select.classList.add('custom-select-native-hidden');

      // Custom Trigger Button
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'custom-select-trigger';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.setAttribute('aria-expanded', 'false');

      const triggerText = document.createElement('span');
      triggerText.className = 'custom-select-current-text';
      const selectedOption = select.options[select.selectedIndex] || select.options[0];
      triggerText.textContent = selectedOption ? selectedOption.text : 'Select Option';

      const chevronSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      chevronSvg.setAttribute('viewBox', '0 0 24 24');
      chevronSvg.setAttribute('class', 'custom-select-chevron');
      chevronSvg.setAttribute('width', '16');
      chevronSvg.setAttribute('height', '16');
      chevronSvg.setAttribute('fill', 'none');
      chevronSvg.setAttribute('stroke', 'currentColor');
      chevronSvg.setAttribute('stroke-width', '2.5');
      chevronSvg.setAttribute('stroke-linecap', 'round');
      chevronSvg.setAttribute('stroke-linejoin', 'round');
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', '6 9 12 15 18 9');
      chevronSvg.appendChild(polyline);

      trigger.appendChild(triggerText);
      trigger.appendChild(chevronSvg);
      wrap.appendChild(trigger);

      // Custom Options Menu
      const optionsMenu = document.createElement('div');
      optionsMenu.className = 'custom-select-menu';
      optionsMenu.setAttribute('role', 'listbox');

      Array.from(select.options).forEach((opt, idx) => {
        if (opt.disabled && !opt.value) {
          const placeholderItem = document.createElement('div');
          placeholderItem.className = 'custom-select-item disabled';
          placeholderItem.textContent = opt.text;
          optionsMenu.appendChild(placeholderItem);
          return;
        }

        const item = document.createElement('div');
        item.className = 'custom-select-item';
        item.setAttribute('role', 'option');
        item.setAttribute('data-value', opt.value);
        item.textContent = opt.text;

        if (idx === select.selectedIndex) {
          item.classList.add('selected');
        }

        item.addEventListener('click', (e) => {
          e.stopPropagation();
          select.value = opt.value;
          triggerText.textContent = opt.text;

          optionsMenu.querySelectorAll('.custom-select-item').forEach((i) => i.classList.remove('selected'));
          item.classList.add('selected');

          wrap.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');

          select.dispatchEvent(new Event('change', { bubbles: true }));
        });

        optionsMenu.appendChild(item);
      });

      wrap.appendChild(optionsMenu);

      // Toggle Open/Close
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        document.querySelectorAll('.custom-select-wrap.open').forEach((otherWrap) => {
          if (otherWrap !== wrap) {
            otherWrap.classList.remove('open');
            const otherTrigger = otherWrap.querySelector('.custom-select-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        const isOpen = wrap.classList.toggle('open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Synchronize on external select changes
      select.addEventListener('change', () => {
        const curOpt = select.options[select.selectedIndex];
        if (curOpt) {
          triggerText.textContent = curOpt.text;
          optionsMenu.querySelectorAll('.custom-select-item').forEach((i) => {
            i.classList.toggle('selected', i.getAttribute('data-value') === curOpt.value);
          });
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-select-wrap')) {
        document.querySelectorAll('.custom-select-wrap.open').forEach((wrap) => {
          wrap.classList.remove('open');
          const trigger = wrap.querySelector('.custom-select-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.custom-select-wrap.open').forEach((wrap) => {
          wrap.classList.remove('open');
          const trigger = wrap.querySelector('.custom-select-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }
})();

