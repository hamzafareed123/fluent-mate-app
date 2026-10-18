import Svg, { Circle } from 'react-native-svg';
import { StyleSheet, Text, View } from 'react-native';

import { typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

type Props = {
  progress: number;
  size?: number;
  label?: string;
};

export function ProgressRing({ progress, size = 96, label }: Props) {
  const { colors } = useTheme();
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = circumference * (1 - clamped);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.percent, { color: colors.text }]}>{Math.round(clamped * 100)}%</Text>
        {label ? <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  center: { position: 'absolute', alignItems: 'center' },
  percent: { ...typography.h3 },
  label: { ...typography.caption },
});
