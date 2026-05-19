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

  // Menú móvil: toggle general (abrir/cerrar el cajón del menú)
  var navMenu = document.getElementById('navMenu');
  var navToggle = document.querySelector('.nav__toggle');
  var header = document.getElementById('header');
  var body = document.body;

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e){
      e.stopPropagation();
      this.classList.toggle('active');
      navMenu.classList.toggle('open');
      // Prevenir scroll cuando el menú está abierto
      if (navMenu.classList.contains('open')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    });
  }

  // Cerrar menú móvil al hacer clic en un enlace que NO tiene submenú
  function closeMobileMenu() {
    if (window.innerWidth <= 768 && navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      if (navToggle) navToggle.classList.remove('active');
      body.style.overflow = '';
    }
  }

  // DROPDOWNS EN MÓVIL: comportamiento interruptor y solo uno abierto
  if (navMenu) {
    var dropdowns = navMenu.querySelectorAll('.dropdown');
    dropdowns.forEach(function(dd){
      var link = dd.querySelector('a:first-child');
      if (link) {
        link.addEventListener('click', function(e) {
          if (window.innerWidth <= 768) {
            e.preventDefault(); // Evita navegar al hacer clic en el padre (solo abre/cierra)
            // Si este dropdown ya está abierto, lo cerramos
            if (dd.classList.contains('open')) {
              dd.classList.remove('open');
            } else {
              // Cerrar todos los demás dropdowns
              dropdowns.forEach(function(otherDd){
                otherDd.classList.remove('open');
              });
              // Abrir el actual
              dd.classList.add('open');
            }
          }
        });
      }
    });

    // También cerrar menú completo al hacer clic en enlaces que no son dropdown
    var allLinks = navMenu.querySelectorAll('a');
    allLinks.forEach(function(link){
      link.addEventListener('click', function(e){
        // Si el enlace NO es el primer hijo de un dropdown (es decir, no es el que tiene submenú)
        var parentDropdown = link.closest('.dropdown');
        if (!parentDropdown || link !== parentDropdown.querySelector('a:first-child')) {
          // Es un enlace normal (o sub-enlace) -> cerrar menú móvil
          closeMobileMenu();
        }
      });
    });
  }

  // Header sticky y botón volver arriba (aparece al 50% del scroll)
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

  // Cerrar menú si se hace clic fuera de él (opcional, mejora UX)
  document.addEventListener('click', function(event) {
    if (window.innerWidth <= 768 && navMenu && navMenu.classList.contains('open')) {
      var isClickInside = navMenu.contains(event.target) || navToggle.contains(event.target);
      if (!isClickInside) {
        closeMobileMenu();
      }
    }
  });

})();
