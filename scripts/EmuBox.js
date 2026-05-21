/* EmuBox.js v1.0 | Autor: Robinson Avila | By: WinDroidMODs */

(function(){
  'use strict';

  // Cookie banner
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

  // Elementos del menú
  var navMenu = document.getElementById('navMenu');
  var navToggle = document.querySelector('.nav__toggle');
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');

  // Abrir/cerrar el menú principal al hacer clic en el botón hamburguesa
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e){
      e.stopPropagation();
      this.classList.toggle('active');
      navMenu.classList.toggle('open');
    });
  }

  // Manejo de submenús en móvil: un solo toque abre/cierra (alterna), sin cerrar otros
  function initMobileDropdowns() {
    if (!navMenu) return;
    var dropdowns = navMenu.querySelectorAll('.dropdown');
    dropdowns.forEach(function(dd){
      var link = dd.querySelector('a:first-child');
      if (!link) return;
      // Eliminar eventos antiguos para evitar duplicados
      link.removeEventListener('click', toggleDropdown);
      link.addEventListener('click', toggleDropdown);
      function toggleDropdown(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          // Alternar la clase 'open' solo en este dropdown
          dd.classList.toggle('open');
        }
      }
    });
  }

  // Inicializar y también reinicializar cuando cambie el tamaño de la ventana
  initMobileDropdowns();
  window.addEventListener('resize', function() {
    // Si la pantalla es mayor a 768px, aseguramos que no queden submenús abiertos
    if (window.innerWidth > 768) {
      if (navMenu) {
        var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
        openDropdowns.forEach(function(dd){
          dd.classList.remove('open');
        });
      }
    } else {
      // En móvil, solo aseguramos que los eventos estén configurados
      initMobileDropdowns();
    }
  });

  // Opcional: cerrar el menú principal si se hace clic fuera (solo el menú principal, no los submenús)
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768 && navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove('open');
      if (navToggle) navToggle.classList.remove('active');
    }
  });

  // Header sticky y botón volver arriba (umbral 50%)
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    var umbralScroll = document.documentElement.scrollHeight * 0.5;
    if (window.scrollY > umbralScroll) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });

  if (backToTop) {
    backToTop.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  // Responder a comentario
  window.replyToComment = function(button) {
    var commentId = button.getAttribute('data-comment-id');
    var author = button.getAttribute('data-comment-author');
    var notice = document.getElementById('reply-notice');
    var authorSpan = document.getElementById('reply-author-name');
    var editor = document.getElementById('comment-editor');
    var formSrc = document.getElementById('comment-editor-src') ? document.getElementById('comment-editor-src').href : null;

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
    var formSrc = document.getElementById('comment-editor-src') ? document.getElementById('comment-editor-src').href : null;

    if (notice && editor && formSrc) {
      notice.classList.remove('show');
      editor.src = formSrc;
    }
  };

})();
