// =============================================
//   players.js — Players page
// =============================================

let players          = [];
let currentUserId    = null;
let deletedPlayerIds = [];
let isDirty          = false;
let autosaveTimer    = null;

setupDirtyGuard(function () { return isDirty; });

(async function () {
  try {
    const user = await requireAuth();
    if (!user) return;
    currentUserId = user.id;
    renderNav(user);
    await loadPlayers();
  } catch (err) {
    showToast('Failed to load players page: ' + err.message, 'error');
  }
})();

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
  container.innerHTML = players.length === 0
    ? '<p class="empty-state">No players yet. Add your party!</p>'
    : players.map(function (p, i) { return buildPlayerCard(p, i); }).join('');
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
              🔮 Spell Slots <span class="spell-slots-arrow" id="slots-arrow-${index}">▾</span>
            </button>
            <div class="spell-slots-body" id="slots-body-${index}" style="display:none;">
              ${renderSlots(player, index)}
            </div>
          </div>
          <button class="danger" onclick="removePlayer(${index})">🗑 Remove</button>
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
  players[index][field] = value;
  markDirty();
}

function removePlayer(index) {
  if (players[index]._id) deletedPlayerIds.push(players[index]._id);
  players.splice(index, 1);
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

  // Reload to get server-assigned IDs for newly inserted rows
  await loadPlayers();
  setButtonLoading(btn, false);
  isDirty = false;
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
  if (body) {
    body.innerHTML = renderSlots(players[index], index);
  }
}

function updateSlotMax(index, level, max) {
  const player = players[index];
  if (!player._id) return;
  const slots = getSlots(player._id);
  max = Math.max(0, Math.min(9, parseInt(max, 10) || 0));
  const prev  = slots[level] || { max: 0, used: 0 };
  slots[level] = { max: max, used: Math.min(prev.used, max) };
  saveSlots(player._id, slots);
  refreshSlotsUI(index);
}

function toggleSlot(index, level, pipIndex) {
  const player = players[index];
  if (!player._id) return;
  const slots = getSlots(player._id);
  const data  = slots[level] || { max: 0, used: 0 };
  // Clicking pip at pipIndex: if it's within 'used' range, reduce used to that pip.
  // Otherwise, increase used to include that pip.
  if (pipIndex < data.used) {
    data.used = pipIndex;
  } else {
    data.used = pipIndex + 1;
  }
  slots[level] = data;
  saveSlots(player._id, slots);
  refreshSlotsUI(index);
}
