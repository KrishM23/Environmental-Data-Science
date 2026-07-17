/**
 * Terrain shared top nav
 * One source of truth so every page stays clean and in sync.
 */
(function () {
  var path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var isHome = path === '' || path === 'index.html';

  function isActive(page) {
    if (page === 'home') return isHome;
    if (page === 'projects') return path === 'projects.html' || path === 'skills.html' || path === 'lesson.html';
    if (page === 'datasets') return path === 'datasets.html' || path === 'explainer.html' || path === 'suggest-dataset.html';
    if (page === 'programs') return path === 'programs.html';
    if (page === 'people') return path === 'team.html';
    if (page === 'join') return path === 'creators.html' || path === 'creators-success.html';
    return path === page;
  }

  function cls(cond, name) {
    return cond ? ' ' + name : '';
  }

  var facultyHref = isHome ? '#faculty' : 'index.html#faculty';
  var joinListHref = isHome ? '#join' : 'index.html#join';
  var startHref = isHome ? '#start' : 'index.html#start';

  var caret = '<svg class="nav-dd-caret" width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.75 4.5 6 7.75 9.25 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var html =
    '<a href="datasets.html"' + (isActive('datasets') ? ' class="active"' : '') + '>Datasets</a>' +
    '<div class="nav-dd">' +
      '<a href="projects.html" class="nav-dd-trigger' + cls(isActive('projects'), 'active') + '">Projects' + caret + '</a>' +
      '<div class="nav-dd-menu">' +
        '<a href="projects.html"' + (path === 'projects.html' ? ' class="active"' : '') + '>Project library<span class="dd-sub">Guided starter projects</span></a>' +
        '<a href="skills.html"' + (path === 'skills.html' || path === 'lesson.html' ? ' class="active"' : '') + '>Skills<span class="dd-sub">Free lessons</span></a>' +
      '</div>' +
    '</div>' +
    '<a href="programs.html"' + (isActive('programs') ? ' class="active"' : '') + '>Programs</a>' +
    '<div class="nav-dd">' +
      '<a href="' + facultyHref + '" class="nav-dd-trigger' + cls(isActive('people'), 'active') + '">People' + caret + '</a>' +
      '<div class="nav-dd-menu">' +
        '<a href="' + facultyHref + '">Faculty<span class="dd-sub">Researchers and labs</span></a>' +
        '<a href="team.html"' + (path === 'team.html' ? ' class="active"' : '') + '>Team<span class="dd-sub">Who builds Terrain</span></a>' +
      '</div>' +
    '</div>' +
    '<div class="nav-dd">' +
      '<a href="creators.html" class="nav-dd-trigger' + cls(isActive('join'), 'active') + '">Join' + caret + '</a>' +
      '<div class="nav-dd-menu">' +
        '<a href="creators.html"' + (isActive('join') ? ' class="active"' : '') + '>Summer internship<span class="dd-sub">6 to 8 weeks</span></a>' +
        '<a href="' + joinListHref + '">Mailing list<span class="dd-sub">New datasets and projects</span></a>' +
      '</div>' +
    '</div>' +
    '<a href="' + startHref + '" class="nav-cta">Get started</a>';

  var menu = document.getElementById('siteNavMenu');
  if (menu) menu.innerHTML = html;

  /* Keep the new transparent PNG logo locked in across pages */
  document.querySelectorAll('img.logo-mark, a.logo img').forEach(function (img) {
    var src = img.getAttribute('src') || '';
    if (src.indexOf('terrain-logo.png') === -1) {
      img.setAttribute('src', 'assets/terrain-logo.png');
    }
    img.setAttribute('height', '40');
  });

  /* Mobile / drawer behavior */
  var toggle = document.getElementById('navToggle');
  var backdrop = document.getElementById('navBackdrop');
  if (!toggle || !menu) return;

  function setOpen(open) {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (backdrop) backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (!open) {
      menu.querySelectorAll('.nav-dd.is-open').forEach(function (dd) {
        dd.classList.remove('is-open');
      });
    }
  }

  function closeMenu() { setOpen(false); }

  toggle.addEventListener('click', function () {
    setOpen(!document.body.classList.contains('nav-open'));
  });

  if (backdrop) backdrop.addEventListener('click', closeMenu);

  /* Accordion: only expand one dropdown in the drawer */
  menu.addEventListener('click', function (e) {
    var trigger = e.target.closest('.nav-dd-trigger');
    if (!trigger) return;
    if (window.innerWidth > 820) return; /* desktop uses hover */

    var dd = trigger.closest('.nav-dd');
    if (!dd) return;
    e.preventDefault();
    var wasOpen = dd.classList.contains('is-open');
    menu.querySelectorAll('.nav-dd.is-open').forEach(function (el) {
      el.classList.remove('is-open');
    });
    if (!wasOpen) dd.classList.add('is-open');
  });

  menu.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    if (link.classList.contains('nav-dd-trigger') && window.innerWidth <= 820) return;
    closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 820) closeMenu();
  });
})();
