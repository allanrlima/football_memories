import GlobeIcon from '@/assets/icons/globe2.svg';
import GoalIcon from '@/assets/icons/goal.svg';
import MapPinIcon from '@/assets/icons/map-pin.svg';
import PitchDecorationIcon from '@/assets/icons/pitch-decoration.svg';
import TrophyIcon from '@/assets/icons/trophy.svg';
import DefaultText from '@/components/default-text';
import Heading from '@/components/heading';
import StudioFooter from '@/components/studio-footer';
import VerticalSpacer from '@/components/vertical-spacer';
import { colors } from '@/constants/theme';
import { getLifetimeStats } from '@/db/database';
import type { LifetimeStats } from '@/types';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EMPTY_STATS: LifetimeStats = {
  matches: 0,
  seasons: 0,
  since: null,
  topStadium: null,
  topTeam: null,
  goals: { total: 0, perMatch: 0 },
  countries: 0,
};

function formatSince(value: string | null) {
  if (!value) return '—';
  const date = new Date(value.replace(' ', 'T') + 'Z');
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export default function StatsScreen() {
  const db = useSQLiteContext();
  const [stats, setStats] = useState<LifetimeStats>(EMPTY_STATS);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getLifetimeStats(db).then((next) => {
        if (!cancelled) setStats(next);
      });
      return () => {
        cancelled = true;
      };
    }, [db]),
  );

  const seasonsLabel = stats.seasons === 1 ? 'season' : 'seasons';
  const visitsLabel = stats.topStadium?.visits === 1 ? 'visit' : 'visits';
  const matchesLabel = stats.topTeam?.matches === 1 ? 'match' : 'matches';
  const countriesLabel = stats.countries === 1 ? 'Country' : 'Countries';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <DefaultText text="Lifetime" />
        <Heading text="Stats" />
        <VerticalSpacer size={16} />

        <View style={styles.heroCard}>
          <View style={styles.heroDecoration}>
            <PitchDecorationIcon width={180} height={180} opacity={0.15} />
          </View>
          <View style={styles.heroContent}>
            <DefaultText text="Matches attended" />
            <Text style={styles.heroValue}>{stats.matches}</Text>
            <Text style={styles.heroSubtitle}>
              across{' '}
              <Text style={styles.heroSubtitleStrong}>
                {stats.seasons} {seasonsLabel}
              </Text>
              {stats.since ? <Text> · since {formatSince(stats.since)}</Text> : null}
            </Text>
          </View>
        </View>

        <VerticalSpacer size={16} />

        <View style={styles.grid}>
          <StatCard
            icon={<MapPinIcon width={18} height={18} color={colors.accent.pink} />}
            iconBg={colors.accent.pinkBg}
            value={stats.topStadium?.name ?? '—'}
            caption={
              stats.topStadium
                ? `Most-visited · ${stats.topStadium.visits} ${visitsLabel}`
                : 'Most-visited'
            }
          />
          <StatCard
            icon={<TrophyIcon width={18} height={18} color={colors.accent.pink} />}
            iconBg={colors.accent.pinkBg}
            value={stats.topTeam?.name ?? '—'}
            caption={
              stats.topTeam
                ? `Most-watched · ${stats.topTeam.matches} ${matchesLabel}`
                : 'Most-watched'
            }
          />
          <StatCard
            icon={<GoalIcon width={18} height={18} color={colors.accent.cyan} />}
            iconBg={colors.accent.cyanBg}
            value={String(stats.goals.total)}
            caption={`Goals witnessed · ${stats.goals.perMatch.toFixed(2)} / match`}
          />
          <StatCard
            icon={<GlobeIcon width={18} height={18} color={colors.accent.cyan} />}
            iconBg={colors.accent.cyanBg}
            value={String(stats.countries)}
            caption={`${countriesLabel} · visited`}
          />
        </View>

        <VerticalSpacer size={32} />

        <StudioFooter />

        <VerticalSpacer size={120} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  iconBg,
  value,
  caption,
}: {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  caption: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={styles.statValue} numberOfLines={2}>
        {value}
      </Text>
      <Text style={styles.statCaption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.bg.base,
    padding: 16,
    flex: 1,
  },
  heroCard: {
    backgroundColor: colors.bg.heroGreen,
    borderColor: colors.accent.green,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    overflow: 'hidden',
  },
  heroDecoration: {
    position: 'absolute',
    right: -40,
    top: -20,
  },
  heroContent: {
    gap: 8,
  },
  heroValue: {
    color: colors.text.primary,
    fontSize: 64,
    fontWeight: 'bold',
    lineHeight: 70,
  },
  heroSubtitle: {
    color: colors.text.muted,
    fontSize: 13,
  },
  heroSubtitleStrong: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: colors.bg.card,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  statCaption: {
    color: colors.text.muted,
    fontSize: 12,
  },
});
