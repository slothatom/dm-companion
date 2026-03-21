// =============================================
//   encounter.js - Encounter Builder page
// =============================================

let creatures      = [];
let currentUserId  = null;

// XP thresholds per character per level: [easy, medium, hard, deadly]
const XP_THRESHOLDS = {
  1:  [25,   50,   75,   100],
  2:  [50,   100,  150,  200],
  3:  [75,   150,  225,  400],
  4:  [125,  250,  375,  500],
  5:  [250,  500,  750,  1100],
  6:  [300,  600,  900,  1400],
  7:  [350,  750,  1100, 1700],
  8:  [450,  900,  1400, 2100],
  9:  [550,  1100, 1600, 2400],
  10: [600,  1200, 1900, 2800],
  11: [800,  1600, 2400, 3600],
  12: [1000, 2000, 3000, 4500],
  13: [1100, 2200, 3300, 5100],
  14: [1250, 2500, 3800, 5700],
  15: [1400, 2800, 4300, 6400],
  16: [1600, 3200, 4800, 7200],
  17: [2000, 3900, 5900, 8800],
  18: [2100, 4200, 6300, 9500],
  19: [2400, 4900, 7300, 10900],
  20: [2800, 5700, 8500, 12700],
};

const CR_TO_XP = {
  '0': 10, '1/8': 25, '1/4': 50, '1/2': 100,
  '1': 200, '2': 450, '3': 700, '4': 1100, '5': 1800,
  '6': 2300, '7': 2900, '8': 3900, '9': 5000, '10': 5900,
  '11': 7200, '12': 8400, '13': 10000, '14': 11500, '15': 13000,
  '16': 15000, '17': 18000, '18': 20000, '19': 22000, '20': 25000,
  '21': 33000, '22': 41000, '23': 50000, '24': 62000,
  '25': 75000, '26': 90000, '27': 105000, '28': 120000,
  '29': 135000, '30': 155000,
};

// API-loaded monsters (augments static MONSTERS)
var _apiMonsters = null;

function getMonsterList() {
  if (_apiMonsters && _apiMonsters.length > 0) return _apiMonsters;
  if (typeof MONSTERS !== 'undefined' && MONSTERS.length > 0) return MONSTERS;
  return [];
}

(async function () {
  const user = await requireAuth();
  if (!user) return;
  currentUserId = user.id;
  renderNav(user);
  recalculate();
  loadSavedEncounters();

  // Pre-load API monsters in background for the SRD browser
  if (typeof DndApi !== 'undefined') {
    try {
      _apiMonsters = await DndApi.fetchMonsters();
    } catch (e) {
      // Fallback to static data - that's fine
    }
  }
})();

// Auto-fill XP when CR is typed
function autofillXP() {
  const cr = document.getElementById('new-cr').value.trim();
  if (cr && CR_TO_XP[cr] !== undefined) {
    document.getElementById('new-xp').value = CR_TO_XP[cr];
  }
}

function addCreature() {
  const name = document.getElementById('new-name').value.trim();
  const cr   = document.getElementById('new-cr').value.trim();
  const xp   = parseInt(document.getElementById('new-xp').value) || 0;
  if (!name) { showToast('Please enter a monster name.', 'error'); return; }
  // Validate CR if entered
  if (cr && CR_TO_XP[cr] === undefined) {
    showToast('Invalid CR "' + cr + '". Use values like 0, 1/8, 1/4, 1/2, or 1-30.', 'error');
    return;
  }
  // Try to pull HP/AC from SRD bestiary
  let hp = '', ac = '';
  var monList = getMonsterList();
  if (monList.length > 0) {
    const match = monList.find(function (m) { return m.name.toLowerCase() === name.toLowerCase(); });
    if (match) { hp = String(match.hp || ''); ac = String(match.ac || ''); }
  }
  creatures.push({ name, cr, xp, hp: hp, ac: ac });
  document.getElementById('new-name').value = '';
  document.getElementById('new-cr').value   = '';
  document.getElementById('new-xp').value   = '';
  document.getElementById('new-name').focus();
  renderCreatures();
  recalculate();
}

async function importCreatures() {
  if (!currentUserId) return;
  const { data, error } = await db
    .from('creatures').select('*').eq('user_id', currentUserId).order('created_at');
  if (error || !data || data.length === 0) {
    showToast('No creatures found - add them on the Characters page first.', 'info');
    return;
  }
  data.forEach(function (c) {
    const xp = c.cr ? (CR_TO_XP[c.cr] || 0) : 0;
    creatures.push({ name: c.name || 'Unknown', cr: c.cr || '', xp, hp: c.hp || '', ac: c.ac || '' });
  });
  showToast('Imported ' + data.length + ' creature(s).', 'success');
  renderCreatures();
  recalculate();
}

function importFromGenerator() {
  const raw = localStorage.getItem('generator-session-entries');
  if (!raw) {
    showToast('No generator session entries found - generate and save creatures first.', 'info');
    return;
  }
  let entries;
  try { entries = JSON.parse(raw); } catch (e) {
    showToast('Could not parse generator data.', 'error');
    return;
  }
  let added = 0;
  entries.forEach(function (entry) {
    if (entry._type !== 'creature') return;
    const xp = entry.cr ? (CR_TO_XP[entry.cr] || 0) : 0;
    creatures.push({ name: entry.name || 'Unknown', cr: entry.cr || '', xp: xp, hp: '', ac: '' });
    added++;
  });
  if (added === 0) {
    showToast('No creature entries found in generator session.', 'info');
    return;
  }
  showToast('Imported ' + added + ' creature(s) from Generator.', 'success');
  renderCreatures();
  recalculate();
}

function removeCreature(index) {
  creatures.splice(index, 1);
  renderCreatures();
  recalculate();
}

function updateXP(index, value) {
  creatures[index].xp = parseInt(value) || 0;
  recalculate();
}

function renderCreatures() {
  const container = document.getElementById('creature-list');
  if (creatures.length === 0) {
    container.innerHTML = '<p class="empty-state">No monsters yet. Add some above!</p>';
    document.getElementById('difficulty-card').style.display = 'none';
    document.getElementById('send-btn').style.display  = 'none';
    document.getElementById('save-btn').style.display  = 'none';
    document.getElementById('clear-btn').style.display = 'none';
    return;
  }
  container.innerHTML = creatures.map(function (c, i) {
    return `
          <div class="encounter-row">
            <span class="encounter-name">${escapeHtml(c.name)}</span>
            <span class="encounter-cr" title="Challenge Rating">${c.cr ? 'CR ' + escapeHtml(c.cr) : ''}</span>
            <span class="encounter-xp-wrap">
              <input type="number" value="${c.xp}" min="0"
                onchange="updateXP(${i}, this.value)"
                style="width:80px; margin:0; padding:4px 8px; font-size:14px; display:inline;"
                title="XP Value" />
              <span style="color:var(--text-dim); font-size:12px;"> XP</span>
            </span>
            <button class="danger btn-x"
              onclick="removeCreature(${i})">✕</button>
          </div>`;
  }).join('');
  document.getElementById('difficulty-card').style.display = '';
  document.getElementById('send-btn').style.display  = '';
  document.getElementById('save-btn').style.display  = '';
  document.getElementById('clear-btn').style.display = '';
}

function getMultiplier(count, partySize) {
  let tier;
  if      (count === 1)  tier = 0;
  else if (count === 2)  tier = 1;
  else if (count <= 6)   tier = 2;
  else if (count <= 10)  tier = 3;
  else if (count <= 14)  tier = 4;
  else                   tier = 5;

  // Party size adjustment
  if (partySize < 3 && tier < 5) tier++;
  if (partySize >= 6 && tier > 0) tier--;

  const tiers = [1, 1.5, 2, 2.5, 3, 4];
  return tiers[tier];
}

function recalculate() {
  const partySize  = parseInt(document.getElementById('party-size').value)  || 4;
  const partyLevel = parseInt(document.getElementById('party-level').value) || 1;
  const thresh     = XP_THRESHOLDS[partyLevel] || XP_THRESHOLDS[1];

  // Update budget display
  document.getElementById('budget-easy').textContent   = (thresh[0] * partySize).toLocaleString() + ' XP';
  document.getElementById('budget-medium').textContent = (thresh[1] * partySize).toLocaleString() + ' XP';
  document.getElementById('budget-hard').textContent   = (thresh[2] * partySize).toLocaleString() + ' XP';
  document.getElementById('budget-deadly').textContent = (thresh[3] * partySize).toLocaleString() + ' XP';

  if (creatures.length === 0) return;

  const baseXP    = creatures.reduce(function (s, c) { return s + (c.xp || 0); }, 0);
  const multi     = getMultiplier(creatures.length, partySize);
  const adjXP     = Math.round(baseXP * multi);

  document.getElementById('xp-base').textContent       = baseXP.toLocaleString();
  document.getElementById('xp-multiplier').textContent = '×' + multi;
  document.getElementById('xp-adjusted').textContent   = adjXP.toLocaleString() + ' XP';

  const budgetEasy   = thresh[0] * partySize;
  const budgetMedium = thresh[1] * partySize;
  const budgetHard   = thresh[2] * partySize;
  const budgetDeadly = thresh[3] * partySize;

  let difficulty, diffClass;
  if      (adjXP < budgetEasy)   { difficulty = 'Trivial';  diffClass = 'diff-trivial'; }
  else if (adjXP < budgetMedium) { difficulty = 'Easy';     diffClass = 'diff-easy'; }
  else if (adjXP < budgetHard)   { difficulty = 'Medium';   diffClass = 'diff-medium'; }
  else if (adjXP < budgetDeadly) { difficulty = 'Hard';     diffClass = 'diff-hard'; }
  else                           { difficulty = 'Deadly';   diffClass = 'diff-deadly'; }

  const badge = document.getElementById('difficulty-badge');
  badge.textContent = difficulty;
  badge.className   = 'difficulty-badge ' + diffClass;
  badge.style.display = '';

  const note = multi > 1
    ? creatures.length + ' monster' + (creatures.length > 1 ? 's' : '') +
      ' → ×' + multi + ' multiplier' +
      (partySize < 3 ? ' (small party)' : partySize >= 6 ? ' (large party)' : '')
    : '1 monster - no multiplier';
  document.getElementById('multiplier-note').textContent = note;
}

function sendToInitiative() {
  if (creatures.length === 0) return;
  const combatants = creatures.map(function (c) {
    return { name: c.name, init: 0, hp: c.hp || '-', maxHp: c.hp || '-', type: 'creature', conditions: [] };
  });
  localStorage.setItem('encounter-import', JSON.stringify(combatants));
  window.location.href = 'initiative.html';
}

function clearAll() {
  showConfirm({
    title:       'Clear Encounter',
    message:     'Remove all monsters from this encounter?',
    confirmText: 'Clear',
    danger:      true,
    onConfirm:   function () {
      creatures = [];
      renderCreatures();
      recalculate();
    },
  });
}

// ── SRD Monster Browser ───────────────────────────────────

function showMonsterBrowser() {
  var monList = getMonsterList();
  if (monList.length === 0) {
    showToast('Monster data not loaded yet. Try again in a moment.', 'info');
    return;
  }

  let modal = document.getElementById('monster-browser-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'monster-browser-modal';
    modal.className = 'dm-modal-overlay';
    modal.innerHTML =
      '<div class="dm-modal" style="max-width:680px; max-height:80vh; display:flex; flex-direction:column;" role="dialog" aria-modal="true">' +
        '<h3 class="dm-modal-title"><i class="fi fi-rr-book"></i> SRD Bestiary <span id="monster-browser-count" style="font-weight:400; font-size:13px; color:var(--text-muted);"></span></h3>' +
        '<div style="display:flex; gap:8px; margin-bottom:12px;">' +
          '<input type="text" id="monster-search" placeholder="Search by name or type..." oninput="filterMonsterBrowser()" style="flex:1; margin:0;" />' +
          '<select id="monster-cr-filter" onchange="filterMonsterBrowser()" style="margin:0; width:auto;">' +
            '<option value="all">All CRs</option>' +
            '<option value="0">CR 0</option><option value="1/8">CR 1/8</option><option value="1/4">CR 1/4</option><option value="1/2">CR 1/2</option>' +
            '<option value="1">CR 1</option><option value="2">CR 2</option><option value="3">CR 3</option><option value="4">CR 4</option><option value="5">CR 5</option>' +
            '<option value="6">CR 6</option><option value="7">CR 7</option><option value="8">CR 8</option><option value="9">CR 9</option><option value="10">CR 10</option>' +
            '<option value="11-15">CR 11–15</option><option value="16-20">CR 16–20</option><option value="21+">CR 21+</option>' +
          '</select>' +
        '</div>' +
        '<div id="monster-browser-list" style="overflow-y:auto; flex:1; min-height:200px;"></div>' +
        '<div class="dm-modal-actions" style="justify-content:center; margin-top:12px;">' +
          '<button onclick="closeMonsterBrowser()">Close</button>' +
        '</div>' +
      '</div>';
    modal.addEventListener('click', function (e) { if (e.target === modal) closeMonsterBrowser(); });
    document.body.appendChild(modal);
  }

  modal.style.display = 'flex';
  var countEl = document.getElementById('monster-browser-count');
  if (countEl) countEl.textContent = '(' + getMonsterList().length + ' monsters)';
  document.getElementById('monster-search').value = '';
  document.getElementById('monster-cr-filter').value = 'all';
  filterMonsterBrowser();
  document.getElementById('monster-search').focus();
}

function closeMonsterBrowser() {
  const modal = document.getElementById('monster-browser-modal');
  if (modal) modal.style.display = 'none';
}

function parseCR(cr) {
  if (cr === '1/8') return 0.125;
  if (cr === '1/4') return 0.25;
  if (cr === '1/2') return 0.5;
  return parseFloat(cr) || 0;
}

function filterMonsterBrowser() {
  const q      = (document.getElementById('monster-search').value || '').toLowerCase();
  const crFilter = document.getElementById('monster-cr-filter').value;

  const filtered = getMonsterList().filter(function (m) {
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || (m.type || '').toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (crFilter === 'all') return true;
    const crNum = parseCR(m.cr);
    if (crFilter === '11-15') return crNum >= 11 && crNum <= 15;
    if (crFilter === '16-20') return crNum >= 16 && crNum <= 20;
    if (crFilter === '21+')   return crNum >= 21;
    return m.cr === crFilter;
  });

  const container = document.getElementById('monster-browser-list');
  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-state">No monsters match.</p>';
    return;
  }
  // Limit display to 60 to keep the DOM manageable
  const shown = filtered.slice(0, 60);
  container.innerHTML = shown.map(function (m, i) {
    return '<div class="ref-card" style="cursor:pointer; padding:10px 14px; margin-bottom:6px;" onclick="addMonsterFromBrowser(' + i + ')" title="Click to add to encounter">' +
      '<div style="display:flex; justify-content:space-between; align-items:center;">' +
        '<strong style="color:var(--accent);">' + escapeHtml(m.name) + '</strong>' +
        '<span style="color:var(--text-muted); font-size:13px;">CR ' + escapeHtml(m.cr) + ' · ' + (CR_TO_XP[m.cr] || '?') + ' XP</span>' +
      '</div>' +
      '<div style="color:var(--text-muted); font-size:13px; margin-top:4px;">' +
        escapeHtml(m.type) + ' · AC ' + m.ac + ' · HP ' + m.hp + ' · ' + escapeHtml(m.speed) +
      '</div>' +
    '</div>';
  }).join('');
  // Store filtered list for click handler
  _dl.monsterBrowser = filtered;
  if (filtered.length > 60) {
    container.innerHTML += '<p style="text-align:center; color:var(--text-muted); font-size:13px; margin-top:8px;">Showing 60 of ' + filtered.length + ' - narrow your search.</p>';
  }
}

function addMonsterFromBrowser(index) {
  const m = _dl.monsterBrowser && _dl.monsterBrowser[index];
  if (!m) return;
  const xp = CR_TO_XP[m.cr] || 0;
  creatures.push({ name: m.name, cr: m.cr, xp: xp, hp: String(m.hp || ''), ac: String(m.ac || '') });
  renderCreatures();
  recalculate();
  showToast(m.name + ' added to encounter.', 'success');
}

// ── Save / Load Encounters (localStorage) ─────────────────

function getSavedEncounters() {
  try {
    return JSON.parse(localStorage.getItem('saved-encounters')) || [];
  } catch (e) {
    return [];
  }
}

function setSavedEncounters(list) {
  localStorage.setItem('saved-encounters', JSON.stringify(list));
}

function saveEncounter() {
  if (creatures.length === 0) {
    showToast('Add some monsters before saving.', 'error');
    return;
  }
  showPrompt({
    title: 'Save Encounter',
    message: 'Name this encounter:',
    placeholder: 'e.g. Goblin Ambush',
    confirmText: 'Save',
    onConfirm: function (name) {
      if (!name || !name.trim()) return;

      const partySize  = parseInt(document.getElementById('party-size').value) || 4;
      const partyLevel = parseInt(document.getElementById('party-level').value) || 4;

      const saved = getSavedEncounters();
      saved.push({
        name:       name.trim(),
        creatures:  JSON.parse(JSON.stringify(creatures)),
        partySize:  partySize,
        partyLevel: partyLevel,
        savedAt:    new Date().toISOString(),
      });
      setSavedEncounters(saved);
      loadSavedEncounters();
      showToast('Encounter "' + name.trim() + '" saved.', 'success');
    }
  });
}

function computeDifficultyLabel(encounter) {
  const thresh = XP_THRESHOLDS[encounter.partyLevel] || XP_THRESHOLDS[1];
  const baseXP = encounter.creatures.reduce(function (s, c) { return s + (c.xp || 0); }, 0);
  const multi  = getMultiplier(encounter.creatures.length, encounter.partySize);
  const adjXP  = Math.round(baseXP * multi);
  const budgets = thresh.map(function (t) { return t * encounter.partySize; });

  if      (adjXP < budgets[0]) return { label: 'Trivial',  cls: 'diff-trivial' };
  else if (adjXP < budgets[1]) return { label: 'Easy',     cls: 'diff-easy' };
  else if (adjXP < budgets[2]) return { label: 'Medium',   cls: 'diff-medium' };
  else if (adjXP < budgets[3]) return { label: 'Hard',     cls: 'diff-hard' };
  else                         return { label: 'Deadly',   cls: 'diff-deadly' };
}

function loadSavedEncounters() {
  const saved = getSavedEncounters();
  const container = document.getElementById('saved-encounters-list');
  if (!container) return;

  if (saved.length === 0) {
    container.innerHTML = '<p class="empty-state">No saved encounters yet.</p>';
    return;
  }

  container.innerHTML = saved.map(function (enc, i) {
    const diff = computeDifficultyLabel(enc);
    const date = new Date(enc.savedAt);
    const dateStr = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    const count = enc.creatures.length;
    return '<div class="ref-card" style="padding:12px 14px; margin-bottom:8px;">' +
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">' +
        '<div>' +
          '<strong style="color:var(--accent);">' + escapeHtml(enc.name) + '</strong>' +
          ' <span class="difficulty-badge ' + diff.cls + '" style="font-size:11px; padding:2px 8px; vertical-align:middle;">' + diff.label + '</span>' +
          '<div style="color:var(--text-muted); font-size:13px; margin-top:4px;">' +
            count + ' monster' + (count !== 1 ? 's' : '') +
            ' · Party ' + enc.partySize + ' × Lv' + enc.partyLevel +
            ' · ' + dateStr +
          '</div>' +
        '</div>' +
        '<div style="display:flex; gap:6px;">' +
          '<button style="padding:5px 12px; font-size:13px;" onclick="loadEncounter(' + i + ')">Load</button>' +
          '<button class="danger" style="padding:5px 12px; font-size:13px;" onclick="deleteSavedEncounter(' + i + ')">Delete</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function loadEncounter(index) {
  const saved = getSavedEncounters();
  const enc = saved[index];
  if (!enc) return;

  creatures = JSON.parse(JSON.stringify(enc.creatures));
  document.getElementById('party-size').value  = enc.partySize;
  document.getElementById('party-level').value = enc.partyLevel;
  renderCreatures();
  recalculate();
  showToast('Loaded "' + enc.name + '".', 'success');
}

function deleteSavedEncounter(index) {
  const saved = getSavedEncounters();
  const enc = saved[index];
  if (!enc) return;

  showConfirm({
    title:       'Delete Saved Encounter',
    message:     'Delete "' + enc.name + '"? This cannot be undone.',
    confirmText: 'Delete',
    danger:      true,
    onConfirm:   function () {
      saved.splice(index, 1);
      setSavedEncounters(saved);
      loadSavedEncounters();
      showToast('Encounter deleted.', 'success');
    },
  });
}
