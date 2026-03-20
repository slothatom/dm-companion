// =============================================
//   dm-screen.js — DM Screen Quick Reference Grid
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
})();

// ── Reference Data ──────────────────────────────────────

var DM_SCREEN_SECTIONS = [
  {
    title: 'Conditions',
    summary: 'Blinded, Charmed, Deafened, Frightened, Grappled, Incapacitated, Invisible, Paralyzed, Petrified, Poisoned, Prone, Restrained, Stunned, Unconscious',
    detail: 'Blinded: Can\'t see; auto-fail sight checks; attacks have disadvantage; attacks against have advantage.\n\nCharmed: Can\'t attack charmer; charmer has advantage on social checks.\n\nDeafened: Can\'t hear; auto-fail hearing checks.\n\nFrightened: Disadvantage on ability checks and attacks while source of fear is in sight; can\'t willingly move closer.\n\nGrappled: Speed becomes 0; ends if grappler incapacitated or effect removes creature from reach.\n\nIncapacitated: Can\'t take actions or reactions.\n\nInvisible: Can\'t be seen without magic/special sense; heavily obscured; attacks have advantage; attacks against have disadvantage.\n\nParalyzed: Incapacitated; can\'t move or speak; auto-fail STR/DEX saves; attacks against have advantage; hits within 5 ft are crits.\n\nPetrified: Turned to stone; weight x10; incapacitated; unaware; attacks against have advantage; auto-fail STR/DEX saves; resistance to all damage; immune to poison/disease.\n\nPoisoned: Disadvantage on attacks and ability checks.\n\nProne: Disadvantage on attacks; attacks within 5 ft have advantage; attacks beyond 5 ft have disadvantage; standing costs half movement.\n\nRestrained: Speed 0; attacks have disadvantage; attacks against have advantage; disadvantage on DEX saves.\n\nStunned: Incapacitated; can\'t move; speak falteringly; auto-fail STR/DEX saves; attacks against have advantage.\n\nUnconscious: Incapacitated; can\'t move or speak; unaware; drops what it\'s holding; falls prone; auto-fail STR/DEX saves; attacks against have advantage; hits within 5 ft are crits.'
  },
  {
    title: 'Actions in Combat',
    summary: 'Attack, Cast a Spell, Dash, Disengage, Dodge, Help, Hide, Ready, Search, Use Object',
    detail: 'Attack: Make one melee or ranged attack (or more with Extra Attack).\n\nCast a Spell: Cast a spell with a casting time of 1 action.\n\nDash: Gain extra movement equal to your speed (after modifiers) for the current turn.\n\nDisengage: Your movement doesn\'t provoke opportunity attacks for the rest of the turn.\n\nDodge: Attacks against you have disadvantage (if you can see the attacker); DEX saves have advantage. Lost if incapacitated or speed drops to 0.\n\nHelp: Give an ally advantage on their next ability check or attack roll (must be within 5 ft of target).\n\nHide: Make a DEX (Stealth) check to become hidden.\n\nReady: Prepare an action to trigger on a specific condition (uses your reaction). Readied spells require concentration.\n\nSearch: Make a WIS (Perception) or INT (Investigation) check.\n\nUse an Object: Interact with a second object (first interaction is free).'
  },
  {
    title: 'Cover',
    summary: 'Half (+2 AC/DEX), Three-quarters (+5 AC/DEX), Full (can\'t be targeted)',
    detail: 'Half Cover: +2 bonus to AC and Dexterity saving throws. A target has half cover if an obstacle blocks at least half of its body (low wall, furniture, another creature).\n\nThree-Quarters Cover: +5 bonus to AC and Dexterity saving throws. A target has three-quarters cover if about three-quarters of it is covered (portcullis, arrow slit, thick tree trunk).\n\nFull Cover: Can\'t be targeted directly by an attack or a spell, although some spells can reach such a target by including it in an area of effect. A target has total cover if it is completely concealed by an obstacle.'
  },
  {
    title: 'Difficulty DCs',
    summary: 'Very Easy 5, Easy 10, Medium 15, Hard 20, Very Hard 25, Nearly Impossible 30',
    detail: 'Very Easy (DC 5): A task that most people can accomplish.\n\nEasy (DC 10): A task that requires a modest amount of effort.\n\nMedium (DC 15): A task that requires a significant amount of effort; average difficulty.\n\nHard (DC 20): A task that most people would find very challenging.\n\nVery Hard (DC 25): A task that pushes the boundaries of what\'s possible.\n\nNearly Impossible (DC 30): A task that is almost beyond mortal ability.\n\nContested Checks: Both sides roll; highest total wins. Ties go to the status quo (the creature being contested against).'
  },
  {
    title: 'Travel Pace',
    summary: 'Fast 4mph/30mi, Normal 3mph/24mi, Slow 2mph/18mi',
    detail: 'Fast Pace: 4 miles/hour, 30 miles/day. -5 penalty to passive Wisdom (Perception). Cannot use stealth.\n\nNormal Pace: 3 miles/hour, 24 miles/day.\n\nSlow Pace: 2 miles/hour, 18 miles/day. Able to use stealth.\n\nForced March: For each hour beyond 8 hours of travel, characters must make a DC 10 + 1 per extra hour Constitution saving throw or suffer one level of exhaustion.\n\nDifficult Terrain: Halves travel distance.\n\nMounting: A mount doubles travel pace for 1 hour (galloping) but must rest 1 hour after.\n\nVehicles: Speed depends on the vehicle and crew; ships and carriages follow their own rules.'
  },
  {
    title: 'Light & Vision',
    summary: 'Bright light, dim light (disadvantage Perception), darkness (effectively blind)',
    detail: 'Bright Light: Most creatures see normally. Even gloomy days and torches/lanterns provide bright light in a radius.\n\nDim Light (Lightly Obscured): Disadvantage on Wisdom (Perception) checks that rely on sight. Creates a shadowy area between bright light and darkness. Twilight, dawn, a full moon.\n\nDarkness (Heavily Obscured): Effectively blind. Creatures suffer the blinded condition in areas of darkness without darkvision or another special sense.\n\nDarkvision: See in dim light as if bright (within range), and darkness as if dim (greyscale only). Does NOT let you see in magical darkness.\n\nBlindight: Perceive surroundings without sight within a specific radius.\n\nTruesight: See in normal and magical darkness, see invisible creatures, detect visual illusions, see into the Ethereal Plane (within range).\n\nTorch: Bright light 20 ft, dim light 20 ft beyond. Burns for 1 hour.\n\nLantern (Hooded): Bright light 30 ft, dim light 30 ft beyond. Burns 6 hours on 1 flask of oil. Can lower hood to reduce to 5 ft dim.\n\nLight cantrip: Bright light 20 ft, dim light 20 ft beyond.'
  },
  {
    title: 'Exhaustion',
    summary: '6 levels: disadvantage, half speed, 0 HP max halved, then death',
    detail: 'Level 1: Disadvantage on ability checks.\n\nLevel 2: Speed halved.\n\nLevel 3: Disadvantage on attack rolls and saving throws.\n\nLevel 4: Hit point maximum halved.\n\nLevel 5: Speed reduced to 0.\n\nLevel 6: Death.\n\nEffects are cumulative. Finishing a long rest reduces exhaustion by 1 level (if the creature has food and drink). Greater Restoration and similar magic can also reduce exhaustion.'
  },
  {
    title: 'Damage Types',
    summary: 'Acid, Bludgeoning, Cold, Fire, Force, Lightning, Necrotic, Piercing, Poison, Psychic, Radiant, Slashing, Thunder',
    detail: 'Acid: Corrosive spray, black dragon breath.\nBludgeoning: Blunt force — clubs, falling, constriction.\nCold: Frigid energy — ice storms, frost breath.\nFire: Flames and heat — fireballs, dragon breath, lava.\nForce: Pure magical energy — magic missile, spiritual weapon.\nLightning: Electrical energy — lightning bolt, blue dragon breath.\nNecrotic: Life-draining energy — certain undead attacks, blight.\nPiercing: Puncturing — arrows, spears, bites.\nPoison: Venomous — toxic gas, spider bites, poisoned weapons.\nPsychic: Mental energy — mind blast, psychic scream.\nRadiant: Holy/divine power — searing light, angel attacks.\nSlashing: Cutting — swords, axes, claws.\nThunder: Concussive sound — thunderwave, shatter.\n\nResistance: Take half damage of that type.\nVulnerability: Take double damage of that type.\nImmunity: Take no damage of that type.'
  },
  {
    title: 'Common DCs Table',
    summary: 'Lock (DC 15), Climb (DC 10-15), Swim (DC 10-15), Tracking (DC 10-20)',
    detail: 'Picking a Lock: DC 15 (average), DC 20 (fine lock), DC 25 (exceptional lock).\n\nClimbing: DC 10 (rope/ladder), DC 15 (rough wall), DC 20 (smooth wall), DC 25 (ceiling/overhang).\n\nSwimming: DC 10 (calm water), DC 15 (rough water), DC 20 (stormy water).\n\nTracking: DC 10 (soft ground), DC 15 (bare stone), DC 20 (after rain/snow).\n\nBalancing: DC 10 (narrow surface), DC 15 (very narrow/slippery), DC 20 (incredibly narrow).\n\nJumping: Long jump = STR score feet (running start). Half without running start. High jump = 3 + STR modifier feet (running start). Half without.\n\nForaging: DC 10 (abundant), DC 15 (limited), DC 20 (scarce).\n\nNavigation: DC 10 (road), DC 15 (grassland/forest), DC 20 (mountains/swamp).\n\nPersuasion/Deception: DC 10 (friendly/naive), DC 15 (indifferent), DC 20 (hostile/suspicious), DC 25 (deeply opposed).'
  }
];

// ── Rendering ───────────────────────────────────────────

function renderDMScreen() {
  var container = document.getElementById('dm-screen-grid');

  container.innerHTML = DM_SCREEN_SECTIONS.map(function (section) {
    return '<div class="card dm-screen-card" style="padding:16px; cursor:pointer;" onclick="showScreenDetail(\'' + escapeHtml(section.title).replace(/'/g, "\\'") + '\')">' +
      '<h4 style="margin:0 0 6px; color:var(--accent);">' + escapeHtml(section.title) + '</h4>' +
      '<div style="color:var(--text-muted); font-size:13px; line-height:1.5;">' + escapeHtml(section.summary) + '</div>' +
    '</div>';
  }).join('');
}

function showScreenDetail(title) {
  var section = DM_SCREEN_SECTIONS.find(function (s) { return s.title === title; });
  if (!section) return;

  showInfoModal({
    title: section.title,
    body: section.detail
  });
}

// Initial render
document.addEventListener('DOMContentLoaded', function () {
  renderDMScreen();
});

if (document.readyState !== 'loading') {
  renderDMScreen();
}
