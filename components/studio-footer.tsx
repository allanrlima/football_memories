import ExternalLinkIcon from '@/assets/icons/external-link.svg';
import { colors } from '@/constants/theme';
import { StyleSheet, Text } from 'react-native';
import { ExternalLink } from './external-link';

export default function StudioFooter() {
  return (
    <ExternalLink href="https://pronobisgamestudio.com" style={styles.link}>
      <Text style={styles.text}>Made by Pro Nobis Game Studio</Text>
      <ExternalLinkIcon width={14} height={14} color={colors.text.muted} />
    </ExternalLink>
  );
}

const styles = StyleSheet.create({
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  text: {
    color: colors.text.muted,
    fontSize: 13,
  },
});
