/* ============================================================
   NAVBAR
   ============================================================ */

(function initNavbar() {

  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const allLinks    = document.querySelectorAll('.navbar__link');

  if (!navbar) return;

  /* ----------------------------------------------------------
     1. ACTIVE LINK HIGHLIGHT (Dipindah ke atas agar siap dibaca)
  ---------------------------------------------------------- */
  const sections = Array.from(
    document.querySelectorAll('section[id], div[id]')
  ).filter(function (el) {
    return document.querySelector('.navbar__link[href="#' + el.id + '"]');
  });

  function highlightActiveLink() {
    const scrollY      = window.scrollY;
    const navbarHeight = navbar.offsetHeight;
    let   activeId     = null;

    sections.forEach(function (section) {
      const top    = section.offsetTop - navbarHeight - 60;
      const bottom = top + section.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        activeId = section.id;
      }
    });

    allLinks.forEach(function (link) {
      const isActive = link.getAttribute('href') === '#' + activeId;
      link.classList.toggle('navbar__link--active', isActive);
    });
  }

  /* ----------------------------------------------------------
     2. SCROLL EFFECT
  ---------------------------------------------------------- */
  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
    highlightActiveLink();
  }


  /* ----------------------------------------------------------
     3. HAMBURGER TOGGLE (Buka/Tutup Menu HP)
  ---------------------------------------------------------- */
  function openMenu() {
    mobileMenu.classList.add('navbar__mobile--open');
    hamburger.classList.add('navbar__hamburger--open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.remove('navbar__mobile--open');
    hamburger.classList.remove('navbar__hamburger--open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.contains('navbar__mobile--open');
    isOpen ? closeMenu() : openMenu();
  });

  mobileMenu.querySelectorAll('.navbar__link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  /* ----------------------------------------------------------
     4. SMOOTH SCROLL (Luncuran Menu)
  ---------------------------------------------------------- */
  allLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = navbar.offsetHeight;
      const targetTop    = target.getBoundingClientRect().top
                         + window.scrollY
                         - navbarHeight;

      window.scrollTo({
        top     : targetTop,
        behavior: 'smooth',
      });
    });
  });

  /* ----------------------------------------------------------
     5. NYALAKAN MESINNYA! 
     (Ditaruh paling bawah setelah semua siap)
  ---------------------------------------------------------- */
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); 

})();