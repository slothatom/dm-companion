// =============================================
//   magic-items.js - Magic Items Reference (API-powered)
// =============================================

var allMagicItems  = [];
var activeRarity   = 'all';
var activeMagicType = 'all';

(async function () {
  var user = await requireAuth();
  if (!user) return;
  renderNav(user);

  DndApi.showLoading('magic-list');

  try {
    allMagicItems = await DndApi.fetchMagicItems();
    renderMagicItems(allMagicItems);
    document.querySelector('.subtitle').textContent =
      'Magic item reference - ' + allMagicItems.length + ' items. Enchanted gear, potions, and artifacts.';
  } catch (err) {
    DndApi.showError('magic-list', err.message);
  }
})();

function setRarity(rarity, btn) {
  activeRarity = rarity;
  document.querySelectorAll('#rarity-filters .filter-btn').forEach(function (b) {
    b.classList.remove('active-filter');
  });
  btn.classList.add('active-filter');
  filterMagicItems();
}

function setMagicType(type, btn) {
  activeMagicType = type;
  document.querySelectorAll('#type-filters .filter-btn').forEach(function (b) {
    b.classList.remove('active-filter');
  });
  btn.classList.add('active-filter');
  filterMagicItems();
}

function filterMagicItems() {
  var q = document.getElementById('magic-search').value.toLowerCase();
  var filtered = allMagicItems.filter(function (item) {
    var matchesSearch = !q || item.name.toLowerCase().includes(q) ||
      (item.desc && item.desc.toLowerCase().includes(q));
    var matchesRarity = activeRarity === 'all' ||
      (item.rarity && item.rarity.toLowerCase().includes(activeRarity.toLowerCase()));
    var matchesType = activeMagicType === 'all' ||
      (item.type && item.type.toLowerCase().includes(activeMagicType.toLowerCase()));
    return matchesSearch && matchesRarity && matchesType;
  });
  renderMagicItems(filtered);
}

function rarityColor(rarity) {
  if (!rarity) return '';
  var r = rarity.toLowerCase();
  if (r.includes('common') && !r.includes('uncommon'))  return 'badge-common';
  if (r.includes('uncommon'))  return 'badge-uncommon';
  if (r.includes('rare') && !r.includes('very'))       return 'badge-rare';
  if (r.includes('very rare')) return 'badge-veryrare';
  if (r.includes('legendary')) return 'badge-legendary';
  if (r.includes('artifact'))  return 'badge-artifact';
  return '';
}

function renderMagicItems(list) {
  var container = document.getElementById('magic-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No magic items match your search.</p>';
    return;
  }

  window._magicDisplayList = list;

  container.innerHTML = list.map(function (item, idx) {
    var rClass = rarityColor(item.rarity);
    return '<div class="ref-card" onclick="openMagicDetail(' + idx + ')" title="Click to expand">' +
      '<div class="ref-name">' + escapeHtml(item.name) + '</div>' +
      '<div class="spell-stats">' +
        (item.type ? '<span class="spell-badge">' + escapeHtml(item.type) + '</span>' : '') +
        (item.rarity ? '<span class="spell-badge ' + rClass + '">' + escapeHtml(item.rarity) + '</span>' : '') +
        (item.attune ? '<span class="spell-badge badge-conc">' + escapeHtml(item.attune) + '</span>' : '') +
      '</div>' +
      '<div class="ref-desc">' + escapeHtml(truncateDesc(item.desc, 120)) + '</div>' +
    '</div>';
  }).join('');
}

function truncateDesc(str, len) {
  if (!str) return '';
  if (str.length <= len) return str;
  return str.substring(0, len) + '...';
}

function openMagicDetail(index) {
  var item = window._magicDisplayList && window._magicDisplayList[index];
  if (!item) return;

  var body = '';
  if (item.type)   body += 'Type: ' + item.type + '\n';
  if (item.rarity) body += 'Rarity: ' + item.rarity + '\n';
  if (item.attune) body += 'Attunement: ' + item.attune + '\n';
  body += '\n' + (item.desc || 'No description available.');

  showInfoModal({ title: item.name, body: body });
}
