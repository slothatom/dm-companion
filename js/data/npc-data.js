// =============================================
//   npc-data.js - NPC Generator Data Tables
//   All randomization data lives here, separate
//   from the page logic in npc-generator.html
// =============================================

const FIRST_NAMES = [
  'Aldric','Brynn','Caelum','Dara','Edris','Fiona','Gareth','Hessa','Idris','Joryn',
  'Kaya','Leoric','Mira','Nolan','Orla','Petra','Quinn','Riven','Sora','Thorn',
  'Ulla','Vex','Wren','Xara','Yael','Zephyr','Branwen','Cass','Dorin','Eska',
  'Farid','Gila','Holt','Irwen','Jace','Kira','Lynd','Marek','Nira','Oswin'
];

const LAST_NAMES = [
  'Ashvale','Blackthorn','Coldmere','Duskwood','Emberglass','Frostmane','Greystone',
  'Hollowbrook','Ironforge','Jadecrest','Kettlebrook','Lorehand','Mistfall','Nighthollow',
  'Oakenshield','Pinehurst','Ravenscroft','Silvermoor','Tanglewood','Underhill',
  'Vanthorn','Whitlock','Yarrow','Emberveil','Stonehaven','Dunmore','Crestfall'
];

// Human appears multiple times so it rolls more often - reflects real D&D demographics
const RACES = [
  'Human','Human','Human','Elf','Elf','Dwarf','Dwarf',
  'Halfling','Gnome','Half-Orc','Tiefling','Dragonborn','Half-Elf','Half-Elf'
];

const OCCUPATIONS = [
  'Innkeeper','Merchant','City Guard','Blacksmith','Farmer','Scholar','Thief',
  'Priest','Bard','Herbalist','Sailor','Dockworker','Apothecary','Cartographer',
  'Hunter','Tailor','Jeweler','Stable Hand','Gravedigger','Tavern Wench',
  'Bounty Hunter','Debt Collector','Beggar','Fortune Teller','Militiaman',
  'Traveling Trader','Mine Foreman','Fisherman','Woodcutter','Courier'
];

const PERSONALITIES = [
  'Cheerful and optimistic, always looking on the bright side',
  'Suspicious of strangers and slow to trust anyone',
  'Greedy and always looking for an angle to profit',
  'Generous to a fault, gives away more than they can afford',
  'Gruff and blunt - says exactly what\'s on their mind',
  'Nervous and easily startled, jumps at shadows',
  'Arrogant and condescending, believes they\'re better than most',
  'Curious about everything, asks too many questions',
  'Melancholy and brooding, haunted by something in their past',
  'Boisterous and loud, the life of the party whether you like it or not',
  'Meek and apologetic, constantly second-guessing themselves',
  'Calm and measured, unflappable even in chaos',
  'Cunning and calculating, always thinking three steps ahead',
  'Earnest and naive, believes in the good of everyone',
  'Bitter and resentful, holding an old grudge',
  'Fiercely loyal to their family above all else',
  'Deeply religious, mentions their deity in every other sentence'
];

const QUIRKS = [
  'Constantly fidgets with a ring or pendant',
  'Never makes direct eye contact - looks just past your shoulder',
  'Talks too much when nervous, which is often',
  'Always seems to be eating something',
  'Laughs at their own jokes before they finish telling them',
  'Refers to themselves in the third person',
  'Has an unsettling habit of going completely silent for long pauses',
  'Sniffs the air when meeting new people',
  'Has a distinctive, very loud sneeze',
  'Always smells faintly of pipe smoke, even if they don\'t smoke',
  'Taps a finger on every surface they walk past',
  'Addresses everyone by the wrong name and never corrects it',
  'Whistles tunelessly under their breath',
  'Has a glass eye that doesn\'t quite look in the right direction',
  'Finishes everyone\'s sentences - usually wrongly',
  'Constantly adjusts their clothing as if it never fits right',
  'Uses outdated slang from a previous generation',
  'Has an oddly specific knowledge of one completely unrelated topic'
];

const MOTIVATIONS = [
  'Saving up to buy their freedom from a debt',
  'Searching for a sibling who vanished years ago',
  'Trying to earn enough gold to retire to the countryside',
  'Protecting a dark secret from their past',
  'Desperately seeking approval from their estranged parent',
  'On the run from someone - or something - that wants them dead',
  'Deeply devoted to their faith and seeking to spread it',
  'Just wants to be left alone and live a quiet life',
  'Consumed by envy of someone more successful',
  'Trying to prove themselves after a great public failure',
  'In love with someone who doesn\'t know they exist',
  'Slowly going mad from something they witnessed',
  'Collecting information to sell to the highest bidder',
  'Hoping to gain enough status to move up in society'
];

// =============================================
//   Creature / Monster Generator Data
// =============================================

const CREATURE_ADJECTIVES = [
  'Ancient','Corrupted','Feral','Void-touched','Cursed','Spectral','Shadow','Blazing',
  'Frost-born','Vile','Ravenous','Twisted','Forsaken','Hollow','Raging','Plague-ridden',
  'Stone','Iron-bound','Blood-soaked','Fungal','Withered','Starving','Deathless','Monstrous'
];

const CREATURE_BASE_NAMES = [
  'Drake','Troll','Basilisk','Owlbear','Wyvern','Golem','Wraith','Revenant',
  'Hydra','Chimera','Manticore','Naga','Lamia','Cyclops','Roc',
  'Treant','Shambler','Horror','Stalker','Lurker','Hulk','Serpent','Beetle',
  'Predator','Crawler','Abomination','Specter','Colossus','Devourer','Haunt'
];

const CREATURE_TYPES = [
  'Beast','Beast','Undead','Undead','Dragon','Giant','Construct',
  'Monstrosity','Monstrosity','Fiend','Humanoid (monstrous)','Plant',
  'Elemental','Ooze','Fey','Aberration','Celestial (fallen)'
];

const CREATURE_SIZES = [
  'Tiny','Small','Small','Medium','Medium','Medium','Large','Large','Large','Huge','Gargantuan'
];

const CREATURE_CRS = [
  '1/8','1/4','1/2','1','1','2','2','3','4','5','6','7','8','9','10','12','15','17','20','24'
];

const CREATURE_TRAITS = [
  'Pack Tactics: advantage on attack rolls when an ally is adjacent to the target',
  'Keen Senses: advantage on Perception checks that rely on smell or hearing',
  'Magic Resistance: advantage on saving throws against spells and magical effects',
  'Undead Fortitude: on dropping to 0 HP, make a CON save (DC 5 + damage taken) or fall; on success, drop to 1 HP instead',
  'Amphibious: can breathe both air and water',
  'Frightful Presence: creatures within 120 ft must succeed on a WIS save or become Frightened for 1 minute',
  'Spider Climb: can climb difficult surfaces including ceilings with no ability check',
  'Damage Immunities: immune to non-magical bludgeoning, piercing, and slashing damage',
  'Regeneration: regains HP at the start of each turn unless it took fire or radiant damage last round',
  'Flyby: doesn\'t provoke opportunity attacks when it flies out of a creature\'s reach',
  'Legendary Resistance (3/Day): if it fails a saving throw, it can choose to succeed instead',
  'Charge: if it moves 20+ ft toward a target, it can knock the target prone on a successful hit (STR save)',
  'Spellcasting: innate spellcasting using its mental ability score (DC 14)',
  'Shapechanger: can use its action to polymorph into an alternate form or back to its true form',
  'Aura of Fear: hostile creatures within 10 ft have disadvantage on attack rolls against the creature',
  'Siege Monster: deals double damage to objects and structures',
  'Sunlight Sensitivity: disadvantage on attack rolls and Perception in direct sunlight',
  'False Appearance: while motionless it is indistinguishable from a natural object or part of the environment'
];

const CREATURE_ATTACKS = [
  'Multiattack (two attacks per action)',
  'Bite - reach 5 ft, piercing damage + grapple attempt on hit',
  'Claws - reach 5 ft, slashing; makes two claw attacks per Multiattack',
  'Tail Slam - reach 10 ft, bludgeoning; target knocked prone on failed STR save',
  'Slam - reach 5 ft, bludgeoning damage',
  'Tentacles - reach 15 ft, bludgeoning; grapples and restrains on hit',
  'Gore - reach 5 ft, piercing; +2d6 damage if it charged this turn',
  'Poisonous Sting - reach 5 ft, piercing + poison damage; CON save or poisoned for 1 hour',
  'Breath Weapon - 30 ft cone or 60 ft line; DEX or CON save for half damage',
  'Arcane Bolt - ranged spell attack (60/120 ft), force or necrotic damage',
  'Necrotic Touch - reach 5 ft, necrotic; reduces target\'s HP maximum by the same amount until long rest',
  'Life Drain - reach 5 ft, necrotic; target makes CON save or its HP maximum is reduced by the damage dealt',
  'Swallow - must already be grappling target; on hit, target is restrained inside and takes acid damage each round',
  'Petrifying Gaze - 30 ft, CON save; fail = restrained. Fail again next round = petrified'
];

const CREATURE_HABITATS = [
  'Dense ancient forest','Crumbling dungeon complex','Mountain cave network',
  'Coastal sea-cliffs','Fetid swamp','Volcanic caldera','Frozen tundra wastes',
  'Haunted ruins','Underdark tunnels','Desert wastes','Feywild glade',
  'Nine Hells outpost','Open ocean depths','City sewers','Cursed graveyard',
  'Abandoned mine','Sunken temple','Storm-wracked highland moors'
];