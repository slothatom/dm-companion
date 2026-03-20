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

  let userHtml = '';
  if (user) {
    const displayName = user.user_metadata?.full_name
                     || user.user_metadata?.name
                     || user.email
                     || 'Adventurer';
    const avatar = user.user_metadata?.avatar_url;
    userHtml = `
      <div class="nav-user">
        ${avatar ? `<img src="${avatar}" class="nav-avatar" alt="" />` : ''}
        <span class="nav-email">${displayName}</span>
        <button class="nav-logout" onclick="signOut()">Sign Out</button>
      </div>`;
  }

  document.getElementById('main-nav').innerHTML =
    `<a href="index.html" class="logo">⚔️ DM Companion</a>` + links + userHtml;
}
