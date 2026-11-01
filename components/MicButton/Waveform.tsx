import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface WaveformProps {
  isRecording?: boolean;
}

const BAR_COUNT = 36;
const BASE_HEIGHTS = [
  16, 24, 38, 54, 70, 84, 96, 80, 64, 52, 40, 60,
  82, 100, 114, 90, 72, 58, 48, 66, 88, 108, 92, 70,
  45, 30, 24, 20, 18, 16, 14, 12, 12, 10, 10, 8,
];

function WaveBar({ index, baseHeight, isRecording }: { index: number; baseHeight: number; isRecording: boolean }) {
  const scaleY = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      const delay = (index % 6) * 70;
      scaleY.value = withRepeat(
        withTiming(0.35 + ((index * 7) % 65) / 100, {
          duration: 400 + ((index * 31) % 350),
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        -1,
        true
      );
    } else {
      scaleY.value = withTiming(1, { duration: 300 });
    }
  }, [isRecording, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
  }));

  const isLiveHead = index === 17;

  return (
    <View style={styles.barWrapper}>
      <Animated.View
        style={[
          styles.bar,
          { height: baseHeight },
          index > 17 ? styles.futureBar : styles.pastBar,
          animatedStyle,
        ]}
      />
      {isLiveHead && <View style={styles.needle} />}
    </View>
  );
}

export function Waveform({ isRecording = true }: WaveformProps) {
  return (
    <View style={styles.container}>
      <View style={styles.waveformRow}>
        {BASE_HEIGHTS.map((height, i) => (
          <WaveBar key={i} index={i} baseHeight={height} isRecording={isRecording} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3.5,
    height: 120,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  bar: {
    width: 3.5,
    borderRadius: 2,
  },
  pastBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  futureBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  needle: {
    position: 'absolute',
    width: 2,
    height: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 1,
  },
});