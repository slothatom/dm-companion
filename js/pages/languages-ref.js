// =============================================
//   languages-ref.js - Languages Reference (API-powered)
// =============================================

var allLanguages = [];

(async function () {
  var user = await requireAuth();
  if (!user) return;
  renderNav(user);

  DndApi.showLoading('languages-list');

  try {
    allLanguages = await DndApi.fetchLanguages();
    if (allLanguages.length === 0 && typeof LANGUAGES !== 'undefined') {
      allLanguages = LANGUAGES;
    }
    renderLanguages(allLanguages);
  } catch (err) {
    if (typeof LANGUAGES !== 'undefined' && LANGUAGES.length > 0) {
      allLanguages = LANGUAGES;
      renderLanguages(allLanguages);
      showToast('Using offline language data (API unavailable)', 'info');
    } else {
      DndApi.showError('languages-list', err.message);
    }
  }
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
          '<span class="spell-stat"><i class="fi fi-rr-pen-nib"></i> <span>' + escapeHtml(lang.script || 'None') + '</span></span>' +
        '</div>' +
        '<div class="ref-desc">' + escapeHtml(lang.speakers || '') + '</div>' +
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
          '<span class="spell-stat"><i class="fi fi-rr-pen-nib"></i> <span>' + escapeHtml(lang.script || 'None') + '</span></span>' +
        '</div>' +
        '<div class="ref-desc">' + escapeHtml(lang.speakers || '') + '</div>' +
      '</div>';
    });
    html += '</div>';
  }

  container.innerHTML = html;
}

function openLangDetail(index) {
  var lang = window._langDisplayList && window._langDisplayList[index];
  if (!lang) return;

  var body = 'Type: ' + (lang.type || 'Standard') + '\n' +
    'Script: ' + (lang.script || 'None') + '\n' +
    'Typical Speakers: ' + (lang.speakers || 'Various') + '\n\n' +
    (lang.desc || 'No additional details available.');

  showInfoModal({ title: lang.name, body: body });
}

function filterLanguages() {
  var query = (document.getElementById('language-search').value || '').toLowerCase().trim();
  if (!query) { renderLanguages(allLanguages); return; }
  var filtered = allLanguages.filter(function (lang) {
    return lang.name.toLowerCase().includes(query) ||
      (lang.type && lang.type.toLowerCase().includes(query)) ||
      (lang.script && lang.script.toLowerCase().includes(query)) ||
      (lang.speakers && lang.speakers.toLowerCase().includes(query));
  });
  renderLanguages(filtered);
}
