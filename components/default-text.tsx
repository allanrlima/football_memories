import { StyleSheet, Text, View } from 'react-native';

type DefaultTextProps = {
  text: string;
  center?: boolean;
  marginTop?: number;
};

export default function DefaultText({ text, center, marginTop }: DefaultTextProps) {
  return (
    <View>
      <Text
        style={[
          styles.textContainer,
          center && styles.center,
          marginTop !== undefined && { marginTop },
        ]}
      >
        {text.toLocaleUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    color: '#8A95A2',
    fontSize: 12,
  },
  center: {
    textAlign: 'center',
  },
});
