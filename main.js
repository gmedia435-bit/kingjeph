/* =============================================
   KING JEPH BARBER STUDIO — MAIN.JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR SCROLL ─── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });


  /* ─── HAMBURGER MENU ─── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });


  /* ─── SCROLL REVEAL ─── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children of same parent
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  // Add stagger delays to siblings
  const revealGroups = {};
  revealEls.forEach(el => {
    const parent = el.parentElement;
    const key = parent ? parent.dataset.revealGroup || Math.random() : Math.random();
    if (!revealGroups[key]) revealGroups[key] = [];
    revealGroups[key].push(el);
  });

  revealEls.forEach((el, idx) => {
    el.dataset.delay = (idx % 4) * 100;
    revealObserver.observe(el);
  });


  /* ─── TESTIMONIAL SLIDER ─── */
  const track = document.getElementById('testi-track');
  const dotsContainer = document.getElementById('testi-dots');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');

  if (track) {
    const cards = track.querySelectorAll('.testi-card');
    const total = cards.length;
    let current = 0;
    let autoInterval;

    // Determine visible count
    const getVisible = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

    // Update visibility of controls and auto-play based on screen size
    const updateSliderState = () => {
      const visible = getVisible();
      const testiControls = document.querySelector('.testi-controls');
      if (testiControls) {
        testiControls.style.display = total <= visible ? 'none' : 'flex';
      }
      
      // Stop/start auto-play if cards fit/don't fit
      clearInterval(autoInterval);
      if (total > visible) {
        startAuto();
      }
    };

    // Build dots
    const buildDots = () => {
      dotsContainer.innerHTML = '';
      const visible = getVisible();
      const dotCount = Math.ceil(total / visible);
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
      updateSliderState();
    };

    const updateDots = () => {
      const dots = dotsContainer.querySelectorAll('.testi-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const goTo = (idx) => {
      const visible = getVisible();
      const maxIndex = Math.ceil(total / visible) - 1;
      current = Math.max(0, Math.min(idx, maxIndex));
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 24; // 1.5rem gap
      const offset = current * visible * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
      updateDots();
    };

    const next = () => {
      const visible = getVisible();
      const maxIndex = Math.ceil(total / visible) - 1;
      goTo(current >= maxIndex ? 0 : current + 1);
    };

    const prev = () => {
      const visible = getVisible();
      const maxIndex = Math.ceil(total / visible) - 1;
      goTo(current <= 0 ? maxIndex : current - 1);
    };

    prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
    nextBtn.addEventListener('click', () => { next(); resetAuto(); });

    // Touch / swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
    });

    // Auto-play
    const startAuto = () => {
      clearInterval(autoInterval);
      autoInterval = setInterval(next, 4500);
    };
    const resetAuto = () => {
      if (total > getVisible()) {
        clearInterval(autoInterval);
        startAuto();
      }
    };

    // Init
    buildDots();

    window.addEventListener('resize', () => {
      current = 0;
      buildDots();
      goTo(0);
    });
  }


  /* ─── HERO PARALLAX ─── */
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroVideo.style.transform = `translateY(${scrolled * 0.25}px)`;
    }, { passive: true });
  }


  /* ─── SMOOTH ACTIVE NAV LINK ─── */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => activeObserver.observe(s));


  /* ─── CURSOR GLOW EFFECT ─── */
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
    border-radius: 50%; top: 0; left: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.4s ease;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });


  /* ─── BUTTON RIPPLE EFFECT ─── */
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute; border-radius: 50%;
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top: ${e.clientY - rect.top - size/2}px;
        background: rgba(255,255,255,0.15);
        transform: scale(0); animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
      `;
      if (!this.style.position || this.style.position === 'static') {
        this.style.position = 'relative';
      }
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(2.5); opacity: 0; }
    }
    .nav-links a.active { color: #fff !important; }
    .nav-links a.active::after { width: 100% !important; }
  `;
  document.head.appendChild(style);


  /* ─── COUNTER ANIMATION ─── */
  const counters = document.querySelectorAll('.stat-num, .badge-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = el.textContent;
        // Only animate pure numbers
        const num = parseInt(target.replace(/\D/g, ''));
        if (!isNaN(num) && num > 0 && num < 200) {
          let count = 0;
          const step = Math.ceil(num / 50);
          const timer = setInterval(() => {
            count = Math.min(count + step, num);
            el.textContent = target.replace(/\d+/, count);
            if (count >= num) clearInterval(timer);
          }, 30);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));


  /* ─── FLOATING WA BUTTON SHOW ON SCROLL ─── */
  const floatWa = document.querySelector('.float-wa');
  if (floatWa) {
    floatWa.style.opacity = '0';
    floatWa.style.transform = 'scale(0.8) translateY(20px)';
    floatWa.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease';

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        floatWa.style.opacity = '1';
        floatWa.style.transform = '';
      } else {
        floatWa.style.opacity = '0';
        floatWa.style.transform = 'scale(0.8) translateY(20px)';
      }
    }, { passive: true });
  }

});
