(function() {
  'use strict';

  // Elementos del DOM
  var navCheckbox = document.getElementById('nav-check');
  var navMenu = document.getElementById('navMenu');
  var toggleBtn = document.querySelector('.nav__toggle');
  var body = document.body;

  // Función para cerrar todos los submenús
  function closeAllSubmenus() {
    if (!navMenu) return;
    var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
    openDropdowns.forEach(function(dropdown) {
      dropdown.classList.remove('open');
    });
  }

  // Función para cerrar el menú principal (checkbox) y submenús
  function closeMainMenu() {
    if (navCheckbox) navCheckbox.checked = false;
    closeAllSubmenus();
  }

  // Clic en el botón hamburguesa: simplemente alterna el checkbox (sin lógica extra)
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
      // No hacemos nada aquí, porque el label asociado al checkbox ya maneja el toggle.
      // Solo evitamos la propagación para que el evento de documento no lo cierre inmediatamente.
      e.stopPropagation();
    });
  }

  // Clic fuera del menú: cerrar todo (menú principal y submenús)
  document.addEventListener('click', function(event) {
    // Si el menú no está abierto, salimos
    if (!navCheckbox || !navCheckbox.checked) return;

    // Elementos que consideramos "dentro del menú"
    var isClickInsideMenu = navMenu && navMenu.contains(event.target);
    var isClickOnToggle = toggleBtn && toggleBtn.contains(event.target);
    var isClickOnCheckbox = event.target === navCheckbox;

    // Si el clic no es dentro del menú, ni en el botón toggle, ni en el checkbox, cerramos
    if (!isClickInsideMenu && !isClickOnToggle && !isClickOnCheckbox) {
      closeMainMenu();
    }
  });

  // Manejo de submenús: toggle y cierre de otros
  if (navMenu) {
    var dropdowns = navMenu.querySelectorAll('.dropdown');
    dropdowns.forEach(function(dropdown) {
      var link = dropdown.querySelector('> a:first-child');
      if (!link) return;

      link.addEventListener('click', function(e) {
        // Solo en móvil (pantalla pequeña)
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();

          var isOpen = dropdown.classList.contains('open');

          // Si este dropdown está abierto, lo cerramos
          if (isOpen) {
            dropdown.classList.remove('open');
          } else {
            // Cerramos todos los demás y luego abrimos este
            dropdowns.forEach(function(dd) {
              dd.classList.remove('open');
            });
            dropdown.classList.add('open');
          }
        }
      });
    });
  }

  // Para los enlaces normales (sin submenú), cerramos el menú al hacer clic (en móvil)
  if (navMenu) {
    var normalLinks = navMenu.querySelectorAll('a:not(.dropdown > a:first-child)');
    normalLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (navCheckbox && navCheckbox.checked && window.innerWidth <= 768) {
          // Damos tiempo para que se ejecute la navegación, luego cerramos
          setTimeout(function() {
            closeMainMenu();
          }, 150);
        }
      });
    });
  }

  // Header sticky
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Botón volver arriba (visible al 50% del scroll)
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      var totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrolled = window.scrollY;
      var percentScrolled = totalHeight > 0 ? (scrolled / totalHeight) * 100 : 0;
      if (percentScrolled >= 50) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Cookies banner
  var cookieBanner = document.getElementById('cookie-banner');
  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.style.display = 'flex';
    var acceptBtn = document.getElementById('cookie-accept');
    var rejectBtn = document.getElementById('cookie-reject');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.style.display = 'none';
      });
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'rejected');
        cookieBanner.style.display = 'none';
      });
    }
  }

  // Funciones de comentarios (si existen)
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
