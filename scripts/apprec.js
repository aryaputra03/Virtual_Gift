/* ============================================================
   APPRECIATION SECTION
   ============================================================ */

(function initAppreciate() {

  /* ----------------------------------------------------------
     1. COUNTER ANIMASI pada highlight items
        Efek "ketuk" ringan saat item pertama kali masuk viewport
  ---------------------------------------------------------- */
  const highlightItems = document.querySelectorAll('.highlight-item');

  if ('IntersectionObserver' in window && highlightItems.length) {

    const highlightObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const items = entry.target.querySelectorAll('.highlight-item');
        items.forEach(function (item, i) {
          setTimeout(function () {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
            item.style.opacity    = '0';
            item.style.transform  = 'translateY(16px)';

            /* Sedikit delay agar transisi ke 0 selesai dulu */
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                item.style.opacity   = '1';
                item.style.transform = 'translateY(0)';
              });
            });
          }, i * 120);
        });

        highlightObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    const highlightWrapper = document.querySelector('.appreciate__highlights');
    if (highlightWrapper) {
      highlightObserver.observe(highlightWrapper);
    }
  }


  /* ----------------------------------------------------------
     2. HOVER SOUND VISUAL pada duo-card
        Partikel emas kecil muncul di sekitar kartu saat di-hover
        (murni CSS transform, tidak ada canvas/library)
  ---------------------------------------------------------- */
  const duoCards = document.querySelectorAll('.appreciate__duo-card');

  duoCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      spawnCardSparkles(card);
    });
  });

  function spawnCardSparkles(card) {
    var count = 5;

    for (var i = 0; i < count; i++) {
      (function (index) {
        setTimeout(function () {
          var spark = document.createElement('span');
          spark.setAttribute('aria-hidden', 'true');

          /* Ukuran acak antara 3–7px */
          var size  = 3 + Math.random() * 4;
          var startX = 10 + Math.random() * 80; /* % dari lebar card */
          var endX  = (Math.random() - 0.5) * 50; /* geser horizontal */
          var endY  = -(30 + Math.random() * 40);  /* naik ke atas */

          Object.assign(spark.style, {
            position        : 'absolute',
            bottom          : '10%',
            left            : startX + '%',
            width           : size + 'px',
            height          : size + 'px',
            borderRadius    : '50%',
            background      : '#74c69d',
            opacity         : '0.8',
            pointerEvents   : 'none',
            zIndex          : '10',
            transition      : 'transform 0.7s ease-out, opacity 0.7s ease-out',
            willChange      : 'transform, opacity',
          });

          card.style.position = 'relative'; /* pastikan parent relative */
          card.appendChild(spark);

          /* Trigger animasi pada frame berikutnya */
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              spark.style.transform = 'translate(' + endX + 'px, ' + endY + 'px) scale(0.2)';
              spark.style.opacity   = '0';
            });
          });

          /* Hapus dari DOM setelah animasi selesai */
          setTimeout(function () {
            if (spark.parentNode) spark.parentNode.removeChild(spark);
          }, 750);

        }, index * 80);
      })(i);
    }
  }


  /* ----------------------------------------------------------
     3. QUOTE MARK — animasi typewriter halus pada paragraf
        Saat kartu kutipan masuk viewport, teks tiap paragraf
        fade in berurutan dengan sedikit delay
  ---------------------------------------------------------- */
  const appreciateCard = document.querySelector('.appreciate__card');

  if (appreciateCard && 'IntersectionObserver' in window) {

    const cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var paragraphs = appreciateCard.querySelectorAll('.appreciate__text-body p');

        paragraphs.forEach(function (p, i) {
          p.style.opacity   = '0';
          p.style.transform = 'translateX(-10px)';
          p.style.transition = 'opacity 0.65s ease, transform 0.65s ease';

          setTimeout(function () {
            p.style.opacity   = '1';
            p.style.transform = 'translateX(0)';
          }, 300 + i * 220);
        });

        cardObserver.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    cardObserver.observe(appreciateCard);
  }

})();