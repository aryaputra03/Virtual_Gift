/* ============================================================
   GALLERY SECTION + LIGHTBOX
   ============================================================ */

(function initGallery() {

  /* ----------------------------------------------------------
     Kumpulkan semua data foto dari item gallery
  ---------------------------------------------------------- */
  const galleryItems = Array.from(
    document.querySelectorAll('.gallery__item')
  );

  if (!galleryItems.length) return;

  /* Bangun array data: { src, alt, caption } */
  const photos = galleryItems.map(function (item, i) {
    const img     = item.querySelector('img');
    const caption = item.querySelector('.gallery__caption');

    /* Tambahkan data-num ke caption untuk badge */
    if (caption) caption.setAttribute('data-num', String(i + 1).padStart(2, '0'));

    return {
      src    : img ? img.getAttribute('src') : '',
      alt    : img ? img.getAttribute('alt') : '',
      caption: caption ? caption.textContent.trim() : '',
    };
  });

  /* ----------------------------------------------------------
     Elemen lightbox
  ---------------------------------------------------------- */
  const lightbox        = document.getElementById('lightbox');
  const lightboxBg      = document.getElementById('lightboxBg');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose   = document.getElementById('lightboxClose');
  const lightboxPrev    = document.getElementById('lightboxPrev');
  const lightboxNext    = document.getElementById('lightboxNext');

  if (!lightbox || !lightboxBg) return;

  /* Buat elemen counter (posisi foto) */
  var counterEl = document.createElement('p');
  counterEl.className = 'lightbox__counter';
  lightbox.appendChild(counterEl);

  var currentIndex = 0;
  var isOpen       = false;

  /* ----------------------------------------------------------
     BUKA LIGHTBOX
  ---------------------------------------------------------- */
  function openLightbox(index) {
    currentIndex = index;
    isOpen = true;

    document.body.style.overflow = 'hidden';
    lightboxBg.classList.add('lightbox__bg--open');
    lightbox.classList.add('lightbox--open');

    loadPhoto(currentIndex);
    updateButtons();
  }

  /* ----------------------------------------------------------
     TUTUP LIGHTBOX
  ---------------------------------------------------------- */
  function closeLightbox() {
    isOpen = false;

    lightbox.classList.remove('lightbox--open');
    lightboxBg.classList.remove('lightbox__bg--open');
    document.body.style.overflow = '';

    /* Bersihkan src setelah transisi selesai */
    setTimeout(function () {
      lightboxImg.src = '';
    }, 400);
  }

  /* ----------------------------------------------------------
     MUAT FOTO ke lightbox
  ---------------------------------------------------------- */
  function loadPhoto(index) {
    var photo = photos[index];
    if (!photo) return;

    /* Reset ke state loading */
    lightboxImg.classList.remove('lightbox__img--loaded');
    lightboxImg.classList.add('lightbox__img--loading');
    lightboxCaption.style.opacity = '0';

    /* Update caption dan counter */
    lightboxCaption.textContent = photo.caption;
    counterEl.textContent = (index + 1) + ' / ' + photos.length;

    /* Preload gambar baru */
    var tempImg = new Image();

    tempImg.onload = function () {
      lightboxImg.src = photo.src;
      lightboxImg.alt = photo.alt;
      lightboxImg.classList.remove('lightbox__img--loading');
      lightboxImg.classList.add('lightbox__img--loaded');
      lightboxCaption.style.opacity = '1';
    };

    tempImg.onerror = function () {
      lightboxImg.src = photo.src; /* tetap tampilkan walau error */
      lightboxImg.classList.remove('lightbox__img--loading');
      lightboxImg.classList.add('lightbox__img--loaded');
      lightboxCaption.style.opacity = '1';
    };

    tempImg.src = photo.src;
  }

  /* ----------------------------------------------------------
     NAVIGASI — prev / next
  ---------------------------------------------------------- */
  function goTo(index) {
    if (index < 0 || index >= photos.length) return;
    currentIndex = index;
    loadPhoto(currentIndex);
    updateButtons();
  }

  function goPrev() { goTo(currentIndex - 1); }
  function goNext() { goTo(currentIndex + 1); }

  function updateButtons() {
    lightboxPrev.disabled = currentIndex === 0;
    lightboxNext.disabled = currentIndex === photos.length - 1;
    counterEl.textContent = (currentIndex + 1) + ' / ' + photos.length;
  }

  /* ----------------------------------------------------------
     EVENT LISTENERS
  ---------------------------------------------------------- */

  /* Klik item gallery → buka lightbox */
  galleryItems.forEach(function (item, i) {
    item.addEventListener('click', function () {
      openLightbox(i);
    });

    /* Aksesibilitas — keyboard Enter/Space */
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  /* Tombol tutup */
  lightboxClose.addEventListener('click', closeLightbox);

  /* Klik background → tutup */
  lightboxBg.addEventListener('click', closeLightbox);

  /* Tombol prev / next */
  lightboxPrev.addEventListener('click', goPrev);
  lightboxNext.addEventListener('click', goNext);

  /* Keyboard: arrow kiri/kanan, Escape */
  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowLeft':  goPrev();        break;
      case 'ArrowRight': goNext();        break;
      case 'Escape':     closeLightbox(); break;
    }
  });

  /* ----------------------------------------------------------
     SWIPE GESTURE (layar sentuh / mobile)
  ---------------------------------------------------------- */
  var touchStartX = 0;
  var touchEndX   = 0;
  var swipeThreshold = 50; /* px minimum untuk dihitung sebagai swipe */

  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].clientX;
    var diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goNext(); /* swipe kiri → foto berikutnya */
      } else {
        goPrev(); /* swipe kanan → foto sebelumnya */
      }
    }
  }, { passive: true });

  /* ----------------------------------------------------------
     ANIMASI MASUK item gallery satu per satu (stagger)
  ---------------------------------------------------------- */
  if ('IntersectionObserver' in window) {

    var gridObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var items = entry.target.querySelectorAll('.gallery__item');
        items.forEach(function (item, i) {
          item.style.opacity   = '0';
          item.style.transform = 'translateY(24px) scale(0.97)';
          item.style.transition = 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.4,0,0.2,1)';

          setTimeout(function () {
            item.style.opacity   = '1';
            item.style.transform = 'translateY(0) scale(1)';
          }, 80 + i * 100);
        });

        gridObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    var grid = document.querySelector('.gallery__grid');
    if (grid) gridObserver.observe(grid);
  }

})();