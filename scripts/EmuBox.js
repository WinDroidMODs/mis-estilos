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

  // Header sticky y botón volver arriba (umbral 40%)
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    var umbralScroll = document.documentElement.scrollHeight * 0.4;
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

  // ANIMACIONES PROFESIONALES AL APARECER (Intersection Observer)
  // Añade la clase "animate-on-scroll" a todos los elementos que queremos animar
  // y luego observa cuándo entran en el viewport para añadir la clase "visible"
  function initScrollAnimations() {
    // Seleccionamos todos los elementos que deben animarse al hacer scroll
    var elementsToAnimate = document.querySelectorAll(
      '.post-card, .widget, .pagination, .article, .hero__content, .footer__top, .footer__copy'
    );
    
    if (elementsToAnimate.length === 0) return;
    
    // Añadir la clase base "animate-on-scroll" a cada elemento
    elementsToAnimate.forEach(function(el) {
      // Evitar añadir duplicados
      if (!el.classList.contains('animate-on-scroll')) {
        el.classList.add('animate-on-scroll');
      }
    });
    
    // Configurar el Intersection Observer
    var observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -20px 0px' // Se activa un poco antes de que entre completamente
    };
    
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Dejar de observarlo una vez animado
        }
      });
    }, observerOptions);
    
    // Observar cada elemento
    elementsToAnimate.forEach(function(el) {
      observer.observe(el);
    });
  }
  
  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }
})();
