// =============================================
//   dice.js - Dice Roller page
// =============================================

let rollHistory = [];
let isRolling   = false;

// Map die sides to Uicons class names
const dieIconMap = {
  4:   'fi-rr-dice-d4',
  6:   'fi-rr-dice-d6',
  8:   'fi-rr-dice-d8',
  10:  'fi-rr-dice-d10',
  12:  'fi-rr-dice-d12',
  20:  'fi-rr-dice-d20',
  100: 'fi-rr-dice',
};

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
})();

function roll(sides) {
  if (isRolling) return;
  const result = Math.floor(Math.random() * sides) + 1;
  animateRoll(result, 'd' + sides, [result], 0, sides);
  addToHistory('d' + sides, result, [result], 0);
}

function rollCustom() {
  if (isRolling) return;
  const num      = parseInt(document.getElementById('num-dice').value)  || 1;
  const sides    = parseInt(document.getElementById('die-type').value)  || 20;
  const modifier = parseInt(document.getElementById('modifier').value)  || 0;

  const rolls = [];
  for (let i = 0; i < num; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }

  const total = rolls.reduce(function (a, b) { return a + b; }, 0) + modifier;
  const label = num + 'd' + sides + (modifier !== 0 ? (modifier > 0 ? '+' : '') + modifier : '');
  animateRoll(total, label, rolls, modifier, sides);
  addToHistory(label, total, rolls, modifier);
}

function rollExpression() {
  if (isRolling) return;
  const raw  = (document.getElementById('dice-expr').value || '').trim();
  if (!raw) return;
  const expr = raw.replace(/\s/g, '').toLowerCase();
  const match = expr.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!match) { showToast('Invalid - try "2d6+3" or "d20"', 'error'); return; }
  const num      = parseInt(match[1]) || 1;
  const sides    = parseInt(match[2]);
  const modifier = parseInt(match[3]) || 0;
  if (num < 1 || num > 20)       { showToast('Use between 1 and 20 dice.', 'error'); return; }
  if (sides < 2 || sides > 1000) { showToast('Die size must be 2–1000.', 'error'); return; }
  const rolls = [];
  for (let i = 0; i < num; i++) rolls.push(Math.floor(Math.random() * sides) + 1);
  const total = rolls.reduce(function (a, b) { return a + b; }, 0) + modifier;
  const label = num + 'd' + sides + (modifier !== 0 ? (modifier > 0 ? '+' : '') + modifier : '');
  animateRoll(total, label, rolls, modifier, sides);
  addToHistory(label, total, rolls, modifier);
}

function rollAdvantage() {
  if (isRolling) return;
  const r1 = Math.floor(Math.random() * 20) + 1;
  const r2 = Math.floor(Math.random() * 20) + 1;
  const total = Math.max(r1, r2);
  animateRoll(total, 'd20 adv', [r1, r2], 0, 20);
  addToHistory('d20 adv', total, [r1, r2], 0);
}

function rollDisadvantage() {
  if (isRolling) return;
  const r1 = Math.floor(Math.random() * 20) + 1;
  const r2 = Math.floor(Math.random() * 20) + 1;
  const total = Math.min(r1, r2);
  animateRoll(total, 'd20 dis', [r1, r2], 0, 20);
  addToHistory('d20 dis', total, [r1, r2], 0);
}

// ── Visual dice animation ────────────────────────────────

function animateRoll(total, label, rolls, modifier, sides) {
  isRolling = true;

  const visual   = document.getElementById('dice-visual');
  const idleIcon = document.getElementById('dice-idle-icon');
  const numEl    = document.getElementById('dice-number');
  const labelEl  = document.getElementById('roll-label');

  // Reset classes
  visual.className = 'dice-visual';

  // Show the die icon for this die type during roll
  const iconClass = dieIconMap[sides] || 'fi-rr-dice-d20';
  idleIcon.className = 'fi ' + iconClass;
  idleIcon.style.display = '';
  numEl.style.display = 'none';

  // Build detail text
  let detail = label;
  if (rolls.length > 1) detail += ' → [' + rolls.join(', ') + ']';
  if (modifier !== 0)   detail += ' ' + (modifier >= 0 ? '+' : '') + modifier;

  // Phase 1: Tumble with random numbers flashing
  visual.classList.add('rolling');
  labelEl.textContent = 'Rolling...';

  let flashCount = 0;
  const flashInterval = setInterval(function () {
    const rand = Math.floor(Math.random() * sides) + 1;
    idleIcon.style.display = 'none';
    numEl.style.display = '';
    numEl.textContent = rand;
    numEl.style.color = 'var(--text-dim)';
    flashCount++;
  }, 80);

  // Phase 2: Land and show result
  setTimeout(function () {
    clearInterval(flashInterval);
    visual.classList.remove('rolling');

    // Show final number
    numEl.textContent = total;
    numEl.style.display = '';
    idleIcon.style.display = 'none';

    // Determine crit status for d20 rolls
    const isD20 = (label === 'd20' || label === 'd20 adv' || label === 'd20 dis');

    if (isD20 && total === 20) {
      numEl.style.color = '';
      visual.classList.add('landed', 'crit-success');
      labelEl.textContent = 'NATURAL 20! ' + detail;
    } else if (isD20 && total === 1) {
      numEl.style.color = '';
      visual.classList.add('landed', 'crit-fail');
      labelEl.textContent = 'Natural 1... ' + detail;
    } else {
      numEl.style.color = '';
      visual.classList.add('landed');
      labelEl.textContent = detail;
    }

    isRolling = false;
  }, 600);
}

// ── History ──────────────────────────────────────────────

function addToHistory(label, total, rolls, modifier) {
  rollHistory.unshift({ label, total, rolls, modifier });
  if (rollHistory.length > 20) rollHistory.pop();
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById('roll-history');
  if (rollHistory.length === 0) {
    container.innerHTML = '<span style="color:var(--text-dim); font-style:italic;">No rolls yet.</span>';
    return;
  }
  container.innerHTML = rollHistory.map(function (h) {
    return '<span class="history-chip">' + escapeHtml(h.label) + ': <strong>' + h.total + '</strong></span>';
  }).join('');
}

function clearHistory() {
  rollHistory = [];
  renderHistory();

  const visual   = document.getElementById('dice-visual');
  const idleIcon = document.getElementById('dice-idle-icon');
  const numEl    = document.getElementById('dice-number');
  const labelEl  = document.getElementById('roll-label');

  visual.className = 'dice-visual';
  idleIcon.className = 'fi fi-rr-dice-d20';
  idleIcon.style.display = '';
  numEl.style.display = 'none';
  labelEl.textContent = 'Click a die to roll';
}
