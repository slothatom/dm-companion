// =============================================
//   languages-ref.js — Languages Reference page
// =============================================

(async function () {
  const user = await requireAuth();
  if (!user) return;
  renderNav(user);
  renderLanguages(LANGUAGES);
})();

function renderLanguages(list) {
  var container = document.getElementById('languages-list');
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-state">No languages found.</p>';
    return;
  }

  window._langDisplayList = list;

  var standard = [];
  var exotic = [];
  var idx = 0;

  list.forEach(function (lang) {
    lang._displayIdx = idx;
    if (lang.type === 'Exotic') {
      exotic.push(lang);
    } else {
      standard.push(lang);
    }
    idx++;
  });

  var html = '';

  if (standard.length > 0) {
    html += '<h2><i class="fi fi-rr-comment"></i> Standard Languages</h2>';
    html += '<div class="ref-grid">';
    standard.forEach(function (lang) {
      html += '<div class="ref-card" onclick="openLangDetail(' + lang._displayIdx + ')" title="Click to expand">' +
        '<div class="ref-name">' + escapeHtml(lang.name) + '</div>' +
        '<div class="spell-stats">' +
          '<span class="spell-stat"><i class="fi fi-rr-pen-nib"></i> <span>' + escapeHtml(lang.script) + '</span></span>' +
        '</div>' +
        '<div class="ref-desc">' + escapeHtml(lang.speakers) + '</div>' +
      '</div>';
    });
    html += '</div>';
  }

  if (exotic.length > 0) {
    html += '<h2><i class="fi fi-rr-star"></i> Exotic Languages</h2>';
    html += '<div class="ref-grid">';
    exotic.forEach(function (lang) {
      html += '<div class="ref-card" onclick="openLangDetail(' + lang._displayIdx + ')" title="Click to expand">' +
        '<div class="ref-name">' + escapeHtml(lang.name) + '</div>' +
        '<div class="spell-stats">' +
          '<span class="spell-stat"><i class="fi fi-rr-pen-nib"></i> <span>' + escapeHtml(lang.script) + '</span></span>' +
        '</div>' +
        '<div class="ref-desc">' + escapeHtml(lang.speakers) + '</div>' +
      '</div>';
    });
    html += '</div>';
  }

  container.innerHTML = html;
}

function openLangDetail(index) {
  var lang = window._langDisplayList && window._langDisplayList[index];
  if (!lang) return;

  var body = 'Type: ' + lang.type + '\n' +
    'Script: ' + lang.script + '\n' +
    'Typical Speakers: ' + lang.speakers + '\n\n' +
    lang.desc;

  showInfoModal({ title: lang.name, body: body });
}
