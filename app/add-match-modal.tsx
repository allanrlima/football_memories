import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { z } from 'zod';

import DefaultText from '@/components/default-text';
import Heading from '@/components/heading';
import Input from '@/components/input';
import SuccessButton from '@/components/success-button';
import { colors } from '@/constants/theme';
import { addMatch } from '@/db/database';

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseDate = (value: string) => {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const scoreField = z.string().regex(/^\d{0,3}$/, 'Score must be a number (0-999)');

const dateField = z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/, 'Use YYYY-MM-DD');

const urlField = z.string().refine(
  (v) => {
    if (v === '') return true;
    try {
      const u = new URL(v);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  },
  { message: 'Must be a valid http(s) URL' },
);

export const formSchema = z.object({
  homeTeamName: z.string().min(3, 'Name too short'),
  homeTeamScore: scoreField,
  awayTeamName: z.string().min(3, 'Name too short'),
  awayTeamScore: scoreField,
  matchDate: dateField,
  stadiumName: z.string(),
  competitionName: z.string(),
  cityName: z.string(),
  countryName: z.string(),
  youtubeLink: urlField,
  annotations: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddMatchModal() {
  const db = useSQLiteContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await addMatch(db, data);
      router.back();
    } catch (e) {
      Alert.alert('Could not save match', String(e));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Heading text="Add Match" />
        <View style={styles.formContainer}>
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
        </View>

        <View style={styles.fieldsContainer}>
          <View style={styles.field}>
            <DefaultText text="Match Date" />
            <Controller
              control={control}
              name="matchDate"
              render={({ field: { onChange, value } }) => {
                const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
                  if (Platform.OS !== 'ios') setShowDatePicker(false);
                  if (event.type === 'set' && selected) onChange(formatDate(selected));
                };
                return (
                  <View>
                    <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                      <Text style={value ? styles.dateText : styles.datePlaceholder}>
                        {value || 'YYYY-MM-DD'}
                      </Text>
                    </Pressable>
                    {showDatePicker && (
                      <DateTimePicker
                        value={parseDate(value)}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleChange}
                        textColor={colors.text.primary}
                        themeVariant="dark"
                      />
                    )}
                    {errors.matchDate?.message && (
                      <Text style={styles.error}>{errors.matchDate.message}</Text>
                    )}
                  </View>
                );
              }}
            />
          </View>

          <View style={styles.field}>
            <DefaultText text="Stadium Name" />
            <Input
              control={control}
              name="stadiumName"
              placeholder="Stadium"
              error={errors.stadiumName?.message}
            />
          </View>

          <View style={styles.field}>
            <DefaultText text="Competition Name" />
            <Input
              control={control}
              name="competitionName"
              placeholder="Competition"
              error={errors.competitionName?.message}
            />
          </View>

          <View style={styles.field}>
            <DefaultText text="City Name" />
            <Input
              control={control}
              name="cityName"
              placeholder="City"
              error={errors.cityName?.message}
            />
          </View>

          <View style={styles.field}>
            <DefaultText text="Country Name" />
            <Input
              control={control}
              name="countryName"
              placeholder="Country"
              error={errors.countryName?.message}
            />
          </View>

          <View style={styles.field}>
            <DefaultText text="Youtube Link" />
            <Input
              control={control}
              name="youtubeLink"
              placeholder="https://youtube.com/..."
              autoCapitalize="none"
              keyboardType="url"
              error={errors.youtubeLink?.message}
            />
          </View>

          <View style={styles.field}>
            <DefaultText text="Annotations" />
            <Input
              control={control}
              name="annotations"
              placeholder="Notes about the match"
              multiline
              error={errors.annotations?.message}
            />
          </View>
        </View>

        <SuccessButton title="Save Match" onPress={handleSubmit(onSubmit)} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  formContainer: {
    width: '100%',
    gap: 8,
    marginBottom: 32,
  },
  fieldsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  field: {
    gap: 4,
  },
  teamsContainer: {
    backgroundColor: colors.bg.card,
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
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingBottom: 32,
  },
  dateInput: {
    backgroundColor: colors.bg.input,
    padding: 12,
    borderRadius: 12,
  },
  dateText: {
    color: colors.text.primary,
  },
  datePlaceholder: {
    color: colors.text.placeholder,
  },
  error: {
    color: colors.text.error,
    fontSize: 12,
    marginTop: 4,
  },
});
