// =============================================
//   classes-ref.js — Class Reference page
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
  renderClasses(CLASSES);
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
        '<span class="spell-stat"><i class="fi fi-rr-heart"></i> <span>' + escapeHtml(c.hitDie) + '</span></span>' +
        '<span class="spell-stat"><i class="fi fi-rr-star"></i> <span>' + escapeHtml(c.primaryAbility) + '</span></span>' +
      '</div>' +
      '<div class="ref-desc">' + escapeHtml(c.desc) + '</div>' +
    '</div>';
  }).join('');
}

function openClassDetail(index) {
  var c = window._classDisplayList && window._classDisplayList[index];
  if (!c) return;

  var body = 'Hit Die: ' + c.hitDie + '\n' +
    'Primary Ability: ' + c.primaryAbility + '\n' +
    'Saving Throws: ' + c.savingThrows + '\n\n' +
    '--- Proficiencies ---\n' +
    'Armor: ' + c.armorProf + '\n' +
    'Weapons: ' + c.weaponProf + '\n' +
    'Skills: ' + c.skillChoices + '\n\n' +
    '--- Features ---\n' + c.features + '\n\n' +
    'Subclass: ' + c.subclassName;

  if (c.spellcasting) {
    body += '\n\n--- Spellcasting ---\n' + c.spellcasting;
  }

  body += '\n\n' + c.desc;

  showInfoModal({ title: c.name, body: body });
}
