// =============================================
//   feats.js - Feats Reference page
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
  renderFeats(FEATS);
})();

function filterFeats() {
  var q = document.getElementById('feat-search').value.toLowerCase();
  var filtered = FEATS.filter(function (f) {
    return f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q);
  });
  renderFeats(filtered);
}

function renderFeats(list) {
  var container = document.getElementById('feat-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No feats match your search.</p>';
    return;
  }

  window._featDisplayList = list;

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
  var f = window._featDisplayList && window._featDisplayList[index];
  if (!f) return;

  var body = '';
  if (f.prerequisite) {
    body += 'Prerequisite: ' + f.prerequisite + '\n\n';
  }
  body += f.desc;

  showInfoModal({ title: f.name, body: body });
}
