// =============================================
//   spells.js — Spell Reference page
// =============================================

let activeLevel  = 'all';
let activeClass  = 'all';
let filterConc   = false;
let filterRitual = false;

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
  renderSpells(SPELLS);
})();

function renderSpells(list) {
  const container = document.getElementById('spell-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No spells match your search.</p>';
    return;
  }

  // Store for modal lookup
  window._spellDisplayList = list;

  container.innerHTML = list.map(function (s, idx) {
    const levelLabel = s.level === 0 ? 'Cantrip' : 'Level ' + s.level;
    const concBadge  = s.conc   ? '<span class="spell-badge badge-conc">Concentration</span>'  : '';
    const ritualBadge= s.ritual ? '<span class="spell-badge badge-ritual">Ritual</span>' : '';
    return `
          <div class="spell-card" onclick="openSpellDetail(${idx})" title="Click to expand">
            <div class="spell-header">
              <span class="spell-name">${s.name}</span>
              <span class="spell-level">${levelLabel}</span>
              <span class="spell-school">${s.school}</span>
              ${concBadge}${ritualBadge}
            </div>
            <div class="spell-stats">
              <span class="spell-stat"><i class="fi fi-rr-clock"></i> <span>${s.cast}</span></span>
              <span class="spell-stat"><i class="fi fi-rr-map-marker"></i> <span>${s.range}</span></span>
              <span class="spell-stat"><i class="fi fi-rr-hourglass-end"></i> <span>${s.duration}</span></span>
              ${s.components ? '<span class="spell-stat"><i class="fi fi-rr-puzzle-piece"></i> <span>' + s.components + '</span></span>' : ''}
            </div>
            <div class="spell-desc">${s.desc}</div>
          </div>`;
  }).join('');
}

function openSpellDetail(index) {
  const s = window._spellDisplayList && window._spellDisplayList[index];
  if (!s) return;

  const levelLabel = s.level === 0 ? 'Cantrip' : 'Level ' + s.level;
  const tags = [levelLabel, s.school];
  if (s.conc)   tags.push('Concentration');
  if (s.ritual) tags.push('Ritual');

  var classes = SPELL_CLASSES[s.name] || [];
  const body =
    tags.join(' · ') + '\n' +
    (classes.length ? 'Classes: ' + classes.join(', ') : '') + '\n\n' +
    'Cast: ' + s.cast + '\n' +
    'Range: ' + s.range + '\n' +
    'Duration: ' + s.duration +
    (s.components ? '\nComponents: ' + s.components : '') +
    '\n\n' + s.desc;

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
  const query = document.getElementById('spell-search').value.toLowerCase();
  const filtered = SPELLS.filter(function (s) {
    const matchesLevel  = activeLevel === 'all' || s.level === activeLevel;
    const matchesSearch = s.name.toLowerCase().includes(query) ||
                          s.desc.toLowerCase().includes(query) ||
                          s.school.toLowerCase().includes(query);
    const matchesConc   = !filterConc   || s.conc   === true;
    const matchesRitual = !filterRitual || s.ritual === true;
    const matchesClass  = activeClass === 'all' || (SPELL_CLASSES[s.name] && SPELL_CLASSES[s.name].indexOf(activeClass) !== -1);
    return matchesLevel && matchesSearch && matchesConc && matchesRitual && matchesClass;
  });
  renderSpells(filtered);
}
