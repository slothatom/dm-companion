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
    var apiBg = await DndApi.fetchBackgrounds();
    // Merge API data with offline data — offline has many more entries
    if (typeof BACKGROUNDS !== 'undefined' && BACKGROUNDS.length > 0) {
      var apiNames = {};
      apiBg.forEach(function (b) { apiNames[b.name.toLowerCase()] = true; });
      // Add offline entries not in API
      BACKGROUNDS.forEach(function (b) {
        if (!apiNames[b.name.toLowerCase()]) apiBg.push(b);
      });
    }
    allBackgrounds = apiBg.sort(function (a, b) { return a.name.localeCompare(b.name); });
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

  var html = '<div class="detail-stats">';
  if (b.skillProf) html += '<div class="detail-stat"><strong>Skills</strong><span>' + escapeHtml(b.skillProf) + '</span></div>';
  if (b.toolProf && b.toolProf !== 'None') html += '<div class="detail-stat"><strong>Tools</strong><span>' + escapeHtml(b.toolProf) + '</span></div>';
  if (b.languages && b.languages !== 'None') html += '<div class="detail-stat"><strong>Languages</strong><span>' + escapeHtml(b.languages) + '</span></div>';
  html += '</div>';

  if (b.equipment) {
    html += '<p style="margin-bottom:12px;"><strong>Equipment:</strong> ' + escapeHtml(b.equipment) + '</p>';
  }

  if (b.feature) {
    html += '<hr style="border-color:var(--border-dim); margin:16px 0;" />';
    html += '<h3>Feature: ' + escapeHtml(b.feature) + '</h3>';
    html += '<p>' + escapeHtml(b.featureDesc || '') + '</p>';
  }

  if (b.desc) {
    html += '<hr style="border-color:var(--border-dim); margin:16px 0;" />';
    html += mdToHtml(b.desc);
  }

  if (b.personality) {
    html += '<hr style="border-color:var(--border-dim); margin:16px 0;" />';
    html += '<h3>Suggested Characteristics</h3>';
    html += mdToHtml(b.personality);
  }

  showInfoModal({ title: b.name, bodyHtml: html });
}
