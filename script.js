/**
 * PYSIRLABS - Version 2: Bold & Vibrant
 * Interactive JavaScript
 */

// ============================================================
// Navigation scroll effect
// ============================================================
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ============================================================
// Mobile toggle
// ============================================================
const mobileToggle = document.querySelector('.nav-mobile-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('mobile-open');
    mobileToggle.setAttribute('aria-expanded', isOpen.toString());
    const spans = mobileToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

// ============================================================
// Reveal on scroll
// ============================================================
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal, .reveal-scale').forEach(el => observer.observe(el));

// ============================================================
// Counter animation
// ============================================================
function animateCounter(el, end, duration) {
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const start = 0;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(start + (end - start) * eased);
    el.textContent = prefix + val + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-count]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.count), 1800);
      });
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stats-inner').forEach(el => statsObserver.observe(el));

// ============================================================
// Metric bars animation
// ============================================================
const metricsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.metric-bar[data-width]').forEach(bar => {
        setTimeout(() => {
          bar.style.width = bar.dataset.width;
        }, 300);
      });
      metricsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.about-visual-main').forEach(el => metricsObserver.observe(el));

// ============================================================
// Newsletter form
// ============================================================
const ctaForm = document.querySelector('.cta-form-v2');
if (ctaForm) {
  ctaForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = ctaForm.querySelector('.cta-input-v2');
    const btn = ctaForm.querySelector('.btn');
    const email = input.value.trim();

    if (!email.includes('@')) {
      input.style.borderColor = '#FCA5A5';
      return;
    }

    btn.textContent = '전송 중...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '등록 완료! ✓';
      input.value = '';
      setTimeout(() => {
        btn.textContent = '업데이트 받기';
        btn.disabled = false;
      }, 3000);
    }, 1000);
  });
}

// ============================================================
// Smooth scroll
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = nav.offsetHeight + 24;
      window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
    }
  });
});

// ============================================================
// Parallax on hero blobs
// ============================================================
const blobs = document.querySelectorAll('.hero-blob');
window.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  blobs.forEach((blob, i) => {
    const factor = (i + 1) * 0.4;
    blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
}, { passive: true });

// ============================================================
// Product card tilt effect
// ============================================================
document.querySelectorAll('.product-card-v2').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============================================================
// Mobile nav styles
// ============================================================
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 768px) {
    .nav-links.mobile-open {
      display: flex !important;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.98);
      backdrop-filter: blur(24px);
      align-items: center;
      justify-content: center;
      gap: 2rem;
      z-index: 99;
      animation: fadeIn 0.2s ease;
    }
    .nav-links.mobile-open a {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0F0720;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  }
`;
document.head.appendChild(style);
