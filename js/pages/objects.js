// =============================================
//   objects.js - Object Statistics Reference
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
})();

// ── AC by Material ──────────────────────────────────────

var MATERIAL_AC = [
  { material: 'Cloth, paper, rope',    ac: 11 },
  { material: 'Crystal, glass, ice',   ac: 13 },
  { material: 'Wood, bone',            ac: 15 },
  { material: 'Stone',                 ac: 17 },
  { material: 'Iron, steel',           ac: 19 },
  { material: 'Mithral',              ac: 21 },
  { material: 'Adamantine',           ac: 23 }
];

// ── HP by Size and Resilience ───────────────────────────

var SIZE_HP = [
  { size: 'Tiny',       fragile: '2 (1d4)',    resilient: '5 (2d4)' },
  { size: 'Small',      fragile: '3 (1d6)',    resilient: '10 (3d6)' },
  { size: 'Medium',     fragile: '4 (1d8)',    resilient: '18 (4d8)' },
  { size: 'Large',      fragile: '5 (1d10)',   resilient: '27 (5d10)' },
  { size: 'Huge',       fragile: '8 (2d8)',    resilient: '36 (8d8)' },
  { size: 'Gargantuan', fragile: '20 (3d12)',  resilient: '50 (10d10)' }
];

// ── Common Objects ──────────────────────────────────────

var COMMON_OBJECTS = [
  { name: 'Barrel',              ac: 11, hp: 4,  material: 'Wood',  notes: 'Medium, fragile', category: 'container' },
  { name: 'Cart/Wagon wheel',    ac: 15, hp: 18, material: 'Wood',  notes: 'Medium, resilient', category: 'container' },
  { name: 'Chain (10 ft)',       ac: 19, hp: 5,  material: 'Iron',  notes: 'Tiny, resilient', category: 'misc' },
  { name: 'Chest (wooden)',      ac: 15, hp: 18, material: 'Wood',  notes: 'Medium, resilient', category: 'container' },
  { name: 'Chest (iron)',        ac: 19, hp: 18, material: 'Iron',  notes: 'Medium, resilient', category: 'container' },
  { name: 'Door (wooden)',       ac: 15, hp: 18, material: 'Wood',  notes: 'Large, resilient', category: 'structure' },
  { name: 'Door (stone)',        ac: 17, hp: 27, material: 'Stone', notes: 'Large, resilient', category: 'structure' },
  { name: 'Door (iron)',         ac: 19, hp: 27, material: 'Iron',  notes: 'Large, resilient', category: 'structure' },
  { name: 'Door (adamantine)',   ac: 23, hp: 36, material: 'Adamantine', notes: 'Large, resilient', category: 'structure' },
  { name: 'Glass bottle',        ac: 13, hp: 2,  material: 'Glass', notes: 'Tiny, fragile', category: 'misc' },
  { name: 'Lock (iron)',         ac: 19, hp: 5,  material: 'Iron',  notes: 'Tiny, resilient', category: 'misc' },
  { name: 'Manacles',            ac: 19, hp: 5,  material: 'Iron',  notes: 'Tiny, resilient', category: 'misc' },
  { name: 'Mirror (steel)',      ac: 19, hp: 5,  material: 'Steel', notes: 'Tiny, resilient', category: 'misc' },
  { name: 'Mirror (glass)',      ac: 13, hp: 2,  material: 'Glass', notes: 'Tiny, fragile', category: 'misc' },
  { name: 'Rope (hempen, 50 ft)', ac: 11, hp: 4, material: 'Rope', notes: 'Medium, fragile', category: 'misc' },
  { name: 'Rope (silk, 50 ft)',  ac: 11, hp: 5,  material: 'Rope',  notes: 'Medium, resilient', category: 'misc' },
  { name: 'Shield (wooden)',     ac: 15, hp: 10, material: 'Wood',  notes: 'Small, resilient', category: 'armor' },
  { name: 'Shield (steel)',      ac: 19, hp: 10, material: 'Steel', notes: 'Small, resilient', category: 'armor' },
  { name: 'Staff',               ac: 15, hp: 4,  material: 'Wood',  notes: 'Medium, fragile', category: 'armor' },
  { name: 'Table (wooden)',      ac: 15, hp: 18, material: 'Wood',  notes: 'Large, resilient', category: 'furniture' },
  { name: 'Wagon',               ac: 15, hp: 27, material: 'Wood',  notes: 'Huge, resilient', category: 'furniture' },
  { name: 'Wall (brick, 1 ft)',  ac: 17, hp: 27, material: 'Stone', notes: 'Large, resilient (per 10-ft section)', category: 'structure' },
  { name: 'Wall (stone, 1 ft)',  ac: 17, hp: 36, material: 'Stone', notes: 'Huge, resilient (per 10-ft section)', category: 'structure' },
  { name: 'Wall (iron, 1 inch)', ac: 19, hp: 27, material: 'Iron',  notes: 'Large, resilient (per 10-ft section)', category: 'structure' },
  { name: 'Wall (force)',        ac: 19, hp: 50, material: 'Magic', notes: 'Per Wall of Force spell; immune to most damage', category: 'structure' },
  { name: 'Window (glass)',      ac: 13, hp: 2,  material: 'Glass', notes: 'Small, fragile', category: 'structure' },
  { name: 'Pillar (stone)',      ac: 17, hp: 36, material: 'Stone', notes: 'Huge, resilient', category: 'structure' },
  { name: 'Portcullis (iron)',   ac: 19, hp: 27, material: 'Iron',  notes: 'Large, resilient', category: 'structure' },
  { name: 'Statue (stone, medium)', ac: 17, hp: 18, material: 'Stone', notes: 'Medium, resilient', category: 'furniture' },
  { name: 'Throne (stone)',      ac: 17, hp: 27, material: 'Stone', notes: 'Large, resilient', category: 'furniture' },
  // Armor & Equipment
  { name: 'Leather armor',       ac: 11, hp: 5,  material: 'Leather', notes: 'Small, fragile; worn AC 11+DEX', category: 'armor' },
  { name: 'Studded leather',     ac: 11, hp: 8,  material: 'Leather/Metal', notes: 'Small, resilient; worn AC 12+DEX', category: 'armor' },
  { name: 'Chain shirt',         ac: 19, hp: 10, material: 'Iron', notes: 'Small, resilient; worn AC 13+DEX(max 2)', category: 'armor' },
  { name: 'Chain mail',          ac: 19, hp: 15, material: 'Iron', notes: 'Medium, resilient; worn AC 16, STR 13 req', category: 'armor' },
  { name: 'Scale mail',          ac: 19, hp: 15, material: 'Iron', notes: 'Medium, resilient; worn AC 14+DEX(max 2)', category: 'armor' },
  { name: 'Breastplate',         ac: 19, hp: 18, material: 'Steel', notes: 'Medium, resilient; worn AC 14+DEX(max 2)', category: 'armor' },
  { name: 'Half plate',          ac: 19, hp: 20, material: 'Steel', notes: 'Medium, resilient; worn AC 15+DEX(max 2)', category: 'armor' },
  { name: 'Plate armor',         ac: 19, hp: 27, material: 'Steel', notes: 'Large, resilient; worn AC 18, STR 15 req', category: 'armor' },
  { name: 'Mithral armor',       ac: 21, hp: 36, material: 'Mithral', notes: 'Large, resilient; no STR req, no stealth disadv', category: 'armor' },
  { name: 'Adamantine armor',    ac: 23, hp: 50, material: 'Adamantine', notes: 'Large, resilient; critical hits become normal', category: 'armor' }
];

// ── Siege Rules ─────────────────────────────────────────

var SIEGE_RULES = {
  title: 'Siege Damage',
  description: 'Objects and structures that are Huge or Gargantuan are immune to damage from normal weapons unless the DM decides otherwise. A siege weapon (such as a battering ram, catapult, or ballista) deals double damage to objects and structures. Fire can also damage objects and structures - an object that takes fire damage catches fire if it is flammable.',
  notes: [
    'Huge/Gargantuan objects: immune to normal weapon damage (DM discretion)',
    'Siege weapons deal double damage to objects and structures',
    'Flammable objects catch fire when they take fire damage',
    'Objects are immune to poison and psychic damage',
    'DM may decide that certain objects have resistance or immunity to certain damage types (e.g., a stone wall resists piercing)',
    'An object drops to 0 HP when destroyed; it may be wrecked or completely obliterated at DM discretion',
    'A damaged object can be repaired with appropriate tools and materials'
  ]
};

// ── Category Filter ─────────────────────────────────────

var activeObjCat = 'all';

function setObjCat(cat, btn) {
  activeObjCat = cat;
  document.querySelectorAll('#obj-cat-filters .filter-btn').forEach(function (b) {
    b.classList.remove('active-filter');
  });
  btn.classList.add('active-filter');
  renderObjects();
}

// ── Random Object Generator ─────────────────────────────

function generateRandomObject() {
  var catFilter = document.getElementById('obj-gen-cat').value;
  var matFilter = document.getElementById('obj-gen-material').value;

  var candidates = COMMON_OBJECTS.filter(function (o) {
    var matchesCat = catFilter === 'any' || o.category === catFilter;
    var matchesMat = matFilter === 'any' ||
      o.material.toLowerCase().indexOf(matFilter.toLowerCase()) !== -1;
    return matchesCat && matchesMat;
  });

  var output = document.getElementById('obj-gen-output');
  if (candidates.length === 0) {
    output.innerHTML = '<p class="empty-state">No objects match those filters. Try broadening your selection.</p>';
    showToast('No matching objects found', 'info');
    return;
  }

  var obj = candidates[Math.floor(Math.random() * candidates.length)];
  output.innerHTML =
    '<div class="card" style="padding:18px; margin-bottom:16px;">' +
      '<h3 style="margin:0 0 8px; color:var(--accent);">' + escapeHtml(obj.name) + '</h3>' +
      '<div class="spell-stats" style="margin-bottom:8px;">' +
        '<span class="spell-stat"><strong>AC</strong> ' + obj.ac + '</span>' +
        '<span class="spell-stat"><strong>HP</strong> ' + obj.hp + '</span>' +
        '<span class="spell-badge">' + escapeHtml(obj.material) + '</span>' +
        (obj.category ? '<span class="spell-badge">' + escapeHtml(obj.category) + '</span>' : '') +
      '</div>' +
      '<p style="margin:0; color:var(--text-muted); font-size:14px;">' + escapeHtml(obj.notes) + '</p>' +
    '</div>';

  showToast('Generated: ' + obj.name, 'info');
}

// ── Rendering ───────────────────────────────────────────

function renderObjects() {
  var container = document.getElementById('objects-content');
  var filter = (document.getElementById('object-search') || {}).value || '';
  filter = filter.toLowerCase();

  var htmlStr = '';

  // AC by Material table
  htmlStr += '<div class="card" style="padding:18px; margin-bottom:16px;">';
  htmlStr += '<h3 style="margin:0 0 12px; color:var(--accent);">Armor Class by Material</h3>';
  htmlStr += '<table style="width:100%; border-collapse:collapse; font-size:14px;">';
  htmlStr += '<thead><tr style="text-align:left; border-bottom:2px solid var(--border);">';
  htmlStr += '<th style="padding:6px 8px;">Material</th>';
  htmlStr += '<th style="padding:6px 8px; text-align:center;">AC</th>';
  htmlStr += '</tr></thead><tbody>';
  MATERIAL_AC.forEach(function (m) {
    htmlStr += '<tr style="border-bottom:1px solid var(--border);">';
    htmlStr += '<td style="padding:6px 8px;">' + escapeHtml(m.material) + '</td>';
    htmlStr += '<td style="padding:6px 8px; text-align:center; font-weight:600;">' + m.ac + '</td>';
    htmlStr += '</tr>';
  });
  htmlStr += '</tbody></table></div>';

  // HP by Size table
  htmlStr += '<div class="card" style="padding:18px; margin-bottom:16px;">';
  htmlStr += '<h3 style="margin:0 0 12px; color:var(--accent);">Hit Points by Size</h3>';
  htmlStr += '<table style="width:100%; border-collapse:collapse; font-size:14px;">';
  htmlStr += '<thead><tr style="text-align:left; border-bottom:2px solid var(--border);">';
  htmlStr += '<th style="padding:6px 8px;">Size</th>';
  htmlStr += '<th style="padding:6px 8px; text-align:center;">Fragile</th>';
  htmlStr += '<th style="padding:6px 8px; text-align:center;">Resilient</th>';
  htmlStr += '</tr></thead><tbody>';
  SIZE_HP.forEach(function (s) {
    htmlStr += '<tr style="border-bottom:1px solid var(--border);">';
    htmlStr += '<td style="padding:6px 8px;">' + escapeHtml(s.size) + '</td>';
    htmlStr += '<td style="padding:6px 8px; text-align:center;">' + escapeHtml(s.fragile) + '</td>';
    htmlStr += '<td style="padding:6px 8px; text-align:center;">' + escapeHtml(s.resilient) + '</td>';
    htmlStr += '</tr>';
  });
  htmlStr += '</tbody></table></div>';

  // Common Objects
  var filteredObjects = COMMON_OBJECTS.filter(function (o) {
    var matchesCat = activeObjCat === 'all' || o.category === activeObjCat;
    var matchesSearch = !filter ||
      o.name.toLowerCase().indexOf(filter) !== -1 ||
      o.material.toLowerCase().indexOf(filter) !== -1 ||
      o.notes.toLowerCase().indexOf(filter) !== -1;
    return matchesCat && matchesSearch;
  });

  htmlStr += '<div class="card" style="padding:18px; margin-bottom:16px;">';
  htmlStr += '<h3 style="margin:0 0 12px; color:var(--accent);">Common Objects</h3>';
  if (filteredObjects.length === 0) {
    htmlStr += '<p class="empty-state">No objects match your search.</p>';
  } else {
    htmlStr += '<table style="width:100%; border-collapse:collapse; font-size:14px;">';
    htmlStr += '<thead><tr style="text-align:left; border-bottom:2px solid var(--border);">';
    htmlStr += '<th style="padding:6px 8px;">Object</th>';
    htmlStr += '<th style="padding:6px 8px; text-align:center;">AC</th>';
    htmlStr += '<th style="padding:6px 8px; text-align:center;">HP</th>';
    htmlStr += '<th style="padding:6px 8px;">Material</th>';
    htmlStr += '<th style="padding:6px 8px;">Notes</th>';
    htmlStr += '</tr></thead><tbody>';
    filteredObjects.forEach(function (o) {
      htmlStr += '<tr style="border-bottom:1px solid var(--border);">';
      htmlStr += '<td style="padding:6px 8px; font-weight:500;">' + escapeHtml(o.name) + '</td>';
      htmlStr += '<td style="padding:6px 8px; text-align:center;">' + o.ac + '</td>';
      htmlStr += '<td style="padding:6px 8px; text-align:center;">' + o.hp + '</td>';
      htmlStr += '<td style="padding:6px 8px; color:var(--text-muted);">' + escapeHtml(o.material) + '</td>';
      htmlStr += '<td style="padding:6px 8px; color:var(--text-dim); font-size:13px;">' + escapeHtml(o.notes) + '</td>';
      htmlStr += '</tr>';
    });
    htmlStr += '</tbody></table>';
  }
  htmlStr += '</div>';

  // Siege Rules
  htmlStr += '<div class="card" style="padding:18px;">';
  htmlStr += '<h3 style="margin:0 0 8px; color:var(--accent);">' + escapeHtml(SIEGE_RULES.title) + '</h3>';
  htmlStr += '<p style="margin:0 0 12px;">' + escapeHtml(SIEGE_RULES.description) + '</p>';
  htmlStr += '<ul style="margin:0; padding-left:20px;">';
  SIEGE_RULES.notes.forEach(function (note) {
    htmlStr += '<li style="margin-bottom:4px;">' + escapeHtml(note) + '</li>';
  });
  htmlStr += '</ul></div>';

  container.innerHTML = htmlStr;
}

// Initial render
document.addEventListener('DOMContentLoaded', function () {
  renderObjects();
});

if (document.readyState !== 'loading') {
  renderObjects();
}
