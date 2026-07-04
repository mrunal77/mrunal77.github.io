// Fetch and display a global visit count using CountAPI
(function() {
  var countEl = document.getElementById('site-visit-count');
  if (!countEl) return;

  // Use a namespace/key tied to this site. CountAPI provides a simple public counter service.
  var namespace = 'mrunal77.github.io';
  var key = 'homepage';
  var url = 'https://api.countapi.xyz/hit/' + encodeURIComponent(namespace) + '/' + encodeURIComponent(key);

  fetch(url, { cache: 'no-store' })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && typeof data.value !== 'undefined') {
        countEl.textContent = data.value.toLocaleString();
      } else {
        countEl.textContent = 'N/A';
      }
    })
    .catch(function() {
      countEl.textContent = 'N/A';
    });
})();
