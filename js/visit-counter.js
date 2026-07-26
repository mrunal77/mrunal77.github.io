// Visitor counter using CounterAPI.dev (https://counterapi.dev)
(function() {
  function initCounter() {
    var countEl = document.getElementById('site-visit-count');
    if (!countEl) return;

    var namespace = 'mrunal77githubio';
    var key = 'homepage';
    var cacheKey = 'site-visit-count-cached';
    var sessionKey = 'site-visited-session';

    function displayCount(val) {
      if (typeof val === 'number' && !isNaN(val)) {
        try {
          countEl.textContent = val.toLocaleString();
        } catch (e) {
          countEl.textContent = val;
        }
      } else if (val) {
        countEl.textContent = val;
      } else {
        countEl.textContent = 'N/A';
      }
    }

    // Increment count only once per browser session
    var isNewSession = false;
    try {
      if (!sessionStorage.getItem(sessionKey)) {
        isNewSession = true;
      }
    } catch (e) {
      isNewSession = true;
    }

    var endpoint = isNewSession
      ? 'https://api.counterapi.dev/v1/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(key) + '/up'
      : 'https://api.counterapi.dev/v1/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(key) + '/';

    fetch(endpoint, { cache: 'no-store' })
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data) {
        if (data && typeof data.count === 'number') {
          displayCount(data.count);
          try {
            sessionStorage.setItem(sessionKey, '1');
            localStorage.setItem(cacheKey, data.count.toString());
          } catch (e) {}
        } else {
          throw new Error('Invalid counter response format');
        }
      })
      .catch(function(err) {
        console.warn('Visitor counter fetch failed, using cached fallback:', err);
        try {
          var cached = localStorage.getItem(cacheKey);
          if (cached) {
            var cachedNum = parseInt(cached, 10);
            displayCount(!isNaN(cachedNum) ? cachedNum : cached);
          } else {
            displayCount('N/A');
          }
        } catch (e) {
          displayCount('N/A');
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounter);
  } else {
    initCounter();
  }
})();
