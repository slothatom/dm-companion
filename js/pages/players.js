// =============================================
//   players.js — Players page
// =============================================

let players              = [];
let currentUserId        = null;
let deletedPlayerIds     = [];
let isDirty              = false;
let autosaveTimer        = null;
let activeCampaignFilter = '';   // '' = show all
let campaignsList        = [];   // [{id, name}, ...]

setupDirtyGuard(function () { return isDirty; });

(async function () {
  try {
    const user = await requireAuth();
    if (!user) return;
    currentUserId = user.id;
    renderNav(user);
    await loadPlayerCampaigns();
    await loadPlayers();
  } catch (err) {
    showToast('Failed to load players page: ' + err.message, 'error');
  }
})();

// ── Campaign helpers ─────────────────────────────────────

function getPlayerCampaignMap() {
  try {
    return JSON.parse(localStorage.getItem('player-campaign-map-' + currentUserId)) || {};
  } catch (e) { return {}; }
}

function savePlayerCampaignMap(map) {
  localStorage.setItem('player-campaign-map-' + currentUserId, JSON.stringify(map));
}

async function loadPlayerCampaigns() {
  const { data } = await db
    .from('campaigns')
    .select('id, name')
    .eq('user_id', currentUserId)
    .order('created_at');

  const bar = document.getElementById('player-campaign-bar');
  if (!data || data.length === 0) { bar.style.display = 'none'; return; }

  campaignsList = data;
  bar.style.display = '';
  var typeMap = {};
  try { typeMap = JSON.parse(localStorage.getItem('campaign-type-map-' + currentUserId)) || {}; } catch (e) {}
  const sel = document.getElementById('player-campaign-select');
  data.forEach(function (c) {
    const opt = document.createElement('option');
    opt.value       = c.id;
    opt.textContent = c.name + (typeMap[c.id] === 'oneshot' ? ' (one-shot)' : '');
    sel.appendChild(opt);
  });

  const stored = localStorage.getItem('player-campaign-filter-' + currentUserId);
  if (stored) {
    const exists = Array.from(sel.options).some(function (o) { return o.value === stored; });
    if (exists) sel.value = stored;
  }
  activeCampaignFilter = sel.value;
}

function filterByCampaign() {
  const sel = document.getElementById('player-campaign-select');
  activeCampaignFilter = sel.value;
  localStorage.setItem('player-campaign-filter-' + currentUserId, activeCampaignFilter);
  renderPlayers();
}

function filteredPlayers() {
  if (!activeCampaignFilter) return players;
  const map = getPlayerCampaignMap();
  return players.filter(function (p) {
    if (!p._id) return true;
    var cid = map[p._id];
    return cid === activeCampaignFilter || !cid;
  });
}

function setPlayerCampaign(id, campaignId) {
  var map = getPlayerCampaignMap();
  if (campaignId) { map[id] = campaignId; } else { delete map[id]; }
  savePlayerCampaignMap(map);
  showToast('Campaign updated.', 'success');
}

function buildPlayerCampaignDropdown(player) {
  if (campaignsList.length === 0 || !player._id) return '';
  var map = getPlayerCampaignMap();
  var current = map[player._id] || '';
  var typeMap = {};
  try { typeMap = JSON.parse(localStorage.getItem('campaign-type-map-' + currentUserId)) || {}; } catch (e) {}
  var options = '<option value="">No Campaign</option>' +
    campaignsList.map(function (c) {
      var sel = c.id === current ? ' selected' : '';
      var label = escapeHtml(c.name) + (typeMap[c.id] === 'oneshot' ? ' (one-shot)' : '');
      return '<option value="' + escapeHtml(c.id) + '"' + sel + '>' + label + '</option>';
    }).join('');
  return '<select onchange="setPlayerCampaign(\'' + player._id + '\', this.value)" style="margin:0; min-width:140px; flex:1;">' + options + '</select>';
}

async function loadPlayers() {
  const { data, error } = await db
    .from('players')
    .select('*')
    .eq('user_id', currentUserId)
    .order('created_at');

  if (error) { showToast('Could not load players: ' + error.message, 'error'); return; }

  players = (data || []).map(function (r) {
    return {
      _id:              r.id,
      playerName:       r.player_name,
      charName:         r.char_name,
      charClass:        r.char_class,
      race:             r.race,
      level:            r.level,
      hp:               r.hp,
      ac:               r.ac,
      passivePerception: r.passive_perception,
      notes:            r.notes
    };
  });
  deletedPlayerIds = [];
  isDirty          = false;
  renderPlayers();
}

function renderPlayers() {
  const container = document.getElementById('player-list');
  const visible = filteredPlayers();
  container.innerHTML = visible.length === 0
    ? '<p class="empty-state">No players yet. Add your party!</p>'
    : visible.map(function (p, i) { return buildPlayerCard(p, i); }).join('');
}

function buildPlayerCard(player, index) {
  return `
        <div class="card">
          <div class="stat-grid">
            <div>
              <label>Player Name</label>
              <input type="text" value="${escapeHtml(player.playerName)}"
                onchange="updatePlayer(${index}, 'playerName', this.value)"
                placeholder="e.g. Sarah" />
            </div>
            <div>
              <label>Character Name</label>
              <input type="text" value="${escapeHtml(player.charName)}"
                onchange="updatePlayer(${index}, 'charName', this.value)"
                placeholder="e.g. Aria Swiftblade" />
            </div>
            <div>
              <label>Class</label>
              <input type="text" value="${escapeHtml(player.charClass)}"
                onchange="updatePlayer(${index}, 'charClass', this.value)"
                placeholder="e.g. Rogue" />
            </div>
          </div>
          <div class="stat-grid">
            <div>
              <label>Race</label>
              <input type="text" value="${escapeHtml(player.race)}"
                onchange="updatePlayer(${index}, 'race', this.value)"
                placeholder="e.g. Half-Elf" />
            </div>
            <div>
              <label>Level</label>
              <input type="number" value="${escapeHtml(String(player.level ?? ''))}"
                onchange="updatePlayer(${index}, 'level', this.value)"
                placeholder="e.g. 5" />
            </div>
            <div>
              <label>HP</label>
              <input type="number" value="${escapeHtml(String(player.hp ?? ''))}"
                onchange="updatePlayer(${index}, 'hp', this.value)"
                placeholder="e.g. 38" />
            </div>
            <div>
              <label>AC</label>
              <input type="number" value="${escapeHtml(String(player.ac ?? ''))}"
                onchange="updatePlayer(${index}, 'ac', this.value)"
                placeholder="e.g. 15" />
            </div>
            <div>
              <label>Passive Perception</label>
              <input type="number" value="${escapeHtml(String(player.passivePerception ?? ''))}"
                onchange="updatePlayer(${index}, 'passivePerception', this.value)"
                placeholder="e.g. 13" />
            </div>
          </div>
          <label>Notes (backstory hooks, personality, things to keep in mind)</label>
          <textarea
            onchange="updatePlayer(${index}, 'notes', this.value)"
            placeholder="e.g. Looking for her missing brother. Doesn't trust clerics."
            style="min-height: 80px;"
          >${escapeHtml(player.notes)}</textarea>
          <div class="spell-slots-section" id="spell-slots-${index}">
            <button class="spell-slots-toggle" onclick="toggleSlots(${index})">
              <i class="fi fi-rr-book-spells"></i> Spell Slots <span class="spell-slots-arrow" id="slots-arrow-${index}">▾</span>
            </button>
            <div class="spell-slots-body" id="slots-body-${index}" style="display:none;">
              ${renderSlots(player, index)}
            </div>
          </div>
          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            ${buildPlayerCampaignDropdown(player)}
            <button class="danger" onclick="removePlayer(${index})"><i class="fi fi-rr-trash"></i> Remove</button>
          </div>
        </div>`;
}

function markDirty() {
  isDirty = true;
  markUnsaved();
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(savePlayers, 3000);
}

function addPlayer() {
  players.push({ playerName: '', charName: '', charClass: '', race: '', level: '', hp: '', ac: '', passivePerception: '', notes: '' });
  renderPlayers();
  markDirty();
}

function updatePlayer(index, field, value) {
  const visible = filteredPlayers();
  const item = visible[index];
  if (item) item[field] = value;
  markDirty();
}

function removePlayer(index) {
  const visible = filteredPlayers();
  const item = visible[index];
  if (!item) return;
  const masterIndex = players.indexOf(item);
  if (item._id) {
    deletedPlayerIds.push(item._id);
    var map = getPlayerCampaignMap();
    delete map[item._id];
    savePlayerCampaignMap(map);
  }
  players.splice(masterIndex, 1);
  renderPlayers();
  markDirty();
}

async function savePlayers() {
  clearTimeout(autosaveTimer);
  const btn = document.getElementById('save-btn');
  setButtonLoading(btn, true);

  // Validate: filter out players with both empty playerName AND empty charName
  const emptyPlayers = players.filter(function (p) {
    return (!p.playerName || !p.playerName.trim()) && (!p.charName || !p.charName.trim());
  });
  if (emptyPlayers.length > 0) {
    players = players.filter(function (p) {
      return (p.playerName && p.playerName.trim()) || (p.charName && p.charName.trim());
    });
    showToast('Skipped ' + emptyPlayers.length + ' item(s) with no name.', 'info');
    renderPlayers();
  }

  // Step 1: delete only rows the user explicitly removed
  if (deletedPlayerIds.length > 0) {
    const { error } = await db.from('players').delete().in('id', deletedPlayerIds);
    if (error) {
      setButtonLoading(btn, false);
      showToast('Save failed: ' + error.message, 'error');
      return;
    }
  }

  // Step 2: upsert existing rows (have _id), insert new rows (no _id)
  const existing = players.filter(function (p) { return  p._id; }).map(function (p) {
    return { id: p._id, user_id: currentUserId, player_name: p.playerName, char_name: p.charName, char_class: p.charClass, race: p.race, level: p.level, hp: p.hp, ac: p.ac, passive_perception: p.passivePerception, notes: p.notes };
  });
  const newRows = players.filter(function (p) { return !p._id; }).map(function (p) {
    return { user_id: currentUserId, player_name: p.playerName, char_name: p.charName, char_class: p.charClass, race: p.race, level: p.level, hp: p.hp, ac: p.ac, passive_perception: p.passivePerception, notes: p.notes };
  });

  const saveOps = [];
  if (existing.length > 0) saveOps.push(db.from('players').upsert(existing));
  if (newRows.length > 0)  saveOps.push(db.from('players').insert(newRows));

  if (saveOps.length > 0) {
    const results = await Promise.all(saveOps);
    const errors  = results.map(function (r) { return r.error; }).filter(Boolean);
    if (errors.length) {
      setButtonLoading(btn, false);
      showToast('Save failed: ' + errors[0].message, 'error');
      return;
    }
  }

  // Fetch server-assigned IDs for newly inserted rows
  const newWithoutId = players.filter(function (p) { return !p._id; });
  if (newWithoutId.length > 0) {
    const { data: newRows } = await db.from('players').select('id')
      .eq('user_id', currentUserId).order('created_at', { ascending: false }).limit(newWithoutId.length);
    if (newRows) {
      const reversed = newRows.slice().reverse();
      for (var ni = 0; ni < newWithoutId.length && ni < reversed.length; ni++) {
        newWithoutId[ni]._id = reversed[ni].id;
        if (activeCampaignFilter) {
          var pmap = getPlayerCampaignMap();
          pmap[reversed[ni].id] = activeCampaignFilter;
          savePlayerCampaignMap(pmap);
        }
      }
    }
  }

  deletedPlayerIds = [];
  setButtonLoading(btn, false);
  isDirty = false;
  renderPlayers();
  showSaved();
}

// =============================================
//   Spell Slots Tracker
// =============================================

function getSlots(playerId) {
  if (!playerId) return {};
  try {
    return JSON.parse(localStorage.getItem('spell-slots-' + playerId)) || {};
  } catch (e) {
    return {};
  }
}

function saveSlots(playerId, slots) {
  if (!playerId) return;
  localStorage.setItem('spell-slots-' + playerId, JSON.stringify(slots));
}

function toggleSlots(index) {
  const body  = document.getElementById('slots-body-' + index);
  const arrow = document.getElementById('slots-arrow-' + index);
  if (body.style.display === 'none') {
    body.style.display = 'block';
    arrow.textContent  = '▴';
  } else {
    body.style.display = 'none';
    arrow.textContent  = '▾';
  }
}

function getVisiblePlayer(index) {
  return filteredPlayers()[index];
}

function renderSlots(player, index) {
  const slots = getSlots(player._id);
  let html  = '';
  for (let lvl = 1; lvl <= 9; lvl++) {
    const data = slots[lvl] || { max: 0, used: 0 };
    let pips = '';
    for (let p = 0; p < data.max; p++) {
      const isUsed = p < data.used;
      pips += '<span class="slot-pip' + (isUsed ? ' used' : '') + '" onclick="toggleSlot(' + index + ',' + lvl + ',' + p + ')"></span>';
    }
    html += '<div class="slot-row">'
          + '<span class="slot-level">' + lvl + '</span>'
          + '<input type="number" class="slot-max-input" value="' + data.max + '" min="0" max="9" '
          + 'onchange="updateSlotMax(' + index + ',' + lvl + ',this.value)" title="Max slots" />'
          + '<span class="slot-pips">' + (pips || '<span class="slot-none">—</span>') + '</span>'
          + '</div>';
  }
  return html;
}

function refreshSlotsUI(index) {
  const body = document.getElementById('slots-body-' + index);
  const player = getVisiblePlayer(index);
  if (body && player) {
    body.innerHTML = renderSlots(player, index);
  }
}

function updateSlotMax(index, level, max) {
  const player = getVisiblePlayer(index);
  if (!player || !player._id) return;
  const slots = getSlots(player._id);
  max = Math.max(0, Math.min(9, parseInt(max, 10) || 0));
  const prev  = slots[level] || { max: 0, used: 0 };
  slots[level] = { max: max, used: Math.min(prev.used, max) };
  saveSlots(player._id, slots);
  refreshSlotsUI(index);
}

function toggleSlot(index, level, pipIndex) {
  const player = getVisiblePlayer(index);
  if (!player || !player._id) return;
  const slots = getSlots(player._id);
  const data  = slots[level] || { max: 0, used: 0 };
  if (pipIndex < data.used) {
    data.used = pipIndex;
  } else {
    data.used = pipIndex + 1;
  }
  slots[level] = data;
  saveSlots(player._id, slots);
  refreshSlotsUI(index);
}
