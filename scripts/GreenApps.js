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

  // Menu movil
  var navMenu = document.getElementById('navMenu');
  var navToggle = document.querySelector('.nav__toggle');
  var navCheck = document.getElementById('nav-check');

  if (navToggle && navMenu && navCheck) {
    navToggle.addEventListener('click', function(e){
      e.stopPropagation();
      this.classList.toggle('active');
      navMenu.classList.toggle('open');
      // El checkbox se maneja con el label, no necesitamos forzarlo
    });
  }

  // Dropdowns en movil (toggle con flecha)
  if (navMenu) {
    navMenu.querySelectorAll('.dropdown').forEach(function(dd){
      var link = dd.querySelector('a:first-child');
      if (link) {
        link.addEventListener('click', function(e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            dd.classList.toggle('open');
          }
        });
      }
    });

    // Cerrar el menú al hacer clic en cualquier enlace que no sea de dropdown
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function(e) {
        // Si es un enlace normal (no el activador de un dropdown) cerramos el menú
        if (!link.closest('.dropdown') || link !== link.parentElement.querySelector('a:first-child')) {
          if (navCheck) navCheck.checked = false;
        }
      });
    });
  }

  // Header sticky y boton volver arriba (aparece al 50% del scroll)
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    // Umbral cambiado al 50% (0.5)
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

  // Cancelar respuesta
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
