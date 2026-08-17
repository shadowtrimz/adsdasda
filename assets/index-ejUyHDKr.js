// Minimal placeholder bundle so the shell renders while you add a real build.
document.addEventListener('DOMContentLoaded', function () {
  var loader = document.getElementById('jsLoader');
  var root = document.getElementById('root');
  if (loader) loader.classList.add('hidden');
  if (root) {
    var app = document.createElement('div');
    app.style.color = '#fff';
    app.style.display = 'flex';
    app.style.flexDirection = 'column';
    app.style.alignItems = 'center';
    app.style.justifyContent = 'center';
    app.style.height = '100vh';
    app.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial';
    app.innerHTML = '<h1 style="margin:0 0 8px 0">Super Ace - Placeholder</h1><p style="margin:0 0 12px 0;opacity:0.9">This is a placeholder bundle. Replace assets/index-ejUyHDKr.js with your real build output.</p><a href="https://github.com/shadowtrimz/adsdasda" target="_blank" rel="noopener" style="color:#9cf">Open repository</a>';
    root.appendChild(app);
  }
});
export default {};