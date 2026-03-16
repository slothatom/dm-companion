# ⚔️ DM Companion

A lightweight, browser-based toolkit for Dungeon Masters running D&D 5e one-shots and campaigns.

No account needed. No server. Everything saves in your browser.

🌐 **Live app:** [slothatom.github.io/dm-companion](https://slothatom.github.io/dm-companion)

---

## Features

| Page | What it does |
|------|-------------|
| 📜 **Session Notes** | Write your story, locations, and DM notes for the session |
| 🐉 **Characters** | Track NPC and creature stats (name, HP, AC, notes) |
| 🧙 **Players** | Store your party's character info |
| ⚔️ **Initiative Tracker** | Sort combat order, track HP, advance turns — import from Players & Characters |
| 🎲 **Dice Roller** | Roll any die (d4–d100), custom multi-dice rolls with modifiers, roll history |
| 📖 **Spell Reference** | 50+ common D&D 5e spells, searchable and filterable by level |
| 🎭 **NPC Generator** | Instantly generate NPCs with name, race, occupation, personality, quirk, and motivation |

---

## How to use

Just open `index.html` in any browser — no installation needed.

All data is saved automatically using `localStorage`, so your notes and characters persist between sessions on the same device.

---

## Project structure

```
dm-companion/
├── index.html            # Session Notes
├── characters.html       # NPCs & Creatures
├── players.html          # Player Info
├── initiative.html       # Combat Initiative Tracker
├── dice.html             # Dice Roller
├── spells.html           # Spell Reference
├── npc-generator.html    # Random NPC Generator
├── css/
│   └── style.css         # All styles
└── js/
    └── app.js            # Shared utilities (save/load/nav)
```

---

## Built with

- Vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies
- `localStorage` for data persistence
- Hosted free on GitHub Pages

---

*Built by a DM, for DMs. Roll well.* 🎲