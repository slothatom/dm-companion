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

function cleanSpeciesText(text) {
  if (!text) return '';
  // Remove repeated field labels like "Size: _Size._" or "Languages: *Languages.*"
  return text
    .replace(/\*?_?Size[.:]\s*_?Size\.?_?\*?/gi, '')
    .replace(/\*?_?Languages[.:]\s*_?Languages\.?_?\*?/gi, '')
    .replace(/\*?_?Speed[.:]\s*_?Speed\.?_?\*?/gi, '')
    .replace(/^\s*\n/gm, '');
}

function openSpeciesDetail(index) {
  var s = _dl.species && _dl.species[index];
  if (!s) return;

  var html = '<div class="detail-stats">';
  if (s.size)      html += '<div class="detail-stat"><strong>Size</strong><span>' + escapeHtml(s.size) + '</span></div>';
  if (s.speed)     html += '<div class="detail-stat"><strong>Speed</strong><span>' + escapeHtml(s.speed) + '</span></div>';
  if (s.languages) html += '<div class="detail-stat"><strong>Languages</strong><span>' + escapeHtml(s.languages) + '</span></div>';
  html += '</div>';

  var traits = cleanSpeciesText(s.traits);
  if (traits) html += '<h3>Traits</h3>' + mdToHtml(traits);

  if (s.subraces && s.subraces.length > 0) {
    html += '<hr style="border-color:var(--border-dim); margin:16px 0;" />';
    html += '<h3>Subraces</h3>';
    s.subraces.forEach(function (sub) {
      var subTraits = cleanSpeciesText(sub.traits);
      html += '<h4 style="color:var(--primary); margin:12px 0 6px;">' + escapeHtml(sub.name) + '</h4>';
      html += mdToHtml(subTraits);
    });
  }

  if (s.desc) {
    html += '<hr style="border-color:var(--border-dim); margin:16px 0;" />';
    html += mdToHtml(cleanSpeciesText(s.desc));
  }

  showInfoModal({ title: s.name, bodyHtml: html });
}
