// =============================================
//   app.js — Shared utilities for DM Companion
//   These functions are available on every page
// =============================================


// ---- Save a simple text value to the browser's local storage ----
// Example: save('session-title', 'The Curse of Strahd')
function save(key, value) {
  localStorage.setItem(key, value);
}

// ---- Load a simple text value back ----
// Example: load('session-title')  → 'The Curse of Strahd'
function load(key) {
  return localStorage.getItem(key);
}

// ---- Save an array or object (converts it to text first) ----
// Example: saveJSON('npcs', [ { name: 'Bob', hp: 10 } ])
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Load an array or object ----
// Example: loadJSON('npcs')  → [ { name: 'Bob', hp: 10 } ]
function loadJSON(key) {
  const raw = localStorage.getItem(key);
  // If nothing was saved yet, return null
  if (!raw) return null;
  // Otherwise parse the text back into an object/array
  return JSON.parse(raw);
}

// ---- Show the "Saved!" message briefly ----
function showSaved() {
  const el = document.getElementById('save-status');
  if (!el) return;
  el.classList.add('visible');
  // Hide it again after 2 seconds
  setTimeout(function () {
    el.classList.remove('visible');
  }, 2000);
}