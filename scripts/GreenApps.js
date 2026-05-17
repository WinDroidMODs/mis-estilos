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

  var navCheckbox = document.getElementById('nav-check');
  var navMenu = document.getElementById('navMenu');
  var toggleBtn = document.querySelector('.nav__toggle');

  function closeAllSubmenus() {
    if (navMenu) {
      var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
      openDropdowns.forEach(function(dropdown) {
        dropdown.classList.remove('open');
      });
    }
  }

  function closeMainMenu() {
    if (navCheckbox) {
      navCheckbox.checked = false;
    }
    closeAllSubmenus();
  }

  // Toggle del menú hamburguesa
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', function(event) {
    if (navCheckbox && navCheckbox.checked) {
      var isClickInsideMenu = navMenu && navMenu.contains(event.target);
      var isClickOnToggle = toggleBtn && toggleBtn.contains(event.target);
      
      if (!isClickInsideMenu && !isClickOnToggle) {
        closeMainMenu();
      }
    }
  });

  // Manejo de submenús en móvil (toggle)
  if (navMenu) {
    var dropdowns = navMenu.querySelectorAll('.dropdown');
    dropdowns.forEach(function(dropdown) {
      var link = dropdown.querySelector(':scope > a:first-child');
      if (!link) return;

      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();

          var isOpen = dropdown.classList.contains('open');

          // Cerramos todos los submenús
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

  // Cerrar menú al hacer clic en enlaces que NO son el título de un dropdown
  if (navMenu) {
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function(e) {
        // Si es el enlace principal de un dropdown, NO cerramos el menú
        var parentDropdown = link.closest('.dropdown');
        if (parentDropdown && parentDropdown.querySelector(':scope > a:first-child') === link) {
          return; // es el enlace principal de dropdown, lo maneja el listener anterior
        }

        // Para cualquier otro enlace (submenú o enlace normal), cerramos el menú tras navegar
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

  // Botón volver arriba
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

  // Responder a comentarios
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
