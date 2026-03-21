// =============================================
//   initiative.js - Initiative Tracker page
// =============================================

const CONDITIONS = [
  {
    name: 'Blinded',
    effect: 'Can\'t see. Auto-fail sight checks. Attack rolls have disadvantage. Attacks against have advantage.',
    save: '—',
    icon: 'fi-rr-eye-crossed'
  },
  {
    name: 'Charmed',
    effect: 'Can\'t attack the charmer. Charmer has advantage on social checks against the creature.',
    save: 'WIS save (varies)',
    icon: 'fi-rr-heart'
  },
  {
    name: 'Deafened',
    effect: 'Can\'t hear. Auto-fail hearing checks.',
    save: '—',
    icon: 'fi-rr-volume-mute'
  },
  {
    name: 'Frightened',
    effect: 'Disadvantage on ability checks and attack rolls while source of fear is in line of sight. Can\'t willingly move closer to the source.',
    save: 'WIS save (varies)',
    icon: 'fi-rr-exclamation'
  },
  {
    name: 'Grappled',
    effect: 'Speed becomes 0. Can\'t benefit from bonus to speed. Ends if grappler is incapacitated or forced apart.',
    save: 'Athletics/Acrobatics vs Athletics',
    icon: 'fi-rr-hand'
  },
  {
    name: 'Incapacitated',
    effect: 'Can\'t take actions or reactions.',
    save: '—',
    icon: 'fi-rr-ban'
  },
  {
    name: 'Invisible',
    effect: 'Impossible to see without magic/special sense. Heavily obscured. Attack rolls have advantage. Attacks against have disadvantage.',
    save: '—',
    icon: 'fi-rr-eye'
  },
  {
    name: 'Paralyzed',
    effect: 'Incapacitated. Can\'t move or speak. Auto-fail STR and DEX saves. Attacks have advantage. Melee hits within 5 ft are auto-crits.',
    save: 'CON save (varies)',
    icon: 'fi-rr-bolt'
  },
  {
    name: 'Petrified',
    effect: 'Transformed to stone. Weight ×10. Incapacitated. Unaware. Resistance to all damage. Immune to poison/disease.',
    save: 'CON save (varies)',
    icon: 'fi-rr-shield'
  },
  {
    name: 'Poisoned',
    effect: 'Disadvantage on attack rolls and ability checks.',
    save: 'CON save (varies)',
    icon: 'fi-rr-flask-potion'
  },
  {
    name: 'Prone',
    effect: 'Disadvantage on attack rolls. Attacks within 5 ft have advantage; ranged attacks have disadvantage. Must use half movement to stand.',
    save: '—',
    icon: 'fi-rr-arrow-down'
  },
  {
    name: 'Restrained',
    effect: 'Speed becomes 0. Attack rolls have disadvantage. Attacks against have advantage. Disadvantage on DEX saves.',
    save: 'STR save/check (varies)',
    icon: 'fi-rr-lock'
  },
  {
    name: 'Stunned',
    effect: 'Incapacitated. Can\'t move. Can speak only falteringly. Auto-fail STR and DEX saves. Attacks against have advantage.',
    save: 'CON save (varies)',
    icon: 'fi-rr-star'
  },
  {
    name: 'Unconscious',
    effect: 'Incapacitated. Can\'t move or speak. Unaware. Drop what held and fall prone. Auto-fail STR/DEX saves. Attacks have advantage. Melee within 5 ft = auto-crit.',
    save: '—',
    icon: 'fi-rr-moon'
  },
  {
    name: 'Exhaustion',
    effect: 'Lvl 1: Disadv ability checks. Lvl 2: Speed halved. Lvl 3: Disadv attacks/saves. Lvl 4: HP max halved. Lvl 5: Speed 0. Lvl 6: Death.',
    save: 'Long rest removes 1 level',
    icon: 'fi-rr-tired'
  },
  {
    name: 'Concentration',
    effect: 'Maintaining a spell. CON save on damage (DC = 10 or half damage, whichever is higher). Broken by incapacitation or casting another concentration spell.',
    save: 'CON save (DC 10 or half dmg)',
    icon: 'fi-rr-brain'
  }
];

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
  const roll = Math.floor(Math.random() * 20) + 1;
  const mod = parseInt(document.getElementById('new-init-mod').value) || 0;
  const total = roll + mod;
  document.getElementById('new-init').value = total;
  var modStr = mod >= 0 ? '+' + mod : String(mod);
  showToast('Rolled ' + roll + ' ' + modStr + ' = ' + total, 'info');
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

async function showImportPicker(importType) {
  // Fetch campaigns to show picker
  const { data: campaigns } = await db
    .from('campaigns')
    .select('id, name')
    .eq('user_id', currentUserId)
    .order('created_at');

  var typeMap = {};
  try { typeMap = JSON.parse(localStorage.getItem('campaign-type-map-' + currentUserId)) || {}; } catch (e) {}

  if (!campaigns || campaigns.length === 0) {
    // No campaigns — import all directly
    if (importType === 'players') importPlayers('');
    else importCreatures('');
    return;
  }

  // Build picker HTML
  var label = importType === 'players' ? 'Players' : 'Creatures';
  var options = '<option value="">All ' + label + ' (no filter)</option>';
  campaigns.forEach(function (c) {
    var suffix = typeMap[c.id] === 'oneshot' ? ' (one-shot)' : '';
    options += '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(c.name) + suffix + '</option>';
  });

  // Use a confirm-style modal with a dropdown
  var overlay = document.createElement('div');
  overlay.className = 'dm-modal-overlay';
  overlay.style.display = 'flex';
  overlay.innerHTML =
    '<div class="dm-modal" role="dialog" aria-modal="true">' +
      '<h3 class="dm-modal-title">Import ' + label + '</h3>' +
      '<p style="color:var(--text-muted); margin-bottom:12px;">Choose which campaign to import from:</p>' +
      '<select id="import-campaign-pick" style="width:100%; margin-bottom:16px;">' + options + '</select>' +
      '<div class="dm-modal-actions">' +
        '<button class="secondary" id="import-cancel-btn">Cancel</button>' +
        '<button id="import-confirm-btn"><i class="fi fi-rr-download"></i> Import</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) { overlay.remove(); } });

  document.getElementById('import-cancel-btn').onclick = function () { overlay.remove(); };
  document.getElementById('import-confirm-btn').onclick = function () {
    var campaignId = document.getElementById('import-campaign-pick').value;
    overlay.remove();
    if (importType === 'players') importPlayers(campaignId);
    else importCreatures(campaignId);
  };
}

async function importPlayers(campaignId) {
  const { data, error } = await db
    .from('players').select('*').eq('user_id', currentUserId).order('created_at');
  if (error || !data || data.length === 0) {
    showToast('No players found - add them on the Players page first.', 'info'); return;
  }

  var filtered = data;
  if (campaignId) {
    var map = {};
    try { map = JSON.parse(localStorage.getItem('player-campaign-map-' + currentUserId)) || {}; } catch (e) {}
    filtered = data.filter(function (p) {
      return map[p.id] === campaignId;
    });
    if (filtered.length === 0) {
      showToast('No players assigned to that campaign.', 'info'); return;
    }
  }

  filtered.forEach(function (p) {
    combatants.push({ name: p.char_name || p.player_name || 'Unknown',
      init: 0, hp: p.hp || '-', maxHp: p.hp || '-', type: 'player', conditions: [] });
  });
  showToast('Imported ' + filtered.length + ' player(s).', 'success');
  renderList();
}

async function importCreatures(campaignId) {
  const { data, error } = await db
    .from('creatures').select('*').eq('user_id', currentUserId).order('created_at');
  if (error || !data || data.length === 0) {
    showToast('No creatures found - add them on the Characters page first.', 'info'); return;
  }

  var filtered = data;
  if (campaignId) {
    var map = {};
    try { map = JSON.parse(localStorage.getItem('char-campaign-map-' + currentUserId)) || {}; } catch (e) {}
    filtered = data.filter(function (c) {
      return map['creature:' + c.id] === campaignId;
    });
    if (filtered.length === 0) {
      showToast('No creatures assigned to that campaign.', 'info'); return;
    }
  }

  filtered.forEach(function (c) {
    combatants.push({ name: c.name || 'Unknown Creature',
      init: 0, hp: c.hp || '-', maxHp: c.hp || '-', type: 'creature', conditions: [] });
  });
  showToast('Imported ' + filtered.length + ' creature(s).', 'success');
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
      var isActive = conds.includes(cond.name);
      return '<span class="cond-chip' + (isActive ? ' cond-active' : '') + '"' +
        ' onclick="toggleCondition(' + i + ', \'' + cond.name + '\')"' +
        ' title="' + escapeHtml(cond.effect + (cond.save !== '—' ? ' | Save: ' + cond.save : '')) + '"' +
        '><i class="fi ' + cond.icon + '"></i> ' + cond.name + '</span>';
    }).join('');

    var activeCondInfo = '';
    if (conds.length > 0) {
      activeCondInfo = '<div class="cond-info-list">';
      conds.forEach(function (condName) {
        var condObj = CONDITIONS.find(function (c) { return c.name === condName; });
        if (condObj) {
          activeCondInfo += '<div class="cond-info-row">' +
            '<strong class="cond-info-name"><i class="fi ' + condObj.icon + '"></i> ' + escapeHtml(condObj.name) + '</strong>' +
            '<span class="cond-info-effect">' + escapeHtml(condObj.effect) + '</span>' +
            (condObj.save !== '—' ? '<span class="cond-info-save"><i class="fi fi-rr-dice-d20"></i> ' + escapeHtml(condObj.save) + '</span>' : '') +
            '</div>';
        }
      });
      activeCondInfo += '</div>';
    }

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
              <button class="danger btn-x"
                onclick="removeCombatant(${i})">✕</button>
            </div>
            <div class="init-row-sub">
              <div class="hp-adj">
                <input type="number" id="hp-adj-${i}" placeholder="HP ±" min="0" style="width:64px;" />
                <button onclick="applyDamage(${i})" class="danger btn-x" style="min-width:auto; padding:6px 12px;"><i class="fi fi-rr-sword"></i> Dmg</button>
                <button onclick="applyHeal(${i})" class="secondary btn-x" style="min-width:auto; padding:6px 12px;"><i class="fi fi-rr-heart"></i> Heal</button>
              </div>
              <div class="cond-row">${condChips}</div>
              ${activeCondInfo}
            </div>
          </div>`;
  }).join('');
}
