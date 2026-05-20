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

  // Menú móvil (control directo)
  var navCheck = document.getElementById('nav-check');
  var navMenu = document.getElementById('navMenu');
  var navToggle = document.querySelector('.nav__toggle');

  function openMenu() {
    if (navCheck) navCheck.checked = true;
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (navCheck) navCheck.checked = false;
    document.body.style.overflow = '';
    // Cierra todos los submenús al cerrar el panel
    document.querySelectorAll('.dropdown.open').forEach(function(d){ d.classList.remove('open'); });
  }

  if (navToggle && navMenu && navCheck) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (navCheck.checked) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Overlay cierra el menú
    var overlay = document.querySelector('.menu-overlay');
    if (overlay) {
      overlay.addEventListener('click', function() {
        closeMenu();
      });
    }

    // Cerrar menú al hacer clic en enlaces, EXCEPTO las flechas de submenú
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          // Si es el primer enlace de un dropdown, no cerrar
          if (link.parentElement.classList.contains('dropdown') && link === link.parentElement.children[0]) {
            return;
          }
          closeMenu();
        }
      });
    });

    // Dropdowns: cada flecha abre/cierra su submenú (múltiples abiertos permitidos)
    navMenu.querySelectorAll('.dropdown').forEach(function(dd){
      var toggleLink = dd.querySelector('a:first-child');
      if (toggleLink) {
        toggleLink.addEventListener('click', function(e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation(); // evita cerrar el panel
            dd.classList.toggle('open');
          }
        });
      }
    });
  }

  // Header sticky y botón volver arriba
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');
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
