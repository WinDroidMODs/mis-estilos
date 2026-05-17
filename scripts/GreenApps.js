(function(){
  'use strict';

  // ---------- COOKIE BANNER ----------
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

  // ---------- MENÚ HAMBURGUESA ----------
  var navCheckbox = document.getElementById('nav-check');
  var navMenu = document.getElementById('navMenu');
  var toggleBtn = document.querySelector('.nav__toggle');

  function closeAllSubmenus() {
    if (!navMenu) return;
    navMenu.querySelectorAll('.dropdown.open').forEach(function(dd){
      dd.classList.remove('open');
    });
  }

  function closeMainMenu() {
    if (navCheckbox) {
      navCheckbox.checked = false;
    }
    closeAllSubmenus();
  }

  // Cierre al hacer clic fuera del menú
  document.addEventListener('click', function(event) {
    if (!navCheckbox || !navCheckbox.checked) return;
    var clickedInsideMenu = navMenu && navMenu.contains(event.target);
    var clickedOnToggle = toggleBtn && toggleBtn.contains(event.target);
    if (!clickedInsideMenu && !clickedOnToggle) {
      closeMainMenu();
    }
  });

  // Toggle de submenús (válido para móvil y escritorio)
  if (navMenu) {
    var dropdowns = navMenu.querySelectorAll('.dropdown');
    dropdowns.forEach(function(dropdown){
      var link = dropdown.querySelector(':scope > a:first-child');
      if (!link) return;
      link.addEventListener('click', function(e){
        // En móvil (<=768px) manejamos el toggle
        if (window.innerWidth <= 768) {
          e.preventDefault(); // evita navegación del enlace padre
          e.stopPropagation();
          var isOpen = dropdown.classList.contains('open');
          // Cierra todos los submenús
          closeAllSubmenus();
          // Si no estaba abierto, lo abre
          if (!isOpen) {
            dropdown.classList.add('open');
          }
        }
        // En escritorio el comportamiento hover se mantiene por CSS
      });
    });

    // Cierra el menú al hacer clic en cualquier enlace del menú (excepto dropdowns padres en móvil)
    navMenu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(e){
        // Si es un enlace de submenú (dentro de .dropdown__menu) o un enlace normal, cerramos el menú
        if (window.innerWidth <= 768 && navCheckbox && navCheckbox.checked) {
          // Evitamos interferir con el toggle del dropdown padre
          if (!link.parentElement.classList.contains('dropdown') || link.parentElement.querySelector(':scope > a:first-child') !== link) {
            setTimeout(closeMainMenu, 150);
          }
        }
      });
    });
  }

  // ---------- HEADER STICKY ----------
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function(){
      header.classList.toggle('scrolled', window.scrollY > 80);
    });
  }

  // ---------- BOTÓN VOLVER ARRIBA ----------
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function(){
      var totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrolled = window.scrollY;
      var percent = totalHeight > 0 ? (scrolled / totalHeight) * 100 : 0;
      backToTop.classList.toggle('show', percent >= 50);
    });
    backToTop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- RESPUESTA A COMENTARIOS ----------
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
