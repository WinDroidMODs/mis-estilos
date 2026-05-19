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
  // Header sticky y botón volver arriba (umbral 50%)
  // -------------------------------
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

  // -------------------------------
  // Menú hamburguesa: toggle del panel lateral y rotación del botón (X)
  // -------------------------------
  var navToggle = document.querySelector('.nav__toggle');
  var navCheckbox = document.getElementById('nav-check');
  if (navToggle && navCheckbox) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      // Cambia el estado del checkbox (que controla el slide)
      navCheckbox.checked = !navCheckbox.checked;
      // Opcional: cambiar la clase active en el toggle para animación de la X (si se usa CSS)
      navToggle.classList.toggle('active', navCheckbox.checked);
      // Cuando se abre el menú, reseteamos submenús abiertos para evitar desorden
      if (navCheckbox.checked) {
        closeAllSubmenus();
      }
    });
  }

  // -------------------------------
  // Lógica de submenús en móvil (acordeón: solo uno abierto a la vez)
  // -------------------------------
  function isMobile() {
    return window.innerWidth <= 768;
  }

  var dropdowns = document.querySelectorAll('.dropdown');

  function closeAllSubmenus() {
    dropdowns.forEach(function(dd) {
      dd.classList.remove('open');
    });
  }

  function openSubmenu(dropdown) {
    dropdown.classList.add('open');
  }

  // Manejador para el clic en el enlace padre del dropdown
  function handleDropdownClick(e) {
    if (!isMobile()) return;
    e.preventDefault();
    var dropdown = this.closest('.dropdown');
    if (!dropdown) return;

    var isOpen = dropdown.classList.contains('open');
    if (isOpen) {
      // Si ya está abierto, lo cerramos
      dropdown.classList.remove('open');
    } else {
      // Cerrar todos los demás y abrir este
      closeAllSubmenus();
      openSubmenu(dropdown);
    }
  }

  // Asignar evento a cada dropdown (solo en móvil, pero lo dejamos siempre y condicionamos)
  dropdowns.forEach(function(dd) {
    var parentLink = dd.querySelector('a:first-child');
    if (parentLink) {
      parentLink.removeEventListener('click', handleDropdownClick);
      parentLink.addEventListener('click', handleDropdownClick);
    }
  });

  // -------------------------------
  // Cerrar el menú completo al hacer clic en un enlace normal (sin submenú)
  // También cerrar al hacer clic en un enlace dentro de un submenú
  // -------------------------------
  function closeFullMenu() {
    if (navCheckbox && navCheckbox.checked) {
      navCheckbox.checked = false;
      if (navToggle) navToggle.classList.remove('active');
      closeAllSubmenus();
    }
  }

  var allNavLinks = document.querySelectorAll('.nav__menu a');
  allNavLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      if (!isMobile()) return;
      // Si el clic fue en un dropdown padre (en móvil), no cerramos el menú completo,
      // porque ya lo maneja handleDropdownClick (que hace preventDefault)
      if (link.closest('.dropdown') && link === link.closest('.dropdown').querySelector('a:first-child')) {
        return;
      }
      // Para cualquier otro enlace (submenú o link normal), cerramos el menú completo
      closeFullMenu();
    });
  });

  // Cerrar menú al hacer clic en el overlay (si existe)
  var overlay = document.querySelector('.menu-overlay');
  if (overlay) {
    overlay.addEventListener('click', function() {
      closeFullMenu();
    });
  }

  // Opcional: cerrar menú si se cambia el tamaño de pantalla a escritorio
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && navCheckbox && navCheckbox.checked) {
      closeFullMenu();
    }
  });

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
