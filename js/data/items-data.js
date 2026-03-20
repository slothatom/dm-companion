// D&D 5e SRD Items
var ITEMS = [
  // ──────────────────────────────────────────────
  //  SIMPLE MELEE WEAPONS
  // ──────────────────────────────────────────────
  {
    name: "Club",
    category: "weapon",
    cost: "1 sp",
    weight: "2 lb.",
    properties: "Light",
    desc: "Simple melee weapon. 1d4 bludgeoning damage."
  },
  {
    name: "Dagger",
    category: "weapon",
    cost: "2 gp",
    weight: "1 lb.",
    properties: "Finesse, Light, Thrown (20/60)",
    desc: "Simple melee weapon. 1d4 piercing damage."
  },
  {
    name: "Greatclub",
    category: "weapon",
    cost: "2 sp",
    weight: "10 lb.",
    properties: "Two-Handed",
    desc: "Simple melee weapon. 1d8 bludgeoning damage."
  },
  {
    name: "Handaxe",
    category: "weapon",
    cost: "5 gp",
    weight: "2 lb.",
    properties: "Light, Thrown (20/60)",
    desc: "Simple melee weapon. 1d6 slashing damage."
  },
  {
    name: "Javelin",
    category: "weapon",
    cost: "5 sp",
    weight: "2 lb.",
    properties: "Thrown (30/120)",
    desc: "Simple melee weapon. 1d6 piercing damage."
  },
  {
    name: "Light Hammer",
    category: "weapon",
    cost: "2 gp",
    weight: "2 lb.",
    properties: "Light, Thrown (20/60)",
    desc: "Simple melee weapon. 1d4 bludgeoning damage."
  },
  {
    name: "Mace",
    category: "weapon",
    cost: "5 gp",
    weight: "4 lb.",
    properties: "-",
    desc: "Simple melee weapon. 1d6 bludgeoning damage."
  },
  {
    name: "Quarterstaff",
    category: "weapon",
    cost: "2 sp",
    weight: "4 lb.",
    properties: "Versatile (1d8)",
    desc: "Simple melee weapon. 1d6 bludgeoning damage."
  },
  {
    name: "Sickle",
    category: "weapon",
    cost: "1 gp",
    weight: "2 lb.",
    properties: "Light",
    desc: "Simple melee weapon. 1d4 slashing damage."
  },
  {
    name: "Spear",
    category: "weapon",
    cost: "1 gp",
    weight: "3 lb.",
    properties: "Thrown (20/60), Versatile (1d8)",
    desc: "Simple melee weapon. 1d6 piercing damage."
  },

  // ──────────────────────────────────────────────
  //  SIMPLE RANGED WEAPONS
  // ──────────────────────────────────────────────
  {
    name: "Light Crossbow",
    category: "weapon",
    cost: "25 gp",
    weight: "5 lb.",
    properties: "Ammunition (80/320), Loading, Two-Handed",
    desc: "Simple ranged weapon. 1d8 piercing damage."
  },
  {
    name: "Dart",
    category: "weapon",
    cost: "5 cp",
    weight: "1/4 lb.",
    properties: "Finesse, Thrown (20/60)",
    desc: "Simple ranged weapon. 1d4 piercing damage."
  },
  {
    name: "Shortbow",
    category: "weapon",
    cost: "25 gp",
    weight: "2 lb.",
    properties: "Ammunition (80/320), Two-Handed",
    desc: "Simple ranged weapon. 1d6 piercing damage."
  },
  {
    name: "Sling",
    category: "weapon",
    cost: "1 sp",
    weight: "-",
    properties: "Ammunition (30/120)",
    desc: "Simple ranged weapon. 1d4 bludgeoning damage."
  },

  // ──────────────────────────────────────────────
  //  MARTIAL MELEE WEAPONS
  // ──────────────────────────────────────────────
  {
    name: "Battleaxe",
    category: "weapon",
    cost: "10 gp",
    weight: "4 lb.",
    properties: "Versatile (1d10)",
    desc: "Martial melee weapon. 1d8 slashing damage."
  },
  {
    name: "Flail",
    category: "weapon",
    cost: "10 gp",
    weight: "2 lb.",
    properties: "-",
    desc: "Martial melee weapon. 1d8 bludgeoning damage."
  },
  {
    name: "Glaive",
    category: "weapon",
    cost: "20 gp",
    weight: "6 lb.",
    properties: "Heavy, Reach, Two-Handed",
    desc: "Martial melee weapon. 1d10 slashing damage."
  },
  {
    name: "Greataxe",
    category: "weapon",
    cost: "30 gp",
    weight: "7 lb.",
    properties: "Heavy, Two-Handed",
    desc: "Martial melee weapon. 1d12 slashing damage."
  },
  {
    name: "Greatsword",
    category: "weapon",
    cost: "50 gp",
    weight: "6 lb.",
    properties: "Heavy, Two-Handed",
    desc: "Martial melee weapon. 2d6 slashing damage."
  },
  {
    name: "Halberd",
    category: "weapon",
    cost: "20 gp",
    weight: "6 lb.",
    properties: "Heavy, Reach, Two-Handed",
    desc: "Martial melee weapon. 1d10 slashing damage."
  },
  {
    name: "Lance",
    category: "weapon",
    cost: "10 gp",
    weight: "6 lb.",
    properties: "Reach, Special",
    desc: "Martial melee weapon. 1d12 piercing damage. You have disadvantage when you use a lance to attack a target within 5 feet of you. Also, a lance requires two hands to wield when you aren't mounted."
  },
  {
    name: "Longsword",
    category: "weapon",
    cost: "15 gp",
    weight: "3 lb.",
    properties: "Versatile (1d10)",
    desc: "Martial melee weapon. 1d8 slashing damage."
  },
  {
    name: "Maul",
    category: "weapon",
    cost: "10 gp",
    weight: "10 lb.",
    properties: "Heavy, Two-Handed",
    desc: "Martial melee weapon. 2d6 bludgeoning damage."
  },
  {
    name: "Morningstar",
    category: "weapon",
    cost: "15 gp",
    weight: "4 lb.",
    properties: "-",
    desc: "Martial melee weapon. 1d8 piercing damage."
  },
  {
    name: "Pike",
    category: "weapon",
    cost: "5 gp",
    weight: "18 lb.",
    properties: "Heavy, Reach, Two-Handed",
    desc: "Martial melee weapon. 1d10 piercing damage."
  },
  {
    name: "Rapier",
    category: "weapon",
    cost: "25 gp",
    weight: "2 lb.",
    properties: "Finesse",
    desc: "Martial melee weapon. 1d8 piercing damage."
  },
  {
    name: "Scimitar",
    category: "weapon",
    cost: "25 gp",
    weight: "3 lb.",
    properties: "Finesse, Light",
    desc: "Martial melee weapon. 1d6 slashing damage."
  },
  {
    name: "Shortsword",
    category: "weapon",
    cost: "10 gp",
    weight: "2 lb.",
    properties: "Finesse, Light",
    desc: "Martial melee weapon. 1d6 piercing damage."
  },
  {
    name: "Trident",
    category: "weapon",
    cost: "5 gp",
    weight: "4 lb.",
    properties: "Thrown (20/60), Versatile (1d8)",
    desc: "Martial melee weapon. 1d6 piercing damage."
  },
  {
    name: "War Pick",
    category: "weapon",
    cost: "5 gp",
    weight: "2 lb.",
    properties: "-",
    desc: "Martial melee weapon. 1d8 piercing damage."
  },
  {
    name: "Warhammer",
    category: "weapon",
    cost: "15 gp",
    weight: "2 lb.",
    properties: "Versatile (1d10)",
    desc: "Martial melee weapon. 1d8 bludgeoning damage."
  },
  {
    name: "Whip",
    category: "weapon",
    cost: "2 gp",
    weight: "3 lb.",
    properties: "Finesse, Reach",
    desc: "Martial melee weapon. 1d4 slashing damage."
  },

  // ──────────────────────────────────────────────
  //  MARTIAL RANGED WEAPONS
  // ──────────────────────────────────────────────
  {
    name: "Blowgun",
    category: "weapon",
    cost: "10 gp",
    weight: "1 lb.",
    properties: "Ammunition (25/100), Loading",
    desc: "Martial ranged weapon. 1 piercing damage."
  },
  {
    name: "Hand Crossbow",
    category: "weapon",
    cost: "75 gp",
    weight: "3 lb.",
    properties: "Ammunition (30/120), Light, Loading",
    desc: "Martial ranged weapon. 1d6 piercing damage."
  },
  {
    name: "Heavy Crossbow",
    category: "weapon",
    cost: "50 gp",
    weight: "18 lb.",
    properties: "Ammunition (100/400), Heavy, Loading, Two-Handed",
    desc: "Martial ranged weapon. 1d10 piercing damage."
  },
  {
    name: "Longbow",
    category: "weapon",
    cost: "50 gp",
    weight: "2 lb.",
    properties: "Ammunition (150/600), Heavy, Two-Handed",
    desc: "Martial ranged weapon. 1d8 piercing damage."
  },
  {
    name: "Net",
    category: "weapon",
    cost: "1 gp",
    weight: "3 lb.",
    properties: "Special, Thrown (5/15)",
    desc: "Martial ranged weapon. A Large or smaller creature hit by a net is restrained until freed. A creature can use its action to make a DC 10 Strength check, freeing itself or another creature within its reach on a success. Dealing 5 slashing damage to the net (AC 10) also frees the creature without harming it."
  },

  // ──────────────────────────────────────────────
  //  ARMOR
  // ──────────────────────────────────────────────
  {
    name: "Padded Armor",
    category: "armor",
    cost: "5 gp",
    weight: "8 lb.",
    properties: "AC 11 + Dex modifier",
    desc: "Light armor. Disadvantage on Stealth checks."
  },
  {
    name: "Leather Armor",
    category: "armor",
    cost: "10 gp",
    weight: "10 lb.",
    properties: "AC 11 + Dex modifier",
    desc: "Light armor."
  },
  {
    name: "Studded Leather Armor",
    category: "armor",
    cost: "45 gp",
    weight: "13 lb.",
    properties: "AC 12 + Dex modifier",
    desc: "Light armor."
  },
  {
    name: "Hide Armor",
    category: "armor",
    cost: "10 gp",
    weight: "12 lb.",
    properties: "AC 12 + Dex modifier (max 2)",
    desc: "Medium armor."
  },
  {
    name: "Chain Shirt",
    category: "armor",
    cost: "50 gp",
    weight: "20 lb.",
    properties: "AC 13 + Dex modifier (max 2)",
    desc: "Medium armor."
  },
  {
    name: "Scale Mail",
    category: "armor",
    cost: "50 gp",
    weight: "45 lb.",
    properties: "AC 14 + Dex modifier (max 2)",
    desc: "Medium armor. Disadvantage on Stealth checks."
  },
  {
    name: "Breastplate",
    category: "armor",
    cost: "400 gp",
    weight: "20 lb.",
    properties: "AC 14 + Dex modifier (max 2)",
    desc: "Medium armor."
  },
  {
    name: "Half Plate Armor",
    category: "armor",
    cost: "750 gp",
    weight: "40 lb.",
    properties: "AC 15 + Dex modifier (max 2)",
    desc: "Medium armor. Disadvantage on Stealth checks."
  },
  {
    name: "Ring Mail",
    category: "armor",
    cost: "30 gp",
    weight: "40 lb.",
    properties: "AC 14",
    desc: "Heavy armor. Disadvantage on Stealth checks."
  },
  {
    name: "Chain Mail",
    category: "armor",
    cost: "75 gp",
    weight: "55 lb.",
    properties: "AC 16",
    desc: "Heavy armor. Str 13 required. Disadvantage on Stealth checks."
  },
  {
    name: "Splint Armor",
    category: "armor",
    cost: "200 gp",
    weight: "60 lb.",
    properties: "AC 17",
    desc: "Heavy armor. Str 15 required. Disadvantage on Stealth checks."
  },
  {
    name: "Plate Armor",
    category: "armor",
    cost: "1,500 gp",
    weight: "65 lb.",
    properties: "AC 18",
    desc: "Heavy armor. Str 15 required. Disadvantage on Stealth checks."
  },
  {
    name: "Shield",
    category: "armor",
    cost: "10 gp",
    weight: "6 lb.",
    properties: "+2 AC",
    desc: "A shield is made from wood or metal and is carried in one hand. Wielding a shield increases your Armor Class by 2. You can benefit from only one shield at a time."
  },

  // ──────────────────────────────────────────────
  //  ADVENTURING GEAR
  // ──────────────────────────────────────────────
  {
    name: "Abacus",
    category: "gear",
    cost: "2 gp",
    weight: "2 lb.",
    properties: "Counting tool",
    desc: "A standard calculating frame."
  },
  {
    name: "Acid (vial)",
    category: "gear",
    cost: "25 gp",
    weight: "1 lb.",
    properties: "Improvised weapon",
    desc: "As an action, you can splash the contents onto a creature within 5 feet or throw the vial up to 20 feet, shattering on impact. Make a ranged attack, treating the acid as an improvised weapon. On a hit, the target takes 2d6 acid damage."
  },
  {
    name: "Alchemist's Fire (flask)",
    category: "gear",
    cost: "50 gp",
    weight: "1 lb.",
    properties: "Improvised weapon",
    desc: "As an action, you can throw this flask up to 20 feet, shattering on impact. Make a ranged attack, treating it as an improvised weapon. On a hit, the target takes 1d4 fire damage at the start of each of its turns. A creature can end this damage by using its action to make a DC 10 Dexterity check to extinguish the flames."
  },
  {
    name: "Arrows (20)",
    category: "gear",
    cost: "1 gp",
    weight: "1 lb.",
    properties: "Ammunition",
    desc: "A quiver of 20 arrows for use with bows."
  },
  {
    name: "Bolts (20)",
    category: "gear",
    cost: "1 gp",
    weight: "1½ lb.",
    properties: "Ammunition",
    desc: "A case of 20 crossbow bolts."
  },
  {
    name: "Blowgun Needles (50)",
    category: "gear",
    cost: "1 gp",
    weight: "1 lb.",
    properties: "Ammunition",
    desc: "A case of 50 blowgun needles."
  },
  {
    name: "Sling Bullets (20)",
    category: "gear",
    cost: "4 cp",
    weight: "1½ lb.",
    properties: "Ammunition",
    desc: "A pouch of 20 sling bullets."
  },
  {
    name: "Backpack",
    category: "gear",
    cost: "2 gp",
    weight: "5 lb.",
    properties: "Holds 30 lb. / 1 cu. ft.",
    desc: "A leather or canvas pack carried on the back. Can hold up to 30 pounds or 1 cubic foot of gear."
  },
  {
    name: "Ball Bearings (bag of 1,000)",
    category: "gear",
    cost: "1 gp",
    weight: "2 lb.",
    properties: "Covers 10 ft. square",
    desc: "As an action, you can spill these tiny metal balls to cover a 10-foot-square area. A creature moving through the area must succeed on a DC 10 Dexterity saving throw or fall prone."
  },
  {
    name: "Bedroll",
    category: "gear",
    cost: "1 gp",
    weight: "7 lb.",
    properties: "Sleeping gear",
    desc: "A portable sleeping mat and blankets that can be rolled up for transport."
  },
  {
    name: "Bell",
    category: "gear",
    cost: "1 gp",
    weight: "-",
    properties: "Signal device",
    desc: "A small metal bell."
  },
  {
    name: "Blanket",
    category: "gear",
    cost: "5 sp",
    weight: "3 lb.",
    properties: "Sleeping gear",
    desc: "A thick wool or cloth blanket."
  },
  {
    name: "Block and Tackle",
    category: "gear",
    cost: "1 gp",
    weight: "5 lb.",
    properties: "Lifting aid",
    desc: "A set of pulleys with a cable threaded through them and a hook to attach to objects. Using a block and tackle lets you hoist up to four times the weight you can normally lift."
  },
  {
    name: "Book",
    category: "gear",
    cost: "25 gp",
    weight: "5 lb.",
    properties: "Writing",
    desc: "A blank book suitable for recording notes or information. May contain lore or maps."
  },
  {
    name: "Caltrops (bag of 20)",
    category: "gear",
    cost: "1 gp",
    weight: "2 lb.",
    properties: "Covers 5 ft. square",
    desc: "As an action, you can spread a single bag to cover a 5-foot-square area. Any creature that enters the area must succeed on a DC 15 Dexterity saving throw or take 1 piercing damage and stop moving. Until the creature regains at least 1 hit point, its walking speed is reduced by 10 feet."
  },
  {
    name: "Candle",
    category: "gear",
    cost: "1 cp",
    weight: "-",
    properties: "Light (5 ft.)",
    desc: "For 1 hour, a candle sheds bright light in a 5-foot radius and dim light for an additional 5 feet."
  },
  {
    name: "Chain (10 feet)",
    category: "gear",
    cost: "5 gp",
    weight: "10 lb.",
    properties: "AC 20, 10 HP",
    desc: "A chain has 10 hit points. It can be burst with a successful DC 20 Strength check."
  },
  {
    name: "Chalk (1 piece)",
    category: "gear",
    cost: "1 cp",
    weight: "-",
    properties: "Writing/marking",
    desc: "A piece of chalk for writing on stone or other surfaces."
  },
  {
    name: "Chest",
    category: "gear",
    cost: "5 gp",
    weight: "25 lb.",
    properties: "Holds 300 lb. / 12 cu. ft.",
    desc: "A wooden chest that can hold up to 300 pounds or 12 cubic feet of gear."
  },
  {
    name: "Climber's Kit",
    category: "gear",
    cost: "25 gp",
    weight: "12 lb.",
    properties: "Climbing aid",
    desc: "Includes special pitons, boot tips, gloves, and a harness. You can use the climber's kit as an action to anchor yourself; when you do, you can't fall more than 25 feet from the point where you anchored yourself, and you can't climb more than 25 feet away from that point without undoing the anchor."
  },
  {
    name: "Component Pouch",
    category: "gear",
    cost: "25 gp",
    weight: "2 lb.",
    properties: "Spellcasting focus",
    desc: "A small, watertight leather belt pouch that has compartments to hold all the material components and other special items you need to cast your spells, except for those components that have a specific cost."
  },
  {
    name: "Crowbar",
    category: "gear",
    cost: "2 gp",
    weight: "5 lb.",
    properties: "Advantage on Strength checks",
    desc: "Using a crowbar grants advantage to Strength checks where the crowbar's leverage can be applied."
  },
  {
    name: "Flask (empty)",
    category: "gear",
    cost: "2 cp",
    weight: "1 lb.",
    properties: "Holds 1 pint",
    desc: "A glass or metal flask that holds up to 1 pint of liquid."
  },
  {
    name: "Grappling Hook",
    category: "gear",
    cost: "2 gp",
    weight: "4 lb.",
    properties: "Climbing aid",
    desc: "A multi-pronged metal hook designed to be thrown and catch on ledges, windowsills, or other protrusions."
  },
  {
    name: "Hammer",
    category: "gear",
    cost: "1 gp",
    weight: "3 lb.",
    properties: "General purpose",
    desc: "A standard hammer for driving pitons or general use."
  },
  {
    name: "Healer's Kit",
    category: "gear",
    cost: "5 gp",
    weight: "3 lb.",
    properties: "10 uses",
    desc: "This kit has ten uses. As an action, you can expend one use to stabilize a creature that has 0 hit points, without needing to make a Wisdom (Medicine) check."
  },
  {
    name: "Holy Symbol",
    category: "gear",
    cost: "5 gp",
    weight: "1 lb.",
    properties: "Spellcasting focus",
    desc: "A representation of a god or pantheon. A cleric or paladin can use a holy symbol as a spellcasting focus. Available as an amulet, emblem, or reliquary."
  },
  {
    name: "Holy Water (flask)",
    category: "gear",
    cost: "25 gp",
    weight: "1 lb.",
    properties: "Improvised weapon",
    desc: "As an action, you can splash the contents onto a creature within 5 feet or throw it up to 20 feet, shattering on impact. Make a ranged attack, treating it as an improvised weapon. If the target is a fiend or undead, it takes 2d6 radiant damage."
  },
  {
    name: "Hunting Trap",
    category: "gear",
    cost: "5 gp",
    weight: "25 lb.",
    properties: "Trap",
    desc: "When you use your action to set it, this trap forms a saw-toothed steel ring that snaps shut when a creature steps on a pressure plate. A creature that steps on the plate must succeed on a DC 13 Dexterity saving throw or take 1d4 piercing damage and stop moving. The creature is restrained until freed. A creature can use its action to make a DC 13 Strength check, freeing itself or another creature within reach."
  },
  {
    name: "Ink (1 ounce bottle)",
    category: "gear",
    cost: "10 gp",
    weight: "-",
    properties: "Writing",
    desc: "A one-ounce bottle of black or colored ink."
  },
  {
    name: "Ink Pen",
    category: "gear",
    cost: "2 cp",
    weight: "-",
    properties: "Writing",
    desc: "A pen for writing with ink."
  },
  {
    name: "Lamp",
    category: "gear",
    cost: "5 sp",
    weight: "1 lb.",
    properties: "Light (15 ft. / 30 ft. dim)",
    desc: "A lamp casts bright light in a 15-foot radius and dim light for an additional 30 feet. Once lit, it burns for 6 hours on a flask (1 pint) of oil."
  },
  {
    name: "Lantern, Bullseye",
    category: "gear",
    cost: "10 gp",
    weight: "2 lb.",
    properties: "Light (60 ft. cone / 120 ft. dim)",
    desc: "A bullseye lantern casts bright light in a 60-foot cone and dim light for an additional 60 feet. Once lit, it burns for 6 hours on a flask (1 pint) of oil."
  },
  {
    name: "Lantern, Hooded",
    category: "gear",
    cost: "5 gp",
    weight: "2 lb.",
    properties: "Light (30 ft. / 60 ft. dim)",
    desc: "A hooded lantern casts bright light in a 30-foot radius and dim light for an additional 30 feet. Once lit, it burns for 6 hours on a flask (1 pint) of oil. As an action, you can lower the hood, reducing the light to dim light in a 5-foot radius."
  },
  {
    name: "Lock",
    category: "gear",
    cost: "10 gp",
    weight: "1 lb.",
    properties: "DC 15 to pick",
    desc: "A key is provided with the lock. Without the key, a creature proficient with thieves' tools can pick this lock with a successful DC 15 Dexterity check."
  },
  {
    name: "Magnifying Glass",
    category: "gear",
    cost: "100 gp",
    weight: "-",
    properties: "Investigation aid",
    desc: "This lens allows a closer look at small objects. It is also useful as a substitute for flint and steel when starting fires. Lighting a fire with a magnifying glass requires light as bright as sunlight to focus, tinder to ignite, and about 5 minutes for the fire to ignite."
  },
  {
    name: "Manacles",
    category: "gear",
    cost: "2 gp",
    weight: "6 lb.",
    properties: "DC 20 Str / DC 15 Dex to escape",
    desc: "These metal restraints can bind a Small or Medium creature. Escaping requires a DC 20 Strength check or DC 15 Dexterity check using thieves' tools. Each set comes with one key."
  },
  {
    name: "Mess Kit",
    category: "gear",
    cost: "2 sp",
    weight: "1 lb.",
    properties: "Eating utensils",
    desc: "This tin box contains a cup and simple cutlery. The box clamps together, and one side can be used as a cooking pan and the other as a plate or shallow bowl."
  },
  {
    name: "Mirror, Steel",
    category: "gear",
    cost: "5 gp",
    weight: "1/2 lb.",
    properties: "Viewing around corners",
    desc: "A polished steel mirror useful for looking around corners or signaling."
  },
  {
    name: "Oil (flask)",
    category: "gear",
    cost: "1 sp",
    weight: "1 lb.",
    properties: "Fuel / improvised weapon",
    desc: "Oil usually comes in a clay flask that holds 1 pint. As an action, you can splash oil onto a creature within 5 feet or throw it up to 20 feet, shattering on impact. A lit target takes an additional 5 fire damage. Oil burns for 2 hours, fueling a lamp or lantern."
  },
  {
    name: "Paper (one sheet)",
    category: "gear",
    cost: "2 sp",
    weight: "-",
    properties: "Writing",
    desc: "A single sheet of parchment-quality paper."
  },
  {
    name: "Piton",
    category: "gear",
    cost: "5 cp",
    weight: "1/4 lb.",
    properties: "Climbing aid",
    desc: "A metal spike driven into rock or ice to serve as an anchor for climbing."
  },
  {
    name: "Potion of Healing",
    category: "gear",
    cost: "50 gp",
    weight: "1/2 lb.",
    properties: "Consumable",
    desc: "A character who drinks the magical red fluid in this vial regains 2d4 + 2 hit points. Drinking or administering a potion takes an action."
  },
  {
    name: "Pouch",
    category: "gear",
    cost: "5 sp",
    weight: "1 lb.",
    properties: "Holds 6 lb. / 1/5 cu. ft.",
    desc: "A cloth or leather pouch that can hold up to 20 sling bullets or 50 blowgun needles, among other things."
  },
  {
    name: "Quiver",
    category: "gear",
    cost: "1 gp",
    weight: "1 lb.",
    properties: "Holds 20 arrows",
    desc: "A quiver can hold up to 20 arrows."
  },
  {
    name: "Ram, Portable",
    category: "gear",
    cost: "4 gp",
    weight: "35 lb.",
    properties: "+4 Strength (break door)",
    desc: "You can use a portable ram to break down doors. When doing so, you gain a +4 bonus on the Strength check. One other character can help you use the ram, giving you advantage on this check."
  },
  {
    name: "Rations (1 day)",
    category: "gear",
    cost: "5 sp",
    weight: "2 lb.",
    properties: "Food",
    desc: "Rations consist of dry foods suitable for extended travel, including jerky, dried fruit, hardtack, and nuts."
  },
  {
    name: "Rope, Hempen (50 feet)",
    category: "gear",
    cost: "1 gp",
    weight: "10 lb.",
    properties: "2 HP, burst DC 17",
    desc: "Rope has 2 hit points and can be burst with a DC 17 Strength check."
  },
  {
    name: "Rope, Silk (50 feet)",
    category: "gear",
    cost: "10 gp",
    weight: "5 lb.",
    properties: "2 HP, burst DC 17",
    desc: "Silk rope has 2 hit points and can be burst with a DC 17 Strength check. It is lighter and smoother than hempen rope."
  },
  {
    name: "Sack",
    category: "gear",
    cost: "1 cp",
    weight: "1/2 lb.",
    properties: "Holds 30 lb. / 1 cu. ft.",
    desc: "A simple cloth sack."
  },
  {
    name: "Sealing Wax",
    category: "gear",
    cost: "5 sp",
    weight: "-",
    properties: "Writing",
    desc: "A stick of sealing wax used to seal letters and documents."
  },
  {
    name: "Shovel",
    category: "gear",
    cost: "2 gp",
    weight: "5 lb.",
    properties: "Digging",
    desc: "A standard shovel for digging."
  },
  {
    name: "Signal Whistle",
    category: "gear",
    cost: "5 cp",
    weight: "-",
    properties: "Signal device",
    desc: "A small whistle for signaling."
  },
  {
    name: "Spellbook",
    category: "gear",
    cost: "50 gp",
    weight: "3 lb.",
    properties: "Wizard essential",
    desc: "Essential for wizards. A leather-bound tome with 100 blank vellum pages suitable for recording spells."
  },
  {
    name: "Spyglass",
    category: "gear",
    cost: "1,000 gp",
    weight: "1 lb.",
    properties: "Vision aid",
    desc: "Objects viewed through a spyglass are magnified to twice their size."
  },
  {
    name: "Tent, Two-Person",
    category: "gear",
    cost: "2 gp",
    weight: "20 lb.",
    properties: "Shelter",
    desc: "A simple and portable canvas shelter that sleeps two."
  },
  {
    name: "Tinderbox",
    category: "gear",
    cost: "5 sp",
    weight: "1 lb.",
    properties: "Fire starting",
    desc: "This small container holds flint, fire steel, and tinder used to kindle a fire. Using it to light a torch - or anything else with abundant, exposed fuel - takes an action. Lighting any other fire takes 1 minute."
  },
  {
    name: "Torch",
    category: "gear",
    cost: "1 cp",
    weight: "1 lb.",
    properties: "Light (20 ft. / 40 ft. dim)",
    desc: "A torch burns for 1 hour, providing bright light in a 20-foot radius and dim light for an additional 20 feet. If you make a melee attack with a burning torch, it deals 1 fire damage."
  },
  {
    name: "Vial",
    category: "gear",
    cost: "1 gp",
    weight: "-",
    properties: "Holds 4 ounces",
    desc: "A glass vial that can hold up to 4 ounces of liquid."
  },
  {
    name: "Waterskin",
    category: "gear",
    cost: "2 sp",
    weight: "5 lb. (full)",
    properties: "Holds 4 pints",
    desc: "A leather pouch that holds up to 4 pints of liquid."
  },
  {
    name: "Whetstone",
    category: "gear",
    cost: "1 cp",
    weight: "1 lb.",
    properties: "Blade care",
    desc: "A flat stone used for sharpening blades."
  },
  {
    name: "Arcane Focus - Crystal",
    category: "gear",
    cost: "10 gp",
    weight: "1 lb.",
    properties: "Spellcasting focus",
    desc: "An arcane focus is a special item designed to channel the power of arcane spells. A sorcerer, warlock, or wizard can use such an item as a spellcasting focus."
  },
  {
    name: "Arcane Focus - Orb",
    category: "gear",
    cost: "20 gp",
    weight: "3 lb.",
    properties: "Spellcasting focus",
    desc: "An arcane focus is a special item designed to channel the power of arcane spells. A sorcerer, warlock, or wizard can use such an item as a spellcasting focus."
  },
  {
    name: "Arcane Focus - Rod",
    category: "gear",
    cost: "10 gp",
    weight: "2 lb.",
    properties: "Spellcasting focus",
    desc: "An arcane focus is a special item designed to channel the power of arcane spells. A sorcerer, warlock, or wizard can use such an item as a spellcasting focus."
  },
  {
    name: "Arcane Focus - Staff",
    category: "gear",
    cost: "5 gp",
    weight: "4 lb.",
    properties: "Spellcasting focus",
    desc: "An arcane focus is a special item designed to channel the power of arcane spells. A sorcerer, warlock, or wizard can use such an item as a spellcasting focus."
  },
  {
    name: "Arcane Focus - Wand",
    category: "gear",
    cost: "10 gp",
    weight: "1 lb.",
    properties: "Spellcasting focus",
    desc: "An arcane focus is a special item designed to channel the power of arcane spells. A sorcerer, warlock, or wizard can use such an item as a spellcasting focus."
  },
  {
    name: "Druidic Focus - Sprig of Mistletoe",
    category: "gear",
    cost: "1 gp",
    weight: "-",
    properties: "Spellcasting focus",
    desc: "A druidic focus might be a sprig of mistletoe, a totem, a wooden staff, or a yew wand. A druid can use such an item as a spellcasting focus."
  },
  {
    name: "Druidic Focus - Wooden Staff",
    category: "gear",
    cost: "5 gp",
    weight: "4 lb.",
    properties: "Spellcasting focus",
    desc: "A druidic focus might be a sprig of mistletoe, a totem, a wooden staff, or a yew wand. A druid can use such an item as a spellcasting focus."
  },
  {
    name: "Druidic Focus - Yew Wand",
    category: "gear",
    cost: "10 gp",
    weight: "1 lb.",
    properties: "Spellcasting focus",
    desc: "A druidic focus might be a sprig of mistletoe, a totem, a wooden staff, or a yew wand. A druid can use such an item as a spellcasting focus."
  },
  {
    name: "Antitoxin (vial)",
    category: "gear",
    cost: "50 gp",
    weight: "-",
    properties: "Consumable",
    desc: "A creature that drinks this vial of liquid gains advantage on saving throws against poison for 1 hour. It confers no benefit to undead or constructs."
  },

  // ──────────────────────────────────────────────
  //  TOOLS
  // ──────────────────────────────────────────────
  {
    name: "Thieves' Tools",
    category: "tool",
    cost: "25 gp",
    weight: "1 lb.",
    properties: "Dexterity check to pick locks/disarm traps",
    desc: "This set of tools includes a small file, a set of lock picks, a small mirror mounted on a metal handle, a set of narrow-bladed scissors, and a pair of pliers. Proficiency lets you add your proficiency bonus to ability checks made to disarm traps or open locks."
  },
  {
    name: "Smith's Tools",
    category: "tool",
    cost: "20 gp",
    weight: "8 lb.",
    properties: "Metalworking",
    desc: "These special tools include the items needed to pursue a craft or trade - hammers, tongs, and other smithing implements."
  },
  {
    name: "Brewer's Supplies",
    category: "tool",
    cost: "20 gp",
    weight: "9 lb.",
    properties: "Brewing",
    desc: "Supplies for brewing beer, ale, and other alcoholic beverages."
  },
  {
    name: "Calligrapher's Supplies",
    category: "tool",
    cost: "10 gp",
    weight: "5 lb.",
    properties: "Fine writing",
    desc: "Includes ink, a dozen sheets of parchment, and three quills for producing decorative script."
  },
  {
    name: "Carpenter's Tools",
    category: "tool",
    cost: "8 gp",
    weight: "6 lb.",
    properties: "Woodworking",
    desc: "Tools for constructing and repairing wooden objects and structures."
  },
  {
    name: "Cartographer's Tools",
    category: "tool",
    cost: "15 gp",
    weight: "6 lb.",
    properties: "Mapmaking",
    desc: "Includes a quill, ink, parchment, a pair of compasses, calipers, and a ruler for creating accurate maps."
  },
  {
    name: "Cobbler's Tools",
    category: "tool",
    cost: "5 gp",
    weight: "5 lb.",
    properties: "Shoe making/repair",
    desc: "Tools for making and repairing shoes and boots."
  },
  {
    name: "Cook's Utensils",
    category: "tool",
    cost: "1 gp",
    weight: "8 lb.",
    properties: "Cooking",
    desc: "A metal pot, knives, forks, a stirring spoon, and a ladle for preparing meals."
  },
  {
    name: "Glassblower's Tools",
    category: "tool",
    cost: "30 gp",
    weight: "5 lb.",
    properties: "Glassworking",
    desc: "Tools for shaping molten glass into useful and decorative objects."
  },
  {
    name: "Herbalism Kit",
    category: "tool",
    cost: "5 gp",
    weight: "3 lb.",
    properties: "Identify/apply herbs",
    desc: "This kit contains a variety of instruments such as clippers, mortar and pestle, and pouches and vials used by herbalists to create remedies and potions. Proficiency lets you add your proficiency bonus to checks to identify or apply herbs."
  },
  {
    name: "Jeweler's Tools",
    category: "tool",
    cost: "25 gp",
    weight: "2 lb.",
    properties: "Gem cutting and jewelry making",
    desc: "Tools for cutting gems and crafting jewelry."
  },
  {
    name: "Leatherworker's Tools",
    category: "tool",
    cost: "5 gp",
    weight: "5 lb.",
    properties: "Leatherworking",
    desc: "Tools for working with leather to create armor, bags, and other goods."
  },
  {
    name: "Mason's Tools",
    category: "tool",
    cost: "10 gp",
    weight: "8 lb.",
    properties: "Stoneworking",
    desc: "Tools for cutting and shaping stone for construction."
  },
  {
    name: "Navigator's Tools",
    category: "tool",
    cost: "25 gp",
    weight: "2 lb.",
    properties: "Navigation",
    desc: "This set of instruments is used for navigation at sea. Proficiency lets you chart a ship's course and follow navigation charts. It also lets you add your proficiency bonus to ability checks to avoid getting lost at sea."
  },
  {
    name: "Painter's Supplies",
    category: "tool",
    cost: "10 gp",
    weight: "5 lb.",
    properties: "Painting",
    desc: "Includes an easel, canvas, paints, brushes, ink, and charcoal sticks."
  },
  {
    name: "Poisoner's Kit",
    category: "tool",
    cost: "50 gp",
    weight: "2 lb.",
    properties: "Create/identify poisons",
    desc: "A poisoner's kit includes the vials, chemicals, and other equipment necessary for the creation of poisons. Proficiency lets you add your proficiency bonus to checks to craft or identify poisons."
  },
  {
    name: "Potter's Tools",
    category: "tool",
    cost: "10 gp",
    weight: "3 lb.",
    properties: "Pottery",
    desc: "Tools for creating and shaping clay into pots and other ceramic items."
  },
  {
    name: "Tinker's Tools",
    category: "tool",
    cost: "50 gp",
    weight: "10 lb.",
    properties: "Repair and crafting",
    desc: "A set of various hand tools for making small repairs to items and mechanisms. Includes pliers, wrenches, screwdrivers, and small hammers."
  },
  {
    name: "Weaver's Tools",
    category: "tool",
    cost: "1 gp",
    weight: "5 lb.",
    properties: "Weaving",
    desc: "Tools for weaving cloth and creating textiles."
  },
  {
    name: "Woodcarver's Tools",
    category: "tool",
    cost: "1 gp",
    weight: "5 lb.",
    properties: "Woodcarving",
    desc: "Tools for carving wood into decorative and functional objects."
  },
  {
    name: "Disguise Kit",
    category: "tool",
    cost: "25 gp",
    weight: "3 lb.",
    properties: "Charisma (Deception) check",
    desc: "This pouch of cosmetics, hair dye, and small props lets you create disguises that change your physical appearance. Proficiency lets you add your proficiency bonus to ability checks to create a visual disguise."
  },
  {
    name: "Forgery Kit",
    category: "tool",
    cost: "15 gp",
    weight: "5 lb.",
    properties: "Create forged documents",
    desc: "This small box contains a variety of papers and parchments, pens and inks, seals and sealing wax, gold and silver leaf, and other supplies necessary to create convincing forgeries of physical documents."
  },
  {
    name: "Dice Set",
    category: "tool",
    cost: "1 sp",
    weight: "-",
    properties: "Gaming set",
    desc: "A set of dice for gaming. Proficiency lets you add your proficiency bonus to ability checks made to play games with that set."
  },
  {
    name: "Playing Card Set",
    category: "tool",
    cost: "5 sp",
    weight: "-",
    properties: "Gaming set",
    desc: "A deck of playing cards for gaming. Proficiency lets you add your proficiency bonus to ability checks made to play games with that set."
  },
  {
    name: "Bagpipes",
    category: "tool",
    cost: "30 gp",
    weight: "6 lb.",
    properties: "Musical instrument",
    desc: "A musical instrument. Proficiency lets you add your proficiency bonus to ability checks made to play music with it."
  },
  {
    name: "Drum",
    category: "tool",
    cost: "6 gp",
    weight: "3 lb.",
    properties: "Musical instrument",
    desc: "A musical instrument. Proficiency lets you add your proficiency bonus to ability checks made to play music with it."
  },
  {
    name: "Flute",
    category: "tool",
    cost: "2 gp",
    weight: "1 lb.",
    properties: "Musical instrument",
    desc: "A musical instrument. Proficiency lets you add your proficiency bonus to ability checks made to play music with it."
  },
  {
    name: "Lute",
    category: "tool",
    cost: "35 gp",
    weight: "2 lb.",
    properties: "Musical instrument",
    desc: "A musical instrument. Proficiency lets you add your proficiency bonus to ability checks made to play music with it."
  },
  {
    name: "Lyre",
    category: "tool",
    cost: "30 gp",
    weight: "2 lb.",
    properties: "Musical instrument",
    desc: "A musical instrument. Proficiency lets you add your proficiency bonus to ability checks made to play music with it."
  },
  {
    name: "Horn",
    category: "tool",
    cost: "3 gp",
    weight: "2 lb.",
    properties: "Musical instrument",
    desc: "A musical instrument. Proficiency lets you add your proficiency bonus to ability checks made to play music with it."
  },

  // ──────────────────────────────────────────────
  //  MOUNTS AND VEHICLES
  // ──────────────────────────────────────────────
  {
    name: "Camel",
    category: "mount",
    cost: "50 gp",
    weight: "-",
    properties: "Speed 50 ft., capacity 480 lb.",
    desc: "A desert mount with a carrying capacity of 480 pounds. Speed 50 ft."
  },
  {
    name: "Donkey / Mule",
    category: "mount",
    cost: "8 gp",
    weight: "-",
    properties: "Speed 40 ft., capacity 420 lb.",
    desc: "A sturdy beast of burden with a carrying capacity of 420 pounds. Speed 40 ft."
  },
  {
    name: "Elephant",
    category: "mount",
    cost: "200 gp",
    weight: "-",
    properties: "Speed 40 ft., capacity 1,320 lb.",
    desc: "A massive mount with a carrying capacity of 1,320 pounds. Speed 40 ft."
  },
  {
    name: "Horse, Draft",
    category: "mount",
    cost: "50 gp",
    weight: "-",
    properties: "Speed 40 ft., capacity 540 lb.",
    desc: "A large horse bred for heavy labor and pulling carts. Carrying capacity of 540 pounds. Speed 40 ft."
  },
  {
    name: "Horse, Riding",
    category: "mount",
    cost: "75 gp",
    weight: "-",
    properties: "Speed 60 ft., capacity 480 lb.",
    desc: "A horse bred for speed and riding. Carrying capacity of 480 pounds. Speed 60 ft."
  },
  {
    name: "Mastiff",
    category: "mount",
    cost: "25 gp",
    weight: "-",
    properties: "Speed 40 ft., capacity 195 lb.",
    desc: "A large war dog that can serve as a mount for Small creatures. Carrying capacity of 195 pounds. Speed 40 ft."
  },
  {
    name: "Pony",
    category: "mount",
    cost: "30 gp",
    weight: "-",
    properties: "Speed 40 ft., capacity 225 lb.",
    desc: "A small horse suitable as a mount for Small creatures. Carrying capacity of 225 pounds. Speed 40 ft."
  },
  {
    name: "Warhorse",
    category: "mount",
    cost: "400 gp",
    weight: "-",
    properties: "Speed 60 ft., capacity 540 lb.",
    desc: "A horse trained for combat. Carrying capacity of 540 pounds. Speed 60 ft. Has advantage on saving throws against being frightened."
  },
  {
    name: "Barding",
    category: "mount",
    cost: "Varies (x4 armor cost)",
    weight: "Varies (x2 armor weight)",
    properties: "Armor for mounts",
    desc: "Barding is armor designed to protect an animal's head, neck, chest, and body. Any type of armor can be made as barding. The cost is four times the equivalent armor made for humanoids, and it weighs twice as much."
  },
  {
    name: "Saddle, Riding",
    category: "mount",
    cost: "10 gp",
    weight: "25 lb.",
    properties: "Riding equipment",
    desc: "A standard riding saddle."
  },
  {
    name: "Saddle, Military",
    category: "mount",
    cost: "20 gp",
    weight: "30 lb.",
    properties: "Riding equipment, advantage vs. unhorsing",
    desc: "A military saddle braces the rider, helping you keep your seat on an active mount in battle. It gives you advantage on any check you make to remain mounted."
  },
  {
    name: "Saddle, Exotic",
    category: "mount",
    cost: "60 gp",
    weight: "40 lb.",
    properties: "Riding equipment for unusual mounts",
    desc: "An exotic saddle is required for riding any aquatic or flying mount."
  },
  {
    name: "Saddlebags",
    category: "mount",
    cost: "4 gp",
    weight: "8 lb.",
    properties: "Holds 40 lb. / 4 cu. ft.",
    desc: "Bags attached to a saddle for carrying equipment."
  },
  {
    name: "Carriage",
    category: "mount",
    cost: "100 gp",
    weight: "600 lb.",
    properties: "Vehicle, pulled by 2 horses",
    desc: "An enclosed horse-drawn vehicle for passenger travel."
  },
  {
    name: "Cart",
    category: "mount",
    cost: "15 gp",
    weight: "200 lb.",
    properties: "Vehicle, pulled by 1 horse",
    desc: "A simple two-wheeled cart for hauling goods."
  },
  {
    name: "Wagon",
    category: "mount",
    cost: "35 gp",
    weight: "400 lb.",
    properties: "Vehicle, pulled by 2 horses",
    desc: "A four-wheeled open wagon for hauling goods."
  },
  {
    name: "Rowboat",
    category: "mount",
    cost: "50 gp",
    weight: "100 lb.",
    properties: "Vehicle (water), speed 1½ mph",
    desc: "A small watercraft propelled by oars."
  },

  // ──────────────────────────────────────────────
  //  MAGIC ITEMS
  // ──────────────────────────────────────────────
  {
    name: "Bag of Holding",
    category: "magic",
    cost: "-",
    weight: "15 lb.",
    properties: "Wondrous item, uncommon",
    desc: "This bag has an interior space considerably larger than its outside dimensions - roughly 2 feet in diameter at the mouth and 4 feet deep. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag weighs 15 pounds, regardless of its contents. Retrieving an item requires an action. If the bag is overloaded, pierced, or torn, it ruptures and is destroyed, and its contents are scattered in the Astral Plane. Placing a bag of holding inside an extradimensional space created by a Handy Haversack, Portable Hole, or similar item instantly destroys both items and opens a gate to the Astral Plane."
  },
  {
    name: "Cloak of Protection",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon (requires attunement)",
    desc: "You gain a +1 bonus to AC and saving throws while you wear this cloak."
  },
  {
    name: "Weapon, +1",
    category: "magic",
    cost: "-",
    weight: "Varies",
    properties: "Weapon (any), uncommon",
    desc: "You have a +1 bonus to attack and damage rolls made with this magic weapon."
  },
  {
    name: "Weapon, +2",
    category: "magic",
    cost: "-",
    weight: "Varies",
    properties: "Weapon (any), rare",
    desc: "You have a +2 bonus to attack and damage rolls made with this magic weapon."
  },
  {
    name: "Weapon, +3",
    category: "magic",
    cost: "-",
    weight: "Varies",
    properties: "Weapon (any), very rare",
    desc: "You have a +3 bonus to attack and damage rolls made with this magic weapon."
  },
  {
    name: "Armor, +1",
    category: "magic",
    cost: "-",
    weight: "Varies",
    properties: "Armor (any), rare",
    desc: "You have a +1 bonus to AC while wearing this armor."
  },
  {
    name: "Armor, +2",
    category: "magic",
    cost: "-",
    weight: "Varies",
    properties: "Armor (any), very rare",
    desc: "You have a +2 bonus to AC while wearing this armor."
  },
  {
    name: "Armor, +3",
    category: "magic",
    cost: "-",
    weight: "Varies",
    properties: "Armor (any), legendary",
    desc: "You have a +3 bonus to AC while wearing this armor."
  },
  {
    name: "Shield, +1",
    category: "magic",
    cost: "-",
    weight: "6 lb.",
    properties: "Armor (shield), uncommon",
    desc: "While holding this shield, you have a +1 bonus to AC in addition to the shield's normal bonus to AC."
  },
  {
    name: "Shield, +2",
    category: "magic",
    cost: "-",
    weight: "6 lb.",
    properties: "Armor (shield), rare",
    desc: "While holding this shield, you have a +2 bonus to AC in addition to the shield's normal bonus to AC."
  },
  {
    name: "Shield, +3",
    category: "magic",
    cost: "-",
    weight: "6 lb.",
    properties: "Armor (shield), very rare",
    desc: "While holding this shield, you have a +3 bonus to AC in addition to the shield's normal bonus to AC."
  },
  {
    name: "Amulet of Proof against Detection and Location",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon (requires attunement)",
    desc: "While wearing this amulet, you are hidden from divination magic. You can't be targeted by such magic or perceived through magical scrying sensors."
  },
  {
    name: "Boots of Elvenkind",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon",
    desc: "While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have advantage on Dexterity (Stealth) checks that rely on moving silently."
  },
  {
    name: "Boots of Speed",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, rare (requires attunement)",
    desc: "While you wear these boots, you can use a bonus action to click the boots' heels together. If you do, the boots double your walking speed, and any creature that makes an opportunity attack against you has disadvantage on the attack roll. The effect ends after 10 minutes or when you click your heels together again. The boots can be used in this way for up to 10 minutes, regaining all expended time after a long rest."
  },
  {
    name: "Boots of Striding and Springing",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon (requires attunement)",
    desc: "While you wear these boots, your walking speed becomes 30 feet, unless your walking speed is higher, and your speed isn't reduced if you are encumbered or wearing heavy armor. In addition, you can jump three times the normal distance, though you can't jump farther than your remaining movement would allow."
  },
  {
    name: "Bracers of Defense",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, rare (requires attunement)",
    desc: "While wearing these bracers, you gain a +2 bonus to AC if you are wearing no armor and using no shield."
  },
  {
    name: "Brooch of Shielding",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon (requires attunement)",
    desc: "While wearing this brooch, you have resistance to force damage, and you have immunity to damage from the magic missile spell."
  },
  {
    name: "Cape of the Mountebank",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, rare",
    desc: "This cape smells faintly of brimstone. While wearing it, you can use it to cast the dimension door spell as an action. This property of the cape can't be used again until the next dawn. When you disappear, you leave behind a cloud of smoke, and you appear in a similar cloud of smoke at your destination."
  },
  {
    name: "Cloak of Displacement",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, rare (requires attunement)",
    desc: "While you wear this cloak, it projects an illusion that makes you appear to be standing in a place near your actual location, causing any creature to have disadvantage on attack rolls against you. If you take damage, the property ceases to function until the start of your next turn. This property is suppressed while you are incapacitated, restrained, or otherwise unable to move."
  },
  {
    name: "Cloak of Elvenkind",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon (requires attunement)",
    desc: "While you wear this cloak with its hood up, Wisdom (Perception) checks made to see you have disadvantage, and you have advantage on Dexterity (Stealth) checks made to hide, as the cloak's color shifts to camouflage you. Pulling the hood up or down requires an action."
  },
  {
    name: "Cloak of the Bat",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, rare (requires attunement)",
    desc: "While wearing this cloak, you have advantage on Dexterity (Stealth) checks. In an area of dim light or darkness, you can grip the edges of the cloak with both hands and use it to fly at a speed of 40 feet. If you ever fail to grip the cloak's edges while flying in this way, or if you are no longer in dim light or darkness, you lose this flying speed. While wearing the cloak in an area of dim light or darkness, you can use your action to cast polymorph on yourself, transforming into a bat."
  },
  {
    name: "Decanter of Endless Water",
    category: "magic",
    cost: "-",
    weight: "2 lb.",
    properties: "Wondrous item, uncommon",
    desc: "This stoppered flask sloshes when shaken, as if it contains water. You can use an action to remove the stopper and speak one of three command words, whereupon an amount of fresh water or salt water pours out: Stream (1 gallon per round), Fountain (5 gallons per round), or Geyser (30 gallons per round, 30 ft. long, 1 ft. wide; DC 13 Strength check or take 1d4 bludgeoning damage and fall prone)."
  },
  {
    name: "Gauntlets of Ogre Power",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon (requires attunement)",
    desc: "Your Strength score is 19 while you wear these gauntlets. They have no effect on you if your Strength is already 19 or higher."
  },
  {
    name: "Goggles of Night",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon",
    desc: "While wearing these dark lenses, you have darkvision out to a range of 60 feet. If you already have darkvision, wearing the goggles increases its range by 60 feet."
  },
  {
    name: "Handy Haversack",
    category: "magic",
    cost: "-",
    weight: "5 lb.",
    properties: "Wondrous item, rare",
    desc: "This backpack has a central pouch and two side pouches, each of which is an extradimensional space. Each side pouch can hold up to 20 pounds (2 cubic feet). The central pouch can hold up to 80 pounds (8 cubic feet). The backpack always weighs 5 pounds. Retrieving an item from the haversack requires a bonus action rather than an action."
  },
  {
    name: "Headband of Intellect",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon (requires attunement)",
    desc: "Your Intelligence score is 19 while you wear this headband. It has no effect on you if your Intelligence is already 19 or higher."
  },
  {
    name: "Immovable Rod",
    category: "magic",
    cost: "-",
    weight: "2 lb.",
    properties: "Rod, uncommon",
    desc: "This flat iron rod has a button on one end. You can use an action to press the button, which causes the rod to become magically fixed in place. Until you or another creature uses an action to push the button again, the rod doesn't move, even if it is defying gravity. The rod can hold up to 8,000 pounds of weight. More weight causes the rod to deactivate and fall."
  },
  {
    name: "Lantern of Revealing",
    category: "magic",
    cost: "-",
    weight: "2 lb.",
    properties: "Wondrous item, uncommon",
    desc: "While lit, this hooded lantern burns for 6 hours on 1 pint of oil, shedding bright light in a 30-foot radius and dim light for an additional 30 feet. Invisible creatures and objects are visible as long as they are in the lantern's bright light."
  },
  {
    name: "Pearl of Power",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon (requires attunement by a spellcaster)",
    desc: "While this pearl is on your person, you can use an action to speak its command word and regain one expended spell slot. If the expended slot was of 4th level or higher, the new slot is 3rd level. Once you use the pearl, it can't be used again until the next dawn."
  },
  {
    name: "Periapt of Wound Closure",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon (requires attunement)",
    desc: "While you wear this pendant, you stabilize whenever you are dying at the start of your turn. In addition, whenever you roll a Hit Die to regain hit points, double the number of hit points it restores."
  },
  {
    name: "Portable Hole",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, rare",
    desc: "This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter. You can use an action to unfold and place it on a solid surface, whereupon it creates an extradimensional hole 10 feet deep. The cylindrical space exists on a different plane. Placing a portable hole inside an extradimensional space created by a bag of holding or similar item instantly destroys both items and opens a gate to the Astral Plane."
  },
  {
    name: "Ring of Protection",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Ring, rare (requires attunement)",
    desc: "You gain a +1 bonus to AC and saving throws while wearing this ring."
  },
  {
    name: "Ring of Resistance",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Ring, rare (requires attunement)",
    desc: "You have resistance to one damage type while wearing this ring. The gem in the ring indicates the type: Acid (pearl), Cold (tourmaline), Fire (garnet), Force (sapphire), Lightning (citrine), Necrotic (jet), Poison (amethyst), Psychic (jade), Radiant (topaz), Thunder (spinel)."
  },
  {
    name: "Rope of Climbing",
    category: "magic",
    cost: "-",
    weight: "3 lb.",
    properties: "Wondrous item, uncommon",
    desc: "This 60-foot length of silk rope weighs 3 pounds and can hold up to 3,000 pounds. If you hold one end of the rope and use an action to speak the command word, the rope animates. As a bonus action, you can command the other end to move toward a destination at a speed of 10 feet per round. The rope has AC 20, 20 hit points, and regains 1 hit point every 5 minutes."
  },
  {
    name: "Sending Stones",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon",
    desc: "Sending stones come in pairs, with each smooth stone carved to match the other so the pairing is easily recognized. While you touch one stone, you can use an action to cast the sending spell from it. The target is the bearer of the other stone. Once the sending spell is cast through the stones, they can't be used again until the next dawn."
  },
  {
    name: "Wand of Magic Missiles",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wand, uncommon",
    desc: "This wand has 7 charges. While holding it, you can use an action to expend 1 or more of its charges to cast the magic missile spell from it. For 1 charge, you cast the 1st-level version of the spell. You can increase the spell slot level by one for each additional charge you expend. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed."
  },
  {
    name: "Wand of Web",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wand, uncommon (requires attunement by a spellcaster)",
    desc: "This wand has 7 charges. While holding it, you can use an action to expend 1 of its charges to cast the web spell (save DC 15) from it. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll a d20. On a 1, the wand crumbles into ashes and is destroyed."
  },
  {
    name: "Eyes of the Eagle",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon (requires attunement)",
    desc: "These crystal lenses fit over the eyes. While wearing them, you have advantage on Wisdom (Perception) checks that rely on sight. In conditions of clear visibility, you can make out details of even extremely distant creatures and objects as small as 2 feet across."
  },
  {
    name: "Gloves of Missile Snaring",
    category: "magic",
    cost: "-",
    weight: "-",
    properties: "Wondrous item, uncommon (requires attunement)",
    desc: "These gloves seem to almost meld into your hands when you don them. When a ranged weapon attack hits you while you're wearing them, you can use your reaction to reduce the damage by 1d10 + your Dexterity modifier, provided that you have a free hand. If you reduce the damage to 0, you can catch the missile if it is small enough for you to hold in that hand."
  },
  {
    name: "Eversmoking Bottle",
    category: "magic",
    cost: "-",
    weight: "1 lb.",
    properties: "Wondrous item, uncommon",
    desc: "Smoke leaks from the lead-stoppered mouth of this brass bottle, which weighs 1 pound. When you use an action to remove the stopper, a cloud of thick smoke pours out in a 60-foot radius from the bottle. The cloud's area is heavily obscured. Each minute the bottle remains open, the radius increases by 10 feet until it reaches 120 feet. The cloud persists until the bottle is closed. Once closed, the cloud dissipates after 10 minutes."
  },
  {
    name: "Bag of Tricks",
    category: "magic",
    cost: "-",
    weight: "1/2 lb.",
    properties: "Wondrous item, uncommon",
    desc: "This ordinary bag, made from gray, rust, or tan cloth, appears empty. Reaching inside the bag reveals the presence of a small, fuzzy object. You can use an action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a random creature determined by the bag's color. The creature is friendly to you and your companions, vanishes at the next dawn, and acts on your turn."
  }
];
