// Draw the nav logo in on every load of the homepage, and on the first page
// of a visit elsewhere so it doesn't replay on every page change. Runs in
// <head>, before the logo paints.
(function () {
  var home = location.pathname === '/' || location.pathname === '/index.html';
  try {
    if (!home && sessionStorage.getItem('cp-logo-drawn')) return;
    sessionStorage.setItem('cp-logo-drawn', '1');
  } catch (e) {
    if (!home) return;
  }
  document.documentElement.classList.add('logo-draw');
})();
