/* =============================================
   BERRY VELVET — Premium Ice Cream
   Main Script
   ============================================= */

'use strict';

// ─── DOM READY ────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initPromoBanner();
  initMobileMenu();
  initModals();
  initForms();
  initCart();
  initFlavorTabs();
  initScrollAnimations();
  initSmoothScroll();
  console.log('🍦 Berry Velvet loaded!');
});

// ─── NAVBAR ──────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check
}

// ─── PROMO BANNER ────────────────────────────
function initPromoBanner() {
  const banner = document.querySelector('.promo-banner');
  const closeBtn = document.getElementById('promo-close');
  if (!banner) return;

  // Show after 2s
  setTimeout(() => {
    banner.classList.add('visible');
  }, 2000);

  closeBtn?.addEventListener('click', () => {
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 400);
  });
}

// ─── MOBILE MENU ─────────────────────────────
function initMobileMenu() {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ─── MODALS ──────────────────────────────────
function initModals() {
  // Open
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(trigger.dataset.modal);
    });
  });

  // Close buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(btn.dataset.close);
    });
  });

  // Close on overlay
  document.querySelectorAll('.modal').forEach(modal => {
    modal.querySelector('.modal-overlay')?.addEventListener('click', () => {
      closeModal(modal.id);
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ─── FORMS ───────────────────────────────────
function initForms() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
  });

  // Custom email validation
  document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('invalid', (e) => {
      e.preventDefault();
      input.setCustomValidity('Введите корректный email');
    });
    input.addEventListener('input', () => input.setCustomValidity(''));
  });

  // Phone mask (simple)
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.startsWith('8')) v = '7' + v.slice(1);
      if (v.startsWith('7')) {
        v = v.slice(0, 11);
        let formatted = '+7';
        if (v.length > 1) formatted += ' (' + v.slice(1, 4);
        if (v.length >= 4) formatted += ') ' + v.slice(4, 7);
        if (v.length >= 7) formatted += '-' + v.slice(7, 9);
        if (v.length >= 9) formatted += '-' + v.slice(9, 11);
        e.target.value = formatted;
      }
    });
  });
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  const originalHTML = submitBtn.innerHTML;

  // Loading state
  submitBtn.innerHTML = '<span>Отправляем...</span>';
  submitBtn.disabled = true;

  // Simulate async request
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Success
  submitBtn.innerHTML = '✅ Заказ принят!';

  showToast();

  setTimeout(() => {
    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
    form.reset();

    // Close modal if inside one
    const modal = form.closest('.modal');
    if (modal) closeModal(modal.id);
  }, 2500);
}

// ─── TOAST ───────────────────────────────────
function showToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 4000);
}

// ─── CART ────────────────────────────────────
const cart = { items: [], total: 0, count: 0 };

function initCart() {
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price, 10);
      addToCart(name, price, btn);
    });
  });
}

function addToCart(name, price, btn) {
  // Visual feedback on button
  const original = btn.textContent;
  btn.textContent = '✓ Добавлено';
  btn.classList.add('added');
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove('added');
    btn.disabled = false;
  }, 1500);

  // Update cart state
  const existing = cart.items.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.items.push({ name, price, qty: 1 });
  }
  cart.total += price;
  cart.count += 1;

  updateCartBar();
}

function updateCartBar() {
  const bar = document.getElementById('cart-bar');
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total');

  if (!bar || !countEl || !totalEl) return;

  countEl.textContent = cart.count;
  totalEl.textContent = cart.total.toLocaleString('ru-RU') + ' ₽';

  if (cart.count > 0) {
    bar.classList.add('visible');
  } else {
    bar.classList.remove('visible');
  }
}

// ─── FLAVOR TABS ─────────────────────────────
function initFlavorTabs() {
  const tabs = document.querySelectorAll('.flavor-tab');
  const cards = document.querySelectorAll('.flavor-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.tab;

      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden');
          // Re-trigger entrance animation
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ─── SCROLL ANIMATIONS ───────────────────────
function initScrollAnimations() {
  // Add reveal class to target elements
  const targets = [
    '.enjoy-card',
    '.recipe-card',
    '.review-card',
    '.why-item',
    '.section-header',
    '.flavor-card',
    '.perk',
    '.feature-item',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── SMOOTH SCROLL ───────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
