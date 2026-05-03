import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type InputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
} & TextInputProps;

export default function Input<T extends FieldValues>({
  control,
  name,
  error,
  style,
  containerStyle,
  ...rest
}: InputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <View style={containerStyle}>
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor="#1B2D37"
            style={[styles.input, style]}
            {...rest}
          />
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#0a0e13',
    padding: 12,
    color: '#ffffff',
    borderRadius: 12,
  },
  error: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
});
