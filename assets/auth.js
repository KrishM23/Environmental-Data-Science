/* Terrain auth + progress client — professional session layer */
(function () {
  var TOKEN_KEY = 'terrain_token';
  var USER_KEY = 'terrain_user';
  var PROGRESS_KEY = 'terrain_progress';
  var EXPIRES_KEY = 'terrain_token_exp';

  function storage(remember) {
    try {
      if (remember === false) return sessionStorage;
      if (remember === true) return localStorage;
      /* Prefer whichever already has a session */
      if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage;
      return localStorage;
    } catch (e) {
      return localStorage;
    }
  }

  function apiBase() {
    var cfg = (window.TERRAIN && window.TERRAIN.apiBase) || '';
    if (cfg) return cfg.replace(/\/$/, '');
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      return 'http://localhost:8787';
    }
    return '';
  }

  function getToken() {
    try {
      return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || '';
    } catch (e) { return ''; }
  }

  function getUser() {
    try {
      var raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function getProgressCache() {
    try {
      var raw = sessionStorage.getItem(PROGRESS_KEY) || localStorage.getItem(PROGRESS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function clearBoth() {
    [localStorage, sessionStorage].forEach(function (s) {
      try {
        s.removeItem(TOKEN_KEY);
        s.removeItem(USER_KEY);
        s.removeItem(PROGRESS_KEY);
        s.removeItem(EXPIRES_KEY);
      } catch (e) { /* ignore */ }
    });
  }

  function setSession(token, user, progress, options) {
    options = options || {};
    var remember = options.remember !== false;
    var store = storage(remember);
    clearBoth();
    try {
      if (token) store.setItem(TOKEN_KEY, token);
      if (user) store.setItem(USER_KEY, JSON.stringify(user));
      if (progress) store.setItem(PROGRESS_KEY, JSON.stringify(progress));
      if (options.expiresAt) store.setItem(EXPIRES_KEY, String(options.expiresAt));
      else if (options.expiresInDays) {
        var exp = Date.now() + Number(options.expiresInDays) * 86400000;
        store.setItem(EXPIRES_KEY, String(exp));
      }
    } catch (e) { /* ignore */ }
  }

  function clearSession() {
    clearBoth();
  }

  function isTokenExpired() {
    try {
      var exp = sessionStorage.getItem(EXPIRES_KEY) || localStorage.getItem(EXPIRES_KEY);
      if (!exp) return false;
      return Date.now() > Number(exp);
    } catch (e) { return false; }
  }

  async function request(path, options) {
    options = options || {};
    var headers = Object.assign({ 'Content-Type': 'application/json', Accept: 'application/json' }, options.headers || {});
    var token = getToken();
    if (token) headers.Authorization = 'Bearer ' + token;

    var res;
    try {
      res = await fetch(apiBase() + path, Object.assign({}, options, { headers: headers }));
    } catch (netErr) {
      var offline = new Error(
        (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
          ? 'Unable to reach Terrain. Start the API with “npm run api” (port 8787), then try again.'
          : 'Unable to reach Terrain. Check your connection and try again.'
      );
      offline.status = 0;
      throw offline;
    }

    var data = null;
    try { data = await res.json(); } catch (e) { data = null; }

    if (!res.ok) {
      var err = new Error((data && data.error) || (res.status === 429
        ? 'Too many attempts. Please wait and try again.'
        : 'Request failed'));
      err.status = res.status;
      err.data = data;
      if (res.status === 401 && path.indexOf('/auth/login') === -1 && path.indexOf('/auth/change-password') === -1) {
        clearSession();
      }
      throw err;
    }
    return data;
  }

  function applyAuthResponse(data, remember) {
    setSession(data.token, data.user, data.progress, {
      remember: remember !== false,
      expiresInDays: data.expiresInDays || 30
    });
    return data;
  }

  async function signup(payload, remember) {
    var data = await request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return applyAuthResponse(data, remember);
  }

  async function login(payload, remember) {
    var data = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return applyAuthResponse(data, remember);
  }

  async function me() {
    if (!getToken()) return null;
    if (isTokenExpired()) {
      clearSession();
      return null;
    }
    try {
      var data = await request('/api/auth/me');
      setSession(getToken(), data.user, data.progress, {
        remember: !!localStorage.getItem(TOKEN_KEY),
        expiresAt: data.session && data.session.expiresAt
          ? new Date(data.session.expiresAt).getTime()
          : undefined
      });
      return data;
    } catch (e) {
      return null;
    }
  }

  function logout() {
    clearSession();
  }

  async function forgotPassword(email) {
    return request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: email })
    });
  }

  async function resetPassword(token, password) {
    return request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: token, password: password })
    });
  }

  async function updateProfile(name) {
    var data = await request('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify({ name: name })
    });
    setSession(getToken(), data.user, getProgressCache(), {
      remember: !!localStorage.getItem(TOKEN_KEY)
    });
    return data;
  }

  async function changePassword(currentPassword, newPassword) {
    var data = await request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword })
    });
    if (data.token) {
      setSession(data.token, data.user || getUser(), getProgressCache(), {
        remember: !!localStorage.getItem(TOKEN_KEY),
        expiresInDays: data.expiresInDays || 30
      });
    }
    return data;
  }

  async function deleteAccount(password) {
    var data = await request('/api/auth/account', {
      method: 'DELETE',
      body: JSON.stringify({ password: password })
    });
    clearSession();
    return data;
  }

  async function setProgressItem(kind, id, status, label, meta) {
    /* Optimistic local update so the UI feels instant */
    var cached = getProgressCache() || { projects: {}, skills: {}, faculty: {} };
    if (!cached[kind] || typeof cached[kind] !== 'object') cached[kind] = {};
    if (status === 'not_started') {
      delete cached[kind][id];
    } else {
      var mergedMeta = meta
        ? Object.assign({}, (cached[kind][id] && cached[kind][id].meta) || {}, meta)
        : (cached[kind][id] && cached[kind][id].meta);
      cached[kind][id] = Object.assign({}, cached[kind][id] || {}, {
        status: status,
        label: label || (cached[kind][id] && cached[kind][id].label) || id,
        updatedAt: new Date().toISOString(),
        meta: mergedMeta
      });
    }
    cached.updatedAt = new Date().toISOString();
    setSession(getToken(), getUser(), cached, {
      remember: !!localStorage.getItem(TOKEN_KEY)
    });

    if (status === 'not_started') {
      return clearProgressItem(kind, id);
    }

    try {
      var payload = {
        status: status,
        label: label,
        meta: cached[kind][id] && cached[kind][id].meta
      };
      var data = await request('/api/progress/' + encodeURIComponent(kind) + '/' + encodeURIComponent(id), {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      setSession(getToken(), getUser(), data.progress, {
        remember: !!localStorage.getItem(TOKEN_KEY)
      });
      return data.progress;
    } catch (err) {
      /* Keep optimistic cache; surface error to caller */
      throw err;
    }
  }

  async function clearProgressItem(kind, id) {
    var data = await request('/api/progress/' + encodeURIComponent(kind) + '/' + encodeURIComponent(id), {
      method: 'DELETE'
    });
    setSession(getToken(), getUser(), data.progress, {
      remember: !!localStorage.getItem(TOKEN_KEY)
    });
    return data.progress;
  }

  function isLoggedIn() {
    if (isTokenExpired()) {
      clearSession();
      return false;
    }
    return !!getToken() && !!getUser();
  }

  function firstName(user) {
    user = user || getUser();
    if (!user || !user.name) return '';
    return String(user.name).trim().split(/\s+/)[0];
  }

  function initials(user) {
    user = user || getUser();
    if (!user || !user.name) return '?';
    var parts = String(user.name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /** Password strength 0–4 for UI meter */
  function passwordStrength(password) {
    var p = String(password || '');
    var score = 0;
    if (p.length >= 8) score += 1;
    if (p.length >= 12) score += 1;
    if (/[A-Za-z]/.test(p) && /[0-9]/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p) || (/[A-Z]/.test(p) && /[a-z]/.test(p))) score += 1;
    return Math.min(4, score);
  }

  function passwordPolicyError(password) {
    var p = String(password || '');
    if (p.length < 8) return 'Use at least 8 characters.';
    if (!/[A-Za-z]/.test(p)) return 'Include at least one letter.';
    if (!/[0-9]/.test(p)) return 'Include at least one number.';
    return null;
  }

  function resumeHref(kind, id) {
    if (kind === 'projects') {
      return 'projects.html?from=dashboard#' + encodeURIComponent(id);
    }
    if (kind === 'skills') {
      return 'lesson.html?id=' + encodeURIComponent(id) + '&from=dashboard';
    }
    if (kind === 'faculty') return 'index.html#faculty';
    return 'dashboard.html';
  }

  /** Remember that the user came from My learning (for Back crumbs). */
  function markReturnToDashboard() {
    try { sessionStorage.setItem('terrain_return', 'dashboard'); } catch (e) { /* ignore */ }
  }

  function clearReturnToDashboard() {
    try { sessionStorage.removeItem('terrain_return'); } catch (e) { /* ignore */ }
  }

  function shouldReturnToDashboard() {
    try {
      var params = new URLSearchParams(location.search);
      if (params.get('from') === 'dashboard') {
        markReturnToDashboard();
        return true;
      }
      return sessionStorage.getItem('terrain_return') === 'dashboard';
    } catch (e) {
      return false;
    }
  }

  window.TerrainAuth = {
    apiBase: apiBase,
    getToken: getToken,
    getUser: getUser,
    getProgress: getProgressCache,
    isLoggedIn: isLoggedIn,
    isTokenExpired: isTokenExpired,
    firstName: firstName,
    initials: initials,
    passwordStrength: passwordStrength,
    passwordPolicyError: passwordPolicyError,
    resumeHref: resumeHref,
    markReturnToDashboard: markReturnToDashboard,
    clearReturnToDashboard: clearReturnToDashboard,
    shouldReturnToDashboard: shouldReturnToDashboard,
    signup: signup,
    login: login,
    me: me,
    logout: logout,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    updateProfile: updateProfile,
    changePassword: changePassword,
    deleteAccount: deleteAccount,
    setProgressItem: setProgressItem,
    clearProgressItem: clearProgressItem,
    setSession: setSession,
    clearSession: clearSession
  };
})();
