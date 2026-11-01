import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface RecordingControlsProps {
  isRecording: boolean;
  onStop: () => void;
  onPauseToggle: () => void;
}

export function RecordingControls({
  isRecording,
  onStop,
  onPauseToggle,
}: RecordingControlsProps) {
  const handleStop = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStop();
  };

  const handlePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPauseToggle();
  };

  return (
    <View style={styles.controlsRow}>
      <Pressable
        onPress={handleStop}
        style={({ pressed }) => [styles.pillBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Stop recording"
      >
        <View style={styles.squareIcon} />
        <Text style={styles.pillText}>Stop</Text>
      </Pressable>

      <Pressable
        onPress={handlePause}
        style={({ pressed }) => [styles.pillBtn, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={isRecording ? 'Pause recording' : 'Resume recording'}
      >
        <Ionicons
          name={isRecording ? 'pause' : 'play'}
          size={16}
          color="#ffffff"
          style={styles.btnIcon}
        />
        <Text style={styles.pillText}>{isRecording ? 'Pause' : 'Resume'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    paddingBottom: 20,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    minWidth: 120,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  squareIcon: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  btnIcon: {
    marginRight: 6,
  },
  pillText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
