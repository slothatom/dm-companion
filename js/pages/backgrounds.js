// =============================================
//   backgrounds.js - Backgrounds Reference page
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
  renderBackgrounds(BACKGROUNDS);
})();

function filterBackgrounds() {
  var q = document.getElementById('bg-search').value.toLowerCase();
  var filtered = BACKGROUNDS.filter(function (b) {
    return b.name.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q);
  });
  renderBackgrounds(filtered);
}

function renderBackgrounds(list) {
  var container = document.getElementById('bg-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No backgrounds match your search.</p>';
    return;
  }

  window._bgDisplayList = list;

  container.innerHTML = list.map(function (b, idx) {
    return '<div class="ref-card" onclick="openBgDetail(' + idx + ')" title="Click to expand">' +
      '<div class="ref-name">' + escapeHtml(b.name) + '</div>' +
      '<div class="spell-stats">' +
        '<span class="spell-stat"><i class="fi fi-rr-target"></i> <span>' + escapeHtml(b.skillProf) + '</span></span>' +
      '</div>' +
      '<div class="ref-desc">' + escapeHtml(b.desc) + '</div>' +
    '</div>';
  }).join('');
}

function openBgDetail(index) {
  var b = window._bgDisplayList && window._bgDisplayList[index];
  if (!b) return;

  var body = 'Skill Proficiencies: ' + b.skillProf + '\n' +
    'Tool Proficiencies: ' + (b.toolProf || 'None') + '\n' +
    'Languages: ' + (b.languages || 'None') + '\n' +
    'Equipment: ' + b.equipment + '\n\n' +
    '--- Feature: ' + b.feature + ' ---\n' + b.featureDesc;

  if (b.personality) {
    body += '\n\n--- Personality Traits ---\n' + b.personality;
  }

  body += '\n\n' + b.desc;

  showInfoModal({ title: b.name, body: body });
}
