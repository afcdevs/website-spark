# Spark Services — Site Design System & Project Spec

> Use this as the design shortcut whenever building/changing this site or any site for this user.
> User's brand: **Spark Services** (always spelled with a space). Business: Discord bot hosting + Minecraft server hosting.
> Everything must look: clean, minimal, techy, dark purple/black, fully rounded corners.

## 1. Brand & Voice
- Brand name in UI: `Spark <span class="logo-accent">Services</span>` (real space, not "ServicesSpark").
- Discord CTA (all CTAs, new tab): `https://discord.gg/SM4cTKVAY3`.
- Positioning: Germany-only hosting (Frankfurt, code `DE · FRA`), AMD Epyc + NVMe, Pterodactyl panel, 60s setup.
- User's language style (Arabic): writes in Saudi Levantine mix ("يا زلمة"). Treat as normal Arabic.

## 2. Colors (CSS vars in `:root`)
```
--bg: #09090b            (page background)
--bg-soft: #0e0e10       (alternate section bg)
--bg-card: #121215       (cards)
--bg-card-hover: #17171b
--border: rgba(255,255,255,.08)
--border-strong: rgba(255,255,255,.16)
--text: #ececef
--text-muted: #9d9da6
--text-dim: #62626b
--purple: #8b5cf6
--purple-strong: #7c3aed
--purple-soft: #a78bfa
--shadow-card: 0 10px 30px rgba(0,0,0,.45)
--shadow-hover: 0 18px 44px rgba(0,0,0,.55)
--transition: 0.2s ease
```
- Selection color: `--purple`, white text. `::selection { background: var(--purple); color: #fff; }`.

## 3. Typography — ONE font per language, per whole page
- EN: **Space Grotesk** / AR: **IBM Plex Sans Arabic** / mono accents: **JetBrains Mono**.
- Hard overrides (never per-element font overrides):
  ```css
  html[dir="rtl"] body, html[dir="rtl"] body * { font-family: "IBM Plex Sans Arabic", ...; }
  html[lang="en"] body, html[lang="en"] body * { font-family: "Space Grotesk", ...; }
  ```
- `.gradient-text`: `linear-gradient(100deg, var(--purple-soft) 0%, var(--purple) 55%, var(--purple-strong) 100%)` with `background-clip: text`.
- Section-head pattern: `.section-tag` (mono, uppercase, purple, `// ` prefix) + `.section-title` (`clamp(1.7rem,3.6vw,2.5rem)`, 700, letter-spacing -0.02em, can hold a `<span class="gradient-text">`) + `.section-subtitle` (`--text-muted`, ~1.02rem).

## 4. Shape = FULLY ROUNDED
- Radius tokens: `--radius: 22px` (cards), `--radius-sm: 12px` (small), `--radius-lg: 32px`.
- Pill shape **999px**: all buttons, tabs, badges, language switcher, section tags where pill-like.
- Cards: bg `--bg-card`, border `--border`, radius `--radius`, hover `translateY(-3px)` + `border-color: var(--border-strong)` + `--shadow-hover`.
- Layout: `.container { width: min(1140px, 92%); margin-inline: auto; }`, `.section { padding: 110px 0; }`, smooth scroll, `scroll-padding-top: 84px`.

## 5. Page Sections (order)
1. Header (sticky nav + logo + flag language dropdown + CTA) with mobile hamburger menu.
2. Hero — headline (bilingual, key `hero.title`, holds `<span class="gradient-text">`), subtitle, CTA buttons, stats row (live online-server count = `.stat-number[data-stat="servers"]`).
3. Features — 6 cards, techy icons, mono labels.
4. Pricing — tabbed **Bot / Minecraft** with tab buttons; cards with `★ Most Popular` (`--purple` border + ring); price format `0.5$` via `.currency{order:2}` + `.amount{order:1}`; credits shown as "20 Million Credits" in both languages.
5. Locations — **Germany only**, one full-width `.location-featured` card: `DE · FRA` code + `assets/germany.png` flag (22×15, radius 3px, border) + badge "All plans hosted here". Purple ring + radial purple gradient bg.
6. Team — grid of `.owner-card`s: 44px round avatar image (`assets/avatars/<id>.png`, fallback = first letter), name + server name. Rendered by `js/owners.js` from `window.SPARK_OWNERS`.
7. Contact — "Talk to our team" CTA → Discord.
8. Footer — logo, links, "Join the Discord" card, flag switcher mirror.
- Plus: `#back-to-top` circular button bottom-right.

## 6. Pricing data (do not change without asking)
- Bot: 512MB $0.5 / 20M credits · 1GB $1 / 40M · 2GB $2 / 55M ★Most Popular · 3GB $4 / 70M · 4GB $8 / 85M
- Minecraft: 2GB $2 ★Most Popular · 3GB $4 · 5GB $6
- RAM/NVMe specs must be readable Arabic: `512MB RAM`, `1GB RAM`, `5GB NVMe` (GB/MB, never abbreviations like ج.ب/م.ب).

## 7. Languages (EN / AR, full i18n)
- Dictionary in `js/script.js`: EN dict + AR dict, identical key sets. HTML uses `data-i18n` (text) and `data-i18n-html` (allows HTML like gradient spans).
- RTL: `<html lang="ar" dir="rtl">`; right-align body/section-head/contact-wrap/stats/hero-subtitle via `html[dir="rtl"]`.
- Language switcher = custom dropdown (NOT native `<select>`, NOT emoji): button + `ul.lang-menu`, flag images `assets/united.png` (EN) / `assets/saudi.png` (AR), chevron SVG; click-outside closes; dispatches `CustomEvent("spark:lang")`.
- Key coverage must stay 100%: run `checkkeys.js` (currently 175/175/175).

## 8. Architecture — NO database
- Pure static site served by `server.js` (`node server.js` → http://localhost:3000). Static file server, no deps, traversal-safe, port via `PORT` env.
- Discord bot (`bot/bot.js`) is the ONLY writer:
  - Detects team by the **Owners role** (`OWNERS_ROLE_ID`, currently `1510684921088446565`) — role auto-sync on startup + every 15 min + `/owners sync`.
  - Downloads avatars → `assets/avatars/<discord_id>.png`.
  - Writes `assets/owners-data.js` → `window.SPARK_OWNERS` + `window.SPARK_SERVERS` (online/total count).
  - Requires **Server Members Intent** (user gave the bot Administrator too).
  - Commands: `/owners sync|add|remove|list`, `/server upsert|status|stats|sync`.
- Website reads `assets/owners-data.js` via `js/owners.js`; renders team + live online server count. Default file ships empty so the site works before the bot runs.
- Security: bot only writes inside `assets/`; no API keys on the site.

## 9. Coding conventions
- NO code comments unless asked. Mimic existing style (spaces, 4-space indent, single quotes in HTML, `var`/function style in site JS).
- Editing UTF-8 files: never use PowerShell `Set-Content` (corrupts Arabic) — use the write/edit tools or .NET `[System.IO.File]::WriteAllText` UTF8.
- After edits run: `node --check` on JS, CSS brace balance check, `checkkeys.js`, and the jsdom harness `test2.js` (in `...\AppData\Local\Temp\opencode\sparktest`; needs `Copy-Item` of `index.html`, `css/styles.css`, `js/script.js` first). Verify visually with hard refresh (Ctrl+F5) because of caching.
- The mini-creeper service icon: purple rounded SVG creeper face (`#c4b5fd→#8b5cf6` gradient head, `#1e1b4b` pixels).
- Logo: `assets/logo.jpg` (736×736) shown as fixed 40×40 rounded square (radius 12px, subtle border), `direction: ltr; unicode-bidi: isolate;` so RTL never flips it.

## 10. Test harness locations
- `C:\Users\Stornex\AppData\Local\Temp\opencode\sparktest\checkkeys.js` — HTML vs EN vs AR key coverage.
- `C:\Users\Stornex\AppData\Local\Temp\opencode\sparktest\test2.js` — jsdom smoke test (evals `script.js`, checks RTL, untranslated=0, no duplicate IDs).
