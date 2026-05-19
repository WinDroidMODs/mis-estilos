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
  var navCheck = document.getElementById('nav-check');
  var navToggle = document.querySelector('.nav__toggle');
  var navMenu = document.getElementById('navMenu');
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');

  // Función para cerrar el menú principal
  function closeMenu() {
    if (navCheck && navCheck.checked) {
      navCheck.checked = false;
      // Eliminar clase 'open' del menú y del toggle si existe
      if (navMenu) navMenu.classList.remove('open');
      if (navToggle) navToggle.classList.remove('active');
      // Opcional: cerrar también cualquier submenú abierto
      if (navMenu) {
        var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
        openDropdowns.forEach(function(dd) {
          dd.classList.remove('open');
        });
      }
    }
  }

  // Cerrar menú al hacer clic en un enlace (excepto el padre de submenú)
  if (navMenu) {
    navMenu.addEventListener('click', function(e) {
      var target = e.target;
      // Buscar si el click fue en un enlace <a>
      var link = target.closest('a');
      if (!link) return;

      // Verificar si el enlace es el padre de un dropdown (submenú)
      var parentDropdown = link.closest('.dropdown');
      if (parentDropdown && parentDropdown.querySelector(':scope > a') === link) {
        // Es el enlace que abre/cierra el submenú -> no cerrar el menú principal
        e.preventDefault();
        parentDropdown.classList.toggle('open');
        return;
      }

      // Cualquier otro enlace: cerrar el menú principal (permitir la navegación)
      // Pequeño timeout para dar tiempo a que el navegador procese el clic
      setTimeout(closeMenu, 100);
    });
  }

  // Cerrar menú al hacer clic fuera de él (en cualquier parte del documento)
  document.addEventListener('click', function(e) {
    // Si el menú no está abierto, salir
    if (!navCheck || !navCheck.checked) return;

    // Elementos que no deben cerrar el menú: el propio menú, el botón toggle, y cualquier elemento interno del menú
    var isInsideMenu = navMenu && navMenu.contains(e.target);
    var isToggle = navToggle && (navToggle === e.target || navToggle.contains(e.target));

    if (!isInsideMenu && !isToggle) {
      closeMenu();
    }
  });

  // Evitar que el clic dentro del menú se propague al documento (no necesario, pero por seguridad)
  if (navMenu) {
    navMenu.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // Menu toggle (abrir/cerrar) - ya funciona con el label, pero añadimos mejora para cerrar si se vuelve a tocar el toggle
  if (navToggle) {
    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      // El checkbox se togglea automáticamente gracias al label
      // Solo aseguramos que si se cierra, también se quiten clases
      if (navCheck && !navCheck.checked) {
        if (navMenu) navMenu.classList.remove('open');
        if (navToggle) navToggle.classList.remove('active');
      } else {
        if (navMenu) navMenu.classList.add('open');
        if (navToggle) navToggle.classList.add('active');
      }
    });
  }

  // Header sticky y boton volver arriba (aparece al 50%)
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    var umbralScroll = document.documentElement.scrollHeight * 0.5;
    if (window.scrollY > umbralScroll) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });

  if (backToTop) {
    backToTop.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  // Responder a comentario
  window.replyToComment = function(button) {
    var commentId = button.getAttribute('data-comment-id');
    var author = button.getAttribute('data-comment-author');
    var notice = document.getElementById('reply-notice');
    var authorSpan = document.getElementById('reply-author-name');
    var editor = document.getElementById('comment-editor');
    var formSrc = document.getElementById('comment-editor-src') ? document.getElementById('comment-editor-src').href : null;

    if (notice && authorSpan && editor && formSrc) {
      authorSpan.textContent = 'Respondiendo a ' + author;
      notice.classList.add('show');
      editor.src = formSrc + '&parentID=' + commentId;
      editor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Cancelar respuesta
  window.cancelReply = function() {
    var notice = document.getElementById('reply-notice');
    var editor = document.getElementById('comment-editor');
    var formSrc = document.getElementById('comment-editor-src') ? document.getElementById('comment-editor-src').href : null;

    if (notice && editor && formSrc) {
      notice.classList.remove('show');
      editor.src = formSrc;
    }
  };

})();
