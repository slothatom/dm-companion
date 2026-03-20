// =============================================
//   glossary-data.js — D&D 5e Glossary of Terms
// =============================================

var GLOSSARY = [
  {
    term: "Ability Check",
    category: "ability",
    def: "A d20 roll + relevant ability modifier, made to determine whether a character succeeds at a task. The DM sets a DC (Difficulty Class) that the roll must meet or exceed."
  },
  {
    term: "Ability Score",
    category: "ability",
    def: "One of six attributes (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma) that define a creature's physical and mental characteristics, each rated on a scale typically from 1 to 20 for player characters."
  },
  {
    term: "AC (Armor Class)",
    category: "combat",
    def: "A number that represents how hard a creature is to hit with an attack. An attack roll must meet or exceed the target's AC to hit. AC is determined by armor worn, Dexterity modifier, shields, and other effects."
  },
  {
    term: "Action",
    category: "combat",
    def: "The main thing you do on your turn in combat. Common actions include Attack, Cast a Spell, Dash, Disengage, Dodge, Help, Hide, Ready, Search, and Use an Object."
  },
  {
    term: "Advantage",
    category: "general",
    def: "When you have advantage on a roll, you roll two d20s and use the higher result. Advantage can come from spells, class features, or favorable circumstances. Advantage and disadvantage cancel each other out."
  },
  {
    term: "Alignment",
    category: "general",
    def: "A combination of two factors: morality (good, evil, or neutral) and attitude toward society and order (lawful, chaotic, or neutral). The nine alignments define a creature's broad moral and personal attitudes."
  },
  {
    term: "Area of Effect",
    category: "magic",
    def: "A spell or ability that covers an area rather than targeting a single creature. Common shapes include cone, cube, cylinder, line, and sphere, each with specific rules for determining which creatures are affected."
  },
  {
    term: "Attack of Opportunity",
    category: "combat",
    def: "A special reaction triggered when a hostile creature that you can see moves out of your reach. You can use your reaction to make one melee attack against the provoking creature. Also called an opportunity attack."
  },
  {
    term: "Attack Roll",
    category: "combat",
    def: "A d20 roll + relevant ability modifier + proficiency bonus (if proficient) made to determine if an attack hits. The roll must meet or exceed the target's AC. A natural 20 always hits; a natural 1 always misses."
  },
  {
    term: "Blinded",
    category: "condition",
    def: "A blinded creature can't see and automatically fails any ability check that requires sight. Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage."
  },
  {
    term: "Bonus Action",
    category: "combat",
    def: "An additional action available on your turn only when a class feature, spell, or other ability specifically grants one. You can take only one bonus action per turn, and only on your own turn."
  },
  {
    term: "Cantrip",
    category: "magic",
    def: "A spell that can be cast at will, without using a spell slot and without being prepared. Repeated practice has fixed the spell in the caster's mind. Cantrips often scale in power as the caster gains levels."
  },
  {
    term: "Casting Time",
    category: "magic",
    def: "The amount of time required to cast a spell. Most spells require one action, but some need a bonus action, reaction, or longer (1 minute, 10 minutes, 1 hour, etc.)."
  },
  {
    term: "Challenge Rating (CR)",
    category: "general",
    def: "A rating that indicates how dangerous a monster is. A monster with a CR equal to the party's level is a fair challenge for a group of four adventurers. CR 0 creatures are insignificant, while CR 30 creatures are godlike threats."
  },
  {
    term: "Channel Divinity",
    category: "magic",
    def: "A class feature available to clerics and paladins that allows them to channel divine energy to fuel magical effects. The specific effects depend on the character's class and subclass. Uses are regained after a short or long rest."
  },
  {
    term: "Charmed",
    category: "condition",
    def: "A charmed creature can't attack the charmer or target the charmer with harmful abilities or magical effects. The charmer has advantage on any ability check to interact socially with the creature."
  },
  {
    term: "Charisma",
    category: "ability",
    def: "The ability score measuring force of personality, persuasiveness, personal magnetism, and leadership ability. Charisma is the spellcasting ability for bards, paladins, sorcerers, and warlocks."
  },
  {
    term: "Class",
    category: "general",
    def: "A character's primary adventuring vocation, such as Fighter, Wizard, or Rogue. Class determines hit dice, proficiencies, and the features a character gains as they level up."
  },
  {
    term: "Components",
    category: "magic",
    def: "The physical requirements for casting a spell: Verbal (V) requires spoken words, Somatic (S) requires hand gestures, and Material (M) requires specific physical substances or objects, sometimes consumed by the spell."
  },
  {
    term: "Concentration",
    category: "magic",
    def: "Some spells require you to maintain concentration to keep their effects active. Taking damage forces a Constitution saving throw (DC 10 or half the damage taken, whichever is higher) to maintain concentration. You can only concentrate on one spell at a time."
  },
  {
    term: "Constitution",
    category: "ability",
    def: "The ability score measuring health, stamina, and vital force. Constitution affects hit points (HP modifier added per level), and is important for maintaining concentration on spells."
  },
  {
    term: "Cover",
    category: "combat",
    def: "Obstacles that provide protection during combat. Half cover grants +2 AC and Dex saves; three-quarters cover grants +5 AC and Dex saves; total cover means you can't be targeted directly by attacks or spells."
  },
  {
    term: "Critical Hit",
    category: "combat",
    def: "When you roll a natural 20 on an attack roll, you score a critical hit. You roll all of the attack's damage dice twice and add them together, then add any relevant modifiers. A critical hit always hits regardless of AC."
  },
  {
    term: "Damage Resistance",
    category: "combat",
    def: "When a creature has resistance to a damage type, damage of that type is halved against it. Multiple instances of resistance do not stack — you either have resistance or you don't."
  },
  {
    term: "Damage Type",
    category: "combat",
    def: "The kind of damage dealt by an attack or spell. The types are: acid, bludgeoning, cold, fire, force, lightning, necrotic, piercing, poison, psychic, radiant, slashing, and thunder."
  },
  {
    term: "Darkvision",
    category: "ability",
    def: "The ability to see in dim light within a specified range as if it were bright light, and in darkness as if it were dim light. You can't discern color in darkness, only shades of gray."
  },
  {
    term: "DC (Difficulty Class)",
    category: "general",
    def: "The target number for an ability check or saving throw. To succeed, a d20 roll + modifiers must meet or exceed the DC. Typical DCs range from 5 (very easy) to 30 (nearly impossible)."
  },
  {
    term: "Deafened",
    category: "condition",
    def: "A deafened creature can't hear and automatically fails any ability check that requires hearing."
  },
  {
    term: "Death Saving Throw",
    category: "combat",
    def: "A special saving throw made when a character starts their turn at 0 HP. Roll a d20: 10 or higher is a success, below 10 is a failure. Three successes stabilize you; three failures mean death. A natural 20 restores 1 HP; a natural 1 counts as two failures."
  },
  {
    term: "Dexterity",
    category: "ability",
    def: "The ability score measuring agility, reflexes, and balance. Dexterity affects AC (when wearing light or no armor), initiative, and is the spellcasting ability for some features. Used for ranged attacks and finesse weapons."
  },
  {
    term: "Disadvantage",
    category: "general",
    def: "When you have disadvantage on a roll, you roll two d20s and use the lower result. Disadvantage can come from spells, conditions, or unfavorable circumstances. Advantage and disadvantage cancel each other out."
  },
  {
    term: "Exhaustion",
    category: "condition",
    def: "A condition with six cumulative levels. Level 1: disadvantage on ability checks. Level 2: speed halved. Level 3: disadvantage on attack rolls and saving throws. Level 4: HP maximum halved. Level 5: speed reduced to 0. Level 6: death."
  },
  {
    term: "Expertise",
    category: "ability",
    def: "A feature that lets you double your proficiency bonus for certain skill checks or tool checks. Available to rogues and bards at specific levels, and through certain feats."
  },
  {
    term: "Frightened",
    category: "condition",
    def: "A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight. The creature can't willingly move closer to the source of its fear."
  },
  {
    term: "Grappled",
    category: "condition",
    def: "A grappled creature's speed becomes 0, and it can't benefit from any bonus to its speed. The condition ends if the grappler is incapacitated or if an effect removes the grappled creature from the grappler's reach."
  },
  {
    term: "Hit Dice",
    category: "general",
    def: "Dice used to determine a character's hit points. Each class has a specific hit die (e.g., d10 for fighters, d6 for wizards). Characters can also spend hit dice during a short rest to recover hit points."
  },
  {
    term: "Hit Points (HP)",
    category: "combat",
    def: "A numerical representation of a creature's vitality. When HP drops to 0, the creature falls unconscious or dies. HP is determined by hit dice, Constitution modifier, and various class features or magical effects."
  },
  {
    term: "Incapacitated",
    category: "condition",
    def: "An incapacitated creature can't take actions or reactions."
  },
  {
    term: "Initiative",
    category: "combat",
    def: "A Dexterity check made at the start of combat to determine the order of turns. Higher initiative goes first. Each creature rolls once per combat encounter."
  },
  {
    term: "Inspiration",
    category: "general",
    def: "A reward granted by the DM for good roleplaying, clever thinking, or simply making the game more enjoyable. A player with inspiration can spend it to gain advantage on one attack roll, ability check, or saving throw."
  },
  {
    term: "Intelligence",
    category: "ability",
    def: "The ability score measuring mental acuity, accuracy of recall, and the ability to reason. Intelligence is the spellcasting ability for wizards, artificers, and some subclasses."
  },
  {
    term: "Invisible",
    category: "condition",
    def: "An invisible creature is impossible to see without the aid of magic or a special sense. The creature's location can be detected by noise or tracks. Attack rolls against it have disadvantage, and its attack rolls have advantage."
  },
  {
    term: "Level",
    category: "general",
    def: "A measure of a character's power and experience, ranging from 1 to 20. As characters gain experience points (XP), they advance in level, unlocking new class features, higher proficiency bonuses, and more powerful abilities."
  },
  {
    term: "Long Rest",
    category: "general",
    def: "A period of extended downtime, at least 8 hours long, during which a character sleeps or performs light activity. After a long rest, a character regains all lost hit points, regains spent hit dice (up to half their total), and regains all spell slots and most class features."
  },
  {
    term: "Melee Attack",
    category: "combat",
    def: "An attack made against a target within your reach (usually 5 feet). Melee weapon attacks use Strength modifier by default, or Dexterity for finesse weapons. Melee spell attacks use the caster's spellcasting ability modifier."
  },
  {
    term: "Multiclass",
    category: "general",
    def: "The option to gain levels in more than one class. Multiclassing requires meeting ability score prerequisites for both your current and new class. You gain some (but not all) proficiencies of the new class."
  },
  {
    term: "Opportunity Attack",
    category: "combat",
    def: "A reaction you can take when a hostile creature you can see moves out of your reach. You make a single melee attack against the creature. Taking the Disengage action prevents provoking opportunity attacks."
  },
  {
    term: "Paralyzed",
    category: "condition",
    def: "A paralyzed creature is incapacitated and can't move or speak. It automatically fails Strength and Dexterity saving throws. Attack rolls against it have advantage, and any attack that hits from within 5 feet is a critical hit."
  },
  {
    term: "Passive Perception",
    category: "ability",
    def: "A score representing a character's general awareness without actively searching. Calculated as 10 + Wisdom (Perception) modifier + any relevant bonuses. Used by the DM to determine if characters notice hidden threats."
  },
  {
    term: "Petrified",
    category: "condition",
    def: "A petrified creature is transformed, along with any nonmagical objects it is wearing or carrying, into a solid inanimate substance (usually stone). It is incapacitated, can't move or speak, and has resistance to all damage."
  },
  {
    term: "Poisoned",
    category: "condition",
    def: "A poisoned creature has disadvantage on attack rolls and ability checks."
  },
  {
    term: "Proficiency Bonus",
    category: "general",
    def: "A bonus added to rolls for things your character is proficient in, including attack rolls with proficient weapons, ability checks with proficient skills/tools, saving throw proficiencies, and spell attack rolls. Starts at +2 at level 1 and increases to +6 at level 17."
  },
  {
    term: "Prone",
    category: "condition",
    def: "A prone creature's only movement option is to crawl (costing extra movement) unless it stands up. It has disadvantage on attack rolls. Attacks against it have advantage if within 5 feet, or disadvantage if farther away."
  },
  {
    term: "Ranged Attack",
    category: "combat",
    def: "An attack made against a target at a distance. Ranged weapon attacks use Dexterity modifier. Making a ranged attack while a hostile creature is within 5 feet imposes disadvantage. Ranged weapons have normal and long range."
  },
  {
    term: "Reaction",
    category: "combat",
    def: "An instant response to a trigger, taken on someone else's turn or on your own. You get one reaction per round, which resets at the start of your turn. Common reactions include opportunity attacks and the Shield spell."
  },
  {
    term: "Resistance",
    category: "combat",
    def: "When a creature has resistance to a damage type, damage of that type is halved against it (rounded down). Resistance does not stack with itself."
  },
  {
    term: "Restrained",
    category: "condition",
    def: "A restrained creature's speed becomes 0 and it can't benefit from any bonus to speed. Attack rolls against it have advantage, and its attack rolls have disadvantage. It has disadvantage on Dexterity saving throws."
  },
  {
    term: "Ritual",
    category: "magic",
    def: "A spell with the ritual tag can be cast as a ritual, taking 10 extra minutes but not expending a spell slot. Not all casters can ritual cast — it depends on class features."
  },
  {
    term: "Round",
    category: "combat",
    def: "A cycle of combat in which every participant takes a turn. A round represents about 6 seconds of in-game time. Each creature gets one turn per round, acting in initiative order."
  },
  {
    term: "Saving Throw",
    category: "general",
    def: "A d20 roll + ability modifier + proficiency bonus (if proficient) made to resist a spell, trap, poison, disease, or similar threat. The DC is set by the effect causing the save. Each class grants proficiency in two saving throw types."
  },
  {
    term: "Short Rest",
    category: "general",
    def: "A period of downtime, at least 1 hour long, during which a character does nothing more strenuous than eating, drinking, reading, and tending to wounds. Characters can spend hit dice to recover hit points during a short rest."
  },
  {
    term: "Skill Check",
    category: "ability",
    def: "An ability check that uses one of the 18 skills (e.g., Stealth, Persuasion, Athletics). If proficient in the skill, you add your proficiency bonus. The associated ability score determines the modifier."
  },
  {
    term: "Spell Attack",
    category: "magic",
    def: "An attack roll made when casting a spell that requires one. Roll d20 + spellcasting ability modifier + proficiency bonus. Spell attacks can be melee or ranged, and follow the same hit/miss rules as weapon attacks."
  },
  {
    term: "Spell Save DC",
    category: "magic",
    def: "The Difficulty Class for saving throws against your spells. Calculated as 8 + proficiency bonus + spellcasting ability modifier. Targets must meet or exceed this number to resist the spell's effects."
  },
  {
    term: "Spell Slot",
    category: "magic",
    def: "A resource expended to cast a spell of 1st level or higher. Each slot has a level; you can use a higher-level slot to cast a lower-level spell, sometimes with enhanced effects (upcasting). Slots are regained after a long rest (or short rest for warlocks)."
  },
  {
    term: "Strength",
    category: "ability",
    def: "The ability score measuring physical power, athletic training, and raw force. Strength determines melee attack and damage rolls (for non-finesse weapons), carrying capacity, and is used for Athletics checks."
  },
  {
    term: "Stunned",
    category: "condition",
    def: "A stunned creature is incapacitated, can't move, and can speak only falteringly. It automatically fails Strength and Dexterity saving throws. Attack rolls against it have advantage."
  },
  {
    term: "Surprise",
    category: "combat",
    def: "When a combat encounter begins and one side is unaware of the other, surprised creatures can't move or take actions on their first turn and can't take reactions until that turn ends. The DM determines who is surprised."
  },
  {
    term: "Temporary Hit Points",
    category: "combat",
    def: "A buffer of extra HP granted by spells or abilities. Temporary HP is lost before regular HP. They don't stack — you choose the higher value. They can't be healed and disappear after a long rest unless otherwise specified."
  },
  {
    term: "Unarmed Strike",
    category: "combat",
    def: "A melee attack made with your body (punch, kick, headbutt, etc.). Deals 1 + Strength modifier bludgeoning damage. Monks and certain class features can enhance unarmed strikes significantly."
  },
  {
    term: "Unconscious",
    category: "condition",
    def: "An unconscious creature is incapacitated, can't move or speak, and is unaware of its surroundings. It drops whatever it's holding and falls prone. Attack rolls against it have advantage, and any hit from within 5 feet is a critical hit."
  },
  {
    term: "Vulnerability",
    category: "combat",
    def: "When a creature has vulnerability to a damage type, damage of that type is doubled against it. Vulnerability is relatively rare and represents a severe weakness to a specific form of harm."
  },
  {
    term: "Wisdom",
    category: "ability",
    def: "The ability score measuring awareness, intuition, and insight. Wisdom is the spellcasting ability for clerics, druids, and rangers. It governs Perception, Insight, Survival, Medicine, and Animal Handling checks."
  }
];
