// =============================================
//   app.js - Shared utilities for DM Companion
// =============================================

// ── Save-status indicator ──────────────────────────────────

// Generic variants - pass any element id
function showSavedFor(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('unsaved');
  el.textContent = '✓ Saved!';
  el.classList.add('visible');
  setTimeout(function () { el.classList.remove('visible'); }, 2200);
}

function markUnsavedFor(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('visible');
  el.textContent = '● Unsaved changes';
  el.classList.add('unsaved');
}

// Shortcut for the standard single-save-status pages
function showSaved()   { showSavedFor('save-status'); }
function markUnsaved() { markUnsavedFor('save-status'); }

// ── Dirty-state guard ──────────────────────────────────────
// Call once during page init: setupDirtyGuard(function() { return isDirty; })
function setupDirtyGuard(isDirtyFn) {
  window.addEventListener('beforeunload', function (e) {
    if (isDirtyFn()) { e.preventDefault(); e.returnValue = ''; }
  });
}

// ── HTML escaping ──────────────────────────────────────────

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Toast notifications ────────────────────────────────────

function showToast(message, type) {
  // type: 'success' | 'error' | 'info'
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + (type || 'info');
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.add('toast-out');
    setTimeout(function () { toast.remove(); }, 300);
  }, 3500);
}

// ── Button loading state ───────────────────────────────────

function setButtonLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.dataset.originalText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner btn-spinner"></span> Saving…';
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.originalText || 'Save';
  }
}

// =============================================
//   Confirmation Modal
// =============================================

// opts: { title, message, confirmText, onConfirm, danger }
function showConfirm(opts) {
  let modal = document.getElementById('dm-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'dm-modal';
    modal.className = 'dm-modal-overlay';
    modal.innerHTML = `
      <div class="dm-modal" role="dialog" aria-modal="true">
        <h3 class="dm-modal-title"  id="dm-modal-title"></h3>
        <p  class="dm-modal-message" id="dm-modal-message"></p>
        <div class="dm-modal-actions">
          <button class="secondary" onclick="closeModal()">Cancel</button>
          <button id="dm-modal-confirm"></button>
        </div>
      </div>`;
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.body.appendChild(modal);
  }
  document.getElementById('dm-modal-title').textContent   = opts.title   || 'Confirm';
  document.getElementById('dm-modal-message').textContent = opts.message || '';
  const btn = document.getElementById('dm-modal-confirm');
  btn.textContent = opts.confirmText || 'Confirm';
  btn.className   = opts.danger ? 'danger' : '';
  btn.onclick     = function () { closeModal(); opts.onConfirm(); };
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('dm-modal');
  if (modal) modal.style.display = 'none';
}

// =============================================
//   Prompt Modal (text input, replaces native prompt)
// =============================================

// opts: { title, message, placeholder, confirmText, onConfirm(value) }
function showPrompt(opts) {
  var modal = document.getElementById('dm-prompt-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'dm-prompt-modal';
    modal.className = 'dm-modal-overlay';
    modal.innerHTML =
      '<div class="dm-modal" role="dialog" aria-modal="true">' +
        '<h3 class="dm-modal-title" id="dm-prompt-title"></h3>' +
        '<p class="dm-modal-message" id="dm-prompt-message"></p>' +
        '<input type="text" id="dm-prompt-input" style="margin:8px 0 16px; width:100%;" />' +
        '<div class="dm-modal-actions">' +
          '<button class="secondary" onclick="closePromptModal()">Cancel</button>' +
          '<button id="dm-prompt-confirm"></button>' +
        '</div>' +
      '</div>';
    modal.addEventListener('click', function (e) { if (e.target === modal) closePromptModal(); });
    document.body.appendChild(modal);
  }
  document.getElementById('dm-prompt-title').textContent = opts.title || 'Input';
  var msgEl = document.getElementById('dm-prompt-message');
  if (opts.message) { msgEl.textContent = opts.message; msgEl.style.display = ''; }
  else { msgEl.style.display = 'none'; }
  var input = document.getElementById('dm-prompt-input');
  input.value = opts.defaultValue || '';
  input.placeholder = opts.placeholder || '';
  var btn = document.getElementById('dm-prompt-confirm');
  btn.textContent = opts.confirmText || 'OK';
  btn.className = '';
  btn.onclick = function () {
    var val = input.value;
    closePromptModal();
    if (opts.onConfirm) opts.onConfirm(val);
  };
  input.onkeydown = function (e) {
    if (e.key === 'Enter') { btn.click(); }
    if (e.key === 'Escape') { closePromptModal(); }
  };
  modal.style.display = 'flex';
  setTimeout(function () { input.focus(); }, 50);
}

function closePromptModal() {
  var modal = document.getElementById('dm-prompt-modal');
  if (modal) modal.style.display = 'none';
}

// =============================================
//   Info / Detail Modal (read-only, single Close button)
// =============================================

// opts: { title, body }
function showInfoModal(opts) {
  let modal = document.getElementById('dm-info-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'dm-info-modal';
    modal.className = 'dm-modal-overlay';
    modal.innerHTML =
      '<div class="dm-modal dm-info-modal-inner" role="dialog" aria-modal="true">' +
        '<h3 class="dm-modal-title" id="dm-info-title"></h3>' +
        '<div class="dm-info-body" id="dm-info-body"></div>' +
        '<div class="dm-modal-actions" style="justify-content:center;">' +
          '<button onclick="closeInfoModal()">Close</button>' +
        '</div>' +
      '</div>';
    modal.addEventListener('click', function (e) { if (e.target === modal) closeInfoModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.style.display === 'flex') closeInfoModal();
    });
    document.body.appendChild(modal);
  }
  document.getElementById('dm-info-title').textContent = opts.title || '';
  // Use innerText to preserve \n as line breaks (works with white-space: pre-line)
  document.getElementById('dm-info-body').innerText = opts.body || '';
  modal.style.display = 'flex';
}

function closeInfoModal() {
  const modal = document.getElementById('dm-info-modal');
  if (modal) modal.style.display = 'none';
}

function confirmSignOut() {
  showConfirm({
    title:       'Sign Out',
    message:     'Are you sure you want to sign out?',
    confirmText: 'Sign Out',
    danger:      true,
    onConfirm:   signOut,
  });
}

// =============================================
//   Sidebar Navigation
// =============================================

function renderNav(user) {
  const navSections = [
    { heading: '', pages: [
      { href: 'home.html',          icon: '<i class="fi fi-rr-home"></i>',           label: 'Home'       },
    ]},
    { heading: 'Campaign', pages: [
      { href: 'campaigns.html',     icon: '<i class="fi fi-rr-map"></i>',            label: 'Campaigns'  },
      { href: 'notes.html',         icon: '<i class="fi fi-rr-scroll"></i>',         label: 'Notes'      },
      { href: 'players.html',       icon: '<i class="fi fi-rr-users"></i>',          label: 'Players'    },
      { href: 'charsheet.html',    icon: '<i class="fi fi-rr-document-signed"></i>', label: 'Char Sheets' },
      { href: 'characters.html',    icon: '<i class="fi fi-rr-skull"></i>',          label: 'NPCs'       },
    ]},
    { heading: 'Play', pages: [
      { href: 'initiative.html',    icon: '<i class="fi fi-rr-sword"></i>',          label: 'Initiative'     },
      { href: 'encounter.html',     icon: '<i class="fi fi-rr-dragon"></i>',         label: 'Encounters'     },
      { href: 'dice.html',          icon: '<i class="fi fi-rr-dice-d20"></i>',       label: 'Dice'           },
      { href: 'dm-screen.html',     icon: '<i class="fi fi-rr-clipboard-list"></i>', label: 'DM Screen'      },
    ]},
    { heading: 'Generators', pages: [
      { href: 'npc-generator.html',  icon: '<i class="fi fi-rr-magic-wand"></i>',     label: 'NPC Generator'  },
      { href: 'stats-generator.html',icon: '<i class="fi fi-rr-dice-d20"></i>',       label: 'Stats'          },
      { href: 'loot-generator.html', icon: '<i class="fi fi-rr-box-open"></i>',       label: 'Loot'           },
      { href: 'market-generator.html',icon: '<i class="fi fi-rr-shop"></i>',          label: 'Market'         },
      { href: 'tavern-generator.html',icon: '<i class="fi fi-rr-mug-hot-alt"></i>',  label: 'Tavern'         },
      { href: 'treasure.html',       icon: '<i class="fi fi-rr-coins"></i>',          label: 'Treasure'       },
      { href: 'trap-generator.html', icon: '<i class="fi fi-rr-triangle-warning"></i>',label: 'Traps'         },
    ]},
    { heading: 'Reference', pages: [
      { href: 'spells.html',        icon: '<i class="fi fi-rr-book-spells"></i>',    label: 'Spells'         },
      { href: 'bestiary.html',      icon: '<i class="fi fi-rr-dragon"></i>',         label: 'Bestiary'       },
      { href: 'species.html',       icon: '<i class="fi fi-rr-users"></i>',          label: 'Species'        },
      { href: 'classes.html',       icon: '<i class="fi fi-rr-shield"></i>',         label: 'Classes'        },
      { href: 'feats.html',         icon: '<i class="fi fi-rr-star"></i>',           label: 'Feats'          },
      { href: 'items.html',         icon: '<i class="fi fi-rr-backpack"></i>',       label: 'Items'          },
      { href: 'magic-items.html',  icon: '<i class="fi fi-rr-wand-sparkles"></i>',  label: 'Magic Items'    },
      { href: 'conditions.html',   icon: '<i class="fi fi-rr-exclamation"></i>',    label: 'Conditions'     },
      { href: 'backgrounds.html',   icon: '<i class="fi fi-rr-scroll"></i>',         label: 'Backgrounds'    },
      { href: 'languages.html',     icon: '<i class="fi fi-rr-comment"></i>',        label: 'Languages'      },
      { href: 'rules.html',         icon: '<i class="fi fi-rr-book"></i>',           label: 'Rules'          },
      { href: 'quick-ref.html',     icon: '<i class="fi fi-rr-clipboard-list"></i>', label: 'Quick Ref'      },
      { href: 'glossary.html',      icon: '<i class="fi fi-rr-book"></i>',           label: 'Glossary'       },
      { href: 'hazards.html',       icon: '<i class="fi fi-rr-flame"></i>',          label: 'Hazards'        },
      { href: 'objects.html',       icon: '<i class="fi fi-rr-box"></i>',            label: 'Objects'        },
    ]},
    { heading: 'World', pages: [
      { href: 'maps.html',          icon: '<i class="fi fi-rr-map"></i>',            label: 'Maps'           },
    ]},
  ];

  const links = navSections.map(function (section) {
    var headingHtml = section.heading
      ? '<div class="sidebar-section-heading">' + section.heading + '</div>'
      : '';
    var pageLinks = section.pages.map(function (p) {
      var active = window.ACTIVE_PAGE === p.href ? ' active' : '';
      return '<a href="' + p.href + '" class="sidebar-link' + active + '" data-label="' + p.label + '">' +
        '<span class="sidebar-icon">' + p.icon + '</span>' +
        '<span class="sidebar-label">' + p.label + '</span>' +
      '</a>';
    }).join('');
    return headingHtml + pageLinks;
  }).join('');

  // Profile + sign out
  let footerHtml = '';
  if (user) {
    const email    = user.email || 'Adventurer';
    const avatar   = user.user_metadata?.avatar_url;
    const initials = email.charAt(0).toUpperCase();
    const avatarHtml = avatar
      ? `<img src="${avatar}" class="profile-avatar" alt="" />`
      : `<div class="profile-initials">${initials}</div>`;

    footerHtml = `
      <div class="sidebar-profile" onclick="toggleProfileMenu()" role="button" tabindex="0" aria-expanded="false" aria-label="Toggle profile menu">
        <div class="profile-avatar-wrap">${avatarHtml}</div>
        <span class="sidebar-profile-email">${email}</span>
        <i class="fi fi-rr-angle-up profile-chevron"></i>
      </div>
      <div class="profile-menu" id="profile-menu">
        <span class="profile-menu-name">${email}</span>
        <button class="theme-toggle" onclick="toggleTheme(); event.stopPropagation();" id="theme-toggle-btn"></button>
        <div class="profile-menu-links">
          <a href="terms.html" class="profile-menu-link"><i class="fi fi-rr-document-signed"></i> Terms &amp; Conditions</a>
          <a href="privacy.html" class="profile-menu-link"><i class="fi fi-rr-shield"></i> Privacy Policy</a>
          <a href="cookies.html" class="profile-menu-link"><i class="fi fi-rr-cookie"></i> Cookie Policy</a>
        </div>
        <button class="sidebar-signout" onclick="confirmSignOut()"><i class="fi fi-rr-sign-out-alt"></i> Sign Out</button>
      </div>`;
  }

  const nav = document.getElementById('main-nav');
  nav.innerHTML = `
    <div class="sidebar-header">
      <a href="home.html" class="sidebar-logo">
        <img src="favicon.png" alt="" class="sidebar-logo-icon" style="width:24px;height:24px;" />
        <span class="sidebar-logo-text">DM Companion</span>
      </a>
      <button class="sidebar-toggle" onclick="toggleSidebar()" aria-label="Toggle sidebar" title="Toggle sidebar">
        <i class="fi fi-rr-bars-sort"></i>
      </button>
    </div>

    <div class="sidebar-divider"></div>

    <div class="sidebar-links">
      ${links}
    </div>

    <div class="sidebar-footer">
      ${footerHtml}
    </div>`;

  // Apply saved theme preference
  const savedTheme = localStorage.getItem('theme') || '';
  document.documentElement.dataset.theme = savedTheme;
  updateThemeButton();

  // Apply saved collapse state (desktop only)
  const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (isCollapsed) {
    nav.classList.add('collapsed');
    document.body.classList.add('sidebar-collapsed');
  }

  document.body.classList.add('has-sidebar');

  // Reveal main content now that auth is complete and nav is rendered
  const mainEl = document.querySelector('main');
  if (mainEl) mainEl.style.visibility = 'visible';

  // Restore sidebar scroll position
  var sidebarLinks = nav.querySelector('.sidebar-links');
  if (sidebarLinks) {
    var savedScroll = sessionStorage.getItem('sidebar-scroll');
    if (savedScroll) {
      sidebarLinks.scrollTop = parseInt(savedScroll, 10);
    }
    // Save scroll position before navigating away (add listener only once)
    if (!nav._scrollListenerAdded) {
      nav.addEventListener('click', function (e) {
        var link = e.target.closest('a.sidebar-link');
        if (link && sidebarLinks) {
          sessionStorage.setItem('sidebar-scroll', sidebarLinks.scrollTop);
        }
      });
      nav._scrollListenerAdded = true;
    }
  }

  // Start loading timeout safety net
  setupLoadingTimeout();

  // ── Mobile backdrop (injected once) ──────────────────────
  if (!document.getElementById('sidebar-backdrop')) {
    const backdrop = document.createElement('div');
    backdrop.id        = 'sidebar-backdrop';
    backdrop.className = 'sidebar-backdrop';
    backdrop.onclick   = closeMobileSidebar;
    document.body.appendChild(backdrop);
  }

  // ── Mobile hamburger button (injected once) ───────────────
  if (!document.getElementById('mobile-menu-btn')) {
    const btn = document.createElement('button');
    btn.id        = 'mobile-menu-btn';
    btn.className = 'mobile-menu-btn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.innerHTML = '<i class="fi fi-rr-bars-sort"></i>';
    btn.onclick = openMobileSidebar;
    document.body.appendChild(btn);
  }
}

// ── Desktop toggle: expand ↔ icon-only ────────────────────
function toggleSidebar() {
  const nav = document.getElementById('main-nav');
  if (nav.classList.contains('collapsed')) {
    nav.classList.remove('collapsed');
    document.body.classList.remove('sidebar-collapsed');
    localStorage.setItem('sidebar-collapsed', 'false');
  } else {
    nav.classList.add('collapsed');
    document.body.classList.add('sidebar-collapsed');
    localStorage.setItem('sidebar-collapsed', 'true');
  }
}

// ── Mobile sidebar: slide-in overlay ─────────────────────
function openMobileSidebar() {
  document.getElementById('main-nav').classList.add('mobile-open');
  const bd = document.getElementById('sidebar-backdrop');
  if (bd) bd.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

// ── Theme toggle ────────────────────────────────────────
function toggleProfileMenu() {
  const menu = document.getElementById('profile-menu');
  const profile = document.querySelector('.sidebar-profile');
  if (!menu || !profile) return;
  const isOpen = menu.classList.toggle('open');
  profile.setAttribute('aria-expanded', isOpen);
  profile.querySelector('.profile-chevron').classList.toggle('rotated', isOpen);
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === 'light' ? '' : 'light';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
  updateThemeButton();
}

function updateThemeButton() {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  const isLight = document.documentElement.dataset.theme === 'light';
  btn.innerHTML = isLight ? '<i class="fi fi-rr-sun"></i> Light' : '<i class="fi fi-rr-moon"></i> Dark';
}

// ── Loading timeout safety net ────────────────────────────
// If any .loading-state elements are still visible after 15 seconds,
// replace them with an error message so the user isn't stuck on a spinner.
function setupLoadingTimeout() {
  setTimeout(function () {
    const loaders = document.querySelectorAll('.loading-state');
    loaders.forEach(function (el) {
      if (el.offsetParent !== null) {
        el.innerHTML = '<p style="color:#aa4040;">Something went wrong - data failed to load. Please refresh the page.</p>';
      }
    });
  }, 15000);
}

// ── Tagged template literal helper for safe HTML ─────────
// Auto-escapes all interpolated values to prevent XSS.
// Usage: html`<div>${userInput}</div>` - each ${} value is escaped.
// This is a utility for future use; existing code is not refactored to use it.
function html(strings) {
  let result = strings[0];
  for (let i = 1; i < arguments.length; i++) {
    result += escapeHtml(String(arguments[i] ?? ''));
    result += strings[i];
  }
  return result;
}

// ── Display list namespace (reduces global pollution) ───
// Reference pages store their display lists here instead of
// polluting window.* with individual variables.
var _dl = {};

// ── Shared helpers (DRY) ────────────────────────────────

// Campaign map helpers — shared by players.js, characters.js, campaigns.js
function getCampaignMapFor(mapKey, userId) {
  try {
    return JSON.parse(localStorage.getItem(mapKey + '-' + userId)) || {};
  } catch (e) { return {}; }
}

function saveCampaignMapFor(mapKey, userId, map) {
  localStorage.setItem(mapKey + '-' + userId, JSON.stringify(map));
}

function getCampaignTypeMapFor(userId) {
  return getCampaignMapFor('campaign-type-map', userId);
}

// Build campaign dropdown — shared by players.js and characters.js
function buildCampaignSelect(campaignsList, currentValue, onchangeExpr, typeMap) {
  const options = '<option value="">No Campaign</option>' +
    campaignsList.map(function (c) {
      const sel = c.id === currentValue ? ' selected' : '';
      const label = escapeHtml(c.name) + (typeMap[c.id] === 'oneshot' ? ' (one-shot)' : '');
      return '<option value="' + escapeHtml(c.id) + '"' + sel + '>' + label + '</option>';
    }).join('');
  return '<select onchange="' + onchangeExpr + '" style="margin:0; min-width:140px; flex:1;">' + options + '</select>';
}

// Ability modifier — shared by bestiary.js and charsheet.js
function abilityModifier(score) {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? '+' + mod : String(mod);
}

// Truncate text — shared by multiple reference pages
function truncateText(str, len) {
  if (!str) return '';
  if (str.length <= len) return str;
  return str.substring(0, len) + '...';
}

function closeMobileSidebar() {
  document.getElementById('main-nav').classList.remove('mobile-open');
  const bd = document.getElementById('sidebar-backdrop');
  if (bd) bd.classList.remove('visible');
  document.body.style.overflow = '';
}
