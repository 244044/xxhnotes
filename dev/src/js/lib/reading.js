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
      title.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
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
            summary.focus({ preventScroll: true });
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
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function scheduleUpdate() {
    if (!pendingFrame) {
      pendingFrame = true;
      window.requestAnimationFrame(updateReadingState);
    }
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  main.addEventListener('load', scheduleUpdate, true);
  topButton.addEventListener('blur', scheduleUpdate);
  updateReadingState();

  if (window.location.hash && links.length) {
    window.requestAnimationFrame(function () {
      var hash = window.location.hash;
      var target = links.filter(function (link) { return link.hash === hash; })[0];
      if (target) {
        headings[links.indexOf(target)].scrollIntoView({ block: 'start', behavior: 'auto' });
      }
    });
  }
})();
