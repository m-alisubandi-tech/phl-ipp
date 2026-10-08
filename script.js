/* ============================================================
   SYSTEM PHL-IPP — GitHub Pages Wrapper
   Auto-resize iframe + hide loader
============================================================ */

(function() {
  'use strict';

  const iframe = document.getElementById('phlFrame');
  const loader = document.getElementById('loader');

  // ====== HIDE LOADER setelah iframe load ======
  function hideLoader() {
    if (!loader) return;
    loader.classList.add('hidden');
    setTimeout(function() {
      if (loader && loader.parentNode) {
        loader.style.display = 'none';
      }
    }, 600);
  }

  // ====== HANDLE AUTO RESIZE dari Apps Script ======
  window.addEventListener('message', function(e) {
    // Terima pesan dari Apps Script (postMessage)
    if (e.data && e.data.type === 'setHeight' && e.data.source === 'phl-ipp') {
      const h = Math.max(600, e.data.height || 0);
      if (iframe) {
        iframe.style.height = h + 'px';
      }
    }
    
    // Terima sinyal "ready" dari Apps Script
    if (e.data && e.data.type === 'phl-ready') {
      hideLoader();
    }
  });

  // ====== FALLBACK: Hide loader setelah iframe load ======
  if (iframe) {
    iframe.addEventListener('load', function() {
      // Delay sedikit untuk ensure UI sudah render
      setTimeout(hideLoader, 800);
    });
    
    // Fallback: hide loader setelah 5 detik (apapun yang terjadi)
    setTimeout(hideLoader, 5000);
  }

  // ====== HANDLE SIDEBAR TOGGLE (untuk mobile) ======
  // Jika Apps Script kirim pesan ke parent untuk trigger sidebar
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'toggle-sidebar') {
      // Kirim balik ke iframe
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'do-toggle-sidebar' }, '*');
      }
    }
  });

  // ====== PREVENT SCROLL BOUNCE (iOS) ======
  document.addEventListener('touchmove', function(e) {
    if (e.target === document.body) {
      e.preventDefault();
    }
  }, { passive: false });

  // ====== HANDLE ORIENTATION CHANGE ======
  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      // Trigger resize di iframe
      if (iframe) {
        iframe.style.height = window.innerHeight + 'px';
      }
    }, 300);
  });

  // ====== HANDLE WINDOW RESIZE ======
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (iframe) {
        iframe.style.height = window.innerHeight + 'px';
      }
    }, 250);
  });

  // ====== SET INITIAL HEIGHT ======
  if (iframe) {
    iframe.style.height = window.innerHeight + 'px';
  }

  // ====== LOG ======
  console.log('[PHL-IPP] GitHub Pages wrapper loaded');

})();
