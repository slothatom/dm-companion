// =============================================
//   locations.js - Locations Manager
// =============================================

let currentUserId = null;
let locations = [];
let campaignsList = [];
let npcsList = [];
let creaturesList = [];
let isDirty = false;
let autosaveTimer = null;

setupDirtyGuard(function () { return isDirty; });

(async function () {
  try {
    const user = await requireAuth();
    if (!user) return;
    currentUserId = user.id;
    renderNav(user);
    await loadData();
    renderLocations();
  } catch (err) {
    showToast('Failed to load locations: ' + err.message, 'error');
  }
})();

// ── Storage ─────────────────────────────────────────────

function getLocKey() { return 'dm-locations-' + currentUserId; }

function loadLocationsData() {
  try {
    locations = JSON.parse(localStorage.getItem(getLocKey())) || [];
  } catch (e) { locations = []; }
}

function persistLocations() {
  localStorage.setItem(getLocKey(), JSON.stringify(locations));
}

async function loadData() {
  // Load campaigns
  var res = await db.from('campaigns').select('id, name').eq('user_id', currentUserId).order('created_at');
  campaignsList = res.data || [];

  // Load NPCs
  var npcRes = await db.from('npcs').select('id, name').eq('user_id', currentUserId).order('created_at');
  npcsList = npcRes.data || [];

  // Load Creatures
  var creRes = await db.from('creatures').select('id, name').eq('user_id', currentUserId).order('created_at');
  creaturesList = creRes.data || [];

  // Populate campaign filter
  var filterEl = document.getElementById('location-campaign-filter');
  filterEl.innerHTML = '<option value="">All Campaigns</option>' +
    campaignsList.map(function (c) {
      return '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(c.name) + '</option>';
    }).join('');

  loadLocationsData();
}

// ── Actions ─────────────────────────────────────────────

var LOCATION_TYPES = ['Town', 'City', 'Village', 'Dungeon', 'Wilderness', 'Landmark', 'Building', 'Other'];

function addLocation() {
  locations.unshift({
    id: 'loc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
    name: '',
    type: 'Town',
    campaignId: document.getElementById('location-campaign-filter').value || '',
    description: '',
    mapUrl: '',
    assignedNpcs: [],
    notes: '',
    tags: ''
  });
  renderLocations();
  markDirty();
}

function removeLocation(index) {
  showConfirm({
    title: 'Delete Location',
    message: 'Remove this location? This cannot be undone.',
    confirmText: 'Delete',
    danger: true,
    onConfirm: function () {
      locations.splice(index, 1);
      renderLocations();
      markDirty();
    }
  });
}

function updateLocation(index, field, value) {
  if (locations[index]) {
    locations[index][field] = value;
    markDirty();
    if (field === 'mapUrl') {
      var preview = document.getElementById('loc-map-' + index);
      if (preview) {
        preview.innerHTML = value && value.trim()
          ? '<img src="' + escapeHtml(value.trim()) + '" alt="Map" style="max-width:100%;max-height:200px;border-radius:6px;margin-top:8px;" onerror="this.style.display=\'none\'" />'
          : '';
      }
    }
  }
}

function toggleNpcAssign(locIndex, npcKey) {
  var loc = locations[locIndex];
  if (!loc) return;
  if (!loc.assignedNpcs) loc.assignedNpcs = [];
  var idx = loc.assignedNpcs.indexOf(npcKey);
  if (idx === -1) loc.assignedNpcs.push(npcKey);
  else loc.assignedNpcs.splice(idx, 1);
  markDirty();
  renderLocations();
}

function markDirty() {
  isDirty = true;
  markUnsaved();
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(saveLocations, 2000);
}

function saveLocations() {
  clearTimeout(autosaveTimer);
  // Remove empty entries
  var empty = locations.filter(function (l) { return !l.name.trim(); });
  if (empty.length > 0) {
    locations = locations.filter(function (l) { return l.name.trim(); });
    showToast('Skipped ' + empty.length + ' unnamed location(s).', 'info');
  }
  persistLocations();
  isDirty = false;
  showSaved();
}

function filterLocations() {
  renderLocations();
}

// ── Render ──────────────────────────────────────────────

function renderLocations() {
  var container = document.getElementById('locations-area');
  var campaignFilter = document.getElementById('location-campaign-filter').value;

  var filtered = locations;
  if (campaignFilter) {
    filtered = locations.filter(function (l) { return l.campaignId === campaignFilter; });
  }

  if (filtered.length === 0 && locations.length === 0) {
    container.innerHTML =
      '<div class="card" style="text-align:center; padding:40px 20px;">' +
        '<i class="fi fi-rr-marker" style="font-size:48px; color:var(--text-dim); display:block; margin-bottom:16px;"></i>' +
        '<h3 style="margin-bottom:8px;">No Locations Yet</h3>' +
        '<p style="color:var(--text-muted); margin-bottom:16px;">Add towns, dungeons, and landmarks for your campaigns.</p>' +
        '<button onclick="addLocation()"><i class="fi fi-rr-plus"></i> Add First Location</button>' +
      '</div>';
    return;
  }

  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-state">No locations match this campaign filter.</p>';
    return;
  }

  container.innerHTML = filtered.map(function (loc, filteredIdx) {
    // Find real index in locations array
    var realIdx = locations.indexOf(loc);

    var campaignName = '';
    if (loc.campaignId) {
      var c = campaignsList.find(function (camp) { return camp.id === loc.campaignId; });
      if (c) campaignName = c.name;
    }

    // Campaign select
    var campaignOptions = '<option value="">No Campaign</option>' +
      campaignsList.map(function (c) {
        return '<option value="' + escapeHtml(c.id) + '"' + (c.id === loc.campaignId ? ' selected' : '') + '>' + escapeHtml(c.name) + '</option>';
      }).join('');

    // Type select
    var typeOptions = LOCATION_TYPES.map(function (t) {
      return '<option' + (t === loc.type ? ' selected' : '') + '>' + t + '</option>';
    }).join('');

    // Map preview
    var mapPreview = '';
    if (loc.mapUrl && loc.mapUrl.trim()) {
      mapPreview = '<img src="' + escapeHtml(loc.mapUrl.trim()) + '" alt="Map" style="max-width:100%;max-height:200px;border-radius:6px;margin-top:8px;" onerror="this.style.display=\'none\'" />';
    }

    // Assigned NPCs/Creatures chips
    var assigned = loc.assignedNpcs || [];
    var assignedChips = assigned.map(function (key) {
      var parts = key.split(':');
      var type = parts[0];
      var id = parts[1];
      var name = '?';
      if (type === 'npc') {
        var npc = npcsList.find(function (n) { return n.id === id; });
        if (npc) name = npc.name;
      } else {
        var cre = creaturesList.find(function (cr) { return cr.id === id; });
        if (cre) name = cre.name;
      }
      var icon = type === 'npc' ? 'fi-rr-user' : 'fi-rr-dragon';
      return '<span class="npc-tag" style="cursor:pointer;" onclick="toggleNpcAssign(' + realIdx + ', \'' + escapeHtml(key) + '\')" title="Click to remove">' +
        '<i class="fi ' + icon + '"></i> ' + escapeHtml(name) + ' ✕</span>';
    }).join(' ');

    // Available NPCs/Creatures to assign (not already assigned)
    var availableNpcs = npcsList.filter(function (n) { return assigned.indexOf('npc:' + n.id) === -1; });
    var availableCreatures = creaturesList.filter(function (cr) { return assigned.indexOf('creature:' + cr.id) === -1; });

    var assignSelect = '';
    if (availableNpcs.length > 0 || availableCreatures.length > 0) {
      var opts = '<option value="">+ Assign NPC/Creature...</option>';
      if (availableNpcs.length > 0) {
        opts += '<optgroup label="NPCs">';
        availableNpcs.forEach(function (n) {
          opts += '<option value="npc:' + escapeHtml(n.id) + '">' + escapeHtml(n.name || 'Unnamed NPC') + '</option>';
        });
        opts += '</optgroup>';
      }
      if (availableCreatures.length > 0) {
        opts += '<optgroup label="Creatures">';
        availableCreatures.forEach(function (cr) {
          opts += '<option value="creature:' + escapeHtml(cr.id) + '">' + escapeHtml(cr.name || 'Unnamed Creature') + '</option>';
        });
        opts += '</optgroup>';
      }
      assignSelect = '<select onchange="if(this.value){toggleNpcAssign(' + realIdx + ',this.value);this.value=\'\';}" style="margin:4px 0 0; min-width:200px;">' + opts + '</select>';
    }

    // Tags display
    var tagsHtml = '';
    if (loc.tags && loc.tags.trim()) {
      tagsHtml = loc.tags.split(',').map(function (t) {
        return '<span class="spell-badge">' + escapeHtml(t.trim()) + '</span>';
      }).join(' ');
    }

    return '<div class="card">' +
      '<div class="stat-grid">' +
        '<div>' +
          '<label>Location Name</label>' +
          '<input type="text" value="' + escapeHtml(loc.name) + '" placeholder="e.g. Neverwinter" onchange="updateLocation(' + realIdx + ', \'name\', this.value)" />' +
        '</div>' +
        '<div>' +
          '<label>Type</label>' +
          '<select onchange="updateLocation(' + realIdx + ', \'type\', this.value)" style="margin:0;">' + typeOptions + '</select>' +
        '</div>' +
        '<div>' +
          '<label>Campaign</label>' +
          '<select onchange="updateLocation(' + realIdx + ', \'campaignId\', this.value)" style="margin:0;">' + campaignOptions + '</select>' +
        '</div>' +
      '</div>' +
      '<div class="stat-grid-2">' +
        '<div>' +
          '<label>Description</label>' +
          '<textarea onchange="updateLocation(' + realIdx + ', \'description\', this.value)" placeholder="Describe this location..." style="min-height:80px;">' + escapeHtml(loc.description || '') + '</textarea>' +
        '</div>' +
        '<div>' +
          '<label>DM Notes (hidden from players)</label>' +
          '<textarea onchange="updateLocation(' + realIdx + ', \'notes\', this.value)" placeholder="Secret notes, traps, hidden lore..." style="min-height:80px;">' + escapeHtml(loc.notes || '') + '</textarea>' +
        '</div>' +
      '</div>' +
      '<div class="stat-grid-2">' +
        '<div>' +
          '<label>Map Image URL</label>' +
          '<input type="url" value="' + escapeHtml(loc.mapUrl || '') + '" placeholder="https://example.com/map.jpg" onchange="updateLocation(' + realIdx + ', \'mapUrl\', this.value)" />' +
          '<div id="loc-map-' + realIdx + '">' + mapPreview + '</div>' +
        '</div>' +
        '<div>' +
          '<label>Tags</label>' +
          '<input type="text" value="' + escapeHtml(loc.tags || '') + '" placeholder="e.g. dangerous, trade hub, coastal" onchange="updateLocation(' + realIdx + ', \'tags\', this.value)" />' +
          '<div style="margin-top:4px;">' + tagsHtml + '</div>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:8px;">' +
        '<label>Assigned NPCs & Creatures</label>' +
        '<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px;">' + (assignedChips || '<span class="empty-state" style="font-size:12px;">None assigned</span>') + '</div>' +
        assignSelect +
      '</div>' +
      '<div style="display:flex; gap:10px; justify-content:flex-end; margin-top:12px;">' +
        '<button class="danger" onclick="removeLocation(' + realIdx + ')"><i class="fi fi-rr-trash"></i> Remove</button>' +
      '</div>' +
    '</div>';
  }).join('');
}
