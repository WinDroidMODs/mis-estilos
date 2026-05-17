
  };

})();
(function(){
  'use strict';

  // ---------- COOKIE BANNER ----------
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

  // ---------- MENÚ HAMBURGUESA ----------
  var navCheckbox = document.getElementById('nav-check');
  var navMenu = document.getElementById('navMenu');
  var toggleBtn = document.querySelector('.nav__toggle');

  function closeMainMenu() {
    if (navCheckbox) navCheckbox.checked = false;
    closeAllSubmenus();
  }

  function closeAllSubmenus() {
    if (!navMenu) return;
    var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
    for (var i = 0; i < openDropdowns.length; i++) {
      openDropdowns[i].classList.remove('open');
    }
  }

  // Cierre al hacer clic fuera (solo si el menú está abierto)
  document.addEventListener('click', function(event) {
    if (!navCheckbox || !navCheckbox.checked) return;
    if (!navMenu || !toggleBtn) return;
    if (!navMenu.contains(event.target) && !toggleBtn.contains(event.target)) {
      closeMainMenu();
    }
  });

  // Cierre con tecla Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navCheckbox && navCheckbox.checked) {
      closeMainMenu();
    }
  });

  // ---------- SUBMENÚS (toggle en móvil) ----------
  if (navMenu) {
    var dropdowns = navMenu.querySelectorAll('.dropdown');

    for (var i = 0; i < dropdowns.length; i++) {
      (function(dropdown) {
        var toggleLink = dropdown.children[0];
        if (!toggleLink || toggleLink.tagName !== 'A') return;

        toggleLink.addEventListener('click', function(e) {
          if (window.innerWidth > 768) return; // escritorio

          e.preventDefault();
          e.stopPropagation();

          var isOpen = dropdown.classList.contains('open');

          // Cerrar otros submenús
          for (var j = 0; j < dropdowns.length; j++) {
            if (dropdowns[j] !== dropdown) {
              dropdowns[j].classList.remove('open');
            }
          }

          // Toggle actual
          if (isOpen) {
            dropdown.classList.remove('open');
          } else {
            dropdown.classList.add('open');
          }
        });
      })(dropdowns[i]);
    }
  }

  // Cierra el menú al pulsar un enlace normal (sin submenú) dentro del menú
  if (navMenu) {
    // Seleccionamos solo los enlaces que no tengan dropdown directamente encima
    var allLinks = navMenu.querySelectorAll('a');
    for (var i = 0; i < allLinks.length; i++) {
      allLinks[i].addEventListener('click', function() {
        if (navCheckbox && navCheckbox.checked && window.innerWidth <= 768) {
          // Cerrar solo si el enlace no es un toggle de dropdown
          var parent = this.parentNode;
          if (!parent.classList.contains('dropdown')) {
            setTimeout(closeMainMenu, 150);
          }
        }
      });
    }
  }

  // ---------- HEADER STICKY ----------
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

  // ---------- BOTÓN VOLVER ARRIBA ----------
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      var totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      var percentScrolled = (window.scrollY / totalHeight) * 100;
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

  // ---------- RESPUESTA A COMENTARIOS ----------
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
