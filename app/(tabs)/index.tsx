import PlusIcon from '@/assets/icons/plus.svg';
import DefaultText from '@/components/default-text';
import Heading from '@/components/heading';
import MatchComponent from '@/components/match';
import { getMatches, getMatchStats } from '@/db/database';
import type { Match } from '@/types';
import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const openModal = () => {
  router.push('/add-match-modal');
};

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [stats, setStats] = useState({ matches: 0, countries: 0 });
  const [matches, setMatches] = useState<Match[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getMatchStats(db).then((next) => {
        if (!cancelled) setStats(next);
      });

      getMatches(db).then((next) => {
        if (!cancelled) setMatches(next);
      });

      return () => {
        cancelled = true;
      };
    }, [db]),
  );

  return (
    <SafeAreaView style={styles.safeAreaViwStyle}>
      <View>
        <DefaultText text="football memories" />
        <Heading text="My Matches" />
        <DefaultText text={`${stats.matches} matches attended · ${stats.countries} countries`} />
        <View style={styles.verticalSpacer} />

        <FlatList
          data={matches}
          renderItem={({ item }) => {
            return <MatchComponent item={item} />;
          }}
        />
      </View>
      <Pressable style={styles.plusButton} onPress={openModal}>
        <PlusIcon width={28} height={28} color="#062611" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaViwStyle: {
    backgroundColor: '#0F1419',
    padding: 16,
    flex: 1,
  },
  plusButton: {
    height: 58,
    width: 58,
    borderRadius: 90,
    bottom: 16,
    right: 16,
    backgroundColor: '#00D964',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  verticalSpacer: {
    paddingBottom: 32,
  },
});
