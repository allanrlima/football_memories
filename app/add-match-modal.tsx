import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';

import MatchForm, { FormValues } from '@/components/match-form';
import { addMatch } from '@/db/database';

const emptyValues: FormValues = {
  homeTeamName: '',
  homeTeamScore: '',
  awayTeamName: '',
  awayTeamScore: '',
  matchDate: '',
  stadiumName: '',
  competitionName: '',
  cityName: '',
  countryName: '',
  youtubeLink: '',
  annotations: '',
};

export default function AddMatchModal() {
  const db = useSQLiteContext();

  const onSubmit = async (data: FormValues) => {
    try {
      await addMatch(db, data);
      router.back();
    } catch (e) {
      Alert.alert('Could not save match', String(e));
    }
  };

  return (
    <MatchForm
      title="Add Match"
      submitLabel="Save Match"
      defaultValues={emptyValues}
      onSubmit={onSubmit}
    />
  );
}
