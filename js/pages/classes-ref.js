// =============================================
//   classes-ref.js - Class Reference page (API-powered)
// =============================================

let allClasses = [];

(async function () {
  var user = await requireAuth();
  if (!user) return;
  renderNav(user);

  DndApi.showLoading('classes-list');

  try {
    allClasses = await DndApi.fetchClasses();
    if (allClasses.length === 0 && typeof CLASSES !== 'undefined') {
      allClasses = CLASSES;
    }
    renderClasses(allClasses);
    document.querySelector('.subtitle').textContent =
      'Class reference - ' + allClasses.length + ' classes. Hit dice, proficiencies, and core features.';
  } catch (err) {
    if (typeof CLASSES !== 'undefined' && CLASSES.length > 0) {
      allClasses = CLASSES;
      renderClasses(allClasses);
      showToast('Using offline class data (API unavailable)', 'info');
    } else {
      DndApi.showError('classes-list', err.message);
    }
  }
})();

function renderClasses(list) {
  var container = document.getElementById('classes-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No classes found.</p>';
    return;
  }

  _dl.classes = list;

  container.innerHTML = list.map(function (c, idx) {
    return '<div class="ref-card" onclick="openClassDetail(' + idx + ')" title="Click to expand">' +
      '<div class="ref-name">' + escapeHtml(c.name) + '</div>' +
      '<div class="spell-stats">' +
        (c.hitDie ? '<span class="spell-stat"><i class="fi fi-rr-heart"></i> <span>' + escapeHtml(c.hitDie) + '</span></span>' : '') +
        (c.primaryAbility ? '<span class="spell-stat"><i class="fi fi-rr-star"></i> <span>' + escapeHtml(c.primaryAbility) + '</span></span>' : '') +
      '</div>' +
      '<div class="ref-desc">' + escapeHtml(truncateText(c.desc, 150)) + '</div>' +
    '</div>';
  }).join('');
}

// truncateText() is now provided by app.js

function openClassDetail(index) {
  var c = _dl.classes && _dl.classes[index];
  if (!c) return;

  var html = '<div class="detail-stats">';
  if (c.hitDie) html += '<div class="detail-stat"><strong>Hit Die</strong><span>' + escapeHtml(c.hitDie) + '</span></div>';
  if (c.primaryAbility) html += '<div class="detail-stat"><strong>Primary</strong><span>' + escapeHtml(c.primaryAbility) + '</span></div>';
  if (c.savingThrows) html += '<div class="detail-stat"><strong>Saves</strong><span>' + escapeHtml(c.savingThrows) + '</span></div>';
  html += '</div>';

  html += '<h3>Proficiencies</h3><ul style="margin:0 0 16px; padding-left:20px;">';
  if (c.armorProf) html += '<li><strong>Armor:</strong> ' + escapeHtml(c.armorProf) + '</li>';
  if (c.weaponProf) html += '<li><strong>Weapons:</strong> ' + escapeHtml(c.weaponProf) + '</li>';
  if (c.skillChoices) html += '<li><strong>Skills:</strong> ' + escapeHtml(c.skillChoices) + '</li>';
  html += '</ul>';

  if (c.features) {
    html += '<h3>Features</h3>' + mdToHtml(c.features);
  }
  if (c.subclassName) {
    html += '<p style="margin-top:12px;"><strong>Subclass:</strong> ' + escapeHtml(c.subclassName) + '</p>';
  }
  if (c.spellcasting) {
    html += '<h3>Spellcasting</h3>' + mdToHtml(c.spellcasting);
  }
  if (c.desc) {
    html += '<hr style="border-color:var(--border-dim); margin:16px 0;" />' + mdToHtml(c.desc);
  }

  showInfoModal({ title: c.name, bodyHtml: html });
}

function filterClasses() {
  var query = (document.getElementById('class-search').value || '').toLowerCase().trim();
  if (!query) { renderClasses(allClasses); return; }
  var filtered = allClasses.filter(function (c) {
    return c.name.toLowerCase().includes(query) ||
      (c.hitDie && c.hitDie.toLowerCase().includes(query)) ||
      (c.primaryAbility && c.primaryAbility.toLowerCase().includes(query)) ||
      (c.desc && c.desc.toLowerCase().includes(query));
  });
  renderClasses(filtered);
}
