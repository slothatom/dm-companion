// =============================================
//   hazards.js - Environmental Hazards Reference
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
})();

var HAZARDS = [
  {
    name: 'Falling',
    summary: '1d6 bludgeoning per 10 ft fallen, max 20d6',
    description: 'A creature that falls takes 1d6 bludgeoning damage at the end of a fall for every 10 feet it fell, to a maximum of 20d6. The creature lands prone unless it avoids taking damage from the fall.',
    damage: '1d6 per 10 ft (max 20d6)',
    dc: 'None',
    notes: 'Landing in water or other soft surfaces may reduce damage at the DM\'s discretion. Feather Fall negates all falling damage.'
  },
  {
    name: 'Suffocating',
    summary: 'Minutes equal to 1 + CON mod, then 0 HP',
    description: 'A creature can hold its breath for a number of minutes equal to 1 + its Constitution modifier (minimum of 30 seconds). When a creature runs out of breath or is choking, it can survive for a number of rounds equal to its Constitution modifier (minimum of 1 round). At the start of its next turn, it drops to 0 hit points and is dying, and it can\'t regain hit points or be stabilized until it can breathe again.',
    damage: 'Drops to 0 HP when out of breath',
    dc: 'None (CON mod determines duration)',
    notes: 'Hold breath: 1 + CON mod minutes. Choking survival: CON mod rounds (min 1). Speaking or casting verbal spells uses air.'
  },
  {
    name: 'Extreme Cold',
    summary: 'DC 10 CON save each hour or gain 1 exhaustion',
    description: 'Whenever the temperature is at or below 0 degrees Fahrenheit, a creature exposed to the cold must succeed on a DC 10 Constitution saving throw at the end of each hour or gain one level of exhaustion. Creatures with resistance or immunity to cold damage automatically succeed, as do creatures wearing cold weather gear and creatures naturally adapted to cold climates.',
    damage: '1 level of exhaustion per failed save',
    dc: 'DC 10 Constitution save each hour',
    notes: 'Cold weather gear, cold resistance/immunity, or natural adaptation grants automatic success. Wind chill can impose disadvantage.'
  },
  {
    name: 'Extreme Heat',
    summary: 'DC 5+ CON save each hour or gain 1 exhaustion',
    description: 'When the temperature is at or above 100 degrees Fahrenheit, a creature exposed to the heat and without access to drinkable water must succeed on a Constitution saving throw at the end of each hour or gain one level of exhaustion. The DC is 5 for the first hour and increases by 1 for each additional hour. Creatures wearing medium or heavy armor, or who are clad in heavy clothing, have disadvantage on the saving throw.',
    damage: '1 level of exhaustion per failed save',
    dc: 'DC 5 (increases by 1 each hour)',
    notes: 'Medium/heavy armor or heavy clothing imposes disadvantage. Fire resistance/immunity grants automatic success. Drinking water resets the DC.'
  },
  {
    name: 'Starvation',
    summary: '1 exhaustion level per day without food after 3 + CON mod days',
    description: 'A character needs one pound of food per day and can make food last longer by subsisting on half rations. Eating half a pound of food in a day counts as half a day without food. A character can go without food for a number of days equal to 3 + their Constitution modifier (minimum 1 day). At the end of each day beyond that limit, a character automatically suffers one level of exhaustion. A normal day of eating resets the count of days without food to zero.',
    damage: '1 level of exhaustion per day',
    dc: 'None (automatic after 3 + CON mod days)',
    notes: 'Half rations count as half a day without food. One normal day of eating resets the counter. 1 lb of food needed per day.'
  },
  {
    name: 'Dehydration',
    summary: '1 exhaustion per day without water (or DC 15 CON save on half water)',
    description: 'A character needs one gallon of water per day, or two gallons per day if the weather is hot. A character who drinks only half that much water must succeed on a DC 15 Constitution saving throw or suffer one level of exhaustion at the end of the day. A character with access to even less water automatically suffers one level of exhaustion at the end of the day. If the character already has one or more levels of exhaustion, the character takes two levels in either case.',
    damage: '1-2 levels of exhaustion',
    dc: 'DC 15 Constitution save (half water)',
    notes: '1 gallon/day normal, 2 gallons/day in hot weather. Less than half = automatic exhaustion. Already exhausted = 2 levels instead of 1.'
  },
  {
    name: 'Lava',
    summary: '10d10 fire damage on contact, 18d10 submerged',
    description: 'A creature that enters lava for the first time on a turn or starts its turn submerged in lava takes 10d10 fire damage. A creature fully submerged in lava takes 18d10 fire damage at the start of each of its turns.',
    damage: '10d10 fire (contact), 18d10 fire (submerged)',
    dc: 'None',
    notes: 'Objects in contact with lava take the same damage. Lava may ignite flammable objects. Even fire-resistant creatures should beware.'
  },
  {
    name: 'Quicksand',
    summary: 'Sinks 1d4+1 ft, DC 10+ STR to escape',
    description: 'A creature that enters quicksand sinks 1d4+1 feet into the mire and is restrained. At the start of each of its turns, it sinks another 1d4 feet. A creature completely submerged in quicksand begins suffocating. A creature can try to pull itself out by using its action and succeeding on a Strength check (DC 10 + the number of feet sunk). A creature pulling someone else out must succeed on the same check.',
    damage: 'Restrained, then suffocation',
    dc: 'DC 10 + feet sunk (Strength check)',
    notes: 'Spot with DC 10 Wisdom (Survival). Struggle = sink faster. Spreading weight (lying flat) can help. Rope assists.'
  },
  {
    name: 'Thin Ice',
    summary: 'Breaks with 3d10 weight, cold water causes 2d6 cold + shock',
    description: 'Thin ice has a weight tolerance of 3d10 x 10 pounds per 10-foot square. When the ice breaks, creatures standing on it fall through. A creature that falls into frigid water must succeed on a DC 10 Constitution saving throw or gain one level of exhaustion from the cold shock. Each minute spent in frigid water requires another DC 10 Constitution save or gain exhaustion.',
    damage: '2d6 cold (optional) + exhaustion',
    dc: 'DC 10 Constitution save per minute',
    notes: 'Weight tolerance: 3d10 x 10 lbs per 10-ft square. Swimming in frigid water: DC 10 CON save each minute. Cold weather gear does not help once submerged.'
  },
  {
    name: 'Razorvine',
    summary: '1d10 slashing on contact',
    description: 'Razorvine is a plant that grows in wild tangles and hedges. It also clings to the sides of buildings and other surfaces, behaving much like ivy. A 10-foot-high, 10-foot-wide, 5-foot-deep wall of razorvine has AC 11, 25 HP, and immunity to bludgeoning, piercing, and psychic damage. A creature that enters a space containing razorvine for the first time on a turn or starts its turn there takes 5 (1d10) slashing damage.',
    damage: '1d10 slashing',
    dc: 'None',
    notes: 'AC 11, 25 HP. Immune to bludgeoning, piercing, and psychic damage. Vulnerable to fire. Can be used as natural barriers or obstacles.'
  },
  {
    name: 'Brown Mold',
    summary: '22 (4d10) cold damage within 5 ft, grows when exposed to fire',
    description: 'Brown mold feeds on warmth, drawing heat from anything around it. A patch of brown mold typically covers a 10-foot square, and the temperature within 30 feet of it is always frigid cold. When a creature moves to within 5 feet of the mold for the first time on a turn or starts its turn there, it must make a DC 12 Constitution saving throw, taking 22 (4d10) cold damage on a failed save, or half as much on a success. Brown mold is immune to fire, and any source of fire brought within 5 feet of it causes it to expand.',
    damage: '4d10 cold',
    dc: 'DC 12 Constitution save',
    notes: 'IMMUNE to fire - fire makes it grow! Destroyed by cold damage (e.g. Cone of Cold). Freezes surrounding area within 30 ft.'
  },
  {
    name: 'Yellow Mold',
    summary: '11 (2d10) poison + poisoned, DC 15 CON',
    description: 'Yellow mold grows in dark places. A patch of yellow mold covers a 5-foot square and can be destroyed by exposure to sunlight or any amount of fire damage. When a creature touches yellow mold or disturbs it (such as by attacking it), it releases a cloud of spores that fills a 10-foot cube. Any creature in the cloud must succeed on a DC 15 Constitution saving throw or take 11 (2d10) poison damage and become poisoned for 1 minute. While poisoned, the creature takes 5 (1d10) poison damage at the start of each of its turns. The creature can repeat the saving throw at the end of each of its turns, ending the effect on a success.',
    damage: '2d10 poison + 1d10/round while poisoned',
    dc: 'DC 15 Constitution save',
    notes: 'Destroyed by sunlight or fire. Releases 10-ft cube spore cloud when disturbed. Poisoned condition lasts 1 minute with repeated saves.'
  },
  {
    name: 'Green Slime',
    summary: '5 (1d10) acid per round, dissolves flesh and organic material',
    description: 'Green slime clings to walls, floors, and ceilings in patches, and drops onto creatures passing beneath it. A 5-foot square of green slime deals 5 (1d10) acid damage to any creature that comes in contact with it. The slime deals 5 (1d10) acid damage each round until the slime is scraped off (requires an action) or destroyed. The slime can also eat through wood and metal but not stone. Sunlight, any effect that cures disease, and any amount of fire, cold, or radiant damage destroys a patch of green slime.',
    damage: '1d10 acid per round',
    dc: 'DEX save to avoid (DC varies)',
    notes: 'Eats through wood and metal (not stone). Destroyed by fire, cold, radiant damage, sunlight, or disease-curing effects. Requires action to scrape off.'
  }
];

// ── Rendering ───────────────────────────────────────────

function renderHazards() {
  var container = document.getElementById('hazards-list');
  var filter = (document.getElementById('hazard-search') || {}).value || '';
  filter = filter.toLowerCase();

  var filtered = HAZARDS.filter(function (h) {
    if (!filter) return true;
    return h.name.toLowerCase().indexOf(filter) !== -1 ||
           h.summary.toLowerCase().indexOf(filter) !== -1 ||
           h.description.toLowerCase().indexOf(filter) !== -1;
  });

  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-state">No hazards match your search.</p>';
    return;
  }

  container.innerHTML = filtered.map(function (h) {
    return '<div class="card" style="padding:16px; cursor:pointer;" onclick="showHazardDetail(\'' + escapeHtml(h.name).replace(/'/g, "\\'") + '\')">' +
      '<h4 style="margin:0 0 4px; color:var(--accent);">' + escapeHtml(h.name) + '</h4>' +
      '<div style="color:var(--text-muted); font-size:14px;">' + escapeHtml(h.summary) + '</div>' +
      '<div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">' +
        '<span class="npc-tag">Damage: ' + escapeHtml(h.damage) + '</span>' +
        '<span class="npc-tag">DC: ' + escapeHtml(h.dc) + '</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

function showHazardDetail(name) {
  var hazard = HAZARDS.find(function (h) { return h.name === name; });
  if (!hazard) return;

  showInfoModal({
    title: hazard.name,
    body: hazard.description + '\n\nDamage: ' + hazard.damage + '\nDC: ' + hazard.dc + '\n\nNotes: ' + hazard.notes
  });
}

// Initial render
document.addEventListener('DOMContentLoaded', function () {
  renderHazards();
});

// Also try to render immediately in case DOMContentLoaded already fired
if (document.readyState !== 'loading') {
  renderHazards();
}
