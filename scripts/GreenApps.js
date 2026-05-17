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

  // Función para cerrar TODOS los submenús (dropdowns abiertos)
  function closeAllSubmenus() {
    if (navMenu) {
      var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
      openDropdowns.forEach(function(dd) {
        dd.classList.remove('open');
      });
    }
  }

  // Función para cerrar el menú hamburguesa completo (checkbox y submenús)
  function closeMainMenu() {
    if (navCheckbox) navCheckbox.checked = false;
    closeAllSubmenus();
  }

  // Abrir/cerrar menú al hacer clic en el botón hamburguesa
  if (toggleBtn && navCheckbox) {
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      // Invertir estado del checkbox
      navCheckbox.checked = !navCheckbox.checked;
      // Si estamos cerrando el menú, también cerramos submenús
      if (!navCheckbox.checked) {
        closeAllSubmenus();
      }
    });
  }

  // Clic fuera del menú (en cualquier parte de la página): cerrar menú principal y submenús
  document.addEventListener('click', function(event) {
    // Si el menú está abierto
    if (navCheckbox && navCheckbox.checked) {
      var isClickInsideMenu = navMenu && navMenu.contains(event.target);
      var isClickOnToggle = toggleBtn && toggleBtn.contains(event.target);
      // Si el clic no es dentro del menú ni en el botón
      if (!isClickInsideMenu && !isClickOnToggle) {
        closeMainMenu();
      }
    }
  });

  // Clic dentro del menú pero en el fondo vacío (no en un botón o enlace)
  if (navMenu) {
    navMenu.addEventListener('click', function(e) {
      // Si el objetivo del clic es el propio contenedor del menú o un espacio vacío (sin enlace)
      if (e.target === navMenu || e.target.parentNode === navMenu || e.target.classList.contains('nav__menu')) {
        // Solo cerramos los submenús, no cerramos el menú principal
        closeAllSubmenus();
        e.stopPropagation();
      }
    });
  }

  // Para los enlaces de los dropdowns en móvil: abrir/cerrar submenú sin cerrar el menú principal
  if (navMenu) {
    navMenu.querySelectorAll('.dropdown > a:first-child').forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          var parentDropdown = this.closest('.dropdown');
          if (parentDropdown) {
            // Alternar la clase open
            parentDropdown.classList.toggle('open');
          }
        }
      });
    });
  }

  // Para los enlaces normales (no dropdown) en móvil, cerrar el menú después de navegar
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
      if (window.scrollY > 80) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  // Botón volver arriba (50% scroll)
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

  // Responder a comentario
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
