/* EmuBox.js v2.0 - Nuevo menú lateral profesional */

(function() {
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

  // Elementos del nuevo menú
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuOverlay = document.getElementById('menuOverlay');
  var closeMenu = document.getElementById('closeMenu');
  var body = document.body;

  function openMenu() {
    mobileMenu.classList.add('active');
    menuOverlay.classList.add('active');
    hamburger.classList.add('active');
    body.style.overflow = 'hidden';
  }

  function closeMenuFn() {
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    hamburger.classList.remove('active');
    body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeMenu) closeMenu.addEventListener('click', closeMenuFn);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenuFn);

  // Submenús dentro del menú lateral (un toque abre/cierra)
  var dropdowns = document.querySelectorAll('#mobileMenu .dropdown');
  dropdowns.forEach(function(dd) {
    var link = dd.querySelector('> a');
    if (link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        dd.classList.toggle('open');
      });
    }
  });

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

  // Responder comentarios (igual que antes)
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
