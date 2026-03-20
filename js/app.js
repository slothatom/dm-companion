// =============================================
//   app.js — Shared utilities for DM Companion
// =============================================

function showSaved() {
  const el = document.getElementById('save-status');
  if (!el) return;
  el.classList.add('visible');
  setTimeout(function () { el.classList.remove('visible'); }, 2000);
}

// =============================================
//   Sidebar Navigation
// =============================================

function renderNav(user) {
  const pages = [
    { href: 'index.html',         icon: '📜', label: 'Notes'      },
    { href: 'characters.html',    icon: '🐉', label: 'Characters' },
    { href: 'players.html',       icon: '🧙', label: 'Players'    },
    { href: 'initiative.html',    icon: '⚔️', label: 'Initiative' },
    { href: 'dice.html',          icon: '🎲', label: 'Dice'       },
    { href: 'spells.html',        icon: '📖', label: 'Spells'     },
    { href: 'npc-generator.html', icon: '🎭', label: 'NPC Gen'    },
  ];

  const links = pages.map(function (p) {
    const active = window.ACTIVE_PAGE === p.href ? ' active' : '';
    return `
      <a href="${p.href}" class="sidebar-link${active}" data-label="${p.label}">
        <span class="sidebar-icon">${p.icon}</span>
        <span class="sidebar-label">${p.label}</span>
      </a>`;
  }).join('');

  // Profile footer
  let profileHtml = '';
  if (user) {
    const email    = user.email || 'Adventurer';
    const avatar   = user.user_metadata?.avatar_url;
    const initials = email.charAt(0).toUpperCase();
    const avatarHtml = avatar
      ? `<img src="${avatar}" class="profile-avatar" alt="" />`
      : `<div class="profile-initials">${initials}</div>`;

    profileHtml = `
      <div class="sidebar-profile" id="nav-profile">
        <button class="profile-btn" onclick="toggleProfileMenu(event)" aria-label="Profile">
          ${avatarHtml}
        </button>
        <span class="sidebar-profile-email">${email}</span>
        <div class="profile-dropdown" id="profile-dropdown">
          <div class="profile-dropdown-email">👤 ${email}</div>
          <hr class="profile-dropdown-divider" />
          <button class="profile-signout" onclick="signOut()">🚪 Sign Out</button>
        </div>
      </div>`;
  }

  const nav = document.getElementById('main-nav');
  nav.innerHTML = `
    <div class="sidebar-header">
      <a href="index.html" class="sidebar-logo">
        <span class="sidebar-logo-icon">⚔️</span>
        <span class="sidebar-logo-text">DM Companion</span>
      </a>
      <button class="sidebar-toggle" onclick="toggleSidebar()" aria-label="Collapse sidebar">
        <span class="sidebar-toggle-arrow">◀</span>
      </button>
    </div>

    <div class="sidebar-divider"></div>

    <div class="sidebar-links">
      ${links}
    </div>

    <div class="sidebar-footer">
      ${profileHtml}
    </div>`;

  // Apply saved collapse state
  const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (isCollapsed) {
    nav.classList.add('collapsed');
    document.body.classList.add('sidebar-collapsed');
  }

  // Mark body as having a sidebar (so login page is unaffected)
  document.body.classList.add('has-sidebar');

  // Close dropdown on outside click
  document.addEventListener('click', function (e) {
    const profile = document.getElementById('nav-profile');
    if (profile && !profile.contains(e.target)) {
      const dd = document.getElementById('profile-dropdown');
      if (dd) dd.classList.remove('open');
    }
  });
}

function toggleSidebar() {
  const nav = document.getElementById('main-nav');
  const isCollapsed = nav.classList.toggle('collapsed');
  document.body.classList.toggle('sidebar-collapsed', isCollapsed);
  localStorage.setItem('sidebar-collapsed', isCollapsed);
}

function toggleProfileMenu(e) {
  e.stopPropagation();
  const dd = document.getElementById('profile-dropdown');
  if (dd) dd.classList.toggle('open');
}
