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
