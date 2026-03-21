// =============================================
//   treasure.js - Currency Converter & Random Purse
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
})();

// ── Conversion Rates (everything in copper) ─────────────
// 1 pp = 10 gp = 100 sp = 1000 cp
var CP_PER = { cp: 1, sp: 10, ep: 50, gp: 100, pp: 1000 };

// Standard denomination labels
var DENOM_LABELS = { cp: 'Copper', sp: 'Silver', ep: 'Electrum', gp: 'Gold', pp: 'Platinum' };
var DENOM_ABBR  = { cp: 'CP', sp: 'SP', ep: 'EP', gp: 'GP', pp: 'PP' };

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
  var htmlStr = '';

  htmlStr += '<div class="card" style="padding:18px;">';
  htmlStr += '<h3 style="margin:0 0 12px; color:var(--accent);">' + amount + ' ' + DENOM_LABELS[denom] + '</h3>';

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
    htmlStr += '<div class="score-label">' + escapeHtml(DENOM_LABELS[d]) + '</div>';
    htmlStr += '<div class="score-value" style="font-size:20px;">' + val + '</div>';
    htmlStr += '</div>';
  });
  htmlStr += '</div></div>';

  // Optimal breakdown
  var parts = [];
  if (optimal.pp > 0) parts.push(optimal.pp + ' ' + DENOM_LABELS.pp.toLowerCase());
  if (optimal.gp > 0) parts.push(optimal.gp + ' ' + DENOM_LABELS.gp.toLowerCase());
  if (optimal.sp > 0) parts.push(optimal.sp + ' ' + DENOM_LABELS.sp.toLowerCase());
  if (optimal.cp > 0) parts.push(optimal.cp + ' ' + DENOM_LABELS.cp.toLowerCase());
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
      htmlStr += '<div class="score-label">' + escapeHtml(DENOM_LABELS[d]) + '</div>';
      htmlStr += '<div class="score-value" style="font-size:22px;">' + val + '</div>';
      htmlStr += '</div>';
    }
  });
  htmlStr += '</div>';

  // Total in gp
  var totalGP = (coins.pp || 0) * 10 + (coins.gp || 0) + (coins.sp || 0) * 0.1 + (coins.cp || 0) * 0.01;
  htmlStr += '<div style="margin-top:10px; padding-top:10px; border-top:1px solid var(--border); color:var(--text-dim);">';
  htmlStr += '<strong>Total Value:</strong> ~' + totalGP.toFixed(1) + ' gold';
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
