# Code Review — DM Companion

A candid review of the codebase: what's solid, what needs attention, and what to tackle next.

---

## What's Working Well

- **No build toolchain** — zero friction local dev, trivially deployable to GitHub Pages
- **RLS everywhere** — every Supabase table has row-level security; users can only touch their own data
- **Autosave + dirty guard** — Characters, Players, Campaigns, and Notes all autosave after 3 s of inactivity and warn before unloading with unsaved changes
- **Encounter → Initiative handoff** — `localStorage` bridge cleanly transfers creature list between pages without coupling the two pages
- **Consistent UI patterns** — `showToast`, `showConfirm`, `markUnsaved`/`showSaved`, `setButtonLoading` are reused throughout; the UX feels coherent
- **XSS protection** — `escapeHtml()` is used consistently in all template literals that render user data

---



---

## Missing Features

| Priority | Feature | Notes |
|----------|---------|-------|
| High | **Spell slots tracker** | Players page has no slot tracking. Common mid-session need. |
| High | **Initiative persistence** | See bug #4. Losing state on refresh is a real pain point during combat. |
| Medium | **Encounter save/load** | No way to save a built encounter to reuse across sessions. |
| Medium | **Campaign-scoped characters** | NPCs and Creatures are not tied to a campaign — all NPCs appear globally. |
| Medium | **NPC/Creature import to Encounter** | The "Import from Characters" button in Encounter Builder only pulls from the DB, not from the Generator's current session list. |
| Low | **Spell slots per spell level** | Spell reference shows spells but no way to mark slots as used. |
| Low | **Initiative: set initiative by rolling** | No "roll for me" button on the add combatant form. |
| Low | **Dark/light theme toggle** | Hardcoded dark theme; no preference override. |

---

## Technical Debt

| Area | Issue |
|------|-------|
| **No error boundaries** | If Supabase is down or returns an unexpected shape, most pages will silently fail or show a spinner forever. Only some pages call `showToast` on error. |
| **`escapeHtml` on numbers** | `escapeHtml(item.hp)` where `hp` is a number works (coerces to string) but is semantically odd. Should be `String(item.hp ?? '')`. |
| **Mixed `var`/`let`/`const`** | Some loops use `var i`, rest of codebase uses `let`/`const`. Minor consistency issue. |
| **`innerHTML` with template literals** | XSS is managed by `escapeHtml()` on user data, but any future dev who forgets this pattern will introduce a vulnerability. A tagged template helper or a small sanitizer wrapper would make this safer by default. |
| **No input validation on save** | Empty-name NPCs/players can be saved to the DB. A brief validation pass before save would improve data quality. |
| **`supabase.js` credentials in source** | The Supabase URL and anon key are committed to the repo. The anon key is safe to expose (RLS protects the data), but teams should know this is intentional, not accidental. A comment in `supabase.js` clarifying this would prevent unnecessary secret-rotation panics. |

---

## Priorities

```
1. Fix reference modal index bug (#1)          — affects core feature correctness
2. Fix notes autosave race condition (#2)       — potential data loss
3. Persist initiative state to localStorage    — major DX improvement mid-combat
4. Add spell slots tracker to Players page     — most-requested missing feature
5. Rename `history` → `rollHistory` in dice.js — low effort, eliminates footgun
6. Add campaign-scoped characters              — enables full per-campaign workflow
```
