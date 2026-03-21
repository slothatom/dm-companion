// =============================================
//   maps.js - Map Notes page
// =============================================

let currentUserId = null;
let maps = [];
let isDirty = false;
let autosaveTimer = null;

setupDirtyGuard(function () { return isDirty; });

(async function () {
  try {
    const user = await requireAuth();
    if (!user) return;
    currentUserId = user.id;
    renderNav(user);
    loadMaps();
    renderMaps();
  } catch (err) {
    showToast('Failed to load maps page: ' + err.message, 'error');
  }
})();

// ── Storage ─────────────────────────────────────────────

function getMapsKey() {
  return 'dm-maps-' + currentUserId;
}

function loadMaps() {
  try {
    maps = JSON.parse(localStorage.getItem(getMapsKey())) || [];
  } catch (e) {
    maps = [];
  }
}

function persistMaps() {
  localStorage.setItem(getMapsKey(), JSON.stringify(maps));
}

// ── Actions ─────────────────────────────────────────────

function addMap() {
  maps.push({
    id: 'map-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
    name: '',
    imageUrl: '',
    notes: ''
  });
  renderMaps();
  isDirty = true;
  markUnsaved();
}

function removeMap(index) {
  showConfirm({
    title: 'Delete Map',
    message: 'Remove this map entry? This cannot be undone.',
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
  if (maps[index]) {
    maps[index][field] = value;
    markDirty();
    // Live-update image preview if URL changed
    if (field === 'imageUrl') {
      const preview = document.getElementById('map-preview-' + index);
      if (preview) {
        if (value && value.trim()) {
          preview.innerHTML = '<img src="' + escapeHtml(value.trim()) + '" alt="Map preview" class="map-preview-img" onerror="this.parentElement.innerHTML=\'<p class=empty-state>Image failed to load</p>\'" />';
        } else {
          preview.innerHTML = '<p class="empty-state">Paste an image URL above to preview</p>';
        }
      }
    }
  }
}

function markDirty() {
  isDirty = true;
  markUnsaved();
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(saveMaps, 2000);
}

function saveMaps() {
  clearTimeout(autosaveTimer);
  // Remove entries with no name and no URL
  const empty = maps.filter(function (m) { return !m.name.trim() && !m.imageUrl.trim(); });
  if (empty.length > 0) {
    maps = maps.filter(function (m) { return m.name.trim() || m.imageUrl.trim(); });
    showToast('Skipped ' + empty.length + ' empty map(s).', 'info');
    renderMaps();
  }
  persistMaps();
  isDirty = false;
  showSaved();
}

// ── Render ──────────────────────────────────────────────

function renderMaps() {
  const container = document.getElementById('maps-area');
  if (maps.length === 0) {
    container.innerHTML =
      '<div class="card" style="text-align:center; padding:40px 20px;">' +
        '<i class="fi fi-rr-map" style="font-size:48px; color:var(--text-dim); display:block; margin-bottom:16px;"></i>' +
        '<h3 style="margin-bottom:8px;">Map Notes</h3>' +
        '<p style="color:var(--text-muted); margin-bottom:16px;">Keep notes and image links for your battle maps, world maps, and dungeon layouts.</p>' +
        '<button onclick="addMap()"><i class="fi fi-rr-plus"></i> Add First Map</button>' +
      '</div>';
    return;
  }

  container.innerHTML = maps.map(function (m, i) {
    const hasImage = m.imageUrl && m.imageUrl.trim();
    const previewHtml = hasImage
      ? '<img src="' + escapeHtml(m.imageUrl.trim()) + '" alt="Map preview" class="map-preview-img" onerror="this.parentElement.innerHTML=\'<p class=empty-state>Image failed to load</p>\'" />'
      : '<p class="empty-state">Paste an image URL above to preview</p>';

    return '<div class="card">' +
      '<div class="stat-grid-2">' +
        '<div>' +
          '<label>Map Name</label>' +
          '<input type="text" value="' + escapeHtml(m.name) + '" placeholder="e.g. Goblin Cave Level 1" onchange="updateMap(' + i + ', \'name\', this.value)" />' +
        '</div>' +
        '<div>' +
          '<label>Image URL</label>' +
          '<input type="url" value="' + escapeHtml(m.imageUrl) + '" placeholder="https://example.com/map.jpg" onchange="updateMap(' + i + ', \'imageUrl\', this.value)" />' +
        '</div>' +
      '</div>' +
      '<div class="map-preview" id="map-preview-' + i + '">' + previewHtml + '</div>' +
      '<label>Notes (room descriptions, traps, encounters)</label>' +
      '<textarea onchange="updateMap(' + i + ', \'notes\', this.value)" placeholder="Room 1: Guard post with 2 goblins. DC 12 Perception to notice the trap..." style="min-height:100px;">' + escapeHtml(m.notes) + '</textarea>' +
      '<div style="display:flex; gap:10px; justify-content:flex-end;">' +
        '<button class="danger" onclick="removeMap(' + i + ')"><i class="fi fi-rr-trash"></i> Remove</button>' +
      '</div>' +
    '</div>';
  }).join('');
}
