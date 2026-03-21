// =============================================
//   languages-data.js - D&D 5e Languages
// =============================================

var LANGUAGES = [
  {
    name: "Common",
    type: "Standard",
    script: "Common",
    speakers: "Humans, halflings, and most civilized races",
    desc: "Common is the lingua franca of most of the known world, spoken by nearly all civilized peoples. It is the default trade language and the one most adventurers use to communicate."
  },
  {
    name: "Dwarvish",
    type: "Standard",
    script: "Dwarvish",
    speakers: "Dwarves",
    desc: "Dwarvish is full of hard consonants and guttural sounds, and those characteristics spill over into whatever other language a dwarf might speak. It is one of the oldest written languages and its runic script is used by several other languages."
  },
  {
    name: "Elvish",
    type: "Standard",
    script: "Elvish",
    speakers: "Elves",
    desc: "Elvish is fluid, with subtle intonations and intricate grammar. Elven literature is rich and varied, and their songs and poems are famous among other races. Many bards learn Elvish so they can add Elvish ballads to their repertoires."
  },
  {
    name: "Giant",
    type: "Standard",
    script: "Dwarvish",
    speakers: "Ogres, giants",
    desc: "Giant is the language spoken by giants and giant-kin such as ogres, ettins, and cyclopes. It uses the Dwarvish script and is notable for its booming, resonant quality when spoken aloud."
  },
  {
    name: "Gnomish",
    type: "Standard",
    script: "Dwarvish",
    speakers: "Gnomes",
    desc: "Gnomish uses the Dwarvish script and is known for its technical treatises and catalogs of knowledge about the natural world. Gnome scholars and tinkerers keep meticulous records in this language."
  },
  {
    name: "Goblin",
    type: "Standard",
    script: "Dwarvish",
    speakers: "Goblinoids (goblins, hobgoblins, bugbears)",
    desc: "Goblin is the language of goblinoids, including goblins, hobgoblins, and bugbears. It is a harsh, clipped tongue that uses the Dwarvish script. Goblin dialects can vary significantly between tribes."
  },
  {
    name: "Halfling",
    type: "Standard",
    script: "Common",
    speakers: "Halflings",
    desc: "The Halfling language is not secret, but halflings are loath to share it with others. They write very little, so they don't have a rich body of literature. Their oral tradition, however, is very strong."
  },
  {
    name: "Orc",
    type: "Standard",
    script: "Dwarvish",
    speakers: "Orcs",
    desc: "Orc is a harsh, grating language with hard consonants. It has no script of its own and uses Dwarvish script when written, though few orcs bother with writing. Orc vocabulary is focused on warfare, combat, and survival."
  },
  {
    name: "Abyssal",
    type: "Exotic",
    script: "Infernal",
    speakers: "Demons",
    desc: "Abyssal is the language of demons and chaotic evil outsiders of the Abyss. It is a harsh and discordant tongue, full of guttural sounds and sharp inflections that can be painful to mortal ears."
  },
  {
    name: "Celestial",
    type: "Exotic",
    script: "Celestial",
    speakers: "Celestials (angels, devas)",
    desc: "Celestial is the language of celestials, the good-aligned outsiders of the upper planes. It is a beautiful, melodic language often used in hymns, prayers, and divine scripture."
  },
  {
    name: "Deep Speech",
    type: "Exotic",
    script: "\u2014",
    speakers: "Aboleths, cloakers, mind flayers",
    desc: "Deep Speech is the language of aberrations, creatures from the Far Realm and the deep Underdark. It has no known script and is nearly impossible for most humanoid vocal cords to reproduce accurately. Communication often relies on telepathy."
  },
  {
    name: "Draconic",
    type: "Exotic",
    script: "Draconic",
    speakers: "Dragons, dragonborn, kobolds",
    desc: "Draconic is thought to be one of the oldest languages and is often used in the study of magic. Many ancient spellbooks and magical texts are written in Draconic. It is a sibilant language with long, hissing sounds and resonant tones."
  },
  {
    name: "Infernal",
    type: "Exotic",
    script: "Infernal",
    speakers: "Devils, tieflings",
    desc: "Infernal is the language of devils and the lawful evil outsiders of the Nine Hells. It is a precise, exacting language with strict grammatical rules and a rigid structure that reflects the orderly nature of its speakers."
  },
  {
    name: "Primordial",
    type: "Exotic",
    script: "Dwarvish",
    speakers: "Elementals",
    desc: "Primordial is the language of elementals. The Aquan, Auran, Ignan, and Terran dialects of this language are used by water, air, fire, and earth elementals respectively. Creatures that know Primordial can communicate with any elemental dialect speaker."
  },
  {
    name: "Sylvan",
    type: "Exotic",
    script: "Elvish",
    speakers: "Fey creatures (dryads, satyrs, pixies)",
    desc: "Sylvan is the language of the fey. It is a lilting, musical tongue closely related to Elvish. It is spoken by dryads, satyrs, pixies, and other creatures of the Feywild and enchanted forests."
  },
  {
    name: "Undercommon",
    type: "Exotic",
    script: "Elvish",
    speakers: "Underdark traders (drow, duergar, svirfneblin)",
    desc: "Undercommon is the trade language of the Underdark. Nearly every intelligent Underdark creature speaks Undercommon. It is a blend of Elvish, Dwarvish, and surface Common with a vocabulary adapted for the lightless subterranean world."
  },
  {
    name: "Druidic",
    type: "Exotic",
    script: "\u2014",
    speakers: "Druids (secret language)",
    desc: "Druidic is the secret language of druids. You can speak the language and use it to leave hidden messages. You and others who know this language automatically spot such a message. Others spot the message's presence with a successful DC 15 Wisdom (Perception) check but can't decipher it without magic."
  },
  {
    name: "Thieves' Cant",
    type: "Exotic",
    script: "\u2014",
    speakers: "Rogues, criminals",
    desc: "Thieves' Cant is a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves' cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly."
  },
  {
    name: "Aarakocra",
    type: "Exotic",
    script: "\u2014",
    speakers: "Aarakocra",
    desc: "The language of the bird-folk of the Elemental Plane of Air. Aarakocra speak in a complex series of clicks, whistles, and chirps that is extremely difficult for non-avian creatures to replicate. Written forms are rare."
  },
  {
    name: "Gith",
    type: "Exotic",
    script: "\u2014",
    speakers: "Githyanki, githzerai",
    desc: "The shared ancestral language of the githyanki and githzerai. Though the two peoples have diverged greatly, they still share this ancient tongue. It uses no common script and is typically written in a unique cipher known only to gith scholars."
  },
  {
    name: "Gnoll",
    type: "Exotic",
    script: "\u2014",
    speakers: "Gnolls",
    desc: "A harsh, barking language spoken by gnolls. It has no written form, as gnolls rarely engage in literacy. Communication relies heavily on body language, snarls, and hyena-like vocalizations alongside spoken words."
  },
  {
    name: "Ignan",
    type: "Exotic",
    script: "Dwarvish",
    speakers: "Fire elementals, efreet, salamanders",
    desc: "A dialect of Primordial associated with the Elemental Plane of Fire. Ignan sounds like crackling flames, with sharp, popping consonants and hissing vowels. Creatures that speak Primordial can understand Ignan."
  },
  {
    name: "Aquan",
    type: "Exotic",
    script: "Elvish",
    speakers: "Water elementals, marids, tritons",
    desc: "A dialect of Primordial associated with the Elemental Plane of Water. Aquan flows like water, with gurgling consonants and long, rolling vowels. Creatures that speak Primordial can understand Aquan."
  },
  {
    name: "Auran",
    type: "Exotic",
    script: "Dwarvish",
    speakers: "Air elementals, djinn, aarakocra",
    desc: "A dialect of Primordial associated with the Elemental Plane of Air. Auran is breathy and whispered, with sighing vowels and soft consonants. Creatures that speak Primordial can understand Auran."
  },
  {
    name: "Terran",
    type: "Exotic",
    script: "Dwarvish",
    speakers: "Earth elementals, dao, xorn",
    desc: "A dialect of Primordial associated with the Elemental Plane of Earth. Terran is deep and rumbling, with grinding consonants and resonant tones. Creatures that speak Primordial can understand Terran."
  },
  {
    name: "Kraul",
    type: "Exotic",
    script: "\u2014",
    speakers: "Insectoid races, thri-kreen",
    desc: "A clicking, buzzing language used by insectoid beings. It relies heavily on mandible clicks and antennae movements that are nearly impossible for humanoids to reproduce accurately. Most communication with non-speakers requires magic."
  },
  {
    name: "Modron",
    type: "Exotic",
    script: "\u2014",
    speakers: "Modrons",
    desc: "The language of the modrons of Mechanus. It is a highly structured, mathematical language with precise syntax and no ambiguity. Each concept has exactly one expression, making poetry and metaphor impossible."
  },
  {
    name: "Slaad",
    type: "Exotic",
    script: "\u2014",
    speakers: "Slaadi",
    desc: "The chaotic tongue of the slaadi from Limbo. It has no consistent grammar or syntax \u2014 rules change seemingly at random. Despite this, slaadi understand each other perfectly, suggesting an underlying order invisible to outsiders."
  },
  {
    name: "Sphinx",
    type: "Exotic",
    script: "\u2014",
    speakers: "Sphinxes",
    desc: "An ancient, riddling language known only to sphinxes and a handful of scholars. It is said to contain inherent magical power \u2014 certain phrases spoken in Sphinx can trigger ancient wards and unlock sealed vaults."
  },
  {
    name: "Vegepygmy",
    type: "Exotic",
    script: "\u2014",
    speakers: "Vegepygmies, myconids",
    desc: "A rudimentary language of spore-based communication used by plant creatures. It conveys emotion and intent through chemical signals rather than sound. Most humanoids cannot perceive it without magical aid."
  },
  {
    name: "Blink Dog",
    type: "Exotic",
    script: "\u2014",
    speakers: "Blink dogs",
    desc: "A language of barks, yips, and whines understood only by blink dogs and those magically attuned to fey creatures. It carries complex spatial concepts related to teleportation."
  },
  {
    name: "Bullywug",
    type: "Exotic",
    script: "\u2014",
    speakers: "Bullywugs",
    desc: "A croaking, gurgling language spoken by the frog-like bullywugs of swamplands. It is nearly impossible for non-amphibious creatures to pronounce correctly."
  },
  {
    name: "Giant Eagle",
    type: "Exotic",
    script: "\u2014",
    speakers: "Giant eagles, aarakocra",
    desc: "A language of shrieks, whistles, and complex aerial calls used by giant eagles and understood by some aarakocra communities."
  },
  {
    name: "Giant Owl",
    type: "Exotic",
    script: "\u2014",
    speakers: "Giant owls",
    desc: "A hooting, clicking language used by giant owls. It carries well in darkness and includes ultrasonic components inaudible to most humanoids."
  },
  {
    name: "Grung",
    type: "Exotic",
    script: "\u2014",
    speakers: "Grung",
    desc: "A chirping, croaking language spoken by the small, poisonous frog-folk known as grung. Its tonal nature makes it difficult for non-grung to master."
  },
  {
    name: "Hook Horror",
    type: "Exotic",
    script: "\u2014",
    speakers: "Hook horrors",
    desc: "A clicking, clacking language using the creatures' hook-like appendages to create percussive sounds that echo through Underdark caverns."
  },
  {
    name: "Sahuagin",
    type: "Exotic",
    script: "\u2014",
    speakers: "Sahuagin, sea devils",
    desc: "A hissing, clicking language adapted for underwater communication. It includes frequencies that carry well through water but are barely audible in air."
  },
  {
    name: "Thri-kreen",
    type: "Exotic",
    script: "\u2014",
    speakers: "Thri-kreen",
    desc: "A language of clicks, whistles, and mandible-clacking used by the insectoid thri-kreen. It can convey complex tactical information rapidly."
  },
  {
    name: "Worg",
    type: "Exotic",
    script: "\u2014",
    speakers: "Worgs",
    desc: "A growling, snarling language understood by worgs and some goblinoid tribes. It consists largely of body language supplemented by vocalizations."
  },
  {
    name: "Yeti",
    type: "Exotic",
    script: "\u2014",
    speakers: "Yeti",
    desc: "A howling, roaring language used by yeti in mountainous regions. It carries over great distances in cold, thin air."
  }
];
