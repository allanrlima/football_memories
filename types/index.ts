export type Match = {
  id: number;
  home_team_name: string;
  home_team_score: string | null;
  away_team_name: string;
  away_team_score: string | null;
  match_date: string | null;
  stadium_name: string | null;
  competition_name: string | null;
  city_name: string | null;
  country_name: string | null;
  youtube_link: string | null;
  annotations: string | null;
  created_at: string;
};

export type MatchInput = {
  homeTeamName: string;
  homeTeamScore: string;
  awayTeamName: string;
  awayTeamScore: string;
  matchDate: string;
  stadiumName: string;
  competitionName: string;
  cityName: string;
  countryName: string;
  youtubeLink: string;
  annotations: string;
};

export type MatchStats = {
  matches: number;
  countries: number;
};

export type LifetimeStats = {
  matches: number;
  seasons: number;
  since: string | null;
  topStadium: { name: string; visits: number } | null;
  topTeam: { name: string; matches: number } | null;
  goals: { total: number; perMatch: number };
  countries: number;
};
