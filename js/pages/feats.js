// =============================================
//   feats.js - Feats Reference page (API-powered)
// =============================================

var allFeats = [];

(async function () {
  var user = await requireAuth();
  if (!user) return;
  renderNav(user);

  DndApi.showLoading('feat-list');

  try {
    allFeats = await DndApi.fetchFeats();
    if (allFeats.length === 0 && typeof FEATS !== 'undefined') {
      allFeats = FEATS;
    }
    renderFeats(allFeats);
    document.querySelector('.subtitle').textContent =
      'Feat reference - ' + allFeats.length + ' feats. Prerequisites, descriptions, and benefits.';
  } catch (err) {
    if (typeof FEATS !== 'undefined' && FEATS.length > 0) {
      allFeats = FEATS;
      renderFeats(allFeats);
      showToast('Using offline feat data (API unavailable)', 'info');
    } else {
      DndApi.showError('feat-list', err.message);
    }
  }
})();

function filterFeats() {
  var q = document.getElementById('feat-search').value.toLowerCase();
  var filtered = allFeats.filter(function (f) {
    return f.name.toLowerCase().includes(q) ||
      (f.desc && f.desc.toLowerCase().includes(q));
  });
  renderFeats(filtered);
}

function renderFeats(list) {
  var container = document.getElementById('feat-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No feats match your search.</p>';
    return;
  }

  _dl.feats = list;

  container.innerHTML = list.map(function (f, idx) {
    var prereq = f.prerequisite
      ? '<span class="spell-badge badge-conc">' + escapeHtml(f.prerequisite) + '</span>'
      : '<span class="spell-badge">No prerequisite</span>';
    return '<div class="ref-card" onclick="openFeatDetail(' + idx + ')" title="Click to expand">' +
      '<div class="ref-name">' + escapeHtml(f.name) + '</div>' +
      '<div class="spell-stats">' + prereq + '</div>' +
    '</div>';
  }).join('');
}

function openFeatDetail(index) {
  var f = _dl.feats && _dl.feats[index];
  if (!f) return;

  var md = '';
  if (f.prerequisite) {
    md += '**Prerequisite:** ' + f.prerequisite + '\n\n';
  }
  md += f.desc || 'No description available.';

  showInfoModal({ title: f.name, bodyHtml: mdToHtml(md) });
}
