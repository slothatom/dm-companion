// =============================================
//   notes.js — Session Notes page
// =============================================

let currentUserId    = null;
let activeCampaignId = null;   // null = General Notes
let currentNoteId    = null;
let isDirty          = false;
let autosaveTimer    = null;

setupDirtyGuard(function () { return isDirty; });

(async function () {
  try {
    const user = await requireAuth();
    if (!user) return;
    currentUserId = user.id;
    renderNav(user);
    await loadCampaigns();
    await loadNotesForCampaign();
  } catch (err) {
    showToast('Failed to load notes page: ' + err.message, 'error');
  }
})();

// ── Campaign selector ─────────────────────────────────────

async function loadCampaigns() {
  const { data } = await db
    .from('campaigns')
    .select('id, name')
    .eq('user_id', currentUserId)
    .order('created_at');

  const sel = document.getElementById('notes-campaign');
  (data || []).forEach(function (c) {
    const opt = document.createElement('option');
    opt.value       = c.id;
    opt.textContent = c.name;
    sel.appendChild(opt);
  });

  const stored = localStorage.getItem('notes-campaign-' + currentUserId);
  if (stored) {
    const exists = Array.from(sel.options).some(function (o) { return o.value === stored; });
    if (exists) {
      sel.value        = stored;
      activeCampaignId = stored || null;
    }
  }
}

function switchCampaign() {
  const val   = document.getElementById('notes-campaign').value;
  const newId = val === '' ? null : val;

  // Cancel any pending autosave and clear dirty flag before switching
  clearTimeout(autosaveTimer);
  autosaveTimer = null;
  isDirty = false;

  activeCampaignId = newId;
  currentNoteId    = null;
  localStorage.setItem('notes-campaign-' + currentUserId, val);
  loadNotesForCampaign();
}

// ── Load / Save ───────────────────────────────────────────

async function loadNotesForCampaign() {
  document.getElementById('notes-loading').style.display = 'flex';
  document.getElementById('notes-form').style.display    = 'none';

  let query = db.from('session_notes').select('*').eq('user_id', currentUserId);
  if (activeCampaignId === null) {
    query = query.is('campaign_id', null);
  } else {
    query = query.eq('campaign_id', activeCampaignId);
  }
  const { data, error } = await query.maybeSingle();

  document.getElementById('notes-loading').style.display = 'none';
  document.getElementById('notes-form').style.display    = 'block';

  if (error) { showToast('Could not load notes: ' + error.message, 'error'); return; }

  if (data) {
    currentNoteId = data.id;
    document.getElementById('session-title').value = data.title     || '';
    document.getElementById('story').value         = data.story     || '';
    document.getElementById('locations').value     = data.locations || '';
    document.getElementById('dm-notes').value      = data.dm_notes  || '';
  } else {
    currentNoteId = null;
    document.getElementById('session-title').value = '';
    document.getElementById('story').value         = '';
    document.getElementById('locations').value     = '';
    document.getElementById('dm-notes').value      = '';
  }
  isDirty = false;
}

function markDirty() {
  isDirty = true;
  markUnsaved();
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(saveNotes, 2500);
}

async function saveNotes() {
  clearTimeout(autosaveTimer);
  const btn = document.getElementById('save-btn');
  setButtonLoading(btn, true);

  const payload = {
    user_id:     currentUserId,
    campaign_id: activeCampaignId,
    title:       document.getElementById('session-title').value,
    story:       document.getElementById('story').value,
    locations:   document.getElementById('locations').value,
    dm_notes:    document.getElementById('dm-notes').value,
    updated_at:  new Date().toISOString()
  };

  let error;
  if (currentNoteId) {
    const result = await db.from('session_notes').update(payload).eq('id', currentNoteId);
    error = result.error;
  } else {
    const result = await db.from('session_notes').insert(payload).select('id').single();
    error = result.error;
    if (!error && result.data) currentNoteId = result.data.id;
  }

  setButtonLoading(btn, false);
  if (error) {
    showToast('Save failed: ' + error.message, 'error');
  } else {
    isDirty = false;
    showSaved();
  }
}

// ── Reset / Delete ────────────────────────────────────────

function resetNotes() {
  showConfirm({
    title:       'Reset Notes',
    message:     'Clear all content in this note? The blank note will be saved immediately.',
    confirmText: 'Reset',
    danger:      true,
    onConfirm:   function () {
      document.getElementById('session-title').value = '';
      document.getElementById('story').value         = '';
      document.getElementById('locations').value     = '';
      document.getElementById('dm-notes').value      = '';
      isDirty = true;
      saveNotes();
    },
  });
}

function deleteNotes() {
  if (!currentNoteId) { showToast('No saved note to delete.', 'info'); return; }
  showConfirm({
    title:       'Delete Notes',
    message:     'Permanently delete this note? This cannot be undone.',
    confirmText: 'Delete',
    danger:      true,
    onConfirm:   async function () {
      const { error } = await db.from('session_notes').delete().eq('id', currentNoteId);
      if (error) { showToast('Delete failed: ' + error.message, 'error'); return; }
      currentNoteId = null;
      isDirty       = false;
      document.getElementById('session-title').value = '';
      document.getElementById('story').value         = '';
      document.getElementById('locations').value     = '';
      document.getElementById('dm-notes').value      = '';
      showToast('Notes deleted.', 'success');
    },
  });
}
