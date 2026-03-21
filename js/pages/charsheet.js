// =============================================
//   charsheet.js - Character Sheet page
// =============================================

let currentUserId = null;
let sheets        = [];   // [{id, name, data}, ...]
let activeSheetId = null;
let isDirty       = false;
let autosaveTimer = null;
let playersList   = [];   // for linking

const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

const SKILLS = [
  { name: 'Acrobatics',      ability: 'DEX' },
  { name: 'Animal Handling',  ability: 'WIS' },
  { name: 'Arcana',          ability: 'INT' },
  { name: 'Athletics',       ability: 'STR' },
  { name: 'Deception',       ability: 'CHA' },
  { name: 'History',         ability: 'INT' },
  { name: 'Insight',         ability: 'WIS' },
  { name: 'Intimidation',    ability: 'CHA' },
  { name: 'Investigation',   ability: 'INT' },
  { name: 'Medicine',        ability: 'WIS' },
  { name: 'Nature',          ability: 'INT' },
  { name: 'Perception',      ability: 'WIS' },
  { name: 'Performance',     ability: 'CHA' },
  { name: 'Persuasion',      ability: 'CHA' },
  { name: 'Religion',        ability: 'INT' },
  { name: 'Sleight of Hand', ability: 'DEX' },
  { name: 'Stealth',         ability: 'DEX' },
  { name: 'Survival',        ability: 'WIS' },
];

setupDirtyGuard(function () { return isDirty; });

(async function () {
  try {
    var user = await requireAuth();
    if (!user) return;
    currentUserId = user.id;
    renderNav(user);
    await loadPlayers();
    loadSheets();
    renderAbilities();
    renderSaves();
    renderSkills();

    // If opened with ?player=ID, auto-select or create sheet
    var params = new URLSearchParams(window.location.search);
    var linkedPlayer = params.get('player');
    if (linkedPlayer) {
      var existing = sheets.find(function (s) { return s.data.linkedPlayer === linkedPlayer; });
      if (existing) {
        document.getElementById('sheet-select').value = existing.id;
        loadSheet(existing.id);
      } else {
        var pl = playersList.find(function (p) { return p.id === linkedPlayer; });
        createNewSheet(pl || null, linkedPlayer);
      }
    }
  } catch (err) {
    showToast('Failed to load character sheets: ' + err.message, 'error');
  }
})();

// ── Players for linking ─────────────────────────────────

async function loadPlayers() {
  var result = await db.from('players').select('id, player_name, char_name').eq('user_id', currentUserId).order('created_at');
  playersList = result.data || [];
}

function renderPlayerDropdown(selectedId) {
  var sel = document.getElementById('cs-linked-player');
  sel.innerHTML = '<option value="">None (standalone)</option>';
  playersList.forEach(function (p) {
    var opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = (p.char_name || 'Unnamed') + (p.player_name ? ' (' + p.player_name + ')' : '');
    if (p.id === selectedId) opt.selected = true;
    sel.appendChild(opt);
  });
}

// ── Sheet storage (localStorage) ────────────────────────

function getSheetsKey() {
  return 'charsheets-' + currentUserId;
}

function loadSheets() {
  try {
    sheets = JSON.parse(localStorage.getItem(getSheetsKey())) || [];
  } catch (e) {
    sheets = [];
  }
  renderSheetSelect();
}

function persistSheets() {
  localStorage.setItem(getSheetsKey(), JSON.stringify(sheets));
}

function renderSheetSelect() {
  var sel = document.getElementById('sheet-select');
  var cur = sel.value;
  sel.innerHTML = '<option value="">- Select a sheet -</option>';
  sheets.forEach(function (s) {
    var opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.data.name || 'Unnamed Character';
    sel.appendChild(opt);
  });
  if (cur) sel.value = cur;
}

// ── Create / Switch / Delete ────────────────────────────

function createNewSheet(playerData, linkedId) {
  var id = 'cs-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
  var data = emptySheetData();

  if (playerData) {
    data.name       = playerData.char_name || '';
    data.player     = playerData.player_name || '';
    data.linkedPlayer = linkedId || '';
  }

  sheets.push({ id: id, data: data });
  persistSheets();
  renderSheetSelect();
  document.getElementById('sheet-select').value = id;
  loadSheet(id);
  showToast('New character sheet created.', 'success');
}

function switchSheet() {
  var id = document.getElementById('sheet-select').value;
  if (!id) {
    document.getElementById('sheet-form').style.display = 'none';
    document.getElementById('delete-sheet-btn').style.display = 'none';
    activeSheetId = null;
    return;
  }
  loadSheet(id);
}

function deleteSheet() {
  if (!activeSheetId) return;
  var sheet = sheets.find(function (s) { return s.id === activeSheetId; });
  var name = sheet ? (sheet.data.name || 'this sheet') : 'this sheet';
  showConfirm({
    title: 'Delete Character Sheet',
    message: 'Delete "' + name + '"? This cannot be undone.',
    confirmText: 'Delete',
    danger: true,
    onConfirm: function () {
      sheets = sheets.filter(function (s) { return s.id !== activeSheetId; });
      persistSheets();
      activeSheetId = null;
      renderSheetSelect();
      document.getElementById('sheet-select').value = '';
      document.getElementById('sheet-form').style.display = 'none';
      document.getElementById('delete-sheet-btn').style.display = 'none';
      showToast('Sheet deleted.', 'info');
    }
  });
}

// ── Load / Save sheet ───────────────────────────────────

function loadSheet(id) {
  activeSheetId = id;
  var sheet = sheets.find(function (s) { return s.id === id; });
  if (!sheet) return;

  var d = sheet.data;

  document.getElementById('sheet-form').style.display = '';
  document.getElementById('delete-sheet-btn').style.display = '';

  // Identity
  document.getElementById('cs-name').value        = d.name || '';
  document.getElementById('cs-player').value      = d.player || '';
  document.getElementById('cs-class-level').value = d.classLevel || '';
  document.getElementById('cs-race').value        = d.race || '';
  document.getElementById('cs-background').value  = d.background || '';
  document.getElementById('cs-alignment').value   = d.alignment || '';
  document.getElementById('cs-xp').value          = d.xp || '';
  renderPlayerDropdown(d.linkedPlayer || '');

  // Abilities
  ABILITIES.forEach(function (ab) {
    var input = document.getElementById('cs-ab-' + ab);
    if (input) input.value = d.abilities[ab] || '';
    updateAbilityMod(ab);
  });

  // Saves
  ABILITIES.forEach(function (ab) {
    var cb = document.getElementById('cs-save-prof-' + ab);
    var input = document.getElementById('cs-save-mod-' + ab);
    if (cb) cb.checked = !!(d.saves && d.saves[ab] && d.saves[ab].prof);
    if (input) input.value = (d.saves && d.saves[ab] && d.saves[ab].mod) || '';
  });

  // Skills
  SKILLS.forEach(function (sk) {
    var key = sk.name.replace(/\s+/g, '');
    var cb = document.getElementById('cs-skill-prof-' + key);
    var input = document.getElementById('cs-skill-mod-' + key);
    if (cb) cb.checked = !!(d.skills && d.skills[key] && d.skills[key].prof);
    if (input) input.value = (d.skills && d.skills[key] && d.skills[key].mod) || '';
  });

  // Combat
  document.getElementById('cs-ac').value         = d.ac || '';
  document.getElementById('cs-initiative').value = d.initiative || '';
  document.getElementById('cs-speed').value      = d.speed || '';
  document.getElementById('cs-hp-max').value     = d.hpMax || '';
  document.getElementById('cs-hp-current').value = d.hpCurrent || '';
  document.getElementById('cs-hp-temp').value    = d.hpTemp || '';
  document.getElementById('cs-hit-dice').value   = d.hitDice || '';
  document.getElementById('cs-prof-bonus').value = d.profBonus || '';

  // Attacks
  renderAttacks(d.attacks || []);

  // Equipment
  document.getElementById('cs-cp').value        = d.cp || 0;
  document.getElementById('cs-sp').value        = d.sp || 0;
  document.getElementById('cs-gp').value        = d.gp || 0;
  document.getElementById('cs-pp').value        = d.pp || 0;
  document.getElementById('cs-equipment').value = d.equipment || '';

  // Proficiencies, features, backstory
  document.getElementById('cs-proficiencies').value = d.proficiencies || '';
  document.getElementById('cs-features').value      = d.features || '';
  document.getElementById('cs-personality').value   = d.personality || '';
  document.getElementById('cs-ideals').value        = d.ideals || '';
  document.getElementById('cs-bonds').value         = d.bonds || '';
  document.getElementById('cs-flaws').value         = d.flaws || '';
  document.getElementById('cs-backstory').value     = d.backstory || '';

  isDirty = false;
}

function gatherSheetData() {
  var d = {};
  d.name       = document.getElementById('cs-name').value;
  d.player     = document.getElementById('cs-player').value;
  d.classLevel = document.getElementById('cs-class-level').value;
  d.race       = document.getElementById('cs-race').value;
  d.background = document.getElementById('cs-background').value;
  d.alignment  = document.getElementById('cs-alignment').value;
  d.xp         = document.getElementById('cs-xp').value;
  d.linkedPlayer = document.getElementById('cs-linked-player').value;

  d.abilities = {};
  ABILITIES.forEach(function (ab) {
    d.abilities[ab] = document.getElementById('cs-ab-' + ab).value;
  });

  d.saves = {};
  ABILITIES.forEach(function (ab) {
    d.saves[ab] = {
      prof: document.getElementById('cs-save-prof-' + ab).checked,
      mod:  document.getElementById('cs-save-mod-' + ab).value
    };
  });

  d.skills = {};
  SKILLS.forEach(function (sk) {
    var key = sk.name.replace(/\s+/g, '');
    d.skills[key] = {
      prof: document.getElementById('cs-skill-prof-' + key).checked,
      mod:  document.getElementById('cs-skill-mod-' + key).value
    };
  });

  d.ac         = document.getElementById('cs-ac').value;
  d.initiative = document.getElementById('cs-initiative').value;
  d.speed      = document.getElementById('cs-speed').value;
  d.hpMax      = document.getElementById('cs-hp-max').value;
  d.hpCurrent  = document.getElementById('cs-hp-current').value;
  d.hpTemp     = document.getElementById('cs-hp-temp').value;
  d.hitDice    = document.getElementById('cs-hit-dice').value;
  d.profBonus  = document.getElementById('cs-prof-bonus').value;

  d.attacks = gatherAttacks();

  d.cp        = document.getElementById('cs-cp').value;
  d.sp        = document.getElementById('cs-sp').value;
  d.gp        = document.getElementById('cs-gp').value;
  d.pp        = document.getElementById('cs-pp').value;
  d.equipment = document.getElementById('cs-equipment').value;

  d.proficiencies = document.getElementById('cs-proficiencies').value;
  d.features      = document.getElementById('cs-features').value;
  d.personality   = document.getElementById('cs-personality').value;
  d.ideals        = document.getElementById('cs-ideals').value;
  d.bonds         = document.getElementById('cs-bonds').value;
  d.flaws         = document.getElementById('cs-flaws').value;
  d.backstory     = document.getElementById('cs-backstory').value;

  return d;
}

function saveSheet() {
  if (!activeSheetId) return;
  clearTimeout(autosaveTimer);

  var sheet = sheets.find(function (s) { return s.id === activeSheetId; });
  if (!sheet) return;

  sheet.data = gatherSheetData();
  persistSheets();
  renderSheetSelect();
  document.getElementById('sheet-select').value = activeSheetId;

  isDirty = false;
  showSaved();
  showToast('Sheet saved.', 'success');
}

function sheetDirty() {
  isDirty = true;
  markUnsaved();
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(saveSheet, 3000);
}

function emptySheetData() {
  return {
    name: '', player: '', classLevel: '', race: '', background: '',
    alignment: '', xp: '', linkedPlayer: '',
    abilities: { STR: '', DEX: '', CON: '', INT: '', WIS: '', CHA: '' },
    saves: {},
    skills: {},
    ac: '', initiative: '', speed: '', hpMax: '', hpCurrent: '', hpTemp: '',
    hitDice: '', profBonus: '',
    attacks: [],
    cp: 0, sp: 0, gp: 0, pp: 0, equipment: '',
    proficiencies: '', features: '',
    personality: '', ideals: '', bonds: '', flaws: '', backstory: ''
  };
}

// ── Ability scores rendering ────────────────────────────

function renderAbilities() {
  var html = ABILITIES.map(function (ab) {
    return '<div class="cs-ability-box">' +
      '<div class="cs-ability-label">' + ab + '</div>' +
      '<input type="number" id="cs-ab-' + ab + '" class="cs-ability-score" ' +
        'oninput="updateAbilityMod(\'' + ab + '\'); sheetDirty()" placeholder="10" />' +
      '<div class="cs-ability-mod" id="cs-mod-' + ab + '">+0</div>' +
    '</div>';
  }).join('');
  document.getElementById('cs-abilities').innerHTML = html;
}

function updateAbilityMod(ab) {
  var input = document.getElementById('cs-ab-' + ab);
  var modEl = document.getElementById('cs-mod-' + ab);
  var val = parseInt(input.value, 10);
  if (isNaN(val)) { modEl.textContent = '-'; return; }
  var mod = Math.floor((val - 10) / 2);
  modEl.textContent = (mod >= 0 ? '+' : '') + mod;
}

// ── Saving throws rendering ─────────────────────────────

function renderSaves() {
  var html = ABILITIES.map(function (ab) {
    return '<div class="cs-save-row">' +
      '<input type="checkbox" id="cs-save-prof-' + ab + '" onchange="sheetDirty()" />' +
      '<input type="text" id="cs-save-mod-' + ab + '" class="cs-small-input" oninput="sheetDirty()" placeholder="+0" />' +
      '<span class="cs-save-label">' + ab + '</span>' +
    '</div>';
  }).join('');
  document.getElementById('cs-saves').innerHTML = html;
}

// ── Skills rendering ────────────────────────────────────

function renderSkills() {
  var html = SKILLS.map(function (sk) {
    var key = sk.name.replace(/\s+/g, '');
    return '<div class="cs-skill-row">' +
      '<input type="checkbox" id="cs-skill-prof-' + key + '" onchange="sheetDirty()" />' +
      '<input type="text" id="cs-skill-mod-' + key + '" class="cs-small-input" oninput="sheetDirty()" placeholder="+0" />' +
      '<span class="cs-skill-label">' + sk.name + ' <span class="cs-skill-ability">(' + sk.ability + ')</span></span>' +
    '</div>';
  }).join('');
  document.getElementById('cs-skills').innerHTML = html;
}

// ── Attacks ─────────────────────────────────────────────

function renderAttacks(attacks) {
  var el = document.getElementById('cs-attacks-list');
  if (!attacks || attacks.length === 0) {
    el.innerHTML = '<p class="empty-state">No attacks added yet.</p>';
    return;
  }
  el.innerHTML = attacks.map(function (a, i) {
    return '<div class="cs-attack-row">' +
      '<input type="text" value="' + escapeHtml(a.name || '') + '" placeholder="Weapon" ' +
        'onchange="updateAttack(' + i + ', \'name\', this.value)" style="flex:2;" />' +
      '<input type="text" value="' + escapeHtml(a.bonus || '') + '" placeholder="+5" ' +
        'onchange="updateAttack(' + i + ', \'bonus\', this.value)" style="flex:1; max-width:60px;" />' +
      '<input type="text" value="' + escapeHtml(a.damage || '') + '" placeholder="1d8+3 slashing" ' +
        'onchange="updateAttack(' + i + ', \'damage\', this.value)" style="flex:2;" />' +
      '<button class="danger" onclick="removeAttack(' + i + ')" style="padding:5px 10px;">x</button>' +
    '</div>';
  }).join('');
}

function addAttack() {
  var sheet = sheets.find(function (s) { return s.id === activeSheetId; });
  if (!sheet) return;
  var d = gatherSheetData();
  d.attacks.push({ name: '', bonus: '', damage: '' });
  sheet.data = d;
  renderAttacks(d.attacks);
  sheetDirty();
}

function updateAttack(index, field, value) {
  sheetDirty();
}

function removeAttack(index) {
  var sheet = sheets.find(function (s) { return s.id === activeSheetId; });
  if (!sheet) return;
  var d = gatherSheetData();
  d.attacks.splice(index, 1);
  sheet.data = d;
  renderAttacks(d.attacks);
  sheetDirty();
}

function gatherAttacks() {
  var rows = document.querySelectorAll('#cs-attacks-list .cs-attack-row');
  var attacks = [];
  rows.forEach(function (row) {
    var inputs = row.querySelectorAll('input');
    attacks.push({
      name:   inputs[0] ? inputs[0].value : '',
      bonus:  inputs[1] ? inputs[1].value : '',
      damage: inputs[2] ? inputs[2].value : ''
    });
  });
  return attacks;
}
