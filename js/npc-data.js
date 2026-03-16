// =============================================
//   npc-data.js — NPC Generator Data Tables
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

// Human appears multiple times so it rolls more often — reflects real D&D demographics
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
  'Gruff and blunt — says exactly what\'s on their mind',
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
  'Never makes direct eye contact — looks just past your shoulder',
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
  'Finishes everyone\'s sentences — usually wrongly',
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
  'On the run from someone — or something — that wants them dead',
  'Deeply devoted to their faith and seeking to spread it',
  'Just wants to be left alone and live a quiet life',
  'Consumed by envy of someone more successful',
  'Trying to prove themselves after a great public failure',
  'In love with someone who doesn\'t know they exist',
  'Slowly going mad from something they witnessed',
  'Collecting information to sell to the highest bidder',
  'Hoping to gain enough status to move up in society'
];