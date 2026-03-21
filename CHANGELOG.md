# Changelog

All notable changes to **DM Companion** will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project uses [Semantic Versioning](https://semver.org/).

---

## [0.9.0] - 2026-03-21

### Added
- **Locations page** — manage campaign locations (Town, City, Village, Dungeon, Wilderness, Landmark, Building) with descriptions, DM notes, map images, tags, and NPC/creature assignment per location
- **Maps**: campaign assignment per map, map type selector (Battle Map, World Map, Dungeon Map, Regional Map, City Map), image paste-to-upload support (base64), and interactive pin system — click to place labeled pins on map images
- **Sidebar menu restructure** — new "Compendium" section for SRD data (spells, bestiary, species, classes, etc.), cleaner "Reference" section for quick-lookup pages, Locations and Maps moved under Campaign

### Changed
- **Color theme refresh** — darker backgrounds for more contrast, brighter gold accent (#F0C75E), richer browns, warmer light theme
- **Code optimization** — moved `pick()` and `rollDice()` helper functions to shared `app.js` (removed duplicates from 7 generator files)

---

## [0.8.0] - 2026-03-21

### Added
- **Stats Generator**: Character Builder mode — generate recommended ability scores by class (12 classes), species (9 races with SRD racial bonuses), and level; auto-assigns highest rolls to class priority abilities
- **Stats Generator**: Monster/NPC Stats mode — generate ability scores by CR (0–30) with DMG reference table showing prof bonus, suggested AC, HP range, attack bonus, and save DC
- **Treasure**: Encounter Treasure generator — roll loot for defeated encounters by average CR and monster count, using DMG individual treasure tables
- **Treasure**: Custom Currency Names — rename PP/GP/EP/SP/CP for custom settings; persists in localStorage and applies to all treasure outputs
- **Market Generator**: Settlement tier system (Village, Town, City, Metropolis) with price multipliers, inventory size scaling, shop availability restrictions, and tier-specific rare items
- **Market Generator**: Random shop type option
- **Initiative Tracker**: Full condition reference — 16 conditions (Blinded, Charmed, Deafened, Frightened, Grappled, Incapacitated, Invisible, Paralyzed, Petrified, Poisoned, Prone, Restrained, Stunned, Unconscious, Exhaustion, Concentration) with effects, saving throws, and icons
- **Initiative Tracker**: Condition info panel — active conditions show effect description and save info below each combatant
- **Objects**: Category filter (Containers, Structures, Furniture, Armor & Shields) and search input
- **Objects**: 10 armor items with HP (Leather through Adamantine) for object damage tracking in combat
- **Objects**: Random Object Generator by category and material
- **Languages**: 12 new exotic languages (Aarakocra, Gith, Gnoll, Ignan, Aquan, Auran, Terran, Kraul, Modron, Slaad, Sphinx, Vegepygmy) — total now 29

### Fixed
- Items & Equipment category filters now match API data (lowercase `weapon`/`armor`); removed non-functional Gear/Tools/Mounts/Magic filter buttons

---

## [0.7.0] - 2026-03-21

### Added
- NPC Generator archetype filter — dropdown to generate NPCs by type (Commoner, Merchant, Guard, Noble, Criminal, Magic User, Adventurer, Religious)
- Markdown-to-HTML renderer (`mdToHtml`) for API text fields — headings, bold, tables, lists render cleanly in detail modals
- `showInfoModal` now accepts `bodyHtml` for rich HTML content alongside plain-text `body`

### Fixed
- Species detail modal — traits, subraces, and descriptions now render formatted instead of raw markdown
- Feats detail modal — descriptions render with proper bold/list formatting
- Items detail modal — formatted rendering with proper cost/weight display
- Backgrounds missing descriptions — switched API from v2 (`/v2/backgrounds/`) to v1 (`/v1/backgrounds/`) which returns full `desc`, `feature`, and `suggested_characteristics`
- Items/Equipment cost and weight display — v2 API returns nested objects for `cost` and `damage_type`; normalizers now handle both string and object formats
- Loot Generator magic items no longer show `[Table X]` references
- Generator page layout — controls (dropdown, buttons, autosave) now properly aligned with flexbox `.gen-controls` / `.gen-controls-row`
- Profile menu overflow — increased `max-height` from 300px to 500px so theme toggle + sign out are always visible
- Light theme flash on refresh — inline `<script>` in `<head>` of all 39 HTML pages applies saved theme before CSS renders, eliminating the dark-background flash

---

## [0.6.0] - 2026-03-21

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
- Release notes page rendering — cards now close properly between versions
- API first-load performance: pagination now fetches all pages in parallel instead of sequentially; cache upgraded from sessionStorage to localStorage with 4-hour TTL so data persists across tabs and sessions
- Profile menu: display name placeholder, email visibility, and segmented Dark/Light theme switch

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
