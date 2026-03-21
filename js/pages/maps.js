// =============================================
//   maps.js - Enhanced Map Manager
// =============================================

let currentUserId = null;
let maps = [];
let campaignsList = [];
let isDirty = false;
let autosaveTimer = null;
let pinningMapIndex = -1; // -1 means not in pin mode

setupDirtyGuard(function () { return isDirty; });

var MAP_TYPES = ['Battle Map', 'World Map', 'Dungeon Map', 'Regional Map', 'City Map'];

(async function () {
  try {
    const user = await requireAuth();
    if (!user) return;
    currentUserId = user.id;
    renderNav(user);
    await loadData();
    renderMaps();
  } catch (err) {
    showToast('Failed to load maps: ' + err.message, 'error');
  }
})();

async function loadData() {
  var res = await db.from('campaigns').select('id, name').eq('user_id', currentUserId).order('created_at');
  campaignsList = res.data || [];

  var filterEl = document.getElementById('map-campaign-filter');
  filterEl.innerHTML = '<option value="">All Campaigns</option>' +
    campaignsList.map(function (c) {
      return '<option value="' + escapeHtml(c.id) + '">' + escapeHtml(c.name) + '</option>';
    }).join('');

  loadMapsData();
}

function getMapsKey() { return 'dm-maps-' + currentUserId; }

function loadMapsData() {
  try { maps = JSON.parse(localStorage.getItem(getMapsKey())) || []; }
  catch (e) { maps = []; }
  // Migration: add new fields to old maps
  maps.forEach(function (m) {
    if (!m.campaignId) m.campaignId = '';
    if (!m.mapType) m.mapType = 'Battle Map';
    if (!m.pins) m.pins = [];
  });
}

function persistMaps() { localStorage.setItem(getMapsKey(), JSON.stringify(maps)); }

function addMap() {
  maps.push({
    id: 'map-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
    name: '',
    imageUrl: '',
    notes: '',
    campaignId: document.getElementById('map-campaign-filter').value || '',
    mapType: 'Battle Map',
    pins: []
  });
  renderMaps();
  markDirty();
}

function removeMap(index) {
  showConfirm({
    title: 'Delete Map',
    message: 'Remove this map? This cannot be undone.',
    confirmText: 'Delete',
    danger: true,
    onConfirm: function () {
      maps.splice(index, 1);
      renderMaps();
      markDirty();
    }
  });
}

function updateMap(index, field, value) {
  if (!maps[index]) return;
  maps[index][field] = value;
  markDirty();
  if (field === 'imageUrl') renderMaps();
}

function markDirty() {
  isDirty = true;
  markUnsaved();
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(saveMaps, 2000);
}

function saveMaps() {
  clearTimeout(autosaveTimer);
  var empty = maps.filter(function (m) { return !m.name.trim() && !m.imageUrl.trim(); });
  if (empty.length > 0) {
    maps = maps.filter(function (m) { return m.name.trim() || m.imageUrl.trim(); });
    showToast('Skipped ' + empty.length + ' empty map(s).', 'info');
  }
  persistMaps();
  isDirty = false;
  showSaved();
}

// ── Pin Management ──────────────────────────────────────

function togglePinMode(index) {
  if (pinningMapIndex === index) {
    pinningMapIndex = -1;
    showToast('Pin mode off', 'info');
  } else {
    pinningMapIndex = index;
    showToast('Click on the map image to add a pin', 'info');
  }
  renderMaps();
}

function handleMapClick(index, event) {
  if (pinningMapIndex !== index) return;
  var img = event.currentTarget;
  var rect = img.getBoundingClientRect();
  var x = ((event.clientX - rect.left) / rect.width * 100).toFixed(1);
  var y = ((event.clientY - rect.top) / rect.height * 100).toFixed(1);

  showPrompt({
    title: 'Add Map Pin',
    message: 'Enter a label for this pin:',
    placeholder: 'e.g. Dragon Lair, Guard Post',
    confirmText: 'Add Pin',
    onConfirm: function (label) {
      if (!label || !label.trim()) return;
      maps[index].pins.push({ x: parseFloat(x), y: parseFloat(y), label: label.trim() });
      markDirty();
      renderMaps();
    }
  });
}

function removePin(mapIndex, pinIndex) {
  maps[mapIndex].pins.splice(pinIndex, 1);
  markDirty();
  renderMaps();
}

// ── Image Paste Handler ─────────────────────────────────

function setupPasteHandler(index) {
  var input = document.getElementById('map-url-' + index);
  if (!input) return;
  input.addEventListener('paste', function (e) {
    var items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        var file = items[i].getAsFile();
        var reader = new FileReader();
        reader.onload = function (ev) {
          var dataUrl = ev.target.result;
          // Check size - warn if > 2MB
          if (dataUrl.length > 2 * 1024 * 1024) {
            showToast('Image is very large — may slow things down.', 'info');
          }
          maps[index].imageUrl = dataUrl;
          input.value = '(pasted image)';
          markDirty();
          renderMaps();
        };
        reader.readAsDataURL(file);
        return;
      }
    }
  });
}

// ── Render ──────────────────────────────────────────────

function renderMaps() {
  var container = document.getElementById('maps-area');
  var campaignFilter = document.getElementById('map-campaign-filter').value;

  var filtered = maps;
  if (campaignFilter) {
    filtered = maps.filter(function (m) { return m.campaignId === campaignFilter; });
  }

  if (filtered.length === 0 && maps.length === 0) {
    container.innerHTML =
      '<div class="card" style="text-align:center; padding:40px 20px;">' +
        '<i class="fi fi-rr-map-pin" style="font-size:48px; color:var(--text-dim); display:block; margin-bottom:16px;"></i>' +
        '<h3 style="margin-bottom:8px;">Map Notes</h3>' +
        '<p style="color:var(--text-muted); margin-bottom:16px;">Add battle maps, world maps, and dungeon layouts. Paste images or provide URLs.</p>' +
        '<button onclick="addMap()"><i class="fi fi-rr-plus"></i> Add First Map</button>' +
      '</div>';
    return;
  }

  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-state">No maps match this campaign filter.</p>';
    return;
  }

  container.innerHTML = filtered.map(function (m) {
    var realIdx = maps.indexOf(m);
    var hasImage = m.imageUrl && m.imageUrl.trim();
    var isDataUrl = hasImage && m.imageUrl.indexOf('data:') === 0;
    var urlDisplay = isDataUrl ? '(pasted image)' : (m.imageUrl || '');

    // Campaign select
    var campaignOptions = '<option value="">No Campaign</option>' +
      campaignsList.map(function (c) {
        return '<option value="' + escapeHtml(c.id) + '"' + (c.id === m.campaignId ? ' selected' : '') + '>' + escapeHtml(c.name) + '</option>';
      }).join('');

    // Type select
    var typeOptions = MAP_TYPES.map(function (t) {
      return '<option' + (t === m.mapType ? ' selected' : '') + '>' + t + '</option>';
    }).join('');

    // Map image with pins overlay
    var mapImageHtml = '';
    if (hasImage) {
      var pinOverlays = (m.pins || []).map(function (pin, pi) {
        return '<div class="map-pin" style="left:' + pin.x + '%;top:' + pin.y + '%;" title="' + escapeHtml(pin.label) + '">' +
          '<i class="fi fi-rr-marker"></i>' +
          '<span class="map-pin-label">' + escapeHtml(pin.label) + '</span>' +
          '<button class="map-pin-remove" onclick="event.stopPropagation();removePin(' + realIdx + ',' + pi + ')" title="Remove pin">\u2715</button>' +
        '</div>';
      }).join('');

      var isPinning = pinningMapIndex === realIdx;
      mapImageHtml = '<div class="map-image-wrap' + (isPinning ? ' pinning' : '') + '" onclick="handleMapClick(' + realIdx + ', event)" style="position:relative;cursor:' + (isPinning ? 'crosshair' : 'default') + ';">' +
        '<img src="' + escapeHtml(m.imageUrl.trim()) + '" alt="Map" class="map-preview-img" onerror="this.parentElement.innerHTML=\'<p class=empty-state>Image failed to load</p>\'" />' +
        pinOverlays +
      '</div>';
    } else {
      mapImageHtml = '<p class="empty-state">Paste an image or enter a URL above</p>';
    }

    // Pin list
    var pinList = '';
    if (m.pins && m.pins.length > 0) {
      pinList = '<div style="margin-top:8px;"><label>Pins (' + m.pins.length + ')</label>' +
        '<div style="display:flex;flex-wrap:wrap;gap:4px;">' +
        m.pins.map(function (pin, pi) {
          return '<span class="npc-tag" style="cursor:pointer;" onclick="removePin(' + realIdx + ',' + pi + ')" title="Click to remove">' +
            '<i class="fi fi-rr-marker"></i> ' + escapeHtml(pin.label) + ' \u2715</span>';
        }).join('') + '</div></div>';
    }

    var isPinning = pinningMapIndex === realIdx;

    return '<div class="card">' +
      '<div class="stat-grid">' +
        '<div>' +
          '<label>Map Name</label>' +
          '<input type="text" value="' + escapeHtml(m.name) + '" placeholder="e.g. Goblin Cave Level 1" onchange="updateMap(' + realIdx + ', \'name\', this.value)" />' +
        '</div>' +
        '<div>' +
          '<label>Type</label>' +
          '<select onchange="updateMap(' + realIdx + ', \'mapType\', this.value)" style="margin:0;">' + typeOptions + '</select>' +
        '</div>' +
        '<div>' +
          '<label>Campaign</label>' +
          '<select onchange="updateMap(' + realIdx + ', \'campaignId\', this.value)" style="margin:0;">' + campaignOptions + '</select>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<label>Image URL <span style="color:var(--text-dim);font-size:10px;text-transform:none;">(or paste an image)</span></label>' +
        '<input type="text" id="map-url-' + realIdx + '" value="' + escapeHtml(urlDisplay) + '" placeholder="https://example.com/map.jpg or paste image" onchange="updateMap(' + realIdx + ', \'imageUrl\', this.value)" />' +
      '</div>' +
      '<div class="map-preview">' + mapImageHtml + '</div>' +
      '<div style="display:flex;gap:8px;margin-top:8px;">' +
        '<button class="' + (isPinning ? 'gold' : 'secondary') + '" onclick="togglePinMode(' + realIdx + ')" style="padding:6px 14px;font-size:12px;">' +
          '<i class="fi fi-rr-marker"></i> ' + (isPinning ? 'Done Pinning' : 'Add Pins') +
        '</button>' +
      '</div>' +
      pinList +
      '<label>Notes</label>' +
      '<textarea onchange="updateMap(' + realIdx + ', \'notes\', this.value)" placeholder="Room descriptions, traps, encounters..." style="min-height:80px;">' + escapeHtml(m.notes) + '</textarea>' +
      '<div style="display:flex; gap:10px; justify-content:flex-end;">' +
        '<button class="danger" onclick="removeMap(' + realIdx + ')"><i class="fi fi-rr-trash"></i> Remove</button>' +
      '</div>' +
    '</div>';
  }).join('');

  // Setup paste handlers for each map's URL input
  filtered.forEach(function (m) {
    var realIdx = maps.indexOf(m);
    setupPasteHandler(realIdx);
  });
}
