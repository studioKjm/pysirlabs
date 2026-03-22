/**
 * PYSIRLABS v3 — Interactive Scripts
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
    mobileToggle.classList.toggle('is-open', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen.toString());
  });
}

// Mobile nav overlay styles
const mobileStyle = document.createElement('style');
mobileStyle.textContent = `
  @media (max-width: 768px) {
    .nav-links.mobile-open {
      display: flex !important; flex-direction: column;
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(5,5,6,0.98); backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      align-items: center; justify-content: center; gap: 2.5rem; z-index: 150;
      animation: fadeIn 0.2s ease;
    }
    .nav-links.mobile-open a {
      font-size: 1.4rem; font-weight: 800; color: #F0F0F5;
      transition: color 0.2s;
    }
    .nav-links.mobile-open a:hover { color: #818cf8; }
    .nav-mobile-toggle.is-open span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    .nav-mobile-toggle.is-open span:nth-child(2) {
      opacity: 0;
    }
    .nav-mobile-toggle.is-open span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  }
`;
document.head.appendChild(mobileStyle);

// ============================================================
// Typing Animation (Hero)
// ============================================================
const typingPhrases = [
  '완성도 높은 제품으로 만듭니다',
  'AI로 팀 규모의 개발을 해냅니다',
  '중간 마진 없이 합리적으로',
  '기획부터 운영까지 책임집니다',
];

const typingEl = document.getElementById('typing-text');
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;

function typeLoop() {
  const current = typingPhrases[phraseIdx];

  if (!isDeleting) {
    typingEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 2000);
      return;
    }
    setTimeout(typeLoop, 60);
  } else {
    typingEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % typingPhrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 30);
  }
}

setTimeout(typeLoop, 800);

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
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ============================================================
// Counter animation
// ============================================================
function animateCounter(el, end, duration) {
  const suffix = el.dataset.suffix || '';
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (end - start) * eased) + suffix;
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
// Reviews Carousel
// ============================================================
const track = document.getElementById('reviews-track');
const prevBtn = document.getElementById('reviews-prev');
const nextBtn = document.getElementById('reviews-next');

if (track && prevBtn && nextBtn) {
  let reviewPos = 0;

  function getCardWidth() {
    const card = track.querySelector('.review-card');
    if (!card) return 376;
    return card.offsetWidth + 24; // card width + gap
  }

  function getMaxPos() {
    const totalWidth = track.scrollWidth;
    const visibleWidth = track.parentElement.offsetWidth;
    return Math.max(0, totalWidth - visibleWidth);
  }

  function moveCarousel(dir) {
    const cardW = getCardWidth();
    reviewPos += dir * cardW;
    reviewPos = Math.max(0, Math.min(reviewPos, getMaxPos()));
    track.style.transform = `translateX(-${reviewPos}px)`;
  }

  prevBtn.addEventListener('click', () => moveCarousel(-1));
  nextBtn.addEventListener('click', () => moveCarousel(1));

  // Touch swipe
  let startX = 0;
  let isDragging = false;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; isDragging = true; }, { passive: true });
  track.addEventListener('touchmove', e => { if (!isDragging) return; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) moveCarousel(diff > 0 ? 1 : -1);
  });
}

// ============================================================
// Review text expand/collapse
// ============================================================
document.querySelectorAll('.review-text').forEach(el => {
  el.addEventListener('click', () => el.classList.toggle('expanded'));
});

// ============================================================
// Portfolio Filters
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ============================================================
// Contact form
// ============================================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.contact-submit');
    const formData = new FormData(contactForm);
    btn.innerHTML = '전송 중...';
    btn.disabled = true;
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    }).then(res => {
      if (!res.ok) throw new Error(res.status);
      contactForm.reset();
      // 성공 메시지 표시
      const formWrap = document.querySelector('.contact-form-wrap');
      formWrap.innerHTML = `
        <div class="form-success">
          <div class="form-success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3 class="form-success-title">견적 문의가 접수되었습니다</h3>
          <p class="form-success-desc">입력하신 이메일로 접수 확인 메일이 발송됩니다.<br>상세 견적은 평균 2~6시간 이내에 회신드리겠습니다.</p>
          <p class="form-success-note">메일이 도착하지 않는 경우 스팸함을 확인해주세요.</p>
        </div>
      `;
    }).catch(() => {
      btn.innerHTML = '전송 실패 — 이메일로 문의해주세요';
      btn.disabled = false;
    });
  });
}

// ============================================================
// Smooth scroll
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      // Close mobile nav if open
      if (navLinks && navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
        mobileToggle.classList.remove('is-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
      const offset = nav.offsetHeight + 24;
      window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
    }
  });
});

// ============================================================
// Hero glow mouse parallax (subtle)
// ============================================================
const glows = document.querySelectorAll('.hero-glow');
window.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;
  glows.forEach((g, i) => {
    const f = (i + 1) * 0.5;
    g.style.transform = `translate(${x * f}px, ${y * f}px)`;
  });
}, { passive: true });

// ============================================================
// Product card hover tilt
// ============================================================
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ============================================================
// Design Showcase - duplicate track for infinite scroll
// ============================================================
const showcaseTrack = document.getElementById('showcase-track');
if (showcaseTrack) {
  const clone = showcaseTrack.innerHTML;
  showcaseTrack.innerHTML += clone;
  // JS-driven auto scroll + manual nav
  const sPrev = document.getElementById('showcase-prev');
  const sNext = document.getElementById('showcase-next');
  const halfWidth = showcaseTrack.scrollWidth / 2;
  let pos = 0;
  let speed = 0.8; // px per frame
  let isHovering = false;
  let manualOffset = 0;
  let manualAnimating = false;

  function autoScroll() {
    if (!isHovering && !manualAnimating) {
      pos += speed;
      if (pos >= halfWidth) pos -= halfWidth;
    }
    if (manualAnimating) {
      // Ease manual offset toward 0
      pos += manualOffset * 0.08;
      manualOffset *= 0.92;
      if (Math.abs(manualOffset) < 0.5) { manualOffset = 0; manualAnimating = false; }
      if (pos >= halfWidth) pos -= halfWidth;
      if (pos < 0) pos += halfWidth;
    }
    showcaseTrack.style.transform = `translateX(${-pos}px)`;
    requestAnimationFrame(autoScroll);
  }
  requestAnimationFrame(autoScroll);

  showcaseTrack.addEventListener('mouseenter', () => { isHovering = true; });
  showcaseTrack.addEventListener('mouseleave', () => { isHovering = false; });

  const step = (280 + 20) * 3;
  if (sPrev) sPrev.addEventListener('click', () => { manualOffset = -step; manualAnimating = true; });
  if (sNext) sNext.addEventListener('click', () => { manualOffset = step; manualAnimating = true; });

  // Showcase cards also open modal
  showcaseTrack.querySelectorAll('.showcase-card[data-modal-img]').forEach(card => {
    card.addEventListener('click', () => {
      const modal = document.getElementById('portfolio-modal');
      const modalImg = document.getElementById('modal-img');
      if (modal && modalImg) {
        modalImg.src = card.dataset.modalImg;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

// ============================================================
// Portfolio Modal
// ============================================================
const modal = document.getElementById('portfolio-modal');
const modalImg = document.getElementById('modal-img');
if (modal) {
  document.querySelectorAll('.portfolio-thumb[data-modal-img]').forEach(thumb => {
    thumb.addEventListener('click', () => {
      modalImg.src = thumb.dataset.modalImg;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}
