/* ============================================================
   ALMANAC — main.js
   ============================================================ */

/* ── 0. Video Modal Popup ────────────────────────────────── */
const videoModal   = document.getElementById('video-modal');
const modalVideo   = document.getElementById('modal-video');

function openVideoModal() {
  if (!videoModal) return;
  videoModal.classList.add('modal-open');
  document.body.style.overflow = 'hidden';

  if (modalVideo) {
    modalVideo.currentTime = 0;
    // Primer intento: con sonido (funciona si el usuario ya interactuó con la página)
    modalVideo.muted = false;
    const playPromise = modalVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // El navegador bloqueó el audio — reproducir sin sonido para que arranque solo
        modalVideo.muted = true;
        modalVideo.play().catch(() => {});
      });
    }
  }
}

function closeVideoModal() {
  if (!videoModal) return;
  videoModal.classList.remove('modal-open');
  document.body.style.overflow = '';
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.currentTime = 0;
  }
}

// Close when clicking outside the box
videoModal?.addEventListener('click', (e) => {
  if (e.target === videoModal) closeVideoModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoModal?.classList.contains('modal-open')) {
    closeVideoModal();
  }
});

// Auto-open after 5 seconds
setTimeout(openVideoModal, 5000);

/* ── 1. Intersection Observer: reveal animations ─────────── */
const revealEls = document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .title-reveal-wrap'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* ── 2. Stagger: auto-assign delay to children of .stagger-grid ─ */
document.querySelectorAll('.stagger-grid').forEach((grid) => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.1}s`;
  });
});

/* ── 3. Navbar — transparent → frosted on scroll ─────────── */
const nav = document.getElementById('main-nav');

const handleNavScroll = () => {
  if (window.scrollY > 48) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll(); // run once on load

/* ── 4. Parallax on hero blobs & mockup ──────────────────── */
const blobs   = document.querySelectorAll('.blob');
const mockupW = document.querySelector('.hero-mockup-wrap');

const handleParallax = () => {
  const sy = window.scrollY;
  blobs.forEach((blob, i) => {
    const speed = [0.22, 0.14, 0.08][i] ?? 0.1;
    blob.style.transform = `translateY(${sy * speed}px)`;
  });
  if (mockupW) {
    mockupW.style.transform = `translateY(${sy * 0.055}px)`;
  }
};

window.addEventListener('scroll', handleParallax, { passive: true });

/* ── 5. Animated counters ────────────────────────────────── */
function runCounter(el) {
  const target   = parseInt(el.dataset.target, 10) || 0;
  const suffix   = el.dataset.suffix || '';
  const duration = 2200;
  const start    = performance.now();

  const tick = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.counter').forEach((el) => counterObserver.observe(el));

/* ── 6. Video placeholder → embed on click ───────────────── */
const videoWrapper = document.querySelector('.video-wrapper');
const videoInner   = document.querySelector('.video-inner');

if (videoWrapper) {
  videoWrapper.addEventListener('click', () => {
    const src = videoWrapper.dataset.src;
    if (!src) return;

    const iframe = document.createElement('iframe');
    iframe.src = `${src}${src.includes('?') ? '&' : '?'}autoplay=1`;
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;';

    if (videoInner) videoInner.style.display = 'none';
    videoWrapper.appendChild(iframe);
  });
}

/* ── 7. Smooth scroll for anchor links ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const navH = nav ? nav.offsetHeight : 0;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── 8. Mobile menu ──────────────────────────────────────── */
const menuBtn    = document.getElementById('mobile-menu-btn');
const menuClose  = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');

const openMenu  = () => mobileMenu?.classList.add('open');
const closeMenu = () => mobileMenu?.classList.remove('open');

menuBtn?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);
mobileMenu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

// Close on backdrop click
mobileMenu?.addEventListener('click', (e) => {
  if (e.target === mobileMenu) closeMenu();
});

/* ── 9. Dashboard bar chart — random heights on load ────── */
document.querySelectorAll('.mock-bar').forEach((bar) => {
  const h = Math.floor(Math.random() * 60) + 30; // 30–90 %
  bar.style.height = `${h}%`;
});

/* ── 10. Nav active link highlight ──────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => {
          l.classList.toggle(
            'text-blue-600',
            l.getAttribute('href') === `#${entry.target.id}`
          );
          l.classList.toggle(
            'text-gray-600',
            l.getAttribute('href') !== `#${entry.target.id}`
          );
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => activeObserver.observe(s));
