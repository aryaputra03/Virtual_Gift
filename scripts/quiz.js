/* ============================================================
   QUIZ — Soal Integral Matematika
   ============================================================ */

(function initQuiz() {

  /* ----------------------------------------------------------
     ⚠️  GANTI URL INI DENGAN LINK YANG KAMU MAU  ⚠️
  ---------------------------------------------------------- */
  var REWARD_URL = 'https://wa.me/6289503687908?text=Kak%20aku%20abil%20sudah%20menamatkan%20quiz%20cuman%20aku%20mengakui%20aku%20ngecheat';

  /* ----------------------------------------------------------
     Jawaban benar (tidak case-sensitive, toleransi spasi)
  ---------------------------------------------------------- */
  var CORRECT_ANSWER = '2026';

  /* ----------------------------------------------------------
     Pesan ledek kalau salah (dipilih acak)
  ---------------------------------------------------------- */
  var WRONG_MESSAGES = [
    {
      emoji: '😂',
      title: 'Hahahaha Jangan Tidur dikelas!',
      body:  'Katanya mau masuk juruasan teknik sipil soal kek gini doang gak bisa <strong>Coba lagi deh~</strong>',
    },
    {
      emoji: '💀',
      title: 'Bimbel dulu dek....',
      body:  'Kamu ranking berapa bil pas SMA kok gini doang gak bisa... 😭',
    },
    {
      emoji: '🤦',
      title: 'Wkwkwkwk salah lagi~',
      body:  'Bikin kopi doang ngerjain soal matematika dasar gak bisa, <strong>Latte artmu tak seindah persamaanTrigonometriku</strong>',
    },
    {
      emoji: '😭',
      title: 'Masih salah juga Bil...',
      body:  'aku tebak kamu pas mapel MTK tidur mulu kan... remidi mulu sampai ortumu masuk ke raung BK gara gara nilai MTTKmu',
    },
    {
      emoji: '🙃',
      title: 'Saallllahhhhhhhhhhhhhhhhh.',
      body:  '"Aku keknya kalau mau kuliah masuk jurusan arsitek" Arsitek dari mana yang ada roboh semua bangunan',
    },
    {
      emoji: '🫡',
      title: 'salah lagi salah lagi',
      body:  'Coba ngopi dulu sejenak........... habis itu ngerjain lagi, cuman percuma tetep gak bisa jawab sih kamu wkwkwkwkwkwk',
    },
    {
      emoji: '🤡',
      title: 'Absolutely no.',
      body:  'salah lagi salah lagi, salah muluuuu, ngitung pendapatan di kasir aja bisa masak soal dasar kayak ini gak bisa',
    },
  ];

  /* ----------------------------------------------------------
     Elemen DOM
  ---------------------------------------------------------- */
  var triggerBtn   = document.getElementById('triggerQuiz');
  var overlay      = document.getElementById('quizOverlay');
  var overlayBg    = document.getElementById('quizBg');
  var closeBtn     = document.getElementById('quizClose');
  var answerInput  = document.getElementById('quizAnswer');
  var submitBtn    = document.getElementById('quizSubmit');
  var feedbackEl   = document.getElementById('quizFeedback');
  var hintBtn      = document.getElementById('quizHintBtn');
  var hintBox      = document.getElementById('quizHintBox');
  var mathEl       = document.getElementById('quizMath');
  var particlesEl  = document.getElementById('quizParticles');

  if (!triggerBtn || !overlay) return;

  /* ----------------------------------------------------------
     State
  ---------------------------------------------------------- */
  var isOpen     = false;
  var attempts   = 0;
  var solved     = false;

  /* Counter percobaan (dibuat dinamis) */
  var attemptsEl = document.createElement('div');
  attemptsEl.className = 'quiz-overlay__attempts';
  overlay.querySelector('.quiz-overlay__inner').appendChild(attemptsEl);

  /* ----------------------------------------------------------
     1. RENDER KaTeX — tunggu library siap
  ---------------------------------------------------------- */
  function renderMath() {
    if (!mathEl) return;

    /* Cek apakah KaTeX sudah loaded */
    if (typeof window.renderMathInElement === 'function') {
      renderMathInElement(mathEl, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$',  right: '$',  display: false },
        ],
        throwOnError: false,
      });
    }
    /* Kalau belum, coba lagi setelah 300ms */
    else {
      setTimeout(renderMath, 300);
    }
  }

  /* ----------------------------------------------------------
     2. SPAWN PARTIKEL DEKORATIF di dalam overlay
  ---------------------------------------------------------- */
  function spawnQuizParticles() {
    if (!particlesEl) return;
    particlesEl.innerHTML = '';

    var colors  = ['#52b788', '#74c69d', '#b7e4c7', '#d8f3dc', '#95d5b2', '#ffffff'];
    var count   = 28;

    for (var i = 0; i < count; i++) {
      var p        = document.createElement('div');
      p.className  = 'quiz-particle';

      var size     = 3 + Math.random() * 8;
      var color    = colors[Math.floor(Math.random() * colors.length)];
      var duration = 10 + Math.random() * 18;
      var delay    = Math.random() * 16;
      var left     = Math.random() * 100;
      var opacity  = 0.15 + Math.random() * 0.30;

      Object.assign(p.style, {
        width             : size + 'px',
        height            : size + 'px',
        borderRadius      : Math.random() > 0.5 ? '50%' : '2px',
        backgroundColor   : color,
        bottom            : '-20px',
        left              : left + '%',
        animationDuration : duration + 's',
        animationDelay    : '-' + delay + 's',
        opacity           : opacity,
      });

      particlesEl.appendChild(p);
    }
  }

  /* ----------------------------------------------------------
     3. BUKA QUIZ
  ---------------------------------------------------------- */
  function openQuiz() {
    isOpen = true;
    document.body.style.overflow = 'hidden';

    overlayBg.classList.add('quiz-overlay__bg--open');
    overlay.classList.add('quiz-overlay--open');

    /* Re-render math setiap kali dibuka */
    setTimeout(renderMath, 80);

    /* Spawn partikel */
    spawnQuizParticles();

    /* Fokus ke input */
    setTimeout(function () {
      if (answerInput) answerInput.focus();
    }, 500);

    updateAttemptsDisplay();
  }

  /* ----------------------------------------------------------
     4. TUTUP QUIZ
  ---------------------------------------------------------- */
  function closeQuiz() {
    isOpen = false;
    document.body.style.overflow = '';
    overlay.classList.remove('quiz-overlay--open');
    overlayBg.classList.remove('quiz-overlay__bg--open');
  }

  /* ----------------------------------------------------------
     5. UPDATE COUNTER PERCOBAAN
  ---------------------------------------------------------- */
  function updateAttemptsDisplay() {
    if (attempts === 0) {
      attemptsEl.textContent = '';
    } else {
      attemptsEl.textContent = 'Percobaan: ' + attempts + 'x' +
        (attempts >= 5 ? ' 😬' : attempts >= 3 ? ' 😅' : '');
    }
  }

  /* ----------------------------------------------------------
     6. PILIH PESAN LEDEK ACAK
  ---------------------------------------------------------- */
  function getWrongMessage(answer) {
    var idx = Math.floor(Math.random() * WRONG_MESSAGES.length);
    var msg = WRONG_MESSAGES[idx];

    /* Ganti placeholder {answer} dengan jawaban user */
    var body = msg.body.replace(/\{answer\}/g, answer || '???');

    return { emoji: msg.emoji, title: msg.title, body: body };
  }

  /* ----------------------------------------------------------
     7. VALIDASI JAWABAN
  ---------------------------------------------------------- */
  function checkAnswer() {
    if (solved) return;

    var raw     = answerInput.value.trim();
    var cleaned = raw.replace(/\s+/g, '').toLowerCase();

    if (!cleaned) {
      /* Kosong — goyang input saja */
      answerInput.classList.add('quiz-overlay__input--wrong');
      setTimeout(function () {
        answerInput.classList.remove('quiz-overlay__input--wrong');
      }, 600);
      answerInput.focus();
      return;
    }

    attempts++;
    updateAttemptsDisplay();

    /* ---- BENAR ---- */
    if (cleaned === CORRECT_ANSWER.toLowerCase()) {
      handleCorrect();
      return;
    }

    /* ---- SALAH ---- */
    handleWrong(raw);
  }

  /* ----------------------------------------------------------
     8. HANDLER JAWABAN BENAR
  ---------------------------------------------------------- */
  function handleCorrect() {
    solved = true;

    answerInput.classList.remove('quiz-overlay__input--wrong');
    answerInput.classList.add('quiz-overlay__input--correct');
    answerInput.disabled = true;
    submitBtn.disabled   = true;

    /* Animasi card */
    var inner = overlay.querySelector('.quiz-overlay__inner');
    inner.classList.add('quiz-overlay__inner--correct');

    /* Tampilkan pesan benar */
    var html =
      '<div class="quiz-overlay__feedback-box quiz-overlay__feedback-box--correct">' +
        '<div style="font-size:2rem;margin-bottom:10px;">🎉🌿🎊</div>' +
        '<strong>FIX NGECHEAT!!</strong><br/>' +
        '<span style="font-size:0.82rem;opacity:0.85;">' +
          'Integral itu = 2026 karena dua suku pertama adalah <strong>fungsi ganjil</strong> ' +
          'yang diintegralkan pada interval simetris, jadi keduanya = 0. ' +
          'Suku ketiga = sin²+cos²=1, jadi ½·(2026−(−2026)) = <strong>2026</strong>. ' +
          'Ngecheat pakai apa kamu????? mesti chatgpt/photomath ngaku kamu' +
        '</span>' +
        '<br/><br/>' +
        '<a href="' + REWARD_URL + '" class="quiz-overlay__go-btn" target="_blank" rel="noopener">' +
          '🎁 Klaim Hadiahmu!' +
        '</a>' +
      '</div>';

    feedbackEl.innerHTML = html;

    /* Mini confetti celebration */
    triggerMiniConfetti();
  }

  /* ----------------------------------------------------------
     9. HANDLER JAWABAN SALAH
  ---------------------------------------------------------- */
  function handleWrong(userAnswer) {
    /* Animasi goyang input */
    answerInput.classList.add('quiz-overlay__input--wrong');
    setTimeout(function () {
      answerInput.classList.remove('quiz-overlay__input--wrong');
    }, 600);

    /* Pilih ledakan pesan */
    var msg  = getWrongMessage(userAnswer);

    var html =
      '<div class="quiz-overlay__feedback-box quiz-overlay__feedback-box--wrong">' +
        '<div style="font-size:1.8rem;margin-bottom:8px;">' + msg.emoji + '</div>' +
        '<strong style="font-size:0.95rem;">' + msg.title + '</strong><br/>' +
        '<span style="font-size:0.83rem;">' + msg.body + '</span>' +
      '</div>';

    feedbackEl.innerHTML = html;

    /* Kosongkan input & fokus ulang */
    answerInput.value = '';
    setTimeout(function () {
      if (!solved) answerInput.focus();
    }, 200);

    /* Setelah 5 salah, tampilkan hint otomatis */
    if (attempts >= 5 && !hintBox.classList.contains('quiz-overlay__hint-box--visible')) {
      hintBox.classList.add('quiz-overlay__hint-box--visible');
      hintBtn.textContent = '💡 Ini ada clue gratis buat kamu~';
    }
  }

  /* ----------------------------------------------------------
     10. MINI CONFETTI saat benar (pakai canvas confetti yang sudah ada,
         atau fallback sendiri kalau tidak tersedia)
  ---------------------------------------------------------- */
  function triggerMiniConfetti() {
    /* Coba panggil confetti button yang sudah ada */
    var confettiBtn = document.getElementById('triggerConfetti');
    if (confettiBtn) {
      setTimeout(function () { confettiBtn.click(); }, 600);
    }
  }

  /* ----------------------------------------------------------
     11. TOGGLE HINT
  ---------------------------------------------------------- */
  hintBtn.addEventListener('click', function () {
    var visible = hintBox.classList.toggle('quiz-overlay__hint-box--visible');
    hintBtn.textContent = visible ? '💡 Tutup clue' : '💡 Butuh clue?';
  });

  /* ----------------------------------------------------------
     12. EVENT LISTENERS
  ---------------------------------------------------------- */

  /* Buka quiz */
  triggerBtn.addEventListener('click', function () {
    openQuiz();

    /* Animasi wiggle tombol */
    triggerBtn.classList.remove('closing__quiz-btn--wiggle');
    void triggerBtn.offsetWidth;
    triggerBtn.classList.add('closing__quiz-btn--wiggle');
    triggerBtn.addEventListener('animationend', function () {
      triggerBtn.classList.remove('closing__quiz-btn--wiggle');
    }, { once: true });
  });

  /* Tutup */
  closeBtn.addEventListener('click', closeQuiz);
  overlayBg.addEventListener('click', closeQuiz);

  /* Escape key */
  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') closeQuiz();
    if (e.key === 'Enter' && document.activeElement === answerInput) {
      checkAnswer();
    }
  });

  /* Tombol submit */
  submitBtn.addEventListener('click', checkAnswer);

  /* Enter di input */
  answerInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') checkAnswer();
  });

  /* Hapus styling error saat mulai mengetik */
  answerInput.addEventListener('input', function () {
    if (answerInput.classList.contains('quiz-overlay__input--wrong')) {
      answerInput.classList.remove('quiz-overlay__input--wrong');
    }
  });

  /* ----------------------------------------------------------
     13. WIGGLE OTOMATIS saat tombol pertama kali terlihat
  ---------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    var wiggleObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        setTimeout(function () {
          triggerBtn.classList.add('closing__quiz-btn--wiggle');
          triggerBtn.addEventListener('animationend', function () {
            triggerBtn.classList.remove('closing__quiz-btn--wiggle');
          }, { once: true });
        }, 1200);

        wiggleObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    wiggleObserver.observe(triggerBtn);
  }

})();