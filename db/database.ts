import type { SQLiteDatabase } from 'expo-sqlite';

import type { LifetimeStats, Match, MatchInput, MatchStats } from '@/types';

export const DATABASE_NAME = 'football-memories.db';

export async function initDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      home_team_name TEXT NOT NULL,
      home_team_score TEXT,
      away_team_name TEXT NOT NULL,
      away_team_score TEXT,
      match_date TEXT,
      stadium_name TEXT,
      competition_name TEXT,
      city_name TEXT,
      country_name TEXT,
      youtube_link TEXT,
      annotations TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function getMatchStats(db: SQLiteDatabase): Promise<MatchStats> {
  const row = await db.getFirstAsync<{ matches: number; countries: number }>(
    `SELECT
       COUNT(*) AS matches,
       COUNT(DISTINCT NULLIF(country_name, '')) AS countries
     FROM matches`,
  );
  return { matches: row?.matches ?? 0, countries: row?.countries ?? 0 };
}

export async function getLifetimeStats(db: SQLiteDatabase): Promise<LifetimeStats> {
  const totals = await db.getFirstAsync<{
    matches: number;
    countries: number;
    since: string | null;
    seasons: number;
    goals: number | null;
    scored_matches: number;
  }>(
    `SELECT
       COUNT(*) AS matches,
       COUNT(DISTINCT NULLIF(country_name, '')) AS countries,
       MIN(NULLIF(match_date, '')) AS since,
       COUNT(DISTINCT
         CASE
           WHEN NULLIF(match_date, '') IS NULL THEN NULL
           ELSE CAST(strftime('%Y', match_date) AS INTEGER)
                - CASE WHEN CAST(strftime('%m', match_date) AS INTEGER) < 8 THEN 1 ELSE 0 END
         END
       ) AS seasons,
       SUM(
         CAST(NULLIF(home_team_score, '') AS INTEGER)
         + CAST(NULLIF(away_team_score, '') AS INTEGER)
       ) AS goals,
       SUM(
         CASE
           WHEN NULLIF(home_team_score, '') IS NOT NULL
            AND NULLIF(away_team_score, '') IS NOT NULL
           THEN 1 ELSE 0
         END
       ) AS scored_matches
     FROM matches`,
  );

  const stadium = await db.getFirstAsync<{ name: string; visits: number }>(
    `SELECT stadium_name AS name, COUNT(*) AS visits
     FROM matches
     WHERE NULLIF(stadium_name, '') IS NOT NULL
     GROUP BY stadium_name
     ORDER BY visits DESC, stadium_name ASC
     LIMIT 1`,
  );

  const team = await db.getFirstAsync<{ name: string; matches: number }>(
    `SELECT team AS name, COUNT(*) AS matches FROM (
       SELECT home_team_name AS team FROM matches WHERE NULLIF(home_team_name, '') IS NOT NULL
       UNION ALL
       SELECT away_team_name AS team FROM matches WHERE NULLIF(away_team_name, '') IS NOT NULL
     )
     GROUP BY team
     ORDER BY matches DESC, team ASC
     LIMIT 1`,
  );

  const totalGoals = totals?.goals ?? 0;
  const scoredMatches = totals?.scored_matches ?? 0;
  const perMatch = scoredMatches > 0 ? totalGoals / scoredMatches : 0;

  return {
    matches: totals?.matches ?? 0,
    countries: totals?.countries ?? 0,
    since: totals?.since ?? null,
    seasons: totals?.seasons ?? 0,
    topStadium: stadium ? { name: stadium.name, visits: stadium.visits } : null,
    topTeam: team ? { name: team.name, matches: team.matches } : null,
    goals: { total: totalGoals, perMatch },
  };
}

export async function getMatches(db: SQLiteDatabase, search?: string): Promise<Match[]> {
  const term = search?.trim();
  if (!term) {
    return db.getAllAsync<Match>(`SELECT * FROM matches ORDER BY created_at DESC`);
  }
  const like = `%${term}%`;
  return db.getAllAsync<Match>(
    `SELECT * FROM matches
     WHERE home_team_name LIKE ?
        OR away_team_name LIKE ?
        OR stadium_name LIKE ?
        OR country_name LIKE ?
     ORDER BY created_at DESC`,
    [like, like, like, like],
  );
}

export async function addMatch(db: SQLiteDatabase, m: MatchInput) {
  return db.runAsync(
    `INSERT INTO matches (
       home_team_name, home_team_score,
       away_team_name, away_team_score,
       match_date, stadium_name, competition_name,
       city_name, country_name, youtube_link, annotations
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      m.homeTeamName,
      m.homeTeamScore,
      m.awayTeamName,
      m.awayTeamScore,
      m.matchDate,
      m.stadiumName,
      m.competitionName,
      m.cityName,
      m.countryName,
      m.youtubeLink,
      m.annotations,
    ],
  );
}

export async function deleteMatch(db: SQLiteDatabase, id: number) {
  return db.runAsync(`DELETE FROM matches WHERE id = ?`, [id]);
}

export async function importMatches(db: SQLiteDatabase, items: MatchInput[]): Promise<number> {
  if (items.length === 0) return 0;
  let inserted = 0;
  await db.withTransactionAsync(async () => {
    for (const m of items) {
      await addMatch(db, m);
      inserted++;
    }
  });
  return inserted;
}
