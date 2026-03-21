// =============================================
//   backgrounds.js - Backgrounds Reference (API-powered)
// =============================================

var allBackgrounds = [];

(async function () {
  var user = await requireAuth();
  if (!user) return;
  renderNav(user);

  DndApi.showLoading('bg-list');

  try {
    allBackgrounds = await DndApi.fetchBackgrounds();
    if (allBackgrounds.length === 0 && typeof BACKGROUNDS !== 'undefined') {
      allBackgrounds = BACKGROUNDS;
    }
    renderBackgrounds(allBackgrounds);
    document.querySelector('.subtitle').textContent =
      'Background reference - ' + allBackgrounds.length + ' backgrounds. Proficiencies, equipment, and features.';
  } catch (err) {
    if (typeof BACKGROUNDS !== 'undefined' && BACKGROUNDS.length > 0) {
      allBackgrounds = BACKGROUNDS;
      renderBackgrounds(allBackgrounds);
      showToast('Using offline background data (API unavailable)', 'info');
    } else {
      DndApi.showError('bg-list', err.message);
    }
  }
})();

function filterBackgrounds() {
  var q = document.getElementById('bg-search').value.toLowerCase();
  var filtered = allBackgrounds.filter(function (b) {
    return b.name.toLowerCase().includes(q) ||
      (b.desc && b.desc.toLowerCase().includes(q));
  });
  renderBackgrounds(filtered);
}

function renderBackgrounds(list) {
  var container = document.getElementById('bg-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No backgrounds match your search.</p>';
    return;
  }

  _dl.backgrounds = list;

  container.innerHTML = list.map(function (b, idx) {
    return '<div class="ref-card" onclick="openBgDetail(' + idx + ')" title="Click to expand">' +
      '<div class="ref-name">' + escapeHtml(b.name) + '</div>' +
      '<div class="spell-stats">' +
        (b.skillProf ? '<span class="spell-stat"><i class="fi fi-rr-target"></i> <span>' + escapeHtml(b.skillProf) + '</span></span>' : '') +
      '</div>' +
      (b.desc ? '<div class="ref-desc">' + escapeHtml(b.desc.substring(0, 120)) + (b.desc.length > 120 ? '...' : '') + '</div>' : '') +
    '</div>';
  }).join('');
}

function openBgDetail(index) {
  var b = _dl.backgrounds && _dl.backgrounds[index];
  if (!b) return;

  var body = '';
  if (b.skillProf)   body += 'Skill Proficiencies: ' + b.skillProf + '\n';
  if (b.toolProf)    body += 'Tool Proficiencies: ' + b.toolProf + '\n';
  if (b.languages)   body += 'Languages: ' + b.languages + '\n';
  if (b.equipment)   body += 'Equipment: ' + b.equipment + '\n';

  if (b.feature) {
    body += '\n--- Feature: ' + b.feature + ' ---\n' + (b.featureDesc || '');
  }

  if (b.personality) {
    body += '\n\n--- Personality Traits ---\n' + b.personality;
  }

  if (b.desc) body += '\n\n' + b.desc;

  showInfoModal({ title: b.name, body: body });
}
