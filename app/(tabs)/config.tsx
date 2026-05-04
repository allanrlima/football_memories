import DownloadIcon from '@/assets/icons/download.svg';
import ExternalLinkIcon from '@/assets/icons/external-link.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import UploadIcon from '@/assets/icons/upload.svg';
import DefaultText from '@/components/default-text';
import Heading from '@/components/heading';
import VerticalSpacer from '@/components/vertical-spacer';
import { getMatches, importMatches } from '@/db/database';
import { matchesToCsv, parseMatchesCsv } from '@/lib/csv';
import { STUDIO_DATA } from '@/lib/steam-games';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type BusyState = 'idle' | 'export' | 'import';

export default function ConfigScreen() {
  const db = useSQLiteContext();
  const [busy, setBusy] = useState<BusyState>('idle');

  const handleExport = async () => {
    try {
      setBusy('export');
      const matches = await getMatches(db);
      const csv = matchesToCsv(matches);
      const stamp = new Date().toISOString().slice(0, 10);
      const filename = `football-memories-${stamp}.csv`;
      const uri = (FileSystem.cacheDirectory ?? '') + filename;
      await FileSystem.writeAsStringAsync(uri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing unavailable', 'This device does not support sharing files.');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'text/csv',
        UTI: 'public.comma-separated-values-text',
        dialogTitle: 'Export matches',
      });
    } catch (e) {
      Alert.alert('Export failed', String((e as Error)?.message ?? e));
    } finally {
      setBusy('idle');
    }
  };

  const handleImport = async () => {
    try {
      setBusy('import');
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'text/csv',
          'text/comma-separated-values',
          'public.comma-separated-values-text',
          '*/*',
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      const text = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const { rows, skipped } = parseMatchesCsv(text);
      const inserted = await importMatches(db, rows);
      Alert.alert(
        'Import complete',
        `Imported ${inserted} matches, skipped ${skipped} invalid rows.`,
      );
    } catch (e) {
      Alert.alert('Import failed', String((e as Error)?.message ?? e));
    } finally {
      setBusy('idle');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <DefaultText text="Settings" />
        <Heading text="Config" />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SettingsIcon width={14} height={14} color="#8A95A2" />
            <DefaultText text="Match Data" />
          </View>

          <View style={styles.dataRow}>
            <Pressable style={styles.dataCard} onPress={handleExport} disabled={busy !== 'idle'}>
              <View style={[styles.dataIconBadge, { backgroundColor: 'rgba(0, 217, 100, 0.15)' }]}>
                {busy === 'export' ? (
                  <ActivityIndicator color="#00D964" />
                ) : (
                  <DownloadIcon width={20} height={20} color="#00D964" />
                )}
              </View>
              <Text style={styles.dataCardTitle}>Export CSV</Text>
              <Text style={styles.dataCardSubtitle}>Download all matches</Text>
            </Pressable>

            <Pressable style={styles.dataCard} onPress={handleImport} disabled={busy !== 'idle'}>
              <View style={[styles.dataIconBadge, { backgroundColor: 'rgba(14, 165, 233, 0.15)' }]}>
                {busy === 'import' ? (
                  <ActivityIndicator color="#0EA5E9" />
                ) : (
                  <UploadIcon width={20} height={20} color="#0EA5E9" />
                )}
              </View>
              <Text style={styles.dataCardTitle}>Import CSV</Text>
              <Text style={styles.dataCardSubtitle}>Restore from file</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View>
            <DefaultText text="This app was created by Pro Nobis Game Studio" />
          </View>

          <VerticalSpacer size={16} />

          <View>
            <DefaultText text="Check out other creations from our studio:" />
          </View>

          <VerticalSpacer size={16} />

          <View style={{ gap: 12 }}>
            {STUDIO_DATA.map((game) => (
              <Pressable
                key={game.abbr}
                style={styles.gameRow}
                onPress={() => Linking.openURL(game.url)}
              >
                <View style={[styles.gameTile, { backgroundColor: game.colors[1] }]}>
                  <View style={[styles.gameTileShade, { backgroundColor: game.colors[0] }]} />
                  <Text style={styles.gameTileText}>{game.abbr}</Text>
                </View>
                <View style={styles.gameInfo}>
                  <Text style={styles.gameTitle}>{game.title}</Text>
                  <Text style={styles.gameGenre}>{game.genre}</Text>
                </View>
                <ExternalLinkIcon width={18} height={18} color="#8A95A2" />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0F1419',
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginTop: 20,
    backgroundColor: '#171d24',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2730',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dataCard: {
    flex: 1,
    backgroundColor: '#0F1419',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2730',
  },
  dataIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dataCardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  dataCardSubtitle: {
    color: '#8A95A2',
    fontSize: 12,
    marginTop: 2,
  },
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1419',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1F2730',
    gap: 12,
  },
  gameTile: {
    width: 64,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gameTileShade: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '55%',
    opacity: 0.85,
  },
  gameTileText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  gameGenre: {
    color: '#8A95A2',
    fontSize: 12,
    marginTop: 2,
  },
});
