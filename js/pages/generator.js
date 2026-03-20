// =============================================
//   generator.js — NPC & Creature Generator page
// =============================================

let generatorMode  = 'npc';   // 'npc' | 'creature'
let currentEntry   = null;
let sessionEntries = [];
let currentUserId  = null;

(async function () {
  const user = await requireAuth();
  if (!user) return;
  currentUserId = user.id;
  renderNav(user);
})();

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function setGenMode(mode, btn) {
  generatorMode = mode;
  document.querySelectorAll('.gen-tab').forEach(function (b) { b.classList.remove('active-gen-tab'); });
  btn.classList.add('active-gen-tab');

  const genBtn      = document.getElementById('gen-btn');
  const savBtn      = document.getElementById('save-chars-btn');
  const placeholder = document.getElementById('gen-placeholder');

  if (mode === 'npc') {
    genBtn.textContent = '🎲 Generate NPC';
    savBtn.textContent = '💾 Save to Characters';
    if (placeholder) placeholder.textContent = 'Hit "Generate NPC" to bring someone to life.';
  } else {
    genBtn.textContent = '🎲 Generate Creature';
    savBtn.textContent = '💾 Save to Characters';
    if (placeholder) placeholder.textContent = 'Hit "Generate Creature" to roll up a monster.';
  }

  // Clear output when switching modes
  currentEntry = null;
  const output = document.getElementById('gen-output');
  output.classList.remove('has-npc');
  output.innerHTML = '<p class="empty-state" id="gen-placeholder">' +
    (mode === 'npc' ? 'Hit "Generate NPC" to bring someone to life.'
                    : 'Hit "Generate Creature" to roll up a monster.') + '</p>';
}

// ── NPC ────────────────────────────────────────────────────

function generateNPC() {
  const npc = {
    _type:       'npc',
    name:        pick(FIRST_NAMES) + ' ' + pick(LAST_NAMES),
    race:        pick(RACES),
    occupation:  pick(OCCUPATIONS),
    personality: pick(PERSONALITIES),
    quirk:       pick(QUIRKS),
    motivation:  pick(MOTIVATIONS),
  };
  currentEntry = npc;
  renderNPC(npc);
}

function renderNPC(npc) {
  const output = document.getElementById('gen-output');
  output.classList.add('has-npc');
  output.innerHTML = `
        <div class="npc-name-display">${escapeHtml(npc.name)}</div>
        <span class="npc-tag">${escapeHtml(npc.race)}</span>
        <span class="npc-tag">${escapeHtml(npc.occupation)}</span>
        <br style="margin-bottom:14px;" />
        <div class="npc-trait-row">
          <span class="npc-trait-label">Personality</span>
          ${escapeHtml(npc.personality)}
        </div>
        <div class="npc-trait-row">
          <span class="npc-trait-label">Quirk</span>
          ${escapeHtml(npc.quirk)}
        </div>
        <div class="npc-trait-row">
          <span class="npc-trait-label">Motivation</span>
          ${escapeHtml(npc.motivation)}
        </div>`;
}

// ── Creature ───────────────────────────────────────────────

function generateCreature() {
  const creature = {
    _type:   'creature',
    name:    pick(CREATURE_ADJECTIVES) + ' ' + pick(CREATURE_BASE_NAMES),
    type:    pick(CREATURE_TYPES),
    size:    pick(CREATURE_SIZES),
    cr:      pick(CREATURE_CRS),
    trait:   pick(CREATURE_TRAITS),
    attack:  pick(CREATURE_ATTACKS),
    habitat: pick(CREATURE_HABITATS),
  };
  currentEntry = creature;
  renderCreature(creature);
}

function renderCreature(c) {
  const output = document.getElementById('gen-output');
  output.classList.add('has-npc');
  output.innerHTML = `
        <div class="npc-name-display">${escapeHtml(c.name)}</div>
        <span class="npc-tag">${escapeHtml(c.type)}</span>
        <span class="npc-tag">${escapeHtml(c.size)}</span>
        <span class="npc-tag">CR ${escapeHtml(c.cr)}</span>
        <br style="margin-bottom:14px;" />
        <div class="npc-trait-row">
          <span class="npc-trait-label">Trait</span>
          ${escapeHtml(c.trait)}
        </div>
        <div class="npc-trait-row">
          <span class="npc-trait-label">Attack</span>
          ${escapeHtml(c.attack)}
        </div>
        <div class="npc-trait-row">
          <span class="npc-trait-label">Habitat</span>
          ${escapeHtml(c.habitat)}
        </div>`;
}

// ── Shared ─────────────────────────────────────────────────

function generate() {
  if (generatorMode === 'npc') generateNPC();
  else                          generateCreature();
}

function copyEntry() {
  if (!currentEntry) { showToast('Generate something first!', 'info'); return; }
  var text;
  if (currentEntry._type === 'npc') {
    text = [
      currentEntry.name,
      currentEntry.race + ' ' + currentEntry.occupation,
      'Personality: ' + currentEntry.personality,
      'Quirk: '       + currentEntry.quirk,
      'Motivation: '  + currentEntry.motivation
    ].join('\n');
  } else {
    text = [
      currentEntry.name,
      currentEntry.type + ' · ' + currentEntry.size + ' · CR ' + currentEntry.cr,
      'Trait: '   + currentEntry.trait,
      'Attack: '  + currentEntry.attack,
      'Habitat: ' + currentEntry.habitat
    ].join('\n');
  }
  navigator.clipboard.writeText(text)
    .then(function ()  { showToast('Copied to clipboard!', 'success'); })
    .catch(function () { showToast('Copy failed — try manually.', 'error'); });
}

async function saveToCharacters() {
  if (!currentEntry) { showToast('Generate something first!', 'info'); return; }

  let error;
  if (currentEntry._type === 'npc') {
    const result = await db.from('npcs').insert({
      user_id: currentUserId,
      name:    currentEntry.name,
      hp:      '',
      ac:      '',
      notes:   currentEntry.race + ' ' + currentEntry.occupation + '. ' +
               currentEntry.personality + '. ' + currentEntry.quirk +
               '. Motivation: ' + currentEntry.motivation
    });
    error = result.error;
  } else {
    const result = await db.from('creatures').insert({
      user_id: currentUserId,
      name:    currentEntry.name,
      hp:      '',
      ac:      '',
      cr:      currentEntry.cr,
      notes:   currentEntry.type + ' · ' + currentEntry.size + ' · CR ' + currentEntry.cr +
               '\nTrait: ' + currentEntry.trait +
               '\nAttack: ' + currentEntry.attack +
               '\nHabitat: ' + currentEntry.habitat
    });
    error = result.error;
  }

  if (error) { showToast('Save failed: ' + error.message, 'error'); return; }

  sessionEntries.push(currentEntry);
  renderSessionList();
  showToast(currentEntry.name + ' saved to Characters!', 'success');
}

function renderSessionList() {
  const container = document.getElementById('generated-list');
  if (sessionEntries.length === 0) {
    container.innerHTML = '<p class="empty-state">Nothing generated yet.</p>';
    return;
  }
  container.innerHTML = sessionEntries.map(function (entry) {
    if (entry._type === 'npc') {
      return `
            <div class="card" style="padding:14px 18px;">
              <strong style="color:var(--accent);">${escapeHtml(entry.name)}</strong>
              <span class="npc-tag" style="margin-left:8px;">${escapeHtml(entry.race)}</span>
              <span class="npc-tag">${escapeHtml(entry.occupation)}</span>
              <div style="color:var(--text-muted); font-size:15px; margin-top:6px; font-style:italic;">${escapeHtml(entry.personality)}</div>
            </div>`;
    } else {
      return `
            <div class="card" style="padding:14px 18px;">
              <strong style="color:var(--accent);">${escapeHtml(entry.name)}</strong>
              <span class="npc-tag" style="margin-left:8px;">${escapeHtml(entry.type)}</span>
              <span class="npc-tag">${escapeHtml(entry.size)}</span>
              <span class="npc-tag">CR ${escapeHtml(entry.cr)}</span>
              <div style="color:var(--text-muted); font-size:13px; margin-top:6px; font-style:italic;">${escapeHtml(entry.trait.split(':')[0])}</div>
            </div>`;
    }
  }).join('');
}
