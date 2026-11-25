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
    require("./lib/reading");
  }, {
    "./lib/app": 2,
    "./lib/reading": 5
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
  }, {}],
  5: [function (require, module, exports) {
    (function () {
      if (!document.body.classList.contains('reading-page')) return;
      var main = document.querySelector('main');
      if (!main) return;
      var article = main.querySelector('.knowledge-article');
      var headings = [];
      var links = [];
      var details;
      var pendingFrame = false;
      var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      var desktop = window.matchMedia('(min-width: 993px)');
      document.documentElement.classList.add('reading-enhanced');
      var progress = document.createElement('progress');
      progress.className = 'reading-progress';
      progress.max = 100;
      progress.value = 0;
      progress.setAttribute('aria-label', '页面阅读进度');
      document.body.appendChild(progress);
      var topButton = document.createElement('button');
      topButton.type = 'button';
      topButton.className = 'reading-top';
      topButton.textContent = '回到顶部';
      topButton.hidden = true;
      document.body.appendChild(topButton);
      topButton.addEventListener('click', function () {
        var title = main.querySelector('.page-mast h1');
        if (title) {
          title.setAttribute('tabindex', '-1');
          title.focus({
            preventScroll: true
          });
        }
        window.scrollTo({
          top: 0,
          behavior: reducedMotion.matches ? 'auto' : 'smooth'
        });
      });
      if (article) {
        ['h2', 'h3', 'h4'].some(function (level) {
          headings = Array.prototype.slice.call(article.querySelectorAll(level)).filter(function (heading) {
            return heading.textContent.trim();
          });
          return headings.length >= 2;
        });
        if (headings.length >= 2) {
          details = document.createElement('details');
          details.className = 'reading-index';
          details.open = desktop.matches;
          var summary = document.createElement('summary');
          summary.textContent = '本篇目录';
          var nav = document.createElement('nav');
          nav.setAttribute('aria-label', '本篇目录');
          var list = document.createElement('ol');
          headings.forEach(function (heading, index) {
            if (!heading.id) {
              var id = 'reading-section-' + (index + 1);
              while (document.getElementById(id)) id += '-section';
              heading.id = id;
            }
            var item = document.createElement('li');
            var link = document.createElement('a');
            link.href = '#' + heading.id;
            link.textContent = heading.textContent.trim();
            link.addEventListener('click', function () {
              if (!desktop.matches) {
                summary.focus({
                  preventScroll: true
                });
                details.open = false;
              }
            });
            links.push(link);
            item.appendChild(link);
            list.appendChild(item);
          });
          nav.appendChild(list);
          details.appendChild(summary);
          details.appendChild(nav);
          article.parentNode.insertBefore(details, article);
          desktop.addEventListener('change', function (event) {
            details.open = event.matches;
          });
          details.addEventListener('toggle', scheduleUpdate);
        }
      }
      function updateReadingState() {
        pendingFrame = false;
        var maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        progress.value = maxScroll > 0 ? Math.min(100, Math.max(0, scrollTop / maxScroll * 100)) : 100;
        topButton.hidden = scrollTop < 400 && document.activeElement !== topButton;
        if (!links.length) return;
        var active = 0;
        headings.forEach(function (heading, index) {
          if (heading.getBoundingClientRect().top <= 100) active = index;
        });
        if (maxScroll > 0 && scrollTop >= maxScroll - 2) active = headings.length - 1;
        links.forEach(function (link, index) {
          if (index === active) link.setAttribute('aria-current', 'location');else link.removeAttribute('aria-current');
        });
      }
      function scheduleUpdate() {
        if (!pendingFrame) {
          pendingFrame = true;
          window.requestAnimationFrame(updateReadingState);
        }
      }
      window.addEventListener('scroll', scheduleUpdate, {
        passive: true
      });
      window.addEventListener('resize', scheduleUpdate);
      main.addEventListener('load', scheduleUpdate, true);
      topButton.addEventListener('blur', scheduleUpdate);
      updateReadingState();
      if (window.location.hash && links.length) {
        window.requestAnimationFrame(function () {
          var hash = window.location.hash;
          var target = links.filter(function (link) {
            return link.hash === hash;
          })[0];
          if (target) {
            headings[links.indexOf(target)].scrollIntoView({
              block: 'start',
              behavior: 'auto'
            });
          }
        });
      }
    })();
  }, {}]
}, {}, [1]);