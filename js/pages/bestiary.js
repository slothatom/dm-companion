// =============================================
//   bestiary.js - Monster / Bestiary Reference (API-powered)
// =============================================

let allMonsters   = [];
let activeCrRange = 'all';
let activeMonType = 'all';

(async function () {
  var user = await requireAuth();
  if (!user) return;
  renderNav(user);

  DndApi.showLoading('bestiary-list');

  try {
    allMonsters = await DndApi.fetchMonsters();
    if (allMonsters.length === 0 && typeof MONSTERS !== 'undefined') {
      allMonsters = MONSTERS;
    }
    renderBestiary(allMonsters);
    document.querySelector('.subtitle').textContent =
      'Monster stat blocks - ' + allMonsters.length + ' creatures. Search by name, filter by type and challenge rating.';
  } catch (err) {
    if (typeof MONSTERS !== 'undefined' && MONSTERS.length > 0) {
      allMonsters = MONSTERS;
      renderBestiary(allMonsters);
      showToast('Using offline monster data (API unavailable)', 'info');
    } else {
      DndApi.showError('bestiary-list', err.message);
    }
  }
})();

function setCrRange(range, btn) {
  activeCrRange = range;
  document.querySelectorAll('#cr-filters .filter-btn').forEach(function (b) {
    b.classList.remove('active-filter');
  });
  btn.classList.add('active-filter');
  filterBestiary();
}

function setMonType(type, btn) {
  activeMonType = type;
  document.querySelectorAll('#type-filters .filter-btn').forEach(function (b) {
    b.classList.remove('active-filter');
  });
  btn.classList.add('active-filter');
  filterBestiary();
}

function crToNumber(cr) {
  if (cr === '1/8') return 0.125;
  if (cr === '1/4') return 0.25;
  if (cr === '1/2') return 0.5;
  return parseFloat(cr) || 0;
}

function filterBestiary() {
  var q = document.getElementById('bestiary-search').value.toLowerCase();
  var filtered = allMonsters.filter(function (m) {
    var matchesSearch = !q || m.name.toLowerCase().includes(q) ||
      (m.type && m.type.toLowerCase().includes(q));

    var matchesCr = true;
    if (activeCrRange !== 'all') {
      var crNum = crToNumber(m.cr);
      if (activeCrRange === '0')       matchesCr = crNum === 0;
      else if (activeCrRange === 'low')  matchesCr = crNum > 0 && crNum <= 1;
      else if (activeCrRange === 'mid')  matchesCr = crNum >= 2 && crNum <= 5;
      else if (activeCrRange === 'high') matchesCr = crNum >= 6 && crNum <= 10;
      else if (activeCrRange === 'epic') matchesCr = crNum >= 11;
    }

    var matchesType = true;
    if (activeMonType !== 'all') {
      matchesType = m.type.toLowerCase().indexOf(activeMonType.toLowerCase()) !== -1;
    }

    return matchesSearch && matchesCr && matchesType;
  });
  renderBestiary(filtered);
}

// Use shared abilityModifier() from app.js
function abilityMod(score) {
  return abilityModifier(score);
}

function renderBestiary(list) {
  var container = document.getElementById('bestiary-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No monsters match your search.</p>';
    return;
  }

  _dl.bestiary = list;

  container.innerHTML = list.map(function (m, idx) {
    return '<div class="ref-card" onclick="openMonsterDetail(' + idx + ')" title="Click to expand">' +
      '<div class="ref-name">' + escapeHtml(m.name) + '</div>' +
      '<div class="spell-stats">' +
        '<span class="spell-badge">CR ' + escapeHtml(m.cr) + '</span>' +
        '<span class="spell-badge">' + escapeHtml(m.type) + '</span>' +
        (m.size ? '<span class="spell-badge">' + escapeHtml(m.size) + '</span>' : '') +
      '</div>' +
      '<div class="spell-stats">' +
        '<span class="spell-stat"><i class="fi fi-rr-shield"></i> <span>AC ' + m.ac + '</span></span>' +
        '<span class="spell-stat"><i class="fi fi-rr-heart"></i> <span>HP ' + m.hp + '</span></span>' +
        '<span class="spell-stat"><i class="fi fi-rr-running"></i> <span>' + escapeHtml(m.speed) + '</span></span>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openMonsterDetail(index) {
  var m = _dl.bestiary && _dl.bestiary[index];
  if (!m) return;

  var body = (m.size ? m.size + ' ' : '') + m.type +
    (m.alignment ? ', ' + m.alignment : '') + '\n' +
    'CR ' + m.cr + '\n\n' +
    'AC ' + m.ac + (m.acDesc ? ' (' + m.acDesc + ')' : '') +
    '  |  HP ' + m.hp + (m.hitDice ? ' (' + m.hitDice + ')' : '') +
    '  |  Speed ' + m.speed + '\n\n' +
    '--- Ability Scores ---\n' +
    'STR ' + m.str + ' (' + abilityMod(m.str) + ')  ' +
    'DEX ' + m.dex + ' (' + abilityMod(m.dex) + ')  ' +
    'CON ' + m.con + ' (' + abilityMod(m.con) + ')\n' +
    'INT ' + m.int + ' (' + abilityMod(m.int) + ')  ' +
    'WIS ' + m.wis + ' (' + abilityMod(m.wis) + ')  ' +
    'CHA ' + m.cha + ' (' + abilityMod(m.cha) + ')\n';

  if (m.saves)              body += '\nSaving Throws: ' + m.saves;
  if (m.skills)             body += '\nSkills: ' + m.skills;
  if (m.vulnerabilities)    body += '\nVulnerabilities: ' + m.vulnerabilities;
  if (m.resistances)        body += '\nResistances: ' + m.resistances;
  if (m.immunities)         body += '\nDamage Immunities: ' + m.immunities;
  if (m.conditionImmunities) body += '\nCondition Immunities: ' + m.conditionImmunities;
  if (m.senses)             body += '\nSenses: ' + m.senses;
  if (m.languages)          body += '\nLanguages: ' + m.languages;

  if (m.abilities) {
    body += '\n\n--- Special Abilities ---\n' + m.abilities;
  }
  if (m.actions) {
    body += '\n\n--- Actions ---\n' + m.actions;
  }
  if (m.bonusActions) {
    body += '\n\n--- Bonus Actions ---\n' + m.bonusActions;
  }
  if (m.reactions) {
    body += '\n\n--- Reactions ---\n' + m.reactions;
  }
  if (m.legendary) {
    body += '\n\n--- Legendary Actions ---\n';
    if (m.legendaryDesc) body += m.legendaryDesc + '\n\n';
    body += m.legendary;
  }

  showInfoModal({ title: m.name, body: body });
}
