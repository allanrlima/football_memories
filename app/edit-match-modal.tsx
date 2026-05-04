import { router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import MatchForm, { FormValues } from '@/components/match-form';
import { getMatchById, updateMatch } from '@/db/database';

export default function EditMatchModal() {
  const db = useSQLiteContext();
  const { id } = useLocalSearchParams<{ id: string }>();
  const matchId = Number(id);
  const [defaults, setDefaults] = useState<FormValues | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMatchById(db, matchId).then((m) => {
      if (cancelled) return;
      if (!m) {
        Alert.alert('Match not found');
        router.back();
        return;
      }
      setDefaults({
        homeTeamName: m.home_team_name,
        homeTeamScore: m.home_team_score ?? '',
        awayTeamName: m.away_team_name,
        awayTeamScore: m.away_team_score ?? '',
        matchDate: m.match_date ?? '',
        stadiumName: m.stadium_name ?? '',
        competitionName: m.competition_name ?? '',
        cityName: m.city_name ?? '',
        countryName: m.country_name ?? '',
        youtubeLink: m.youtube_link ?? '',
        annotations: m.annotations ?? '',
      });
    });
    return () => {
      cancelled = true;
    };
  }, [db, matchId]);

  if (!defaults) return null;

  const onSubmit = async (data: FormValues) => {
    try {
      await updateMatch(db, matchId, data);
      router.back();
    } catch (e) {
      Alert.alert('Could not update match', String(e));
    }
  };

  return (
    <MatchForm
      title="Edit Match"
      submitLabel="Update Match"
      defaultValues={defaults}
      onSubmit={onSubmit}
    />
  );
}
