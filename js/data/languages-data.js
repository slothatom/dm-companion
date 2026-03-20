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
  }
];
