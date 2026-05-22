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

  // Alternar menú principal al hacer clic en el botón hamburguesa
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e){
      e.stopPropagation();
      this.classList.toggle('active');
      navMenu.classList.toggle('open');
    });
  }

  // MÓVIL: Comportamiento exacto de whale.js para submenús
  // - Un toque sobre el enlace con submenú previene el evento y alterna la clase 'open'
  // - No se cierra al tocar fuera
  function initMobileSubmenus() {
    if (!navMenu) return;
    var dropdowns = navMenu.querySelectorAll('.dropdown');
    dropdowns.forEach(function(dd){
      var link = dd.querySelector('a:first-child');
      if (!link) return;
      // Eliminar evento anterior para evitar duplicados
      link.removeEventListener('click', handleClick);
      link.addEventListener('click', handleClick);
      function handleClick(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          // Alterna la clase 'open' SOLO en este dropdown
          dd.classList.toggle('open');
        }
      }
    });
  }

  // Inicializar y también reinicializar al cambiar el tamaño
  initMobileSubmenus();
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      // Al pasar a escritorio, cerramos todos los submenús abiertos
      if (navMenu) {
        var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
        openDropdowns.forEach(function(dd){
          dd.classList.remove('open');
        });
      }
    } else {
      initMobileSubmenus();
    }
  });

  // Cerrar el menú principal al hacer clic en un enlace (solo si no tiene submenú abierto)
  // Esto mejora la experiencia: al tocar un enlace que no es submenú, se cierra el menú principal.
  if (navMenu) {
    navMenu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          // Si el enlace pertenece a un dropdown y ese dropdown está abierto, no cerramos el menú principal
          var parentDropdown = link.closest('.dropdown');
          if (parentDropdown && parentDropdown.classList.contains('open')) {
            // No hacemos nada, permitimos que el submenú se cierre con su propio evento
            return;
          }
          // Para enlaces normales (sin submenú o con submenú cerrado), cerramos el menú principal
          setTimeout(function(){
            navMenu.classList.remove('open');
            if (navToggle) navToggle.classList.remove('active');
          }, 100);
        }
      });
    });
  }

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
