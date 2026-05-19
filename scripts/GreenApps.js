(function(){
  'use strict';

  // -------------------------------
  // Cookie banner
  // -------------------------------
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

  // -------------------------------
  // Elementos del DOM
  // -------------------------------
  var navMenu = document.getElementById('navMenu');
  var navToggle = document.querySelector('.nav__toggle');
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');
  var menuOverlay = document.querySelector('.menu-overlay');

  // Crear overlay si no existe (para móvil)
  if (!menuOverlay && window.innerWidth <= 768) {
    menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);
  }

  // -------------------------------
  // Funciones para el menú lateral
  // -------------------------------
  function openMenu() {
    if (navMenu) navMenu.classList.add('open');
    if (menuOverlay) menuOverlay.classList.add('active');
    if (navToggle) navToggle.classList.add('active');
    document.body.style.overflow = 'hidden'; // Evita scroll detrás
  }

  function closeMenu() {
    if (navMenu) navMenu.classList.remove('open');
    if (menuOverlay) menuOverlay.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');
    document.body.style.overflow = '';
    // Opcional: cerrar todos los submenús al cerrar el menú lateral
    closeAllSubmenus();
  }

  function toggleMenu() {
    if (navMenu && navMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // -------------------------------
  // Submenús tipo acordeón (solo móvil)
  // -------------------------------
  var dropdowns = document.querySelectorAll('.dropdown');

  function closeAllSubmenus() {
    dropdowns.forEach(function(dd) {
      dd.classList.remove('open');
    });
  }

  function openSubmenu(dropdown) {
    dropdown.classList.add('open');
  }

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function handleDropdownClick(e) {
    if (!isMobile()) return;
    // Prevenir la navegación del enlace padre en móvil
    e.preventDefault();
    var dropdown = this.closest('.dropdown');
    if (!dropdown) return;

    var isOpen = dropdown.classList.contains('open');
    if (isOpen) {
      dropdown.classList.remove('open');
    } else {
      closeAllSubmenus();
      openSubmenu(dropdown);
    }
  }

  // Asignar evento a cada dropdown (solo en móvil)
  function bindDropdownEvents() {
    dropdowns.forEach(function(dd) {
      var parentLink = dd.querySelector('a:first-child');
      if (parentLink) {
        parentLink.removeEventListener('click', handleDropdownClick);
        parentLink.addEventListener('click', handleDropdownClick);
      }
    });
  }

  // Re-evaluar cuando cambie el tamaño de la ventana (por si cambia de móvil a escritorio)
  window.addEventListener('resize', function() {
    if (!isMobile()) {
      // En escritorio, aseguramos que el menú no esté abierto y se quiten estilos
      if (navMenu) navMenu.classList.remove('open');
      if (menuOverlay) menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
      closeAllSubmenus();
      // En escritorio, los dropdowns deben funcionar con hover (no con click)
      dropdowns.forEach(function(dd) {
        var parentLink = dd.querySelector('a:first-child');
        if (parentLink) {
          parentLink.removeEventListener('click', handleDropdownClick);
          // Restauramos comportamiento normal (sin preventDefault)
          parentLink.addEventListener('click', function(e) {
            // Permitir navegación normal en escritorio
            return true;
          });
        }
      });
    } else {
      bindDropdownEvents();
    }
  });

  // Ejecutar binding inicial
  bindDropdownEvents();

  // -------------------------------
  // Evento del botón hamburguesa
  // -------------------------------
  if (navToggle) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });
  }

  // Cerrar menú al hacer clic en el overlay
  if (menuOverlay) {
    menuOverlay.addEventListener('click', function() {
      closeMenu();
    });
  }

  // Cerrar menú al hacer clic en cualquier enlace del menú (solo en móvil)
  var allNavLinks = document.querySelectorAll('.nav__menu a');
  allNavLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      if (!isMobile()) return;
      // Si el clic es en un dropdown padre (con submenú) no cerramos el menú principal
      if (link.closest('.dropdown') && link === link.closest('.dropdown').querySelector('a:first-child')) {
        return;
      }
      // Para cualquier otro enlace (submenú o enlace normal), cerramos el menú lateral
      closeMenu();
    });
  });

  // -------------------------------
  // Header sticky y botón volver arriba (umbral 50%)
  // -------------------------------
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

  // -------------------------------
  // Responder a comentarios (reply)
  // -------------------------------
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

})();
