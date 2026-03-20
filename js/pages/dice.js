// =============================================
//   dice.js — Dice Roller page
// =============================================

let history = [];

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
})();

function roll(sides) {
  const result = Math.floor(Math.random() * sides) + 1;
  displayResult(result, 'd' + sides, [result], 0);
  addToHistory('d' + sides, result, [result], 0);
}

function rollCustom() {
  const num      = parseInt(document.getElementById('num-dice').value)  || 1;
  const sides    = parseInt(document.getElementById('die-type').value)  || 20;
  const modifier = parseInt(document.getElementById('modifier').value)  || 0;

  const rolls = [];
  for (var i = 0; i < num; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }

  const total = rolls.reduce(function (a, b) { return a + b; }, 0) + modifier;
  const label = num + 'd' + sides + (modifier !== 0 ? (modifier > 0 ? '+' : '') + modifier : '');
  displayResult(total, label, rolls, modifier);
  addToHistory(label, total, rolls, modifier);
}

function rollExpression() {
  const raw  = (document.getElementById('dice-expr').value || '').trim();
  if (!raw) return;
  const expr = raw.replace(/\s/g, '').toLowerCase();
  const match = expr.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!match) { showToast('Invalid — try "2d6+3" or "d20"', 'error'); return; }
  const num      = parseInt(match[1]) || 1;
  const sides    = parseInt(match[2]);
  const modifier = parseInt(match[3]) || 0;
  if (num < 1 || num > 20)       { showToast('Use between 1 and 20 dice.', 'error'); return; }
  if (sides < 2 || sides > 1000) { showToast('Die size must be 2–1000.', 'error'); return; }
  const rolls = [];
  for (var i = 0; i < num; i++) rolls.push(Math.floor(Math.random() * sides) + 1);
  const total = rolls.reduce(function (a, b) { return a + b; }, 0) + modifier;
  const label = num + 'd' + sides + (modifier !== 0 ? (modifier > 0 ? '+' : '') + modifier : '');
  displayResult(total, label, rolls, modifier);
  addToHistory(label, total, rolls, modifier);
}

function rollAdvantage() {
  const r1 = Math.floor(Math.random() * 20) + 1;
  const r2 = Math.floor(Math.random() * 20) + 1;
  const total = Math.max(r1, r2);
  displayResult(total, 'd20 adv', [r1, r2], 0);
  addToHistory('d20 adv', total, [r1, r2], 0);
}

function rollDisadvantage() {
  const r1 = Math.floor(Math.random() * 20) + 1;
  const r2 = Math.floor(Math.random() * 20) + 1;
  const total = Math.min(r1, r2);
  displayResult(total, 'd20 dis', [r1, r2], 0);
  addToHistory('d20 dis', total, [r1, r2], 0);
}

function displayResult(total, label, rolls, modifier) {
  const resultEl = document.getElementById('roll-result');
  const labelEl  = document.getElementById('roll-label');

  resultEl.style.opacity = '0';
  setTimeout(function () {
    resultEl.textContent = total;
    resultEl.style.opacity = '1';
  }, 100);

  var detail = label;
  if (rolls.length > 1) detail += ' → [' + rolls.join(', ') + ']';
  if (modifier !== 0)   detail += ' ' + (modifier >= 0 ? '+' : '') + modifier;
  labelEl.textContent = detail;

  // Colour: nat-20 green, nat-1 red, else gold; applies to d20 and adv/dis
  const isD20 = (label === 'd20' || label === 'd20 adv' || label === 'd20 dis');
  if (isD20) {
    if (total === 20)     resultEl.style.color = '#6aaa6a';
    else if (total === 1) resultEl.style.color = '#aa4040';
    else                  resultEl.style.color = '#c9a84c';
  } else {
    resultEl.style.color = '#c9a84c';
  }
}

function addToHistory(label, total, rolls, modifier) {
  history.unshift({ label, total, rolls, modifier });
  if (history.length > 20) history.pop();
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById('roll-history');
  if (history.length === 0) {
    container.innerHTML = '<span style="color:#5a4a30; font-style:italic;">No rolls yet.</span>';
    return;
  }
  container.innerHTML = history.map(function (h) {
    return `<span class="history-chip">${h.label}: <strong>${h.total}</strong></span>`;
  }).join('');
}

function clearHistory() {
  history = [];
  renderHistory();
  document.getElementById('roll-result').textContent = '—';
  document.getElementById('roll-label').textContent  = 'Click a die to roll';
}
