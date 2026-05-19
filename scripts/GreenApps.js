(function(){
  'use strict';

  // ===============================
  // Cookie banner
  // ===============================
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

  // ===============================
  // Menú lateral hamburguesa (acordeón con flechas)
  // ===============================
  var menuToggle = document.getElementById('nav-toggle');
  var menuPanel = document.getElementById('nav-menu-panel');
  var menuOverlay = document.getElementById('menu-overlay');
  var body = document.body;

  function openMenu() {
    if (menuPanel) menuPanel.classList.add('open');
    if (menuOverlay) menuOverlay.classList.add('active');
    body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (menuPanel) menuPanel.classList.remove('open');
    if (menuOverlay) menuOverlay.classList.remove('active');
    body.style.overflow = '';
  }
  function toggleMenu() {
    if (menuPanel && menuPanel.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle && menuPanel && menuOverlay) {
    menuToggle.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenu);
  }

  // Acordeón: solo un submenú abierto a la vez, flecha giratoria
  var menuItems = document.querySelectorAll('.nav-menu-item');
  function closeAllSubmenus(exceptItem) {
    menuItems.forEach(function(item) {
      if (item !== exceptItem && item.classList.contains('open')) {
        item.classList.remove('open');
      }
    });
  }
  function toggleSubmenu(item) {
    var isOpen = item.classList.contains('open');
    if (isOpen) {
      item.classList.remove('open');
    } else {
      closeAllSubmenus(item);
      item.classList.add('open');
    }
  }
  // Asignar eventos a los enlaces principales que tengan submenú
  menuItems.forEach(function(item) {
    var link = item.querySelector(':scope > .nav-menu-link');
    if (link && item.querySelector('.nav-submenu')) {
      // Prevenir navegación en móvil y manejar acordeón
      link.addEventListener('click', function(e) {
        e.preventDefault();
        toggleSubmenu(item);
      });
    } else if (link) {
      // Enlace normal: cerrar menú al hacer clic
      link.addEventListener('click', function() {
        closeMenu();
      });
    }
  });

  // Cerrar menú al redimensionar a escritorio (>768px)
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && menuPanel && menuPanel.classList.contains('open')) {
      closeMenu();
    }
  });

  // ===============================
  // Header sticky y botón volver arriba (umbral 50%)
  // ===============================
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    var umbralScroll = document.documentElement.scrollHeight * 0.5;
    if (window.scrollY > umbralScroll) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }

  // ===============================
  // Responder a comentarios
  // ===============================
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

  // Eliminar clase 'no-js' del body
  document.body.classList.remove('no-js');
})();
