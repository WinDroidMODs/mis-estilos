/* EmuBox.js v2.0 | Autor: Robinson Avila | By: WinDroidMODs */

(function(){
  'use strict';

  // Función global para parsear etiquetas (formato, versión, rating)
  window.parsePostLabels = function(labelsArray) {
    var format = null, version = null, rating = null;
    for (var i = 0; i < labelsArray.length; i++) {
      var lbl = labelsArray[i].trim();
      var lower = lbl.toLowerCase();
      if (lower.match(/^w/)) {
        format = lbl.substring(1);
        break;
      }
    }
    if (!format) {
      for (var i = 0; i < labelsArray.length; i++) {
        var lbl = labelsArray[i].trim();
        if (lbl.toLowerCase().match(/^v\d+(\.\d+)*/)) {
          version = lbl;
          break;
        }
      }
    }
    for (var i = 0; i < labelsArray.length; i++) {
      var lbl = labelsArray[i].trim();
      var match = lbl.toLowerCase().match(/^z(\d+(?:\.\d+)?)/);
      if (match) {
        rating = parseFloat(match[1]);
        break;
      }
    }
    return { format: format, version: version, rating: rating };
  };

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

  // Header sticky y botón volver arriba (umbral 300px)
  var header = document.getElementById('header');
  var backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    if (window.scrollY > 300) backToTop.classList.add('show');
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
