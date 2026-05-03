import { Button, GestureResponderEvent, StyleSheet, View } from 'react-native';

type SuccessButtonProps = {
  title: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
};

export default function SuccessButton({ title, onPress }: SuccessButtonProps) {
  return (
    <View style={styles.container}>
      <Button title={title} onPress={onPress} color={'#062611'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00d964',
    borderRadius: 12,
    width: '100%',
  },
});
