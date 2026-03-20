// =============================================
//   items.js - Items & Equipment Reference page
// =============================================

var activeItemCat = 'all';

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
  renderItems(ITEMS);
})();

function setItemCat(cat, btn) {
  activeItemCat = cat;
  document.querySelectorAll('#item-cat-filters .filter-btn').forEach(function (b) {
    b.classList.remove('active-filter');
  });
  btn.classList.add('active-filter');
  filterItems();
}

function filterItems() {
  var q = document.getElementById('item-search').value.toLowerCase();
  var filtered = ITEMS.filter(function (item) {
    var matchesCat = activeItemCat === 'all' ||
      item.category.toLowerCase() === activeItemCat.toLowerCase();
    var matchesSearch = !q || item.name.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });
  renderItems(filtered);
}

function renderItems(list) {
  var container = document.getElementById('item-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No items match your search.</p>';
    return;
  }

  window._itemDisplayList = list;

  container.innerHTML = list.map(function (item, idx) {
    var props = item.properties ? escapeHtml(item.properties) : '';
    return '<div class="ref-card" onclick="openItemDetail(' + idx + ')" title="Click to expand">' +
      '<div class="ref-name">' + escapeHtml(item.name) + '</div>' +
      '<div class="spell-stats">' +
        '<span class="spell-stat"><i class="fi fi-rr-coins"></i> <span>' + escapeHtml(item.cost) + '</span></span>' +
        '<span class="spell-stat"><i class="fi fi-rr-weight-hanging"></i> <span>' + escapeHtml(item.weight) + '</span></span>' +
        '<span class="spell-badge">' + escapeHtml(item.category) + '</span>' +
      '</div>' +
      (props ? '<div class="ref-desc">' + props + '</div>' : '') +
    '</div>';
  }).join('');
}

function openItemDetail(index) {
  var item = window._itemDisplayList && window._itemDisplayList[index];
  if (!item) return;

  var body = 'Category: ' + item.category + '\n' +
    'Cost: ' + item.cost + '\n' +
    'Weight: ' + item.weight + '\n';

  if (item.properties) {
    body += 'Properties: ' + item.properties + '\n';
  }

  body += '\n' + item.desc;

  showInfoModal({ title: item.name, body: body });
}
