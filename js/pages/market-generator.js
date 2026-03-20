// =============================================
//   market-generator.js - Random Market/Shop Generator
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
})();

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rollDice(num, sides) {
  var total = 0;
  for (var i = 0; i < num; i++) total += Math.floor(Math.random() * sides) + 1;
  return total;
}
function randPrice(base) {
  var multiplier = 0.8 + Math.random() * 0.5; // 0.8 to 1.3
  return Math.round(base * multiplier * 100) / 100;
}
function formatPrice(gp) {
  if (gp >= 1) {
    var gold = Math.floor(gp);
    var remainder = Math.round((gp - gold) * 10);
    if (remainder > 0) return gold + ' gp, ' + remainder + ' sp';
    return gold + ' gp';
  }
  var sp = gp * 10;
  if (sp >= 1) {
    var silver = Math.floor(sp);
    var cp = Math.round((sp - silver) * 10);
    if (cp > 0) return silver + ' sp, ' + cp + ' cp';
    return silver + ' sp';
  }
  return Math.round(gp * 100) + ' cp';
}

// ── Shop Name Parts ─────────────────────────────────────

var SHOP_PREFIXES = ['The Golden', 'The Silver', 'The Iron', 'The Rusty', 'The Crimson', 'The Wandering', 'The Lucky', 'The Prancing', 'The Drunken', 'The Sleeping', 'The Gilded', 'The Broken', 'The Enchanted', 'The Mystic', 'The Old', 'The Humble', 'The Grand', 'The Twisted', 'The Laughing', 'The Dancing'];
var SHOP_SUFFIXES = {
  'General Store': ['Emporium', 'Provisions', 'Goods', 'Supply', 'Mercantile', 'Trading Post', 'General Store', 'Bazaar'],
  'Blacksmith':    ['Anvil', 'Forge', 'Hammer', 'Armory', 'Smithy', 'Ironworks', 'Steel', 'Blade'],
  'Alchemist':     ['Cauldron', 'Flask', 'Apothecary', 'Elixirs', 'Remedies', 'Brews', 'Vials', 'Tinctures'],
  'Magic Shop':    ['Arcanum', 'Sanctum', 'Wonders', 'Curiosities', 'Enchantments', 'Mysteries', 'Grimoire', 'Reliquary'],
  'Tavern':        ['Tankard', 'Barrel', 'Flagon', 'Dragon', 'Griffin', 'Stag', 'Bear', 'Raven', 'Boar', 'Goblet'],
  'Jeweler':       ['Gem', 'Crown', 'Jewel', 'Ring', 'Diamond', 'Pendant', 'Treasure', 'Brilliance'],
  'Exotic Goods':  ['Oddities', 'Curiosities', 'Rarities', 'Wonders', 'Imports', 'Marvels', 'Antiquities', 'Relics']
};

// ── Shopkeeper Data ─────────────────────────────────────

var KEEPER_FIRST = ['Aldric', 'Brina', 'Corwin', 'Dagny', 'Elara', 'Finn', 'Greta', 'Haldor', 'Isolde', 'Jorik', 'Kira', 'Lysander', 'Mira', 'Nolan', 'Olga', 'Percival', 'Quinn', 'Rowan', 'Seraphina', 'Theron', 'Ursa', 'Viktor', 'Wren', 'Xander', 'Yara', 'Zara', 'Bramwell', 'Delphine', 'Gareth', 'Helga'];
var KEEPER_LAST = ['Ironhand', 'Brightwater', 'Stoneheart', 'Goldleaf', 'Shadowmere', 'Thornwood', 'Copperfield', 'Silvervein', 'Oakbarrel', 'Firebrand', 'Frostbeard', 'Blackthorn', 'Whitmore', 'Ashford', 'Deepwell', 'Greenhollow', 'Mistwalker', 'Starling', 'Nightingale', 'Swiftwind'];
var KEEPER_RACES = ['Human', 'Dwarf', 'Elf', 'Half-Elf', 'Halfling', 'Gnome', 'Tiefling', 'Dragonborn', 'Half-Orc'];
var KEEPER_PERSONALITIES = [
  'Friendly and chatty, loves to gossip',
  'Gruff and no-nonsense, hates haggling',
  'Suspiciously generous, always smiling',
  'Nervous and jumpy, constantly looking over their shoulder',
  'Refined and snobbish, judges customers by their attire',
  'Boisterous and loud, slaps everyone on the back',
  'Quiet and mysterious, speaks in riddles',
  'Forgetful, keeps misplacing items behind the counter',
  'Overly enthusiastic about every single product',
  'Perpetually bored, barely looks up from a book',
  'Shrewd bargainer, always tries to upsell',
  'Kind-hearted, gives discounts to those in need',
  'Paranoid about thieves, watches everyone closely',
  'Ex-adventurer, loves telling old war stories',
  'Stern but fair, respects honest customers',
  'Eccentric inventor, always tinkering with something',
  'Deeply religious, blesses every transaction',
  'Hard of hearing, constantly misunderstands orders'
];

// ── Inventory by Shop Type ──────────────────────────────

var SHOP_INVENTORY = {
  'General Store': [
    { name: 'Backpack', desc: 'Leather pack, holds 30 lbs', base: 2 },
    { name: 'Bedroll', desc: 'Warm sleeping roll', base: 1 },
    { name: 'Rope (50 ft, hempen)', desc: 'Strong hemp rope', base: 1 },
    { name: 'Rope (50 ft, silk)', desc: 'Light and strong silk rope', base: 10 },
    { name: 'Rations (1 day)', desc: 'Dried meat, hardtack, and dried fruit', base: 0.5 },
    { name: 'Waterskin', desc: 'Holds 4 pints of liquid', base: 0.2 },
    { name: 'Torch (bundle of 5)', desc: 'Burns for 1 hour each, 20-ft bright light', base: 0.05 },
    { name: 'Tinderbox', desc: 'Flint, fire steel, and tinder', base: 0.5 },
    { name: 'Lantern, hooded', desc: '30-ft bright light, 30-ft dim', base: 5 },
    { name: 'Oil flask', desc: 'Burns for 6 hours in a lantern', base: 0.1 },
    { name: 'Piton (set of 10)', desc: 'Iron spikes for climbing', base: 0.5 },
    { name: 'Hammer', desc: 'For driving pitons', base: 1 },
    { name: 'Grappling hook', desc: 'Iron hook with folding prongs', base: 2 },
    { name: 'Crowbar', desc: '+2 to STR checks to pry things open', base: 2 },
    { name: 'Chalk (box of 10)', desc: 'For marking walls and paths', base: 0.01 },
    { name: 'Ball bearings (bag of 1000)', desc: 'For traps or slippery surfaces', base: 1 },
    { name: 'Caltrops (bag of 20)', desc: 'Slows creatures moving through area', base: 1 },
    { name: 'Chain (10 ft)', desc: 'Heavy iron chain', base: 5 },
    { name: 'Tent, two-person', desc: 'Canvas shelter for two', base: 2 },
    { name: 'Mess kit', desc: 'Tin box with cup, fork, spoon, and plate', base: 0.2 },
    { name: 'Traveler\'s clothes', desc: 'Sturdy traveling garments', base: 2 },
    { name: 'Fishing tackle', desc: 'Rod, line, hooks, bobbers, bait', base: 1 },
    { name: 'Mirror, steel', desc: 'Small polished steel mirror', base: 5 },
    { name: 'Soap', desc: 'A bar of fragrant soap', base: 0.02 }
  ],
  'Blacksmith': [
    { name: 'Longsword', desc: 'Versatile 1d8/1d10 slashing', base: 15 },
    { name: 'Shortsword', desc: 'Finesse, light, 1d6 piercing', base: 10 },
    { name: 'Greatsword', desc: 'Heavy, two-handed, 2d6 slashing', base: 50 },
    { name: 'Battleaxe', desc: 'Versatile 1d8/1d10 slashing', base: 10 },
    { name: 'Warhammer', desc: 'Versatile 1d8/1d10 bludgeoning', base: 15 },
    { name: 'Dagger', desc: 'Finesse, light, thrown, 1d4 piercing', base: 2 },
    { name: 'Handaxe', desc: 'Light, thrown, 1d6 slashing', base: 5 },
    { name: 'Mace', desc: '1d6 bludgeoning', base: 5 },
    { name: 'Spear', desc: 'Thrown, versatile, 1d6/1d8 piercing', base: 1 },
    { name: 'Shield', desc: '+2 AC, steel', base: 10 },
    { name: 'Chain mail', desc: 'AC 16, STR 13 required, disadvantage on Stealth', base: 75 },
    { name: 'Chain shirt', desc: 'AC 13 + Dex mod (max 2)', base: 50 },
    { name: 'Scale mail', desc: 'AC 14 + Dex mod (max 2), disadvantage on Stealth', base: 50 },
    { name: 'Breastplate', desc: 'AC 14 + Dex mod (max 2)', base: 400 },
    { name: 'Half plate', desc: 'AC 15 + Dex mod (max 2), disadvantage on Stealth', base: 750 },
    { name: 'Plate armor', desc: 'AC 18, STR 15 required, disadvantage on Stealth', base: 1500 },
    { name: 'Studded leather', desc: 'AC 12 + Dex mod', base: 45 },
    { name: 'Arrows (quiver of 20)', desc: 'Standard arrows', base: 1 },
    { name: 'Crossbow bolts (20)', desc: 'Standard bolts', base: 1 },
    { name: 'Horseshoes (set)', desc: 'Iron horseshoes', base: 2 }
  ],
  'Alchemist': [
    { name: 'Potion of Healing', desc: 'Restores 2d4+2 hit points', base: 50 },
    { name: 'Antitoxin', desc: 'Advantage on saves vs. poison for 1 hour', base: 50 },
    { name: 'Alchemist\'s Fire', desc: 'Improvised weapon, 1d4 fire/round', base: 50 },
    { name: 'Acid (vial)', desc: 'Improvised weapon, 2d6 acid damage', base: 25 },
    { name: 'Holy Water', desc: '2d6 radiant to fiends and undead', base: 25 },
    { name: 'Healer\'s Kit', desc: '10 uses, stabilize dying creatures', base: 5 },
    { name: 'Herbalism Kit', desc: 'For creating potions and identifying plants', base: 5 },
    { name: 'Perfume (vial)', desc: 'Fine fragrance', base: 5 },
    { name: 'Ink (1 oz bottle)', desc: 'Standard black ink', base: 10 },
    { name: 'Component pouch', desc: 'Holds material spell components', base: 25 },
    { name: 'Vial (empty)', desc: 'Glass vial, holds 4 ounces', base: 1 },
    { name: 'Soap (herbal)', desc: 'Medicinal herb-scented soap', base: 0.1 },
    { name: 'Candle (scented, 6-pack)', desc: 'Aromatic candles, 1 hour each', base: 0.06 },
    { name: 'Insect repellent', desc: 'Keeps bugs away for 8 hours', base: 2 },
    { name: 'Smelling salts', desc: 'Wakes unconscious creatures (not at 0 HP)', base: 10 },
    { name: 'Tonic of Alertness', desc: 'No sleep for 24 hours, then exhaustion', base: 15 },
    { name: 'Smokestick', desc: 'Creates 10-ft cube of smoke for 1 round', base: 20 },
    { name: 'Tanglefoot bag', desc: 'Restrains on hit, DC 11 STR to break free', base: 30 }
  ],
  'Magic Shop': [
    { name: 'Spell scroll (cantrip)', desc: 'Single-use cantrip scroll', base: 25 },
    { name: 'Spell scroll (1st level)', desc: 'Single-use 1st level spell', base: 75 },
    { name: 'Spell scroll (2nd level)', desc: 'Single-use 2nd level spell', base: 150 },
    { name: 'Spell scroll (3rd level)', desc: 'Single-use 3rd level spell', base: 300 },
    { name: 'Potion of Healing', desc: 'Restores 2d4+2 hit points', base: 50 },
    { name: 'Potion of Greater Healing', desc: 'Restores 4d4+4 hit points', base: 150 },
    { name: 'Potion of Climbing', desc: 'Climbing speed equal to walking for 1 hour', base: 75 },
    { name: 'Potion of Water Breathing', desc: 'Breathe underwater for 1 hour', base: 100 },
    { name: 'Bag of Holding', desc: 'Interior is 64 cubic feet, weighs 15 lbs', base: 500 },
    { name: 'Driftglobe', desc: 'Casts Light or Daylight', base: 250 },
    { name: 'Cloak of Protection', desc: '+1 AC and saving throws (attunement)', base: 1500 },
    { name: 'Wand of Magic Missiles', desc: '7 charges, casts Magic Missile', base: 2000 },
    { name: 'Pearl of Power', desc: 'Recover one spell slot up to 3rd level', base: 1000 },
    { name: 'Goggles of Night', desc: 'Darkvision 60 ft', base: 500 },
    { name: 'Hat of Disguise', desc: 'Cast Disguise Self at will (attunement)', base: 750 },
    { name: 'Immovable Rod', desc: 'Press button to fix in place, holds 8000 lbs', base: 500 },
    { name: 'Deck of Illusions', desc: '34 cards, each creates an illusion', base: 600 },
    { name: 'Dust of Disappearance', desc: 'Invisible for 2d4 minutes', base: 300 },
    { name: 'Sending Stones (pair)', desc: 'Cast Sending once per day between stones', base: 1000 },
    { name: 'Arcane focus (crystal)', desc: 'Spellcasting focus', base: 10 },
    { name: 'Spellbook (blank)', desc: '100 parchment pages, leather bound', base: 50 }
  ],
  'Tavern': [
    { name: 'Ale (mug)', desc: 'Standard tavern ale', base: 0.04 },
    { name: 'Ale (gallon)', desc: 'Enough for a party', base: 0.2 },
    { name: 'Wine (common, pitcher)', desc: 'House red or white', base: 0.2 },
    { name: 'Wine (fine, bottle)', desc: 'Imported vintage', base: 10 },
    { name: 'Mead (mug)', desc: 'Honey wine', base: 0.1 },
    { name: 'Spirits (shot)', desc: 'Strong distilled liquor', base: 0.1 },
    { name: 'Bread and cheese', desc: 'Simple tavern fare', base: 0.03 },
    { name: 'Hearty stew', desc: 'Thick stew with meat and vegetables', base: 0.1 },
    { name: 'Roast meat platter', desc: 'Generous portion of roasted meat', base: 0.3 },
    { name: 'Meat pie', desc: 'Flaky crust with savory filling', base: 0.1 },
    { name: 'Fish and chips', desc: 'Fried fish with potato wedges', base: 0.15 },
    { name: 'Room (common, 1 night)', desc: 'Shared sleeping area', base: 0.5 },
    { name: 'Room (modest, 1 night)', desc: 'Private room with a bed', base: 1 },
    { name: 'Room (comfortable, 1 night)', desc: 'Nice room with clean linens', base: 2 },
    { name: 'Room (wealthy, 1 night)', desc: 'Luxurious suite', base: 4 },
    { name: 'Bath (hot)', desc: 'Hot water, soap, and towel', base: 0.1 },
    { name: 'Stable (per mount, 1 night)', desc: 'Feed and shelter for one mount', base: 0.5 },
    { name: 'Live entertainment', desc: 'Bard performance during dinner', base: 0.2 }
  ],
  'Jeweler': [
    { name: 'Gold ring (plain)', desc: 'Simple gold band', base: 25 },
    { name: 'Gold ring (gemstone)', desc: 'Gold band set with a small gem', base: 75 },
    { name: 'Silver necklace', desc: 'Delicate silver chain', base: 15 },
    { name: 'Gold necklace', desc: 'Fine gold chain with pendant', base: 50 },
    { name: 'Pearl earrings (pair)', desc: 'Matched freshwater pearls', base: 30 },
    { name: 'Ruby pendant', desc: 'Deep red ruby on gold chain', base: 250 },
    { name: 'Sapphire brooch', desc: 'Blue sapphire in silver setting', base: 200 },
    { name: 'Emerald bracelet', desc: 'Gold bracelet with emerald stones', base: 300 },
    { name: 'Diamond stud earrings', desc: 'Small but brilliant diamonds', base: 500 },
    { name: 'Tiara (silver)', desc: 'Delicate silver crown with gemstones', base: 150 },
    { name: 'Signet ring', desc: 'Engraved with custom seal', base: 5 },
    { name: 'Locket (gold)', desc: 'Opens to hold a tiny portrait', base: 25 },
    { name: 'Amulet (decorative)', desc: 'Ornate but non-magical pendant', base: 15 },
    { name: 'Gem appraisal service', desc: 'Professional valuation of a gemstone', base: 5 },
    { name: 'Custom engraving', desc: 'Personalized inscription on jewelry', base: 2 },
    { name: 'Loose gemstone (quartz)', desc: 'Polished quartz crystal', base: 10 },
    { name: 'Loose gemstone (garnet)', desc: 'Deep red garnet', base: 100 },
    { name: 'Loose gemstone (sapphire)', desc: 'Blue sapphire, unset', base: 500 }
  ],
  'Exotic Goods': [
    { name: 'Spyglass', desc: 'See distant objects as if nearby', base: 1000 },
    { name: 'Magnifying glass', desc: 'Examine small details', base: 100 },
    { name: 'Hourglass', desc: 'Measures 1 hour precisely', base: 25 },
    { name: 'Lock (average)', desc: 'DC 15 to pick', base: 10 },
    { name: 'Lock (fine)', desc: 'DC 20 to pick', base: 50 },
    { name: 'Manacles', desc: 'DC 20 Strength to break, DC 15 to pick', base: 2 },
    { name: 'Poison, basic (vial)', desc: 'DC 10 CON save, 1d4 poison on weapon', base: 100 },
    { name: 'Disguise kit', desc: 'Cosmetics, dyes, prosthetics', base: 25 },
    { name: 'Thieves\' tools', desc: 'For picking locks and disarming traps', base: 25 },
    { name: 'Forgery kit', desc: 'Inks, parchments, seals, wax', base: 15 },
    { name: 'Climber\'s kit', desc: 'Pitons, boot tips, gloves, harness', base: 25 },
    { name: 'Navigator\'s tools', desc: 'Sextant, compass, charts', base: 25 },
    { name: 'Map (regional)', desc: 'Detailed map of the local region', base: 15 },
    { name: 'Rare incense (bundle)', desc: 'Exotic fragrance from distant lands', base: 10 },
    { name: 'Exotic feather', desc: 'Vibrant plume from a tropical bird', base: 5 },
    { name: 'Dragon scale (small)', desc: 'A single shed dragon scale', base: 250 },
    { name: 'Rare tea leaves (pouch)', desc: 'Imported tea with mild restorative properties', base: 8 },
    { name: 'Monster tooth', desc: 'Trophy from a slain beast', base: 15 },
    { name: 'Petrified wood carving', desc: 'Ancient wooden figure turned to stone', base: 30 },
    { name: 'Crystal ball (non-magical)', desc: 'Decorative glass orb', base: 50 }
  ]
};

var SHOP_TYPES = Object.keys(SHOP_INVENTORY);

// ── Generation ──────────────────────────────────────────

function generateShop() {
  var shopType = document.getElementById('shop-type').value;
  if (shopType === 'random') {
    shopType = pick(SHOP_TYPES);
  }

  var shopName = pick(SHOP_PREFIXES) + ' ' + pick(SHOP_SUFFIXES[shopType] || SHOP_SUFFIXES['General Store']);
  var keeperName = pick(KEEPER_FIRST) + ' ' + pick(KEEPER_LAST);
  var keeperRace = pick(KEEPER_RACES);
  var keeperPersonality = pick(KEEPER_PERSONALITIES);

  var inventory = SHOP_INVENTORY[shopType] || SHOP_INVENTORY['General Store'];
  // Select a random subset (6-14 items)
  var shuffled = inventory.slice().sort(function () { return Math.random() - 0.5; });
  var numItems = Math.min(shuffled.length, 6 + Math.floor(Math.random() * 9));
  var items = shuffled.slice(0, numItems).map(function (item) {
    return {
      name: item.name,
      desc: item.desc,
      price: randPrice(item.base)
    };
  });

  renderShop(shopName, shopType, keeperName, keeperRace, keeperPersonality, items);
}

function renderShop(shopName, shopType, keeperName, keeperRace, keeperPersonality, items) {
  var output = document.getElementById('shop-output');
  var htmlStr = '';

  htmlStr += '<div class="card" style="padding:18px;">';
  htmlStr += '<h3 style="margin:0 0 4px; color:var(--accent);">' + escapeHtml(shopName) + '</h3>';
  htmlStr += '<span class="npc-tag">' + escapeHtml(shopType) + '</span>';
  htmlStr += '<div style="margin-top:14px; margin-bottom:14px; padding:12px; background:var(--card-inner-bg, rgba(255,255,255,0.03)); border-radius:8px;">';
  htmlStr += '<strong>Shopkeeper:</strong> ' + escapeHtml(keeperName) + ' <span style="color:var(--text-dim);">(' + escapeHtml(keeperRace) + ')</span><br/>';
  htmlStr += '<em style="color:var(--text-muted);">' + escapeHtml(keeperPersonality) + '</em>';
  htmlStr += '</div>';

  htmlStr += '<h4 style="margin:0 0 8px;">Inventory</h4>';
  htmlStr += '<table style="width:100%; border-collapse:collapse; font-size:14px;">';
  htmlStr += '<thead><tr style="text-align:left; border-bottom:2px solid var(--border);">';
  htmlStr += '<th style="padding:6px 8px;">Item</th>';
  htmlStr += '<th style="padding:6px 8px;">Description</th>';
  htmlStr += '<th style="padding:6px 8px; text-align:right;">Price</th>';
  htmlStr += '</tr></thead><tbody>';

  items.forEach(function (item) {
    htmlStr += '<tr style="border-bottom:1px solid var(--border);">';
    htmlStr += '<td style="padding:6px 8px; font-weight:500; white-space:nowrap;">' + escapeHtml(item.name) + '</td>';
    htmlStr += '<td style="padding:6px 8px; color:var(--text-muted);">' + escapeHtml(item.desc) + '</td>';
    htmlStr += '<td style="padding:6px 8px; text-align:right; white-space:nowrap;">' + escapeHtml(formatPrice(item.price)) + '</td>';
    htmlStr += '</tr>';
  });

  htmlStr += '</tbody></table>';
  htmlStr += '</div>';
  output.innerHTML = htmlStr;
}

function copyShop() {
  var output = document.getElementById('shop-output');
  if (!output || !output.textContent.trim()) {
    showToast('Generate a shop first!', 'info');
    return;
  }
  navigator.clipboard.writeText(output.textContent)
    .then(function () { showToast('Shop copied!', 'success'); })
    .catch(function () { showToast('Copy failed.', 'error'); });
}
