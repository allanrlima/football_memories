import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';

import DefaultText from '@/components/default-text';
import Input from '@/components/input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export const formSchema = z.object({
  homeTeamName: z.string().min(3, 'Name too short'),
  homeTeamScore: z.string(),
  awayTeamName: z.string().min(3, 'Name too short'),
  awayTeamScore: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddMatchModal() {
  const {
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      homeTeamName: '',
      homeTeamScore: '',
      awayTeamName: '',
      awayTeamScore: '',
    },
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Add Match</ThemedText>

      <View style={styles.teamsContainer}>
        <DefaultText text="Home Team" />
        <View style={styles.nameScoreContainer}>
          <Input
            control={control}
            name="homeTeamName"
            placeholder="TEAM A"
            containerStyle={{ flexGrow: 1 }}
            error={errors.homeTeamName?.message}
          />
          <Input
            control={control}
            name="homeTeamScore"
            placeholder="Score A"
            keyboardType="numeric"
            error={errors.homeTeamScore?.message}
          />
        </View>
        <DefaultText text="Away Team" />
        <View style={styles.nameScoreContainer}>
          <Input
            control={control}
            name="awayTeamName"
            placeholder="TEAM B"
            containerStyle={{ flexGrow: 1 }}
            error={errors.awayTeamName?.message}
          />
          <Input
            control={control}
            name="awayTeamScore"
            placeholder="Score B"
            keyboardType="numeric"
            error={errors.awayTeamScore?.message}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  teamsContainer: {
    backgroundColor: '#171d24',
    width: '100%',
    padding: 16,
    borderRadius: 18,
    gap: 8,
  },
  nameScoreContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    backgroundColor: '#0F1419',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
