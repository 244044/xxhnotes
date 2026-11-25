(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        throw new Error("Cannot find module '" + o + "'");
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function (e) {
        var n = t[o][1][e];
        return s(n ? n : e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
})({
  1: [function (require, module, exports) {
    var app = require("./lib/app");
    (function () {
      if (!('IntersectionObserver' in window) || !Element.prototype.animate) {
        return;
      }
      var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
      var elements = document.querySelectorAll('.section-heading, .note-row, .experiments-intro, .experiment-list a, .tool-list a, .footer-inner');
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          observer.unobserve(entry.target);
          if (!motionPreference.matches) {
            entry.target.animate([{
              opacity: 0.35,
              transform: 'translateY(22px)'
            }, {
              opacity: 1,
              transform: 'translateY(0)'
            }], {
              duration: 600,
              easing: 'cubic-bezier(.2, .7, .2, 1)'
            });
          }
        });
      }, {
        threshold: 0.1
      });
      Array.prototype.forEach.call(elements, function (element) {
        observer.observe(element);
      });
    })();
  }, {
    "./lib/app": 2
  }],
  2: [function (require, module, exports) {
    var app = {};
    app.detectOs = require('./detect-os');
    // header
    require('./header');
    app.toArr = function (list) {
      if (list.length) {
        return Array.prototype.slice.call(list);
      }
      return null;
    };
  }, {
    "./detect-os": 3,
    "./header": 4
  }],
  3: [function (require, module, exports) {
    var system = {
      win: ['Win321', 'Windows1'],
      mac: ['Mac68K', 'MacPPC', 'Macintosh', 'MacIntel'],
      unix: ['X11'],
      linux: ['Linux']
    };
    function detectOs() {
      var isWin = navigator.platform == "Win32" || navigator.platform == "Windows";
      var isMac = navigator.platform == "Mac68K" || navigator.platform == "MacPPC" || navigator.platform == "Macintosh" || navigator.platform == "MacIntel" || navigator.platform == "iPhone" || /iPhone/i.test(navigator.userAgent);
      if (isMac) {
        return "mac";
      }
      return "win";
    }
    module.exports = detectOs;
  }, {}],
  4: [function (require, module, exports) {
    function HeaderClick() {
      var header = document.querySelector('.xh-header');
      var menu = header && header.querySelector('.xh-header-menu');
      var toggle = header && header.querySelector('.xh-toggle');
      if (!header || !menu || !toggle) {
        return;
      }
      var dropdowns = Array.prototype.slice.call(menu.querySelectorAll('.drop-down'));
      var isMenuOpen = false;
      var savedOverflow = '';
      function closeDropdowns() {
        dropdowns.forEach(function (item) {
          item.classList.remove('drop-active');
          item.querySelector('.drop-down-title').setAttribute('aria-expanded', 'false');
        });
      }
      function closeMenu() {
        if (!isMenuOpen) {
          return;
        }
        isMenuOpen = false;
        toggle.classList.remove('active');
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '打开导航菜单');
        document.body.style.overflow = savedOverflow;
        header.style.position = '';
        header.style.top = '';
        header.style.zIndex = '';
        closeDropdowns();
      }
      toggle.setAttribute('type', 'button');
      toggle.setAttribute('aria-label', '打开导航菜单');
      toggle.setAttribute('aria-expanded', 'false');
      if (!menu.id) {
        menu.id = 'home-navigation';
      }
      toggle.setAttribute('aria-controls', menu.id);
      if (menu.tagName !== 'NAV') {
        menu.setAttribute('role', 'navigation');
      }
      menu.setAttribute('aria-label', '主导航');
      dropdowns.forEach(function (item, index) {
        var title = item.querySelector('.drop-down-title');
        var submenu = item.querySelector('.sub-menu');
        if (!submenu.id) {
          submenu.id = 'xh-submenu-' + index;
        }
        title.setAttribute('role', 'button');
        title.setAttribute('aria-controls', submenu.id);
        title.setAttribute('aria-expanded', 'false');
        title.addEventListener('click', function (event) {
          event.preventDefault();
          var isOpen = item.classList.contains('drop-active');
          closeDropdowns();
          if (!isOpen) {
            item.classList.add('drop-active');
            title.setAttribute('aria-expanded', 'true');
          }
        });
        title.addEventListener('keydown', function (event) {
          if (event.key === ' ') {
            event.preventDefault();
            title.click();
          }
        });
      });
      toggle.addEventListener('click', function () {
        if (isMenuOpen) {
          closeMenu();
          return;
        }
        isMenuOpen = true;
        savedOverflow = document.body.style.overflow;
        toggle.classList.add('active');
        menu.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', '关闭导航菜单');
        document.body.style.overflow = 'hidden';
        header.style.position = 'fixed';
        header.style.top = '0';
        header.style.zIndex = '1000';
      });
      menu.addEventListener('click', function (event) {
        if (event.target.closest('.sub-menu a')) {
          closeDropdowns();
          closeMenu();
        }
      });
      document.addEventListener('click', function (event) {
        if (!header.contains(event.target)) {
          closeDropdowns();
          closeMenu();
        }
      });
      document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') {
          return;
        }
        var active = menu.querySelector('.drop-active .drop-down-title');
        if (isMenuOpen) {
          closeMenu();
          toggle.focus();
        } else if (active) {
          closeDropdowns();
          active.focus();
        }
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 992 && isMenuOpen) {
          closeMenu();
        }
      });
    }
    HeaderClick();
  }, {}]
}, {}, [1]);