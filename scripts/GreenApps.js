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

  // Menú hamburguesa con JS (sin checkbox)
  var toggleBtn = document.querySelector('.nav__toggle');
  var navMenu = document.getElementById('navMenu');
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', function(e){
      e.stopPropagation();
      this.classList.toggle('active');
      navMenu.classList.toggle('show');
    });
  }

  // Dropdowns en móvil
  if (navMenu) {
    navMenu.querySelectorAll('.dropdown').forEach(function(dd){
      var link = dd.querySelector('a:first-child');
      if (link) {
        link.addEventListener('click', function(e) {
          if (window.innerWidth <= 768 && navMenu.classList.contains('show')) {
            e.preventDefault();
            dd.classList.toggle('open');
          }
        });
      }
    });
  }

  // Cerrar menú al hacer clic fuera (opcional)
  document.addEventListener('click', function(event) {
    if (navMenu && navMenu.classList.contains('show') && !toggleBtn.contains(event.target) && !navMenu.contains(event.target)) {
      navMenu.classList.remove('show');
      toggleBtn.classList.remove('active');
    }
  });

  // Header sticky
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 80) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  // Botón volver arriba: visible al 50% del scroll total de la página
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      var totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrolled = window.scrollY;
      var percentScrolled = (scrolled / totalHeight) * 100;
      if (percentScrolled >= 50) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Responder a comentario
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

  // Cancelar respuesta
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
