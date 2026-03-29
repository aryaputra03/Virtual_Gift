/* ============================================================
   HERO SECTION
   ============================================================ */

(function initHero() {

  /* ----------------------------------------------------------
     1. BG PARALLAX + ZOOM MASUK
        Gambar background zoom out saat halaman dimuat,
        lalu parallax ringan saat di-scroll
  ---------------------------------------------------------- */
  const heroBg = document.querySelector('.hero__bg');

  if (heroBg) {
    /* Trigger zoom-out (scale 1.08 → 1.0) */
    requestAnimationFrame(function () {
      heroBg.classList.add('hero__bg--loaded');
    });

    /* Parallax saat scroll — geser bg ke bawah perlahan */
    window.addEventListener('scroll', function () {
      const scrollY  = window.scrollY;
      const heroEl   = document.getElementById('hero');
      if (!heroEl) return;

      /* Hanya aktif saat hero masih terlihat */
      if (scrollY < heroEl.offsetHeight) {
        const shift = scrollY * 0.30; /* 30% kecepatan scroll */
        heroBg.style.transform = 'scale(1) translateY(' + shift + 'px)';
      }
    }, { passive: true });
  }


  /* ----------------------------------------------------------
     2. ORNAMEN MUNCUL
        Fade in ornamen sudut setelah halaman siap
  ---------------------------------------------------------- */
  const ornaments = document.querySelectorAll('.hero__ornament');

  window.addEventListener('load', function () {
    setTimeout(function () {
      ornaments.forEach(function (el) {
        el.classList.add('hero__ornament--loaded');
      });
    }, 400);
  });


  /* ----------------------------------------------------------
     3. REVEAL ON SCROLL
        Animasi elemen masuk (.reveal → .reveal--visible)
        berlaku di SELURUH halaman, bukan hanya hero.
        Gunakan IntersectionObserver untuk performa terbaik.
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {

    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);

        setTimeout(function () {
          el.classList.add('reveal--visible');
        }, delay);

        /* Hentikan observasi setelah muncul — tidak perlu diulang */
        revealObserver.unobserve(el);
      });
    }, {
      threshold  : 0.15,  /* muncul saat 15% elemen terlihat */
      rootMargin : '0px 0px -40px 0px',
    });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });

  } else {
    /* Fallback: browser lama — tampilkan semua sekaligus */
    revealEls.forEach(function (el) {
      el.classList.add('reveal--visible');
    });
  }


  /* ----------------------------------------------------------
     4. HERO CTA — smooth scroll dengan offset navbar
  ---------------------------------------------------------- */
  const heroCta = document.querySelector('.hero__cta');

  if (heroCta) {
    heroCta.addEventListener('click', function (e) {
      const href = heroCta.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navbar       = document.getElementById('navbar');
      const navbarHeight = navbar ? navbar.offsetHeight : 70;
      const targetTop    = target.getBoundingClientRect().top
                         + window.scrollY
                         - navbarHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  }


  /* ----------------------------------------------------------
     5. SCROLL HINT — sembunyikan otomatis setelah di-scroll
  ---------------------------------------------------------- */
  const scrollHint = document.querySelector('.hero__scroll-hint');

  if (scrollHint) {
    window.addEventListener('scroll', function () {
      const hidden = window.scrollY > 80;
      scrollHint.style.opacity    = hidden ? '0' : '';
      scrollHint.style.transition = 'opacity 0.4s ease';
    }, { passive: true });
  }

})();