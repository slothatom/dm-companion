# Changelog

All notable changes to **DM Companion** will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project uses [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Dedicated Cookie Policy page (`cookies.html`) with full breakdown of authentication cookies, localStorage keys, and sessionStorage usage
- Cookie Policy linked from sidebar navigation, login footer, and Privacy Policy page
- Terms & Conditions page (`terms.html`) covering acceptance, accounts, user content, D&D IP/OGL, acceptable use, disclaimers, liability, and termination
- Terms & Conditions linked from sidebar navigation and login footer
- Cookie consent banner on all pages (including login) with Accept / Decline buttons, slides up from bottom, remembers choice in localStorage
- Custom display name in profile menu — saved per user in localStorage, shown in sidebar and home welcome message
- Release Notes page (`release-notes.html`) — fetches and renders `CHANGELOG.md` with version badges, section icons, and formatted lists; linked from profile menu
- Bestiary creature images — thumbnails on cards and full images in detail modal, sourced from Open5e API `img_main` field
- Characters ↔ NPC Generator connection — "Generate NPC/Creature" buttons on Characters page link to generator; "View in Characters" link appears after saving from generator
- Initiative tracker campaign picker — Import Players / Import Creatures now shows a campaign/one-shot dropdown to filter which characters to import

### Changed
- Sidebar profile reorganised into expandable menu: click avatar/name to reveal theme toggle, Terms & Conditions, Privacy Policy, Cookie Policy, and Sign Out

### Fixed
- Magic Items icon missing — replaced with `fi-rr-sparkles` (verified in Flaticon CSS) in sidebar nav and page header
- Release notes page: fixed "devUnreleased" display — cards now close properly between versions, Unreleased section shows "Upcoming Changes" label
- API first-load performance: pagination now fetches all pages in parallel instead of sequentially; cache upgraded from sessionStorage to localStorage with 4-hour TTL so data persists across tabs and sessions

---

## [0.5.0] - 2026-03-21

### Fixed
- **LOW audit sweep**: maps page fully implemented, home quick-start expanded, breakpoints standardised (768/640/480), z-index scale consolidated into CSS custom properties, button `:active` states added, spell-slot float layout replaced with flexbox
- **MEDIUM audit sweep**: `var` → `let`/`const` across all page modules, DRY violations extracted to shared helpers in `app.js`, global `window._*` display-list variables replaced with `_dl` namespace, sidebar click-listener accumulation guard added, CSS-based loading spinner for non-API pages, form validation for CR and HP inputs, `<meta name="description">` added to all 35 HTML pages
- **HIGH audit sweep**: search/filter on Classes and Languages reference pages, hardcoded light-theme colours replaced with CSS custom properties, skip-to-content links and `aria-label` attributes on all pages, OAuth redirect uses `location.origin`, Content-Security-Policy `<meta>` tags on all 35 HTML files

## [0.4.0] - 2026-03-21

### Added
- D&D 5e API integration — Open5e (`api.open5e.com`) and dnd5eapi.co for live spell, monster, class, and item data
- `DndApi` module with in-memory + sessionStorage caching (1-hour TTL)
- Info modal line-break rendering via `.innerText` with `white-space: pre-line`
- Privacy policy page

### Fixed
- Info modal line breaks not rendering
- Missing CSS custom-property fallbacks for badge and toast colours

## [0.3.0] - 2026-03-20 – 2026-03-21

### Added
- 18 new reference/generator pages: Bestiary, Classes, Species, Feats, Items, Magic Items, Backgrounds, Conditions, Languages, Glossary, Loot Generator, Tavern Generator, Name Generator, Trap Generator, Puzzle Generator, Weather Generator, Travel Pace, Wild Magic
- Character sheet page with D&D-style ability scores, skills, and proficiencies
- Session notes page rebuilt with full DM prep structure (plot hooks, encounters, treasure, NPCs)
- Campaign overview with party roster, linked NPCs, and session notes
- Campaign quick-access bar on home page
- One-shot campaigns alongside regular campaigns
- Per-card campaign assignment dropdowns on Characters and Players pages
- Class filter for spells (Bard, Cleric, Druid, Paladin, Ranger, Sorcerer, Warlock, Wizard)
- Click-to-expand modal for spell cards
- Tavern generator with food, drinks, and lodging
- Loot generator with body search, room search, and trinkets
- In-app `showPrompt()` modal replacing native `prompt()`
- Sidebar scroll-position preservation across navigation
- Auto-save on NPC/Creature generate with optional campaign assignment
- Flaticon Uicons replacing all emoji icons site-wide
- Wizard favicon and nav logo

### Fixed
- Blank player/NPC/creature forms disappearing after add
- Native `prompt()` replaced with accessible in-app modal

## [0.2.0] - 2026-03-20

### Added
- Supabase authentication (email/password, Google OAuth, GitHub OAuth)
- Profile dropdown with sign-out
- Tavern / Adventure Log visual theme
- Arcane sidebar: vertical collapsible nav with hover-to-peek and pin-to-lock
- Loading states, error toasts, unsaved-changes warnings, autosave (2-3 s debounce)
- Quick Reference, Encounter Builder, and Campaign Manager pages
- Homepage with quick-start grid
- Mobile-responsive layout with sidebar collapse

### Fixed
- Critical: safe saves preventing data loss on malformed JSON
- Critical: input escaping (XSS prevention via `escapeHtml()`)
- Password reset flow
- Reference detail modal rendering
- Creature generator edge cases
- Campaign notes schema

### Changed
- JS reorganised into `lib/`, `data/`, `pages/` directories
- Shared save-status utilities extracted

## [0.1.0] - 2026-03-16

### Added
- Initial release of DM Companion
- Session notes editor
- Dice roller
- Initiative tracker
- Spell reference (full SRD, 319 spells)
- NPC generator
- Player tracker
- Character (NPC/Creature) manager
- Extracted spell and monster data files
- Favicon
