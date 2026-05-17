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

  var header = document.getElementById('header');
  var menuToggle = document.getElementById('menuToggle');
  var navMenu = document.getElementById('navMenu');

  function openMenu() {
    header.classList.add('menu-open');
  }
  function closeMenu() {
    header.classList.remove('menu-open');
    var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
    openDropdowns.forEach(function(dd) {
      dd.classList.remove('open');
    });
  }
  function toggleMenu() {
    if (header.classList.contains('menu-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });
  }

  document.addEventListener('click', function(event) {
    if (header && header.classList.contains('menu-open')) {
      var isClickInsideMenu = navMenu && navMenu.contains(event.target);
      var isClickOnToggle = menuToggle && menuToggle.contains(event.target);
      if (!isClickInsideMenu && !isClickOnToggle) {
        closeMenu();
      }
    }
  });

  if (navMenu) {
    navMenu.addEventListener('click', function(e) {
      if (e.target === navMenu || e.target.parentNode === navMenu || e.target.classList.contains('nav__menu')) {
        var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
        openDropdowns.forEach(function(dd) {
          dd.classList.remove('open');
        });
        e.stopPropagation();
      }
    });
  }

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

  if (navMenu) {
    navMenu.querySelectorAll('a:not(.dropdown > a:first-child)').forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          setTimeout(function() {
            closeMenu();
          }, 150);
        }
      });
    });
  }

  var headerSticky = document.getElementById('header');
  if (headerSticky) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 80) headerSticky.classList.add('scrolled');
      else headerSticky.classList.remove('scrolled');
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
