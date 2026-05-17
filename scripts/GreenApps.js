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

  // Función para cerrar el menú hamburguesa y todos los submenús
  function closeAllMenus() {
    if (navCheckbox) navCheckbox.checked = false;
    if (navMenu) {
      var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
      openDropdowns.forEach(function(dd) {
        dd.classList.remove('open');
      });
    }
  }

  // Abrir/cerrar menú al hacer clic en el toggle
  if (toggleBtn && navCheckbox) {
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navCheckbox.checked = !navCheckbox.checked;
      if (!navCheckbox.checked) {
        if (navMenu) {
          var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
          openDropdowns.forEach(function(dd) {
            dd.classList.remove('open');
          });
        }
      }
    });
  }

  // Cerrar menú al hacer clic fuera de él
  document.addEventListener('click', function(event) {
    if (navCheckbox && navCheckbox.checked) {
      var isClickInsideMenu = navMenu && navMenu.contains(event.target);
      var isClickOnToggle = toggleBtn && toggleBtn.contains(event.target);
      if (!isClickInsideMenu && !isClickOnToggle) {
        closeAllMenus();
      }
    }
  });

  // Evitar propagación dentro del menú
  if (navMenu) {
    navMenu.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // Dropdowns en móvil
  if (navMenu) {
    navMenu.querySelectorAll('.dropdown > a:first-child').forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          var parentDropdown = this.closest('.dropdown');
          if (parentDropdown) {
            parentDropdown.classList.toggle('open');
          }
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
