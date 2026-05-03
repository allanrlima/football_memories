import { StyleSheet, Text, View } from 'react-native';

type HeadingProps = {
  text: string;
};

export default function Heading({ text }: HeadingProps) {
  return (
    <View>
      <Text style={styles.textContainer}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    color: '#FFFFFF',
    fontSize: 32,
  },
});
