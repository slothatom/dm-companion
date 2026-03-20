// =============================================
//   rules.js — Fast Rules Reference (Searchable)
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
})();

// ── Rules Data ──────────────────────────────────────────

var RULES_SECTIONS = [
  {
    title: 'Combat Flow',
    tags: 'initiative turns actions movement reactions combat order round',
    subsections: [
      {
        heading: 'Initiative',
        content: 'When combat starts, every participant makes a Dexterity check to determine their place in the initiative order. The DM makes one roll for entire groups of identical creatures. Ties are broken by DEX score or DM choice. Initiative order remains the same from round to round.'
      },
      {
        heading: 'Your Turn',
        content: 'On your turn you can move a distance up to your speed AND take one action. You can also take one bonus action (if you have a feature that grants one), one free object interaction, and any number of reactions (though only one per trigger between your turns). You can break up your movement before and after your action.'
      },
      {
        heading: 'Actions',
        content: 'Standard actions: Attack, Cast a Spell, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Use an Object. Some class features grant additional action options.'
      },
      {
        heading: 'Movement in Combat',
        content: 'You can move up to your speed on your turn. You can break up movement (move, attack, move again). Moving through an ally\'s space costs no extra movement but you can\'t end there. Moving through an enemy\'s space counts as difficult terrain. You can\'t move through a hostile creature\'s space unless it is two sizes larger or smaller than you.'
      },
      {
        heading: 'Reactions',
        content: 'You get one reaction per round. It resets at the start of your turn. Common reactions: Opportunity Attack (enemy leaves your reach), Readied Action, Counterspell, Shield spell. An opportunity attack uses your reaction to make one melee attack when a hostile creature you can see moves out of your reach.'
      },
      {
        heading: 'Surprise',
        content: 'The DM determines who is surprised. A surprised creature can\'t move or take actions on its first turn of combat and can\'t take a reaction until that turn ends. A creature can be surprised even if other members of its group aren\'t.'
      }
    ]
  },
  {
    title: 'Spellcasting Rules',
    tags: 'spell slots components concentration ritual casting magic verbal somatic material',
    subsections: [
      {
        heading: 'Spell Slots',
        content: 'Spell slots represent a caster\'s magical energy. Casting a spell expends a slot of the spell\'s level or higher. Cantrips don\'t require slots. Slots are restored after a long rest (some classes recover slots on short rest). You can cast a lower-level spell using a higher-level slot for enhanced effects (upcasting).'
      },
      {
        heading: 'Components',
        content: 'V (Verbal): Must be able to speak.\nS (Somatic): Must have at least one free hand.\nM (Material): Must have the material component or a spellcasting focus. If the material has a gold cost or is consumed, you must have the specific component.\n\nA spellcasting focus can replace non-costly, non-consumed material components.'
      },
      {
        heading: 'Concentration',
        content: 'Some spells require concentration to maintain. You can concentrate on only one spell at a time. Concentration ends if: you cast another concentration spell, you are incapacitated, you die, or you fail a Constitution saving throw when you take damage. The DC is 10 or half the damage taken, whichever is higher.'
      },
      {
        heading: 'Ritual Casting',
        content: 'A spell with the ritual tag can be cast as a ritual, adding 10 minutes to the casting time. Ritual casting does not expend a spell slot. The caster must have the spell prepared or in their spellbook (class-dependent). Not all classes can ritual cast.'
      },
      {
        heading: 'Casting Time',
        content: '1 Action: Most common. Cast on your turn.\n1 Bonus Action: Quick cast. If you cast a bonus action spell, you can only cast a cantrip with your action that turn.\n1 Reaction: Cast in response to a trigger.\n1 Minute or longer: Multiple rounds of casting. Concentration is required during the casting.'
      },
      {
        heading: 'Spell Attacks & Save DCs',
        content: 'Spell Attack Modifier = proficiency bonus + spellcasting ability modifier.\nSpell Save DC = 8 + proficiency bonus + spellcasting ability modifier.\nSpellcasting abilities: INT (Wizard, Artificer), WIS (Cleric, Druid, Ranger), CHA (Bard, Paladin, Sorcerer, Warlock).'
      }
    ]
  },
  {
    title: 'Resting',
    tags: 'short rest long rest recovery hit dice healing exhaustion',
    subsections: [
      {
        heading: 'Short Rest',
        content: 'A period of downtime, at least 1 hour long, during which a character does nothing more strenuous than eating, drinking, reading, and tending to wounds.\n\nDuring a short rest, a character can spend one or more Hit Dice (up to their max). For each Hit Die spent, roll the die and add the character\'s Constitution modifier. The character regains that many hit points.\n\nSome class features recharge on a short rest (e.g., Warlock spell slots, Fighter\'s Second Wind, Channel Divinity).'
      },
      {
        heading: 'Long Rest',
        content: 'A period of extended downtime, at least 8 hours long, during which a character sleeps for at least 6 hours and performs no more than 2 hours of light activity.\n\nAt the end of a long rest:\n- Regain all lost hit points\n- Regain spent Hit Dice up to half your total (minimum 1)\n- Spell slots are restored\n- Exhaustion reduced by 1 level (with food and drink)\n\nA character can\'t benefit from more than one long rest in a 24-hour period, and must have at least 1 hit point at the start.'
      }
    ]
  },
  {
    title: 'Movement',
    tags: 'difficult terrain climbing swimming jumping flying crawling speed movement',
    subsections: [
      {
        heading: 'Difficult Terrain',
        content: 'Every foot of movement in difficult terrain costs 1 extra foot. This rule applies even if multiple things count as difficult terrain in the same space. Low furniture, rubble, undergrowth, steep stairs, snow, and shallow bogs are examples.'
      },
      {
        heading: 'Climbing & Swimming',
        content: 'Each foot of climbing or swimming costs 1 extra foot of movement (2 extra in difficult terrain) unless the creature has a climbing or swimming speed. The DM might require a Strength (Athletics) check in hazardous conditions.\n\nClimbing a slippery surface or treading rough water: DC 10-15 Athletics. Failure = no progress. Failure by 5+ = falling or sinking.'
      },
      {
        heading: 'Jumping',
        content: 'Long Jump (with running start): Jump a number of feet up to your Strength score. Without a running start, half that distance. Each foot of the jump costs 1 foot of movement.\n\nHigh Jump (with running start): Jump a number of feet equal to 3 + your Strength modifier (min 0 feet). Without a running start, half that. Each foot costs 1 foot of movement. Reach = height of jump + 1.5x your height.'
      },
      {
        heading: 'Flying',
        content: 'Flying creatures enjoy many benefits of mobility. If a flying creature is knocked prone, has its speed reduced to 0, or is otherwise deprived of the ability to move, the creature falls unless it can hover or is held aloft by magic.\n\nFlying in heavy armor or without a natural fly speed typically requires magic.'
      },
      {
        heading: 'Crawling',
        content: 'Every foot of movement while crawling costs 1 extra foot. Crawling in difficult terrain costs 3 feet per foot moved.'
      },
      {
        heading: 'Squeezing',
        content: 'A creature can squeeze through a space one size smaller than itself. While squeezing: speed is halved, disadvantage on attack rolls and Dexterity saving throws, attacks against have advantage.'
      }
    ]
  },
  {
    title: 'Social Interaction',
    tags: 'persuasion deception intimidation social charisma npc attitude',
    subsections: [
      {
        heading: 'NPC Attitudes',
        content: 'Friendly: Wants to help, minimal persuasion needed.\nIndifferent: Doesn\'t care either way. Might help with good reason.\nHostile: Opposes the characters. Won\'t help without significant leverage.\n\nInteractions can shift attitudes. Offering something an NPC wants, or threatening/bribing, can change their disposition.'
      },
      {
        heading: 'Persuasion',
        content: 'Use Charisma (Persuasion) when attempting to influence someone through tact, social graces, or good nature. Typical DCs:\n- Friendly NPC, reasonable request: DC 10\n- Indifferent NPC: DC 15\n- Hostile NPC: DC 20\n- Unreasonable request: +5 to DC'
      },
      {
        heading: 'Deception',
        content: 'Use Charisma (Deception) when attempting to hide the truth through misleading, ambiguity, or outright lying. Contested by the target\'s Wisdom (Insight). Factors: plausibility of the lie, evidence, target\'s suspicion level.'
      },
      {
        heading: 'Intimidation',
        content: 'Use Charisma (Intimidation) when attempting to influence through threats, hostile actions, or physical violence. Can also use Strength (Intimidation) at DM\'s discretion. Hostile creatures may become more hostile if intimidation fails.'
      }
    ]
  },
  {
    title: 'Stealth & Hiding',
    tags: 'stealth hiding perception passive perception invisible surprise',
    subsections: [
      {
        heading: 'Hiding',
        content: 'You can\'t hide from a creature that can see you clearly. You must have total cover, be in a heavily obscured area, or be invisible. Make a Dexterity (Stealth) check vs. observers\' passive Wisdom (Perception).\n\nWhile hidden: you have advantage on attack rolls against creatures that can\'t see you. Making an attack (hit or miss) reveals your location. Making noise or coming out of hiding ends the hidden condition.'
      },
      {
        heading: 'Passive Perception',
        content: '10 + Wisdom (Perception) modifier + proficiency bonus (if proficient) + any other bonuses.\n\nUsed to detect hidden creatures and traps without actively searching. Disadvantage on Perception = -5 to passive score. Advantage = +5.'
      },
      {
        heading: 'Invisibility',
        content: 'An invisible creature is impossible to see without special senses. It is heavily obscured for hiding purposes. The creature\'s location can still be detected by noise or tracks. Attacks against an invisible creature have disadvantage. The invisible creature\'s attacks have advantage.'
      },
      {
        heading: 'Heavily vs. Lightly Obscured',
        content: 'Lightly Obscured (dim light, patchy fog, moderate foliage): Disadvantage on Wisdom (Perception) checks relying on sight.\n\nHeavily Obscured (darkness, opaque fog, dense foliage): Effectively blinded when trying to see into the area.'
      }
    ]
  },
  {
    title: 'Death Saves',
    tags: 'death saving throws dying unconscious stabilize death saves',
    subsections: [
      {
        heading: 'Death Saving Throws',
        content: 'When you start your turn at 0 HP, you must make a death saving throw (d20, no modifiers unless you have a feature). DC 10.\n\n- 10 or higher: Success.\n- 9 or lower: Failure.\n- Three successes: You stabilize (unconscious, but no longer dying).\n- Three failures: You die.\n- Natural 20: You regain 1 HP.\n- Natural 1: Counts as two failures.\n\nSuccesses and failures reset when you regain any hit points.'
      },
      {
        heading: 'Damage at 0 HP',
        content: 'If you take damage while at 0 HP, you suffer a death save failure. If the damage is from a critical hit, you suffer two failures. If the damage equals or exceeds your hit point maximum, you die instantly (massive damage rule).'
      },
      {
        heading: 'Stabilizing',
        content: 'You can stabilize a dying creature by succeeding on a DC 10 Wisdom (Medicine) check. A stable creature doesn\'t make death saves but remains unconscious at 0 HP. If not healed, a stable creature regains 1 HP after 1d4 hours.\n\nSpare the Dying cantrip automatically stabilizes a creature.'
      }
    ]
  },
  {
    title: 'Mounted Combat',
    tags: 'mount horse riding mounted combat dismount',
    subsections: [
      {
        heading: 'Mounting & Dismounting',
        content: 'Mounting or dismounting costs an amount of movement equal to half your speed. You can\'t mount a creature that is unwilling. The mount must be at least one size larger than you.\n\nIf an effect moves your mount against its will, you must succeed on a DC 10 Dexterity saving throw or fall off (landing prone within 5 ft). If knocked prone while mounted, same save.'
      },
      {
        heading: 'Controlling a Mount',
        content: 'An intelligent mount acts independently (has its own initiative and turns). A controlled mount (most trained mounts) acts on your initiative and can only Dash, Disengage, or Dodge on its turn. It moves as you direct it.'
      },
      {
        heading: 'Mounted Attacks',
        content: 'If your mount provokes an opportunity attack, the attacker can target you or the mount. If the mount is forced to move (e.g., Dissonant Whispers), you can use your reaction to try to stay mounted (DC 10 DEX save).\n\nLance: Advantage when mounted against unmounted medium or smaller creatures (optional rule).'
      }
    ]
  },
  {
    title: 'Underwater Combat',
    tags: 'underwater combat swimming aquatic water drowning',
    subsections: [
      {
        heading: 'Melee Attacks',
        content: 'When making a melee weapon attack, a creature that doesn\'t have a swimming speed has disadvantage on the attack roll unless the weapon is a dagger, javelin, shortsword, spear, or trident.'
      },
      {
        heading: 'Ranged Attacks',
        content: 'Ranged weapon attacks automatically miss targets beyond the weapon\'s normal range. Even against a target within normal range, the attack roll has disadvantage unless the weapon is a crossbow, a net, or a weapon that is thrown like a javelin (including a spear, trident, or dart).'
      },
      {
        heading: 'Fire & Lightning',
        content: 'Creatures fully immersed in water have resistance to fire damage. Lightning damage: DM may rule that it affects all creatures within a certain distance in water (common house rule).'
      },
      {
        heading: 'Breathing',
        content: 'A creature can hold its breath for 1 + CON modifier minutes (minimum 30 seconds). When out of breath, it can survive CON modifier rounds (minimum 1) before dropping to 0 HP. Water Breathing spell, certain races (e.g., Triton, Sea Elf), and magical items can allow underwater breathing.'
      }
    ]
  }
];

// ── Search & Rendering ──────────────────────────────────

var expandedSections = {};

function searchRules() {
  renderRules();
}

function renderRules() {
  var container = document.getElementById('rules-content');
  var filter = (document.getElementById('rules-search') || {}).value || '';
  filter = filter.toLowerCase().trim();

  var filtered = RULES_SECTIONS.filter(function (section) {
    if (!filter) return true;
    // Search in title, tags, and all subsection content
    if (section.title.toLowerCase().indexOf(filter) !== -1) return true;
    if (section.tags.toLowerCase().indexOf(filter) !== -1) return true;
    return section.subsections.some(function (sub) {
      return sub.heading.toLowerCase().indexOf(filter) !== -1 ||
             sub.content.toLowerCase().indexOf(filter) !== -1;
    });
  });

  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-state">No rules match your search.</p>';
    return;
  }

  // When searching, expand all matching sections
  if (filter) {
    filtered.forEach(function (s) { expandedSections[s.title] = true; });
  }

  container.innerHTML = filtered.map(function (section) {
    var isExpanded = expandedSections[section.title] || false;
    var htmlStr = '<div class="card" style="padding:0; overflow:hidden; margin-bottom:12px;">';

    // Header (clickable)
    htmlStr += '<div class="rules-section-header" style="padding:14px 18px; cursor:pointer; display:flex; align-items:center; justify-content:space-between;" onclick="toggleRulesSection(\'' + escapeHtml(section.title).replace(/'/g, "\\'") + '\')">';
    htmlStr += '<h4 style="margin:0; color:var(--accent);">' + escapeHtml(section.title) + '</h4>';
    htmlStr += '<span style="color:var(--text-dim); font-size:18px;">' + (isExpanded ? '−' : '+') + '</span>';
    htmlStr += '</div>';

    // Content (collapsible)
    if (isExpanded) {
      htmlStr += '<div class="rules-section-body" style="padding:0 18px 16px; border-top:1px solid var(--border);">';
      section.subsections.forEach(function (sub) {
        htmlStr += '<div style="margin-top:14px;">';
        htmlStr += '<h5 style="margin:0 0 6px; color:var(--text);">' + escapeHtml(sub.heading) + '</h5>';
        // Preserve newlines in content
        var lines = sub.content.split('\n');
        htmlStr += '<div style="color:var(--text-muted); font-size:14px; line-height:1.6;">';
        lines.forEach(function (line) {
          if (line.trim() === '') {
            htmlStr += '<br>';
          } else {
            // Highlight search term
            if (filter) {
              var escaped = escapeHtml(line);
              var regex = new RegExp('(' + escapeHtml(filter).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
              escaped = escaped.replace(regex, '<mark>$1</mark>');
              htmlStr += '<div>' + escaped + '</div>';
            } else {
              htmlStr += '<div>' + escapeHtml(line) + '</div>';
            }
          }
        });
        htmlStr += '</div></div>';
      });
      htmlStr += '</div>';
    }

    htmlStr += '</div>';
    return htmlStr;
  }).join('');
}

function toggleRulesSection(title) {
  expandedSections[title] = !expandedSections[title];
  renderRules();
}

function expandAllRules() {
  RULES_SECTIONS.forEach(function (s) { expandedSections[s.title] = true; });
  renderRules();
}

function collapseAllRules() {
  expandedSections = {};
  renderRules();
}

// Initial render
document.addEventListener('DOMContentLoaded', function () {
  renderRules();
});

if (document.readyState !== 'loading') {
  renderRules();
}
