// =============================================
//   spells.js - Spell Reference page (API-powered)
// =============================================

let allSpells    = [];
let activeLevel  = 'all';
let activeClass  = 'all';
let filterConc   = false;
let filterRitual = false;

(async function () {
  var user = await requireAuth();
  if (!user) return;
  renderNav(user);

  DndApi.showLoading('spell-list');

  try {
    allSpells = await DndApi.fetchSpells();
    // Fallback to static data if API returns empty
    if (allSpells.length === 0 && typeof SPELLS !== 'undefined') {
      allSpells = SPELLS;
    }
    renderSpells(allSpells);
    document.querySelector('.subtitle').textContent =
      'Full spell reference - ' + allSpells.length + ' spells. Search by name, school, or filter by level.';
  } catch (err) {
    // Fallback to static data
    if (typeof SPELLS !== 'undefined' && SPELLS.length > 0) {
      allSpells = SPELLS;
      renderSpells(allSpells);
      showToast('Using offline spell data (API unavailable)', 'info');
    } else {
      DndApi.showError('spell-list', err.message);
    }
  }
})();

function renderSpells(list) {
  var container = document.getElementById('spell-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No spells match your search.</p>';
    return;
  }

  _dl.spells = list;

  container.innerHTML = list.map(function (s, idx) {
    var levelLabel = s.level === 0 ? 'Cantrip' : 'Level ' + s.level;
    var concBadge  = s.conc   ? '<span class="spell-badge badge-conc">Concentration</span>'  : '';
    var ritualBadge= s.ritual ? '<span class="spell-badge badge-ritual">Ritual</span>' : '';
    return '<div class="spell-card" onclick="openSpellDetail(' + idx + ')" title="Click to expand">' +
      '<div class="spell-header">' +
        '<span class="spell-name">' + escapeHtml(s.name) + '</span>' +
        '<span class="spell-level">' + levelLabel + '</span>' +
        '<span class="spell-school">' + escapeHtml(s.school) + '</span>' +
        concBadge + ritualBadge +
      '</div>' +
      '<div class="spell-stats">' +
        '<span class="spell-stat"><i class="fi fi-rr-clock"></i> <span>' + escapeHtml(s.cast) + '</span></span>' +
        '<span class="spell-stat"><i class="fi fi-rr-map-marker"></i> <span>' + escapeHtml(s.range) + '</span></span>' +
        '<span class="spell-stat"><i class="fi fi-rr-hourglass-end"></i> <span>' + escapeHtml(s.duration) + '</span></span>' +
        (s.components ? '<span class="spell-stat"><i class="fi fi-rr-puzzle-piece"></i> <span>' + escapeHtml(s.components) + '</span></span>' : '') +
      '</div>' +
      '<div class="spell-desc">' + escapeHtml(truncate(s.desc, 200)) + '</div>' +
    '</div>';
  }).join('');
}

// Use shared truncateText() from app.js
function truncate(str, len) {
  return truncateText(str, len);
}

function openSpellDetail(index) {
  var s = _dl.spells && _dl.spells[index];
  if (!s) return;

  var levelLabel = s.level === 0 ? 'Cantrip' : 'Level ' + s.level;
  var tags = [levelLabel, s.school];
  if (s.conc)   tags.push('Concentration');
  if (s.ritual) tags.push('Ritual');

  var classes = s.classes || [];
  // Fallback to SPELL_CLASSES if available
  if (classes.length === 0 && typeof SPELL_CLASSES !== 'undefined') {
    classes = SPELL_CLASSES[s.name] || [];
  }

  var body =
    tags.join(' . ') + '\n' +
    (classes.length ? 'Classes: ' + classes.join(', ') : '') + '\n\n' +
    'Cast: ' + s.cast + '\n' +
    'Range: ' + s.range + '\n' +
    'Duration: ' + s.duration +
    (s.components ? '\nComponents: ' + s.components : '') +
    '\n\n' + s.desc;

  if (s.higherLevel) {
    body += '\n\nAt Higher Levels: ' + s.higherLevel;
  }

  showInfoModal({ title: s.name, body: body });
}

function setLevel(level, btn) {
  activeLevel = level;
  document.querySelectorAll('#level-filters .filter-btn').forEach(function (b) { b.classList.remove('active-filter'); });
  btn.classList.add('active-filter');
  filterSpells();
}

function setClass(cls, btn) {
  activeClass = cls;
  document.querySelectorAll('#class-filters .filter-btn').forEach(function (b) { b.classList.remove('active-filter'); });
  btn.classList.add('active-filter');
  filterSpells();
}

function toggleFilter(type, btn) {
  if (type === 'conc')   filterConc   = !filterConc;
  if (type === 'ritual') filterRitual = !filterRitual;
  btn.classList.toggle('active-filter');
  filterSpells();
}

function filterSpells() {
  var query = document.getElementById('spell-search').value.toLowerCase();
  var filtered = allSpells.filter(function (s) {
    var matchesLevel  = activeLevel === 'all' || s.level === activeLevel;
    var matchesSearch = s.name.toLowerCase().includes(query) ||
                        (s.desc && s.desc.toLowerCase().includes(query)) ||
                        (s.school && s.school.toLowerCase().includes(query));
    var matchesConc   = !filterConc   || s.conc   === true;
    var matchesRitual = !filterRitual || s.ritual === true;

    var matchesClass = true;
    if (activeClass !== 'all') {
      var classes = s.classes || [];
      if (classes.length === 0 && typeof SPELL_CLASSES !== 'undefined') {
        classes = SPELL_CLASSES[s.name] || [];
      }
      matchesClass = classes.indexOf(activeClass) !== -1;
    }

    return matchesLevel && matchesSearch && matchesConc && matchesRitual && matchesClass;
  });
  renderSpells(filtered);
}
