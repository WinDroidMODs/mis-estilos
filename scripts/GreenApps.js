(function(){
  'use strict';

  // ---------- Cookie banner ----------
  var cookieBanner = document.getElementById('cookie-banner');
  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.style.display = 'flex';
    var acceptBtn = document.getElementById('cookie-accept');
    var rejectBtn = document.getElementById('cookie-reject');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function(){
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.style.display = 'none';
      });
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function(){
        localStorage.setItem('cookieConsent', 'rejected');
        cookieBanner.style.display = 'none';
      });
    }
  }

  // ---------- Menú móvil ----------
  var navMenu = document.getElementById('navMenu');
  var navToggle = document.querySelector('.nav__toggle');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e){
      e.stopPropagation();
      this.classList.toggle('active');
      navMenu.classList.toggle('open');
    });
  }

  // Dropdowns en móvil
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
  }

  // ---------- Header sticky y botón volver arriba (umbral 50% del scroll) ----------
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');
  
  function checkScroll() {
    // Sticky header
    if (window.scrollY > 80) {
      if (header) header.classList.add('scrolled');
    } else {
      if (header) header.classList.remove('scrolled');
    }
    // Botón volver arriba al 50% del scroll total de la página
    var scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (backToTop) {
      if (scrollPercent >= 0.5) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
  }
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // ejecutar al inicio

  if (backToTop) {
    backToTop.addEventListener('click', function(){
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }

  // ---------- Responder a comentarios ----------
  window.replyToComment = function(button) {
    var commentId = button.getAttribute('data-comment-id');
    var author = button.getAttribute('data-comment-author');
    var notice = document.getElementById('reply-notice');
    var authorSpan = document.getElementById('reply-author-name');
    var editor = document.getElementById('comment-editor');
    var formSrc = document.getElementById('comment-editor-src');
    if (notice && authorSpan && editor && formSrc) {
      authorSpan.textContent = 'Respondiendo a ' + author;
      notice.classList.add('show');
      editor.src = formSrc.href + '&parentID=' + commentId;
      editor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  window.cancelReply = function() {
    var notice = document.getElementById('reply-notice');
    var editor = document.getElementById('comment-editor');
    var formSrc = document.getElementById('comment-editor-src');
    if (notice && editor && formSrc) {
      notice.classList.remove('show');
      editor.src = formSrc.href;
    }
  };

  // ---------- Preload / imagen de fondo del héroe ----------
  // (opcional: si la imagen de fondo no está cargada, se puede forzar)
  var hero = document.querySelector('.hero');
  if (hero) {
    var heroBg = window.getComputedStyle(hero).backgroundImage;
    if (heroBg && heroBg !== 'none') {
      var imgUrl = heroBg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
      if (imgUrl) {
        var preloadImg = new Image();
        preloadImg.src = imgUrl;
      }
    }
  }

  // ---------- Mejora de accesibilidad: añadir atributo 'loading' a imágenes perezosas ----------
  var lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) {
    // ya soporta lazy nativo, no hacer nada
  } else {
    // fallback simple
    var lazyLoad = function() {
      lazyImages.forEach(function(img) {
        if (img.getBoundingClientRect().top < window.innerHeight + 100) {
          img.loading = 'lazy';
        }
      });
    };
    window.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    lazyLoad();
  }
})();
