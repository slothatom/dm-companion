// =============================================
//   classes-ref.js - Class Reference page (API-powered)
// =============================================

var allClasses = [];

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

  window._classDisplayList = list;

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

function truncateText(str, len) {
  if (!str) return '';
  if (str.length <= len) return str;
  return str.substring(0, len) + '...';
}

function openClassDetail(index) {
  var c = window._classDisplayList && window._classDisplayList[index];
  if (!c) return;

  var body = '';
  if (c.hitDie)         body += 'Hit Die: ' + c.hitDie + '\n';
  if (c.primaryAbility) body += 'Primary Ability: ' + c.primaryAbility + '\n';
  if (c.savingThrows)   body += 'Saving Throws: ' + c.savingThrows + '\n';

  body += '\n--- Proficiencies ---\n';
  if (c.armorProf)    body += 'Armor: ' + c.armorProf + '\n';
  if (c.weaponProf)   body += 'Weapons: ' + c.weaponProf + '\n';
  if (c.skillChoices) body += 'Skills: ' + c.skillChoices + '\n';

  if (c.features) body += '\n--- Features ---\n' + c.features + '\n';
  if (c.subclassName) body += '\nSubclass: ' + c.subclassName;
  if (c.spellcasting) body += '\n\n--- Spellcasting ---\n' + c.spellcasting;
  if (c.desc) body += '\n\n' + c.desc;

  showInfoModal({ title: c.name, body: body });
}
