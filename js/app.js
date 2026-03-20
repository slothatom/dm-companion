// =============================================
//   app.js — Shared utilities for DM Companion
// =============================================

function showSaved() {
  const el = document.getElementById('save-status');
  if (!el) return;
  el.classList.add('visible');
  setTimeout(function () {
    el.classList.remove('visible');
  }, 2000);
}

// ---- Shared nav HTML (used by all pages) ----
// Call renderNav(user) after requireAuth() resolves.
function renderNav(user) {
  const pages = [
    { href: 'index.html',         label: '📜 Notes'      },
    { href: 'characters.html',    label: '🐉 Characters' },
    { href: 'players.html',       label: '🧙 Players'    },
    { href: 'initiative.html',    label: '⚔️ Initiative' },
    { href: 'dice.html',          label: '🎲 Dice'       },
    { href: 'spells.html',        label: '📖 Spells'     },
    { href: 'npc-generator.html', label: '🎭 NPC Gen'    },
  ];

  const links = pages.map(function (p) {
    const isActive = window.ACTIVE_PAGE === p.href ? 'class="active"' : '';
    return `<a href="${p.href}" ${isActive}>${p.label}</a>`;
  }).join('');

  let profileHtml = '';
  if (user) {
    const email  = user.email || 'Adventurer';
    const avatar = user.user_metadata?.avatar_url;
    const initials = email.charAt(0).toUpperCase();

    const avatarHtml = avatar
      ? `<img src="${avatar}" class="profile-avatar" alt="" />`
      : `<div class="profile-initials">${initials}</div>`;

    profileHtml = `
      <div class="nav-profile" id="nav-profile">
        <button class="profile-btn" onclick="toggleProfileMenu(event)" aria-label="Profile menu">
          ${avatarHtml}
        </button>
        <div class="profile-dropdown" id="profile-dropdown">
          <div class="profile-dropdown-email">👤 ${email}</div>
          <hr class="profile-dropdown-divider" />
          <button class="profile-signout" onclick="signOut()">🚪 Sign Out</button>
        </div>
      </div>`;
  }

  document.getElementById('main-nav').innerHTML =
    `<a href="index.html" class="logo">⚔️ DM Companion</a>` + links + profileHtml;

  // Close dropdown when clicking outside
  document.addEventListener('click', function (e) {
    const profile = document.getElementById('nav-profile');
    if (profile && !profile.contains(e.target)) {
      const dd = document.getElementById('profile-dropdown');
      if (dd) dd.classList.remove('open');
    }
  });
}

function toggleProfileMenu(e) {
  e.stopPropagation();
  const dd = document.getElementById('profile-dropdown');
  if (dd) dd.classList.toggle('open');
}
