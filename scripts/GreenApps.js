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
  var body = document.body;

  // Crear overlay para cerrar el menú al tocar fuera
  var overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);

  // -------------------------------
  // Función para cerrar el menú completo y resetear submenús
  // -------------------------------
  function closeFullMenu() {
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      if (navToggle) navToggle.classList.remove('active');
      overlay.classList.remove('active');
      closeAllSubmenus();
    }
  }

  function openFullMenu() {
    if (navMenu) {
      navMenu.classList.add('open');
      if (navToggle) navToggle.classList.add('active');
      overlay.classList.add('active');
      closeAllSubmenus(); // Al abrir, aseguramos que no haya submenús abiertos
    }
  }

  function closeAllSubmenus() {
    var dropdowns = document.querySelectorAll('.dropdown');
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

  // -------------------------------
  // Toggle del menú principal (hamburguesa)
  // -------------------------------
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (navMenu.classList.contains('open')) {
        closeFullMenu();
      } else {
        openFullMenu();
      }
    });
  }

  // -------------------------------
  // Lógica de submenús tipo acordeón (solo uno abierto a la vez)
  // -------------------------------
  function handleDropdownClick(e) {
    if (!isMobile()) return;

    var dropdown = this.closest('.dropdown');
    if (!dropdown) return;

    // Prevenir la navegación del enlace padre (solo en móvil)
    e.preventDefault();

    var isOpen = dropdown.classList.contains('open');
    if (isOpen) {
      dropdown.classList.remove('open');
    } else {
      // Cerrar todos los demás y abrir este
      closeAllSubmenus();
      openSubmenu(dropdown);
    }
  }

  // Asignar evento a los enlaces padre de cada dropdown
  var dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(function(dd) {
    var parentLink = dd.querySelector('a:first-child');
    if (parentLink) {
      parentLink.removeEventListener('click', handleDropdownClick);
      parentLink.addEventListener('click', handleDropdownClick);
    }
  });

  // -------------------------------
  // Cerrar menú al hacer clic en un enlace normal (sin submenú)
  // También cerrar al hacer clic en un enlace dentro de un submenú
  // -------------------------------
  var allNavLinks = document.querySelectorAll('.nav__menu a');
  allNavLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      if (!isMobile()) return;
      // Si es un enlace padre de dropdown, ya lo maneja handleDropdownClick
      var parentDropdown = link.closest('.dropdown');
      if (parentDropdown && link === parentDropdown.querySelector('a:first-child')) {
        return; // No cerramos el menú completo, solo se maneja el submenú
      }
      // Para cualquier otro enlace (submenú o normal), cerramos el menú completo
      closeFullMenu();
    });
  });

  // Cerrar menú al hacer clic en el overlay
  if (overlay) {
    overlay.addEventListener('click', function() {
      closeFullMenu();
    });
  }

  // Cerrar menú al redimensionar la ventana si pasa a modo escritorio
  window.addEventListener('resize', function() {
    if (!isMobile() && navMenu && navMenu.classList.contains('open')) {
      closeFullMenu();
    }
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
