import MapPinIcon from '@/assets/icons/map-pin.svg';
import { deleteMatch } from '@/db/database';
import { Match } from '@/types';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import DefaultText from './default-text';

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value.replace(' ', 'T') + 'Z');
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function MatchComponent({
  item,
  isOpen,
  onToggle,
  closeAllMatchComponents,
  onDeleted,
}: {
  item: Match;
  isOpen: boolean;
  onToggle: () => void;
  closeAllMatchComponents: () => void;
  onDeleted: () => void;
}) {
  const db = useSQLiteContext();

  const openYoutubeLink = async (url: string) => {
    await Linking.openURL(url);

    closeAllMatchComponents();
  };

  const onDeleteMatch = () => {
    Alert.alert('Are you sure you want to delete a match?', 'this will be erased forever', [
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          await deleteMatch(db, item.id);
          onDeleted();
        },
      },
      {
        text: 'No',
      },
    ]);
  };

  const youtubeLink = item?.youtube_link;

  return (
    <Pressable style={styles.container} onPress={onToggle}>
      <View style={styles.header}>
        <View style={styles.competitionContainer}>
          <Text style={styles.competitionText}>{item?.competition_name}</Text>
        </View>
        <View>
          <DefaultText text={item?.match_date || ''} />
        </View>
      </View>

      <View style={styles.scoreContainer}>
        <View>
          <Text style={styles.teamText}>{item?.home_team_name.slice(0, 20)}</Text>
        </View>
        <View style={{ backgroundColor: '#000', padding: 12, borderRadius: 16 }}>
          <Text style={styles.teamText}>
            {item?.home_team_score} - {item?.away_team_score}
          </Text>
        </View>
        <View>
          <Text style={styles.teamText}>{item?.away_team_name.slice(0, 20)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.stadiumContainer}>
          <MapPinIcon width={14} height={14} color="#8A95A2" />
          <DefaultText text={item?.stadium_name ?? ''} />
        </View>
        <View>
          <DefaultText text={`${item?.city_name ?? ''}, ${item?.country_name ?? ''}`} />
        </View>
      </View>

      {isOpen && (
        <View style={styles.notesAndYoutubeContainer}>
          <View style={{ marginBottom: 8 }}>
            <DefaultText text="Notes" />
          </View>
          <View>
            <Text style={styles.noteText}>{item?.annotations}</Text>
          </View>

          <View style={styles.youtubeAndDeleteContainer}>
            {youtubeLink && (
              <Pressable
                style={styles.youtubePressable}
                onPress={() => openYoutubeLink(youtubeLink)}
              >
                <Text style={styles.youtubePressableText}>Watch highlights</Text>
              </Pressable>
            )}
            <Pressable style={styles.deletePressable} onPress={onDeleteMatch}>
              <Text style={styles.deletePressableText}>Delete Match</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#171d24',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  competitionContainer: {
    borderColor: '#0EA5E9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  competitionText: {
    color: '#4ee5ff',
  },
  dateText: {
    color: 'white',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    borderTopColor: '#8A95A2',
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center',
  },
  stadiumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noteText: {
    color: 'white',
  },
  notesAndYoutubeContainer: {
    borderTopColor: '#8A95A2',
    borderTopWidth: 1,
    marginTop: 16,
    paddingTop: 8,
  },
  youtubeAndDeleteContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  youtubePressable: {
    backgroundColor: '#00D964',
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
  },
  youtubePressableText: {
    fontSize: 14,
  },
  deletePressable: {
    backgroundColor: 'red',
    borderRadius: 16,
    padding: 12,
    marginTop: 16,
  },
  deletePressableText: {
    fontSize: 14,
  },
});
