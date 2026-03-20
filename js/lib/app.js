// =============================================
//   app.js — Shared utilities for DM Companion
// =============================================

// ── Save-status indicator ──────────────────────────────────

// Generic variants — pass any element id
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
  var container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  var toast = document.createElement('div');
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
//   Info / Detail Modal (read-only, single Close button)
// =============================================

// opts: { title, body }
function showInfoModal(opts) {
  var modal = document.getElementById('dm-info-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'dm-info-modal';
    modal.className = 'dm-modal-overlay';
    modal.innerHTML =
      '<div class="dm-modal dm-info-modal-inner" role="dialog" aria-modal="true">' +
        '<h3 class="dm-modal-title" id="dm-info-title"></h3>' +
        '<p class="dm-info-body" id="dm-info-body"></p>' +
        '<div class="dm-modal-actions" style="justify-content:center;">' +
          '<button onclick="closeInfoModal()">Close</button>' +
        '</div>' +
      '</div>';
    modal.addEventListener('click', function (e) { if (e.target === modal) closeInfoModal(); });
    document.body.appendChild(modal);
  }
  document.getElementById('dm-info-title').textContent = opts.title || '';
  document.getElementById('dm-info-body').textContent  = opts.body  || '';
  modal.style.display = 'flex';
}

function closeInfoModal() {
  var modal = document.getElementById('dm-info-modal');
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
  const pages = [
    { href: 'home.html',          icon: '🏠', label: 'Home'       },
    { href: 'index.html',         icon: '🪶', label: 'Notes'      },
    { href: 'campaigns.html',     icon: '🗺', label: 'Campaigns'  },
    { href: 'characters.html',    icon: '💀', label: 'Characters' },
    { href: 'players.html',       icon: '🍺', label: 'Players'    },
    { href: 'initiative.html',    icon: '⚔️', label: 'Initiative' },
    { href: 'encounter.html',     icon: '🐉', label: 'Encounters' },
    { href: 'dice.html',          icon: '🎲', label: 'Dice'       },
    { href: 'spells.html',        icon: '🔮', label: 'Spells'     },
    { href: 'npc-generator.html', icon: '🎭', label: 'Generator'  },
    { href: 'quick-ref.html',     icon: '📋', label: 'Reference'  },
  ];

  const links = pages.map(function (p) {
    const active = window.ACTIVE_PAGE === p.href ? ' active' : '';
    return `
      <a href="${p.href}" class="sidebar-link${active}" data-label="${p.label}">
        <span class="sidebar-icon">${p.icon}</span>
        <span class="sidebar-label">${p.label}</span>
      </a>`;
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
      <div class="sidebar-profile">
        <div class="profile-avatar-wrap">${avatarHtml}</div>
        <span class="sidebar-profile-email">${email}</span>
      </div>
      <button class="sidebar-signout" onclick="confirmSignOut()">🚪 Sign Out</button>`;
  }

  const nav = document.getElementById('main-nav');
  nav.innerHTML = `
    <div class="sidebar-header">
      <a href="home.html" class="sidebar-logo">
        <span class="sidebar-logo-icon">⚔️</span>
        <span class="sidebar-logo-text">DM Companion</span>
      </a>
      <button class="sidebar-toggle" onclick="toggleSidebar()" aria-label="Toggle sidebar" title="Toggle sidebar">
        ☰
      </button>
    </div>

    <div class="sidebar-divider"></div>

    <div class="sidebar-links">
      ${links}
    </div>

    <div class="sidebar-footer">
      ${footerHtml}
    </div>`;

  // Apply saved collapse state (desktop only)
  const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (isCollapsed) {
    nav.classList.add('collapsed');
    document.body.classList.add('sidebar-collapsed');
  }

  document.body.classList.add('has-sidebar');

  // Reveal main content now that auth is complete and nav is rendered
  var mainEl = document.querySelector('main');
  if (mainEl) mainEl.style.visibility = 'visible';

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
    btn.textContent = '☰';
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

function closeMobileSidebar() {
  document.getElementById('main-nav').classList.remove('mobile-open');
  const bd = document.getElementById('sidebar-backdrop');
  if (bd) bd.classList.remove('visible');
  document.body.style.overflow = '';
}
