(function(){
  'use strict';

  /* ==============================================
     COOKIE BANNER
  ============================================== */
  var cookieBanner = document.getElementById('cookie-banner');
  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.style.display = 'flex';
    document.getElementById('cookie-accept').addEventListener('click', function(){
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.style.display = 'none';
    });
    document.getElementById('cookie-reject').addEventListener('click', function(){
      localStorage.setItem('cookieConsent', 'rejected');
      cookieBanner.style.display = 'none';
    });
  }

  /* ==============================================
     MENÚ HAMBURGUESA + SUBMENÚS (nueva técnica)
  ============================================== */
  var navCheck = document.getElementById('nav-check');
  var navMenu = document.getElementById('navMenu');
  var toggleBtn = document.querySelector('.nav__toggle');

  // Cierra completamente el menú (checkbox + submenús)
  function closeMenu() {
    if (navCheck) navCheck.checked = false;
    if (navMenu) {
      var openSubs = navMenu.querySelectorAll('.dropdown.open');
      for (var i = 0; i < openSubs.length; i++) {
        openSubs[i].classList.remove('open');
      }
    }
  }

  // Abre/cierra un submenú concreto y cierra los demás
  function toggleSubmenu(dropdown) {
    var isOpen = dropdown.classList.contains('open');
    // Cerrar todos los submenús
    var allSubs = navMenu.querySelectorAll('.dropdown.open');
    for (var i = 0; i < allSubs.length; i++) {
      allSubs[i].classList.remove('open');
    }
    // Si no estaba abierto, lo abrimos
    if (!isOpen) {
      dropdown.classList.add('open');
    }
  }

  // Delegación de eventos en el menú (solo afecta a móvil)
  if (navMenu) {
    navMenu.addEventListener('click', function(e) {
      if (window.innerWidth > 768) return; // en escritorio se usa hover

      var target = e.target;
      // Buscar si el clic fue sobre el enlace principal de un dropdown
      var dropdownLink = target.closest('.dropdown > a:first-child');
      if (dropdownLink) {
        e.preventDefault();  // evitar navegación en móvil
        e.stopPropagation(); // evitar que el click cierre el menú
        var dropdown = dropdownLink.parentNode; // el .dropdown
        toggleSubmenu(dropdown);
        return;
      }

      // Si se hace clic en cualquier otro enlace (sin submenú), cerramos el menú
      if (target.tagName === 'A' && !target.closest('.dropdown > a:first-child')) {
        setTimeout(closeMenu, 100);
      }
    });
  }

  // Cerrar menú al hacer clic FUERA de él o del botón toggle
  document.addEventListener('click', function(e) {
    if (!navCheck || !navCheck.checked) return; // menú cerrado
    var clickedInsideMenu = navMenu && navMenu.contains(e.target);
    var clickedOnToggle = toggleBtn && toggleBtn.contains(e.target);
    if (!clickedInsideMenu && !clickedOnToggle) {
      closeMenu();
    }
  });

  // Sincronizar cierre de submenús al cerrar el menú hamburguesa
  if (navCheck) {
    navCheck.addEventListener('change', function() {
      if (!navCheck.checked && navMenu) {
        var subs = navMenu.querySelectorAll('.dropdown.open');
        for (var i = 0; i < subs.length; i++) subs[i].classList.remove('open');
      }
    });
  }

  /* ==============================================
     HEADER STICKY
  ============================================== */
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 80);
    });
  }

  /* ==============================================
     BOTÓN VOLVER ARRIBA (visible al 50% scroll)
  ============================================== */
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      var totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrolled = window.scrollY;
      var percent = totalHeight > 0 ? (scrolled / totalHeight) * 100 : 0;
      backToTop.classList.toggle('show', percent >= 50);
    });
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==============================================
     RESPUESTA A COMENTARIOS
  ============================================== */
  window.replyToComment = function(button) {
    var commentId = button.getAttribute('data-comment-id');
    var author = button.getAttribute('data-comment-author');
    var notice = document.getElementById('reply-notice');
    var authorSpan = document.getElementById('reply-author-name');
    var editor = document.getElementById('comment-editor');
    var formSrc = document.getElementById('comment-editor-src').href;
    if (notice && authorSpan && editor && formSrc) {
      authorSpan.textContent = 'Respondiendo a ' + author;
      notice.classList.add('show');
      editor.src = formSrc + '&parentID=' + commentId;
      editor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  window.cancelReply = function() {
    var notice = document.getElementById('reply-notice');
    var editor = document.getElementById('comment-editor');
    var formSrc = document.getElementById('comment-editor-src').href;
    if (notice && editor && formSrc) {
      notice.classList.remove('show');
      editor.src = formSrc;
    }
  };

})();
