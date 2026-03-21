// =============================================
//   initiative.js - Initiative Tracker page
// =============================================

const CONDITIONS = ['Prone','Stunned','Poisoned','Blinded','Frightened','Incapacitated','Paralyzed','Restrained'];

let combatants    = [];
let currentTurn   = 0;
let round         = 1;
let currentUserId = null;

(async function () {
  const user = await requireAuth();
  if (!user) return;
  currentUserId = user.id;
  renderNav(user);

  // Check for encounter-builder import
  const imported = localStorage.getItem('encounter-import');
  if (imported) {
    try {
      const toImport = JSON.parse(imported);
      combatants = toImport;
      localStorage.removeItem('encounter-import');
      showToast('Imported ' + combatants.length + ' creature(s) from Encounter Builder.', 'success');
    } catch (e) { localStorage.removeItem('encounter-import'); }
  } else {
    // Restore persisted initiative state if available
    restoreInitiativeState();
  }

  renderList();
})();

function saveInitiativeState() {
  localStorage.setItem('initiative-state', JSON.stringify({
    combatants: combatants,
    currentTurn: currentTurn,
    round: round
  }));
}

function restoreInitiativeState() {
  const saved = localStorage.getItem('initiative-state');
  if (saved) {
    try {
      const state = JSON.parse(saved);
      combatants  = state.combatants || [];
      currentTurn = state.currentTurn || 0;
      round       = state.round || 1;
    } catch (e) { /* ignore corrupt data */ }
  }
}

function rollInitiative() {
  const result = Math.floor(Math.random() * 20) + 1;
  document.getElementById('new-init').value = result;
}

function addCombatant() {
  const name = document.getElementById('new-name').value.trim();
  const init = parseInt(document.getElementById('new-init').value) || 0;
  const hp   = document.getElementById('new-hp').value;
  const type = document.getElementById('new-type').value;
  if (!name) { showToast('Please enter a name.', 'error'); return; }
  // Validate HP is not negative
  if (hp && parseInt(hp) < 0) { showToast('HP cannot be negative.', 'error'); return; }
  combatants.push({ name, init, hp: hp || '-', maxHp: hp || '-', type, conditions: [] });
  document.getElementById('new-name').value = '';
  document.getElementById('new-init').value = '';
  document.getElementById('new-hp').value   = '';
  document.getElementById('new-name').focus();
  renderList();
}

async function importPlayers() {
  const { data, error } = await db
    .from('players').select('*').eq('user_id', currentUserId).order('created_at');
  if (error || !data || data.length === 0) {
    showToast('No players found - add them on the Players page first.', 'info'); return;
  }
  data.forEach(function (p) {
    combatants.push({ name: p.char_name || p.player_name || 'Unknown',
      init: 0, hp: p.hp || '-', maxHp: p.hp || '-', type: 'player', conditions: [] });
  });
  showToast('Imported ' + data.length + ' player(s).', 'success');
  renderList();
}

async function importCreatures() {
  const { data, error } = await db
    .from('creatures').select('*').eq('user_id', currentUserId).order('created_at');
  if (error || !data || data.length === 0) {
    showToast('No creatures found - add them on the Characters page first.', 'info'); return;
  }
  data.forEach(function (c) {
    combatants.push({ name: c.name || 'Unknown Creature',
      init: 0, hp: c.hp || '-', maxHp: c.hp || '-', type: 'creature', conditions: [] });
  });
  showToast('Imported ' + data.length + ' creature(s).', 'success');
  renderList();
}

function sortByInitiative() {
  combatants.sort(function (a, b) { return b.init - a.init; });
  currentTurn = 0;
  renderList();
}

function nextTurn() {
  if (combatants.length === 0) return;
  currentTurn++;
  if (currentTurn >= combatants.length) {
    currentTurn = 0;
    round++;
    document.getElementById('round-counter').textContent = round;
  }
  renderList();
}

function resetTurn() {
  currentTurn = 0; round = 1;
  document.getElementById('round-counter').textContent = 1;
  renderList();
}

function clearAll() {
  showConfirm({
    title:       'Clear All',
    message:     'Remove all combatants from the tracker?',
    confirmText: 'Clear',
    danger:      true,
    onConfirm:   function () {
      combatants = []; currentTurn = 0; round = 1;
      document.getElementById('round-counter').textContent = 1;
      localStorage.removeItem('initiative-state');
      renderList();
    },
  });
}

function removeCombatant(index) {
  combatants.splice(index, 1);
  if (currentTurn >= combatants.length) currentTurn = 0;
  renderList();
}

function updateHp(index, value) {
  combatants[index].hp = value;
  saveInitiativeState();
}

function applyDamage(index) {
  const input  = document.getElementById('hp-adj-' + index);
  const amount = parseInt(input.value) || 0;
  if (amount === 0) return;
  const c       = combatants[index];
  const current = parseInt(c.hp);
  if (!isNaN(current)) {
    c.hp = Math.max(0, current - amount);
    if (c.hp === 0) showToast(c.name + ' dropped to 0 HP!', 'info');
  }
  renderList();
}

function applyHeal(index) {
  const input  = document.getElementById('hp-adj-' + index);
  const amount = parseInt(input.value) || 0;
  if (amount === 0) return;
  const c       = combatants[index];
  const current = parseInt(c.hp);
  const max     = parseInt(c.maxHp);
  if (!isNaN(current)) {
    c.hp = isNaN(max) ? current + amount : Math.min(max, current + amount);
  }
  renderList();
}

function toggleCondition(index, condition) {
  if (!combatants[index].conditions) combatants[index].conditions = [];
  const idx = combatants[index].conditions.indexOf(condition);
  if (idx === -1) combatants[index].conditions.push(condition);
  else            combatants[index].conditions.splice(idx, 1);
  renderList();
}

function renderList() {
  const container = document.getElementById('init-list');
  document.getElementById('round-counter').textContent = round;

  saveInitiativeState();

  if (combatants.length === 0) {
    container.innerHTML = '<p class="empty-state">No combatants yet - add them below or import your party.</p>';
    document.getElementById('turn-counter').textContent = '-';
    return;
  }

  document.getElementById('turn-counter').textContent =
    combatants[currentTurn] ? combatants[currentTurn].name : '-';

  const typeIcons = { player: '<i class="fi fi-rr-user"></i>', npc: '<i class="fi fi-rr-user-speaking"></i>', creature: '<i class="fi fi-rr-dragon"></i>' };

  container.innerHTML = combatants.map(function (c, i) {
    const isActive  = i === currentTurn;
    const isZeroHp  = parseInt(c.hp) === 0;
    const conds     = c.conditions || [];
    const condChips = CONDITIONS.map(function (cond) {
      return '<span class="cond-chip' + (conds.includes(cond) ? ' cond-active' : '') + '"' +
        ' onclick="toggleCondition(' + i + ', \'' + cond + '\')">' + cond + '</span>';
    }).join('');

    return `
          <div class="init-row ${isActive ? 'active-turn' : ''}${isZeroHp ? ' hp-zero' : ''}">
            <div class="init-row-main">
              <span class="turn-arrow"><i class="fi fi-rr-play"></i></span>
              <span class="init-score">${c.init}</span>
              <span class="init-name">${escapeHtml(c.name)}</span>
              <span class="init-type">${typeIcons[c.type] || '?'} ${c.type}</span>
              <span class="init-hp">
                <i class="fi fi-rr-heart"></i> <input type="number" value="${c.hp}"
                  onchange="updateHp(${i}, this.value)"
                  style="width:55px; padding:2px 6px; font-size:15px; margin:0; display:inline;"
                  title="Current HP" />
                <span style="color:#5a4a30;">/ ${c.maxHp}</span>
              </span>
              <button class="danger" style="padding:5px 10px; font-size:14px;"
                onclick="removeCombatant(${i})">✕</button>
            </div>
            <div class="init-row-sub">
              <div class="hp-adj">
                <input type="number" id="hp-adj-${i}" placeholder="amt" min="0" style="width:64px;" />
                <button onclick="applyDamage(${i})" style="padding:4px 10px; font-size:13px;" class="danger"><i class="fi fi-rr-sword"></i> Dmg</button>
                <button onclick="applyHeal(${i})"   style="padding:4px 10px; font-size:13px;" class="secondary"><i class="fi fi-rr-heart"></i> Heal</button>
              </div>
              <div class="cond-row">${condChips}</div>
            </div>
          </div>`;
  }).join('');
}
