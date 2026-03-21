// =============================================
//   species.js - Species / Races Reference (API-powered)
// =============================================

var allSpecies = [];

(async function () {
  var user = await requireAuth();
  if (!user) return;
  renderNav(user);

  DndApi.showLoading('species-list');

  try {
    allSpecies = await DndApi.fetchRaces();
    if (allSpecies.length === 0 && typeof SPECIES !== 'undefined') {
      allSpecies = SPECIES;
    }
    renderSpecies(allSpecies);
    document.querySelector('.subtitle').textContent =
      'Species reference - ' + allSpecies.length + ' races. Traits, bonuses, and features.';
  } catch (err) {
    if (typeof SPECIES !== 'undefined' && SPECIES.length > 0) {
      allSpecies = SPECIES;
      renderSpecies(allSpecies);
      showToast('Using offline species data (API unavailable)', 'info');
    } else {
      DndApi.showError('species-list', err.message);
    }
  }
})();

function filterSpecies() {
  var q = document.getElementById('species-search').value.toLowerCase();
  var filtered = allSpecies.filter(function (s) {
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

  _dl.species = list;

  container.innerHTML = list.map(function (s, idx) {
    return '<div class="ref-card" onclick="openSpeciesDetail(' + idx + ')" title="Click to expand">' +
      '<div class="ref-name">' + escapeHtml(s.name) + '</div>' +
      '<div class="spell-stats">' +
        (s.speed ? '<span class="spell-stat"><i class="fi fi-rr-running"></i> <span>' + escapeHtml(s.speed) + '</span></span>' : '') +
        (s.size ? '<span class="spell-stat"><i class="fi fi-rr-user"></i> <span>' + escapeHtml(s.size) + '</span></span>' : '') +
      '</div>' +
      (s.languages ? '<div class="ref-desc">' + escapeHtml(s.languages) + '</div>' : '') +
    '</div>';
  }).join('');
}

function openSpeciesDetail(index) {
  var s = _dl.species && _dl.species[index];
  if (!s) return;

  var md = '';
  if (s.size)      md += '**Size:** ' + s.size + '\n\n';
  if (s.speed)     md += '**Speed:** ' + s.speed + '\n\n';
  if (s.languages) md += '**Languages:** ' + s.languages + '\n\n';

  if (s.traits) md += '## Traits\n\n' + s.traits + '\n\n';

  if (s.subraces && s.subraces.length > 0) {
    md += '---\n\n## Subraces\n\n';
    s.subraces.forEach(function (sub) {
      md += '### ' + sub.name + '\n\n' + sub.traits + '\n\n';
    });
  }

  if (s.desc) md += '---\n\n' + s.desc;

  showInfoModal({ title: s.name, bodyHtml: mdToHtml(md) });
}
