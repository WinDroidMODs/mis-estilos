/* EmuBox.js v2.1 - Con AdSense no personalizado en caso de rechazo */
(function(){
  'use strict';

  // ============================================================
  // 1. COOKIE BANNER CON CONTROL DE ANUNCIOS PERSONALIZADOS
  // ============================================================
  var cookieBanner = document.getElementById('cookie-banner');
  var hasConsent = localStorage.getItem('cookieConsent');
  var scriptsLoaded = false;

  function loadAdSense(nonPersonalized) {
    if (document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) return;
    
    // Establecer el modo de personalización ANTES de cargar el script
    window.adsbygoogle = window.adsbygoogle || [];
    if (nonPersonalized) {
      window.adsbygoogle.requestNonPersonalizedAds = 1;
    } else {
      window.adsbygoogle.requestNonPersonalizedAds = 0; // opcional, por claridad
    }
    
    var adScript = document.createElement('script');
    adScript.async = true;
    adScript.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    document.head.appendChild(adScript);
  }

  function loadAnalytics() {
    if (window.__EMUBOX_CONFIG && window.__EMUBOX_CONFIG.analyticsAccount && !window.ga) {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', window.__EMUBOX_CONFIG.analyticsAccount, 'auto');
      ga('send', 'pageview');
    }
  }

  function loadScriptsByConsent(consent) {
    if (scriptsLoaded) return;
    scriptsLoaded = true;
    
    if (consent === 'accepted') {
      // Aceptó: anuncios personalizados + analytics
      loadAdSense(false);
      loadAnalytics();
    } else if (consent === 'rejected') {
      // Rechazó: anuncios NO personalizados, sin analytics
      loadAdSense(true);
      // No cargar analytics
    }
  }

  if (cookieBanner && !hasConsent) {
    cookieBanner.style.display = 'flex';
    document.getElementById('cookie-accept').addEventListener('click', function(){
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.style.display = 'none';
      loadScriptsByConsent('accepted');
    });
    document.getElementById('cookie-reject').addEventListener('click', function(){
      localStorage.setItem('cookieConsent', 'rejected');
      cookieBanner.style.display = 'none';
      loadScriptsByConsent('rejected');
    });
  } else if (hasConsent === 'accepted') {
    loadScriptsByConsent('accepted');
  } else if (hasConsent === 'rejected') {
    loadScriptsByConsent('rejected');
  }

  // ============================================================
  // 2. FUNCIÓN UNIFICADA DE PROCESAMIENTO DE RATING Y METADATOS
  // ============================================================
  window.processRatingStars = function(container) {
    var hiddenDiv = container.querySelector('.hidden-labels');
    if (!hiddenDiv) return;
    var labelsText = hiddenDiv.textContent || hiddenDiv.innerText;
    var labels = labelsText.split(',').map(function(l) { return l.trim(); });
    var version = null, format = null, rating = null;
    var firstLabel = labels.length > 0 ? labels[0] : null;

    // Buscar formato (w)
    for (var i = 0; i < labels.length; i++) {
      var lbl = labels[i].toLowerCase();
      if (lbl.match(/^w/)) {
        format = labels[i].substring(1);
        break;
      }
    }
    // Buscar versión (v)
    if (!format) {
      for (var i = 0; i < labels.length; i++) {
        var lbl = labels[i].toLowerCase();
        if (lbl.match(/^v\d+(\.\d+)*/)) {
          version = labels[i];
          break;
        }
      }
    }
    // Buscar rating (z)
    for (var i = 0; i < labels.length; i++) {
      var match = labels[i].toLowerCase().match(/^z(\d+(?:\.\d+)?)/);
      if (match) {
        rating = parseFloat(match[1]);
        break;
      }
    }

    // Versión / formato
    var versionDiv = container.querySelector('.popular-post__version, .post-card__version');
    var versionSpan = container.querySelector('.version-value');
    if (versionDiv && versionSpan) {
      if (format) {
        versionDiv.childNodes[0].textContent = 'Formato: ';
        versionSpan.textContent = format;
        versionDiv.style.display = 'block';
      } else if (version) {
        versionDiv.childNodes[0].textContent = 'Versión: ';
        versionSpan.textContent = version;
        versionDiv.style.display = 'block';
      } else {
        versionDiv.style.display = 'none';
      }
    }

    // Estrellas
    var starsDiv = container.querySelector('.rating-stars');
    if (starsDiv && rating !== null && !isNaN(rating)) {
      var fullStars = Math.floor(rating);
      var partialFill = rating - fullStars;
      var starHtml = '';
      for (var s = 0; s < 5; s++) {
        if (s < fullStars) {
          starHtml += '<div class="rating-star full"></div>';
        } else if (s === fullStars && partialFill > 0) {
          var percent = Math.round(partialFill * 100);
          starHtml += '<div class="rating-star" style="background: linear-gradient(to right, #ffd700 ' + percent + '%, #e0e0e0 ' + percent + '%);"></div>';
        } else {
          starHtml += '<div class="rating-star empty"></div>';
        }
      }
      starsDiv.innerHTML = starHtml;
      starsDiv.style.display = 'flex';
    } else if (starsDiv) {
      starsDiv.style.display = 'none';
    }

    // Etiqueta superpuesta
    var tagDiv = container.querySelector('.post-card__featured-tag, .popular-post__featured-tag');
    if (tagDiv && firstLabel) {
      tagDiv.textContent = firstLabel;
      tagDiv.style.display = 'block';
    } else if (tagDiv) {
      tagDiv.style.display = 'none';
    }
  };

  // Procesar todas las tarjetas del grid principal
  window.processPostCards = function() {
    var cards = document.querySelectorAll('.post-card');
    cards.forEach(function(card) {
      window.processRatingStars(card);
    });
  };

  // Procesar el widget PopularPosts
  window.processPopularWidget = function() {
    var popularLinks = document.querySelectorAll('.popular-post-link');
    popularLinks.forEach(function(link) {
      window.processRatingStars(link);
    });
  };

  // ============================================================
  // 3. MENÚ HAMBURGUESA Y DROPDOWNS EN MÓVIL
  // ============================================================
  var navMenu = document.getElementById('navMenu');
  var navCheckbox = document.getElementById('nav-check');
  if (navMenu) {
    function handleDropdownClick(e) {
      if (window.innerWidth > 768) return;
      var link = e.currentTarget;
      var dropdown = link.closest('.dropdown');
      if (!dropdown) return;
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('open');
    }

    function initDropdowns() {
      var dropdownLinks = navMenu.querySelectorAll('.dropdown > a');
      dropdownLinks.forEach(function(link) {
        link.removeEventListener('click', handleDropdownClick);
        link.addEventListener('click', handleDropdownClick);
      });
    }

    initDropdowns();
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
        openDropdowns.forEach(function(dd){ dd.classList.remove('open'); });
      } else {
        initDropdowns();
      }
    });
    if (navCheckbox) {
      navCheckbox.addEventListener('change', function() {
        if (!this.checked) {
          var openDropdowns = navMenu.querySelectorAll('.dropdown.open');
          openDropdowns.forEach(function(dd){ dd.classList.remove('open'); });
        }
      });
    }
    var allLinks = navMenu.querySelectorAll('a');
    allLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          if (link.closest('.dropdown')) return;
          setTimeout(function() { if (navCheckbox) navCheckbox.checked = false; }, 100);
        }
      });
    });
  }

  // ============================================================
  // 4. HEADER STICKY, BOTÓN VOLVER ARRIBA (con umbral corregido)
  // ============================================================
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    var umbral = maxScroll * 0.4;
    if (window.scrollY > umbral) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });
  if (backToTop) {
    backToTop.addEventListener('click', function(){
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }

  // ============================================================
  // 5. FUNCIONES PARA COMENTARIOS (reply)
  // ============================================================
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

  // ============================================================
  // 6. TOOLTIP PARA TELEGRAM (con retraso)
  // ============================================================
  var tgBtn = document.querySelector("#telegram-floating-widget a");
  var tgTooltip = document.querySelector("#telegram-floating-widget .tooltip");
  if (tgBtn && tgTooltip) {
    var tgShown = false;
    var tgTimer = setTimeout(function() {
      if (!tgShown) {
        tgTooltip.style.visibility = "visible";
        tgTooltip.style.opacity = "1";
        tgTooltip.style.left = window.innerWidth <= 768 ? "70px" : "85px";
        tgShown = true;
        setTimeout(function() {
          tgTooltip.style.opacity = "0";
          tgTooltip.style.visibility = "hidden";
        }, 5000);
      }
    }, 10000);
    tgBtn.addEventListener("mouseenter", function() {
      clearTimeout(tgTimer);
      tgTooltip.style.visibility = "visible";
      tgTooltip.style.opacity = "1";
    });
    tgBtn.addEventListener("mouseleave", function() { tgTooltip.style.opacity = "0"; tgTooltip.style.visibility = "hidden"; });
    tgBtn.addEventListener("click", function() {
      tgTooltip.style.opacity = "0";
      tgTooltip.style.visibility = "hidden";
      tgShown = true;
      clearTimeout(tgTimer);
    });
  }

  // ============================================================
  // 7. EJECUCIÓN INICIAL DE PROCESAMIENTO DE TARJETAS
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.processPostCards();
      window.processPopularWidget();
    });
  } else {
    window.processPostCards();
    window.processPopularWidget();
  }
})();
