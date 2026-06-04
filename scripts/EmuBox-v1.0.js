/* EmuBox-v1.0.js | Autor: Robinson Avila | By: WinDroidMODs */
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
  if (!window.processPostMetadata) {
    window.processPostMetadata = function() {
      document.querySelectorAll('.post-card, .popular-post-link').forEach(function(card) {
        var hiddenDiv = card.querySelector('.hidden-labels');
        if (!hiddenDiv) return;
        var labelsText = hiddenDiv.textContent || hiddenDiv.innerText;
        var labels = labelsText.split(',');
        var version = null, format = null, rating = null, firstLabel = labels.length > 0 ? labels[0].trim() : null;
        for (var i = 0; i < labels.length; i++) {
          var lbl = labels[i].trim();
          if (lbl.toLowerCase().match(/^w/)) { format = lbl.substring(1); break; }
        }
        if (!format) {
          for (var i = 0; i < labels.length; i++) {
            var lbl = labels[i].trim();
            if (lbl.toLowerCase().match(/^v\d+(\.\d+)*/)) { version = lbl; break; }
          }
        }
        for (var i = 0; i < labels.length; i++) {
          var lbl = labels[i].trim();
          var match = lbl.toLowerCase().match(/^z(\d+(?:\.\d+)?)/);
          if (match) { rating = parseFloat(match[1]); break; }
        }
        var versionDiv = card.querySelector('.post-card__version, .popular-post__version');
        var versionSpan = card.querySelector('.version-value');
        if (versionDiv && versionSpan) {
          if (format) {
            versionDiv.childNodes[0].textContent = 'Formato: ';
            versionSpan.textContent = format;
            versionDiv.style.display = 'block';
          } else if (version) {
            versionDiv.childNodes[0].textContent = 'Versión: ';
            versionSpan.textContent = version;
            versionDiv.style.display = 'block';
          } else versionDiv.style.display = 'none';
        }
        var starsDiv = card.querySelector('.rating-stars');
        if (starsDiv && rating !== null && !isNaN(rating)) {
          var fullStars = Math.floor(rating), partialFill = rating - fullStars, starHtml = '';
          for (var s = 0; s < 5; s++) {
            if (s < fullStars) starHtml += '<div class="rating-star full"></div>';
            else if (s === fullStars && partialFill > 0) {
              var percent = Math.round(partialFill * 100);
              starHtml += '<div class="rating-star" style="background: linear-gradient(to right, #ffd700 ' + percent + '%, #e0e0e0 ' + percent + '%);"></div>';
            } else starHtml += '<div class="rating-star empty"></div>';
          }
          starsDiv.innerHTML = starHtml;
          starsDiv.style.display = 'flex';
        } else if (starsDiv) starsDiv.style.display = 'none';
        var tagDiv = card.querySelector('.post-card__featured-tag, .popular-post__featured-tag');
        if (tagDiv && firstLabel) { tagDiv.textContent = firstLabel; tagDiv.style.display = 'block'; }
        else if (tagDiv) tagDiv.style.display = 'none';
      });
    };
    window.processPostMetadata();
  }
})();
