import type { SQLiteDatabase } from 'expo-sqlite';

import type { Match, MatchInput, MatchStats } from '@/types';

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
