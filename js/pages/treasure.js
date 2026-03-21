// =============================================
//   treasure.js - Currency Converter & Random Purse
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
  loadCurrencyNames();
})();

// ── Currency Name Customization ─────────────────────────

function getCurrencyNames() {
  return {
    pp: (document.getElementById('curr-pp').value || 'PP').trim() || 'PP',
    gp: (document.getElementById('curr-gp').value || 'GP').trim() || 'GP',
    ep: (document.getElementById('curr-ep').value || 'EP').trim() || 'EP',
    sp: (document.getElementById('curr-sp').value || 'SP').trim() || 'SP',
    cp: (document.getElementById('curr-cp').value || 'CP').trim() || 'CP'
  };
}

function saveCurrencyNames() {
  var names = getCurrencyNames();
  localStorage.setItem('dm-currency-names', JSON.stringify(names));
}

function loadCurrencyNames() {
  var saved = localStorage.getItem('dm-currency-names');
  if (saved) {
    try {
      var names = JSON.parse(saved);
      if (names.pp) document.getElementById('curr-pp').value = names.pp;
      if (names.gp) document.getElementById('curr-gp').value = names.gp;
      if (names.ep) document.getElementById('curr-ep').value = names.ep;
      if (names.sp) document.getElementById('curr-sp').value = names.sp;
      if (names.cp) document.getElementById('curr-cp').value = names.cp;
    } catch (e) { /* ignore bad data */ }
  }
}

// ── Conversion Rates (everything in copper) ─────────────
// 1 pp = 10 gp = 100 sp = 1000 cp
var CP_PER = { cp: 1, sp: 10, ep: 50, gp: 100, pp: 1000 };

function convertCurrency() {
  var amount = parseFloat(document.getElementById('convert-amount').value);
  var denom = document.getElementById('convert-denom').value;

  if (isNaN(amount) || amount < 0) {
    showToast('Enter a valid positive amount.', 'error');
    return;
  }

  var totalCP = amount * CP_PER[denom];
  var results = {
    pp: Math.floor(totalCP / CP_PER.pp),
    gp: Math.floor(totalCP / CP_PER.gp),
    ep: Math.floor(totalCP / CP_PER.ep),
    sp: Math.floor(totalCP / CP_PER.sp),
    cp: totalCP
  };

  // Also show "optimal" breakdown: max pp, then gp, then sp, then cp
  var remainder = totalCP;
  var optimal = {};
  optimal.pp = Math.floor(remainder / CP_PER.pp);
  remainder -= optimal.pp * CP_PER.pp;
  optimal.gp = Math.floor(remainder / CP_PER.gp);
  remainder -= optimal.gp * CP_PER.gp;
  optimal.sp = Math.floor(remainder / CP_PER.sp);
  remainder -= optimal.sp * CP_PER.sp;
  optimal.cp = Math.round(remainder);

  renderConversion(amount, denom, results, optimal);
}

function renderConversion(amount, denom, results, optimal) {
  var output = document.getElementById('convert-output');
  var cn = getCurrencyNames();
  var denomNames = { cp: 'Copper', sp: 'Silver', ep: 'Electrum', gp: 'Gold', pp: 'Platinum' };
  var denomLabels = { cp: cn.cp, sp: cn.sp, ep: cn.ep, gp: cn.gp, pp: cn.pp };
  var htmlStr = '';

  htmlStr += '<div class="card" style="padding:18px;">';
  htmlStr += '<h3 style="margin:0 0 12px; color:var(--accent);">' + amount + ' ' + denomNames[denom] + '</h3>';

  htmlStr += '<div style="margin-bottom:14px;">';
  htmlStr += '<strong>Equivalent Values:</strong>';
  htmlStr += '<div class="scores-grid" style="margin-top:8px;">';
  var denoms = ['pp', 'gp', 'ep', 'sp', 'cp'];
  denoms.forEach(function (d) {
    var val = d === denom ? '<strong>' + results[d] + '</strong>' : String(results[d]);
    var decVal = results[d];
    // Show decimals if not a whole number
    if (decVal !== Math.floor(decVal)) {
      val = decVal.toFixed(2);
    }
    htmlStr += '<div class="score-card">';
    htmlStr += '<div class="score-label">' + escapeHtml(denomLabels[d]) + '</div>';
    htmlStr += '<div class="score-value" style="font-size:20px;">' + val + '</div>';
    htmlStr += '</div>';
  });
  htmlStr += '</div></div>';

  // Optimal breakdown
  var parts = [];
  if (optimal.pp > 0) parts.push(optimal.pp + ' ' + cn.pp.toLowerCase());
  if (optimal.gp > 0) parts.push(optimal.gp + ' ' + cn.gp.toLowerCase());
  if (optimal.sp > 0) parts.push(optimal.sp + ' ' + cn.sp.toLowerCase());
  if (optimal.cp > 0) parts.push(optimal.cp + ' ' + cn.cp.toLowerCase());
  if (parts.length > 0) {
    htmlStr += '<div style="padding-top:10px; border-top:1px solid var(--border);">';
    htmlStr += '<strong>Optimal Breakdown:</strong> ' + escapeHtml(parts.join(', '));
    htmlStr += '</div>';
  }

  htmlStr += '</div>';
  output.innerHTML = htmlStr;
}

// ── Random Purse Generator ──────────────────────────────

var WEALTH_LEVELS = {
  poor:         { label: 'Poor',         desc: '1d6 sp',            fn: function () { return { cp: rollDice(3, 6), sp: rollDice(1, 6) }; } },
  modest:       { label: 'Modest',       desc: '2d6 gp',            fn: function () { return { cp: rollDice(5, 6), sp: rollDice(3, 6), gp: rollDice(2, 6) }; } },
  comfortable:  { label: 'Comfortable',  desc: '4d6 gp',            fn: function () { return { sp: rollDice(4, 6), gp: rollDice(4, 6) }; } },
  wealthy:      { label: 'Wealthy',      desc: '4d6 x 10 gp',       fn: function () { return { sp: rollDice(2, 6) * 10, gp: rollDice(4, 6) * 10 }; } },
  aristocratic: { label: 'Aristocratic', desc: '10d6 x 100 gp',     fn: function () { return { gp: rollDice(10, 6) * 100, pp: rollDice(2, 6) * 10 }; } }
};

function generatePurse() {
  var level = document.getElementById('wealth-level').value;
  var config = WEALTH_LEVELS[level];
  if (!config) { showToast('Select a wealth level.', 'error'); return; }

  var coins = config.fn();
  renderPurse(config.label, config.desc, coins);
}

function renderPurse(label, desc, coins) {
  var output = document.getElementById('purse-output');
  var cn = getCurrencyNames();
  var denomLabels = { pp: cn.pp, gp: cn.gp, sp: cn.sp, cp: cn.cp };
  var htmlStr = '';

  htmlStr += '<div class="card" style="padding:18px;">';
  htmlStr += '<h3 style="margin:0 0 4px; color:var(--accent);">Random Purse - ' + escapeHtml(label) + '</h3>';
  htmlStr += '<div style="color:var(--text-dim); margin-bottom:12px; font-style:italic;">Roll: ' + escapeHtml(desc) + '</div>';

  htmlStr += '<div class="scores-grid">';
  var denoms = ['pp', 'gp', 'sp', 'cp'];
  denoms.forEach(function (d) {
    var val = coins[d] || 0;
    if (val > 0) {
      htmlStr += '<div class="score-card">';
      htmlStr += '<div class="score-label">' + escapeHtml(denomLabels[d]) + '</div>';
      htmlStr += '<div class="score-value" style="font-size:22px;">' + val + '</div>';
      htmlStr += '</div>';
    }
  });
  htmlStr += '</div>';

  // Total in gp
  var totalGP = (coins.pp || 0) * 10 + (coins.gp || 0) + (coins.sp || 0) * 0.1 + (coins.cp || 0) * 0.01;
  htmlStr += '<div style="margin-top:10px; padding-top:10px; border-top:1px solid var(--border); color:var(--text-dim);">';
  htmlStr += '<strong>Total Value:</strong> ~' + totalGP.toFixed(1) + ' ' + cn.gp.toLowerCase();
  htmlStr += '</div>';

  htmlStr += '</div>';
  output.innerHTML = htmlStr;
}

// ── Encounter Treasure Generator ────────────────────────

function generateEncounterTreasure() {
  var cr = parseFloat(document.getElementById('enc-cr').value);
  var count = parseInt(document.getElementById('enc-count').value, 10);

  if (isNaN(count) || count < 1) {
    showToast('Enter a valid monster count.', 'error');
    return;
  }
  if (count > 20) count = 20;

  var totalCoins = { cp: 0, sp: 0, gp: 0, pp: 0 };
  var gems = [];

  for (var i = 0; i < count; i++) {
    if (cr <= 4) {
      // CR 0-4: 5d6 cp, 2d6 sp per creature, 10% chance of 1d6 gp each
      totalCoins.cp += rollDice(5, 6);
      totalCoins.sp += rollDice(2, 6);
      if (Math.random() < 0.10) {
        totalCoins.gp += rollDice(1, 6);
      }
    } else if (cr <= 10) {
      // CR 5-10: 4d6x10 sp, 2d6x10 gp per creature, 20% chance of 1 gem (50gp)
      totalCoins.sp += rollDice(4, 6) * 10;
      totalCoins.gp += rollDice(2, 6) * 10;
      if (Math.random() < 0.20) {
        gems.push({ value: 50, desc: '50gp gem' });
      }
    } else if (cr <= 16) {
      // CR 11-16: 3d6x10 gp, 1d6 pp per creature, 25% chance of 1 gem (100gp)
      totalCoins.gp += rollDice(3, 6) * 10;
      totalCoins.pp += rollDice(1, 6);
      if (Math.random() < 0.25) {
        gems.push({ value: 100, desc: '100gp gem' });
      }
    } else {
      // CR 17+: 2d6x100 gp, 2d6x10 pp per creature, 30% chance of 1 gem (500gp)
      totalCoins.gp += rollDice(2, 6) * 100;
      totalCoins.pp += rollDice(2, 6) * 10;
      if (Math.random() < 0.30) {
        gems.push({ value: 500, desc: '500gp gem' });
      }
    }
  }

  renderEncounterTreasure(cr, count, totalCoins, gems);
}

function renderEncounterTreasure(cr, count, coins, gems) {
  var output = document.getElementById('encounter-output');
  var cn = getCurrencyNames();
  var denomLabels = { pp: cn.pp, gp: cn.gp, sp: cn.sp, cp: cn.cp };
  var htmlStr = '';

  // CR display label
  var crLabel = cr < 1 ? ('CR ' + (cr === 0.125 ? '1/8' : cr === 0.25 ? '1/4' : '1/2')) : 'CR ' + cr;

  htmlStr += '<div class="card" style="padding:18px;">';
  htmlStr += '<h3 style="margin:0 0 4px; color:var(--accent);">Encounter Treasure</h3>';
  htmlStr += '<div style="color:var(--text-dim); margin-bottom:12px; font-style:italic;">' + count + ' creature' + (count > 1 ? 's' : '') + ' at ' + escapeHtml(crLabel) + '</div>';

  htmlStr += '<div class="scores-grid">';
  var denoms = ['pp', 'gp', 'sp', 'cp'];
  denoms.forEach(function (d) {
    var val = coins[d] || 0;
    if (val > 0) {
      htmlStr += '<div class="score-card">';
      htmlStr += '<div class="score-label">' + escapeHtml(denomLabels[d]) + '</div>';
      htmlStr += '<div class="score-value" style="font-size:22px;">' + val + '</div>';
      htmlStr += '</div>';
    }
  });
  htmlStr += '</div>';

  // Gems
  if (gems.length > 0) {
    // Group gems by value
    var gemCounts = {};
    gems.forEach(function (g) {
      gemCounts[g.desc] = (gemCounts[g.desc] || 0) + 1;
    });
    htmlStr += '<div style="margin-top:12px; padding-top:10px; border-top:1px solid var(--border);">';
    htmlStr += '<strong>Gems:</strong> ';
    var gemParts = [];
    for (var desc in gemCounts) {
      gemParts.push(gemCounts[desc] + 'x ' + desc);
    }
    htmlStr += escapeHtml(gemParts.join(', '));
    htmlStr += '</div>';
  }

  // Total value in gp
  var gemTotalGP = 0;
  gems.forEach(function (g) { gemTotalGP += g.value; });
  var totalGP = (coins.pp || 0) * 10 + (coins.gp || 0) + (coins.sp || 0) * 0.1 + (coins.cp || 0) * 0.01 + gemTotalGP;

  htmlStr += '<div style="margin-top:10px; padding-top:10px; border-top:1px solid var(--border); color:var(--text-dim);">';
  htmlStr += '<strong>Total Value:</strong> ~' + totalGP.toFixed(1) + ' ' + cn.gp.toLowerCase();
  htmlStr += '</div>';

  htmlStr += '</div>';
  output.innerHTML = htmlStr;
}

function copyPurse() {
  var output = document.getElementById('purse-output');
  if (!output || !output.textContent.trim()) {
    showToast('Generate a purse first!', 'info');
    return;
  }
  navigator.clipboard.writeText(output.textContent)
    .then(function () { showToast('Purse copied!', 'success'); })
    .catch(function () { showToast('Copy failed.', 'error'); });
}
