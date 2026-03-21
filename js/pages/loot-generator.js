// =============================================
//   loot-generator.js - Loot & Treasure Generator
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
})();

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
      htmlStr += '<li>' + escapeHtml(m.name) + '</li>';
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

// ── Tab switching ───────────────────────────────────────

function setLootTab(tab, btn) {
  document.querySelectorAll('.gen-tab').forEach(function (b) { b.classList.remove('active-gen-tab'); });
  btn.classList.add('active-gen-tab');
  document.getElementById('hoard-controls').style.display     = tab === 'hoard'     ? '' : 'none';
  document.getElementById('encounter-controls').style.display = tab === 'encounter' ? '' : 'none';
  document.getElementById('body-controls').style.display      = tab === 'body'      ? '' : 'none';
  document.getElementById('room-controls').style.display      = tab === 'room'      ? '' : 'none';
  document.getElementById('trinket-controls').style.display   = tab === 'trinket'   ? '' : 'none';
  document.getElementById('loot-output').innerHTML = '';
}

// ── Mundane Items Tables ────────────────────────────────

var MUNDANE_WEAPONS = ['Dagger', 'Shortsword', 'Handaxe', 'Javelin', 'Light crossbow with 10 bolts', 'Shortbow with 12 arrows', 'Mace', 'Quarterstaff', 'Club', 'Spear', 'Sling with 20 bullets'];
var MUNDANE_ARMOR = ['Leather armor', 'Padded armor', 'Shield', 'Hide armor', 'Chain shirt', 'Studded leather armor'];
var MUNDANE_GEAR = ['50 ft of hempen rope', 'Tinderbox', 'Bedroll', 'Waterskin', 'Rations (3 days)', 'Torch (2)', 'Crowbar', 'Grappling hook', 'Iron pot', 'Mess kit', 'Pitons (10)', 'Belt pouch', 'Sack', 'Caltrops (bag of 20)', 'Ball bearings (bag of 1,000)', 'Chalk (3 pieces)', 'String (10 ft)', 'Small knife', 'Candles (5)', 'Fishing tackle', 'Block and tackle', 'Chain (10 ft)', 'Hammer', 'Hunting trap', 'Lantern (hooded)', 'Lock (iron)', 'Manacles', 'Mirror (steel)', 'Oil flask', 'Healer\'s kit', 'Antitoxin vial', 'Ink bottle and pen', 'Parchment (3 sheets)', 'Soap bar', 'Whetstone'];
var CLOTHING = ['Common clothes', 'Traveler\'s cloak', 'Fine clothes', 'Leather boots', 'Hooded cloak', 'Worn gloves', 'Wide-brimmed hat', 'Fur-lined cloak', 'Silk scarf', 'Costume clothes', 'Robes'];
var VALUABLES = ['Silver ring', 'Copper bracelet', 'Small jade pendant', 'Ivory comb', 'Embroidered handkerchief', 'Silver earring', 'Pearl button', 'Gold tooth (pulled)', 'Crystal vial', 'Pewter tankard with initials', 'Carved wooden figurine', 'Brass locket with a portrait', 'Onyx chess piece', 'Silver holy symbol', 'Turquoise brooch', 'Coral hair pin'];
var DOCUMENTS = ['Crumpled letter from a loved one', 'Map fragment showing a nearby region', 'Wanted poster (for someone else)', 'Tavern receipt', 'Deed to a small plot of land', 'List of names (some crossed out)', 'Coded message', 'Bounty notice', 'Love letter (unsent)', 'Page torn from a spellbook', 'Trade guild membership card', 'IOU note for 50 gp', 'Diary entry about a secret passage', 'Hand-drawn map to a hidden cache', 'Contract for a shady job', 'Recipe for a local ale'];
var FOOD_DRINK = ['Flask of cheap wine', 'Dried meat strips', 'Wheel of cheese', 'Loaf of bread (slightly stale)', 'Flask of dwarven ale', 'Bag of nuts and dried fruit', 'Bottle of fine wine', 'Flask of brandy', 'Honey jar', 'Pouch of tea leaves', 'Pickled eggs (jar)', 'Jerky (mystery meat)'];
var CURIOSITIES = ['Lucky rabbit\'s foot', 'Wooden holy symbol', 'Loaded dice', 'Worn playing cards', 'Small hand mirror', 'Pipe and tobacco pouch', 'Harmonica', 'Bag of marbles', 'Wooden flute', 'Compass (cracked glass)', 'Magnifying glass', 'Hourglass (small)', 'Dice set (bone)', 'Bird whistle', 'Jar of fireflies (dead)', 'Snuff box', 'Corkscrew', 'Jar of strange-smelling salve', 'Tiny music box', 'Glass eye', 'Locket with a lock of hair', 'Collection of feathers', 'Pouch of polished stones', 'Sketch of an unknown face', 'Wooden toy soldier', 'Key to an unknown lock', 'Severed finger (preserved)', 'Vial of perfume', 'Monocle', 'Tiny bell'];
var TOOLS_KITS = ['Thieves\' tools', 'Herbalism kit', 'Alchemist\'s supplies', 'Poisoner\'s kit', 'Disguise kit', 'Forgery kit', 'Carpenter\'s tools', 'Smith\'s tools', 'Cook\'s utensils', 'Brewer\'s supplies', 'Cartographer\'s tools', 'Navigator\'s tools'];
var BOOKS_SCROLLS = ['Bestiary of local fauna', 'Prayer book', 'Book of riddles', 'History of the local region', 'Herbalist\'s field guide', 'Almanac (current year)', 'Grimoire (blank)', 'Poetry collection', 'Cookbook (exotic recipes)', 'Adventurer\'s journal (half-filled)', 'Scroll of lineage', 'Tome of religious doctrine', 'Book of local legends', 'Manual of traps and locks', 'Star chart'];
var POTIONS_CONSUMABLES = ['Potion of healing', 'Antitoxin', 'Alchemist\'s fire', 'Acid vial', 'Holy water', 'Oil of taggit (poison)', 'Potion of climbing', 'Perfume (vial)', 'Smokestick', 'Tanglefoot bag'];
var RELIGIOUS = ['Holy symbol (wooden)', 'Holy symbol (silver)', 'Incense (10 sticks)', 'Prayer beads', 'Vial of holy water', 'Small idol of a deity', 'Candle of meditation', 'Offering bowl', 'Ceremonial dagger', 'Book of prayers'];

var TRINKETS = [
  'A mummified goblin hand', 'A piece of crystal that faintly glows in the moonlight',
  'A gold coin minted in an unknown land', 'A diary written in a language you don\'t know',
  'A brass ring that never tarnishes', 'An old chess piece made from glass',
  'A pair of knucklebone dice with skulls on the 6 side', 'A small idol depicting a nightmarish creature',
  'A lock of someone\'s hair tied with a black ribbon', 'A four-leaf clover pressed inside a heavy book',
  'A small mechanical crab or spider', 'A glass jar containing a weird bit of flesh floating in pickling fluid',
  'A tiny gnome-crafted music box that plays a song you dimly remember', 'A small wooden statuette of a smug halfling',
  'A brass orb etched with strange runes', 'A multicolored stone disk',
  'A petrified mouse', 'A black pirate flag with a skull and crossbones',
  'A tiny silver bell that makes no sound', 'A mechanical canary inside a gnomish lamp',
  'A tiny chest carved from the bone of an unknown beast', 'A dead sprite inside a glass bottle',
  'A metal can that has no opening but sounds like it is full of liquid',
  'A glass orb filled with moving smoke', 'A 1-ounce egg with a bright red shell',
  'A pipe that blows bubbles', 'A glass eye that looks around of its own accord',
  'A small box with a sliding puzzle on its lid', 'A signet ring of an unknown noble house',
  'A tooth from an unknown beast', 'An enormous nail made from an unusual metal',
  'A candle that can\'t be lit', 'A fan that, when unfolded, shows a sleeping cat',
  'An ornate scabbard that doesn\'t fit any sword you\'ve found', 'An invitation to a party where a murder happened',
  'A bronze pentacle with an etching of a rat\'s head in its center',
  'A purple handkerchief embroidered with the name of an archmage',
  'Half of a floorplan for a temple or castle', 'A folded cloth that contains a pressed flower',
  'A receipt for a deposit at a bank in a far-off city', 'A blank book whose pages refuse to hold ink or chalk',
  'A silver badge shaped like a five-pointed star', 'A knife that belonged to a relative',
  'A vial of dragon blood', 'A tiny meteorite', 'A glass eye with a slit pupil',
  'An old divination card bearing your likeness', 'A feathered token from a griffin',
  'A bone from a troll', 'A small stone cube with a glyph on each face',
  'A coin-sized gear from a clockwork mechanism', 'A pair of old socks',
  'A blank page torn from a wizard\'s spellbook', 'A small stone with a hole through the center',
  'A tiny twig doll with button eyes', 'A portrait of a goblin general',
  'A miniature brass horn', 'A shrunken head', 'A bottle of invisible ink',
  'A shard of obsidian that always feels warm', 'A rag doll with the name of a child stitched on it'
];

// ── Body / Pocket Loot ──────────────────────────────────

var BODY_TABLES = {
  commoner: {
    coins: function() { return { cp: rollDice(2,6), sp: rollDice(1,4) }; },
    items: function() {
      var items = [];
      items.push(pick(FOOD_DRINK));
      if (Math.random() < 0.6) items.push(pick(CURIOSITIES));
      if (Math.random() < 0.3) items.push(pick(CLOTHING));
      if (Math.random() < 0.2) items.push(pick(DOCUMENTS));
      if (Math.random() < 0.1) items.push(pick(VALUABLES));
      return items;
    }
  },
  merchant: {
    coins: function() { return { sp: rollDice(3,6), gp: rollDice(2,6) }; },
    items: function() {
      var items = [];
      items.push(pick(DOCUMENTS));
      items.push(pick(VALUABLES));
      if (Math.random() < 0.5) items.push(pick(MUNDANE_GEAR));
      if (Math.random() < 0.5) items.push(pick(FOOD_DRINK));
      if (Math.random() < 0.3) items.push(pick(CURIOSITIES));
      if (Math.random() < 0.2) items.push(pick(TOOLS_KITS));
      return items;
    }
  },
  soldier: {
    coins: function() { return { sp: rollDice(2,6), gp: rollDice(1,6) }; },
    items: function() {
      var items = [];
      items.push(pick(MUNDANE_WEAPONS));
      if (Math.random() < 0.5) items.push(pick(MUNDANE_ARMOR));
      items.push(pick(MUNDANE_GEAR));
      if (Math.random() < 0.4) items.push(pick(FOOD_DRINK));
      if (Math.random() < 0.3) items.push(pick(CURIOSITIES));
      if (Math.random() < 0.2) items.push(pick(DOCUMENTS));
      return items;
    }
  },
  bandit: {
    coins: function() { return { cp: rollDice(3,6), sp: rollDice(2,6), gp: rollDice(1,6) }; },
    items: function() {
      var items = [];
      items.push(pick(MUNDANE_WEAPONS));
      items.push(pick(VALUABLES));
      if (Math.random() < 0.5) items.push(pick(CURIOSITIES));
      if (Math.random() < 0.4) items.push(pick(FOOD_DRINK));
      if (Math.random() < 0.3) items.push(pick(DOCUMENTS));
      if (Math.random() < 0.2) items.push(pick(TOOLS_KITS));
      if (Math.random() < 0.1) items.push(pick(POTIONS_CONSUMABLES));
      return items;
    }
  },
  noble: {
    coins: function() { return { gp: rollDice(4,6), pp: rollDice(1,4) }; },
    items: function() {
      var items = [];
      items.push(pick(VALUABLES));
      items.push(pick(VALUABLES));
      items.push('Fine clothes');
      if (Math.random() < 0.5) items.push(pick(DOCUMENTS));
      if (Math.random() < 0.4) items.push(pick(FOOD_DRINK));
      if (Math.random() < 0.3) items.push(pick(CURIOSITIES));
      if (Math.random() < 0.2) items.push(pick(BOOKS_SCROLLS));
      return items;
    }
  },
  adventurer: {
    coins: function() { return { sp: rollDice(3,6), gp: rollDice(3,6) }; },
    items: function() {
      var items = [];
      items.push(pick(MUNDANE_WEAPONS));
      items.push(pick(MUNDANE_ARMOR));
      items.push(pick(MUNDANE_GEAR));
      items.push(pick(MUNDANE_GEAR));
      if (Math.random() < 0.5) items.push(pick(POTIONS_CONSUMABLES));
      if (Math.random() < 0.4) items.push(pick(FOOD_DRINK));
      if (Math.random() < 0.3) items.push(pick(CURIOSITIES));
      if (Math.random() < 0.3) items.push(pick(VALUABLES));
      if (Math.random() < 0.2) items.push(pick(DOCUMENTS));
      return items;
    }
  },
  mage: {
    coins: function() { return { sp: rollDice(2,6), gp: rollDice(2,6) }; },
    items: function() {
      var items = [];
      items.push(pick(BOOKS_SCROLLS));
      items.push(pick(POTIONS_CONSUMABLES));
      if (Math.random() < 0.6) items.push(pick(CURIOSITIES));
      if (Math.random() < 0.5) items.push(pick(MUNDANE_GEAR));
      if (Math.random() < 0.3) items.push(pick(DOCUMENTS));
      if (Math.random() < 0.3) items.push(pick(VALUABLES));
      if (Math.random() < 0.2) items.push(pick(TOOLS_KITS));
      return items;
    }
  },
  cultist: {
    coins: function() { return { cp: rollDice(2,6), sp: rollDice(1,6) }; },
    items: function() {
      var items = [];
      items.push(pick(RELIGIOUS));
      items.push(pick(CURIOSITIES));
      if (Math.random() < 0.5) items.push(pick(DOCUMENTS));
      if (Math.random() < 0.4) items.push(pick(MUNDANE_WEAPONS));
      if (Math.random() < 0.3) items.push(pick(POTIONS_CONSUMABLES));
      if (Math.random() < 0.2) items.push(pick(VALUABLES));
      return items;
    }
  }
};

function generateBodyLoot() {
  var type = document.getElementById('body-type').value;
  var table = BODY_TABLES[type];
  var coins = table.coins();
  var items = table.items();

  // Chance for a trinket
  if (Math.random() < 0.25) items.push(pick(TRINKETS));

  renderGenericLoot('Body Search: ' + capitalize(type), coins, items);
}

// ── Room / Chest Loot ───────────────────────────────────

var ROOM_TABLES = {
  peasant: {
    coins: function() { return { cp: rollDice(3,6), sp: rollDice(1,4) }; },
    items: function() {
      var items = [];
      items.push(pick(FOOD_DRINK)); items.push(pick(FOOD_DRINK));
      items.push(pick(MUNDANE_GEAR));
      items.push(pick(CLOTHING));
      if (Math.random() < 0.3) items.push(pick(TOOLS_KITS));
      if (Math.random() < 0.2) items.push(pick(CURIOSITIES));
      return items;
    }
  },
  tavern: {
    coins: function() { return { cp: rollDice(4,6), sp: rollDice(3,6), gp: rollDice(1,6) }; },
    items: function() {
      var items = [];
      items.push(pick(FOOD_DRINK)); items.push(pick(FOOD_DRINK)); items.push(pick(FOOD_DRINK));
      items.push(pick(MUNDANE_GEAR));
      if (Math.random() < 0.5) items.push(pick(DOCUMENTS));
      if (Math.random() < 0.4) items.push(pick(CURIOSITIES));
      if (Math.random() < 0.3) items.push(pick(CLOTHING));
      return items;
    }
  },
  shop: {
    coins: function() { return { sp: rollDice(4,6), gp: rollDice(2,6) }; },
    items: function() {
      var items = [];
      items.push(pick(MUNDANE_GEAR)); items.push(pick(MUNDANE_GEAR)); items.push(pick(MUNDANE_GEAR));
      items.push(pick(TOOLS_KITS));
      if (Math.random() < 0.5) items.push(pick(VALUABLES));
      if (Math.random() < 0.4) items.push(pick(DOCUMENTS));
      if (Math.random() < 0.3) items.push(pick(CURIOSITIES));
      return items;
    }
  },
  barracks: {
    coins: function() { return { sp: rollDice(2,6), gp: rollDice(1,4) }; },
    items: function() {
      var items = [];
      items.push(pick(MUNDANE_WEAPONS)); items.push(pick(MUNDANE_WEAPONS));
      items.push(pick(MUNDANE_ARMOR));
      items.push(pick(MUNDANE_GEAR)); items.push(pick(MUNDANE_GEAR));
      if (Math.random() < 0.4) items.push(pick(FOOD_DRINK));
      if (Math.random() < 0.3) items.push(pick(CURIOSITIES));
      return items;
    }
  },
  temple: {
    coins: function() { return { sp: rollDice(3,6), gp: rollDice(2,6) }; },
    items: function() {
      var items = [];
      items.push(pick(RELIGIOUS)); items.push(pick(RELIGIOUS));
      items.push(pick(VALUABLES));
      if (Math.random() < 0.5) items.push(pick(BOOKS_SCROLLS));
      if (Math.random() < 0.4) items.push(pick(POTIONS_CONSUMABLES));
      if (Math.random() < 0.3) items.push(pick(CURIOSITIES));
      if (Math.random() < 0.2) items.push(pick(DOCUMENTS));
      return items;
    }
  },
  library: {
    coins: function() { return { sp: rollDice(1,6), gp: rollDice(1,4) }; },
    items: function() {
      var items = [];
      items.push(pick(BOOKS_SCROLLS)); items.push(pick(BOOKS_SCROLLS)); items.push(pick(BOOKS_SCROLLS));
      items.push(pick(DOCUMENTS));
      if (Math.random() < 0.5) items.push(pick(CURIOSITIES));
      if (Math.random() < 0.3) items.push(pick(MUNDANE_GEAR));
      if (Math.random() < 0.2) items.push(pick(VALUABLES));
      return items;
    }
  },
  dungeon: {
    coins: function() { return { sp: rollDice(3,6), gp: rollDice(2,6) }; },
    items: function() {
      var items = [];
      items.push(pick(MUNDANE_WEAPONS));
      items.push(pick(MUNDANE_GEAR)); items.push(pick(MUNDANE_GEAR));
      if (Math.random() < 0.5) items.push(pick(CURIOSITIES));
      if (Math.random() < 0.4) items.push(pick(VALUABLES));
      if (Math.random() < 0.3) items.push(pick(POTIONS_CONSUMABLES));
      if (Math.random() < 0.3) items.push(pick(MUNDANE_ARMOR));
      if (Math.random() < 0.2) items.push(pick(DOCUMENTS));
      if (Math.random() < 0.15) items.push(pick(TRINKETS));
      return items;
    }
  },
  vault: {
    coins: function() { return { gp: rollDice(6,6) * 10, pp: rollDice(2,6) }; },
    items: function() {
      var items = [];
      items.push(pick(VALUABLES)); items.push(pick(VALUABLES)); items.push(pick(VALUABLES));
      items.push(pick(DOCUMENTS));
      if (Math.random() < 0.6) items.push(pick(POTIONS_CONSUMABLES));
      if (Math.random() < 0.5) items.push(pick(CURIOSITIES));
      if (Math.random() < 0.4) { var g = Object.keys(GEMS); items.push(pick(GEMS[pick(g)]) + ' (gem)'); }
      if (Math.random() < 0.3) { var a = Object.keys(ART_OBJECTS); items.push(pick(ART_OBJECTS[pick(a)])); }
      return items;
    }
  },
  wizard: {
    coins: function() { return { gp: rollDice(3,6), pp: rollDice(1,4) }; },
    items: function() {
      var items = [];
      items.push(pick(BOOKS_SCROLLS)); items.push(pick(BOOKS_SCROLLS));
      items.push(pick(POTIONS_CONSUMABLES)); items.push(pick(POTIONS_CONSUMABLES));
      items.push(pick(CURIOSITIES));
      if (Math.random() < 0.5) items.push(pick(TOOLS_KITS));
      if (Math.random() < 0.4) items.push(pick(VALUABLES));
      if (Math.random() < 0.3) items.push(pick(DOCUMENTS));
      if (Math.random() < 0.2) items.push(pick(TRINKETS));
      return items;
    }
  },
  tomb: {
    coins: function() { return { gp: rollDice(4,6) * 5, pp: rollDice(1,6) }; },
    items: function() {
      var items = [];
      items.push(pick(VALUABLES)); items.push(pick(VALUABLES));
      items.push(pick(RELIGIOUS));
      items.push(pick(CURIOSITIES));
      if (Math.random() < 0.5) items.push(pick(MUNDANE_WEAPONS));
      if (Math.random() < 0.4) items.push(pick(MUNDANE_ARMOR));
      if (Math.random() < 0.3) items.push(pick(DOCUMENTS));
      if (Math.random() < 0.3) items.push(pick(TRINKETS));
      if (Math.random() < 0.2) items.push(pick(POTIONS_CONSUMABLES));
      return items;
    }
  }
};

function generateRoomLoot() {
  var type = document.getElementById('room-type').value;
  var table = ROOM_TABLES[type];
  var coins = table.coins();
  var items = table.items();
  renderGenericLoot('Room Search: ' + capitalize(type.replace(/-/g, ' ')), coins, items);
}

// ── Trinkets ────────────────────────────────────────────

function generateTrinkets() {
  var count = parseInt(document.getElementById('trinket-count').value, 10) || 3;
  var results = [];
  var used = {};
  for (var i = 0; i < count; i++) {
    var t;
    var attempts = 0;
    do { t = pick(TRINKETS); attempts++; } while (used[t] && attempts < 50);
    used[t] = true;
    results.push(t);
  }

  var output = document.getElementById('loot-output');
  var html = '<div class="card" style="padding:18px;">';
  html += '<h3 style="margin:0 0 12px; color:var(--accent);">Random Trinkets</h3>';
  html += '<ul style="margin:0; padding-left:20px;">';
  results.forEach(function (t) {
    html += '<li style="margin-bottom:6px;">' + escapeHtml(t) + '</li>';
  });
  html += '</ul></div>';
  output.innerHTML = html;
}

// ── Generic loot renderer ───────────────────────────────

function renderGenericLoot(title, coins, items) {
  var output = document.getElementById('loot-output');
  var html = '<div class="card" style="padding:18px;">';
  html += '<h3 style="margin:0 0 12px; color:var(--accent);">' + escapeHtml(title) + '</h3>';

  // Coins
  var coinParts = [];
  if (coins.pp) coinParts.push(coins.pp + ' pp');
  if (coins.gp) coinParts.push(coins.gp + ' gp');
  if (coins.ep) coinParts.push(coins.ep + ' ep');
  if (coins.sp) coinParts.push(coins.sp + ' sp');
  if (coins.cp) coinParts.push(coins.cp + ' cp');

  if (coinParts.length > 0) {
    html += '<div style="margin-bottom:12px;"><strong>Coins:</strong> ' + escapeHtml(coinParts.join(', ')) + '</div>';
  }

  // Items
  if (items.length > 0) {
    html += '<div><strong>Items Found (' + items.length + '):</strong>';
    html += '<ul style="margin:6px 0; padding-left:20px;">';
    items.forEach(function (item) {
      html += '<li style="margin-bottom:4px;">' + escapeHtml(item) + '</li>';
    });
    html += '</ul></div>';
  } else {
    html += '<div style="color:var(--text-dim);"><em>Nothing of interest found.</em></div>';
  }

  html += '</div>';
  output.innerHTML = html;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Encounter Loot Generator ────────────────────────────

function generateEncounterLoot() {
  var cr = parseFloat(document.getElementById('enc-cr').value);
  var count = parseInt(document.getElementById('enc-count').value, 10);
  if (isNaN(count) || count < 1) { showToast('Enter a valid monster count.', 'error'); return; }
  if (count > 20) count = 20;

  var totalCoins = { cp: 0, sp: 0, gp: 0, pp: 0 };
  var gems = [];
  var items = [];

  for (var i = 0; i < count; i++) {
    if (cr <= 4) {
      totalCoins.cp += rollDice(5, 6);
      totalCoins.sp += rollDice(2, 6);
      if (Math.random() < 0.10) totalCoins.gp += rollDice(1, 6);
      if (Math.random() < 0.15) items.push(pick(MUNDANE_GEAR));
    } else if (cr <= 10) {
      totalCoins.sp += rollDice(4, 6) * 10;
      totalCoins.gp += rollDice(2, 6) * 10;
      if (Math.random() < 0.20) gems.push(pick(GEMS[50]) + ' (50 gp)');
      if (Math.random() < 0.20) items.push(pick(MUNDANE_WEAPONS));
      if (Math.random() < 0.10) items.push(pick(POTIONS_CONSUMABLES));
    } else if (cr <= 16) {
      totalCoins.gp += rollDice(3, 6) * 10;
      totalCoins.pp += rollDice(1, 6);
      if (Math.random() < 0.25) gems.push(pick(GEMS[100]) + ' (100 gp)');
      if (Math.random() < 0.15) items.push(pick(POTIONS_CONSUMABLES));
    } else {
      totalCoins.gp += rollDice(2, 6) * 100;
      totalCoins.pp += rollDice(2, 6) * 10;
      if (Math.random() < 0.30) gems.push(pick(GEMS[500]) + ' (500 gp)');
      if (Math.random() < 0.15) items.push(pick(POTIONS_CONSUMABLES));
    }
  }

  var crLabel = cr < 1 ? ('CR ' + (cr === 0.125 ? '1/8' : cr === 0.25 ? '1/4' : '1/2')) : 'CR ' + cr;
  var html = '<div class="card" style="padding:18px;">';
  html += '<h3 style="margin:0 0 4px; color:var(--accent);">Encounter Loot</h3>';
  html += '<div style="color:var(--text-dim); margin-bottom:12px; font-style:italic;">' + count + ' creature' + (count > 1 ? 's' : '') + ' at ' + escapeHtml(crLabel) + '</div>';
  html += '<div class="scores-grid">';
  ['pp', 'gp', 'sp', 'cp'].forEach(function (d) {
    var val = totalCoins[d] || 0;
    if (val > 0) {
      html += '<div class="score-card"><div class="score-label">' + d.toUpperCase() + '</div><div class="score-value" style="font-size:22px;">' + val + '</div></div>';
    }
  });
  html += '</div>';
  if (gems.length > 0) {
    html += '<div style="margin-top:12px; padding-top:10px; border-top:1px solid var(--border);"><strong>Gems:</strong> ' + escapeHtml(gems.join(', ')) + '</div>';
  }
  if (items.length > 0) {
    html += '<div style="margin-top:8px;"><strong>Items:</strong> ' + escapeHtml(items.join(', ')) + '</div>';
  }
  var totalGP = (totalCoins.pp || 0) * 10 + (totalCoins.gp || 0) + (totalCoins.sp || 0) * 0.1 + (totalCoins.cp || 0) * 0.01;
  html += '<div style="margin-top:10px; padding-top:10px; border-top:1px solid var(--border); color:var(--text-dim);"><strong>Total Value:</strong> ~' + totalGP.toFixed(1) + ' gp</div>';
  html += '</div>';
  document.getElementById('loot-output').innerHTML = html;
}
