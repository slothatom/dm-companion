// =============================================
//   spells-data.js — D&D 5e Spell Reference
//   All spell data lives here, separate from
//   the page logic in spells.html
// =============================================

const SPELLS = [
  // ---- Cantrips ----
  { name:'Fire Bolt',        level:'cantrip', school:'Evocation',    cast:'1 action',  range:'120 ft', duration:'Instant', desc:'Hurl a mote of fire at a target. Deals 1d10 fire damage (scales with level). No damage on miss.' },
  { name:'Eldritch Blast',   level:'cantrip', school:'Evocation',    cast:'1 action',  range:'120 ft', duration:'Instant', desc:'A beam of crackling energy strikes one creature. Deals 1d10 force damage. Creates extra beams at higher levels.' },
  { name:'Sacred Flame',     level:'cantrip', school:'Evocation',    cast:'1 action',  range:'60 ft',  duration:'Instant', desc:'Flame-like radiance descends on a creature. DEX save or take 1d8 radiant damage. Ignores cover.' },
  { name:'Vicious Mockery',  level:'cantrip', school:'Enchantment',  cast:'1 action',  range:'60 ft',  duration:'Instant', desc:'Unleash a string of insults. WIS save or take 1d4 psychic damage and disadvantage on their next attack roll.' },
  { name:'Minor Illusion',   level:'cantrip', school:'Illusion',     cast:'1 action',  range:'30 ft',  duration:'1 min',   desc:'Create a sound or image of an object. Investigation check to see through it. Cannot create creatures.' },
  { name:'Guidance',         level:'cantrip', school:'Divination',   cast:'1 action',  range:'Touch',  duration:'1 min',   desc:'Touch a willing creature. Once before the spell ends, they can add 1d4 to one ability check.', conc: true },
  { name:'Mage Hand',        level:'cantrip', school:'Conjuration',  cast:'1 action',  range:'30 ft',  duration:'1 min',   desc:'A spectral, floating hand can manipulate objects, open doors, or carry items up to 10 lbs.' },
  { name:'Toll the Dead',    level:'cantrip', school:'Necromancy',   cast:'1 action',  range:'60 ft',  duration:'Instant', desc:'Point at a creature and the sound of a death knell fills the air. WIS save or take 1d8 (1d12 if already missing HP) necrotic damage.' },
  { name:'Prestidigitation', level:'cantrip', school:'Transmutation',cast:'1 action',  range:'10 ft',  duration:'1 hr',    desc:'Create small magical effects: harmless sensory effects, lighting/snuffing flames, cleaning, chilling/warming items, and more.' },
  { name:'Shillelagh',       level:'cantrip', school:'Transmutation',cast:'Bonus',     range:'Touch',  duration:'1 min',   desc:'The wood of a club or quarterstaff is imbued with nature\'s power. Damage die becomes d8, uses your spellcasting modifier.' },

  // ---- Level 1 ----
  { name:'Magic Missile',    level:'1', school:'Evocation',    cast:'1 action',  range:'120 ft',       duration:'Instant', desc:'Create three glowing darts of magical force. Each dart hits automatically for 1d4+1 force damage. +1 dart per slot level above 1st.' },
  { name:'Shield',           level:'1', school:'Abjuration',   cast:'Reaction',  range:'Self',         duration:'1 round', desc:'An invisible barrier of magical force appears. +5 to AC until your next turn, including against the triggering attack. Immune to Magic Missile.' },
  { name:'Cure Wounds',      level:'1', school:'Evocation',    cast:'1 action',  range:'Touch',        duration:'Instant', desc:'Restore 1d8 + spellcasting modifier HP to a living creature. +1d8 per slot level above 1st.' },
  { name:'Healing Word',     level:'1', school:'Evocation',    cast:'Bonus',     range:'60 ft',        duration:'Instant', desc:'A creature regains 1d4 + spellcasting modifier HP. Bonus action and ranged makes this extremely useful in combat.' },
  { name:'Thunderwave',      level:'1', school:'Evocation',    cast:'1 action',  range:'Self (15ft)',  duration:'Instant', desc:'A wave of thunderous force sweeps from you. CON save: 2d8 thunder + pushed 10ft on fail; half damage, no push on success.' },
  { name:'Hex',              level:'1', school:'Enchantment',  cast:'Bonus',     range:'90 ft',        duration:'1 hr',    desc:'Curse a creature. Deal extra 1d6 necrotic on each hit. Choose an ability; creature has disadvantage on that ability\'s checks.', conc: true },
  { name:'Bless',            level:'1', school:'Enchantment',  cast:'1 action',  range:'30 ft',        duration:'1 min',   desc:'Up to 3 creatures add 1d4 to attack rolls and saving throws. Concentration. +1 creature per slot above 1st.', conc: true },
  { name:'Burning Hands',    level:'1', school:'Evocation',    cast:'1 action',  range:'Self (15ft cone)', duration:'Instant', desc:'A thin sheet of flames shoots from your hands. DEX save: 3d6 fire on fail, half on success. +1d6 per slot above 1st.' },
  { name:'Charm Person',     level:'1', school:'Enchantment',  cast:'1 action',  range:'30 ft',        duration:'1 hr',    desc:'WIS save or one humanoid regards you as a friendly acquaintance. They know they were charmed afterward.' },
  { name:'Sleep',            level:'1', school:'Enchantment',  cast:'1 action',  range:'90 ft',        duration:'1 min',   desc:'Roll 5d8; creatures with HP totaling that or less fall unconscious, starting from lowest HP. +2d8 per slot above 1st.' },
  { name:'Detect Magic',     level:'1', school:'Divination',   cast:'1 action',  range:'Self',         duration:'10 min',  desc:'Sense the presence of magic within 30 ft. You can see a faint aura around magical creatures or objects, and learn their school of magic.', ritual: true },
  { name:'Mage Armor',       level:'1', school:'Abjuration',   cast:'1 action',  range:'Touch',        duration:'8 hrs',   desc:'A protective magical force surrounds a willing creature. AC becomes 13 + DEX modifier (if not wearing armor).' },
  { name:'Faerie Fire',      level:'1', school:'Evocation',    cast:'1 action',  range:'60 ft',        duration:'1 min',   desc:'DEX save or outlined in blue, green, or violet light. Attacks against affected creatures have advantage. No hiding while lit.', conc: true },
  { name:'Entangle',         level:'1', school:'Conjuration',  cast:'1 action',  range:'90 ft',        duration:'1 min',   desc:'Grasping weeds and vines sprout in a 20-ft square. STR save or restrained. Difficult terrain for all. Concentration.', conc: true },

  // ---- Level 2 ----
  { name:'Misty Step',       level:'2', school:'Conjuration',  cast:'Bonus',     range:'Self',   duration:'Instant', desc:'Surrounded by silvery mist, you teleport to an unoccupied space you can see within 30 ft. Bonus action makes this extremely flexible.' },
  { name:'Mirror Image',     level:'2', school:'Illusion',     cast:'1 action',  range:'Self',   duration:'1 min',   desc:'Three illusory duplicates appear. When attacked, roll to see if it hits a duplicate. Duplicates are destroyed one at a time.' },
  { name:'Shatter',          level:'2', school:'Evocation',    cast:'1 action',  range:'60 ft',  duration:'Instant', desc:'A sudden loud ringing noise causes a 10-ft sphere. CON save: 3d8 thunder on fail, half on success. Inorganic objects automatically fail. +1d8 per slot above 2nd.' },
  { name:'Hold Person',      level:'2', school:'Enchantment',  cast:'1 action',  range:'60 ft',  duration:'1 min',   desc:'WIS save or a humanoid is paralyzed. Attacks against them have advantage and hits within 5ft are critical. Repeats save each turn.', conc: true },
  { name:'Invisibility',     level:'2', school:'Illusion',     cast:'1 action',  range:'Touch',  duration:'1 hr',    desc:'A creature becomes invisible until it attacks or casts a spell. +1 creature per slot above 2nd. Concentration.', conc: true },
  { name:'Suggestion',       level:'2', school:'Enchantment',  cast:'1 action',  range:'30 ft',  duration:'8 hrs',   desc:'WIS save or a creature follows a suggested course of action (1-2 sentences). Must be reasonable. Concentration.', conc: true },
  { name:'Spiritual Weapon', level:'2', school:'Evocation',    cast:'Bonus',     range:'60 ft',  duration:'1 min',   desc:'Create a floating, spectral weapon. Bonus action to move it and make a melee spell attack. Deals 1d8 + spellcasting mod force damage. Not concentration.' },
  { name:'Scorching Ray',    level:'2', school:'Evocation',    cast:'1 action',  range:'120 ft', duration:'Instant', desc:'Create three rays of fire. Ranged spell attack per ray; 2d6 fire damage each on hit. +1 ray per slot above 2nd.' },
  { name:'Web',              level:'2', school:'Conjuration',  cast:'1 action',  range:'60 ft',  duration:'1 hr',    desc:'Fill a 20-ft cube with thick webbing. DEX save or restrained. Webs are flammable. Concentration.', conc: true },
  { name:'Darkness',         level:'2', school:'Evocation',    cast:'1 action',  range:'60 ft',  duration:'10 min',  desc:'Magical darkness spreads from a point. Even darkvision can\'t see through it. Concentration.', conc: true },

  // ---- Level 3 ----
  { name:'Fireball',         level:'3', school:'Evocation',    cast:'1 action',  range:'150 ft',       duration:'Instant', desc:'A bright streak explodes into a 20-ft radius sphere of fire. DEX save: 8d6 fire on fail, half on success. +1d6 per slot above 3rd.' },
  { name:'Counterspell',     level:'3', school:'Abjuration',   cast:'Reaction',  range:'60 ft',        duration:'Instant', desc:'Interrupt a creature casting a spell. Automatically counters spells of 3rd level or lower; higher levels require an ability check.' },
  { name:'Lightning Bolt',   level:'3', school:'Evocation',    cast:'1 action',  range:'Self (100ft)', duration:'Instant', desc:'A stroke of lightning forms in a 100-ft line, 5 ft wide. DEX save: 8d6 lightning on fail, half on success. +1d6 per slot above 3rd.' },
  { name:'Hypnotic Pattern', level:'3', school:'Illusion',     cast:'1 action',  range:'120 ft',       duration:'1 min',   desc:'A twisting pattern of colors weaves through the air. WIS save or charmed and incapacitated. Any damage ends the effect on that creature. Concentration.', conc: true },
  { name:'Fear',             level:'3', school:'Illusion',     cast:'1 action',  range:'Self (30ft cone)', duration:'1 min', desc:'Creatures in a 30-ft cone must make WIS save or become frightened and drop held objects. Must use movement to flee. Concentration.', conc: true },
  { name:'Fly',              level:'3', school:'Transmutation',cast:'1 action',  range:'Touch',        duration:'10 min',  desc:'A willing creature gains a flying speed of 60 ft. Concentration. +1 target per slot above 3rd.', conc: true },
  { name:'Revivify',         level:'3', school:'Conjuration',  cast:'1 action',  range:'Touch',        duration:'Instant', desc:'A creature that has died within the last minute returns to life with 1 HP. Requires a diamond worth 300 gp, consumed.' },
  { name:'Spirit Guardians', level:'3', school:'Conjuration',  cast:'1 action',  range:'Self',         duration:'10 min',  desc:'Spirits protect you in a 15-ft radius. WIS save or half speed; 3d8 radiant/necrotic damage to hostile creatures entering. Concentration.', conc: true },
  { name:'Dispel Magic',     level:'3', school:'Abjuration',   cast:'1 action',  range:'120 ft',       duration:'Instant', desc:'Choose a creature, object, or effect. Any spell of 3rd level or lower ends automatically. Higher spells require an ability check.' },
  { name:'Haste',            level:'3', school:'Transmutation',cast:'1 action',  range:'30 ft',        duration:'1 min',   desc:'A willing creature has doubled speed, +2 AC, advantage on DEX saves, and an extra action each turn (limited actions). Concentration. Lethargy after.', conc: true },

  // ---- Level 4 ----
  { name:'Banishment',          level:'4', school:'Abjuration',   cast:'1 action', range:'60 ft',  duration:'1 min',  desc:'CHA save or creature is banished to a demi-plane. If native to current plane, returns when concentration ends. If not, stays permanently.', conc: true },
  { name:'Polymorph',           level:'4', school:'Transmutation',cast:'1 action', range:'60 ft',  duration:'1 hr',   desc:'WIS save or creature transforms into a beast. Uses beast\'s stats; reverts when at 0 HP (excess damage carries over). Concentration.', conc: true },
  { name:'Greater Invisibility',level:'4', school:'Illusion',     cast:'1 action', range:'Touch',  duration:'1 min',  desc:'Target creature is invisible — even while attacking or casting spells. Attacks while invisible have advantage; attacks against have disadvantage. Concentration.', conc: true },
  { name:'Wall of Fire',        level:'4', school:'Evocation',    cast:'1 action', range:'120 ft', duration:'1 min',  desc:'Create a wall of fire up to 60ft long. DEX save: 5d8 fire on fail (half on success) when entering or starting turn there. Concentration.', conc: true },
  { name:'Confusion',           level:'4', school:'Enchantment',  cast:'1 action', range:'90 ft',  duration:'1 min',  desc:'WIS save or creatures in a 10-ft radius act randomly each turn — wander, do nothing, attack nearest. Concentration.', conc: true },

  // ---- Level 5 ----
  { name:'Cone of Cold',     level:'5', school:'Evocation',    cast:'1 action', range:'Self (60ft cone)', duration:'Instant', desc:'A blast of cold air erupts from your hands in a 60-ft cone. CON save: 8d8 cold on fail, half on success.' },
  { name:'Hold Monster',     level:'5', school:'Enchantment',  cast:'1 action', range:'90 ft',  duration:'1 min',   desc:'WIS save or any creature (not just humanoid) is paralyzed. Attacks within 5ft are critical hits. Repeats save each turn. Concentration.', conc: true },
  { name:'Wall of Force',    level:'5', school:'Evocation',    cast:'1 action', range:'120 ft', duration:'10 min',  desc:'Create an invisible, indestructible wall of force. Nothing can pass through or teleport through it. Concentration.', conc: true },
  { name:'Dominate Person',  level:'5', school:'Enchantment',  cast:'1 action', range:'60 ft',  duration:'1 min',   desc:'WIS save or a humanoid is charmed by you. You have a telepathic link and can command them on your turn. Concentration.', conc: true },
  { name:'Mass Cure Wounds', level:'5', school:'Evocation',    cast:'1 action', range:'60 ft',  duration:'Instant', desc:'A wave of healing energy washes out from a point. Up to 6 creatures each regain 3d8 + spellcasting modifier HP.' },
  { name:'Bigby\'s Hand',    level:'5', school:'Evocation',    cast:'1 action', range:'120 ft', duration:'1 min',   desc:'Create a Large hand of shimmering force. Can clenched fist (4d8 force), forceful hand (push), grasping hand (restrain), interposing hand (block). Concentration.', conc: true },
];
