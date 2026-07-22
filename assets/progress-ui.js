/* Terrain progress UI — simple status control */
(function () {
  var LABELS = {
    not_started: 'Not started',
    in_progress: 'In progress',
    done: 'Done'
  };

  function toast(message, tone) {
    var el = document.getElementById('terrainTrackToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'terrainTrackToast';
      el.className = 'track-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.className = 'track-toast is-visible' + (tone ? ' track-toast--' + tone : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      el.classList.remove('is-visible');
    }, 2200);
  }

  function statusOf(kind, id) {
    if (!window.TerrainAuth) return 'not_started';
    var progress = TerrainAuth.getProgress() || {};
    var map = progress[kind] || {};
    return (map[id] && map[id].status) || 'not_started';
  }

  async function setStatus(kind, id, status, label, opts) {
    opts = opts || {};
    if (!window.TerrainAuth || !TerrainAuth.isLoggedIn()) {
      if (opts.loginNext) {
        location.href = 'login.html?next=' + encodeURIComponent(opts.loginNext);
      }
      return null;
    }
    try {
      var progress = await TerrainAuth.setProgressItem(kind, id, status, label, opts.meta);
      if (!opts.silent) {
        if (status === 'in_progress' && !opts.meta) toast('Marked in progress');
        else if (status === 'done' && !opts.quietDone) toast('Marked done', 'ok');
        else if (status === 'not_started') toast('Cleared');
      }
      document.dispatchEvent(new CustomEvent('terrain:progress', {
        detail: { kind: kind, id: id, status: status, progress: progress }
      }));
      return progress;
    } catch (err) {
      if (!opts.silent) toast(err.message || 'Could not update progress', 'err');
      throw err;
    }
  }

  /** Mark in progress if not already started or done. */
  async function ensureStarted(kind, id, label, opts) {
    opts = opts || {};
    if (!window.TerrainAuth || !TerrainAuth.isLoggedIn()) return null;
    var cur = statusOf(kind, id);
    if (cur === 'done' || cur === 'in_progress') return null;
    return setStatus(kind, id, 'in_progress', label, {
      silent: opts.silent !== false,
      loginNext: opts.loginNext
    });
  }

  /** Wire "Back to home" crumbs to My learning when coming from the dashboard. */
  function wireDashboardBack() {
    if (!window.TerrainAuth || !TerrainAuth.shouldReturnToDashboard()) return;
    document.querySelectorAll('a.crumb').forEach(function (a) {
      a.setAttribute('href', 'dashboard.html');
      var label = a.querySelector('.crumb-label') || a;
      /* Replace text nodes after the SVG */
      var nodes = Array.prototype.slice.call(a.childNodes);
      nodes.forEach(function (n) {
        if (n.nodeType === 3 && n.textContent.trim()) {
          n.textContent = ' Back to My learning';
        }
      });
      a.addEventListener('click', function () {
        TerrainAuth.clearReturnToDashboard();
      });
    });
    document.querySelectorAll('a.logo').forEach(function (a) {
      a.setAttribute('href', 'dashboard.html');
    });
  }

  function renderControl(el, kind, id, label, opts) {
    opts = opts || {};
    if (!el) return;
    var loggedIn = window.TerrainAuth && TerrainAuth.isLoggedIn();
    var status = statusOf(kind, id);
    var next = opts.loginNext || (location.pathname.split('/').pop() || 'projects.html');

    if (!loggedIn) {
      /* Guests: keep cards clean; page hint explains login */
      if (kind === 'projects') {
        el.hidden = true;
        el.innerHTML = '';
        return;
      }
      el.hidden = false;
      el.className = 'track-rail track-rail--guest';
      el.innerHTML =
        '<a class="track-signin" href="login.html?next=' + encodeURIComponent(next) + '">' +
          'Log in to track this' +
        '</a>';
      return;
    }

    el.hidden = false;
    el.className = 'track-rail track-rail--' + status;
    el.setAttribute('data-track-kind', kind);
    el.setAttribute('data-track-id', id);
    el.setAttribute('data-track-label', label || id);

    el.innerHTML =
      '<span class="track-label">Progress</span>' +
      '<div class="track-seg" role="group" aria-label="Project progress">' +
        '<button type="button" class="track-opt' + (status === 'in_progress' ? ' is-on' : '') + '" data-track-action="in_progress">In progress</button>' +
        '<button type="button" class="track-opt' + (status === 'done' ? ' is-on' : '') + '" data-track-action="done">Done</button>' +
        (status !== 'not_started'
          ? '<button type="button" class="track-opt track-opt-clear" data-track-action="not_started" title="Clear progress">Clear</button>'
          : '') +
      '</div>';
  }

  function bindRoot(root) {
    if (!root || root._terrainTrackBound) return;
    root._terrainTrackBound = true;
    root.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-track-action]');
      if (!btn) return;
      var rail = btn.closest('.track-rail');
      if (!rail || !root.contains(rail)) return;
      e.preventDefault();
      e.stopPropagation();
      var kind = rail.getAttribute('data-track-kind');
      var id = rail.getAttribute('data-track-id');
      var label = rail.getAttribute('data-track-label') || id;
      var status = btn.getAttribute('data-track-action');
      if (!kind || !id || !status) return;
      /* Clicking the already-selected status does nothing */
      if (btn.classList.contains('is-on') && status !== 'not_started') return;
      btn.disabled = true;
      setStatus(kind, id, status, label, {
        loginNext: location.pathname.split('/').pop() || 'projects.html'
      }).then(function () {
        refreshAll(root);
      }).catch(function () {
        btn.disabled = false;
      });
    });
  }

  function refreshAll(root) {
    root = root || document;
    root.querySelectorAll('[data-progress-kind]').forEach(function (el) {
      renderControl(
        el,
        el.getAttribute('data-progress-kind'),
        el.getAttribute('data-progress-id'),
        el.getAttribute('data-progress-label'),
        { loginNext: el.getAttribute('data-login-next') || undefined }
      );
    });
    root.querySelectorAll('.pcard[data-project-id]').forEach(function (card) {
      var id = card.getAttribute('data-project-id');
      var st = statusOf('projects', id);
      card.setAttribute('data-track-status', st);
      var badge = card.querySelector('.pcard-track-badge');
      if (badge) {
        if (st === 'not_started') {
          badge.hidden = true;
        } else {
          badge.hidden = false;
          badge.dataset.status = st;
          badge.textContent = LABELS[st] || st;
        }
      }
    });
  }

  function mount(root) {
    root = root || document;
    wireDashboardBack();
    bindRoot(root);
    refreshAll(root);
    if (!document._terrainProgressListening) {
      document._terrainProgressListening = true;
      document.addEventListener('terrain:progress', function () {
        refreshAll(document);
      });
    }
  }

  window.TerrainProgressUI = {
    toast: toast,
    statusOf: statusOf,
    setStatus: setStatus,
    ensureStarted: ensureStarted,
    wireDashboardBack: wireDashboardBack,
    renderControl: renderControl,
    refreshAll: refreshAll,
    mount: mount,
    labels: LABELS
  };
})();
