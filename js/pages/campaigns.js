// =============================================
//   campaigns.js — Campaign Manager page
// =============================================

let campaigns          = [];
let activeCampaignId   = null;
let sessions           = [];
let deletedSessionIds  = [];
let currentUserId      = null;
let worldDirty         = false;
let sessionsDirty      = false;
let worldAutosave      = null;
let sessionsAutosave   = null;
let activeCampaignTab  = 'campaign';  // 'campaign' | 'oneshot'

setupDirtyGuard(function () { return worldDirty || sessionsDirty; });

// ── Campaign type helpers ─────────────────────────────────

function getCampaignTypeMap() {
  try {
    return JSON.parse(localStorage.getItem('campaign-type-map-' + currentUserId)) || {};
  } catch (e) { return {}; }
}

function saveCampaignTypeMap(map) {
  localStorage.setItem('campaign-type-map-' + currentUserId, JSON.stringify(map));
}

function getCampaignType(id) {
  return getCampaignTypeMap()[id] || 'campaign';
}

function setCampaignTab(tab, btn) {
  activeCampaignTab = tab;
  document.querySelectorAll('.gen-tab').forEach(function (b) { b.classList.remove('active-gen-tab'); });
  btn.classList.add('active-gen-tab');

  var isOneshot = tab === 'oneshot';
  document.getElementById('selector-heading').textContent = isOneshot ? 'Your One-Shots' : 'Your Campaigns';
  document.getElementById('new-campaign-btn').textContent = isOneshot ? '+ New One-Shot' : '+ New Campaign';

  // Reset selection
  document.getElementById('campaign-select').value = '';
  document.getElementById('campaign-detail').style.display       = 'none';
  document.getElementById('campaign-rename-row').style.display   = 'none';
  document.getElementById('delete-campaign-btn').style.display   = 'none';
  activeCampaignId = null;

  renderCampaignSelect();
}

(async function () {
  try {
    const user = await requireAuth();
    if (!user) return;
    currentUserId = user.id;
    renderNav(user);
    await loadCampaigns();
  } catch (err) {
    showToast('Failed to load campaigns page: ' + err.message, 'error');
  }
})();

// ── Load ───────────────────────────────────────────────────────

async function loadCampaigns() {
  const { data, error } = await db
    .from('campaigns').select('*').eq('user_id', currentUserId).order('created_at');

  document.getElementById('campaign-selector-loading').style.display = 'none';
  document.getElementById('campaign-selector').style.display = '';

  if (error) { showToast('Could not load campaigns: ' + error.message, 'error'); return; }
  campaigns = data || [];
  renderCampaignSelect();

  const saved = localStorage.getItem('active-campaign-' + currentUserId);
  if (saved && campaigns.find(function (c) { return c.id === saved; })) {
    // Switch to correct tab for the saved campaign
    var savedType = getCampaignType(saved);
    if (savedType !== activeCampaignTab) {
      activeCampaignTab = savedType;
      document.querySelectorAll('.gen-tab').forEach(function (b) { b.classList.remove('active-gen-tab'); });
      document.getElementById('tab-' + savedType).classList.add('active-gen-tab');
      var isOneshot = savedType === 'oneshot';
      document.getElementById('selector-heading').textContent = isOneshot ? 'Your One-Shots' : 'Your Campaigns';
      document.getElementById('new-campaign-btn').textContent = isOneshot ? '+ New One-Shot' : '+ New Campaign';
      renderCampaignSelect();
    }
    document.getElementById('campaign-select').value = saved;
    await loadCampaignDetail(saved);
  }
}

function renderCampaignSelect() {
  const sel = document.getElementById('campaign-select');
  const cur = sel.value;
  const typeMap = getCampaignTypeMap();
  const filtered = campaigns.filter(function (c) {
    return (typeMap[c.id] || 'campaign') === activeCampaignTab;
  });
  const placeholder = activeCampaignTab === 'oneshot'
    ? '— Select a one-shot —'
    : '— Select a campaign —';
  sel.innerHTML = '<option value="">' + placeholder + '</option>' +
    filtered.map(function (c) {
      return '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(c.name) + '</option>';
    }).join('');
  if (cur) sel.value = cur;
}

async function switchCampaign() {
  const id = document.getElementById('campaign-select').value;
  if (!id) {
    document.getElementById('campaign-detail').style.display       = 'none';
    document.getElementById('campaign-rename-row').style.display   = 'none';
    document.getElementById('delete-campaign-btn').style.display   = 'none';
    activeCampaignId = null;
    return;
  }
  await loadCampaignDetail(id);
}

async function loadCampaignDetail(id) {
  activeCampaignId = id;
  localStorage.setItem('active-campaign-' + currentUserId, id);

  const campaign = campaigns.find(function (c) { return c.id === id; });
  document.getElementById('campaign-detail').style.display       = '';
  document.getElementById('campaign-rename-row').style.display   = '';
  document.getElementById('delete-campaign-btn').style.display   = '';
  document.getElementById('campaign-name-input').value = campaign ? campaign.name : '';
  document.getElementById('world-notes').value = campaign ? (campaign.world_notes || '') : '';
  worldDirty    = false;
  sessionsDirty = false;
  clearTimeout(worldAutosave);

  ['world-save-status', 'sessions-save-status'].forEach(function (sid) {
    const el = document.getElementById(sid);
    if (el) { el.textContent = ''; el.classList.remove('visible', 'unsaved'); }
  });

  await loadSessions(id);
}

async function loadSessions(campaignId) {
  document.getElementById('session-list').innerHTML =
    '<p class="loading-state"><span class="spinner"></span> Loading sessions…</p>';

  const { data, error } = await db
    .from('sessions')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('session_number');

  if (error) { showToast('Could not load sessions: ' + error.message, 'error'); return; }

  sessions = (data || []).map(function (r) {
    return {
      _id:           r.id,
      sessionNumber: r.session_number,
      title:         r.title || '',
      sessionDate:   r.session_date || '',
      recap:         r.recap || '',
    };
  });
  deletedSessionIds = [];
  sessionsDirty     = false;
  document.getElementById('sessions-save-btn').style.display = 'none';
  renderSessions();
}

// ── Render ─────────────────────────────────────────────────────

function renderSessions() {
  const container = document.getElementById('session-list');
  if (sessions.length === 0) {
    container.innerHTML = '<p class="empty-state">No sessions yet. Log your first one above!</p>';
    return;
  }
  container.innerHTML = sessions.map(function (s, i) {
    return `
      <div class="session-card">
        <div class="session-header">
          <div class="row-actions" style="align-items:flex-end;">
            <div>
              <label>Session #</label>
              <input type="number" value="${escapeHtml(String(s.sessionNumber ?? ''))}" min="1"
                style="width:70px; margin:0;"
                onchange="updateSession(${i}, 'sessionNumber', this.value)" />
            </div>
            <div style="flex:1; min-width:160px;">
              <label>Title</label>
              <input type="text" value="${escapeHtml(s.title)}"
                placeholder="e.g. The Fall of Thornmere"
                style="margin:0;"
                onchange="updateSession(${i}, 'title', this.value)" />
            </div>
            <div>
              <label>Date</label>
              <input type="date" value="${escapeHtml(s.sessionDate)}"
                style="margin:0; width:auto;"
                onchange="updateSession(${i}, 'sessionDate', this.value)" />
            </div>
            <button class="danger" style="padding:5px 10px; font-size:13px;"
              onclick="removeSession(${i})">✕</button>
          </div>
        </div>
        <label style="margin-top:12px; display:block;">Session Recap</label>
        <textarea
          onchange="updateSession(${i}, 'recap', this.value)"
          placeholder="What happened? Key moments, decisions, plot beats…"
          style="min-height:100px; margin-bottom:0;"
        >${escapeHtml(s.recap)}</textarea>
      </div>`;
  }).join('');
}

// ── Create / Rename / Delete Campaign ──────────────────────────

function showCreateCampaign() {
  document.getElementById('new-campaign-row').style.display = '';
  document.getElementById('new-campaign-name').value = '';
  document.getElementById('new-campaign-name').focus();
}

function cancelCreateCampaign() {
  document.getElementById('new-campaign-row').style.display = 'none';
}

async function confirmCreateCampaign() {
  const name = document.getElementById('new-campaign-name').value.trim();
  if (!name) { showToast('Enter a name.', 'error'); return; }
  cancelCreateCampaign();
  const { data, error } = await db
    .from('campaigns')
    .insert({ user_id: currentUserId, name, world_notes: '' })
    .select()
    .single();
  if (error) { showToast('Could not create: ' + error.message, 'error'); return; }

  // Save type
  var typeMap = getCampaignTypeMap();
  typeMap[data.id] = activeCampaignTab;
  saveCampaignTypeMap(typeMap);

  campaigns.push(data);
  renderCampaignSelect();
  document.getElementById('campaign-select').value = data.id;
  await loadCampaignDetail(data.id);
  var label = activeCampaignTab === 'oneshot' ? 'One-shot' : 'Campaign';
  showToast(label + ' "' + data.name + '" created!', 'success');
}

async function renameCampaign() {
  if (!activeCampaignId) return;
  const name = document.getElementById('campaign-name-input').value.trim();
  if (!name) { showToast('Enter a name first.', 'error'); return; }
  const { error } = await db
    .from('campaigns').update({ name }).eq('id', activeCampaignId).eq('user_id', currentUserId);
  if (error) { showToast('Could not rename: ' + error.message, 'error'); return; }
  const idx = campaigns.findIndex(function (c) { return c.id === activeCampaignId; });
  if (idx !== -1) campaigns[idx].name = name;
  renderCampaignSelect();
  document.getElementById('campaign-select').value = activeCampaignId;
  showToast('Renamed to "' + name + '".', 'success');
}

async function deleteCampaign() {
  const campaign = campaigns.find(function (c) { return c.id === activeCampaignId; });
  if (!campaign) return;
  showConfirm({
    title:       'Delete Campaign',
    message:     'Delete "' + campaign.name + '" and all its sessions? This cannot be undone.',
    confirmText: 'Delete',
    danger:      true,
    onConfirm:   async function () {
      const { error } = await db
        .from('campaigns').delete().eq('id', activeCampaignId).eq('user_id', currentUserId);
      if (error) { showToast('Could not delete: ' + error.message, 'error'); return; }
      var tMap = getCampaignTypeMap();
      delete tMap[activeCampaignId];
      saveCampaignTypeMap(tMap);
      campaigns = campaigns.filter(function (c) { return c.id !== activeCampaignId; });
      activeCampaignId = null;
      localStorage.removeItem('active-campaign-' + currentUserId);
      renderCampaignSelect();
      document.getElementById('campaign-select').value = '';
      document.getElementById('campaign-detail').style.display       = 'none';
      document.getElementById('campaign-rename-row').style.display   = 'none';
      document.getElementById('delete-campaign-btn').style.display   = 'none';
      showToast('Campaign deleted.', 'info');
    },
  });
}

// ── World Notes ────────────────────────────────────────────────

function markWorldDirty() {
  worldDirty = true;
  markUnsavedFor('world-save-status');
  clearTimeout(worldAutosave);
  worldAutosave = setTimeout(saveWorldNotes, 3000);
}

async function saveWorldNotes() {
  if (!activeCampaignId) return;
  clearTimeout(worldAutosave);
  const btn   = document.getElementById('world-save-btn');
  const notes = document.getElementById('world-notes').value;
  setButtonLoading(btn, true);
  const { error } = await db
    .from('campaigns').update({ world_notes: notes })
    .eq('id', activeCampaignId).eq('user_id', currentUserId);
  setButtonLoading(btn, false);
  if (error) { showToast('Save failed: ' + error.message, 'error'); return; }
  worldDirty = false;
  showSavedFor('world-save-status');
  const idx = campaigns.findIndex(function (c) { return c.id === activeCampaignId; });
  if (idx !== -1) campaigns[idx].world_notes = notes;
}

// ── Sessions ───────────────────────────────────────────────────

function addSession() {
  const nextNum = sessions.length > 0
    ? Math.max.apply(null, sessions.map(function (s) { return s.sessionNumber || 0; })) + 1
    : 1;
  sessions.unshift({ sessionNumber: nextNum, title: '', sessionDate: '', recap: '' });
  markSessionsDirty();
  renderSessions();
}

function removeSession(index) {
  if (sessions[index]._id) deletedSessionIds.push(sessions[index]._id);
  sessions.splice(index, 1);
  markSessionsDirty();
  renderSessions();
}

function updateSession(index, field, value) {
  if (field === 'sessionNumber') value = parseInt(value) || 1;
  sessions[index][field] = value;
  markSessionsDirty();
}

function markSessionsDirty() {
  sessionsDirty = true;
  document.getElementById('sessions-save-btn').style.display = '';
  markUnsavedFor('sessions-save-status');
  clearTimeout(sessionsAutosave);
  sessionsAutosave = setTimeout(saveSessions, 3000);
}

async function saveSessions() {
  if (!activeCampaignId) return;
  clearTimeout(sessionsAutosave);
  const btn = document.getElementById('sessions-save-btn');
  setButtonLoading(btn, true);

  if (deletedSessionIds.length > 0) {
    const { error } = await db.from('sessions').delete().in('id', deletedSessionIds);
    if (error) { setButtonLoading(btn, false); showToast('Save failed: ' + error.message, 'error'); return; }
  }

  const existing = sessions.filter(function (s) { return  s._id; }).map(function (s) {
    return { id: s._id, campaign_id: activeCampaignId, user_id: currentUserId,
      session_number: s.sessionNumber, title: s.title, session_date: s.sessionDate || null, recap: s.recap };
  });
  const newRows = sessions.filter(function (s) { return !s._id; }).map(function (s) {
    return { campaign_id: activeCampaignId, user_id: currentUserId,
      session_number: s.sessionNumber, title: s.title, session_date: s.sessionDate || null, recap: s.recap };
  });

  const saveOps = [];
  if (existing.length > 0) saveOps.push(db.from('sessions').upsert(existing));
  if (newRows.length  > 0) saveOps.push(db.from('sessions').insert(newRows));

  if (saveOps.length > 0) {
    const results = await Promise.all(saveOps);
    const errors  = results.map(function (r) { return r.error; }).filter(Boolean);
    if (errors.length) {
      setButtonLoading(btn, false);
      showToast('Save failed: ' + errors[0].message, 'error');
      return;
    }
  }

  await loadSessions(activeCampaignId);
  setButtonLoading(btn, false);
  showSavedFor('sessions-save-status');
}
