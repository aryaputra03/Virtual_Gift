/* ============================================================
   FLOATING PARTICLES
   ============================================================ */

(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
 
  const CONFIG = {
    count      : 55,
    minSize    : 3,
    maxSize    : 11,
    minDuration: 8,
    maxDuration: 22,
    minDelay   : 0,
    maxDelay   : 18,
 
    /* === WARNA HIJAU === */
    colors: [
      '#52b788',   /* hijau utama        */
      '#74c69d',   /* hijau muda         */
      '#b7e4c7',   /* mint terang        */
      '#d8f3dc',   /* hijau sangat muda  */
      '#2d6a4f',   /* hijau tua          */
      '#95d5b2',   /* seafoam            */
      '#ffffff',   /* putih aksen        */
    ],
 
    /* Bentuk: lingkaran, berlian, bintang, daun */
    shapes: [
      { type: 'circle',  weight: 4 },
      { type: 'diamond', weight: 3 },
      { type: 'star',    weight: 2 },
      { type: 'leaf',    weight: 3 },
    ],
  };
 
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
  function pickColor() { return CONFIG.colors[randInt(0, CONFIG.colors.length - 1)]; }
 
  function pickShape() {
    const total = CONFIG.shapes.reduce((s, sh) => s + sh.weight, 0);
    let r = Math.random() * total;
    for (const sh of CONFIG.shapes) {
      r -= sh.weight;
      if (r <= 0) return sh.type;
    }
    return 'circle';
  }
 
  function createParticle() {
    const el    = document.createElement('div');
    const size  = rand(CONFIG.minSize, CONFIG.maxSize);
    const shape = pickShape();
    const color = pickColor();
 
    const duration = rand(CONFIG.minDuration, CONFIG.maxDuration);
    const delay    = rand(CONFIG.minDelay, CONFIG.maxDelay);
    const left     = rand(0, 100);
    const drift    = rand(-60, 60);
    const rotate   = rand(-360, 360);
    const opacity  = rand(0.20, 0.65);
 
    el.classList.add('particle');
    if (shape === 'diamond') el.classList.add('particle--diamond');
    if (shape === 'star')    el.classList.add('particle--star');
    if (shape === 'leaf')    el.classList.add('particle--leaf');
 
    Object.assign(el.style, {
      width              : size + 'px',
      height             : size + 'px',
      left               : left + '%',
      bottom             : '-20px',
      backgroundColor    : color,
      animationDuration  : duration + 's',
      animationDelay     : '-' + delay + 's',
      '--p-drift'        : drift + 'px',
      '--p-rotate'       : rotate + 'deg',
      '--p-opacity'      : opacity,
    });
 
    if (shape === 'diamond') el.style.transform = 'rotate(45deg)';
    if (shape === 'leaf')    el.style.transform = 'rotate(' + rand(-30, 30) + 'deg)';
 
    return el;
  }
 
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < CONFIG.count; i++) {
    fragment.appendChild(createParticle());
  }
  container.appendChild(fragment);
 
  /* Pause saat tab tidak aktif */
  document.addEventListener('visibilitychange', function () {
    const state = document.hidden ? 'paused' : 'running';
    container.querySelectorAll('.particle').forEach(function (p) {
      p.style.animationPlayState = state;
    });
  });
 
})();