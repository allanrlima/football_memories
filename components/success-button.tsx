import { Button, GestureResponderEvent, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

type SuccessButtonProps = {
  title: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

export default function SuccessButton({ title, onPress }: SuccessButtonProps) {
  return (
    <View style={styles.container}>
      <Button title={title} onPress={onPress} color={colors.text.onAccent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.accent.green,
    borderRadius: 12,
    width: '100%',
  },
});
