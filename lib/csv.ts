import type { Match, MatchInput } from '@/types';

const HEADERS = [
  'home_team_name',
  'home_team_score',
  'away_team_name',
  'away_team_score',
  'match_date',
  'stadium_name',
  'competition_name',
  'city_name',
  'country_name',
  'youtube_link',
  'annotations',
] as const;

type Header = (typeof HEADERS)[number];

function escapeField(value: string | null | undefined): string {
  if (value === null || value === undefined) return '';
  const needsQuoting = /[",\r\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuoting ? `"${escaped}"` : escaped;
}

export function matchesToCsv(matches: Match[]): string {
  const lines: string[] = [HEADERS.join(',')];
  for (const m of matches) {
    lines.push(
      [
        escapeField(m.home_team_name),
        escapeField(m.home_team_score),
        escapeField(m.away_team_name),
        escapeField(m.away_team_score),
        escapeField(m.match_date),
        escapeField(m.stadium_name),
        escapeField(m.competition_name),
        escapeField(m.city_name),
        escapeField(m.country_name),
        escapeField(m.youtube_link),
        escapeField(m.annotations),
      ].join(','),
    );
  }
  return lines.join('\r\n') + '\r\n';
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\r') {
      if (text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else if (c === '\n') {
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

export function parseMatchesCsv(text: string): { rows: MatchInput[]; skipped: number } {
  const all = parseCsv(text);
  const headerRow = all[0];
  if (!headerRow) return { rows: [], skipped: 0 };

  const header = headerRow.map((h) => h.trim().toLowerCase());
  const idx = Object.fromEntries(HEADERS.map((h) => [h, header.indexOf(h)])) as Record<
    Header,
    number
  >;

  if (idx.home_team_name < 0 || idx.away_team_name < 0) {
    throw new Error('CSV missing required header: home_team_name / away_team_name');
  }

  const rows: MatchInput[] = [];
  let skipped = 0;
  for (let i = 1; i < all.length; i++) {
    const r = all[i];
    if (!r) continue;
    const get = (key: Header) => (idx[key] >= 0 ? (r[idx[key]] ?? '') : '');
    const home = get('home_team_name').trim();
    const away = get('away_team_name').trim();
    if (!home || !away) {
      skipped++;
      continue;
    }
    rows.push({
      homeTeamName: home,
      homeTeamScore: get('home_team_score'),
      awayTeamName: away,
      awayTeamScore: get('away_team_score'),
      matchDate: get('match_date'),
      stadiumName: get('stadium_name'),
      competitionName: get('competition_name'),
      cityName: get('city_name'),
      countryName: get('country_name'),
      youtubeLink: get('youtube_link'),
      annotations: get('annotations'),
    });
  }
  return { rows, skipped };
}
