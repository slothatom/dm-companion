// =============================================
//   species.js - Species / Races Reference page
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
  renderSpecies(SPECIES);
})();

function filterSpecies() {
  const q = document.getElementById('species-search').value.toLowerCase();
  var filtered = SPECIES.filter(function (s) {
    return s.name.toLowerCase().includes(q);
  });
  renderSpecies(filtered);
}

function renderSpecies(list) {
  var container = document.getElementById('species-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No species match your search.</p>';
    return;
  }

  window._speciesDisplayList = list;

  container.innerHTML = list.map(function (s, idx) {
    return '<div class="ref-card" onclick="openSpeciesDetail(' + idx + ')" title="Click to expand">' +
      '<div class="ref-name">' + escapeHtml(s.name) + '</div>' +
      '<div class="spell-stats">' +
        '<span class="spell-stat"><i class="fi fi-rr-running"></i> <span>' + escapeHtml(s.speed) + '</span></span>' +
        '<span class="spell-stat"><i class="fi fi-rr-user"></i> <span>' + escapeHtml(s.size) + '</span></span>' +
      '</div>' +
      '<div class="ref-desc">' + escapeHtml(s.languages) + '</div>' +
    '</div>';
  }).join('');
}

function openSpeciesDetail(index) {
  var s = window._speciesDisplayList && window._speciesDisplayList[index];
  if (!s) return;

  var body = 'Size: ' + s.size + '\n' +
    'Speed: ' + s.speed + '\n' +
    'Languages: ' + s.languages + '\n\n' +
    'Traits:\n' + s.traits;

  if (s.subraces && s.subraces.length > 0) {
    body += '\n\n--- Subraces ---';
    s.subraces.forEach(function (sub) {
      body += '\n\n' + sub.name + ':\n' + sub.traits;
    });
  }

  showInfoModal({ title: s.name, body: body });
}
