// =============================================
//   notes.js - Session Notes page (rich DM prep)
// =============================================

let currentUserId    = null;
let activeCampaignId = null;
let currentNoteId    = null;
let isDirty          = false;
let autosaveTimer    = null;

// Extra structured data (localStorage)
let extraData = {
  players: '', playtime: '', tone: '', goal: '',
  scenes: [], npcs: [], items: [], mechanics: ''
};

setupDirtyGuard(function () { return isDirty; });

(async function () {
  try {
    var user = await requireAuth();
    if (!user) return;
    currentUserId = user.id;
    renderNav(user);
    await loadCampaigns();
    await loadNotesForCampaign();
  } catch (err) {
    showToast('Failed to load notes page: ' + err.message, 'error');
  }
})();

// ── Campaign selector ─────────────────────────────────────

async function loadCampaigns() {
  var result = await db
    .from('campaigns')
    .select('id, name')
    .eq('user_id', currentUserId)
    .order('created_at');

  var sel = document.getElementById('notes-campaign');
  var typeMap = {};
  try { typeMap = JSON.parse(localStorage.getItem('campaign-type-map-' + currentUserId)) || {}; } catch (e) {}
  (result.data || []).forEach(function (c) {
    var opt = document.createElement('option');
    opt.value       = c.id;
    opt.textContent = c.name + (typeMap[c.id] === 'oneshot' ? ' (one-shot)' : '');
    sel.appendChild(opt);
  });

  var stored = localStorage.getItem('notes-campaign-' + currentUserId);
  if (stored) {
    var exists = Array.from(sel.options).some(function (o) { return o.value === stored; });
    if (exists) {
      sel.value        = stored;
      activeCampaignId = stored || null;
    }
  }
}

function switchCampaign() {
  var val   = document.getElementById('notes-campaign').value;
  var newId = val === '' ? null : val;
  clearTimeout(autosaveTimer);
  autosaveTimer = null;
  isDirty = false;
  activeCampaignId = newId;
  currentNoteId    = null;
  localStorage.setItem('notes-campaign-' + currentUserId, val);
  loadNotesForCampaign();
}

// ── Extra data (localStorage) ─────────────────────────────

function extraKey() {
  return 'dm-notes-extra-' + currentUserId + '-' + (activeCampaignId || 'general');
}

function loadExtra() {
  try {
    extraData = JSON.parse(localStorage.getItem(extraKey())) || {};
  } catch (e) { extraData = {}; }
  if (!extraData.scenes) extraData.scenes = [];
  if (!extraData.npcs) extraData.npcs = [];
  if (!extraData.items) extraData.items = [];
  if (!extraData.mechanics) extraData.mechanics = '';
  if (!extraData.players) extraData.players = '';
  if (!extraData.playtime) extraData.playtime = '';
  if (!extraData.tone) extraData.tone = '';
  if (!extraData.goal) extraData.goal = '';
}

function saveExtra() {
  gatherExtra();
  localStorage.setItem(extraKey(), JSON.stringify(extraData));
}

function gatherExtra() {
  extraData.players  = document.getElementById('note-players').value;
  extraData.playtime = document.getElementById('note-playtime').value;
  extraData.tone     = document.getElementById('note-tone').value;
  extraData.goal     = document.getElementById('note-goal').value;
  extraData.mechanics = document.getElementById('note-mechanics').value;
  extraData.scenes = gatherScenes();
  extraData.npcs = gatherNpcs();
  extraData.items = gatherItems();
}

// ── Load / Save ───────────────────────────────────────────

async function loadNotesForCampaign() {
  document.getElementById('notes-loading').style.display = 'flex';
  document.getElementById('notes-form').style.display    = 'none';

  var query = db.from('session_notes').select('*').eq('user_id', currentUserId);
  if (activeCampaignId === null) {
    query = query.is('campaign_id', null);
  } else {
    query = query.eq('campaign_id', activeCampaignId);
  }
  var result = await query.maybeSingle();

  document.getElementById('notes-loading').style.display = 'none';
  document.getElementById('notes-form').style.display    = 'block';

  if (result.error) { showToast('Could not load notes: ' + result.error.message, 'error'); return; }

  var data = result.data;
  if (data) {
    currentNoteId = data.id;
    document.getElementById('session-title').value = data.title     || '';
    document.getElementById('story').value         = data.story     || '';
    document.getElementById('locations').value     = data.locations || '';
    document.getElementById('dm-notes').value      = data.dm_notes  || '';
  } else {
    currentNoteId = null;
    document.getElementById('session-title').value = '';
    document.getElementById('story').value         = '';
    document.getElementById('locations').value     = '';
    document.getElementById('dm-notes').value      = '';
  }

  // Load extra structured data
  loadExtra();
  document.getElementById('note-players').value  = extraData.players;
  document.getElementById('note-playtime').value = extraData.playtime;
  document.getElementById('note-tone').value     = extraData.tone;
  document.getElementById('note-goal').value     = extraData.goal;
  document.getElementById('note-mechanics').value = extraData.mechanics;
  renderScenes();
  renderNpcs();
  renderItems();

  isDirty = false;
}

function markDirty() {
  isDirty = true;
  markUnsaved();
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(saveNotes, 2500);
}

function markExtraDirty() {
  isDirty = true;
  markUnsaved();
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(saveNotes, 2500);
}

async function saveNotes() {
  clearTimeout(autosaveTimer);
  var btn = document.getElementById('save-btn');
  setButtonLoading(btn, true);

  var payload = {
    user_id:     currentUserId,
    campaign_id: activeCampaignId,
    title:       document.getElementById('session-title').value,
    story:       document.getElementById('story').value,
    locations:   document.getElementById('locations').value,
    dm_notes:    document.getElementById('dm-notes').value,
    updated_at:  new Date().toISOString()
  };

  var error;
  if (currentNoteId) {
    var res = await db.from('session_notes').update(payload).eq('id', currentNoteId);
    error = res.error;
  } else {
    var res2 = await db.from('session_notes').insert(payload).select('id').single();
    error = res2.error;
    if (!error && res2.data) currentNoteId = res2.data.id;
  }

  // Save extra data to localStorage
  saveExtra();

  setButtonLoading(btn, false);
  if (error) {
    showToast('Save failed: ' + error.message, 'error');
  } else {
    isDirty = false;
    showSaved();
  }
}

// ── Reset / Delete ────────────────────────────────────────

function resetNotes() {
  showConfirm({
    title: 'Reset Notes',
    message: 'Clear all content? This will be saved immediately.',
    confirmText: 'Reset',
    danger: true,
    onConfirm: function () {
      document.getElementById('session-title').value = '';
      document.getElementById('story').value         = '';
      document.getElementById('locations').value     = '';
      document.getElementById('dm-notes').value      = '';
      document.getElementById('note-players').value  = '';
      document.getElementById('note-playtime').value = '';
      document.getElementById('note-tone').value     = '';
      document.getElementById('note-goal').value     = '';
      document.getElementById('note-mechanics').value = '';
      extraData = { players:'', playtime:'', tone:'', goal:'', scenes:[], npcs:[], items:[], mechanics:'' };
      renderScenes();
      renderNpcs();
      renderItems();
      isDirty = true;
      saveNotes();
    }
  });
}

function deleteNotes() {
  if (!currentNoteId) { showToast('No saved note to delete.', 'info'); return; }
  showConfirm({
    title: 'Delete Notes',
    message: 'Permanently delete this note? This cannot be undone.',
    confirmText: 'Delete',
    danger: true,
    onConfirm: async function () {
      var result = await db.from('session_notes').delete().eq('id', currentNoteId);
      if (result.error) { showToast('Delete failed: ' + result.error.message, 'error'); return; }
      currentNoteId = null;
      isDirty = false;
      localStorage.removeItem(extraKey());
      document.getElementById('session-title').value = '';
      document.getElementById('story').value         = '';
      document.getElementById('locations').value     = '';
      document.getElementById('dm-notes').value      = '';
      document.getElementById('note-players').value  = '';
      document.getElementById('note-playtime').value = '';
      document.getElementById('note-tone').value     = '';
      document.getElementById('note-goal').value     = '';
      document.getElementById('note-mechanics').value = '';
      extraData = { players:'', playtime:'', tone:'', goal:'', scenes:[], npcs:[], items:[], mechanics:'' };
      renderScenes();
      renderNpcs();
      renderItems();
      showToast('Notes deleted.', 'success');
    }
  });
}

// ── Section toggle ────────────────────────────────────────

function toggleSection(id) {
  var body = document.getElementById('body-' + id);
  var arrow = document.getElementById('arrow-' + id);
  if (body.style.display === 'none') {
    body.style.display = '';
    arrow.innerHTML = '&#9662;';
  } else {
    body.style.display = 'none';
    arrow.innerHTML = '&#9656;';
  }
}

// ── Scenes ────────────────────────────────────────────────

function addScene() {
  gatherExtra();
  extraData.scenes.push({ name: '', readAloud: '', dmNotes: '', challenges: '', rewards: '' });
  renderScenes();
  markExtraDirty();
}

function removeScene(idx) {
  gatherExtra();
  extraData.scenes.splice(idx, 1);
  renderScenes();
  markExtraDirty();
}

function renderScenes() {
  var el = document.getElementById('scenes-list');
  if (extraData.scenes.length === 0) {
    el.innerHTML = '<p class="empty-state">No scenes yet. Add your first scene above.</p>';
    return;
  }
  el.innerHTML = extraData.scenes.map(function (s, i) {
    return '<div class="scene-block">' +
      '<div class="scene-header">' +
        '<input type="text" class="scene-name" value="' + escapeHtml(s.name) + '" placeholder="Scene ' + (i+1) + ' name (e.g. Dormitory Vignettes)" oninput="markExtraDirty()" />' +
        '<button class="danger" onclick="removeScene(' + i + ')" style="padding:4px 10px; font-size:12px;">x</button>' +
      '</div>' +
      '<label>Read-Aloud Text <span style="color:var(--text-dim); font-size:11px;">(narrate to players)</span></label>' +
      '<textarea class="scene-readaloud" oninput="markExtraDirty()" placeholder="The crimson glow flickers... Describe what the players see, hear, and feel.">' + escapeHtml(s.readAloud) + '</textarea>' +
      '<label>DM Notes <span style="color:var(--text-dim); font-size:11px;">(behind the screen)</span></label>' +
      '<textarea class="scene-dmnotes" oninput="markExtraDirty()" placeholder="Focus, theme, goal, time pressure, NPC behavior...">' + escapeHtml(s.dmNotes) + '</textarea>' +
      '<label>Challenges & DCs</label>' +
      '<textarea class="scene-challenges" oninput="markExtraDirty()" placeholder="Investigation DC 12 - spot the leader&#10;Arcana DC 14 - dispel the animation&#10;Success: They gain the Clue Token&#10;Failure: Lose 5 minutes (+1 tick)">' + escapeHtml(s.challenges) + '</textarea>' +
      '<label>Rewards</label>' +
      '<textarea class="scene-rewards" oninput="markExtraDirty()" placeholder="Clue Token: Creature Whisper&#10;Resin Shard of Ward-Binding&#10;50 XP each">' + escapeHtml(s.rewards) + '</textarea>' +
    '</div>';
  }).join('');
}

function gatherScenes() {
  var scenes = [];
  var blocks = document.querySelectorAll('.scene-block');
  blocks.forEach(function (block) {
    scenes.push({
      name:       block.querySelector('.scene-name').value,
      readAloud:  block.querySelector('.scene-readaloud').value,
      dmNotes:    block.querySelector('.scene-dmnotes').value,
      challenges: block.querySelector('.scene-challenges').value,
      rewards:    block.querySelector('.scene-rewards').value,
    });
  });
  return scenes;
}

// ── NPCs ──────────────────────────────────────────────────

function addNpcNote() {
  gatherExtra();
  extraData.npcs.push({ name: '', role: '', notes: '' });
  renderNpcs();
  markExtraDirty();
}

function removeNpcNote(idx) {
  gatherExtra();
  extraData.npcs.splice(idx, 1);
  renderNpcs();
  markExtraDirty();
}

function renderNpcs() {
  var el = document.getElementById('npcs-list');
  if (extraData.npcs.length === 0) {
    el.innerHTML = '<p class="empty-state">No NPCs added yet.</p>';
    return;
  }
  el.innerHTML = extraData.npcs.map(function (n, i) {
    return '<div class="npc-note-block">' +
      '<div class="scene-header">' +
        '<input type="text" class="npc-note-name" value="' + escapeHtml(n.name) + '" placeholder="NPC name (e.g. Dumbledore)" oninput="markExtraDirty()" style="flex:1;" />' +
        '<input type="text" class="npc-note-role" value="' + escapeHtml(n.role) + '" placeholder="Role (e.g. Quest giver)" oninput="markExtraDirty()" style="flex:1;" />' +
        '<button class="danger" onclick="removeNpcNote(' + i + ')" style="padding:4px 10px; font-size:12px;">x</button>' +
      '</div>' +
      '<textarea class="npc-note-notes" oninput="markExtraDirty()" placeholder="Personality, key info, what they know, how they react...">' + escapeHtml(n.notes) + '</textarea>' +
    '</div>';
  }).join('');
}

function gatherNpcs() {
  var npcs = [];
  var blocks = document.querySelectorAll('.npc-note-block');
  blocks.forEach(function (block) {
    npcs.push({
      name:  block.querySelector('.npc-note-name').value,
      role:  block.querySelector('.npc-note-role').value,
      notes: block.querySelector('.npc-note-notes').value,
    });
  });
  return npcs;
}

// ── Items & Rewards ─────────────────────────────────────

function addItemNote() {
  gatherExtra();
  extraData.items.push({ name: '', desc: '' });
  renderItems();
  markExtraDirty();
}

function removeItemNote(idx) {
  gatherExtra();
  extraData.items.splice(idx, 1);
  renderItems();
  markExtraDirty();
}

function renderItems() {
  var el = document.getElementById('items-list');
  if (extraData.items.length === 0) {
    el.innerHTML = '<p class="empty-state">No items or rewards yet.</p>';
    return;
  }
  el.innerHTML = extraData.items.map(function (item, i) {
    return '<div class="item-note-block">' +
      '<div class="scene-header">' +
        '<input type="text" class="item-note-name" value="' + escapeHtml(item.name) + '" placeholder="Item name (e.g. Clue Token: Unity)" oninput="markExtraDirty()" style="flex:1;" />' +
        '<button class="danger" onclick="removeItemNote(' + i + ')" style="padding:4px 10px; font-size:12px;">x</button>' +
      '</div>' +
      '<textarea class="item-note-desc" oninput="markExtraDirty()" placeholder="Description, effect, who gets it, when to hand it out...">' + escapeHtml(item.desc) + '</textarea>' +
    '</div>';
  }).join('');
}

function gatherItems() {
  var items = [];
  var blocks = document.querySelectorAll('.item-note-block');
  blocks.forEach(function (block) {
    items.push({
      name: block.querySelector('.item-note-name').value,
      desc: block.querySelector('.item-note-desc').value,
    });
  });
  return items;
}
