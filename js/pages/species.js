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

  var body = '';
  if (s.size)      body += 'Size: ' + s.size + '\n';
  if (s.speed)     body += 'Speed: ' + s.speed + '\n';
  if (s.languages) body += 'Languages: ' + s.languages + '\n';

  if (s.traits) body += '\nTraits:\n' + s.traits;

  if (s.subraces && s.subraces.length > 0) {
    body += '\n\n--- Subraces ---';
    s.subraces.forEach(function (sub) {
      body += '\n\n' + sub.name + ':\n' + sub.traits;
    });
  }

  if (s.desc) body += '\n\n' + s.desc;

  showInfoModal({ title: s.name, body: body });
}
