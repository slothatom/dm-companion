// =============================================
//   tavern-generator.js - Tavern Generator
// =============================================

(async function () {
  var user = await requireAuth();
  if (!user) return;
  renderNav(user);
})();

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rollDice(n, s) { var t = 0; for (var i = 0; i < n; i++) t += Math.floor(Math.random() * s) + 1; return t; }
function coinStr(cp) {
  if (cp >= 100) return (cp / 100) + ' gp';
  if (cp >= 10) return (cp / 10) + ' sp';
  return cp + ' cp';
}

// ── Name Parts ──────────────────────────────────────────

var NAME_ADJ = ['Golden', 'Silver', 'Rusty', 'Jolly', 'Crimson', 'Drunken', 'Prancing', 'Dancing', 'Wandering', 'Lucky', 'Broken', 'Sleeping', 'Howling', 'Laughing', 'Roaring', 'Weary', 'Merry', 'Salty', 'Leaky', 'Gilded', 'Crooked', 'Dusty', 'Shady', 'Hidden', 'Blind', 'Singing', 'Winking', 'Stumbling', 'Thirsty', 'Wild'];
var NAME_NOUN = ['Dragon', 'Griffin', 'Stag', 'Boar', 'Goblin', 'Barrel', 'Tankard', 'Flagon', 'Helm', 'Sword', 'Shield', 'Crown', 'Raven', 'Wolf', 'Bear', 'Fox', 'Owl', 'Hound', 'Pony', 'Goat', 'Troll', 'Serpent', 'Eagle', 'Unicorn', 'Phoenix', 'Minotaur', 'Maiden', 'Knight', 'Pilgrim', 'Sailor'];
var NAME_TEMPLATE = [
  function(a, n) { return 'The ' + a + ' ' + n; },
  function(a, n) { return 'The ' + n + '\'s ' + pick(['Rest', 'Respite', 'Refuge', 'Retreat', 'Haven', 'Den', 'Lair']); },
  function(a, n) { return 'The ' + n + ' & ' + pick(NAME_NOUN); },
  function(a, n) { return 'The ' + a + ' ' + pick(['Flagon', 'Tankard', 'Barrel', 'Chalice', 'Cup', 'Mug']); },
  function(a, n) { return pick(['Ye Olde', 'The Old', 'The Last', 'The First']) + ' ' + n; },
];

// ── Atmosphere ──────────────────────────────────────────

var ATMOSPHERE = {
  squalid:      ['Filthy straw on the floor, rats scurry in corners', 'Thick smoke, sticky tables, a persistent smell of mildew', 'Cracked walls, broken furniture, dim candlelight', 'Puddles of something on the floor, a dog gnawing a bone under a table'],
  poor:         ['Worn wooden benches, a fire that gives more smoke than heat', 'Drafty room with a low ceiling, tallow candles dripping wax', 'Crowded and noisy, sawdust on the floor', 'Dim and smoky, the barkeep eyes newcomers suspiciously'],
  modest:       ['Warm hearth, simple but clean tables, the smell of fresh bread', 'A lively common room with a bard playing in the corner', 'Sturdy oak furniture, a crackling fire, and the hum of conversation', 'Lanterns hanging from beams, a mounted stag head above the bar'],
  comfortable:  ['Polished wood, cushioned chairs, candles on every table', 'A grand fireplace, tapestries on the walls, pleasant aromas from the kitchen', 'Well-lit and warm, with separate booths for private conversation', 'A balcony level with a view of the common room below'],
  wealthy:      ['Crystal chandeliers, velvet curtains, live music from a small ensemble', 'Marble floors, gilded sconces, each table has fresh flowers', 'Private dining alcoves with embroidered cushions and silver tableware', 'A sommelier greets guests, wine racks line the walls'],
  aristocratic: ['Gold leaf accents, enchanted floating candles, magical climate control', 'Rare wood paneling, paintings by famous artists, a magical harp plays itself', 'Each seat is upholstered in silk, the menu is written in calligraphy on vellum', 'An illusory ceiling shows the night sky, exotic plants line the entrance']
};

// ── Innkeeper ───────────────────────────────────────────

var KEEPER_RACE = ['Human', 'Human', 'Human', 'Dwarf', 'Halfling', 'Halfling', 'Half-Elf', 'Elf', 'Gnome', 'Tiefling', 'Half-Orc', 'Dragonborn'];
var KEEPER_TRAIT = ['boisterous and welcoming', 'quiet and watchful', 'tells long-winded stories', 'suspiciously friendly', 'gruff but fair', 'motherly and fussing', 'scarred former adventurer', 'whistles while working', 'always polishing a glass', 'remembers every regular\'s name', 'haggling over every copper', 'hums old war songs', 'covered in flour from the kitchen', 'one arm, but twice as fast', 'retired soldier', 'talks to a pet raven on the bar', 'flips coins constantly', 'keeps a loaded crossbow behind the bar'];
var KEEPER_FIRST = ['Bram', 'Marta', 'Gundren', 'Elara', 'Theron', 'Hilda', 'Pip', 'Yennefer', 'Dorian', 'Rosie', 'Krag', 'Syla', 'Torvin', 'Nella', 'Garrick', 'Fern', 'Oleg', 'Brynn', 'Cedric', 'Tala', 'Morwen', 'Jolly', 'Grisha', 'Dara'];

// ── Food ────────────────────────────────────────────────

var FOOD = {
  squalid: [
    { name: 'Mystery meat stew', price: 1, desc: 'Thin broth with unidentifiable chunks' },
    { name: 'Stale bread and drippings', price: 1, desc: 'Hard crust with leftover fat' },
    { name: 'Boiled turnips', price: 1, desc: 'Overcooked and bland' },
    { name: 'Rat-on-a-stick', price: 2, desc: 'Charred and crunchy, don\'t ask questions' },
    { name: 'Porridge (cold)', price: 1, desc: 'Lumpy, grey, served in a cracked bowl' },
  ],
  poor: [
    { name: 'Pottage with bread', price: 2, desc: 'Thick vegetable soup with a hunk of brown bread' },
    { name: 'Mutton stew', price: 3, desc: 'Salty, fatty, filling' },
    { name: 'Fried fish', price: 3, desc: 'River fish, pan-fried with onions' },
    { name: 'Cabbage and sausage', price: 2, desc: 'Boiled cabbage with a spiced sausage' },
    { name: 'Bean soup', price: 2, desc: 'Simple and hearty' },
    { name: 'Meat pie', price: 4, desc: 'Flaky crust, pork and potato filling' },
  ],
  modest: [
    { name: 'Roast chicken', price: 5, desc: 'Half a chicken roasted with herbs' },
    { name: 'Shepherd\'s pie', price: 4, desc: 'Savory meat topped with mashed potato' },
    { name: 'Grilled trout', price: 5, desc: 'Fresh river trout with lemon and dill' },
    { name: 'Beef and ale stew', price: 5, desc: 'Rich and thick, served with crusty bread' },
    { name: 'Cheese and ham platter', price: 4, desc: 'Local cheese, cured ham, pickles' },
    { name: 'Roast vegetables with gravy', price: 3, desc: 'Root vegetables in herb gravy' },
    { name: 'Pork chop with applesauce', price: 6, desc: 'Grilled chop with sweet sauce' },
    { name: 'Baked potato with butter', price: 2, desc: 'Simple, hot, and filling' },
  ],
  comfortable: [
    { name: 'Venison steak', price: 15, desc: 'Tender deer loin, seared with rosemary' },
    { name: 'Roast duck with cherry sauce', price: 18, desc: 'Crispy skin, sweet glaze' },
    { name: 'Grilled salmon', price: 15, desc: 'Wild-caught, served with asparagus' },
    { name: 'Lamb rack with mint jelly', price: 20, desc: 'Herb-crusted and perfectly pink' },
    { name: 'Wild boar ribs', price: 18, desc: 'Slow-smoked with honey glaze' },
    { name: 'Stuffed bell peppers', price: 10, desc: 'Rice, herbs, and ground meat' },
    { name: 'Mushroom risotto', price: 12, desc: 'Creamy, with foraged forest mushrooms' },
    { name: 'Meat and cheese board', price: 12, desc: 'Cured meats, aged cheeses, fruit, nuts' },
  ],
  wealthy: [
    { name: 'Filet of griffon', price: 50, desc: 'Extremely rare, tender and gamey' },
    { name: 'Seared tuna with saffron', price: 40, desc: 'Ocean-fresh, lightly spiced' },
    { name: 'Roast pheasant with truffle', price: 45, desc: 'Stuffed with herbs and black truffle' },
    { name: 'Braised ox cheeks', price: 35, desc: 'Fall-apart tender, red wine reduction' },
    { name: 'Lobster tail with butter', price: 60, desc: 'Imported, served with drawn butter' },
    { name: 'Elven herb salad', price: 25, desc: 'Exotic greens with enchanted vinaigrette' },
    { name: 'Rack of dire boar', price: 50, desc: 'Massive portion, smoky and rich' },
  ],
  aristocratic: [
    { name: 'Dragon turtle soup', price: 200, desc: 'A legendary delicacy, rich and complex' },
    { name: 'Unicorn mushroom risotto', price: 100, desc: 'Mushrooms grown in fey-touched soil' },
    { name: 'Gold-leaf wagyu steak', price: 150, desc: 'Marble-fat beef wrapped in edible gold' },
    { name: 'Basilisk egg omelette', price: 120, desc: 'Cooked by a professional, eyes closed' },
    { name: 'Phoenix-pepper crusted duck', price: 100, desc: 'Leaves a warm tingle for hours' },
    { name: 'Owlbear tenderloin', price: 80, desc: 'Surprisingly delicate flavor' },
    { name: 'Celestial fruit platter', price: 75, desc: 'Fruits from the Upper Planes, magically preserved' },
  ]
};

// ── Drinks ──────────────────────────────────────────────

var DRINKS = {
  squalid: [
    { name: 'Swamp water ale', price: 1, desc: 'Murky, flat, barely alcoholic' },
    { name: 'Grog', price: 1, desc: 'Watered-down rum with something floating in it' },
    { name: 'Turnip wine', price: 1, desc: 'Sour and unpleasant, but it\'s cheap' },
    { name: 'Dirty water', price: 0, desc: 'Free, but drink at your own risk' },
  ],
  poor: [
    { name: 'Common ale', price: 2, desc: 'Local brewery, nothing special' },
    { name: 'Cheap wine (red)', price: 2, desc: 'Vinegary but drinkable' },
    { name: 'Mead', price: 3, desc: 'Sweet, honey-based, a local favorite' },
    { name: 'Cider', price: 2, desc: 'Tart apple cider, slightly fizzy' },
    { name: 'Hot tea', price: 1, desc: 'Simple herbal brew' },
  ],
  modest: [
    { name: 'Dwarven stout', price: 4, desc: 'Dark, malty, strong kick' },
    { name: 'Elven pale ale', price: 5, desc: 'Light and crisp with floral notes' },
    { name: 'Honey mead', price: 4, desc: 'Golden and sweet, served warm' },
    { name: 'House red wine', price: 4, desc: 'Full-bodied, local vintage' },
    { name: 'Spiced cider', price: 3, desc: 'Warm cider with cinnamon and clove' },
    { name: 'Ginger beer', price: 3, desc: 'Non-alcoholic, fiery and refreshing' },
    { name: 'Mulled wine', price: 5, desc: 'Warm wine with spices and citrus' },
    { name: 'Coffee (black)', price: 3, desc: 'Strong and bitter, keeps you sharp' },
  ],
  comfortable: [
    { name: 'Aged amber ale', price: 8, desc: 'Smooth, caramel finish' },
    { name: 'Halfling wheat beer', price: 8, desc: 'Cloudy, citrusy, easy drinking' },
    { name: 'Fine Elvish wine', price: 15, desc: 'Pale gold, notes of starlight and pear' },
    { name: 'Dwarven fire whiskey', price: 12, desc: 'Burns going down, warms the soul' },
    { name: 'Honeydew mead', price: 10, desc: 'Brewed with rare meadow flowers' },
    { name: 'Gnomish fizzy pop', price: 8, desc: 'Magically carbonated, fruit-flavored' },
    { name: 'Hot cocoa with cream', price: 6, desc: 'Rich chocolate, topped with whipped cream' },
    { name: 'Herbal remedy tea', price: 5, desc: 'Restores 1 HP if you believe hard enough' },
  ],
  wealthy: [
    { name: 'Silverymoon reserve wine', price: 30, desc: 'Decades old, perfectly cellared' },
    { name: 'Calimshan spiced rum', price: 25, desc: 'Exotic spices, warm golden color' },
    { name: 'Feywild nectar', price: 40, desc: 'Dangerously sweet, mild hallucinogenic' },
    { name: 'Dragon\'s Breath whiskey', price: 35, desc: 'Literally lets you breathe a puff of fire' },
    { name: 'Moonshine (alchemist\'s grade)', price: 20, desc: 'Clear, potent, probably illegal' },
    { name: 'Champagne of the Coast', price: 30, desc: 'Sparkling, elegant, celebratory' },
  ],
  aristocratic: [
    { name: 'Astral vintage wine', price: 100, desc: 'Fermented between planes, transcendent' },
    { name: 'Celestial ambrosia', price: 150, desc: 'Golden liquid that glows faintly' },
    { name: 'Elder dragon brandy', price: 200, desc: 'Aged in a dragon\'s hoard for centuries' },
    { name: 'Tears of Selune', price: 100, desc: 'Moonlit water infused with divine essence' },
    { name: 'Fey queen\'s cordial', price: 120, desc: 'One sip and colors seem brighter for an hour' },
    { name: 'Planar espresso', price: 50, desc: 'Beans from the Elemental Plane of Earth, incredibly strong' },
  ]
};

// ── Rooms / Sleeping ────────────────────────────────────

var ROOMS = {
  squalid: [
    { name: 'Spot on the common room floor', price: 1, desc: 'A patch of straw near the fire, share with strangers' },
    { name: 'Hay loft above the stable', price: 2, desc: 'Warm from the animals below, smells accordingly' },
  ],
  poor: [
    { name: 'Common room cot', price: 3, desc: 'A narrow cot in a shared room with 6 others' },
    { name: 'Hammock in the basement', price: 2, desc: 'Damp but quiet, bring your own blanket' },
    { name: 'Stable stall', price: 2, desc: 'Clean straw, a horse blanket, privacy from other guests' },
  ],
  modest: [
    { name: 'Small private room', price: 8, desc: 'Tiny room with a bed, a candle, and a lock on the door' },
    { name: 'Shared double room', price: 5, desc: 'Two beds, shared with another traveler (or your companion)' },
    { name: 'Common room bunk', price: 4, desc: 'Bunk bed in a room with 4 others, curtain for privacy' },
  ],
  comfortable: [
    { name: 'Private room', price: 20, desc: 'Comfortable bed, nightstand, washbasin, window' },
    { name: 'Room with fireplace', price: 30, desc: 'Larger room with its own hearth and writing desk' },
    { name: 'Double room', price: 25, desc: 'Two beds, wardrobe, small table, ideal for pairs' },
  ],
  wealthy: [
    { name: 'Suite', price: 80, desc: 'Sitting room and bedroom, four-poster bed, fine linens' },
    { name: 'Balcony room', price: 60, desc: 'Private balcony overlooking the street, feather bed' },
    { name: 'Room with private bath', price: 70, desc: 'Hot water on demand, scented soaps, plush towels' },
  ],
  aristocratic: [
    { name: 'Royal suite', price: 200, desc: 'Multiple rooms, enchanted bed, magical climate, butler service' },
    { name: 'Tower suite', price: 150, desc: 'Top floor, panoramic views, silk everything' },
    { name: 'Garden suite', price: 180, desc: 'Private walled garden, fountain, magical soundproofing' },
  ]
};

// ── Specials / Quirks ───────────────────────────────────

var TAVERN_QUIRKS = [
  'A talking parrot behind the bar that insults customers',
  'All the chairs are mismatched, collected from different taverns',
  'A large board near the door covered in adventuring notices and bounties',
  'A suspiciously clean table that nobody sits at (rumored to be cursed)',
  'The house cat is enormous and sleeps on the bar',
  'Every drink comes with a free fortune cookie (fortunes are oddly accurate)',
  'A bard competition happens every Moonday night',
  'The tavern sign is misspelled and nobody has fixed it',
  'There\'s a secret menu if you know the passphrase',
  'Weapons must be peace-bonded at the door',
  'Arm-wrestling tournaments with a prize pot',
  'A mounted owlbear head above the fireplace that someone knitted a hat for',
  'The bartender is actually an awakened bear in an apron',
  'Ceiling is covered in carved initials from past patrons',
  'A "wall of shame" displaying tabs that were never paid',
  'Live music every night, but the bard is terrible',
  'The basement is rumored to connect to the sewers',
  'A regular patron claims to be a retired dragon in disguise',
  'There\'s a dartboard with a local lord\'s face on it',
  'The tavern has a resident ghost who moves drinks when nobody is looking',
  'A large map on the wall where patrons mark their travels',
  'The fireplace is enchanted to change color based on the room\'s mood',
  'A dusty suit of armor stands in the corner (it moves sometimes)',
  'There\'s a "no magic" policy, enforced by an antimagic amulet behind the bar',
  'A shelf of lost and found items, some clearly magical',
  'The outhouse is a portal to a pocket dimension (it\'s roomy)',
];

var DAILY_SPECIALS = [
  'All-you-can-eat stew night',
  'Half-price drinks before sundown',
  'Mystery meat Monday (guess the creature, win a free round)',
  'Pie eating contest at highsun',
  'Bardic open mic night',
  'Dwarven drinking challenge (3 flagons of stout, last one standing wins the pot)',
  'Game night: Three-Dragon Ante tournament',
  'Fresh catch of the day from the river',
  'Buy one get one free on house ale',
  'Storytelling hour: share a tale, get a free drink',
  'Fighter\'s feast: double portions for anyone in armor',
  'Wizard\'s Wednesday: 10% off for spellcasters',
  'Couples\' dinner special',
  'Late night snack menu after midnight',
];

// ── Generator ───────────────────────────────────────────

function generateTavern() {
  var quality = document.getElementById('tavern-quality').value;

  // Name
  var adj = pick(NAME_ADJ);
  var noun = pick(NAME_NOUN);
  var name = pick(NAME_TEMPLATE)(adj, noun);

  // Keeper
  var keeper = {
    name: pick(KEEPER_FIRST),
    race: pick(KEEPER_RACE),
    trait: pick(KEEPER_TRAIT)
  };

  // Atmosphere
  var atmo = pick(ATMOSPHERE[quality]);

  // Menu: pick 4-6 food items
  var foodList = FOOD[quality];
  var menuCount = Math.min(foodList.length, 3 + rollDice(1, 4));
  var menu = shuffle(foodList.slice()).slice(0, menuCount);

  // Drinks: pick 4-6
  var drinkList = DRINKS[quality];
  var drinkCount = Math.min(drinkList.length, 3 + rollDice(1, 4));
  var drinks = shuffle(drinkList.slice()).slice(0, drinkCount);

  // Rooms
  var roomList = ROOMS[quality];

  // Quirks
  var quirk1 = pick(TAVERN_QUIRKS);
  var quirk2;
  do { quirk2 = pick(TAVERN_QUIRKS); } while (quirk2 === quirk1);

  // Daily special
  var special = pick(DAILY_SPECIALS);

  renderTavern(name, quality, keeper, atmo, menu, drinks, roomList, [quirk1, quirk2], special);
}

function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}

function renderTavern(name, quality, keeper, atmo, menu, drinks, rooms, quirks, special) {
  var output = document.getElementById('tavern-output');
  var q = quality.charAt(0).toUpperCase() + quality.slice(1);
  var html = '';

  // Header
  html += '<div class="card" style="padding:20px; border-left:4px solid var(--primary);">';
  html += '<h2 style="margin:0 0 4px; font-family:Cinzel,serif; color:var(--heading);">' + escapeHtml(name) + '</h2>';
  html += '<div style="color:var(--text-dim); font-size:13px; margin-bottom:12px;">' + escapeHtml(q) + ' establishment</div>';
  html += '<div style="margin-bottom:12px; font-style:italic; color:var(--text);">"' + escapeHtml(atmo) + '"</div>';
  html += '<div><strong>Innkeeper:</strong> ' + escapeHtml(keeper.name) + ' (' + escapeHtml(keeper.race) + ') - ' + escapeHtml(keeper.trait) + '</div>';
  html += '</div>';

  // Menu
  html += '<div class="card" style="padding:18px;">';
  html += '<h3 style="margin:0 0 12px;"><i class="fi fi-rr-restaurant"></i> Menu</h3>';
  html += '<table style="width:100%; border-collapse:collapse;">';
  html += '<thead><tr style="border-bottom:1px solid var(--border); text-align:left;">';
  html += '<th style="padding:6px 8px;">Dish</th><th style="padding:6px 8px;">Price</th><th style="padding:6px 8px; color:var(--text-dim);">Notes</th></tr></thead><tbody>';
  menu.forEach(function (item) {
    html += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">';
    html += '<td style="padding:6px 8px; font-weight:500;">' + escapeHtml(item.name) + '</td>';
    html += '<td style="padding:6px 8px; white-space:nowrap;">' + coinStr(item.price) + '</td>';
    html += '<td style="padding:6px 8px; color:var(--text-dim); font-size:12px;">' + escapeHtml(item.desc) + '</td>';
    html += '</tr>';
  });
  html += '</tbody></table>';
  html += '</div>';

  // Drinks
  html += '<div class="card" style="padding:18px;">';
  html += '<h3 style="margin:0 0 12px;"><i class="fi fi-rr-mug-hot-alt"></i> Drinks</h3>';
  html += '<table style="width:100%; border-collapse:collapse;">';
  html += '<thead><tr style="border-bottom:1px solid var(--border); text-align:left;">';
  html += '<th style="padding:6px 8px;">Drink</th><th style="padding:6px 8px;">Price</th><th style="padding:6px 8px; color:var(--text-dim);">Notes</th></tr></thead><tbody>';
  drinks.forEach(function (item) {
    html += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">';
    html += '<td style="padding:6px 8px; font-weight:500;">' + escapeHtml(item.name) + '</td>';
    html += '<td style="padding:6px 8px; white-space:nowrap;">' + (item.price === 0 ? 'Free' : coinStr(item.price)) + '</td>';
    html += '<td style="padding:6px 8px; color:var(--text-dim); font-size:12px;">' + escapeHtml(item.desc) + '</td>';
    html += '</tr>';
  });
  html += '</tbody></table>';
  html += '</div>';

  // Rooms
  html += '<div class="card" style="padding:18px;">';
  html += '<h3 style="margin:0 0 12px;"><i class="fi fi-rr-bed"></i> Rooms & Lodging</h3>';
  html += '<table style="width:100%; border-collapse:collapse;">';
  html += '<thead><tr style="border-bottom:1px solid var(--border); text-align:left;">';
  html += '<th style="padding:6px 8px;">Option</th><th style="padding:6px 8px;">Per Night</th><th style="padding:6px 8px; color:var(--text-dim);">Description</th></tr></thead><tbody>';
  rooms.forEach(function (room) {
    html += '<tr style="border-bottom:1px solid rgba(255,255,255,0.04);">';
    html += '<td style="padding:6px 8px; font-weight:500;">' + escapeHtml(room.name) + '</td>';
    html += '<td style="padding:6px 8px; white-space:nowrap;">' + coinStr(room.price) + '</td>';
    html += '<td style="padding:6px 8px; color:var(--text-dim); font-size:12px;">' + escapeHtml(room.desc) + '</td>';
    html += '</tr>';
  });
  html += '</tbody></table>';
  html += '</div>';

  // Quirks & Special
  html += '<div class="card" style="padding:18px;">';
  html += '<h3 style="margin:0 0 12px;"><i class="fi fi-rr-star"></i> Notable Details</h3>';
  html += '<ul style="margin:0; padding-left:20px;">';
  quirks.forEach(function (q) {
    html += '<li style="margin-bottom:6px;">' + escapeHtml(q) + '</li>';
  });
  html += '</ul>';
  html += '<div style="margin-top:12px; padding-top:10px; border-top:1px solid var(--border);">';
  html += '<strong>Today\'s Special:</strong> ' + escapeHtml(special);
  html += '</div>';
  html += '</div>';

  output.innerHTML = html;
}
