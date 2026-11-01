import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface MicButtonProps {
  isRecording: boolean;
  onPress: () => void;
}

// Dedicated Ripple ring component executing entirely on the UI thread worklet
function RippleRing({ delay, isRecording }: { delay: number; isRecording: boolean }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    // UI-thread worklet: runs 60fps on UI thread, never blocks JS thread
    progress.value = withRepeat(
      withTiming(1, {
        duration: 2200,
        easing: Easing.bezier(0.2, 0, 0, 1),
      }),
      -1,
      false
    );
  }, [progress]);

  const animatedRingStyle = useAnimatedStyle(() => {
    // Normalized phase with delay offset
    const phase = (progress.value + delay) % 1;
    const scale = interpolate(phase, [0, 1], [1, 2.3]);
    const opacity = interpolate(phase, [0, 0.2, 0.7, 1], [0.45, 0.35, 0.12, 0]);

    return {
      transform: [{ scale }],
      opacity,
      backgroundColor: isRecording
        ? 'rgba(211, 47, 47, 0.3)'
        : 'rgba(36, 72, 59, 0.22)',
    };
  });

  return <Animated.View pointerEvents="none" style={[styles.rippleRing, animatedRingStyle]} />;
}

export function MicButton({ isRecording, onPress }: MicButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <View style={styles.container}>
      <View style={styles.ringCenterContainer}>
        {/* Continuous UI-Thread Ripple Waves (Never touches or blocks JS main thread) */}
        <RippleRing delay={0} isRecording={isRecording} />
        <RippleRing delay={0.35} isRecording={isRecording} />
        <RippleRing delay={0.7} isRecording={isRecording} />

        {/* Ambient Halo Base */}
        <View style={styles.pulseRingOuter}>
          <View style={styles.pulseRingInner}>
            <Pressable
              onPress={handlePress}
              style={({ pressed }) => [
                styles.micCircle,
                isRecording ? styles.recordingCircle : styles.idleCircle,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
            >
              <Ionicons
                name={isRecording ? 'square' : 'mic'}
                size={32}
                color="#ffffff"
              />
            </Pressable>
          </View>
        </View>
      </View>

      <Text style={styles.hintText}>
        {isRecording ? 'Tap to finish' : 'Tap to start'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCenterContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rippleRing: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    zIndex: 0,
  },
  pulseRingOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(40, 79, 65, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  pulseRingInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(40, 79, 65, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1F362E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  idleCircle: {
    backgroundColor: '#24483B',
  },
  recordingCircle: {
    backgroundColor: '#D32F2F',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  hintText: {
    marginTop: 14,
    fontSize: 14,
    color: '#284F41',
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});