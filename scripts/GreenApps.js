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
  // Menú hamburguesa: toggle del panel principal
  // -------------------------------
  var navMenu = document.getElementById('navMenu');
  var navToggle = document.querySelector('.nav__toggle');
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
      navMenu.classList.toggle('open');
      // Al abrir el menú, reseteamos los submenús abiertos para evitar desorden
      if (navMenu.classList.contains('open')) {
        closeAllSubmenus();
      }
    });
  }

  // -------------------------------
  // Lógica de submenús en móvil (acordeón: solo uno abierto a la vez)
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

  // Solo aplicamos esta lógica en pantallas <= 768px
  function isMobile() {
    return window.innerWidth <= 768;
  }

  function handleDropdownClick(e) {
    if (!isMobile()) return;

    var dropdown = this.closest('.dropdown');
    if (!dropdown) return;

    // Prevenir la navegación del enlace padre mientras estamos en móvil
    e.preventDefault();

    var isOpen = dropdown.classList.contains('open');
    // Si este dropdown ya está abierto, lo cerramos
    if (isOpen) {
      dropdown.classList.remove('open');
    } else {
      // Cerrar todos los demás y abrir este
      closeAllSubmenus();
      openSubmenu(dropdown);
    }
  }

  // Asignar evento a cada dropdown (solo al enlace principal)
  dropdowns.forEach(function(dd) {
    var parentLink = dd.querySelector('a:first-child');
    if (parentLink) {
      // Eliminar eventos previos para evitar duplicados (si se recarga el script)
      parentLink.removeEventListener('click', handleDropdownClick);
      parentLink.addEventListener('click', handleDropdownClick);
    }
  });

  // -------------------------------
  // Cerrar el menú completo al hacer clic en un enlace normal (sin submenú)
  // También cerrar al hacer clic en un enlace dentro de un submenú (para navegar)
  // -------------------------------
  function closeFullMenu() {
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      if (navToggle) navToggle.classList.remove('active');
    }
  }

  // Cerrar menú al hacer clic en cualquier enlace del nav que no sea el botón toggle
  var allNavLinks = document.querySelectorAll('.nav__menu a');
  allNavLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      // Si el clic fue en un dropdown padre (y estamos en móvil), no cerramos el menú completo,
      // porque ya lo maneja handleDropdownClick (que hace preventDefault)
      if (isMobile() && link.closest('.dropdown') && link === link.closest('.dropdown').querySelector('a:first-child')) {
        // No hacer nada aquí, el menú completo no se cierra, solo se maneja el submenú
        return;
      }
      // Para cualquier otro enlace (submenú o link normal), cerramos el menú completo
      closeFullMenu();
    });
  });

  // Opcional: cerrar menú al hacer clic fuera del header (si está abierto)
  document.addEventListener('click', function(e) {
    if (!isMobile()) return;
    if (navMenu && navMenu.classList.contains('open')) {
      // Si el clic no está dentro del header ni en el toggle
      if (!header.contains(e.target) && !navToggle.contains(e.target)) {
        closeFullMenu();
        closeAllSubmenus();
      }
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
