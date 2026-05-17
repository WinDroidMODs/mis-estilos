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

  // Elementos del menú
  var navCheckbox = document.getElementById('nav-check');
  var navMenu = document.getElementById('navMenu');
  var toggleBtn = document.querySelector('.nav__toggle');

  // Función para cerrar todos los submenús
  function closeAllSubmenus() {
    if (navMenu) {
      var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
      openDropdowns.forEach(function(dropdown) {
        dropdown.classList.remove('open');
      });
    }
  }

  // Función para cerrar el menú hamburguesa completo
  function closeMainMenu() {
    if (navCheckbox) {
      navCheckbox.checked = false;
    }
    closeAllSubmenus();
  }

  // Evento para manejar clics en el botón de hamburguesa (toggle)
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      // Al hacer clic en el botón, simplemente alternamos el estado del checkbox.
      // El checkbox maneja la visibilidad del menú a través de CSS.
      // No añadimos lógica extra para que el label funcione de forma nativa.
    });
  }

  // Evento para cerrar el menú cuando se hace clic fuera de él
  document.addEventListener('click', function(event) {
    // Si el menú está abierto
    if (navCheckbox && navCheckbox.checked) {
      // Verificar si el clic fue dentro del menú o en el botón de toggle
      var isClickInsideMenu = navMenu && navMenu.contains(event.target);
      var isClickOnToggle = toggleBtn && toggleBtn.contains(event.target);
      
      if (!isClickInsideMenu && !isClickOnToggle) {
        closeMainMenu();
      }
    }
  });

  // Manejo de submenús en vista móvil: toggle y cierre de otros
  if (navMenu) {
    var dropdowns = navMenu.querySelectorAll('.dropdown');
    dropdowns.forEach(function(dropdown) {
      var link = dropdown.querySelector('> a:first-child');
      if (!link) return;

      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();

          var isOpen = dropdown.classList.contains('open');

          // Primero cerramos todos los submenús
          dropdowns.forEach(function(dd) {
            dd.classList.remove('open');
          });

          // Si no estaba abierto, lo abrimos
          if (!isOpen) {
            dropdown.classList.add('open');
          }
        }
      });
    });
  }

  // Para enlaces normales (sin dropdown), cerramos el menú al navegar
  if (navMenu) {
    navMenu.querySelectorAll('a:not(.dropdown > a:first-child)').forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (navCheckbox && navCheckbox.checked && window.innerWidth <= 768) {
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

  // Botón volver arriba (visible al 50%)
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      var totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrolled = window.scrollY;
      var percentScrolled = (scrolled / totalHeight) * 100;
      if (percentScrolled >= 50) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Función para responder a comentarios
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

  // Función para cancelar respuesta a comentario
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
