/* EmuBox.js v1.0 | Autor: Robinson Avila | By: WinDroidMODs */

(function(){
  'use strict';

  // ==================== COOKIE BANNER ====================
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

  // ==================== HEADER STICKY & BACK TO TOP (40%) ====================
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

  // ==================== SKELETON LOADER ====================
  // Reemplaza el overlay de carga por esqueletos en la página principal
  var postsContainer = document.querySelector('.posts-grid');
  if (postsContainer && window.location.pathname === '/' || window.location.pathname === '') {
    // Función para mostrar esqueletos
    function showSkeletons() {
      if (!postsContainer) return;
      var skeletonHtml = '';
      var skeletonCount = 8;
      for (var i = 0; i < skeletonCount; i++) {
        skeletonHtml += '<div class="skeleton-card">' +
          '<div class="skeleton-img shimmer"></div>' +
          '<div class="skeleton-body">' +
            '<div class="skeleton-title shimmer"></div>' +
            '<div class="skeleton-meta shimmer"></div>' +
            '<div class="skeleton-text shimmer"></div>' +
            '<div class="skeleton-text shimmer"></div>' +
          '</div>' +
        '</div>';
      }
      postsContainer.innerHTML = skeletonHtml;
      postsContainer.classList.add('skeleton-grid');
    }
    showSkeletons();
    // Una vez que el contenido real esté cargado (el widget Blog1 termina de renderizar),
    // los esqueletos serán reemplazados por el contenido real. Para ello, observamos cambios en el DOM.
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          var realPosts = document.querySelector('.posts-grid .post-card');
          if (realPosts) {
            postsContainer.classList.remove('skeleton-grid');
            observer.disconnect();
          }
        }
      });
    });
    observer.observe(postsContainer, { childList: true, subtree: true });
  }

  // ==================== ANIMACIONES AL APARECER (INTERSECTION OBSERVER) ====================
  var animatedElements = document.querySelectorAll('.post-card');
  if (animatedElements.length) {
    var appearObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          appearObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    animatedElements.forEach(function(el) {
      appearObserver.observe(el);
    });
  }

  // ==================== LIVE SEARCH (BÚSQUEDA EN VIVO) ====================
  var searchInputs = document.querySelectorAll('.hero__search input, .header__search input');
  if (searchInputs.length) {
    var blogUrl = window.location.protocol + '//' + window.location.hostname;
    var searchDebounceTimeout;

    function fetchLiveSearch(query, resultsContainer) {
      if (query.length < 2) {
        resultsContainer.classList.remove('show');
        return;
      }
      var feedUrl = blogUrl + '/feeds/posts/default?alt=json&max-results=8&q=' + encodeURIComponent(query);
      fetch(feedUrl)
        .then(function(response) { return response.json(); })
        .then(function(data) {
          var entries = data.feed && data.feed.entry;
          if (!entries || entries.length === 0) {
            resultsContainer.innerHTML = '<div class="live-search-item" style="justify-content:center;">No se encontraron resultados</div>';
            resultsContainer.classList.add('show');
            return;
          }
          var html = '';
          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var title = entry.title.$t;
            var link = entry.link.find(function(l) { return l.rel === 'alternate'; }).href;
            var date = new Date(entry.published.$t).toLocaleDateString();
            var imgSrc = '';
            if (entry.media$thumbnail) {
              imgSrc = entry.media$thumbnail.url;
            } else {
              // buscar primera imagen en el contenido
              var content = entry.content.$t;
              var imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
              if (imgMatch) imgSrc = imgMatch[1];
            }
            html += '<a class="live-search-item" href="' + link + '">' +
              (imgSrc ? '<img src="' + imgSrc + '" loading="lazy" alt="' + title + '">' : '<div style="width:50px;height:50px;background:#1e1e2e;border-radius:8px;"></div>') +
              '<div class="info"><div class="title">' + title + '</div><div class="date">' + date + '</div></div>' +
            '</a>';
          }
          resultsContainer.innerHTML = html;
          resultsContainer.classList.add('show');
        })
        .catch(function(err) {
          console.warn('Live search error:', err);
          resultsContainer.classList.remove('show');
        });
    }

    searchInputs.forEach(function(input) {
      // Crear contenedor de resultados si no existe
      var container = input.parentNode.querySelector('.live-search-results');
      if (!container) {
        container = document.createElement('div');
        container.className = 'live-search-results';
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(container);
      }
      input.addEventListener('input', function(e) {
        var query = e.target.value.trim();
        clearTimeout(searchDebounceTimeout);
        searchDebounceTimeout = setTimeout(function() {
          fetchLiveSearch(query, container);
        }, 300);
      });
      // Cerrar resultados al hacer clic fuera
      document.addEventListener('click', function(e) {
        if (!input.parentNode.contains(e.target)) {
          container.classList.remove('show');
        }
      });
    });
  }

  // ==================== RESPONDER A COMENTARIO (ya existente) ====================
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
