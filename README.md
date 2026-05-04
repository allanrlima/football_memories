# Football Memories

A small React Native / Expo app for logging football matches you've attended in person, with lifetime stats and CSV import / export. Local‑only — every match is stored in an on‑device SQLite database.

Built by [Pro Nobis Game Studio](https://pronobisgamestudio.com).

## Features

- **Matches tab** — list of every match you've added, sortable by entry date. Tap a card to expand notes, open the YouTube highlights link, or delete the match.
- **Stats tab** — lifetime totals: matches attended, seasons covered (UK season convention, August → July), most‑visited stadium, most‑watched team, total goals witnessed (and per‑match average), and number of countries.
- **Config tab** — export your full database to CSV and re‑import it later (round‑trips through the same `home_team_name,…,annotations` schema).
- **Add Match modal** — `react-hook-form` + `zod` form with a native date picker, numeric‑only score fields, and `http(s)` URL validation for highlight links.

## Stack

- Expo SDK 54 (React Native 0.81, React 19, new architecture enabled)
- `expo-router` v6 with file‑based routing and typed routes
- `expo-sqlite` for persistence
- `expo-file-system` (modern `File` / `Paths` API) + `expo-sharing` + `expo-document-picker` for CSV I/O
- `react-hook-form` + `zod` for form validation
- `react-native-svg` (via `react-native-svg-transformer`) for inline SVG icons
- TypeScript strict mode + `noUncheckedIndexedAccess`

## Project layout

```
app/                       expo-router routes
  _layout.tsx              root stack + SQLite provider
  add-match-modal.tsx      "Add Match" form (modal presentation)
  (tabs)/
    _layout.tsx            bottom tab bar
    index.tsx              Matches list
    stats.tsx              Lifetime stats
    config.tsx             CSV export / import + studio links
components/                shared UI (DefaultText, Heading, Input, Match, etc.)
constants/theme.ts         single source of truth for the color palette
db/database.ts             schema, indexes, and all SQL queries
hooks/                     (currently empty after template cleanup)
lib/csv.ts                 RFC‑4180 CSV reader / writer for Match rows
lib/steam-games.ts         studio links shown on the Config tab
types/index.ts             Match, MatchInput, MatchStats, LifetimeStats
assets/icons/              SVG icons consumed via the SVG transformer
```

## Data model

A single `matches` table:

| column             | type    | notes                                    |
| ------------------ | ------- | ---------------------------------------- |
| `id`               | INTEGER | primary key                              |
| `home_team_name`   | TEXT    | required                                 |
| `home_team_score`  | TEXT    | optional, stored as text                 |
| `away_team_name`   | TEXT    | required                                 |
| `away_team_score`  | TEXT    | optional                                 |
| `match_date`       | TEXT    | `YYYY-MM-DD`                             |
| `stadium_name`     | TEXT    |                                          |
| `competition_name` | TEXT    |                                          |
| `city_name`        | TEXT    |                                          |
| `country_name`     | TEXT    |                                          |
| `youtube_link`     | TEXT    | validated as `http(s)` URL on input      |
| `annotations`      | TEXT    | free‑form notes                          |
| `created_at`       | TEXT    | defaults to `CURRENT_TIMESTAMP`          |

Indexes on `created_at`, `match_date`, `country_name`, `stadium_name`, `home_team_name`, and `away_team_name` back the list ordering and the `getLifetimeStats` aggregations.

## Getting started

Install dependencies and start the dev server:

```bash
npm install
npm run ios      # or: npm run android, npm run web, npm start
```

Other scripts:

```bash
npm run lint           # expo lint
npm run lint:fix
npm run format         # prettier --write .
npm run format:check
```

## CSV format

Export and import use the same headers in this exact order:

```
home_team_name,home_team_score,away_team_name,away_team_score,match_date,stadium_name,competition_name,city_name,country_name,youtube_link,annotations
```

Rows missing both `home_team_name` and `away_team_name` are skipped (the count is reported in the import‑complete alert). Quoting follows RFC 4180 — fields containing `,`, `"`, `\r`, or `\n` are double‑quoted with internal `"` doubled.
