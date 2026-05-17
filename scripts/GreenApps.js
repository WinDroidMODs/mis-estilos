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
  var navCheckbox = document.getElementById('nav-check');
  var navMenu = document.getElementById('navMenu');

  // Función para cerrar todos los submenús
  function closeAllSubmenus() {
    if (navMenu) {
      var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
      openDropdowns.forEach(function(dropdown) {
        dropdown.classList.remove('open');
      });
    }
  }

  // Manejo de submenús en vista móvil: toggle (abre/cierra) y cierra otros
  if (navMenu) {
    var dropdowns = navMenu.querySelectorAll('.dropdown');
    dropdowns.forEach(function(dropdown) {
      var link = dropdown.querySelector('> a:first-child');
      if (!link) return;

      link.addEventListener('click', function(e) {
        // Solo actuar en móvil (ancho <= 768)
        if (window.innerWidth <= 768) {
          // Prevenir la navegación del enlace
          e.preventDefault();
          e.stopPropagation();

          var isOpen = dropdown.classList.contains('open');

          // Cerrar todos los demás submenús
          dropdowns.forEach(function(dd) {
            if (dd !== dropdown) {
              dd.classList.remove('open');
            }
          });

          // Abrir o cerrar el actual
          if (isOpen) {
            dropdown.classList.remove('open');
          } else {
            dropdown.classList.add('open');
          }
        }
      });
    });
  }

  // Header sticky
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Botón volver arriba (visible al 50%)
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

  // Responder a comentarios
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
