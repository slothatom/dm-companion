// =============================================
//   stats-generator.js - Ability Score Generator
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
})();

const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

let currentMethod = 'standard';
let currentScores = [];
let pointBuyScores = [8, 8, 8, 8, 8, 8];
let pointBuyRemaining = 27;

const POINT_COSTS = { 8:0, 9:1, 10:2, 11:3, 12:4, 13:5, 14:7, 15:9 };

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function roll4d6DropLowest() {
  const rolls = [rollD6(), rollD6(), rollD6(), rollD6()];
  rolls.sort(function (a, b) { return a - b; });
  return rolls[1] + rolls[2] + rolls[3];
}

function calcModifier(score) {
  return Math.floor((score - 10) / 2);
}

function formatModifier(mod) {
  return mod >= 0 ? '+' + mod : String(mod);
}

function setMethod(method) {
  currentMethod = method;
  document.querySelectorAll('.method-btn').forEach(function (b) { b.classList.remove('active'); });
  var btn = document.querySelector('[data-method="' + method + '"]');
  if (btn) btn.classList.add('active');

  var rerollBtn = document.getElementById('reroll-btn');
  var pointBuyControls = document.getElementById('point-buy-controls');

  if (method === 'standard') {
    rerollBtn.style.display = 'none';
    if (pointBuyControls) pointBuyControls.style.display = 'none';
    currentScores = STANDARD_ARRAY.slice();
    renderScores();
  } else if (method === '4d6') {
    rerollBtn.style.display = '';
    if (pointBuyControls) pointBuyControls.style.display = 'none';
    rerollScores();
  } else if (method === 'pointbuy') {
    rerollBtn.style.display = 'none';
    pointBuyScores = [8, 8, 8, 8, 8, 8];
    pointBuyRemaining = 27;
    renderPointBuy();
  }
}

function rerollScores() {
  currentScores = [];
  for (var i = 0; i < 6; i++) {
    currentScores.push(roll4d6DropLowest());
  }
  currentScores.sort(function (a, b) { return b - a; });
  renderScores();
}

function renderScores() {
  var container = document.getElementById('scores-output');
  var pointBuyControls = document.getElementById('point-buy-controls');
  if (pointBuyControls) pointBuyControls.style.display = 'none';
  container.style.display = '';

  var totalMod = 0;
  var html = '<div class="scores-grid">';
  for (var i = 0; i < 6; i++) {
    var score = currentScores[i];
    var mod = calcModifier(score);
    totalMod += mod;
    html += '<div class="score-card">' +
      '<div class="score-label">' + ABILITIES[i] + '</div>' +
      '<div class="score-value">' + score + '</div>' +
      '<div class="score-mod">' + formatModifier(mod) + '</div>' +
      '</div>';
  }
  html += '</div>';
  html += '<div class="scores-summary">' +
    '<strong>Total:</strong> ' + currentScores.reduce(function (a, b) { return a + b; }, 0) +
    ' &nbsp;|&nbsp; <strong>Total Modifier:</strong> ' + formatModifier(totalMod) +
    '</div>';
  container.innerHTML = html;
}

function renderPointBuy() {
  var container = document.getElementById('scores-output');
  container.style.display = 'none';

  var pointBuyControls = document.getElementById('point-buy-controls');
  if (!pointBuyControls) {
    pointBuyControls = document.createElement('div');
    pointBuyControls.id = 'point-buy-controls';
    container.parentNode.insertBefore(pointBuyControls, container.nextSibling);
  }
  pointBuyControls.style.display = '';

  recalcPointBuy();

  var totalMod = 0;
  var htmlStr = '<div class="point-buy-remaining">Points Remaining: <strong>' + pointBuyRemaining + '</strong> / 27</div>';
  htmlStr += '<div class="scores-grid">';
  for (var i = 0; i < 6; i++) {
    var score = pointBuyScores[i];
    var mod = calcModifier(score);
    totalMod += mod;
    htmlStr += '<div class="score-card">' +
      '<div class="score-label">' + ABILITIES[i] + '</div>' +
      '<div class="pb-controls">' +
        '<button class="pb-btn" onclick="pbAdjust(' + i + ', -1)" ' + (score <= 8 ? 'disabled' : '') + '>−</button>' +
        '<span class="score-value">' + score + '</span>' +
        '<button class="pb-btn" onclick="pbAdjust(' + i + ', 1)" ' + (score >= 15 ? 'disabled' : '') + '>+</button>' +
      '</div>' +
      '<div class="score-mod">' + formatModifier(mod) + '</div>' +
      '</div>';
  }
  htmlStr += '</div>';
  htmlStr += '<div class="scores-summary">' +
    '<strong>Total:</strong> ' + pointBuyScores.reduce(function (a, b) { return a + b; }, 0) +
    ' &nbsp;|&nbsp; <strong>Total Modifier:</strong> ' + formatModifier(totalMod) +
    '</div>';
  pointBuyControls.innerHTML = htmlStr;
}

function recalcPointBuy() {
  var spent = 0;
  for (var i = 0; i < 6; i++) {
    spent += POINT_COSTS[pointBuyScores[i]] || 0;
  }
  pointBuyRemaining = 27 - spent;
}

function pbAdjust(index, delta) {
  var newVal = pointBuyScores[index] + delta;
  if (newVal < 8 || newVal > 15) return;

  var oldCost = POINT_COSTS[pointBuyScores[index]];
  var newCost = POINT_COSTS[newVal];
  var costDiff = newCost - oldCost;

  if (costDiff > pointBuyRemaining) {
    showToast('Not enough points remaining!', 'error');
    return;
  }

  pointBuyScores[index] = newVal;
  renderPointBuy();
}

function copyScores() {
  var scores = currentMethod === 'pointbuy' ? pointBuyScores : currentScores;
  if (!scores || scores.length === 0) { showToast('Generate scores first!', 'info'); return; }

  var lines = [];
  for (var i = 0; i < 6; i++) {
    var mod = calcModifier(scores[i]);
    lines.push(ABILITIES[i] + ': ' + scores[i] + ' (' + formatModifier(mod) + ')');
  }
  navigator.clipboard.writeText(lines.join('\n'))
    .then(function () { showToast('Scores copied!', 'success'); })
    .catch(function () { showToast('Copy failed.', 'error'); });
}
