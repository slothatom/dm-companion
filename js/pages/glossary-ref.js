// =============================================
//   glossary-ref.js - Glossary Reference page
// =============================================

var activeGlossCat = 'all';

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
  renderGlossary(GLOSSARY);
})();

function setGlossCat(cat, btn) {
  activeGlossCat = cat;
  document.querySelectorAll('#gloss-cat-filters .filter-btn').forEach(function (b) {
    b.classList.remove('active-filter');
  });
  btn.classList.add('active-filter');
  filterGlossary();
}

function filterGlossary() {
  var q = document.getElementById('glossary-search').value.toLowerCase();
  var filtered = GLOSSARY.filter(function (g) {
    var matchesCat = activeGlossCat === 'all' ||
      g.category.toLowerCase() === activeGlossCat.toLowerCase();
    var matchesSearch = !q ||
      g.term.toLowerCase().includes(q) ||
      g.def.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Sort alphabetically by term
  filtered.sort(function (a, b) {
    return a.term.localeCompare(b.term);
  });

  renderGlossary(filtered);
}

function renderGlossary(list) {
  var container = document.getElementById('glossary-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No terms match your search.</p>';
    return;
  }

  // Sort alphabetically
  list = list.slice().sort(function (a, b) {
    return a.term.localeCompare(b.term);
  });

  window._glossDisplayList = list;

  container.innerHTML = list.map(function (g, idx) {
    var truncDef = g.def.length > 120 ? g.def.substring(0, 120) + '...' : g.def;
    return '<div class="ref-card" onclick="openGlossDetail(' + idx + ')" title="Click to expand">' +
      '<div class="ref-name">' + escapeHtml(g.term) + '</div>' +
      '<div class="spell-stats">' +
        '<span class="spell-badge">' + escapeHtml(g.category) + '</span>' +
      '</div>' +
      '<div class="ref-desc">' + escapeHtml(truncDef) + '</div>' +
    '</div>';
  }).join('');
}

function openGlossDetail(index) {
  var g = window._glossDisplayList && window._glossDisplayList[index];
  if (!g) return;

  var body = 'Category: ' + g.category + '\n\n' + g.def;

  showInfoModal({ title: g.term, body: body });
}
