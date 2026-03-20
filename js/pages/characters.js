// =============================================
//   characters.js — Characters page
// =============================================

let npcs      = [];
let creatures = [];
let currentUserId      = null;
let deletedNpcIds      = [];
let deletedCreatureIds = [];
let isDirty            = false;
let autosaveTimer      = null;

setupDirtyGuard(function () { return isDirty; });

(async function () {
  const user = await requireAuth();
  if (!user) return;
  currentUserId = user.id;
  renderNav(user);
  await loadAll();
})();

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

function renderAll() {
  renderList('npc-list',      npcs,      'npc');
  renderList('creature-list', creatures, 'creature');
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
              <input type="text" value="${escapeHtml(item.cr)}"
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
              <input type="number" value="${escapeHtml(item.hp)}"
                onchange="updateField('${type}', ${index}, 'hp', this.value)"
                placeholder="e.g. 30" />
            </div>
            <div>
              <label>AC</label>
              <input type="number" value="${escapeHtml(item.ac)}"
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
          <button class="danger" onclick="removeItem('${type}', ${index})">🗑 Remove</button>
        </div>`;
}

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
  if (type === 'npc')      npcs[index][field]      = value;
  if (type === 'creature') creatures[index][field] = value;
  markDirty();
}

function removeItem(type, index) {
  if (type === 'npc') {
    if (npcs[index]._id) deletedNpcIds.push(npcs[index]._id);
    npcs.splice(index, 1);
  }
  if (type === 'creature') {
    if (creatures[index]._id) deletedCreatureIds.push(creatures[index]._id);
    creatures.splice(index, 1);
  }
  renderAll();
  markDirty();
}

async function saveCharacters() {
  clearTimeout(autosaveTimer);
  const btn = document.getElementById('save-btn');
  setButtonLoading(btn, true);

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
        for (var ni = 0; ni < newNpcsWithoutId.length && ni < reversed.length; ni++) {
          newNpcsWithoutId[ni]._id = reversed[ni].id;
        }
      }
    }

    if (newCreaturesWithoutId.length > 0) {
      const { data: creatureRows } = await db.from('creatures').select('id, name, hp, ac, cr, notes')
        .eq('user_id', currentUserId).order('created_at', { ascending: false }).limit(newCreaturesWithoutId.length);
      if (creatureRows) {
        const reversed = creatureRows.slice().reverse();
        for (var ci = 0; ci < newCreaturesWithoutId.length && ci < reversed.length; ci++) {
          newCreaturesWithoutId[ci]._id = reversed[ci].id;
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
