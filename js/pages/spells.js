// =============================================
//   spells.js — Spell Reference page
// =============================================

let activeLevel  = 'all';
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
  container.innerHTML = list.map(function (s) {
    const levelLabel = s.level === 0 ? 'Cantrip' : 'Level ' + s.level;
    const concBadge  = s.conc   ? '<span class="spell-badge badge-conc">Concentration</span>'  : '';
    const ritualBadge= s.ritual ? '<span class="spell-badge badge-ritual">Ritual</span>' : '';
    return `
          <div class="spell-card">
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

function setLevel(level, btn) {
  activeLevel = level;
  document.querySelectorAll('#level-filters .filter-btn').forEach(function (b) { b.classList.remove('active-filter'); });
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
    return matchesLevel && matchesSearch && matchesConc && matchesRitual;
  });
  renderSpells(filtered);
}
