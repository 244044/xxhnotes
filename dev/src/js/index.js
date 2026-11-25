var app = require("./lib/app");

(function () {
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) {
    return;
  }

  var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  var elements = document.querySelectorAll(
    '.section-heading, .note-row, .experiments-intro, .experiment-list a, .tool-list a, .footer-inner'
  );
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        return;
      }

      observer.unobserve(entry.target);
      if (!motionPreference.matches) {
        entry.target.animate([
          { opacity: 0.35, transform: 'translateY(22px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], {
          duration: 600,
          easing: 'cubic-bezier(.2, .7, .2, 1)'
        });
      }
    });
  }, { threshold: 0.1 });

  Array.prototype.forEach.call(elements, function (element) {
    observer.observe(element);
  });
})();
