import { StyleSheet, Text, View } from 'react-native';

type DefaultTextProps = {
  text: string;
};

export default function DefaultText({ text }: DefaultTextProps) {
  return (
    <View>
      <Text style={styles.textContainer}>{text.toLocaleUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    color: '#8A95A2',
    fontSize: 12,
  },
});
