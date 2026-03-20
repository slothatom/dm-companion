// =============================================
//   encounter.js — Encounter Builder page
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

(async function () {
  const user = await requireAuth();
  if (!user) return;
  currentUserId = user.id;
  renderNav(user);
  recalculate();
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
  creatures.push({ name, cr, xp, hp: '', ac: '' });
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
    showToast('No creatures found — add them on the Characters page first.', 'info');
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
            <button class="danger" style="padding:5px 10px; font-size:13px;"
              onclick="removeCreature(${i})">✕</button>
          </div>`;
  }).join('');
  document.getElementById('difficulty-card').style.display = '';
  document.getElementById('send-btn').style.display  = '';
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
    : '1 monster — no multiplier';
  document.getElementById('multiplier-note').textContent = note;
}

function sendToInitiative() {
  if (creatures.length === 0) return;
  const combatants = creatures.map(function (c) {
    return { name: c.name, init: 0, hp: c.hp || '—', maxHp: c.hp || '—', type: 'creature', conditions: [] };
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
