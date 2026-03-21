// =============================================
//   campaigns.js - Campaign Manager page
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
    ? '- Select a one-shot -'
    : '- Select a campaign -';
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

  await Promise.all([loadSessions(id), loadCampaignOverview(id)]);
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
          <div style="display:grid; grid-template-columns:70px 1fr auto auto; gap:10px;">
            <div>
              <label>Session #</label>
              <input type="number" value="${escapeHtml(String(s.sessionNumber ?? ''))}" min="1"
                style="margin:0;"
                onchange="updateSession(${i}, 'sessionNumber', this.value)" />
            </div>
            <div>
              <label>Title</label>
              <input type="text" value="${escapeHtml(s.title)}"
                placeholder="e.g. The Fall of Thornmere"
                style="margin:0;"
                onchange="updateSession(${i}, 'title', this.value)" />
            </div>
            <div>
              <label>Date</label>
              <input type="date" value="${escapeHtml(s.sessionDate)}"
                style="margin:0;"
                onchange="updateSession(${i}, 'sessionDate', this.value)" />
            </div>
            <div>
              <label style="visibility:hidden;">&nbsp;</label>
              <button class="danger btn-x" style="width:100%;"
                onclick="removeSession(${i})">✕</button>
            </div>
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

// ── Campaign Overview (Party, NPCs, Notes) ──────────────

async function loadCampaignOverview(campaignId) {
  var loadingEl = document.getElementById('campaign-overview-loading');
  var contentEl = document.getElementById('campaign-overview');
  loadingEl.style.display = '';
  contentEl.style.display = 'none';

  // Fetch players, NPCs, creatures, and notes in parallel
  var results = await Promise.all([
    db.from('players').select('*').eq('user_id', currentUserId),
    db.from('npcs').select('*').eq('user_id', currentUserId),
    db.from('creatures').select('*').eq('user_id', currentUserId),
    db.from('session_notes').select('*').eq('user_id', currentUserId).eq('campaign_id', campaignId).maybeSingle()
  ]);

  loadingEl.style.display = 'none';
  contentEl.style.display = '';

  var allPlayers  = (results[0].data || []);
  var allNpcs     = (results[1].data || []);
  var allCreatures = (results[2].data || []);
  var noteData    = results[3].data;

  // Filter by campaign using localStorage maps
  var playerMap = {};
  try { playerMap = JSON.parse(localStorage.getItem('player-campaign-map-' + currentUserId)) || {}; } catch (e) {}
  var charMap = {};
  try { charMap = JSON.parse(localStorage.getItem('char-campaign-map-' + currentUserId)) || {}; } catch (e) {}

  var campaignPlayers = allPlayers.filter(function (p) { return playerMap[p.id] === campaignId; });
  var campaignNpcs = allNpcs.filter(function (n) { return charMap['npc:' + n.id] === campaignId; });
  var campaignCreatures = allCreatures.filter(function (c) { return charMap['creature:' + c.id] === campaignId; });

  // Render players
  renderOverviewPlayers(campaignPlayers);
  renderOverviewNpcs(campaignNpcs);
  renderOverviewCreatures(campaignCreatures);
  renderOverviewNotes(noteData);
}

function renderOverviewPlayers(list) {
  var el = document.getElementById('overview-players');
  if (list.length === 0) {
    el.innerHTML = '<p class="overview-empty">No players assigned to this campaign.</p>' +
      '<a href="players.html" class="overview-link">Go to Players to assign them</a>';
    return;
  }
  el.innerHTML = list.map(function (p) {
    return '<div class="overview-chip">' +
      '<span class="chip-name">' + escapeHtml(p.char_name || 'Unnamed') + '</span>' +
      '<span class="chip-sub">' + escapeHtml(p.player_name || '') + '</span>' +
      '<span class="chip-sub">' + escapeHtml((p.race || '') + ' ' + (p.char_class || '')) + '</span>' +
      '<div class="chip-stats">' +
        '<span>Lvl ' + escapeHtml(String(p.level || '?')) + '</span>' +
        '<span>HP ' + escapeHtml(String(p.hp || '?')) + '</span>' +
        '<span>AC ' + escapeHtml(String(p.ac || '?')) + '</span>' +
        '<span>PP ' + escapeHtml(String(p.passive_perception || '?')) + '</span>' +
      '</div>' +
      '<a href="charsheet.html?player=' + p.id + '" class="overview-link" style="margin-top:6px;">Character Sheet</a>' +
    '</div>';
  }).join('') +
  '<a href="players.html" class="overview-link">Manage Players</a>';
}

function renderOverviewNpcs(list) {
  var el = document.getElementById('overview-npcs');
  if (list.length === 0) {
    el.innerHTML = '<p class="overview-empty">No NPCs assigned to this campaign.</p>' +
      '<a href="characters.html" class="overview-link">Go to Characters to assign them</a>';
    return;
  }
  el.innerHTML = list.map(function (n) {
    return '<div class="overview-chip">' +
      '<span class="chip-name">' + escapeHtml(n.name || 'Unnamed NPC') + '</span>' +
      '<div class="chip-stats">' +
        '<span>HP ' + escapeHtml(String(n.hp || '?')) + '</span>' +
        '<span>AC ' + escapeHtml(String(n.ac || '?')) + '</span>' +
      '</div>' +
      (n.notes ? '<span class="chip-sub" style="margin-top:4px;">' + escapeHtml(n.notes.substring(0, 60)) + (n.notes.length > 60 ? '...' : '') + '</span>' : '') +
    '</div>';
  }).join('') +
  '<a href="characters.html" class="overview-link">Manage NPCs</a>';
}

function renderOverviewCreatures(list) {
  var el = document.getElementById('overview-creatures');
  if (list.length === 0) {
    el.innerHTML = '<p class="overview-empty">No creatures assigned to this campaign.</p>' +
      '<a href="characters.html" class="overview-link">Go to Characters to assign them</a>';
    return;
  }
  el.innerHTML = list.map(function (c) {
    return '<div class="overview-chip">' +
      '<span class="chip-name">' + escapeHtml(c.name || 'Unnamed Creature') + '</span>' +
      '<div class="chip-stats">' +
        '<span>CR ' + escapeHtml(String(c.cr || '?')) + '</span>' +
        '<span>HP ' + escapeHtml(String(c.hp || '?')) + '</span>' +
        '<span>AC ' + escapeHtml(String(c.ac || '?')) + '</span>' +
      '</div>' +
      (c.notes ? '<span class="chip-sub" style="margin-top:4px;">' + escapeHtml(c.notes.substring(0, 60)) + (c.notes.length > 60 ? '...' : '') + '</span>' : '') +
    '</div>';
  }).join('') +
  '<a href="characters.html" class="overview-link">Manage Creatures</a>';
}

function renderOverviewNotes(note) {
  var el = document.getElementById('overview-notes');
  if (!note) {
    el.innerHTML = '<p class="overview-empty">No session notes for this campaign yet.</p>' +
      '<a href="notes.html" class="overview-link">Go to Notes to start writing</a>';
    return;
  }
  var parts = [];
  if (note.title) parts.push('<div class="note-title">' + escapeHtml(note.title) + '</div>');
  if (note.story) parts.push('<div class="note-snippet"><strong>Story:</strong> ' + escapeHtml(note.story.substring(0, 120)) + (note.story.length > 120 ? '...' : '') + '</div>');
  if (note.locations) parts.push('<div class="note-snippet"><strong>Locations:</strong> ' + escapeHtml(note.locations.substring(0, 80)) + (note.locations.length > 80 ? '...' : '') + '</div>');
  if (note.dm_notes) parts.push('<div class="note-snippet"><strong>DM Notes:</strong> ' + escapeHtml(note.dm_notes.substring(0, 80)) + (note.dm_notes.length > 80 ? '...' : '') + '</div>');

  el.innerHTML = '<div class="overview-notes-preview">' + parts.join('') + '</div>' +
    '<a href="notes.html" class="overview-link">Open Full Notes</a>';
}
