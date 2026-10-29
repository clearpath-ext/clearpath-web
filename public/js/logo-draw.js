// Draw the nav logo in on the first page of a visit only, so it doesn't
// replay on every page change. Runs in <head>, before the logo paints.
(function () {
  try {
    if (sessionStorage.getItem('cp-logo-drawn')) return;
    sessionStorage.setItem('cp-logo-drawn', '1');
  } catch (e) { return; }
  document.documentElement.classList.add('logo-draw');
})();
