// =============================================
//   trap-generator.js — Random Trap Generator
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
})();

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rollDice(num, sides) {
  var total = 0;
  for (var i = 0; i < num; i++) total += Math.floor(Math.random() * sides) + 1;
  return total;
}

// ── Trap Components ─────────────────────────────────────

var TRIGGERS = [
  { name: 'Pressure plate', desc: 'A stone tile depresses slightly when stepped on, activating the mechanism.' },
  { name: 'Tripwire', desc: 'A thin wire stretched across the passage at ankle height.' },
  { name: 'Opening a door', desc: 'The trap activates when the door is opened or its handle turned.' },
  { name: 'Picking up an object', desc: 'Removing the item from its pedestal releases the trigger mechanism.' },
  { name: 'Magical ward', desc: 'An invisible glyph flares with arcane energy when crossed.' },
  { name: 'Opening a chest', desc: 'The chest lid is connected to a hidden mechanism inside.' },
  { name: 'Pulling a lever', desc: 'The lever appears to open a door but actually springs the trap.' },
  { name: 'Breaking a beam of light', desc: 'An invisible beam of light crosses the corridor; breaking it triggers the trap.' },
  { name: 'Sound trigger', desc: 'Speaking above a whisper or making loud noise triggers the trap.' },
  { name: 'Weight-sensitive floor', desc: 'The floor buckles when more than 50 pounds of weight is placed on it.' },
  { name: 'False step on stairs', desc: 'One of the stairs is slightly raised and clicks when stepped on.' },
  { name: 'Disturbing a corpse', desc: 'Moving or looting the dead body triggers a hidden mechanism.' }
];

var EFFECTS = [
  { name: 'Pit trap', desc: 'The floor gives way, dropping creatures into a {depth}-foot deep pit.', depths: [10, 20, 30, 40], damageType: 'bludgeoning', baseDamage: '{depth/10}d6' },
  { name: 'Spiked pit', desc: 'The floor opens into a {depth}-foot pit lined with iron spikes at the bottom.', depths: [10, 20, 30], damageType: 'piercing', baseDamage: '{depth/10}d6 + 2d10' },
  { name: 'Poison darts', desc: 'Tiny darts shoot from hidden holes in the wall.', damageType: 'poison', baseDamage: '1d4 piercing + poison' },
  { name: 'Poison needle', desc: 'A tiny needle springs from the lock or handle, injecting venom.', damageType: 'poison', baseDamage: '1 piercing + poison' },
  { name: 'Falling net', desc: 'A heavy net drops from the ceiling, restraining creatures underneath.', damageType: 'none (restrained)', baseDamage: '0' },
  { name: 'Swinging blade', desc: 'A massive blade swings from a hidden slot in the wall.', damageType: 'slashing', baseDamage: '2d10' },
  { name: 'Fire blast', desc: 'Jets of flame erupt from hidden nozzles, filling the area with fire.', damageType: 'fire', baseDamage: '4d6' },
  { name: 'Lightning bolt', desc: 'A bolt of lightning arcs between two metal plates on opposite walls.', damageType: 'lightning', baseDamage: '4d10' },
  { name: 'Sleep gas', desc: 'A sweet-smelling gas fills the chamber, causing drowsiness.', damageType: 'none (unconscious)', baseDamage: '0' },
  { name: 'Alarm', desc: 'A loud bell rings or a magical alarm sounds, alerting nearby creatures.', damageType: 'none (alert)', baseDamage: '0' },
  { name: 'Collapsing ceiling', desc: 'Sections of the ceiling break free and crash down.', damageType: 'bludgeoning', baseDamage: '4d10' },
  { name: 'Rolling boulder', desc: 'A massive stone sphere rolls down the corridor toward the party.', damageType: 'bludgeoning', baseDamage: '6d10' },
  { name: 'Acid spray', desc: 'A hidden nozzle sprays a stream of corrosive acid.', damageType: 'acid', baseDamage: '4d6' },
  { name: 'Freezing blast', desc: 'A wave of intense cold erupts, coating surfaces in frost.', damageType: 'cold', baseDamage: '4d6' },
  { name: 'Necrotic energy', desc: 'Dark energy pulses outward from a cursed rune, draining life force.', damageType: 'necrotic', baseDamage: '4d8' },
  { name: 'Flooding chamber', desc: 'Water begins pouring in from hidden vents, rapidly filling the room.', damageType: 'none (drowning)', baseDamage: '0' },
  { name: 'Teleportation trap', desc: 'A flash of arcane light teleports creatures to a different location.', damageType: 'none (displacement)', baseDamage: '0' },
  { name: 'Blade wall', desc: 'Spinning blades emerge from slots in the floor and walls.', damageType: 'slashing', baseDamage: '3d8' }
];

var SEVERITIES = {
  setback:   { label: 'Setback',   dc: '10-11', saveDC: 10, damage: '1d10', color: '#4a9' },
  dangerous: { label: 'Dangerous', dc: '12-15', saveDC: 15, damage: '4d10', color: '#da3' },
  deadly:    { label: 'Deadly',    dc: '16-20', saveDC: 20, damage: '10d10', color: '#d44' }
};

var LOCATIONS = [
  'a narrow stone corridor',
  'a dusty chamber',
  'the entrance to a tomb',
  'a treasure vault',
  'a winding passageway',
  'the threshold of a ruined temple',
  'a damp underground tunnel',
  'an abandoned wizard\'s study',
  'a forgotten dungeon cell',
  'the steps leading to a throne room',
  'a hidden passage behind a bookshelf',
  'a bridge over an underground chasm'
];

// ── Generation ──────────────────────────────────────────

function generateTrap() {
  var severity = document.getElementById('trap-severity').value;
  if (severity === 'random') {
    severity = pick(['setback', 'dangerous', 'deadly']);
  }

  var sev = SEVERITIES[severity];
  var trigger = pick(TRIGGERS);
  var effect = pick(EFFECTS);
  var location = pick(LOCATIONS);

  // Calculate DCs
  var detectDC = sev.saveDC + rollDice(1, 4) - 2; // saveDC -1 to +2
  var disarmDC = sev.saveDC + rollDice(1, 4) - 2;
  var saveDC = sev.saveDC;

  // Determine depth for pit traps
  var depth = effect.depths ? pick(effect.depths) : 0;

  // Build damage string based on severity
  var damageStr = sev.damage;
  if (effect.damageType === 'none (restrained)' || effect.damageType === 'none (unconscious)' ||
      effect.damageType === 'none (alert)' || effect.damageType === 'none (drowning)' ||
      effect.damageType === 'none (displacement)') {
    damageStr = 'None';
  }

  // Build description
  var desc = 'Located in ' + location + '. ' + trigger.desc + ' ';
  var effectDesc = effect.desc;
  if (depth > 0) {
    effectDesc = effectDesc.replace('{depth}', String(depth));
  }
  desc += effectDesc;

  // Build save info
  var saveType = 'DEX';
  if (effect.damageType === 'poison') saveType = 'CON';
  else if (effect.damageType === 'none (unconscious)') saveType = 'CON';
  else if (effect.damageType === 'necrotic') saveType = 'CON';
  else if (effect.damageType === 'none (displacement)') saveType = 'CHA';

  var trap = {
    trigger: trigger.name,
    effect: effect.name,
    severity: sev.label,
    severityColor: sev.color,
    damageType: effect.damageType,
    damage: damageStr,
    detectDC: detectDC,
    disarmDC: disarmDC,
    saveDC: saveDC,
    saveType: saveType,
    description: desc,
    location: location
  };

  renderTrap(trap);
}

function renderTrap(trap) {
  var output = document.getElementById('trap-output');
  var htmlStr = '';

  htmlStr += '<div class="card" style="padding:18px;">';
  htmlStr += '<div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">';
  htmlStr += '<h3 style="margin:0; color:var(--accent);">' + escapeHtml(trap.effect) + '</h3>';
  htmlStr += '<span class="npc-tag" style="background:' + trap.severityColor + '; color:#fff;">' + escapeHtml(trap.severity) + '</span>';
  htmlStr += '</div>';
  htmlStr += '<div style="color:var(--text-dim); margin-bottom:14px; font-style:italic;">Trigger: ' + escapeHtml(trap.trigger) + '</div>';

  htmlStr += '<div style="margin-bottom:14px;">' + escapeHtml(trap.description) + '</div>';

  htmlStr += '<div class="scores-grid" style="margin-bottom:14px;">';
  htmlStr += '<div class="score-card"><div class="score-label">Detect DC</div><div class="score-value" style="font-size:20px;">' + trap.detectDC + '</div></div>';
  htmlStr += '<div class="score-card"><div class="score-label">Disarm DC</div><div class="score-value" style="font-size:20px;">' + trap.disarmDC + '</div></div>';
  htmlStr += '<div class="score-card"><div class="score-label">Save DC</div><div class="score-value" style="font-size:20px;">' + trap.saveDC + '</div><div class="score-mod">' + escapeHtml(trap.saveType) + ' save</div></div>';
  htmlStr += '<div class="score-card"><div class="score-label">Damage</div><div class="score-value" style="font-size:18px;">' + escapeHtml(trap.damage) + '</div><div class="score-mod">' + escapeHtml(trap.damageType) + '</div></div>';
  htmlStr += '</div>';

  htmlStr += '</div>';
  output.innerHTML = htmlStr;
}

function copyTrap() {
  var output = document.getElementById('trap-output');
  if (!output || !output.textContent.trim()) {
    showToast('Generate a trap first!', 'info');
    return;
  }
  navigator.clipboard.writeText(output.textContent)
    .then(function () { showToast('Trap copied!', 'success'); })
    .catch(function () { showToast('Copy failed.', 'error'); });
}
