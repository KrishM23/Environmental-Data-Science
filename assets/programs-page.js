(function () {
  'use strict';

  const programs = window.PROGRAMS || [];
  const internships = window.INTERNSHIPS || [];
  const programImages = window.PROGRAM_IMAGES || {};
  const internshipImages = window.INTERNSHIP_IMAGES || {};
  const guide = window.APPLICATION_GUIDE || {};

  const COMP_ORDER = { highly_competitive: 0, competitive: 1, moderate: 2, not_reported: 3 };
  const COMP_LABELS = {
    highly_competitive: 'Highly competitive',
    competitive: 'Competitive',
    moderate: 'Moderate',
    not_reported: 'Not reported'
  };
  const SECTOR_LABELS = {
    government: 'Government', nonprofit: 'Nonprofit', research: 'Research',
    private: 'Private', ucla: 'UCLA'
  };
  const typeLabels = {
    degree: 'Degree', certificate: 'Certificate', capstone: 'Capstone',
    fellowship: 'Fellowship', research: 'Research', initiative: 'Initiative'
  };
  const audLabels = { undergrad: 'Undergrad', grad: 'Graduate', any: 'Open' };

  /* ---- Tabs ---- */
  const tabs = [
    { btn: document.getElementById('tab-internships'), panel: document.getElementById('panel-internships') },
    { btn: document.getElementById('tab-programs'), panel: document.getElementById('panel-programs') },
    { btn: document.getElementById('tab-guide'), panel: document.getElementById('panel-guide') }
  ];

  function selectTab(index) {
    tabs.forEach((t, i) => {
      const on = i === index;
      t.btn.setAttribute('aria-selected', on ? 'true' : 'false');
      t.btn.tabIndex = on ? 0 : -1;
      if (on) {
        t.panel.removeAttribute('hidden');
      } else {
        t.panel.setAttribute('hidden', '');
      }
    });
    tabs[index].btn.focus();
    history.replaceState(null, '', '#' + tabs[index].panel.id.replace('panel-', ''));
  }

  tabs.forEach((t, i) => {
    t.btn.addEventListener('click', () => selectTab(i));
    t.btn.addEventListener('keydown', e => {
      let next = i;
      if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      else return;
      e.preventDefault();
      selectTab(next);
    });
  });

  const hash = location.hash.replace('#', '');
  const tabIndex = { internships: 0, programs: 1, guide: 2 }[hash];
  if (tabIndex !== undefined) selectTab(tabIndex);

  /* ---- Stats row ---- */
  const statsRow = document.getElementById('statsRow');
  if (statsRow) {
    statsRow.removeAttribute('aria-hidden');
    statsRow.innerHTML =
      '<span class="stat-pill"><strong>' + internships.length + '</strong> internships</span>' +
      '<span class="stat-pill"><strong>' + programs.length + '</strong> UCLA programs</span>' +
      '<span class="stat-pill"><strong>' + internships.filter(i => i.paid).length + '</strong> paid roles</span>';
  }

  /* ---- Guide panel ---- */
  function renderGuide() {
    const el = document.getElementById('guideContent');
    if (!el || !guide.sections) return;
    let html = '<article class="guide-card"><h2>' + esc(guide.title) + '</h2>';
    guide.sections.forEach(s => {
      html += '<h3 style="font-size:17px;font-weight:600;margin:18px 0 8px">' + esc(s.heading) + '</h3>';
      html += '<p>' + s.body + '</p>';
    });
    html += '</article>';

    html += '<article class="guide-card"><h2>Cover letter outline</h2><ol>';
    (guide.coverLetterOutline || []).forEach(item => { html += '<li>' + esc(item) + '</li>'; });
    html += '</ol></article>';

    html += '<article class="guide-card"><h2>Universal essay &amp; interview prompts</h2>';
    html += '<p>Use these to draft cover letters or prepare for interviews. Pick 2\u20133 and answer in 150\u2013250 words each.</p>';
    html += '<ul class="prompt-list">';
    (guide.universalPrompts || []).forEach(p => { html += '<li>' + esc(p) + '</li>'; });
    html += '</ul></article>';

    html += '<article class="guide-card"><h2>Before you apply checklist</h2><ul>';
    [
      'Two Terrain projects (or equivalent notebooks) in a public GitHub repo with READMEs',
      'Resume PDF with project links, not just course titles',
      'Calendar reminders for federal deadlines (Hollings, SULI, DEVELOP) set 2 weeks early',
      'One faculty or mentor who can speak to your quantitative work',
      'Practiced 2-minute verbal summary of your best data project'
    ].forEach(item => { html += '<li>' + esc(item) + '</li>'; });
    html += '</ul><p style="margin-top:14px">New to the toolkit? Start with <a href="skills.html">Skills lessons</a> and <a href="projects.html">starter projects</a>.</p></article>';

    el.innerHTML = html;
  }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  /* ---- UCLA Programs ---- */
  const grid = document.getElementById('grid');
  const countEl = document.getElementById('count');
  const searchEl = document.getElementById('search');
  const searchClear = document.getElementById('searchClear');
  let activeType = 'all';
  let activeAud = 'all';

  function progHaystack(p) {
    return (p.title + ' ' + p.host + ' ' + p.desc + ' ' + p.who + ' ' + p.gain + ' ' + p.keywords + ' ' + p.tags.join(' ')).toLowerCase();
  }

  function matchesSearch(hay, q) {
    if (!q) return true;
    return q.split(/\s+/).filter(Boolean).every(term => {
      if (hay.includes(term)) return true;
      return hay.split(/[^a-z0-9]+/).some(word => word.startsWith(term));
    });
  }

  function cardHTML(p) {
    const audClass = p.audience === 'undergrad' ? 'badge-aud-undergrad'
      : p.audience === 'grad' ? 'badge-aud-grad' : 'badge-aud-any';
    const links = p.links.map((l, i) =>
      '<a class="pbtn' + (l.primary || i === 0 ? ' pbtn-primary' : '') + '" href="' + l.url + '"' +
      (l.url.startsWith('http') ? ' target="_blank" rel="noopener"' : '') + '>' +
      esc(l.label) + (l.url.startsWith('http') ? ' \u2197' : '') + '</a>'
    ).join('');
    const img = programImages[p.title];
    let logoClass = '';
    if (img && img.endsWith('.png')) logoClass = img.includes('ucla-seal') ? ' pcard-thumb--seal' : ' pcard-thumb--logo';
    const thumb = img ? '<img class="pcard-thumb' + logoClass + '" src="' + img + '" alt="" loading="lazy" width="72" height="72">' : '';
    return '<article class="pcard">' +
      '<div class="pcard-top"><div class="pcard-head">' + thumb +
      '<div><h2 class="pcard-title">' + esc(p.title) + '</h2><div class="pcard-host">' + esc(p.host) + '</div></div></div>' +
      '<div class="pcard-badges"><span class="badge badge-type">' + typeLabels[p.type] + '</span>' +
      '<span class="badge ' + audClass + '">' + audLabels[p.audience] + '</span></div></div>' +
      '<p class="pcard-desc">' + p.desc + '</p>' +
      '<dl class="pcard-details">' +
      '<div class="detail"><dt>Who it\u2019s for</dt><dd>' + p.who + '</dd></div>' +
      '<div class="detail"><dt>Time commitment</dt><dd>' + p.time + '</dd></div>' +
      '<div class="detail"><dt>What you\u2019ll gain</dt><dd>' + p.gain + '</dd></div>' +
      '<div class="detail"><dt>When to apply</dt><dd>' + p.apply + '</dd></div></dl>' +
      '<div class="pcard-tags">' + p.tags.map(t => '<span class="ptag">' + esc(t) + '</span>').join('') + '</div>' +
      '<div class="pcard-foot">' + links + '</div></article>';
  }

  function resetProgFilters() {
    activeType = 'all';
    activeAud = 'all';
    searchEl.value = '';
    document.querySelectorAll('#typeFilters .chip').forEach(c => c.classList.toggle('active', c.dataset.type === 'all'));
    document.querySelectorAll('#audFilters .chip').forEach(c => c.classList.toggle('active', c.dataset.aud === 'all'));
    renderPrograms();
  }

  function renderPrograms() {
    const q = searchEl.value.trim().toLowerCase();
    searchClear.classList.toggle('visible', q.length > 0);
    const list = programs.filter(p =>
      (activeType === 'all' || p.type === activeType) &&
      (activeAud === 'all' || p.audience === activeAud || p.audience === 'any') &&
      matchesSearch(progHaystack(p), q)
    );
    const filtered = list.length !== programs.length || q || activeType !== 'all' || activeAud !== 'all';
    countEl.textContent = filtered
      ? 'Showing ' + list.length + ' of ' + programs.length + ' programs'
      : programs.length + ' programs';

    if (list.length === 0) {
      grid.innerHTML = '<div class="empty"><strong>No programs match.</strong><br>Try a broader search or reset filters.' +
        '<br><button type="button" id="resetProgFilters">Reset search &amp; filters</button></div>';
      document.getElementById('resetProgFilters')?.addEventListener('click', resetProgFilters);
      return;
    }
    grid.innerHTML = list.map(cardHTML).join('');
  }

  document.getElementById('typeFilters')?.addEventListener('click', e => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    document.querySelectorAll('#typeFilters .chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    activeType = btn.dataset.type;
    renderPrograms();
  });

  document.getElementById('audFilters')?.addEventListener('click', e => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    document.querySelectorAll('#audFilters .chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    activeAud = btn.dataset.aud;
    renderPrograms();
  });

  searchEl?.addEventListener('input', renderPrograms);
  searchClear?.addEventListener('click', () => { searchEl.value = ''; renderPrograms(); searchEl.focus(); });

  /* ---- Internships ---- */
  const internGrid = document.getElementById('internGrid');
  const internCount = document.getElementById('internCount');
  const internSearch = document.getElementById('internSearch');
  const internSearchClear = document.getElementById('internSearchClear');
  const internSort = document.getElementById('internSort');
  const filterToggle = document.getElementById('filterToggle');
  const filterPanel = document.getElementById('internFilterPanel');
  const filterCountEl = document.getElementById('filterCount');
  const clearInternBtn = document.getElementById('clearInternFilters');

  let internPaid = 'all';
  let internRemote = 'all';
  let internAud = 'all';
  let internSector = 'all';

  function internHaystack(i) {
    return (i.title + ' ' + i.organization + ' ' + i.desc + ' ' + i.keywords +
      ' ' + i.skills.join(' ') + ' ' + i.location + ' ' + i.payNote).toLowerCase();
  }

  function compBadgeClass(tier) {
    if (tier === 'highly_competitive') return 'badge-comp-high';
    if (tier === 'competitive') return 'badge-comp-mid';
    return 'badge-comp-low';
  }

  function deadlineSoon(sortDate) {
    if (!sortDate) return false;
    const d = new Date(sortDate);
    const now = new Date();
    const diff = (d - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 90;
  }

  function internCardHTML(i) {
    const img = internshipImages[i.id];
    let logoClass = '';
    if (img && (img.endsWith('.png') || img.endsWith('.svg'))) {
      logoClass = img.includes('ucla-seal') ? ' pcard-thumb--seal' : ' pcard-thumb--logo';
    }
    const thumb = img ? '<img class="pcard-thumb' + logoClass + '" src="' + img + '" alt="" loading="lazy" width="72" height="72">' : '';

    const audClass = i.audience === 'undergrad' ? 'badge-aud-undergrad'
      : i.audience === 'grad' ? 'badge-aud-grad' : 'badge-aud-any';

    const soon = deadlineSoon(i.deadlineSort);
    const deadlineText = i.deadlineLabel + (i.deadlines[0]?.monthDay ? ' \u00b7 next ~' + i.deadlines[0].monthDay : '');
    const remoteLabel = i.remote.charAt(0).toUpperCase() + i.remote.slice(1);

    const links = i.links.map((l, idx) =>
      '<a class="pbtn' + (l.primary || idx === 0 ? ' pbtn-primary' : '') + '" href="' + l.url + '" target="_blank" rel="noopener">' +
      esc(l.label) + ' \u2197</a>'
    ).join('');

    const bodyId = 'intern-body-' + i.id;
    const btnId = 'intern-btn-' + i.id;

    let deadlineRows = '';
    if (i.deadlines && i.deadlines.length) {
      deadlineRows = '<table class="deadline-table"><thead><tr><th scope="col">Cycle</th><th scope="col">Typical date</th><th scope="col">Note</th></tr></thead><tbody>';
      i.deadlines.forEach(d => {
        deadlineRows += '<tr><td>' + esc(d.cycle) + '</td><td>' + (d.monthDay ? esc(d.monthDay) : '\u2014') + '</td><td>' + esc(d.note || '') + '</td></tr>';
      });
      deadlineRows += '</tbody></table>';
    }

    return '<article class="icard" aria-labelledby="intern-title-' + i.id + '">' +
      '<div class="icard-summary">' +
      '<div class="icard-deadline' + (soon ? ' icard-deadline--soon' : '') + '">' +
      '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.5" stroke="currentColor"/><path d="M8 4.5V8l2.5 1.5" stroke="currentColor" stroke-linecap="round"/></svg>' +
      esc(deadlineText) + (soon ? ' <span>(within 90 days)</span>' : '') + '</div>' +
      '<div class="pcard-top"><div class="pcard-head">' + thumb +
      '<div><h2 class="pcard-title" id="intern-title-' + i.id + '">' + esc(i.title) + '</h2>' +
      '<div class="pcard-host">' + esc(i.organization) + '</div></div></div>' +
      '<div class="pcard-badges">' +
      '<span class="badge ' + (i.paid ? 'badge-paid' : 'badge-unpaid') + '">' + (i.paid ? 'Paid' : 'Unpaid') + '</span>' +
      '<span class="badge ' + audClass + '">' + audLabels[i.audience] + '</span>' +
      '<span class="badge ' + compBadgeClass(i.acceptanceTier) + '">' + COMP_LABELS[i.acceptanceTier] + '</span></div></div>' +
      '<p class="pcard-desc">' + i.desc + '</p>' +
      '<div class="icard-skills" aria-label="Skills">' + i.skills.map(s => '<span class="skill-tag">' + esc(s) + '</span>').join('') + '</div>' +
      '<dl class="pcard-details">' +
      '<div class="detail"><dt>Duration</dt><dd>' + esc(i.duration) + '</dd></div>' +
      '<div class="detail"><dt>Location</dt><dd>' + esc(i.location) + ' \u00b7 ' + esc(remoteLabel) + '</dd></div>' +
      '<div class="detail"><dt>Sector</dt><dd>' + esc(SECTOR_LABELS[i.sector]) + '</dd></div>' +
      '<div class="detail"><dt>Compensation</dt><dd>' + esc(i.payNote) + '</dd></div>' +
      '<div class="detail"><dt>Acceptance</dt><dd>' + esc(COMP_LABELS[i.acceptanceTier]) +
      '<div class="accept-note">' + i.acceptanceNote + '</div></dd></div></dl>' +
      '<div class="pcard-foot" style="margin-bottom:12px">' + links + '</div>' +
      '<button type="button" class="expand-btn" id="' + btnId + '" aria-expanded="false" aria-controls="' + bodyId + '">' +
      'Application details &amp; prompts' +
      '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 4.5 6 8 9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>' +
      '</div>' +
      '<div class="icard-body" id="' + bodyId + '" hidden>' +
      '<div class="icard-body-inner">' +
      '<div class="icard-section"><h3>Application deadlines</h3>' + deadlineRows + '</div>' +
      '<div class="icard-section"><h3>What you\u2019ll do</h3><ul>' + i.responsibilities.map(r => '<li>' + r + '</li>').join('') + '</ul></div>' +
      '<div class="icard-section"><h3>Qualifications</h3><ul>' + i.qualifications.map(q => '<li>' + q + '</li>').join('') + '</ul></div>' +
      '<div class="icard-section"><h3>How to apply</h3><ol>' + i.howToApply.map(s => '<li>' + s + '</li>').join('') + '</ol></div>' +
      '<div class="icard-section"><h3>Application tips</h3><ul>' + i.tips.map(t => '<li>' + t + '</li>').join('') + '</ul></div>' +
      '<div class="icard-section"><h3>Essay &amp; interview prompts</h3><p>Practice answering these in writing before you submit:</p>' +
      i.prompts.map(p => '<div class="prompt-box">' + esc(p) + '</div>').join('') + '</div>' +
      '</div></div></article>';
  }

  function sortInterns(list) {
    const mode = internSort?.value || 'deadline';
    const sorted = list.slice();
    if (mode === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (mode === 'competitive') {
      sorted.sort((a, b) => (COMP_ORDER[a.acceptanceTier] ?? 9) - (COMP_ORDER[b.acceptanceTier] ?? 9));
    } else {
      sorted.sort((a, b) => {
        if (!a.deadlineSort && !b.deadlineSort) return a.title.localeCompare(b.title);
        if (!a.deadlineSort) return 1;
        if (!b.deadlineSort) return -1;
        return a.deadlineSort.localeCompare(b.deadlineSort);
      });
    }
    return sorted;
  }

  function resetInternFilters() {
    internPaid = 'all';
    internRemote = 'all';
    internAud = 'all';
    internSector = 'all';
    internSearch.value = '';
    if (internSort) internSort.value = 'deadline';
    ['paidFilters', 'remoteFilters', 'internAudFilters', 'sectorFilters'].forEach(id => {
      const key = id === 'internAudFilters' ? 'aud' : id === 'paidFilters' ? 'paid' : id === 'remoteFilters' ? 'remote' : 'sector';
      document.querySelectorAll('#' + id + ' .chip').forEach(c => c.classList.toggle('active', c.dataset[key] === 'all'));
    });
    renderInternships();
  }

  function updateFilterBadge() {
    const active = [internPaid, internRemote, internAud, internSector].filter(v => v !== 'all').length;
    if (!filterCountEl) return;
    if (active > 0) {
      filterCountEl.textContent = String(active);
      filterCountEl.hidden = false;
    } else {
      filterCountEl.hidden = true;
    }
  }

  function renderInternships() {
    const q = internSearch.value.trim().toLowerCase();
    internSearchClear.classList.toggle('visible', q.length > 0);
    updateFilterBadge();

    let list = internships.filter(i => {
      if (internPaid === 'paid' && !i.paid) return false;
      if (internPaid === 'unpaid' && i.paid) return false;
      if (internRemote !== 'all' && i.remote !== internRemote) return false;
      if (internAud !== 'all' && i.audience !== internAud && i.audience !== 'any') return false;
      if (internSector !== 'all' && i.sector !== internSector) return false;
      return matchesSearch(internHaystack(i), q);
    });

    list = sortInterns(list);

    const filtered = list.length !== internships.length || q ||
      internPaid !== 'all' || internRemote !== 'all' || internAud !== 'all' || internSector !== 'all';

    internCount.textContent = filtered
      ? 'Showing ' + list.length + ' of ' + internships.length + ' internships & fellowships'
      : internships.length + ' internships & fellowships';

    if (list.length === 0) {
      internGrid.innerHTML = '<div class="empty"><strong>No internships match.</strong><br>Try fewer filters or a broader search.' +
        '<br><button type="button" id="resetInternFilters">Reset search &amp; filters</button></div>';
      document.getElementById('resetInternFilters')?.addEventListener('click', resetInternFilters);
      return;
    }

    internGrid.innerHTML = list.map(internCardHTML).join('');

    internGrid.querySelectorAll('.expand-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const body = document.getElementById(btn.getAttribute('aria-controls'));
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        if (expanded) {
          body.setAttribute('hidden', '');
        } else {
          body.removeAttribute('hidden');
        }
      });
    });
  }

  function wireChips(containerId, dataKey, stateKey) {
    document.getElementById(containerId)?.addEventListener('click', e => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      document.querySelectorAll('#' + containerId + ' .chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      if (stateKey === 'internPaid') internPaid = btn.dataset.paid;
      else if (stateKey === 'internRemote') internRemote = btn.dataset.remote;
      else if (stateKey === 'internAud') internAud = btn.dataset.aud;
      else if (stateKey === 'internSector') internSector = btn.dataset.sector;
      renderInternships();
    });
  }

  wireChips('paidFilters', 'paid', 'internPaid');
  wireChips('remoteFilters', 'remote', 'internRemote');
  wireChips('internAudFilters', 'aud', 'internAud');
  wireChips('sectorFilters', 'sector', 'internSector');

  internSearch?.addEventListener('input', renderInternships);
  internSearchClear?.addEventListener('click', () => { internSearch.value = ''; renderInternships(); internSearch.focus(); });
  internSort?.addEventListener('change', renderInternships);

  filterToggle?.addEventListener('click', () => {
    const open = filterToggle.getAttribute('aria-expanded') === 'true';
    filterToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    if (open) { filterPanel.setAttribute('hidden', ''); } else { filterPanel.removeAttribute('hidden'); }
  });

  clearInternBtn?.addEventListener('click', () => {
    resetInternFilters();
    filterToggle?.focus();
  });

  renderGuide();
  renderPrograms();
  renderInternships();
})();
