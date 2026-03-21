// =============================================
//   generator.js - NPC & Creature Generator page
// =============================================

let generatorMode  = 'npc';   // 'npc' | 'creature'
let currentEntry   = null;
let sessionEntries = [];
let currentUserId  = null;
let autoSaveOn     = false;

(async function () {
  const user = await requireAuth();
  if (!user) return;
  currentUserId = user.id;
  renderNav(user);
  await loadGenCampaigns();
  // Restore autosave preference
  if (localStorage.getItem('gen-autosave') === '1') {
    autoSaveOn = true;
    document.getElementById('gen-autosave').checked = true;
  }
})();

async function loadGenCampaigns() {
  const { data } = await db
    .from('campaigns')
    .select('id, name')
    .eq('user_id', currentUserId)
    .order('created_at');

  const sel = document.getElementById('gen-campaign-select');
  if (!data || data.length === 0) {
    sel.style.display = 'none';
    return;
  }
  var typeMap = {};
  try { typeMap = JSON.parse(localStorage.getItem('campaign-type-map-' + currentUserId)) || {}; } catch (e) {}
  data.forEach(function (c) {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name + (typeMap[c.id] === 'oneshot' ? ' (one-shot)' : '');
    sel.appendChild(opt);
  });
}

function setGenMode(mode, btn) {
  generatorMode = mode;
  document.querySelectorAll('.gen-tab').forEach(function (b) { b.classList.remove('active-gen-tab'); });
  btn.classList.add('active-gen-tab');

  const genBtn      = document.getElementById('gen-btn');
  const savBtn      = document.getElementById('save-chars-btn');
  const placeholder = document.getElementById('gen-placeholder');

  if (mode === 'npc') {
    genBtn.innerHTML = '<i class="fi fi-rr-dice-d20"></i> Generate NPC';
    savBtn.innerHTML = '<i class="fi fi-rr-disk"></i> Save to Characters';
    if (placeholder) placeholder.textContent = 'Hit "Generate NPC" to bring someone to life.';
  } else {
    genBtn.innerHTML = '<i class="fi fi-rr-dice-d20"></i> Generate Creature';
    savBtn.innerHTML = '<i class="fi fi-rr-disk"></i> Save to Characters';
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

// ── Archetype occupation pools ─────────────────────────────

const ARCHETYPE_OCCUPATIONS = {
  commoner:   ['Innkeeper','Farmer','Fisherman','Woodcutter','Stable Hand','Dockworker','Tavern Wench','Beggar','Gravedigger','Mine Foreman'],
  merchant:   ['Merchant','Traveling Trader','Jeweler','Tailor','Apothecary','Herbalist'],
  guard:      ['City Guard','Militiaman','Bounty Hunter','Debt Collector'],
  noble:      ['Noble','Magistrate','Diplomat','Court Advisor','Tax Collector','Heir'],
  criminal:   ['Thief','Smuggler','Fence','Pickpocket','Assassin','Forger','Bounty Hunter','Debt Collector'],
  magic:      ['Wizard','Sorcerer','Warlock','Alchemist','Enchanter','Fortune Teller','Herbalist','Scholar'],
  adventurer: ['Bounty Hunter','Explorer','Mercenary','Treasure Hunter','Ranger','Monster Slayer','Sailor','Cartographer'],
  religious:  ['Priest','Acolyte','Temple Guard','Pilgrim','Inquisitor','Monk','Healer']
};

// ── NPC ────────────────────────────────────────────────────

function generateNPC() {
  const archetype = document.getElementById('gen-archetype').value;
  const occupationPool = archetype !== 'any' && ARCHETYPE_OCCUPATIONS[archetype]
    ? ARCHETYPE_OCCUPATIONS[archetype]
    : OCCUPATIONS;

  const npc = {
    _type:       'npc',
    name:        pick(FIRST_NAMES) + ' ' + pick(LAST_NAMES),
    race:        pick(RACES),
    occupation:  pick(occupationPool),
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

function toggleAutosave() {
  autoSaveOn = document.getElementById('gen-autosave').checked;
  localStorage.setItem('gen-autosave', autoSaveOn ? '1' : '');
}

function generate() {
  if (generatorMode === 'npc') generateNPC();
  else                          generateCreature();
  if (autoSaveOn) saveToCharacters();
}

function copyEntry() {
  if (!currentEntry) { showToast('Generate something first!', 'info'); return; }
  let text;
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
    .catch(function () { showToast('Copy failed - try manually.', 'error'); });
}

async function saveToCharacters() {
  if (!currentEntry) { showToast('Generate something first!', 'info'); return; }

  const table = currentEntry._type === 'npc' ? 'npcs' : 'creatures';
  const row = currentEntry._type === 'npc'
    ? {
        user_id: currentUserId,
        name:    currentEntry.name,
        hp:      '',
        ac:      '',
        notes:   currentEntry.race + ' ' + currentEntry.occupation + '. ' +
                 currentEntry.personality + '. ' + currentEntry.quirk +
                 '. Motivation: ' + currentEntry.motivation
      }
    : {
        user_id: currentUserId,
        name:    currentEntry.name,
        hp:      '',
        ac:      '',
        cr:      currentEntry.cr,
        notes:   currentEntry.type + ' · ' + currentEntry.size + ' · CR ' + currentEntry.cr +
                 '\nTrait: ' + currentEntry.trait +
                 '\nAttack: ' + currentEntry.attack +
                 '\nHabitat: ' + currentEntry.habitat
      };

  const result = await db.from(table).insert(row).select('id').single();
  if (result.error) { showToast('Save failed: ' + result.error.message, 'error'); return; }

  // Associate with selected campaign via localStorage map
  const campaignId = document.getElementById('gen-campaign-select').value;
  if (campaignId && result.data) {
    const mapKey = 'char-campaign-map-' + currentUserId;
    const map = JSON.parse(localStorage.getItem(mapKey) || '{}');
    map[currentEntry._type + ':' + result.data.id] = campaignId;
    localStorage.setItem(mapKey, JSON.stringify(map));
  }

  sessionEntries.push(currentEntry);
  localStorage.setItem('generator-session-entries', JSON.stringify(sessionEntries));
  renderSessionList();
  const campaignNote = campaignId ? ' (linked to campaign)' : '';
  showToast(currentEntry.name + ' saved to Characters!' + campaignNote, 'success');

  // Show "View in Characters" link in output
  var viewLink = document.getElementById('gen-view-link');
  if (!viewLink) {
    viewLink = document.createElement('a');
    viewLink.id = 'gen-view-link';
    viewLink.href = 'characters.html';
    viewLink.className = 'btn-link gen-view-chars';
    viewLink.innerHTML = '<i class="fi fi-rr-arrow-right"></i> View in Characters';
    document.getElementById('gen-output').appendChild(viewLink);
  }
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
