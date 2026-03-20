// =============================================
//   bestiary.js - Monster / Bestiary Reference page
// =============================================

var activeCrRange = 'all';
var activeMonType = 'all';

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
  renderBestiary(MONSTERS);
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
  var filtered = MONSTERS.filter(function (m) {
    var matchesSearch = !q || m.name.toLowerCase().includes(q);

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

function renderBestiary(list) {
  var container = document.getElementById('bestiary-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No monsters match your search.</p>';
    return;
  }

  window._bestiaryDisplayList = list;

  container.innerHTML = list.map(function (m, idx) {
    return '<div class="ref-card" onclick="openMonsterDetail(' + idx + ')" title="Click to expand">' +
      '<div class="ref-name">' + escapeHtml(m.name) + '</div>' +
      '<div class="spell-stats">' +
        '<span class="spell-badge">CR ' + escapeHtml(m.cr) + '</span>' +
        '<span class="spell-badge">' + escapeHtml(m.type) + '</span>' +
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
  var m = window._bestiaryDisplayList && window._bestiaryDisplayList[index];
  if (!m) return;

  var body = 'CR ' + m.cr + '  |  ' + m.type + '\n' +
    'AC ' + m.ac + '  |  HP ' + m.hp + '  |  Speed ' + m.speed + '\n\n' +
    '--- Ability Scores ---\n' +
    'STR ' + m.str + '  DEX ' + m.dex + '  CON ' + m.con + '\n' +
    'INT ' + m.int + '  WIS ' + m.wis + '  CHA ' + m.cha + '\n\n' +
    '--- Attacks ---\n' + m.attacks + '\n\n' +
    '--- Abilities ---\n' + m.abilities + '\n\n' +
    'Senses: ' + m.senses + '\n' +
    'Languages: ' + m.languages;

  showInfoModal({ title: m.name, body: body });
}
