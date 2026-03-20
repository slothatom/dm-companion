# DM Companion

A lightweight, mobile-friendly web app for Dungeon Masters running D&D 5e campaigns. No installation required — works entirely in the browser via GitHub Pages.

## Features

| Tool | Description |
|------|-------------|
| 🪶 Session Notes | Per-campaign DM notes tied to your active campaign |
| 🗺 Campaigns | Create campaigns, log sessions, write world notes |
| 🐉 Characters | Track NPCs and creatures with HP, AC, and notes |
| 🧙 Players | Party stats — level, HP, AC, passive perception |
| ⚔️ Initiative Tracker | Combat turn order, HP adjustments, conditions |
| 🐉 Encounter Builder | XP budget calculator with difficulty rating |
| 🎲 Dice Roller | d4–d100, advantage/disadvantage, expression rolls |
| 🔮 Spell Reference | Searchable 5e spell list with level/school filters |
| 🎭 Generator | Random NPC and creature generator |
| 📋 Quick Reference | Conditions, combat actions, cover rules, skills |

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript — no build step, no framework
- **Backend**: [Supabase](https://supabase.com) (PostgreSQL + Auth + Row-Level Security)
- **Auth**: Email/password, Google OAuth, GitHub OAuth, password reset
- **Hosting**: GitHub Pages (static, HTML files at root)
- **JS SDK**: `@supabase/supabase-js@2` via CDN

## Project Structure

```
dm-companion/
├── *.html              # One HTML file per page (must stay at root for GitHub Pages)
├── css/
│   └── style.css       # All styles — dark fantasy theme
├── js/
│   ├── lib/            # Shared utilities (loaded on every page)
│   │   ├── supabase.js # Supabase client init
│   │   ├── auth.js     # requireAuth(), sign-out, OAuth helpers
│   │   └── app.js      # renderNav(), showToast(), showConfirm(), escapeHtml(), etc.
│   ├── data/           # Static data tables (no network calls)
│   │   ├── spells-data.js  # SPELLS[] — D&D 5e spell list
│   │   └── npc-data.js     # NPC/creature generation tables
│   └── pages/          # Per-page scripts (one file per HTML page)
│       ├── login.js
│       ├── home.js
│       ├── notes.js
│       ├── campaigns.js
│       ├── characters.js
│       ├── players.js
│       ├── initiative.js
│       ├── encounter.js
│       ├── dice.js
│       ├── spells.js
│       ├── generator.js
│       └── reference.js
└── favicon.ico
```

## Local Development

No build step needed. Just open any HTML file directly in your browser, or serve the directory with any static server:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .

# VS Code: use the "Live Server" extension
```

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Edit `js/lib/supabase.js` and set:

```js
const SUPABASE_URL  = 'https://your-project.supabase.co';
const SUPABASE_ANON = 'your-anon-key-here';
```

4. Enable auth providers in **Authentication → Providers** (Google, GitHub)
5. Set the redirect URL in Supabase to your GitHub Pages URL

### Database Schema

Run this SQL in the Supabase SQL editor:

```sql
-- Campaigns
create table campaigns (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  name        text not null,
  world_notes text default '',
  created_at  timestamptz default now()
);
alter table campaigns enable row level security;
create policy "Own campaigns" on campaigns for all using (auth.uid() = user_id);

-- Sessions (campaign session log)
create table sessions (
  id             uuid primary key default gen_random_uuid(),
  campaign_id    uuid references campaigns on delete cascade not null,
  user_id        uuid references auth.users not null,
  session_number integer not null default 1,
  title          text default '',
  session_date   date,
  recap          text default '',
  created_at     timestamptz default now()
);
alter table sessions enable row level security;
create policy "Own sessions" on sessions for all using (auth.uid() = user_id);

-- Session notes (per-campaign DM notes, campaign_id nullable = General)
create table session_notes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  campaign_id uuid references campaigns on delete set null,
  story       text default '',
  locations   text default '',
  notes       text default '',
  created_at  timestamptz default now()
);
alter table session_notes enable row level security;
create policy "Own notes" on session_notes for all using (auth.uid() = user_id);

-- Players (party members)
create table players (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references auth.users not null,
  player_name        text default '',
  char_name          text default '',
  char_class         text default '',
  race               text default '',
  level              integer,
  hp                 integer,
  ac                 integer,
  passive_perception integer,
  notes              text default '',
  created_at         timestamptz default now()
);
alter table players enable row level security;
create policy "Own players" on players for all using (auth.uid() = user_id);

-- NPCs
create table npcs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  name       text default '',
  hp         text default '',
  ac         text default '',
  notes      text default '',
  created_at timestamptz default now()
);
alter table npcs enable row level security;
create policy "Own npcs" on npcs for all using (auth.uid() = user_id);

-- Creatures
create table creatures (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  name       text default '',
  hp         text default '',
  ac         text default '',
  cr         text default '',
  notes      text default '',
  created_at timestamptz default now()
);
alter table creatures enable row level security;
create policy "Own creatures" on creatures for all using (auth.uid() = user_id);
```

## Deployment

Push to GitHub, then in **Settings → Pages** set the source to the `main` branch and root directory. GitHub Pages serves it automatically.

## Known Issues

- **OAuth redirect**: Requires setting the correct redirect URL in Supabase → Auth → URL Configuration.
- **players table migration**: If upgrading from an older version without `ac`/`passive_perception` columns, run:
  ```sql
  alter table players add column if not exists ac integer;
  alter table players add column if not exists passive_perception integer;
  ```
- **Session notes with NULL campaign_id**: Uses `campaign_id IS NULL` for General Notes. The app avoids `upsert` here due to PostgreSQL's behaviour with nullable FK columns and unique constraints.

## Roadmap

- [ ] Spell slots tracker per player
- [ ] Persist initiative state across refreshes
- [ ] Save named encounter templates
- [ ] Campaign dashboard summary
- [ ] Mobile PWA / offline support
