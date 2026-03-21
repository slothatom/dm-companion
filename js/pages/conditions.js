// =============================================
//   conditions.js - Conditions Reference (API-powered)
// =============================================

var allConditions = [];

(async function () {
  var user = await requireAuth();
  if (!user) return;
  renderNav(user);

  DndApi.showLoading('condition-list');

  try {
    allConditions = await DndApi.fetchConditions();
    renderConditions(allConditions);
    document.querySelector('.subtitle').textContent =
      'Status conditions - ' + allConditions.length + ' conditions that affect creatures during play.';
  } catch (err) {
    DndApi.showError('condition-list', err.message);
  }
})();

function filterConditions() {
  var q = document.getElementById('condition-search').value.toLowerCase();
  var filtered = allConditions.filter(function (c) {
    return c.name.toLowerCase().includes(q) ||
      (c.desc && c.desc.toLowerCase().includes(q));
  });
  renderConditions(filtered);
}

function renderConditions(list) {
  var container = document.getElementById('condition-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No conditions match your search.</p>';
    return;
  }

  window._condDisplayList = list;

  container.innerHTML = list.map(function (c, idx) {
    var truncDesc = c.desc.length > 150 ? c.desc.substring(0, 150) + '...' : c.desc;
    return '<div class="ref-card" onclick="openConditionDetail(' + idx + ')" title="Click to expand">' +
      '<div class="ref-name">' + escapeHtml(c.name) + '</div>' +
      '<div class="ref-desc">' + escapeHtml(truncDesc) + '</div>' +
    '</div>';
  }).join('');
}

function openConditionDetail(index) {
  var c = window._condDisplayList && window._condDisplayList[index];
  if (!c) return;

  showInfoModal({ title: c.name, body: c.desc || 'No description available.' });
}
