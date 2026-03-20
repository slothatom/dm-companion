// =============================================
//   characters.js - Characters page
// =============================================

let npcs      = [];
let creatures = [];
let currentUserId      = null;
let deletedNpcIds      = [];
let deletedCreatureIds = [];
let isDirty            = false;
let autosaveTimer      = null;
let activeCampaignFilter = '';   // '' = show all
let activeCharTab = 'npc';     // 'npc' | 'creature'
let campaignsList = [];        // [{id, name}, ...] for per-card dropdowns

setupDirtyGuard(function () { return isDirty; });

function setCharTab(tab, btn) {
  activeCharTab = tab;
  document.querySelectorAll('.gen-tab').forEach(function (b) { b.classList.remove('active-gen-tab'); });
  btn.classList.add('active-gen-tab');
  document.getElementById('panel-npc').style.display      = tab === 'npc' ? '' : 'none';
  document.getElementById('panel-creature').style.display  = tab === 'creature' ? '' : 'none';
}

(async function () {
  try {
    const user = await requireAuth();
    if (!user) return;
    currentUserId = user.id;
    renderNav(user);
    await loadCharCampaigns();
    await loadAll();
  } catch (err) {
    showToast('Failed to load characters page: ' + err.message, 'error');
  }
})();

// ── Campaign filter helpers ───────────────────────────────

function getCharCampaignMap() {
  try {
    return JSON.parse(localStorage.getItem('char-campaign-map-' + currentUserId)) || {};
  } catch (e) { return {}; }
}

function saveCharCampaignMap(map) {
  localStorage.setItem('char-campaign-map-' + currentUserId, JSON.stringify(map));
}

function charKey(type, id) {
  return type + ':' + id;
}

async function loadCharCampaigns() {
  const { data } = await db
    .from('campaigns')
    .select('id, name')
    .eq('user_id', currentUserId)
    .order('created_at');

  const bar = document.getElementById('char-campaign-bar');
  if (!data || data.length === 0) {
    bar.style.display = 'none';
    return;
  }

  campaignsList = data;
  bar.style.display = '';
  var typeMap = {};
  try { typeMap = JSON.parse(localStorage.getItem('campaign-type-map-' + currentUserId)) || {}; } catch (e) {}
  const sel = document.getElementById('char-campaign-select');
  (data || []).forEach(function (c) {
    const opt = document.createElement('option');
    opt.value    = c.id;
    opt.textContent = c.name + (typeMap[c.id] === 'oneshot' ? ' (one-shot)' : '');
    sel.appendChild(opt);
  });

  // Restore last-used filter
  const stored = localStorage.getItem('char-campaign-filter-' + currentUserId);
  if (stored) {
    const exists = Array.from(sel.options).some(function (o) { return o.value === stored; });
    if (exists) sel.value = stored;
  }
  activeCampaignFilter = sel.value;
}

function filterByCampaign() {
  const sel = document.getElementById('char-campaign-select');
  activeCampaignFilter = sel.value;
  localStorage.setItem('char-campaign-filter-' + currentUserId, activeCampaignFilter);
  renderAll();
}

function filteredList(list, type) {
  if (!activeCampaignFilter) return list;
  const map = getCharCampaignMap();
  return list.filter(function (item) {
    if (!item._id) return true;               // new unsaved items always visible
    const key = charKey(type, item._id);
    const cid = map[key];
    return cid === activeCampaignFilter || !cid;  // matches campaign OR unassigned
  });
}

// ── Data loading ──────────────────────────────────────────

async function loadAll() {
  const [npcRes, creatureRes] = await Promise.all([
    db.from('npcs').select('*').eq('user_id', currentUserId).order('created_at'),
    db.from('creatures').select('*').eq('user_id', currentUserId).order('created_at')
  ]);
  if (npcRes.error || creatureRes.error) {
    const msg = (npcRes.error || creatureRes.error).message;
    showToast('Could not load data: ' + msg, 'error');
    return;
  }
  npcs      = (npcRes.data      || []).map(function (r) { return { _id: r.id, name: r.name, hp: r.hp, ac: r.ac, notes: r.notes }; });
  creatures = (creatureRes.data || []).map(function (r) { return { _id: r.id, name: r.name, hp: r.hp, ac: r.ac, cr: r.cr || '', notes: r.notes }; });
  deletedNpcIds      = [];
  deletedCreatureIds = [];
  isDirty            = false;
  renderAll();
}

// ── Rendering ─────────────────────────────────────────────

function renderAll() {
  renderList('npc-list',      filteredList(npcs, 'npc'),           'npc');
  renderList('creature-list', filteredList(creatures, 'creature'), 'creature');
}

function renderList(containerId, list, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = list.length === 0
    ? '<p class="empty-state">None yet.</p>'
    : list.map(function (item, i) { return buildCard(item, i, type); }).join('');
}

function buildCard(item, index, type) {
  const crField = type === 'creature' ? `
            <div>
              <label>CR</label>
              <input type="text" value="${escapeHtml(String(item.cr ?? ''))}"
                onchange="updateField('${type}', ${index}, 'cr', this.value)"
                placeholder="e.g. 2 or 1/2" />
            </div>` : '';
  return `
        <div class="card">
          <div class="stat-grid">
            <div>
              <label>Name</label>
              <input type="text" value="${escapeHtml(item.name)}"
                onchange="updateField('${type}', ${index}, 'name', this.value)"
                placeholder="e.g. Gareth the Innkeeper" />
            </div>
            <div>
              <label>HP</label>
              <input type="number" value="${escapeHtml(String(item.hp ?? ''))}"
                onchange="updateField('${type}', ${index}, 'hp', this.value)"
                placeholder="e.g. 30" />
            </div>
            <div>
              <label>AC</label>
              <input type="number" value="${escapeHtml(String(item.ac ?? ''))}"
                onchange="updateField('${type}', ${index}, 'ac', this.value)"
                placeholder="e.g. 13" />
            </div>
            ${crField}
          </div>
          <label>Notes (personality, role, special abilities)</label>
          <textarea
            onchange="updateField('${type}', ${index}, 'notes', this.value)"
            placeholder="e.g. Friendly innkeeper. Secretly a spy."
            style="min-height: 80px;"
          >${escapeHtml(item.notes)}</textarea>
          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            ${buildCampaignDropdown(item, type)}
            <button class="danger" onclick="removeItem('${type}', ${index})"><i class="fi fi-rr-trash"></i> Remove</button>
          </div>
        </div>`;
}

function buildCampaignDropdown(item, type) {
  if (campaignsList.length === 0 || !item._id) return '';
  const map = getCharCampaignMap();
  const current = map[charKey(type, item._id)] || '';
  var typeMap = {};
  try { typeMap = JSON.parse(localStorage.getItem('campaign-type-map-' + currentUserId)) || {}; } catch (e) {}
  const options = '<option value="">No Campaign</option>' +
    campaignsList.map(function (c) {
      const sel = c.id === current ? ' selected' : '';
      var label = escapeHtml(c.name) + (typeMap[c.id] === 'oneshot' ? ' (one-shot)' : '');
      return '<option value="' + escapeHtml(c.id) + '"' + sel + '>' + label + '</option>';
    }).join('');
  return '<select onchange="setCharCampaign(\'' + type + '\', \'' + item._id + '\', this.value)" style="margin:0; min-width:140px; flex:1;">' + options + '</select>';
}

function setCharCampaign(type, id, campaignId) {
  const map = getCharCampaignMap();
  if (campaignId) {
    map[charKey(type, id)] = campaignId;
  } else {
    delete map[charKey(type, id)];
  }
  saveCharCampaignMap(map);
  showToast('Campaign updated.', 'success');
}

// ── Editing ───────────────────────────────────────────────

function markDirty() {
  isDirty = true;
  markUnsaved();
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(saveCharacters, 3000);
}

function addNPC() {
  npcs.push({ name: '', hp: '', ac: '', notes: '' });
  renderAll();
  markDirty();
}

function addCreature() {
  creatures.push({ name: '', hp: '', ac: '', cr: '', notes: '' });
  renderAll();
  markDirty();
}

function updateField(type, index, field, value) {
  // index is relative to the filtered list - resolve back to the master array
  const master = type === 'npc' ? npcs : creatures;
  const visible = filteredList(master, type);
  const item = visible[index];
  if (item) item[field] = value;
  markDirty();
}

function removeItem(type, index) {
  // index is relative to the filtered list - resolve back to the master array
  const master = type === 'npc' ? npcs : creatures;
  const visible = filteredList(master, type);
  const item = visible[index];
  if (!item) return;
  const masterIndex = master.indexOf(item);

  if (type === 'npc') {
    if (item._id) {
      deletedNpcIds.push(item._id);
      // Clean up campaign map entry
      const map = getCharCampaignMap();
      delete map[charKey('npc', item._id)];
      saveCharCampaignMap(map);
    }
    npcs.splice(masterIndex, 1);
  }
  if (type === 'creature') {
    if (item._id) {
      deletedCreatureIds.push(item._id);
      const map2 = getCharCampaignMap();
      delete map2[charKey('creature', item._id)];
      saveCharCampaignMap(map2);
    }
    creatures.splice(masterIndex, 1);
  }
  renderAll();
  markDirty();
}

// ── Saving ────────────────────────────────────────────────

async function saveCharacters() {
  clearTimeout(autosaveTimer);
  const btn = document.getElementById('save-btn');
  setButtonLoading(btn, true);

  // Validate: filter out items with empty/whitespace-only names
  const emptyNpcs = npcs.filter(function (n) { return !n.name || !n.name.trim(); });
  const emptyCreatures = creatures.filter(function (c) { return !c.name || !c.name.trim(); });
  const skipped = emptyNpcs.length + emptyCreatures.length;
  npcs      = npcs.filter(function (n) { return n.name && n.name.trim(); });
  creatures = creatures.filter(function (c) { return c.name && c.name.trim(); });
  if (skipped > 0) {
    showToast('Skipped ' + skipped + ' item(s) with no name.', 'info');
    renderAll();
  }

  // Step 1: delete only rows the user explicitly removed
  const deleteOps = [];
  if (deletedNpcIds.length > 0) {
    deleteOps.push(db.from('npcs').delete().in('id', deletedNpcIds));
  }
  if (deletedCreatureIds.length > 0) {
    deleteOps.push(db.from('creatures').delete().in('id', deletedCreatureIds));
  }
  if (deleteOps.length > 0) {
    const deleteResults = await Promise.all(deleteOps);
    const deleteErrors  = deleteResults.map(function (r) { return r.error; }).filter(Boolean);
    if (deleteErrors.length) {
      setButtonLoading(btn, false);
      showToast('Save failed: ' + deleteErrors[0].message, 'error');
      return;
    }
  }

  // Step 2: upsert existing rows (have _id) and insert new rows (no _id)
  const npcExisting      = npcs.filter(function (n) { return  n._id; }).map(function (n) { return { id: n._id, user_id: currentUserId, name: n.name, hp: n.hp, ac: n.ac, notes: n.notes }; });
  const npcNew           = npcs.filter(function (n) { return !n._id; }).map(function (n) { return {           user_id: currentUserId, name: n.name, hp: n.hp, ac: n.ac, notes: n.notes }; });
  const creatureExisting = creatures.filter(function (c) { return  c._id; }).map(function (c) { return { id: c._id, user_id: currentUserId, name: c.name, hp: c.hp, ac: c.ac, cr: c.cr, notes: c.notes }; });
  const creatureNew      = creatures.filter(function (c) { return !c._id; }).map(function (c) { return {           user_id: currentUserId, name: c.name, hp: c.hp, ac: c.ac, cr: c.cr, notes: c.notes }; });

  const saveOps = [];
  if (npcExisting.length > 0)      saveOps.push(db.from('npcs').upsert(npcExisting));
  if (npcNew.length > 0)           saveOps.push(db.from('npcs').insert(npcNew));
  if (creatureExisting.length > 0) saveOps.push(db.from('creatures').upsert(creatureExisting));
  if (creatureNew.length > 0)      saveOps.push(db.from('creatures').insert(creatureNew));

  if (saveOps.length > 0) {
    const saveResults = await Promise.all(saveOps);
    const saveErrors  = saveResults.map(function (r) { return r.error; }).filter(Boolean);
    if (saveErrors.length) {
      setButtonLoading(btn, false);
      showToast('Save failed: ' + saveErrors[0].message, 'error');
      return;
    }
  }

  // Fetch server-assigned IDs for newly inserted rows (without full reload)
  if (npcNew.length > 0 || creatureNew.length > 0) {
    const newNpcsWithoutId = npcs.filter(function (n) { return !n._id; });
    const newCreaturesWithoutId = creatures.filter(function (c) { return !c._id; });

    if (newNpcsWithoutId.length > 0) {
      const { data: npcRows } = await db.from('npcs').select('id, name, hp, ac, notes')
        .eq('user_id', currentUserId).order('created_at', { ascending: false }).limit(newNpcsWithoutId.length);
      if (npcRows) {
        const reversed = npcRows.slice().reverse();
        for (let ni = 0; ni < newNpcsWithoutId.length && ni < reversed.length; ni++) {
          newNpcsWithoutId[ni]._id = reversed[ni].id;
          // Auto-associate new NPC with active campaign
          if (activeCampaignFilter) {
            const npcMap = getCharCampaignMap();
            npcMap[charKey('npc', reversed[ni].id)] = activeCampaignFilter;
            saveCharCampaignMap(npcMap);
          }
        }
      }
    }

    if (newCreaturesWithoutId.length > 0) {
      const { data: creatureRows } = await db.from('creatures').select('id, name, hp, ac, cr, notes')
        .eq('user_id', currentUserId).order('created_at', { ascending: false }).limit(newCreaturesWithoutId.length);
      if (creatureRows) {
        const reversed = creatureRows.slice().reverse();
        for (let ci = 0; ci < newCreaturesWithoutId.length && ci < reversed.length; ci++) {
          newCreaturesWithoutId[ci]._id = reversed[ci].id;
          // Auto-associate new creature with active campaign
          if (activeCampaignFilter) {
            const creatureMap = getCharCampaignMap();
            creatureMap[charKey('creature', reversed[ci].id)] = activeCampaignFilter;
            saveCharCampaignMap(creatureMap);
          }
        }
      }
    }
  }

  deletedNpcIds      = [];
  deletedCreatureIds = [];
  setButtonLoading(btn, false);
  isDirty = false;
  showSaved();
}
