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

  // Cierra el menú principal (hamburguesa) y todos los submenús
  function closeMainMenu() {
    if (navCheckbox) navCheckbox.checked = false;
    closeAllSubmenus();
  }

  // Cierra cualquier submenú abierto
  function closeAllSubmenus() {
    if (!navMenu) return;
    var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
    openDropdowns.forEach(function(dropdown) {
      dropdown.classList.remove('open');
    });
  }

  // Cierre del menú al hacer clic fuera de él (funciona como la X)
  document.addEventListener('click', function(event) {
    if (!navCheckbox || !navCheckbox.checked) return;       // menú cerrado -> nada que hacer
    if (!navMenu || !toggleBtn) return;

    var clickedInsideMenu = navMenu.contains(event.target);
    var clickedOnToggle = toggleBtn.contains(event.target);

    if (!clickedInsideMenu && !clickedOnToggle) {
      closeMainMenu();
    }
  });

  // También cerrar con tecla Escape para mejor accesibilidad
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navCheckbox && navCheckbox.checked) {
      closeMainMenu();
    }
  });

  // ---------- SUBMENÚS (toggle real en móvil) ----------
  if (navMenu) {
    var dropdowns = navMenu.querySelectorAll('.dropdown');

    dropdowns.forEach(function(dropdown) {
      var toggleLink = dropdown.querySelector(':scope > a:first-child');
      if (!toggleLink) return;

      toggleLink.addEventListener('click', function(e) {
        if (window.innerWidth > 768) return; // en escritorio el hover se encarga

        e.preventDefault();      // evita navegación
        e.stopPropagation();     // evita que el clic cierre el menú principal inmediatamente

        var isCurrentlyOpen = dropdown.classList.contains('open');

        // Cierra cualquier otro submenú abierto
        dropdowns.forEach(function(dd) {
          if (dd !== dropdown) dd.classList.remove('open');
        });

        // Alterna el estado del submenú actual
        if (isCurrentlyOpen) {
          dropdown.classList.remove('open');
        } else {
          dropdown.classList.add('open');
        }
      });
    });
  }

  // Cierra el menú completo al pulsar un enlace normal (sin submenú) dentro del menú
  if (navMenu) {
    navMenu.querySelectorAll('a:not(.dropdown > a:first-child)').forEach(function(link) {
      link.addEventListener('click', function() {
        if (navCheckbox && navCheckbox.checked && window.innerWidth <= 768) {
          // Pequeño retardo para que se vea la transición antes de cerrar
          setTimeout(closeMainMenu, 150);
        }
      });
    });
  }

  // ---------- HEADER STICKY ----------
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 80);
    });
  }

  // ---------- BOTÓN VOLVER ARRIBA ----------
  var backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      var totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      var percentScrolled = (window.scrollY / totalHeight) * 100;
      backToTop.classList.toggle('show', percentScrolled >= 50);
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
