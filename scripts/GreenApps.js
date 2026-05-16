// GreenApps.js v5.0.1 - Funcionalidades completas con URL de Google Sheets
(function() {
  'use strict';

  // ========== 1. Modo oscuro/claro ==========
  const themeToggle = document.getElementById('theme-toggle');
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };
  const getTheme = () => localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(getTheme());
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // ========== 2. Lazy loading con blur ==========
  const blurImages = document.querySelectorAll('.blur-up-img');
  if ('IntersectionObserver' in window) {
    let observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    blurImages.forEach(img => observer.observe(img));
  } else {
    blurImages.forEach(img => img.src = img.dataset.src);
  }

  // ========== 3. Menú lateral (off-canvas) ==========
  const navCheck = document.getElementById('nav-check');
  const closeMenu = () => { if (navCheck) navCheck.checked = false; };
  document.querySelectorAll('.nav__menu a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => {
    if (navCheck && navCheck.checked && !e.target.closest('.nav__menu') && !e.target.closest('.nav__toggle')) closeMenu();
  });

  // ========== 4. Búsqueda en vivo (live search) ==========
  const liveInput = document.getElementById('live-search-input');
  const resultsDiv = document.getElementById('live-search-results');
  if (liveInput && resultsDiv) {
    let debounceTimer;
    liveInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      const query = this.value.trim();
      if (query.length < 2) { resultsDiv.style.display = 'none'; return; }
      debounceTimer = setTimeout(() => {
        fetch(`/search?q=${encodeURIComponent(query)}&max-results=5&alt=json`)
          .then(res => res.json())
          .then(data => {
            const entries = data.feed.entry;
            if (!entries) { resultsDiv.style.display = 'none'; return; }
            resultsDiv.innerHTML = entries.map(entry => `<a href="${entry.link.find(l => l.rel === 'alternate').href}">${entry.title.$t}</a>`).join('');
            resultsDiv.style.display = 'block';
          }).catch(() => resultsDiv.style.display = 'none');
      }, 300);
    });
    document.addEventListener('click', (e) => { if (!liveInput.contains(e.target)) resultsDiv.style.display = 'none'; });
  }

  // ========== 5. Nube de etiquetas interactiva (filtro AJAX) ==========
  const tagLinks = document.querySelectorAll('.tag-cloud a');
  const tagResults = document.getElementById('tag-filter-results');
  if (tagLinks.length && tagResults) {
    tagLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const label = link.getAttribute('data-label') || link.innerText;
        fetch(`/search/label/${encodeURIComponent(label)}?max-results=5&alt=json`)
          .then(res => res.json())
          .then(data => {
            const entries = data.feed.entry;
            if (!entries) { tagResults.innerHTML = '<p>No hay entradas en esta categoría.</p>'; return; }
            tagResults.innerHTML = entries.map(entry => `<a href="${entry.link.find(l => l.rel === 'alternate').href}" style="display:block; padding:0.3rem;">${entry.title.$t}</a>`).join('');
          }).catch(() => tagResults.innerHTML = '<p>Error al cargar.</p>');
      });
    });
  }

  // ========== 6. Valoración 5 estrellas con Google Sheets ==========
  // URL de tu Google Apps Script desplegado (YA INTEGRADA)
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx-7GTCFjmOwE658xPjRdOX9gJiF1NAML033A6J1xOjWVzkkva_wqf67-i-hB6Ge8kuWg/exec';
  
  const ratingContainers = document.querySelectorAll('.star-rating');
  ratingContainers.forEach(container => {
    const postId = container.dataset.postid;
    const postUrl = container.dataset.posturl;
    const stars = container.querySelectorAll('.star');
    const messageSpan = container.parentElement.querySelector('.rating-message');
    const avgSpan = container.parentElement.querySelector('.rating-avg');
    const countSpan = container.parentElement.querySelector('.rating-count');

    // Cargar valoración actual
    fetch(`${SCRIPT_URL}?postId=${postId}`)
      .then(res => res.json())
      .then(data => {
        if (data.avg) avgSpan.innerText = data.avg;
        if (data.count) countSpan.innerText = data.count;
      }).catch(console.error);

    stars.forEach(star => {
      star.addEventListener('click', () => {
        const value = parseInt(star.dataset.value);
        // Enviar voto a Google Sheets
        fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId, postUrl, rating: value })
        }).then(() => {
          messageSpan.innerText = '¡Gracias por tu valoración!';
          setTimeout(() => messageSpan.innerText = '', 3000);
          // Actualizar visualmente (sin recargar)
          stars.forEach(s => s.classList.remove('selected'));
          for (let i = 0; i < value; i++) stars[i].classList.add('selected');
          // Opcional: recargar datos
          fetch(`${SCRIPT_URL}?postId=${postId}`)
            .then(res => res.json())
            .then(data => { if (data.avg) avgSpan.innerText = data.avg; if (data.count) countSpan.innerText = data.count; });
        }).catch(() => messageSpan.innerText = 'Error al enviar. Intenta de nuevo.');
      });
    });
  });

  // ========== 7. Botón volver arriba al 50% scroll ==========
  const backBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (scrollPercent > 0.5) backBtn.classList.add('show');
    else backBtn.classList.remove('show');
  });
  if (backBtn) backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ========== 8. Aviso de cookies (aceptar/rechazar) ==========
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (!cookieConsent && cookieBanner) cookieBanner.classList.add('active');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('active');
      // Activar scripts de rastreo (Google Analytics, AdSense) si están desactivados
      if (window.ga) window.ga('create', 'UA-XXXXX-Y', 'auto');
    });
  }
  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      cookieBanner.classList.remove('active');
      // Desactivar scripts de rastreo (ejemplo)
      window['ga-disable-UA-XXXXX-Y'] = true;
    });
  }

  // ========== 9. Funciones para comentarios (reply) ==========
  window.replyToComment = function(button) {
    const commentId = button.getAttribute('data-comment-id');
    const author = button.getAttribute('data-comment-author');
    const notice = document.getElementById('reply-notice');
    const authorSpan = document.getElementById('reply-author-name');
    const editor = document.getElementById('comment-editor');
    const formSrc = document.getElementById('comment-editor-src')?.href;
    if (notice && authorSpan && editor && formSrc) {
      authorSpan.innerText = `Respondiendo a ${author}`;
      notice.classList.add('show');
      editor.src = `${formSrc}&parentID=${commentId}`;
      editor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  window.cancelReply = function() {
    const notice = document.getElementById('reply-notice');
    const editor = document.getElementById('comment-editor');
    const formSrc = document.getElementById('comment-editor-src')?.href;
    if (notice && editor && formSrc) {
      notice.classList.remove('show');
      editor.src = formSrc;
    }
  };
})();
