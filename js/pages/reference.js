// =============================================
//   reference.js — Quick Reference page
// =============================================

let activeCategory = 'all';

const CAT_HEADINGS = {
  condition: '⚡ Conditions',
  action:    '⚔️ Combat Actions',
  cover:     '🛡 Cover',
  skill:     '🎯 Skills',
};

const REFERENCE = [
  // ── Conditions ──────────────────────────────────────────────
  { category: 'condition', name: 'Blinded',
    desc: "Can't see. Attack rolls against you have advantage; your attack rolls have disadvantage. Automatically fails ability checks that require sight." },
  { category: 'condition', name: 'Charmed',
    desc: "Can't attack the charmer or target them with harmful abilities or magical effects. Charmer has advantage on Charisma checks made against you." },
  { category: 'condition', name: 'Deafened',
    desc: "Can't hear. Automatically fails ability checks that require hearing." },
  { category: 'condition', name: 'Exhaustion',
    desc: 'Level 1: Disadvantage on ability checks. Level 2: Speed halved. Level 3: Disadvantage on attacks and saving throws. Level 4: HP max halved. Level 5: Speed 0. Level 6: Death. Each long rest removes 1 level. Requires food + water or rest is disrupted.' },
  { category: 'condition', name: 'Frightened',
    desc: "Disadvantage on ability checks and attack rolls while you can see the source of fear. Can't willingly move closer to the source." },
  { category: 'condition', name: 'Grappled',
    desc: "Speed becomes 0 and can't benefit from bonuses to speed. Ends if grappler is incapacitated, or if target is moved outside the grappler's reach." },
  { category: 'condition', name: 'Incapacitated',
    desc: "Can't take actions or reactions." },
  { category: 'condition', name: 'Invisible',
    desc: "Impossible to see without magic or a special sense. Considered heavily obscured. Attack rolls against you have disadvantage; your attack rolls have advantage." },
  { category: 'condition', name: 'Paralyzed',
    desc: "Incapacitated and can't move or speak. Automatically fails STR and DEX saving throws. Attacks against you have advantage. Any attack that hits within 5 ft is a critical hit." },
  { category: 'condition', name: 'Petrified',
    desc: "Transformed into solid inanimate matter. Incapacitated, can't move or speak, and unaware. Fails STR/DEX saves. Resistance to all damage. Immune to poison and disease (existing not progressed)." },
  { category: 'condition', name: 'Poisoned',
    desc: 'Disadvantage on attack rolls and ability checks.' },
  { category: 'condition', name: 'Prone',
    desc: "Must crawl (costs 1 extra ft per ft moved) or spend half movement to stand up. Disadvantage on your attack rolls. Melee attacks against you have advantage; ranged attacks have disadvantage." },
  { category: 'condition', name: 'Restrained',
    desc: 'Speed becomes 0. Attacks against you have advantage; your attacks have disadvantage. Disadvantage on DEX saving throws.' },
  { category: 'condition', name: 'Stunned',
    desc: "Incapacitated, can't move. Can speak only falteringly. Automatically fails STR and DEX saves. Attacks against you have advantage." },
  { category: 'condition', name: 'Unconscious',
    desc: "Incapacitated, can't move or speak, unaware of surroundings. Drops held items and falls prone. Automatically fails STR/DEX saves. Attacks have advantage. Hits within 5 ft are critical hits." },

  // ── Combat Actions ───────────────────────────────────────────
  { category: 'action', name: 'Attack',
    desc: 'Make one melee or ranged weapon attack. Extra Attack lets you make additional attacks. Unarmed strikes count.' },
  { category: 'action', name: 'Cast a Spell',
    desc: 'Cast a spell with a casting time of 1 action. Bonus action and reaction spells use those resources instead.' },
  { category: 'action', name: 'Dash',
    desc: 'Gain extra movement equal to your speed (after speed adjustments from conditions/terrain) for this turn.' },
  { category: 'action', name: 'Disengage',
    desc: "Your movement doesn't provoke opportunity attacks for the rest of the turn." },
  { category: 'action', name: 'Dodge',
    desc: "Until your next turn, attack rolls against you have disadvantage (if you can see attacker) and you have advantage on DEX saves. Lost if incapacitated or speed drops to 0." },
  { category: 'action', name: 'Help',
    desc: 'Give an ally advantage on their next ability check, or on their next attack roll against a target within 5 ft of you.' },
  { category: 'action', name: 'Hide',
    desc: 'Make a DEX (Stealth) check. On success vs passive Perception, you become hidden. You must be out of line of sight or heavily obscured.' },
  { category: 'action', name: 'Ready',
    desc: 'Choose a perceivable trigger and a reaction to take when it occurs. Reaction fires before or after the trigger. Concentration starts now for readied spells and is lost if not triggered before your next turn.' },
  { category: 'action', name: 'Search',
    desc: 'Devote attention to locating something — typically a WIS (Perception) or INT (Investigation) check.' },
  { category: 'action', name: 'Use an Object',
    desc: "Interact with a second object (you get one free object interaction per turn). Use a magic item, administer a potion, etc." },
  { category: 'action', name: 'Grapple',
    desc: 'Use the Attack action. Target ≤ one size larger than you. Make STR (Athletics) vs target STR (Athletics) or DEX (Acrobatics). On success: target is Grappled.' },
  { category: 'action', name: 'Shove',
    desc: 'Use the Attack action. STR (Athletics) vs target STR (Athletics) or DEX (Acrobatics). On success: push 5 ft away or knock Prone. Target must be ≤ one size larger.' },
  { category: 'action', name: 'Two-Weapon Fighting',
    desc: "When you attack with a light melee weapon in one hand, use a bonus action to attack with a different light melee weapon in the other. Don't add your ability modifier to the bonus attack's damage (unless negative)." },
  { category: 'action', name: 'Opportunity Attack (Reaction)',
    desc: "When a hostile creature you can see moves out of your reach, you may use your reaction to make one melee attack against it." },
  { category: 'action', name: 'Improvised Weapon',
    desc: 'Use any object as a weapon (1d4 damage). Thrown range 20/60. At DM discretion, proficient characters may be proficient.' },

  // ── Cover ────────────────────────────────────────────────────
  { category: 'cover', name: 'Half Cover',
    desc: '+2 bonus to AC and DEX saving throws. Provided by a low wall, large furniture, another creature, or a narrow tree.' },
  { category: 'cover', name: 'Three-Quarters Cover',
    desc: '+5 bonus to AC and DEX saving throws. Provided by a portcullis, arrow slit, or thick tree trunk.' },
  { category: 'cover', name: 'Total Cover',
    desc: "Cannot be directly targeted by an attack or a spell. Completely concealed by an obstacle. Note: area effects can still reach a creature behind total cover if they originate on the same side." },

  // ── Skills ───────────────────────────────────────────────────
  { category: 'skill', name: 'Athletics (STR)',
    desc: 'Climb, jump, swim; contests to grapple, escape a grapple, or shove.' },
  { category: 'skill', name: 'Acrobatics (DEX)',
    desc: 'Stay on your feet in tricky situations, flip, tumble, escape a grapple through agility.' },
  { category: 'skill', name: 'Sleight of Hand (DEX)',
    desc: 'Pickpocket, plant an object on someone, conceal an object about your person.' },
  { category: 'skill', name: 'Stealth (DEX)',
    desc: "Move silently and avoid detection. Contests with passive Perception or active Perception checks." },
  { category: 'skill', name: 'Arcana (INT)',
    desc: 'Knowledge of spells, magic items, eldritch symbols, magical traditions, planes of existence, and their denizens.' },
  { category: 'skill', name: 'History (INT)',
    desc: 'Recall lore about historical events, legendary people, ancient kingdoms, past disputes, recent wars, lost civilizations.' },
  { category: 'skill', name: 'Investigation (INT)',
    desc: 'Look for clues, deduce from evidence, recall information, assess a situation, identify a forgery or illusion.' },
  { category: 'skill', name: 'Nature (INT)',
    desc: 'Knowledge of terrain, plants, animals, weather, natural cycles, and creatures of the natural world.' },
  { category: 'skill', name: 'Religion (INT)',
    desc: 'Knowledge of deities, rites, prayers, religious hierarchies, holy symbols, and the practices of secret cults.' },
  { category: 'skill', name: 'Animal Handling (WIS)',
    desc: "Calm or control a domesticated animal, intuit an animal's intentions, guide a mount." },
  { category: 'skill', name: 'Insight (WIS)',
    desc: 'Determine the true intentions of a creature, detect lies, sense when something is off.' },
  { category: 'skill', name: 'Medicine (WIS)',
    desc: 'Stabilize a dying companion, diagnose illness, treat a wound, remember medical lore.' },
  { category: 'skill', name: 'Perception (WIS)',
    desc: 'Spot, hear, or otherwise detect the presence of something. Passive Perception = 10 + WIS modifier (+ proficiency if proficient).' },
  { category: 'skill', name: 'Survival (WIS)',
    desc: 'Follow tracks, hunt game, navigate wilderness, predict weather, avoid or find natural hazards.' },
  { category: 'skill', name: 'Deception (CHA)',
    desc: 'Mislead, tell a convincing lie, disguise the truth verbally or through actions.' },
  { category: 'skill', name: 'Intimidation (CHA)',
    desc: 'Frighten, coerce, or influence through overt threats, hostile actions, or physical presence.' },
  { category: 'skill', name: 'Performance (CHA)',
    desc: 'Entertain an audience through music, dance, acting, storytelling, or some other form of art.' },
  { category: 'skill', name: 'Persuasion (CHA)',
    desc: 'Influence through tact, social graces, good nature, flattery, or compelling arguments.' },
];

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
  renderRef(REFERENCE);
})();

function setCat(cat, btn) {
  activeCategory = cat;
  document.querySelectorAll('#cat-filters .filter-btn').forEach(function (b) { b.classList.remove('active-filter'); });
  btn.classList.add('active-filter');
  filterRef();
}

function filterRef() {
  const q = document.getElementById('ref-search').value.toLowerCase();
  const filtered = REFERENCE.filter(function (r) {
    const matchesCat    = activeCategory === 'all' || r.category === activeCategory;
    const matchesSearch = !q || r.name.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });
  renderRef(filtered);
}

function renderRef(list) {
  const container = document.getElementById('ref-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">Nothing matches your search.</p>';
    return;
  }

  // Store items for modal lookup by index
  window._refDisplayList = list;

  // Group by category
  const groups = {};
  list.forEach(function (r) {
    if (!groups[r.category]) groups[r.category] = [];
    groups[r.category].push(r);
  });

  const order = ['condition', 'action', 'cover', 'skill'];
  let html = '';
  let idx   = 0;

  order.forEach(function (cat) {
    if (!groups[cat]) return;
    if (activeCategory === 'all') html += '<h2>' + CAT_HEADINGS[cat] + '</h2>';
    html += '<div class="ref-grid">';
    groups[cat].forEach(function (r) {
      html += `
            <div class="ref-card" onclick="openRefDetail(${idx})" title="Click to expand">
              <div class="ref-name">${escapeHtml(r.name)}</div>
              <div class="ref-desc">${escapeHtml(r.desc)}</div>
            </div>`;
      idx++;
    });
    html += '</div>';
  });

  container.innerHTML = html;
}

function openRefDetail(index) {
  const item = window._refDisplayList && window._refDisplayList[index];
  if (!item) return;
  showInfoModal({ title: item.name, body: item.desc });
}
