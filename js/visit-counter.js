document.addEventListener('DOMContentLoaded', function() {
  var countEl = document.getElementById('site-visit-count');
  if (!countEl) return;

  var key = 'site-visit-count-mrunal77';
  var count = localStorage.getItem(key);
  count = count ? parseInt(count, 10) : 0;
  count += 1;
  try { localStorage.setItem(key, count); } catch (e) {}
  try { countEl.textContent = Number(count).toLocaleString(); } catch (e) { countEl.textContent = count; }
});
