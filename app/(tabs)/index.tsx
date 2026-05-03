import DefaultText from '@/components/default-text';
import Heading from '@/components/heading';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const getDescriptionText = () => {
  const matchesAttended: number = 0;
  const countries: number = 0;

  return `${matchesAttended.toString()} matches attended · ${countries.toString()} countries`;
};

const openModal = () => {
  router.push('/add-match-modal');
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeAreaViwStyle}>
      <View>
        <DefaultText text="football memories" />
        <Heading text="My Matches" />
        <DefaultText text={getDescriptionText()} />
      </View>
      <Pressable style={styles.plusButton} onPress={openModal}>
        {' '}
        123
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
    justifyContent: 'flex-end',
    position: 'absolute',
  },
});
