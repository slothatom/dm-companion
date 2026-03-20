// =============================================
//   loot-generator.js - Loot & Treasure Generator
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

// ── Gem Tables ──────────────────────────────────────────
var GEMS = {
  10:   ['Azurite', 'Banded agate', 'Blue quartz', 'Eye agate', 'Hematite', 'Lapis lazuli', 'Malachite', 'Moss agate', 'Obsidian', 'Rhodochrosite', 'Tiger eye', 'Turquoise'],
  50:   ['Bloodstone', 'Carnelian', 'Chalcedony', 'Chrysoprase', 'Citrine', 'Jasper', 'Moonstone', 'Onyx', 'Quartz', 'Sardonyx', 'Star rose quartz', 'Zircon'],
  100:  ['Amber', 'Amethyst', 'Chrysoberyl', 'Coral', 'Garnet', 'Jade', 'Jet', 'Pearl', 'Spinel', 'Tourmaline'],
  500:  ['Alexandrite', 'Aquamarine', 'Black pearl', 'Blue spinel', 'Peridot', 'Topaz'],
  1000: ['Black opal', 'Blue sapphire', 'Emerald', 'Fire opal', 'Opal', 'Star ruby', 'Star sapphire', 'Yellow sapphire'],
  5000: ['Black sapphire', 'Diamond', 'Jacinth', 'Ruby']
};

// ── Art Object Tables ───────────────────────────────────
var ART_OBJECTS = {
  25:   ['Silver ewer', 'Carved bone statuette', 'Small gold bracelet', 'Cloth-of-gold vestments', 'Black velvet mask stitched with silver thread', 'Copper chalice with silver filigree', 'Pair of engraved bone dice', 'Small mirror set in a painted wooden frame', 'Embroidered silk handkerchief', 'Gold locket with a painted portrait inside'],
  250:  ['Gold ring set with bloodstones', 'Carved ivory statuette', 'Large gold bracelet', 'Silver necklace with a gemstone pendant', 'Bronze crown', 'Silk robe with gold embroidery', 'Fine tapestry', 'Brass mug with jade inlay', 'Box of turquoise animal figurines', 'Gold bird cage with electrum filigree'],
  750:  ['Silver chalice set with moonstones', 'Silver-plated steel longsword with jet set in hilt', 'Carved harp of exotic wood with ivory inlay and zircon gems', 'Small gold idol', 'Gold dragon comb set with red garnets as eyes', 'Bottle stopper cork embossed with gold leaf and set with amethysts', 'Ceremonial electrum dagger with a black pearl in the pommel', 'Silver and gold brooch', 'Obsidian statuette with gold fittings and inlay', 'Painted gold war mask'],
  2500: ['Fine gold chain set with a fire opal', 'Old masterpiece painting', 'Embroidered silk and velvet mantle set with numerous moonstones', 'Platinum bracelet set with a sapphire', 'Embroidered glove set with jewel chips', 'Jeweled anklet', 'Gold music box', 'Gold circlet set with four aquamarines', 'Eye patch with a mock eye set in blue sapphire and moonstone', 'A necklace string of small pink pearls'],
  7500: ['Jeweled gold crown', 'Jeweled platinum ring', 'Small gold statuette set with rubies', 'Gold cup set with emeralds', 'Gold jewelry box with platinum filigree', 'Painted gold child\'s sarcophagus', 'Jade game board with solid gold playing pieces', 'Bejeweled ivory drinking horn with gold filigree']
};

// ── Magic Item Tables ───────────────────────────────────
var MAGIC_ITEMS = {
  A: ['Potion of healing', 'Spell scroll (cantrip)', 'Potion of climbing', 'Spell scroll (1st level)', 'Spell scroll (2nd level)', 'Potion of greater healing', 'Bag of holding', 'Driftglobe'],
  B: ['Potion of greater healing', 'Potion of fire breath', 'Potion of resistance', 'Ammunition +1', 'Potion of animal friendship', 'Potion of hill giant strength', 'Potion of growth', 'Potion of water breathing', 'Spell scroll (2nd level)', 'Spell scroll (3rd level)', 'Bag of holding', 'Keoghtom\'s ointment', 'Oil of slipperiness', 'Dust of disappearance', 'Dust of dryness', 'Dust of sneezing and choking', 'Elemental gem', 'Philter of love'],
  C: ['Potion of superior healing', 'Spell scroll (4th level)', 'Ammunition +2', 'Potion of clairvoyance', 'Potion of diminution', 'Potion of gaseous form', 'Potion of frost giant strength', 'Potion of stone giant strength', 'Potion of heroism', 'Potion of invulnerability', 'Potion of mind reading', 'Spell scroll (5th level)', 'Elixir of health', 'Oil of etherealness', 'Potion of fire giant strength', 'Quaal\'s feather token', 'Scroll of protection', 'Bag of beans', 'Bead of force'],
  D: ['Potion of supreme healing', 'Potion of invisibility', 'Potion of speed', 'Spell scroll (6th level)', 'Spell scroll (7th level)', 'Ammunition +3', 'Oil of sharpness', 'Potion of flying', 'Potion of cloud giant strength', 'Potion of longevity', 'Potion of vitality', 'Spell scroll (8th level)', 'Horseshoes of speed', 'Nolzur\'s marvelous pigments', 'Bag of devouring', 'Portable hole'],
  E: ['Spell scroll (8th level)', 'Potion of storm giant strength', 'Potion of supreme healing', 'Spell scroll (9th level)', 'Universal solvent', 'Arrow of slaying', 'Sovereign glue'],
  F: ['Weapon +1', 'Shield +1', 'Sentinel shield', 'Amulet of proof against detection and location', 'Boots of elvenkind', 'Boots of striding and springing', 'Bracers of archery', 'Brooch of shielding', 'Broom of flying', 'Cloak of elvenkind', 'Cloak of protection', 'Gauntlets of ogre power', 'Hat of disguise', 'Javelin of lightning', 'Pearl of power', 'Rod of the pact keeper +1', 'Slippers of spider climbing', 'Staff of the adder', 'Staff of the python', 'Sword of vengeance', 'Trident of fish command', 'Wand of magic missiles', 'Wand of the war mage +1', 'Wand of web', 'Weapon of warning', 'Adamantine armor (chain mail)', 'Adamantine armor (chain shirt)', 'Adamantine armor (scale mail)', 'Bag of tricks (gray)', 'Bag of tricks (rust)', 'Bag of tricks (tan)', 'Boots of the winterlands', 'Circlet of blasting', 'Deck of illusions', 'Eversmoking bottle', 'Eyes of charming', 'Eyes of the eagle', 'Figurine of wondrous power (silver raven)', 'Gem of brightness', 'Gloves of missile snaring', 'Gloves of swimming and climbing', 'Gloves of thievery', 'Headband of intellect', 'Helm of telepathy', 'Instrument of the bards (Doss lute)', 'Instrument of the bards (Fochlucan bandore)', 'Instrument of the bards (Mac-Fuirmidh cittern)', 'Medallion of thoughts', 'Necklace of adaptation', 'Periapt of wound closure', 'Pipes of haunting', 'Pipes of the sewers', 'Ring of jumping', 'Ring of mind shielding', 'Ring of warmth', 'Ring of water walking', 'Quiver of Ehlonna', 'Stone of good luck', 'Wind fan', 'Winged boots'],
  G: ['Weapon +2', 'Figurine of wondrous power (random)', 'Adamantine armor (breastplate)', 'Adamantine armor (splint)', 'Amulet of health', 'Armor of vulnerability', 'Arrow-catching shield', 'Belt of dwarvenkind', 'Belt of hill giant strength', 'Berserker axe', 'Boots of levitation', 'Boots of speed', 'Bowl of commanding water elementals', 'Bracers of defense', 'Brazier of commanding fire elementals', 'Cape of the mountebank', 'Censer of controlling air elementals', 'Armor +1 (chain mail)', 'Armor of resistance (chain mail)', 'Armor +1 (chain shirt)', 'Armor of resistance (chain shirt)', 'Cloak of displacement', 'Cloak of the bat', 'Cube of force', 'Daern\'s instant fortress', 'Dagger of venom', 'Dimensional shackles', 'Dragon slayer', 'Elven chain', 'Flame tongue', 'Gem of seeing', 'Giant slayer', 'Glamoured studded leather', 'Helm of teleportation', 'Horn of blasting', 'Horn of Valhalla (silver or brass)', 'Instrument of the bards (Canaith mandolin)', 'Instrument of the bards (Cli lyre)', 'Ioun stone (awareness)', 'Ioun stone (protection)', 'Ioun stone (reserve)', 'Ioun stone (sustenance)', 'Iron bands of Bilarro', 'Armor +1 (leather)', 'Armor of resistance (leather)', 'Mace of disruption', 'Mace of smiting', 'Mace of terror', 'Mantle of spell resistance', 'Necklace of fireballs', 'Necklace of prayer beads', 'Periapt of proof against poison', 'Ring of animal influence', 'Ring of evasion', 'Ring of feather falling', 'Ring of free action', 'Ring of protection', 'Ring of resistance', 'Ring of spell storing', 'Ring of the ram', 'Ring of X-ray vision', 'Robe of eyes', 'Rod of rulership', 'Rod of the pact keeper +2', 'Rope of entanglement', 'Armor +1 (scale mail)', 'Armor of resistance (scale mail)', 'Shield +2', 'Shield of missile attraction', 'Staff of charming', 'Staff of healing', 'Staff of swarming insects', 'Staff of the woodlands', 'Staff of withering', 'Stone of controlling earth elementals', 'Sun blade', 'Sword of life stealing', 'Sword of wounding', 'Tentacle rod', 'Vicious weapon', 'Wand of binding', 'Wand of enemy detection', 'Wand of fear', 'Wand of fireballs', 'Wand of lightning bolts', 'Wand of paralysis', 'Wand of the war mage +2', 'Wand of wonder', 'Wings of flying'],
  H: ['Weapon +3', 'Amulet of the planes', 'Carpet of flying', 'Crystal ball', 'Efreeti bottle', 'Figurine of wondrous power (obsidian steed)', 'Horn of Valhalla (bronze)', 'Instrument of the bards (Anstruth harp)', 'Ioun stone (absorption)', 'Ioun stone (agility)', 'Ioun stone (fortitude)', 'Ioun stone (insight)', 'Ioun stone (intellect)', 'Ioun stone (leadership)', 'Ioun stone (strength)', 'Armor +2 (leather)', 'Manual of bodily health', 'Manual of gainful exercise', 'Manual of golems', 'Manual of quickness of action', 'Mirror of life trapping', 'Nine lives stealer', 'Oathbow', 'Armor +2 (scale mail)', 'Spellguard shield', 'Armor +1 (splint)', 'Armor of resistance (splint)', 'Armor +1 (studded leather)', 'Armor of resistance (studded leather)', 'Tome of clear thought', 'Tome of leadership and influence', 'Tome of understanding'],
  I: ['Defender', 'Hammer of thunderbolts', 'Luck blade', 'Sword of answering', 'Holy avenger', 'Ring of djinni summoning', 'Ring of invisibility', 'Ring of spell turning', 'Rod of lordly might', 'Staff of the magi', 'Vorpal sword', 'Belt of cloud giant strength', 'Armor +2 (breastplate)', 'Armor +3 (chain mail)', 'Armor +3 (chain shirt)', 'Cloak of invisibility', 'Crystal ball (legendary)', 'Armor +1 (half plate)', 'Iron flask', 'Armor +3 (leather)', 'Armor +2 (plate)', 'Robe of the archmagi', 'Rod of the pact keeper +3', 'Armor +3 (scale mail)', 'Scarab of protection', 'Armor +2 (splint)', 'Armor +2 (studded leather)', 'Well of many worlds', 'Apparatus of Kwalish', 'Armor of invulnerability', 'Belt of fire giant strength', 'Belt of frost giant strength (or stone)', 'Armor +3 (breastplate)', 'Candle of invocation', 'Armor +3 (half plate)', 'Horn of Valhalla (iron)', 'Instrument of the bards (Ollamh harp)', 'Ioun stone (greater absorption)', 'Ioun stone (mastery)', 'Ioun stone (regeneration)', 'Armor +3 (plate)', 'Armor +3 (splint)', 'Armor +3 (studded leather)', 'Ring of air elemental command', 'Ring of earth elemental command', 'Ring of fire elemental command', 'Ring of water elemental command', 'Ring of three wishes', 'Ring of regeneration', 'Sphere of annihilation', 'Talisman of pure good', 'Talisman of the sphere', 'Talisman of ultimate evil', 'Tome of the stilled tongue', 'Wand of the war mage +3']
};

// ── Loot Generation by CR ───────────────────────────────

function generateLoot() {
  var crTier = document.getElementById('cr-tier').value;
  var isHoard = document.getElementById('hoard-toggle') && document.getElementById('hoard-toggle').checked;
  var loot;

  if (isHoard) {
    loot = generateHoard(crTier);
  } else {
    loot = generateIndividual(crTier);
  }

  renderLoot(loot);
}

function generateIndividual(tier) {
  var loot = { coins: {}, gems: [], art: [], magicItems: [], tier: tier, type: 'Individual Treasure' };
  var roll = rollDice(1, 100);

  if (tier === '0-4') {
    if (roll <= 30) { loot.coins.cp = rollDice(5, 6); }
    else if (roll <= 60) { loot.coins.sp = rollDice(4, 6); }
    else if (roll <= 70) { loot.coins.ep = rollDice(3, 6); }
    else if (roll <= 95) { loot.coins.gp = rollDice(3, 6); }
    else { loot.coins.pp = rollDice(1, 6); }
  } else if (tier === '5-10') {
    if (roll <= 30) { loot.coins.cp = rollDice(4, 6) * 100; loot.coins.ep = rollDice(1, 6) * 10; }
    else if (roll <= 60) { loot.coins.sp = rollDice(6, 6) * 10; loot.coins.gp = rollDice(2, 6) * 10; }
    else if (roll <= 70) { loot.coins.ep = rollDice(3, 6) * 10; loot.coins.gp = rollDice(2, 6) * 10; }
    else if (roll <= 95) { loot.coins.gp = rollDice(4, 6) * 10; }
    else { loot.coins.gp = rollDice(2, 6) * 10; loot.coins.pp = rollDice(3, 6); }
  } else if (tier === '11-16') {
    if (roll <= 20) { loot.coins.sp = rollDice(4, 6) * 100; loot.coins.gp = rollDice(1, 6) * 100; }
    else if (roll <= 35) { loot.coins.ep = rollDice(1, 6) * 100; loot.coins.gp = rollDice(1, 6) * 100; }
    else if (roll <= 75) { loot.coins.gp = rollDice(2, 6) * 100; loot.coins.pp = rollDice(1, 6) * 10; }
    else { loot.coins.gp = rollDice(2, 6) * 100; loot.coins.pp = rollDice(2, 6) * 10; }
  } else {
    if (roll <= 15) { loot.coins.ep = rollDice(2, 6) * 1000; loot.coins.gp = rollDice(8, 6) * 100; }
    else if (roll <= 55) { loot.coins.gp = rollDice(1, 6) * 1000; loot.coins.pp = rollDice(1, 6) * 100; }
    else { loot.coins.gp = rollDice(1, 6) * 1000; loot.coins.pp = rollDice(2, 6) * 100; }
  }

  return loot;
}

function generateHoard(tier) {
  var loot = { coins: {}, gems: [], art: [], magicItems: [], tier: tier, type: 'Treasure Hoard' };
  var roll = rollDice(1, 100);

  if (tier === '0-4') {
    loot.coins.cp = rollDice(6, 6) * 100;
    loot.coins.sp = rollDice(3, 6) * 100;
    loot.coins.gp = rollDice(2, 6) * 10;
    if (roll <= 6) { /* nothing extra */ }
    else if (roll <= 16) { addGems(loot, 10, rollDice(2, 6)); }
    else if (roll <= 26) { addArt(loot, 25, rollDice(2, 4)); }
    else if (roll <= 36) { addGems(loot, 50, rollDice(2, 6)); }
    else if (roll <= 44) { addGems(loot, 10, rollDice(2, 6)); addMagicItems(loot, 'A', rollDice(1, 6)); }
    else if (roll <= 52) { addArt(loot, 25, rollDice(2, 4)); addMagicItems(loot, 'A', rollDice(1, 6)); }
    else if (roll <= 60) { addGems(loot, 50, rollDice(2, 6)); addMagicItems(loot, 'A', rollDice(1, 6)); }
    else if (roll <= 65) { addGems(loot, 10, rollDice(2, 6)); addMagicItems(loot, 'B', rollDice(1, 4)); }
    else if (roll <= 70) { addArt(loot, 25, rollDice(2, 4)); addMagicItems(loot, 'B', rollDice(1, 4)); }
    else if (roll <= 75) { addGems(loot, 50, rollDice(2, 6)); addMagicItems(loot, 'B', rollDice(1, 4)); }
    else if (roll <= 78) { addGems(loot, 10, rollDice(2, 6)); addMagicItems(loot, 'C', rollDice(1, 4)); }
    else if (roll <= 80) { addArt(loot, 25, rollDice(2, 4)); addMagicItems(loot, 'C', rollDice(1, 4)); }
    else if (roll <= 85) { addGems(loot, 50, rollDice(2, 6)); addMagicItems(loot, 'C', rollDice(1, 4)); }
    else if (roll <= 92) { addArt(loot, 25, rollDice(2, 4)); addMagicItems(loot, 'F', rollDice(1, 4)); }
    else if (roll <= 97) { addGems(loot, 50, rollDice(2, 6)); addMagicItems(loot, 'F', rollDice(1, 4)); }
    else { addArt(loot, 25, rollDice(2, 4)); addMagicItems(loot, 'G', 1); }
  } else if (tier === '5-10') {
    loot.coins.cp = rollDice(2, 6) * 100;
    loot.coins.sp = rollDice(2, 6) * 1000;
    loot.coins.gp = rollDice(6, 6) * 100;
    loot.coins.pp = rollDice(3, 6) * 10;
    if (roll <= 4) { /* nothing extra */ }
    else if (roll <= 10) { addArt(loot, 25, rollDice(2, 4)); }
    else if (roll <= 16) { addGems(loot, 50, rollDice(3, 6)); }
    else if (roll <= 22) { addGems(loot, 100, rollDice(3, 6)); }
    else if (roll <= 28) { addArt(loot, 250, rollDice(2, 4)); }
    else if (roll <= 32) { addArt(loot, 25, rollDice(2, 4)); addMagicItems(loot, 'A', rollDice(1, 6)); }
    else if (roll <= 36) { addGems(loot, 50, rollDice(3, 6)); addMagicItems(loot, 'A', rollDice(1, 6)); }
    else if (roll <= 40) { addGems(loot, 100, rollDice(3, 6)); addMagicItems(loot, 'A', rollDice(1, 6)); }
    else if (roll <= 44) { addArt(loot, 250, rollDice(2, 4)); addMagicItems(loot, 'A', rollDice(1, 6)); }
    else if (roll <= 49) { addArt(loot, 25, rollDice(2, 4)); addMagicItems(loot, 'B', rollDice(1, 4)); }
    else if (roll <= 54) { addGems(loot, 50, rollDice(3, 6)); addMagicItems(loot, 'B', rollDice(1, 4)); }
    else if (roll <= 59) { addGems(loot, 100, rollDice(3, 6)); addMagicItems(loot, 'B', rollDice(1, 4)); }
    else if (roll <= 63) { addArt(loot, 250, rollDice(2, 4)); addMagicItems(loot, 'B', rollDice(1, 4)); }
    else if (roll <= 66) { addArt(loot, 25, rollDice(2, 4)); addMagicItems(loot, 'C', rollDice(1, 4)); }
    else if (roll <= 69) { addGems(loot, 50, rollDice(3, 6)); addMagicItems(loot, 'C', rollDice(1, 4)); }
    else if (roll <= 72) { addGems(loot, 100, rollDice(3, 6)); addMagicItems(loot, 'C', rollDice(1, 4)); }
    else if (roll <= 74) { addArt(loot, 250, rollDice(2, 4)); addMagicItems(loot, 'C', rollDice(1, 4)); }
    else if (roll <= 76) { addArt(loot, 25, rollDice(2, 4)); addMagicItems(loot, 'D', 1); }
    else if (roll <= 78) { addGems(loot, 50, rollDice(3, 6)); addMagicItems(loot, 'D', 1); }
    else if (roll <= 79) { addGems(loot, 100, rollDice(3, 6)); addMagicItems(loot, 'D', 1); }
    else if (roll <= 80) { addArt(loot, 250, rollDice(2, 4)); addMagicItems(loot, 'D', 1); }
    else if (roll <= 84) { addArt(loot, 25, rollDice(2, 4)); addMagicItems(loot, 'F', rollDice(1, 4)); }
    else if (roll <= 88) { addGems(loot, 50, rollDice(3, 6)); addMagicItems(loot, 'F', rollDice(1, 4)); }
    else if (roll <= 91) { addGems(loot, 100, rollDice(3, 6)); addMagicItems(loot, 'F', rollDice(1, 4)); }
    else if (roll <= 94) { addArt(loot, 250, rollDice(2, 4)); addMagicItems(loot, 'F', rollDice(1, 4)); }
    else if (roll <= 96) { addGems(loot, 100, rollDice(3, 6)); addMagicItems(loot, 'G', rollDice(1, 4)); }
    else if (roll <= 98) { addArt(loot, 250, rollDice(2, 4)); addMagicItems(loot, 'G', rollDice(1, 4)); }
    else { addGems(loot, 100, rollDice(3, 6)); addMagicItems(loot, 'H', 1); }
  } else if (tier === '11-16') {
    loot.coins.gp = rollDice(4, 6) * 1000;
    loot.coins.pp = rollDice(5, 6) * 100;
    if (roll <= 3) { /* nothing extra */ }
    else if (roll <= 6) { addArt(loot, 250, rollDice(2, 4)); }
    else if (roll <= 9) { addArt(loot, 750, rollDice(2, 4)); }
    else if (roll <= 12) { addGems(loot, 500, rollDice(3, 6)); }
    else if (roll <= 15) { addGems(loot, 1000, rollDice(3, 6)); }
    else if (roll <= 19) { addArt(loot, 250, rollDice(2, 4)); addMagicItems(loot, 'A', rollDice(1, 4)); addMagicItems(loot, 'B', rollDice(1, 6)); }
    else if (roll <= 23) { addArt(loot, 750, rollDice(2, 4)); addMagicItems(loot, 'A', rollDice(1, 4)); addMagicItems(loot, 'B', rollDice(1, 6)); }
    else if (roll <= 26) { addGems(loot, 500, rollDice(3, 6)); addMagicItems(loot, 'A', rollDice(1, 4)); addMagicItems(loot, 'B', rollDice(1, 6)); }
    else if (roll <= 29) { addGems(loot, 1000, rollDice(3, 6)); addMagicItems(loot, 'A', rollDice(1, 4)); addMagicItems(loot, 'B', rollDice(1, 6)); }
    else if (roll <= 35) { addArt(loot, 250, rollDice(2, 4)); addMagicItems(loot, 'C', rollDice(1, 6)); }
    else if (roll <= 40) { addArt(loot, 750, rollDice(2, 4)); addMagicItems(loot, 'C', rollDice(1, 6)); }
    else if (roll <= 45) { addGems(loot, 500, rollDice(3, 6)); addMagicItems(loot, 'C', rollDice(1, 6)); }
    else if (roll <= 50) { addGems(loot, 1000, rollDice(3, 6)); addMagicItems(loot, 'C', rollDice(1, 6)); }
    else if (roll <= 54) { addArt(loot, 250, rollDice(2, 4)); addMagicItems(loot, 'D', rollDice(1, 4)); }
    else if (roll <= 58) { addArt(loot, 750, rollDice(2, 4)); addMagicItems(loot, 'D', rollDice(1, 4)); }
    else if (roll <= 62) { addGems(loot, 500, rollDice(3, 6)); addMagicItems(loot, 'D', rollDice(1, 4)); }
    else if (roll <= 66) { addGems(loot, 1000, rollDice(3, 6)); addMagicItems(loot, 'D', rollDice(1, 4)); }
    else if (roll <= 68) { addArt(loot, 250, rollDice(2, 4)); addMagicItems(loot, 'E', 1); }
    else if (roll <= 70) { addArt(loot, 750, rollDice(2, 4)); addMagicItems(loot, 'E', 1); }
    else if (roll <= 72) { addGems(loot, 500, rollDice(3, 6)); addMagicItems(loot, 'E', 1); }
    else if (roll <= 74) { addGems(loot, 1000, rollDice(3, 6)); addMagicItems(loot, 'E', 1); }
    else if (roll <= 76) { addArt(loot, 250, rollDice(2, 4)); addMagicItems(loot, 'F', rollDice(1, 4)); addMagicItems(loot, 'G', rollDice(1, 4)); }
    else if (roll <= 78) { addArt(loot, 750, rollDice(2, 4)); addMagicItems(loot, 'F', rollDice(1, 4)); addMagicItems(loot, 'G', rollDice(1, 4)); }
    else if (roll <= 80) { addGems(loot, 500, rollDice(3, 6)); addMagicItems(loot, 'F', rollDice(1, 4)); addMagicItems(loot, 'G', rollDice(1, 4)); }
    else if (roll <= 82) { addGems(loot, 1000, rollDice(3, 6)); addMagicItems(loot, 'F', rollDice(1, 4)); addMagicItems(loot, 'G', rollDice(1, 4)); }
    else if (roll <= 85) { addArt(loot, 250, rollDice(2, 4)); addMagicItems(loot, 'H', rollDice(1, 4)); }
    else if (roll <= 88) { addArt(loot, 750, rollDice(2, 4)); addMagicItems(loot, 'H', rollDice(1, 4)); }
    else if (roll <= 90) { addGems(loot, 500, rollDice(3, 6)); addMagicItems(loot, 'H', rollDice(1, 4)); }
    else if (roll <= 92) { addGems(loot, 1000, rollDice(3, 6)); addMagicItems(loot, 'H', rollDice(1, 4)); }
    else if (roll <= 94) { addArt(loot, 250, rollDice(2, 4)); addMagicItems(loot, 'I', 1); }
    else if (roll <= 96) { addArt(loot, 750, rollDice(2, 4)); addMagicItems(loot, 'I', 1); }
    else if (roll <= 98) { addGems(loot, 500, rollDice(3, 6)); addMagicItems(loot, 'I', 1); }
    else { addGems(loot, 1000, rollDice(3, 6)); addMagicItems(loot, 'I', 1); }
  } else {
    // CR 17+
    loot.coins.gp = rollDice(12, 6) * 1000;
    loot.coins.pp = rollDice(8, 6) * 1000;
    if (roll <= 2) { /* nothing extra */ }
    else if (roll <= 5) { addGems(loot, 1000, rollDice(3, 6)); addMagicItems(loot, 'C', rollDice(1, 8)); }
    else if (roll <= 8) { addArt(loot, 2500, rollDice(1, 10)); addMagicItems(loot, 'C', rollDice(1, 8)); }
    else if (roll <= 11) { addArt(loot, 7500, rollDice(1, 4)); addMagicItems(loot, 'C', rollDice(1, 8)); }
    else if (roll <= 14) { addGems(loot, 5000, rollDice(1, 8)); addMagicItems(loot, 'C', rollDice(1, 8)); }
    else if (roll <= 22) { addGems(loot, 1000, rollDice(3, 6)); addMagicItems(loot, 'D', rollDice(1, 6)); }
    else if (roll <= 30) { addArt(loot, 2500, rollDice(1, 10)); addMagicItems(loot, 'D', rollDice(1, 6)); }
    else if (roll <= 38) { addArt(loot, 7500, rollDice(1, 4)); addMagicItems(loot, 'D', rollDice(1, 6)); }
    else if (roll <= 46) { addGems(loot, 5000, rollDice(1, 8)); addMagicItems(loot, 'D', rollDice(1, 6)); }
    else if (roll <= 52) { addGems(loot, 1000, rollDice(3, 6)); addMagicItems(loot, 'E', rollDice(1, 6)); }
    else if (roll <= 58) { addArt(loot, 2500, rollDice(1, 10)); addMagicItems(loot, 'E', rollDice(1, 6)); }
    else if (roll <= 63) { addArt(loot, 7500, rollDice(1, 4)); addMagicItems(loot, 'E', rollDice(1, 6)); }
    else if (roll <= 68) { addGems(loot, 5000, rollDice(1, 8)); addMagicItems(loot, 'E', rollDice(1, 6)); }
    else if (roll <= 69) { addGems(loot, 1000, rollDice(3, 6)); addMagicItems(loot, 'G', rollDice(1, 4)); addMagicItems(loot, 'I', 1); }
    else if (roll <= 70) { addArt(loot, 2500, rollDice(1, 10)); addMagicItems(loot, 'G', rollDice(1, 4)); addMagicItems(loot, 'I', 1); }
    else if (roll <= 71) { addArt(loot, 7500, rollDice(1, 4)); addMagicItems(loot, 'G', rollDice(1, 4)); addMagicItems(loot, 'I', 1); }
    else if (roll <= 72) { addGems(loot, 5000, rollDice(1, 8)); addMagicItems(loot, 'G', rollDice(1, 4)); addMagicItems(loot, 'I', 1); }
    else if (roll <= 74) { addGems(loot, 1000, rollDice(3, 6)); addMagicItems(loot, 'H', rollDice(1, 4)); }
    else if (roll <= 76) { addArt(loot, 2500, rollDice(1, 10)); addMagicItems(loot, 'H', rollDice(1, 4)); }
    else if (roll <= 78) { addArt(loot, 7500, rollDice(1, 4)); addMagicItems(loot, 'H', rollDice(1, 4)); }
    else if (roll <= 80) { addGems(loot, 5000, rollDice(1, 8)); addMagicItems(loot, 'H', rollDice(1, 4)); }
    else if (roll <= 85) { addGems(loot, 1000, rollDice(3, 6)); addMagicItems(loot, 'I', rollDice(1, 4)); }
    else if (roll <= 90) { addArt(loot, 2500, rollDice(1, 10)); addMagicItems(loot, 'I', rollDice(1, 4)); }
    else if (roll <= 95) { addArt(loot, 7500, rollDice(1, 4)); addMagicItems(loot, 'I', rollDice(1, 4)); }
    else { addGems(loot, 5000, rollDice(1, 8)); addMagicItems(loot, 'I', rollDice(1, 4)); }
  }

  return loot;
}

function addGems(loot, gpValue, count) {
  var gemList = GEMS[gpValue] || GEMS[10];
  for (var i = 0; i < count; i++) {
    loot.gems.push({ name: pick(gemList), value: gpValue });
  }
}

function addArt(loot, gpValue, count) {
  var artList = ART_OBJECTS[gpValue] || ART_OBJECTS[25];
  for (var i = 0; i < count; i++) {
    loot.art.push({ name: pick(artList), value: gpValue });
  }
}

function addMagicItems(loot, table, count) {
  var items = MAGIC_ITEMS[table] || MAGIC_ITEMS['A'];
  for (var i = 0; i < count; i++) {
    loot.magicItems.push({ name: pick(items), table: table });
  }
}

// ── Rendering ───────────────────────────────────────────

function renderLoot(loot) {
  var output = document.getElementById('loot-output');
  var htmlStr = '';

  // Header
  htmlStr += '<div class="card" style="padding:18px;">';
  htmlStr += '<h3 style="margin:0 0 10px; color:var(--accent);">' + escapeHtml(loot.type) + ' - CR ' + escapeHtml(loot.tier) + '</h3>';

  // Coins
  var coinParts = [];
  if (loot.coins.pp) coinParts.push(loot.coins.pp + ' pp');
  if (loot.coins.gp) coinParts.push(loot.coins.gp + ' gp');
  if (loot.coins.ep) coinParts.push(loot.coins.ep + ' ep');
  if (loot.coins.sp) coinParts.push(loot.coins.sp + ' sp');
  if (loot.coins.cp) coinParts.push(loot.coins.cp + ' cp');

  if (coinParts.length > 0) {
    htmlStr += '<div style="margin-bottom:12px;"><strong>Coins:</strong> ' + escapeHtml(coinParts.join(', ')) + '</div>';
  } else {
    htmlStr += '<div style="margin-bottom:12px; color:var(--text-dim);"><em>No coins.</em></div>';
  }

  // Gems
  if (loot.gems.length > 0) {
    htmlStr += '<div style="margin-bottom:12px;"><strong>Gems (' + loot.gems.length + '):</strong><ul style="margin:4px 0; padding-left:20px;">';
    // Group by name and value
    var gemGroups = {};
    loot.gems.forEach(function (g) {
      var key = g.name + ' (' + g.value + ' gp)';
      gemGroups[key] = (gemGroups[key] || 0) + 1;
    });
    Object.keys(gemGroups).forEach(function (key) {
      var count = gemGroups[key];
      htmlStr += '<li>' + (count > 1 ? count + 'x ' : '') + escapeHtml(key) + '</li>';
    });
    htmlStr += '</ul></div>';
  }

  // Art objects
  if (loot.art.length > 0) {
    htmlStr += '<div style="margin-bottom:12px;"><strong>Art Objects (' + loot.art.length + '):</strong><ul style="margin:4px 0; padding-left:20px;">';
    loot.art.forEach(function (a) {
      htmlStr += '<li>' + escapeHtml(a.name) + ' <span style="color:var(--text-dim);">(' + a.value + ' gp)</span></li>';
    });
    htmlStr += '</ul></div>';
  }

  // Magic items
  if (loot.magicItems.length > 0) {
    htmlStr += '<div style="margin-bottom:4px;"><strong>Magic Items (' + loot.magicItems.length + '):</strong><ul style="margin:4px 0; padding-left:20px;">';
    loot.magicItems.forEach(function (m) {
      htmlStr += '<li>' + escapeHtml(m.name) + ' <span style="color:var(--text-dim);">[Table ' + escapeHtml(m.table) + ']</span></li>';
    });
    htmlStr += '</ul></div>';
  }

  // Total value estimate
  var totalGP = (loot.coins.pp || 0) * 10 + (loot.coins.gp || 0) + (loot.coins.ep || 0) * 0.5 + (loot.coins.sp || 0) * 0.1 + (loot.coins.cp || 0) * 0.01;
  loot.gems.forEach(function (g) { totalGP += g.value; });
  loot.art.forEach(function (a) { totalGP += a.value; });
  htmlStr += '<div style="margin-top:10px; padding-top:10px; border-top:1px solid var(--border); color:var(--text-dim);">';
  htmlStr += '<strong>Estimated Total Value:</strong> ~' + Math.round(totalGP) + ' gp (excluding magic items)';
  htmlStr += '</div>';

  htmlStr += '</div>';
  output.innerHTML = htmlStr;
}

function copyLoot() {
  var output = document.getElementById('loot-output');
  if (!output || !output.textContent.trim()) {
    showToast('Generate loot first!', 'info');
    return;
  }
  navigator.clipboard.writeText(output.textContent)
    .then(function () { showToast('Loot copied!', 'success'); })
    .catch(function () { showToast('Copy failed.', 'error'); });
}
