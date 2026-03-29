/* ============================================================
   LOADER SCREEN
   ============================================================ */
   (function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  /**
   * Sembunyikan loader setelah halaman siap.
   * Minimal 1400ms supaya animasi sempat terlihat,
   * lalu tunggu sampai window.onload selesai.
   */
  const MIN_DURATION = 2000; // milidetik
  const startTime   = Date.now();

  function hideLoader() {
    const elapsed   = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DURATION - elapsed);

    setTimeout(function () {
      loader.classList.add('loader--hidden');

      // Hapus dari DOM setelah transisi selesai (0.6 detik)
      loader.addEventListener(
        'transitionend',
        function () { loader.remove(); },
        { once: true }
      );
    }, remaining);
  }

  // Tunggu sampai semua aset (gambar, font, dll.) selesai dimuat
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });
  }
})();