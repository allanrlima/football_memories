import { View } from 'react-native';

type VerticalSpacerProps = {
  size?: number;
};

export default function VerticalSpacer({ size = 32 }: VerticalSpacerProps) {
  return <View style={{ height: size }} />;
}
