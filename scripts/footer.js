/* ============================================================
   FOOTER + SCROLL TO TOP
   ============================================================ */

(function initFooter() {

  /* ----------------------------------------------------------
     1. SISIPKAN ELEMEN TAMBAHAN KE FOOTER
        - Garis ornamen pemisah antara pesan dan link
        - Tombol scroll-to-top (fixed, di luar footer)
  ---------------------------------------------------------- */
  var footerInner = document.querySelector('.footer__inner');

  if (footerInner) {

    /* Sisipkan divider ornamen setelah .footer__msg */
    var footerMsg = footerInner.querySelector('.footer__msg');
    if (footerMsg) {
      var divider     = document.createElement('div');
      divider.className = 'footer__divider';
      divider.setAttribute('aria-hidden', 'true');

      var dividerIcon  = document.createElement('span');
      dividerIcon.className   = 'footer__divider-icon';
      dividerIcon.textContent = '✦ ✦ ✦';
      divider.appendChild(dividerIcon);

      /* Masukkan divider tepat setelah .footer__msg */
      footerMsg.insertAdjacentElement('afterend', divider);
    }
  }

  /* ----------------------------------------------------------
     2. BUAT TOMBOL SCROLL TO TOP
  ---------------------------------------------------------- */
  var scrollBtn = document.createElement('button');
  scrollBtn.className   = 'scroll-to-top';
  scrollBtn.setAttribute('aria-label', 'Kembali ke atas');
  scrollBtn.setAttribute('title', 'Kembali ke atas');
  scrollBtn.innerHTML   = /* SVG panah atas */
    '<svg viewBox="0 0 24 24">' +
      '<polyline points="18 15 12 9 6 15"/>' +
    '</svg>';

  document.body.appendChild(scrollBtn);

  /* ----------------------------------------------------------
     3. TAMPILKAN / SEMBUNYIKAN TOMBOL SAAT SCROLL
  ---------------------------------------------------------- */
  var SHOW_THRESHOLD = 400; /* px dari atas sebelum tombol muncul */

  function onScrollFooter() {
    if (window.scrollY > SHOW_THRESHOLD) {
      scrollBtn.classList.add('scroll-to-top--visible');
    } else {
      scrollBtn.classList.remove('scroll-to-top--visible');
    }
  }

  window.addEventListener('scroll', onScrollFooter, { passive: true });
  onScrollFooter(); /* cek posisi awal */

  /* ----------------------------------------------------------
     4. KLIK TOMBOL → SMOOTH SCROLL KE ATAS
  ---------------------------------------------------------- */
  scrollBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     5. SMOOTH SCROLL UNTUK "Kembali ke Atas ↑" DI FOOTER
  ---------------------------------------------------------- */
  var footerBackLink = document.querySelector('.footer__links a[href="#hero"]');

  if (footerBackLink) {
    footerBackLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     6. ANIMASI MASUK ELEMEN FOOTER (reveal saat terlihat)
  ---------------------------------------------------------- */
  if ('IntersectionObserver' in window) {

    var footerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var children = Array.from(entry.target.children);

        children.forEach(function (el, i) {
          el.style.opacity   = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

          setTimeout(function () {
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0)';
          }, 80 + i * 130);
        });

        footerObserver.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    var footerInnerEl = document.querySelector('.footer__inner');
    if (footerInnerEl) footerObserver.observe(footerInnerEl);
  }

  /* ----------------------------------------------------------
     7. TAHUN OTOMATIS pada copyright
        Ganti angka tahun jika sudah lewat 2026
  ---------------------------------------------------------- */
  var copyEl = document.querySelector('.footer__copy');

  if (copyEl) {
    var currentYear = new Date().getFullYear();
    if (currentYear > 2026) {
      copyEl.innerHTML = copyEl.innerHTML.replace('2026', '2026–' + currentYear);
    }
  }

  /* ----------------------------------------------------------
     8. EASTER EGG — klik brand 5x → mini confetti
  ---------------------------------------------------------- */
  var brandEl    = document.querySelector('.footer__brand');
  var clickCount = 0;
  var resetTimer = null;

  if (brandEl) {
    brandEl.style.cursor = 'pointer';

    brandEl.addEventListener('click', function () {
      clickCount++;

      /* Reset counter jika tidak klik dalam 2 detik */
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () { clickCount = 0; }, 2000);

      /* Efek scale kecil tiap klik */
      brandEl.style.transition = 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)';
      brandEl.style.transform  = 'scale(1.18)';
      setTimeout(function () {
        brandEl.style.transform = 'scale(1)';
      }, 150);

      /* Setelah 5 klik → picu confetti */
      if (clickCount >= 5) {
        clickCount = 0;

        /* Picu tombol confetti di closing section jika ada */
        var confettiBtn = document.getElementById('triggerConfetti');
        if (confettiBtn) {
          confettiBtn.click();

          /* Scroll ke closing section supaya confetti terlihat */
          var closingSection = document.getElementById('closing');
          if (closingSection) {
            var navbar = document.getElementById('navbar');
            var offset = navbar ? navbar.offsetHeight : 70;
            window.scrollTo({
              top     : closingSection.offsetTop - offset,
              behavior: 'smooth',
            });
          }
        }
      }
    });
  }

})();