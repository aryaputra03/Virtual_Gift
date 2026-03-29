/* ============================================================
   CLOSING SECTION + CONFETTI ENGINE
   ============================================================ */

(function initClosing() {

  var canvas  = document.getElementById('confettiCanvas');
  var btn     = document.getElementById('triggerConfetti');
  if (!canvas || !btn) return;

  var ctx     = canvas.getContext('2d');
  var particles = [];
  var animId  = null;
  var running = false;

  /* ----------------------------------------------------------
     1. RESIZE CANVAS — ikuti ukuran section
  ---------------------------------------------------------- */
  function resizeCanvas() {
    var section = canvas.closest('section') || canvas.parentElement;
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  /* ----------------------------------------------------------
     2. DEFINISI PARTIKEL CONFETTI
  ---------------------------------------------------------- */
  var COLORS = [
    '#c9a96e', /* gold utama       */
    '#fdeea0', /* kuning muda      */
    '#e8c96e', /* amber terang     */
    '#ffffff', /* putih            */
    '#f5c842', /* kuning cerah     */
    '#d4a853', /* amber            */
    '#ff9f43', /* oranye hangat    */
    '#ee5a24', /* merah-oranye     */
    '#a8e6cf', /* hijau mint       */
    '#dfe6e9', /* abu terang       */
  ];

  var SHAPES = ['rect', 'circle', 'ribbon'];

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createParticle(x, y) {
    var shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    var color = COLORS[Math.floor(Math.random() * COLORS.length)];
    var size  = randomBetween(5, 12);

    return {
      x         : x !== undefined ? x : randomBetween(0, canvas.width),
      y         : y !== undefined ? y : randomBetween(-40, -10),
      vx        : randomBetween(-3.5, 3.5),    /* kecepatan horizontal */
      vy        : randomBetween(2.5, 6.5),      /* kecepatan jatuh     */
      vr        : randomBetween(-6, 6),         /* kecepatan rotasi    */
      rotation  : randomBetween(0, 360),
      color     : color,
      shape     : shape,
      w         : size,
      h         : size * randomBetween(0.4, 1), /* ribbon lebih pipih */
      opacity   : 1,
      fadeStart : canvas.height * 0.75,         /* mulai fade di 75%  */
      gravity   : randomBetween(0.08, 0.18),    /* gravitasi bervariasi */
      wobble    : randomBetween(0, Math.PI * 2),
      wobbleSpeed: randomBetween(0.03, 0.07),
    };
  }

  /* ----------------------------------------------------------
     3. RENDER SETIAP PARTIKEL
  ---------------------------------------------------------- */
  function drawParticle(p) {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle   = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);

    switch (p.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'ribbon':
        ctx.fillRect(-p.w / 2, -p.h / 4, p.w, p.h / 2);
        break;

      case 'rect':
      default:
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        break;
    }

    ctx.restore();
  }

  /* ----------------------------------------------------------
     4. UPDATE POSISI PARTIKEL
  ---------------------------------------------------------- */
  function updateParticle(p) {
    p.wobble   += p.wobbleSpeed;
    p.vx       += Math.sin(p.wobble) * 0.12;  /* efek melayang */
    p.vy       += p.gravity;                   /* gravitasi     */
    p.x        += p.vx;
    p.y        += p.vy;
    p.rotation += p.vr;

    /* Fade out mendekati bawah */
    if (p.y > p.fadeStart) {
      var remaining = canvas.height - p.fadeStart;
      var progress  = (p.y - p.fadeStart) / remaining;
      p.opacity = Math.max(0, 1 - progress * 1.3);
    }
  }

  /* ----------------------------------------------------------
     5. LOOP ANIMASI
  ---------------------------------------------------------- */
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Update dan gambar tiap partikel */
    particles = particles.filter(function (p) {
      updateParticle(p);
      drawParticle(p);
      return p.y < canvas.height + 20 && p.opacity > 0;
    });

    /* Hentikan jika semua partikel habis dan tidak running */
    if (particles.length === 0 && !running) {
      cancelAnimationFrame(animId);
      animId = null;
      return;
    }

    animId = requestAnimationFrame(animate);
  }

  /* ----------------------------------------------------------
     6. LEDAKAN CONFETTI — burst dari titik tengah
  ---------------------------------------------------------- */
  function burstConfetti(count) {
    var cx = canvas.width / 2;
    var cy = canvas.height * 0.25;

    for (var i = 0; i < count; i++) {
      (function (i) {
        setTimeout(function () {
          /* Spread dari dua titik sedikit berbeda agar lebih natural */
          var offsetX = randomBetween(-80, 80);
          var p = createParticle(cx + offsetX, cy);

          /* Ledakan ke segala arah */
          p.vx = randomBetween(-9, 9);
          p.vy = randomBetween(-12, -2);
          particles.push(p);
        }, i * 12);
      })(i);
    }
  }

  /* ----------------------------------------------------------
     7. HUJAN CONFETTI — jatuh dari atas (gelombang)
  ---------------------------------------------------------- */
  function rainConfetti(totalCount, duration) {
    var interval = duration / totalCount;

    running = true;

    var spawned = 0;
    var rainTimer = setInterval(function () {
      if (spawned >= totalCount) {
        clearInterval(rainTimer);
        running = false;
        return;
      }

      /* Spawn 2–4 partikel sekaligus per tick */
      var batch = Math.floor(randomBetween(2, 5));
      for (var b = 0; b < batch && spawned < totalCount; b++) {
        particles.push(createParticle());
        spawned++;
      }
    }, interval);
  }

  /* ----------------------------------------------------------
     8. TRIGGER UTAMA — klik tombol
  ---------------------------------------------------------- */
  btn.addEventListener('click', function () {
    /* Animasi tombol */
    btn.classList.remove('closing__confetti-btn--active');
    void btn.offsetWidth; /* force reflow */
    btn.classList.add('closing__confetti-btn--active');

    btn.addEventListener('animationend', function () {
      btn.classList.remove('closing__confetti-btn--active');
    }, { once: true });

    /* Mulai animasi jika belum berjalan */
    if (!animId) {
      animId = requestAnimationFrame(animate);
    }

    /* Fase 1: burst dari tengah */
    burstConfetti(80);

    /* Fase 2: hujan dari atas selama 4 detik */
    setTimeout(function () {
      rainConfetti(160, 4000);
    }, 300);

    /* Fase 3: burst kedua setelah sedikit jeda */
    setTimeout(function () {
      burstConfetti(50);
    }, 1200);
  });

  /* ----------------------------------------------------------
     9. AUTO-TRIGGER satu kali saat section masuk viewport
  ---------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    var autoTriggered = false;

    var closingObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !autoTriggered) {
          autoTriggered = true;

          /* Delay sedikit agar reveal animation selesai dulu */
          setTimeout(function () {
            if (!animId) animId = requestAnimationFrame(animate);
            burstConfetti(50);
            rainConfetti(100, 3500);
          }, 800);

          closingObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.30 });

    var closingSection = document.getElementById('closing');
    if (closingSection) closingObserver.observe(closingSection);
  }

  /* ----------------------------------------------------------
     10. WISH CARDS — animasi masuk stagger
  ---------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    var wishObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var cards = entry.target.querySelectorAll('.wish-card');
        cards.forEach(function (card, i) {
          card.style.opacity   = '0';
          card.style.transform = 'translateY(30px)';
          card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.4,0,0.2,1)';

          setTimeout(function () {
            card.style.opacity   = '1';
            card.style.transform = 'translateY(0)';
          }, 150 + i * 180);
        });

        wishObserver.unobserve(entry.target);
      });
    }, { threshold: 0.20 });

    var wishesWrapper = document.querySelector('.closing__wishes');
    if (wishesWrapper) wishObserver.observe(wishesWrapper);
  }

})();