// =============================================
//   species-data.js - D&D 5e SRD Races/Species
//   Official System Reference Document entries
// =============================================

var SPECIES = [
  {
    name: "Human",
    speed: "30 ft",
    size: "Medium",
    traits: "Ability Score Increase: All ability scores increase by 1. Extra Language: You can speak, read, and write one extra language of your choice.",
    languages: "Common, one extra language of your choice",
    subraces: []
  },
  {
    name: "Elf",
    speed: "30 ft",
    size: "Medium",
    traits: "Ability Score Increase: Dexterity +2. Darkvision: 60 ft. Keen Senses: Proficiency in Perception. Fey Ancestry: Advantage on saving throws against being charmed, and magic can't put you to sleep. Trance: Elves don't need to sleep. Instead, they meditate deeply for 4 hours a day.",
    languages: "Common, Elvish",
    subraces: [
      {
        name: "High Elf",
        traits: "Ability Score Increase: Intelligence +1. Elf Weapon Training: Proficiency with longsword, shortsword, shortbow, and longbow. Cantrip: You know one cantrip of your choice from the wizard spell list (Intelligence is your spellcasting ability). Extra Language: You can speak, read, and write one additional language of your choice."
      },
      {
        name: "Wood Elf",
        traits: "Ability Score Increase: Wisdom +1. Elf Weapon Training: Proficiency with longsword, shortsword, shortbow, and longbow. Fleet of Foot: Base walking speed increases to 35 ft. Mask of the Wild: You can attempt to hide even when you are only lightly obscured by natural phenomena such as foliage, heavy rain, falling snow, mist, and other natural phenomena."
      },
      {
        name: "Dark Elf (Drow)",
        traits: "Ability Score Increase: Charisma +1. Superior Darkvision: 120 ft. Sunlight Sensitivity: Disadvantage on attack rolls and Perception checks that rely on sight when you, the target, or what you're trying to perceive is in direct sunlight. Drow Magic: You know the dancing lights cantrip. At 3rd level you can cast faerie fire once per long rest. At 5th level you can cast darkness once per long rest. Charisma is your spellcasting ability. Drow Weapon Training: Proficiency with rapiers, shortswords, and hand crossbows."
      }
    ]
  },
  {
    name: "Dwarf",
    speed: "25 ft",
    size: "Medium",
    traits: "Ability Score Increase: Constitution +2. Darkvision: 60 ft. Dwarven Resilience: Advantage on saving throws against poison, and resistance to poison damage. Dwarven Combat Training: Proficiency with battleaxe, handaxe, light hammer, and warhammer. Tool Proficiency: Proficiency with one of smith's tools, brewer's supplies, or mason's tools. Stonecunning: Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient and add double your proficiency bonus. Speed: Your speed is not reduced by wearing heavy armor.",
    languages: "Common, Dwarvish",
    subraces: [
      {
        name: "Hill Dwarf",
        traits: "Ability Score Increase: Wisdom +1. Dwarven Toughness: Your hit point maximum increases by 1, and it increases by 1 every time you gain a level."
      },
      {
        name: "Mountain Dwarf",
        traits: "Ability Score Increase: Strength +2. Dwarven Armor Training: Proficiency with light and medium armor."
      }
    ]
  },
  {
    name: "Halfling",
    speed: "25 ft",
    size: "Small",
    traits: "Ability Score Increase: Dexterity +2. Lucky: When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll. Brave: Advantage on saving throws against being frightened. Halfling Nimbleness: You can move through the space of any creature that is of a size larger than yours.",
    languages: "Common, Halfling",
    subraces: [
      {
        name: "Lightfoot Halfling",
        traits: "Ability Score Increase: Charisma +1. Naturally Stealthy: You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you."
      },
      {
        name: "Stout Halfling",
        traits: "Ability Score Increase: Constitution +1. Stout Resilience: Advantage on saving throws against poison, and resistance to poison damage."
      }
    ]
  },
  {
    name: "Gnome",
    speed: "25 ft",
    size: "Small",
    traits: "Ability Score Increase: Intelligence +2. Darkvision: 60 ft. Gnome Cunning: Advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.",
    languages: "Common, Gnomish",
    subraces: [
      {
        name: "Rock Gnome",
        traits: "Ability Score Increase: Constitution +1. Artificer's Lore: Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus. Tinker: You have proficiency with artisan's tools (tinker's tools). Using those tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device (AC 5, 1 hp). The device ceases to function after 24 hours unless you spend 1 hour repairing it. You can have up to three devices active at a time. Devices include: Clockwork Toy, Fire Starter, Music Box."
      },
      {
        name: "Forest Gnome",
        traits: "Ability Score Increase: Dexterity +1. Natural Illusionist: You know the minor illusion cantrip. Intelligence is your spellcasting ability for it. Speak with Small Beasts: Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts."
      }
    ]
  },
  {
    name: "Half-Elf",
    speed: "30 ft",
    size: "Medium",
    traits: "Ability Score Increase: Charisma +2, and two other ability scores of your choice each increase by 1. Darkvision: 60 ft. Fey Ancestry: Advantage on saving throws against being charmed, and magic can't put you to sleep. Skill Versatility: You gain proficiency in two skills of your choice.",
    languages: "Common, Elvish, one extra language of your choice",
    subraces: []
  },
  {
    name: "Half-Orc",
    speed: "30 ft",
    size: "Medium",
    traits: "Ability Score Increase: Strength +2, Constitution +1. Darkvision: 60 ft. Menacing: Proficiency in the Intimidation skill. Relentless Endurance: When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You must finish a long rest before you can use this feature again. Savage Attacks: When you score a critical hit with a melee weapon attack, you can roll one of the weapon's damage dice one additional time and add it to the extra damage of the critical hit.",
    languages: "Common, Orc",
    subraces: []
  },
  {
    name: "Tiefling",
    speed: "30 ft",
    size: "Medium",
    traits: "Ability Score Increase: Charisma +2, Intelligence +1. Darkvision: 60 ft. Hellish Resistance: Resistance to fire damage. Infernal Legacy: You know the thaumaturgy cantrip. At 3rd level you can cast hellish rebuke as a 2nd-level spell once per long rest. At 5th level you can cast darkness once per long rest. Charisma is your spellcasting ability for these spells.",
    languages: "Common, Infernal",
    subraces: []
  },
  {
    name: "Dragonborn",
    speed: "30 ft",
    size: "Medium",
    traits: "Ability Score Increase: Strength +2, Charisma +1. Draconic Ancestry: Choose one type of dragon from the table. Your breath weapon and damage resistance are determined by the dragon type. Breath Weapon: You can use your action to exhale destructive energy. The damage type and area are determined by your draconic ancestry. Each creature in the area must make a saving throw (DC = 8 + Constitution modifier + proficiency bonus). A creature takes 2d6 damage on a failed save (3d6 at 6th level, 4d6 at 11th level, 5d6 at 16th level), or half on a success. Usable once per short or long rest. Damage Resistance: You have resistance to the damage type associated with your draconic ancestry. Ancestry options: Black (Acid, 5x30 ft line, Dex save), Blue (Lightning, 5x30 ft line, Dex save), Brass (Fire, 5x30 ft line, Dex save), Bronze (Lightning, 5x30 ft line, Dex save), Copper (Acid, 5x30 ft line, Dex save), Gold (Fire, 15 ft cone, Dex save), Green (Poison, 15 ft cone, Con save), Red (Fire, 15 ft cone, Dex save), Silver (Cold, 15 ft cone, Con save), White (Cold, 15 ft cone, Con save).",
    languages: "Common, Draconic",
    subraces: []
  }
];
