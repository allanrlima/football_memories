import PlusIcon from '@/assets/icons/plus.svg';
import DefaultText from '@/components/default-text';
import Heading from '@/components/heading';
import MatchComponent from '@/components/match';
import StudioFooter from '@/components/studio-footer';
import VerticalSpacer from '@/components/vertical-spacer';
import { colors } from '@/constants/theme';
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
  const [openMatchId, setOpenMatchId] = useState<number | null>(null);

  const refresh = useCallback(() => {
    getMatchStats(db).then(setStats);
    getMatches(db).then(setMatches);
  }, [db]);

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
    <SafeAreaView style={styles.safeAreaViewStyle}>
      <View>
        <FlatList
          ListHeaderComponent={
            <View>
              <DefaultText text="football memories" />
              <Heading text="My Matches" />
              <DefaultText
                text={`${stats.matches} matches attended · ${stats.countries} countries`}
              />
              <VerticalSpacer />
            </View>
          }
          data={matches}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => {
            return (
              <MatchComponent
                item={item}
                isOpen={openMatchId === item.id}
                onToggle={() => setOpenMatchId((prev) => (prev === item.id ? null : item.id))}
                closeAllMatchComponents={() => setOpenMatchId(null)}
                onDeleted={refresh}
              />
            );
          }}
          ListFooterComponent={
            <View>
              <VerticalSpacer size={32} />
              <StudioFooter />
              <VerticalSpacer size={120} />
            </View>
          }
        />
      </View>
      <Pressable style={styles.plusButton} onPress={openModal}>
        <PlusIcon width={28} height={28} color={colors.text.onAccent} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    backgroundColor: colors.bg.base,
    padding: 16,
    flex: 1,
  },
  plusButton: {
    height: 58,
    width: 58,
    borderRadius: 90,
    bottom: 16,
    right: 16,
    backgroundColor: colors.accent.green,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});
