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
  // Menú hamburguesa: panel lateral izquierdo + overlay
  // -------------------------------
  var navMenu = document.getElementById('navMenu');
  var navToggle = document.querySelector('.nav__toggle');
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');

  // Crear overlay si no existe
  var menuOverlay = document.querySelector('.menu-overlay');
  if (!menuOverlay) {
    menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    document.body.appendChild(menuOverlay);
  }

  function openMenu() {
    navMenu.classList.add('open');
    navToggle.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Evita scroll detrás
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    // Opcional: cerrar todos los submenús al cerrar el panel
    closeAllSubmenus();
  }

  function toggleMenu() {
    if (navMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });
  }

  // Cerrar menú al hacer clic en el overlay
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  // -------------------------------
  // Lógica de submenús en móvil: acordeón y flecha giratoria
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
    // Solo en móvil
    if (!isMobile()) return;

    var dropdown = this.closest('.dropdown');
    if (!dropdown) return;

    // Prevenir la navegación del enlace padre (solo en móvil)
    e.preventDefault();

    var isOpen = dropdown.classList.contains('open');
    if (isOpen) {
      dropdown.classList.remove('open');
    } else {
      closeAllSubmenus();
      openSubmenu(dropdown);
    }
  }

  // Asignar evento a cada enlace padre de dropdown
  dropdowns.forEach(function(dd) {
    var parentLink = dd.querySelector('a:first-child');
    if (parentLink) {
      parentLink.removeEventListener('click', handleDropdownClick);
      parentLink.addEventListener('click', handleDropdownClick);
    }
  });

  // -------------------------------
  // Cerrar menú completo al hacer clic en un enlace normal (sin submenú o dentro de submenú)
  // También cerrar al hacer clic en enlaces de submenú para navegar
  // -------------------------------
  var allNavLinks = document.querySelectorAll('.nav__menu a');
  allNavLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      // Si estamos en móvil y el clic fue en un dropdown padre (el que tiene submenú), no cerramos el panel
      if (isMobile() && link.closest('.dropdown') && link === link.closest('.dropdown').querySelector('a:first-child')) {
        // No hacemos nada, el submenú se maneja arriba
        return;
      }
      // Para cualquier otro enlace (submenú o link normal), cerramos el panel lateral
      if (isMobile()) {
        closeMenu();
      }
    });
  });

  // Si la ventana se redimensiona a >768px, cerramos el menú y eliminamos estilos forzados
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      }
      // Restauramos overflow del body por si acaso
      document.body.style.overflow = '';
    }
  });

  // -------------------------------
  // Header sticky y botón volver arriba (umbral 50%)
  // -------------------------------
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) {
      if (header) header.classList.add('scrolled');
    } else {
      if (header) header.classList.remove('scrolled');
    }
    if (backToTop) {
      var umbralScroll = document.documentElement.scrollHeight * 0.5;
      if (window.scrollY > umbralScroll) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
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
