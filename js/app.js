// =============================================
//   app.js — Shared utilities for DM Companion
// =============================================

function save(key, value) {
  localStorage.setItem(key, value);
}

function load(key) {
  return localStorage.getItem(key);
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadJSON(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  return JSON.parse(raw);
}

function showSaved() {
  const el = document.getElementById('save-status');
  if (!el) return;
  el.classList.add('visible');
  setTimeout(function () {
    el.classList.remove('visible');
  }, 2000);
}

// ---- Shared nav HTML (used by all pages) ----
// Each page sets window.ACTIVE_PAGE before including this file,
// then calls renderNav() to inject the nav.
function renderNav() {
  const pages = [
    { href: 'index.html',         label: '📜 Notes'       },
    { href: 'characters.html',    label: '🐉 Characters'  },
    { href: 'players.html',       label: '🧙 Players'     },
    { href: 'initiative.html',    label: '⚔️ Initiative'  },
    { href: 'dice.html',          label: '🎲 Dice'        },
    { href: 'spells.html',        label: '📖 Spells'      },
    { href: 'npc-generator.html', label: '🎭 NPC Gen'     },
  ];

  const links = pages.map(function (p) {
    const isActive = window.ACTIVE_PAGE === p.href ? 'class="active"' : '';
    return `<a href="${p.href}" ${isActive}>${p.label}</a>`;
  }).join('');

  document.getElementById('main-nav').innerHTML =
    `<a href="index.html" class="logo">⚔️ DM Companion</a>` + links;
}