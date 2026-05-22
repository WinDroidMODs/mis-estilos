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

  // Elementos del nuevo menú off-canvas
  var navToggle = document.querySelector('.nav__toggle');
  var overlay = document.querySelector('.menu-overlay');
  var sideMenu = document.querySelector('.hamburger-menu');
  var closeBtn = document.querySelector('.hamburger-menu .close-btn');

  function openMenu() {
    document.body.classList.add('menu-open');
    if (overlay) overlay.classList.add('active');
    if (sideMenu) sideMenu.classList.add('open');
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (overlay) overlay.classList.remove('active');
    if (sideMenu) sideMenu.classList.remove('open');
  }

  if (navToggle) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (sideMenu && sideMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Manejo de submenús dentro del menú lateral
  var navItems = document.querySelectorAll('.hamburger-menu .nav-item');
  navItems.forEach(function(item) {
    var link = item.querySelector('> a');
    if (link && item.querySelector('.submenu')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        item.classList.toggle('open');
      });
    }
  });

  // Header sticky y botón volver arriba (umbral 50%)
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

  // Responder a comentario (si usas comentarios)
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
