// =============================================
//   items.js - Items & Equipment Reference (API-powered)
// =============================================

var allItems      = [];
var activeItemCat = 'all';

(async function () {
  var user = await requireAuth();
  if (!user) return;
  renderNav(user);

  DndApi.showLoading('item-list');

  try {
    allItems = await DndApi.fetchEquipment();
    if (allItems.length === 0 && typeof ITEMS !== 'undefined') {
      allItems = ITEMS;
    }
    renderItems(allItems);
    document.querySelector('.subtitle').textContent =
      'Items and equipment - ' + allItems.length + ' entries. Weapons, armor, gear, tools, and more.';
  } catch (err) {
    if (typeof ITEMS !== 'undefined' && ITEMS.length > 0) {
      allItems = ITEMS;
      renderItems(allItems);
      showToast('Using offline item data (API unavailable)', 'info');
    } else {
      DndApi.showError('item-list', err.message);
    }
  }
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
  var filtered = allItems.filter(function (item) {
    var cat = (item.category || '').toLowerCase();
    var matchesCat = activeItemCat === 'all' || cat.includes(activeItemCat.toLowerCase());
    var matchesSearch = !q || item.name.toLowerCase().includes(q) ||
      (item.desc && item.desc.toLowerCase().includes(q));
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
        (item.cost ? '<span class="spell-stat"><i class="fi fi-rr-coins"></i> <span>' + escapeHtml(item.cost) + '</span></span>' : '') +
        (item.weight ? '<span class="spell-stat"><i class="fi fi-rr-weight-hanging"></i> <span>' + escapeHtml(item.weight) + '</span></span>' : '') +
        '<span class="spell-badge">' + escapeHtml(item.category) + '</span>' +
      '</div>' +
      (props ? '<div class="ref-desc">' + props + '</div>' : '') +
    '</div>';
  }).join('');
}

function openItemDetail(index) {
  var item = window._itemDisplayList && window._itemDisplayList[index];
  if (!item) return;

  var body = 'Category: ' + item.category + '\n';
  if (item.cost)   body += 'Cost: ' + item.cost + '\n';
  if (item.weight) body += 'Weight: ' + item.weight + '\n';
  if (item.properties) body += 'Properties: ' + item.properties + '\n';
  body += '\n' + (item.desc || 'No description available.');

  showInfoModal({ title: item.name, body: body });
}
