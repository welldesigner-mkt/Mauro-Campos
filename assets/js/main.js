// ============================================================
// MAURO CAMPOS — MAIN JS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAVBAR SCROLL ──────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── 2. MOBILE MENU ────────────────────────────────────── */
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobileMenu');
  const mobileClose  = document.getElementById('mobileClose');
  const mobileOverlay= document.getElementById('mobileOverlay');

  const openMenu  = () => { mobileMenu.classList.add('open'); mobileOverlay.classList.add('show'); document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { mobileMenu.classList.remove('open'); mobileOverlay.classList.remove('show'); document.body.style.overflow = ''; };

  if (hamburger)     hamburger.addEventListener('click', openMenu);
  if (mobileClose)   mobileClose.addEventListener('click', closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

  // Close on nav link click
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ── 3. SCROLL REVEAL ──────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  /* ── 4. COUNTER ANIMATION ──────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let current  = 0;
        const step   = Math.ceil(target / 60);
        const tick   = () => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current < target) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => counterObserver.observe(el));

  /* ── 5. FORM SUBMISSION (mock) ─────────────────────────── */
  const form  = document.getElementById('cadastroForm');
  const toast = document.getElementById('toast');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome     = document.getElementById('nome').value.trim();
      const whatsapp = document.getElementById('whatsapp').value.trim();
      const cidade   = document.getElementById('cidade').value.trim();
      const consent  = document.getElementById('consent').checked;

      if (!nome || !whatsapp || !cidade) {
        showToast('⚠️ Preencha todos os campos obrigatórios.', 'error');
        return;
      }
      if (!consent) {
        showToast('⚠️ Aceite o consentimento para continuar.', 'error');
        return;
      }

      // Simulate submission
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✅ Cadastro realizado!';
        showToast('✅ Cadastro realizado! Em breve você receberá novidades.');
        form.reset();
        setTimeout(() => {
          btn.textContent = 'QUERO RECEBER NOVIDADES';
          btn.disabled = false;
        }, 3000);
      }, 1200);
    });
  }

  function showToast(msg, type = 'success') {
    if (!toast) return;
    toast.textContent = msg;
    toast.style.borderLeftColor = type === 'error' ? '#e74c3c' : '#F36C21';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  /* ── 6. WHATSAPP MASK ──────────────────────────────────── */
  const waInput = document.getElementById('whatsapp');
  if (waInput) {
    waInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 11);
      if (v.length >= 7) {
        v = `(${v.substring(0,2)}) ${v.substring(2,7)}-${v.substring(7)}`;
      } else if (v.length >= 3) {
        v = `(${v.substring(0,2)}) ${v.substring(2)}`;
      } else if (v.length > 0) {
        v = `(${v}`;
      }
      e.target.value = v;
    });
  }

  /* ── 7. SMOOTH ACTIVE NAV ──────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${entry.target.id}`
            ? '#F36C21'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ── 8. CUSTOMIZE ELFSIGHT INSTAGRAM WIDGET ──────────────────── */
  (function() {
    const css = `
      .eapps-instagram-feed-posts-item,
      .eapps-instagram-feed-posts-item-link,
      .eapps-instagram-feed-posts-item-image,
      .eapps-instagram-feed-posts-item-container,
      [class*="posts-item"],
      [class*="posts-item-link"],
      [class*="posts-item-image"] {
        border-radius: 0px !important;
        overflow: hidden !important;
      }
      .elfsight-app-branding,
      .eapps-widget-branding,
      a[href*="elfsight.com"],
      div[class*="branding"],
      [class*="widget-branding"] {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    `;

    function injectStyles(root) {
      if (!root) return;
      if (root.querySelector && root.querySelector('#elfsight-custom-overrides')) return;

      const style = document.createElement('style');
      style.id = 'elfsight-custom-overrides';
      style.textContent = css;
      root.appendChild(style);
    }

    function styleElfsight() {
      const hosts = document.querySelectorAll('[class*="elfsight-app"]');
      hosts.forEach(host => {
        injectStyles(host);
        if (host.shadowRoot) {
          injectStyles(host.shadowRoot);
        }
        const allDescendants = host.querySelectorAll('*');
        allDescendants.forEach(desc => {
          if (desc.shadowRoot) {
            injectStyles(desc.shadowRoot);
          }
        });
      });

      const branding = document.querySelectorAll('.elfsight-app-branding, .eapps-widget-branding, a[href*="elfsight.com"]');
      branding.forEach(b => {
        b.style.display = 'none';
        b.style.opacity = '0';
        b.style.visibility = 'hidden';
        b.style.height = '0';
        b.style.pointerEvents = 'none';
      });
    }

    setInterval(styleElfsight, 250);
  })();

});

