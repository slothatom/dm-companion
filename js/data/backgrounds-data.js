// =============================================
//   backgrounds-data.js — D&D 5e SRD Backgrounds
// =============================================

var BACKGROUNDS = [
  {
    name: "Acolyte",
    skillProf: "Insight, Religion",
    toolProf: "None",
    languages: "Two of your choice",
    equipment: "A holy symbol, a prayer book or prayer wheel, 5 sticks of incense, vestments, a set of common clothes, and a pouch containing 15 gp",
    feature: "Shelter of the Faithful",
    featureDesc: "As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity. You and your adventuring companions can expect to receive free healing and care at a temple, shrine, or other established presence of your faith, though you must provide any material components needed for spells. Those who share your religion will support you (but only you) at a modest lifestyle.",
    personality: "I idolize a particular hero of my faith, and constantly refer to that person's deeds and example. I can find common ground between the fiercest enemies, empathizing with them and always working toward peace.",
    desc: "You have spent your life in the service of a temple to a specific god or pantheon of gods. You act as an intermediary between the realm of the holy and the mortal world, performing sacred rites and offering sacrifices in order to conduct worshippers into the presence of the divine."
  },
  {
    name: "Charlatan",
    skillProf: "Deception, Sleight of Hand",
    toolProf: "Disguise kit, Forgery kit",
    languages: "None",
    equipment: "A set of fine clothes, a disguise kit, tools of the con of your choice (ten stoppered bottles filled with colored liquid, a set of weighted dice, a deck of marked cards, or a signet ring of an imaginary duke), and a pouch containing 15 gp",
    feature: "False Identity",
    featureDesc: "You have created a second identity that includes documentation, established acquaintances, and disguises that allow you to assume that persona. Additionally, you can forge documents including official papers and personal letters, as long as you have seen an example of the kind of document or the handwriting you are trying to copy.",
    personality: "I fall in and out of love easily, and am always pursuing someone. I have a joke for every occasion, especially occasions where humor is inappropriate. Flattery is my preferred trick for getting what I want.",
    desc: "You have always had a way with people. You know what makes them tick, you can tease out their hearts' desires after a few minutes of conversation, and with a few leading questions you can read them like they were children's books."
  },
  {
    name: "Criminal",
    skillProf: "Deception, Stealth",
    toolProf: "One type of gaming set, Thieves' tools",
    languages: "None",
    equipment: "A crowbar, a set of dark common clothes including a hood, and a pouch containing 15 gp",
    feature: "Criminal Contact",
    featureDesc: "You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances; specifically, you know the local messengers, corrupt caravan masters, and seedy sailors who can deliver messages for you.",
    personality: "I always have a plan for what to do when things go wrong. I am always calm, no matter what the situation. I never raise my voice or let my emotions control me.",
    desc: "You are an experienced criminal with a history of breaking the law. You have spent a lot of time among other criminals and still have contacts within the criminal underworld."
  },
  {
    name: "Entertainer",
    skillProf: "Acrobatics, Performance",
    toolProf: "Disguise kit, One type of musical instrument",
    languages: "None",
    equipment: "A musical instrument (one of your choice), the favor of an admirer (love letter, lock of hair, or trinket), a costume, and a pouch containing 15 gp",
    feature: "By Popular Demand",
    featureDesc: "You can always find a place to perform, usually in an inn or tavern but possibly with a circus, at a theater, or even in a noble's court. At such a place, you receive free lodging and food of a modest or comfortable standard (depending on the quality of the establishment), as long as you perform each night. Your performance also makes you something of a local figure.",
    personality: "I know a story relevant to almost every situation. Whenever I come to a new place, I collect local rumors and spread gossip. I love a good insult, even one directed at me.",
    desc: "You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them. Your poetics can stir the hearts of those who hear you, awakening grief or joy, laughter or anger."
  },
  {
    name: "Folk Hero",
    skillProf: "Animal Handling, Survival",
    toolProf: "One type of artisan's tools, Vehicles (land)",
    languages: "None",
    equipment: "A set of artisan's tools (one of your choice), a shovel, an iron pot, a set of common clothes, and a pouch containing 10 gp",
    feature: "Rustic Hospitality",
    featureDesc: "Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners, unless you have shown yourself to be a danger to them. They will shield you from the law or anyone else searching for you, though they will not risk their lives for you.",
    personality: "I judge people by their actions, not their words. If someone is in trouble, I'm always ready to lend help. When I set my mind to something, I follow through no matter what gets in my way.",
    desc: "You come from a humble social rank, but you are destined for so much more. Already the people of your home village regard you as their champion, and your destiny calls you to stand against the tyrants and monsters that threaten the common folk everywhere."
  },
  {
    name: "Guild Artisan",
    skillProf: "Insight, Persuasion",
    toolProf: "One type of artisan's tools",
    languages: "One of your choice",
    equipment: "A set of artisan's tools (one of your choice), a letter of introduction from your guild, a set of traveler's clothes, and a pouch containing 15 gp",
    feature: "Guild Membership",
    featureDesc: "As an established and respected member of a guild, you can rely on certain benefits that membership provides. Your fellow guild members will provide you with lodging and food if necessary, and pay for your funeral if needed. In some cities and towns, a guildhall offers a central place to meet other members of your profession, which can be a good place to meet potential patrons, allies, or hirelings.",
    personality: "I always want to know how things work and what makes people tick. I'm full of witty aphorisms and have a proverb for every occasion. I'm well known for my work, and I want to make sure everyone appreciates it.",
    desc: "You are a member of an artisan's guild, skilled in a particular field and closely associated with other artisans. You are a well-established part of the mercantile world, freed by talent and wealth from the constraints of a feudal social order."
  },
  {
    name: "Hermit",
    skillProf: "Medicine, Religion",
    toolProf: "Herbalism kit",
    languages: "One of your choice",
    equipment: "A scroll case stuffed full of notes from your studies or prayers, a winter blanket, a set of common clothes, an herbalism kit, and 5 gp",
    feature: "Discovery",
    featureDesc: "The quiet seclusion of your extended hermitage gave you access to a unique and powerful discovery. The exact nature of this revelation depends on the nature of your seclusion. It might be a great truth about the cosmos, the deities, the powerful beings of the outer planes, or the forces of nature. It could be a site that no one else has ever seen.",
    personality: "I've been isolated for so long that I rarely speak, preferring gestures and the occasional grunt. I connect everything that happens to me to a grand, cosmic plan. I feel tremendous empathy for all who suffer.",
    desc: "You lived in seclusion — either in a sheltered community such as a monastery, or entirely alone — for a formative period of your life. In your time apart from the clamor of society, you found quiet, solitude, and perhaps some of the answers you were looking for."
  },
  {
    name: "Noble",
    skillProf: "History, Persuasion",
    toolProf: "One type of gaming set",
    languages: "One of your choice",
    equipment: "A set of fine clothes, a signet ring, a scroll of pedigree, and a purse containing 25 gp",
    feature: "Position of Privilege",
    featureDesc: "Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. The common folk make every effort to accommodate you and avoid your displeasure, and other people of high birth treat you as a member of the same social sphere.",
    personality: "My eloquent flattery makes everyone I talk to feel like the most wonderful and important person in the world. Despite my noble birth, I do not place myself above other folk. We all have the same blood.",
    desc: "You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields significant political influence. You might be a pampered aristocrat unfamiliar with work or discomfort, or a former merchant just elevated to the nobility."
  },
  {
    name: "Outlander",
    skillProf: "Athletics, Survival",
    toolProf: "One type of musical instrument",
    languages: "One of your choice",
    equipment: "A staff, a hunting trap, a trophy from an animal you killed, a set of traveler's clothes, and a pouch containing 10 gp",
    feature: "Wanderer",
    featureDesc: "You have an excellent memory for maps and geography, and you can always recall the general layout of terrain, settlements, and other features around you. In addition, you can find food and fresh water for yourself and up to five other people each day, provided that the land offers berries, small game, water, and so forth.",
    personality: "I'm driven by a wanderlust that led me away from home. I watch over my friends as if they were a litter of newborn pups. I was, in fact, raised by wolves.",
    desc: "You grew up in the wilds, far from civilization and the comforts of town and technology. You've witnessed the migration of herds larger than forests, survived weather more extreme than any city-dweller could comprehend, and enjoyed the solitude of being the only thinking creature for miles in any direction."
  },
  {
    name: "Sage",
    skillProf: "Arcana, History",
    toolProf: "None",
    languages: "Two of your choice",
    equipment: "A bottle of black ink, a quill, a small knife, a letter from a dead colleague posing a question you have not yet been able to answer, a set of common clothes, and a pouch containing 10 gp",
    feature: "Researcher",
    featureDesc: "When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it. Usually, this information comes from a library, scriptorium, university, or a sage or other learned person or creature. Your DM might rule that the knowledge you seek is secreted away in an almost inaccessible place, or that it simply cannot be found.",
    personality: "I use polysyllabic words that convey the impression of great erudition. I've read every book in the world's greatest libraries — or I like to boast that I have. There's nothing I like more than a good mystery.",
    desc: "You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts on the subjects that interest you. Your efforts have made you a master in your fields of study."
  },
  {
    name: "Sailor",
    skillProf: "Athletics, Perception",
    toolProf: "Navigator's tools, Vehicles (water)",
    languages: "None",
    equipment: "A belaying pin (club), 50 feet of silk rope, a lucky charm such as a rabbit foot or a small stone with a hole in the center, a set of common clothes, and a pouch containing 10 gp",
    feature: "Ship's Passage",
    featureDesc: "When you need to, you can secure free passage on a sailing ship for yourself and your adventuring companions. You might sail on the ship you served on, or another ship you have good relations with (perhaps one captained by a former crewmate). Because you're calling in a favor, you can't be certain of a schedule or route that will meet your every need.",
    personality: "My friends know they can rely on me, no matter what. I work hard so that I can play hard when the work is done. I stretch the truth for the sake of a good story.",
    desc: "You sailed on a seagoing vessel for years. In that time, you faced down mighty storms, monsters of the deep, and those who wanted to sink your craft to the bottomless depths. Your first love is the distant line of the horizon, but the time has come to try your hand at something new."
  },
  {
    name: "Soldier",
    skillProf: "Athletics, Intimidation",
    toolProf: "One type of gaming set, Vehicles (land)",
    languages: "None",
    equipment: "An insignia of rank, a trophy taken from a fallen enemy (a dagger, broken blade, or piece of a banner), a set of bone dice or deck of cards, a set of common clothes, and a pouch containing 10 gp",
    feature: "Military Rank",
    featureDesc: "You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence, and they defer to you if they are of a lower rank. You can invoke your rank to exert influence over other soldiers and requisition simple equipment or horses for temporary use.",
    personality: "I can stare down a hell hound without flinching. I enjoy being strong and like breaking things. I have a crude sense of humor. I face problems head-on. A simple, direct solution is the best path to success.",
    desc: "War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, learned basic survival techniques, including how to stay alive on the battlefield."
  },
  {
    name: "Urchin",
    skillProf: "Sleight of Hand, Stealth",
    toolProf: "Disguise kit, Thieves' tools",
    languages: "None",
    equipment: "A small knife, a map of the city you grew up in, a pet mouse, a token to remember your parents by, a set of common clothes, and a pouch containing 10 gp",
    feature: "City Secrets",
    featureDesc: "You know the secret patterns and flow to cities and can find passages through the urban sprawl that others would miss. When you are not in combat, you (and companions you lead) can travel between any two locations in the city twice as fast as your speed would normally allow.",
    personality: "I hide scraps of food and trinkets away in my pockets. I ask a lot of questions. I bluntly say what other people are hinting at or hiding. No one else is going to have to endure the hardships I've been through.",
    desc: "You grew up on the streets alone, orphaned, and poor. You had no one to watch over you or to provide for you, so you learned to provide for yourself. You fought fiercely over food and kept a constant watch out for other desperate souls who might steal from you."
  }
];
