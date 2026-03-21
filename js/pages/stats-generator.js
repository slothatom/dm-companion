// =============================================
//   stats-generator.js - Ability Score Generator
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
  setMethod('4d6');
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

// =============================================
//   Character Builder - Recommended Stats
// =============================================

var CLASS_PRIORITIES = {
  Fighter:   ['STR','CON','DEX','WIS','CHA','INT'],
  Barbarian: ['STR','CON','DEX','WIS','CHA','INT'],
  Paladin:   ['STR','CHA','CON','WIS','DEX','INT'],
  Ranger:    ['DEX','WIS','CON','STR','INT','CHA'],
  Monk:      ['DEX','WIS','CON','STR','INT','CHA'],
  Rogue:     ['DEX','INT','CON','CHA','WIS','STR'],
  Bard:      ['CHA','DEX','CON','WIS','INT','STR'],
  Cleric:    ['WIS','CON','STR','CHA','DEX','INT'],
  Druid:     ['WIS','CON','DEX','INT','CHA','STR'],
  Sorcerer:  ['CHA','CON','DEX','WIS','INT','STR'],
  Warlock:   ['CHA','CON','DEX','WIS','INT','STR'],
  Wizard:    ['INT','CON','DEX','WIS','CHA','STR']
};

var RACIAL_BONUSES = {
  Human:      { STR:1, DEX:1, CON:1, INT:1, WIS:1, CHA:1 },
  Elf:        { DEX:2 },
  Dwarf:      { CON:2 },
  Halfling:   { DEX:2 },
  Gnome:      { INT:2 },
  'Half-Elf': { CHA:2, _choose2:1 },
  'Half-Orc': { STR:2, CON:1 },
  Tiefling:   { CHA:2, INT:1 },
  Dragonborn: { STR:2, CHA:1 }
};

function getProficiencyBonus(level) {
  return Math.ceil(level / 4) + 1;
}

function generateRecommended() {
  var cls = document.getElementById('char-class').value;
  var species = document.getElementById('char-species').value;
  var level = parseInt(document.getElementById('char-level').value, 10);

  if (isNaN(level) || level < 1 || level > 20) {
    showToast('Level must be between 1 and 20.', 'error');
    return;
  }

  var priorities = CLASS_PRIORITIES[cls];
  if (!priorities) { showToast('Unknown class.', 'error'); return; }

  // Roll 4d6 drop lowest x6 and sort descending
  var rolled = [];
  for (var i = 0; i < 6; i++) {
    rolled.push(roll4d6DropLowest());
  }
  rolled.sort(function (a, b) { return b - a; });

  // Assign scores by class priority
  var assigned = {};
  for (var j = 0; j < 6; j++) {
    assigned[priorities[j]] = rolled[j];
  }

  // Apply racial bonuses
  var bonuses = RACIAL_BONUSES[species] || {};
  var isHalfElf = species === 'Half-Elf';

  for (var ab in bonuses) {
    if (ab === '_choose2') continue;
    if (assigned[ab] !== undefined) {
      assigned[ab] += bonuses[ab];
    }
  }

  // Half-Elf: +1 to two abilities that aren't CHA, chosen by class priority
  if (isHalfElf) {
    var chosen = 0;
    for (var p = 0; p < priorities.length && chosen < 2; p++) {
      var ability = priorities[p];
      if (ability !== 'CHA') {
        assigned[ability] += 1;
        chosen++;
      }
    }
  }

  var profBonus = getProficiencyBonus(level);

  // Render
  var container = document.getElementById('builder-output');
  var totalMod = 0;
  var html = '<div class="scores-grid">';
  for (var k = 0; k < ABILITIES.length; k++) {
    var ab2 = ABILITIES[k];
    var score = assigned[ab2];
    var mod = calcModifier(score);
    totalMod += mod;
    html += '<div class="score-card">' +
      '<div class="score-label">' + escapeHtml(ab2) + '</div>' +
      '<div class="score-value">' + score + '</div>' +
      '<div class="score-mod">' + formatModifier(mod) + '</div>' +
      '</div>';
  }
  html += '</div>';
  html += '<div class="scores-summary">' +
    '<strong>' + escapeHtml(species) + ' ' + escapeHtml(cls) + '</strong> &mdash; Level ' + level +
    ' &nbsp;|&nbsp; Proficiency Bonus: <strong>' + formatModifier(profBonus) + '</strong>' +
    ' &nbsp;|&nbsp; Total: <strong>' + ABILITIES.reduce(function (s, a) { return s + assigned[a]; }, 0) + '</strong>' +
    ' &nbsp;|&nbsp; Total Modifier: <strong>' + formatModifier(totalMod) + '</strong>' +
    '</div>';
  container.innerHTML = html;
  showToast('Recommended scores generated!', 'success');
}

// =============================================
//   Monster / NPC Stats by CR
// =============================================

var CR_TABLE = [
  { cr:0,     prof:2, ac:13, hpMin:1,   hpMax:6,   atk:3,  dmgMin:0,   dmgMax:1,   dc:13 },
  { cr:0.125, prof:2, ac:13, hpMin:7,   hpMax:35,  atk:3,  dmgMin:2,   dmgMax:3,   dc:13 },
  { cr:0.25,  prof:2, ac:13, hpMin:36,  hpMax:49,  atk:3,  dmgMin:4,   dmgMax:5,   dc:13 },
  { cr:0.5,   prof:2, ac:13, hpMin:50,  hpMax:70,  atk:3,  dmgMin:6,   dmgMax:8,   dc:13 },
  { cr:1,     prof:2, ac:13, hpMin:71,  hpMax:85,  atk:3,  dmgMin:9,   dmgMax:14,  dc:13 },
  { cr:2,     prof:2, ac:13, hpMin:86,  hpMax:100, atk:3,  dmgMin:15,  dmgMax:20,  dc:13 },
  { cr:3,     prof:2, ac:13, hpMin:101, hpMax:115, atk:4,  dmgMin:21,  dmgMax:26,  dc:13 },
  { cr:4,     prof:2, ac:14, hpMin:116, hpMax:130, atk:5,  dmgMin:27,  dmgMax:32,  dc:14 },
  { cr:5,     prof:3, ac:15, hpMin:131, hpMax:145, atk:6,  dmgMin:33,  dmgMax:38,  dc:15 },
  { cr:6,     prof:3, ac:15, hpMin:146, hpMax:160, atk:6,  dmgMin:39,  dmgMax:44,  dc:15 },
  { cr:7,     prof:3, ac:15, hpMin:161, hpMax:175, atk:6,  dmgMin:45,  dmgMax:50,  dc:15 },
  { cr:8,     prof:3, ac:16, hpMin:176, hpMax:190, atk:7,  dmgMin:51,  dmgMax:56,  dc:16 },
  { cr:9,     prof:4, ac:16, hpMin:191, hpMax:205, atk:7,  dmgMin:57,  dmgMax:62,  dc:16 },
  { cr:10,    prof:4, ac:17, hpMin:206, hpMax:220, atk:7,  dmgMin:63,  dmgMax:68,  dc:16 },
  { cr:11,    prof:4, ac:17, hpMin:221, hpMax:235, atk:8,  dmgMin:69,  dmgMax:74,  dc:17 },
  { cr:12,    prof:4, ac:17, hpMin:236, hpMax:250, atk:8,  dmgMin:75,  dmgMax:80,  dc:17 },
  { cr:13,    prof:5, ac:18, hpMin:251, hpMax:265, atk:8,  dmgMin:81,  dmgMax:86,  dc:18 },
  { cr:14,    prof:5, ac:18, hpMin:266, hpMax:280, atk:8,  dmgMin:87,  dmgMax:92,  dc:18 },
  { cr:15,    prof:5, ac:18, hpMin:281, hpMax:295, atk:8,  dmgMin:93,  dmgMax:98,  dc:18 },
  { cr:16,    prof:5, ac:18, hpMin:296, hpMax:310, atk:9,  dmgMin:99,  dmgMax:104, dc:18 },
  { cr:17,    prof:6, ac:19, hpMin:311, hpMax:325, atk:9,  dmgMin:107, dmgMax:112, dc:19 },
  { cr:18,    prof:6, ac:19, hpMin:326, hpMax:340, atk:10, dmgMin:113, dmgMax:118, dc:19 },
  { cr:19,    prof:6, ac:19, hpMin:341, hpMax:355, atk:10, dmgMin:119, dmgMax:124, dc:19 },
  { cr:20,    prof:6, ac:19, hpMin:356, hpMax:400, atk:10, dmgMin:132, dmgMax:140, dc:19 },
  { cr:21,    prof:7, ac:19, hpMin:401, hpMax:415, atk:11, dmgMin:141, dmgMax:150, dc:20 },
  { cr:22,    prof:7, ac:19, hpMin:416, hpMax:430, atk:11, dmgMin:151, dmgMax:160, dc:20 },
  { cr:23,    prof:7, ac:19, hpMin:431, hpMax:445, atk:11, dmgMin:161, dmgMax:170, dc:20 },
  { cr:24,    prof:7, ac:19, hpMin:446, hpMax:460, atk:12, dmgMin:165, dmgMax:175, dc:21 },
  { cr:25,    prof:8, ac:19, hpMin:461, hpMax:475, atk:12, dmgMin:176, dmgMax:185, dc:21 },
  { cr:26,    prof:8, ac:19, hpMin:476, hpMax:490, atk:12, dmgMin:186, dmgMax:195, dc:21 },
  { cr:27,    prof:8, ac:19, hpMin:491, hpMax:505, atk:13, dmgMin:196, dmgMax:205, dc:22 },
  { cr:28,    prof:8, ac:19, hpMin:506, hpMax:520, atk:13, dmgMin:206, dmgMax:215, dc:22 },
  { cr:29,    prof:9, ac:19, hpMin:521, hpMax:535, atk:13, dmgMin:216, dmgMax:225, dc:22 },
  { cr:30,    prof:9, ac:19, hpMin:536, hpMax:550, atk:14, dmgMin:215, dmgMax:225, dc:23 }
];

function getCREntry(cr) {
  for (var i = 0; i < CR_TABLE.length; i++) {
    if (CR_TABLE[i].cr === cr) return CR_TABLE[i];
  }
  // Fallback: find nearest
  var closest = CR_TABLE[0];
  for (var j = 1; j < CR_TABLE.length; j++) {
    if (Math.abs(CR_TABLE[j].cr - cr) < Math.abs(closest.cr - cr)) {
      closest = CR_TABLE[j];
    }
  }
  return closest;
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatCR(cr) {
  if (cr === 0.125) return '1/8';
  if (cr === 0.25) return '1/4';
  if (cr === 0.5) return '1/2';
  return String(cr);
}

function generateMonsterStats() {
  var crVal = parseFloat(document.getElementById('monster-cr').value);
  var entry = getCREntry(crVal);

  // Determine stat ranges based on CR tier
  var primaryMin, primaryMax, secondaryMin, secondaryMax;

  if (crVal === 0) {
    primaryMin = 10; primaryMax = 10;
    secondaryMin = 10; secondaryMax = 10;
  } else if (crVal <= 0.25) {
    primaryMin = 13; primaryMax = 13;
    secondaryMin = 10; secondaryMax = 12;
  } else if (crVal <= 4) {
    primaryMin = 14; primaryMax = 16;
    secondaryMin = 10; secondaryMax = 13;
  } else if (crVal <= 10) {
    primaryMin = 16; primaryMax = 18;
    secondaryMin = 12; secondaryMax = 14;
  } else if (crVal <= 16) {
    primaryMin = 18; primaryMax = 20;
    secondaryMin = 14; secondaryMax = 16;
  } else if (crVal <= 20) {
    primaryMin = 20; primaryMax = 22;
    secondaryMin = 16; secondaryMax = 18;
  } else {
    primaryMin = 22; primaryMax = 24;
    secondaryMin = 18; secondaryMax = 20;
  }

  // Generate 6 scores: first 2 are primary, rest are secondary
  var scores = [];
  scores.push(randomInRange(primaryMin, primaryMax));   // STR (primary)
  scores.push(randomInRange(secondaryMin, secondaryMax)); // DEX
  scores.push(randomInRange(primaryMin > secondaryMin ? secondaryMin + 1 : secondaryMin, primaryMax > secondaryMax ? secondaryMax + 1 : secondaryMax)); // CON (slightly higher secondary)
  scores.push(randomInRange(secondaryMin, secondaryMax)); // INT
  scores.push(randomInRange(secondaryMin, secondaryMax)); // WIS
  scores.push(randomInRange(secondaryMin, secondaryMax)); // CHA

  // Render
  var container = document.getElementById('monster-output');
  var totalMod = 0;
  var html = '<div class="scores-grid">';
  for (var i = 0; i < ABILITIES.length; i++) {
    var score = scores[i];
    var mod = calcModifier(score);
    totalMod += mod;
    html += '<div class="score-card">' +
      '<div class="score-label">' + escapeHtml(ABILITIES[i]) + '</div>' +
      '<div class="score-value">' + score + '</div>' +
      '<div class="score-mod">' + formatModifier(mod) + '</div>' +
      '</div>';
  }
  html += '</div>';

  // Summary table
  html += '<table class="monster-summary-table" style="width:100%;border-collapse:collapse;margin-top:16px;font-size:0.95rem;">' +
    '<thead><tr style="border-bottom:2px solid var(--border);text-align:left;">' +
    '<th style="padding:8px;">CR</th>' +
    '<th style="padding:8px;">Prof Bonus</th>' +
    '<th style="padding:8px;">Suggested AC</th>' +
    '<th style="padding:8px;">HP Range</th>' +
    '<th style="padding:8px;">Attack Bonus</th>' +
    '<th style="padding:8px;">Save DC</th>' +
    '</tr></thead>' +
    '<tbody><tr style="border-bottom:1px solid var(--border);">' +
    '<td style="padding:8px;font-weight:600;">' + escapeHtml(formatCR(entry.cr)) + '</td>' +
    '<td style="padding:8px;">' + formatModifier(entry.prof) + '</td>' +
    '<td style="padding:8px;">' + entry.ac + '</td>' +
    '<td style="padding:8px;">' + entry.hpMin + '&ndash;' + entry.hpMax + '</td>' +
    '<td style="padding:8px;">' + formatModifier(entry.atk) + '</td>' +
    '<td style="padding:8px;">' + entry.dc + '</td>' +
    '</tr></tbody></table>';

  html += '<div class="scores-summary" style="margin-top:12px;">' +
    '<strong>Damage/Round:</strong> ' + entry.dmgMin + '&ndash;' + entry.dmgMax +
    ' &nbsp;|&nbsp; <strong>Total Modifier:</strong> ' + formatModifier(totalMod) +
    '</div>';

  container.innerHTML = html;
  showToast('Monster stats generated for CR ' + formatCR(entry.cr) + '!', 'success');
}
