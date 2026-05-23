/* EmuBox.js v1.1 | Autor: Robinson Avila | By: WinDroidMODs */

(function(){
  'use strict';

  // ==================================================
  // 1. Cookie banner
  // ==================================================
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

  // ==================================================
  // 2. Header sticky y botón volver arriba (umbral 40%)
  // ==================================================
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    var umbralScroll = document.documentElement.scrollHeight * 0.4;
    if (window.scrollY > umbralScroll) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });
  if (backToTop) {
    backToTop.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  // ==================================================
  // 3. Animaciones suaves al aparecer (fade-up)
  // ==================================================
  function initScrollReveal() {
    var elements = document.querySelectorAll('.post-card, .widget');
    if (elements.length === 0) return;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    elements.forEach(function(el) {
      el.classList.add('fade-up');
      observer.observe(el);
    });
  }

  // ==================================================
  // 4. Skeleton loader para posts (página de inicio / resultados)
  // ==================================================
  function showSkeletonLoader(container) {
    if (!container) return;
    var numPosts = 8;
    var skeletonHtml = '';
    for (var i = 0; i < numPosts; i++) {
      skeletonHtml += `
        <div class="post-card skeleton-card fade-up">
          <div class="post-card__img skeleton skeleton-img"></div>
          <div class="post-card__body">
            <div class="post-card__tags"><span class="skeleton" style="display:inline-block; width:60px; height:20px; border-radius:20px;"></span></div>
            <div class="post-card__title skeleton skeleton-title"></div>
            <div class="post-card__meta skeleton skeleton-meta"></div>
            <div class="post-card__snippet skeleton skeleton-snippet"></div>
          </div>
        </div>
      `;
    }
    container.innerHTML = skeletonHtml;
  }

  // Aplicar skeleton loader en la página de inicio o de búsqueda
  var postsGrid = document.querySelector('.posts-grid');
  if (postsGrid && (window.location.pathname === '/' || window.location.pathname.indexOf('/search') !== -1)) {
    var originalHtml = postsGrid.innerHTML;
    showSkeletonLoader(postsGrid);
    window.addEventListener('load', function() {
      setTimeout(function() {
        postsGrid.innerHTML = originalHtml;
        initScrollReveal();
      }, 800);
    });
  } else {
    initScrollReveal();
  }

  // ==================================================
  // 5. Búsqueda en vivo (Live Search)
  // ==================================================
  function initLiveSearch() {
    var searchInputs = document.querySelectorAll('.hero__search input, .header__search input');
    if (searchInputs.length === 0) return;

    searchInputs.forEach(function(input) {
      // Crear contenedor de resultados para cada input
      var container = document.createElement('div');
      container.className = 'live-search-results';
      input.parentNode.style.position = 'relative';
      input.parentNode.appendChild(container);

      var debounceTimer;
      input.addEventListener('input', function(e) {
        clearTimeout(debounceTimer);
        var query = e.target.value.trim();
        if (query.length < 2) {
          container.classList.remove('show');
          return;
        }
        debounceTimer = setTimeout(function() {
          fetchLiveResults(query, container);
        }, 300);
      });

      // Cerrar resultados al hacer clic fuera
      document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !container.contains(e.target)) {
          container.classList.remove('show');
        }
      });
    });
  }

  function fetchLiveResults(query, container) {
    var feedUrl = '/feeds/posts/default?alt=json&q=' + encodeURIComponent(query) + '&max-results=6';
    fetch(feedUrl)
      .then(response => response.json())
      .then(data => {
        var entries = data.feed.entry;
        if (!entries || entries.length === 0) {
          container.innerHTML = '<div class="live-search-item">No se encontraron resultados.</div>';
          container.classList.add('show');
          return;
        }
        var html = '';
        entries.forEach(function(entry) {
          var title = entry.title.$t;
          var link = entry.link.find(l => l.rel === 'alternate').href;
          var snippet = entry.summary ? entry.summary.$t.substring(0, 100) : '';
          var img = '';
          if (entry.media$thumbnail) {
            img = entry.media$thumbnail.url;
          } else {
            // Buscar imagen en el contenido
            var content = entry.content ? entry.content.$t : '';
            var imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) img = imgMatch[1];
          }
          html += `
            <a class="live-search-item" href="${link}">
              ${img ? `<img class="live-search-img" src="${img}" alt="${title}" loading="lazy">` : '<div class="live-search-img skeleton" style="width:50px;height:50px;"></div>'}
              <div class="live-search-info">
                <div class="live-search-title">${escapeHtml(title)}</div>
                <div class="live-search-snippet">${escapeHtml(snippet)}</div>
              </div>
            </a>
          `;
        });
        container.innerHTML = html;
        container.classList.add('show');
      })
      .catch(error => {
        console.error('Error en búsqueda en vivo:', error);
        container.innerHTML = '<div class="live-search-item">Error al buscar.</div>';
        container.classList.add('show');
      });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  // ==================================================
  // 6. Inicializar cuando el DOM esté listo
  // ==================================================
  document.addEventListener('DOMContentLoaded', function() {
    initLiveSearch();
  });

  // ==================================================
  // 7. Funciones para comentarios (responder)
  // ==================================================
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
