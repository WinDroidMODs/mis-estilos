(function(){
  'use strict';

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

  function closeAllSubmenus() {
    if (navMenu) {
      var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
      openDropdowns.forEach(function(dd) {
        dd.classList.remove('open');
      });
    }
  }

  function closeMainMenu() {
    if (navCheckbox) navCheckbox.checked = false;
    closeAllSubmenus();
  }

  // Clic fuera del menú: cerrar todo
  document.addEventListener('click', function(event) {
    if (navCheckbox && navCheckbox.checked) {
      var isClickInsideMenu = navMenu && navMenu.contains(event.target);
      var isClickOnToggle = event.target.closest('.nav__toggle');
      if (!isClickInsideMenu && !isClickOnToggle) {
        closeMainMenu();
      }
    }
  });

  // Clic dentro del área vacía del menú: cerrar submenús pero no el menú principal
  if (navMenu) {
    navMenu.addEventListener('click', function(e) {
      if (e.target === navMenu || e.target.parentNode === navMenu || e.target.classList.contains('nav__menu')) {
        closeAllSubmenus();
        e.stopPropagation();
      }
    });
  }

  // Lógica para submenús en móvil: abrir/cerrar, solo uno abierto a la vez
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

          // Cerrar todos los demás submenús
          dropdowns.forEach(function(dd) {
            dd.classList.remove('open');
          });

          // Si no estaba abierto, lo abrimos; si estaba abierto, lo dejamos cerrado
          if (!isOpen) {
            dropdown.classList.add('open');
          }
        }
      });
    });
  }

  // Para los enlaces normales (sin dropdown) en móvil, cerrar el menú después de la navegación
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

  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 80) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

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
