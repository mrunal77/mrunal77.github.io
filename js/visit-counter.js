document.addEventListener('DOMContentLoaded', function() {
  var countEl = document.getElementById('site-visit-count');
  if (!countEl) return;

  var namespace = 'mrunal77githubio';
  var key = 'homepage';
  var hitUrl = 'https://api.counterapi.dev/v1/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(key) + '/up';

  function showValue(v) {
    try { countEl.textContent = Number(v).toLocaleString(); } catch (e) { countEl.textContent = v; }
  }

  fetch(hitUrl, { cache: 'no-store', mode: 'cors' })
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(data) {
      if (data && typeof data.count !== 'undefined') {
        showValue(data.count);
      } else {
        countEl.textContent = 'N/A';
      }
    })
    .catch(function(err) {
      console.error('Visit counter failed:', err);
      countEl.textContent = 'N/A';
    });
});
