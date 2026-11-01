import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { saveSheetStyles as styles } from './SaveRecordingSheet.styles';

interface SaveRecordingSheetProps {
  visible: boolean;
  audioUri: string | null;
  durationText: string;
  defaultTitle?: string;
  onClose: () => void;
  onSave: (name?: string) => void;
}

const BAR_HEIGHTS = [10, 16, 24, 14, 28, 20, 12, 22, 28, 18, 14, 26, 16, 10];

export function SaveRecordingSheet({
  visible,
  audioUri,
  durationText,
  defaultTitle,
  onClose,
  onSave,
}: SaveRecordingSheetProps) {
  const [customTitle, setCustomTitle] = useState('');

  // 100ms update interval ensures the waveform scrubber animates smoothly
  const player = useAudioPlayer(audioUri || undefined, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (defaultTitle) setCustomTitle(defaultTitle);
  }, [defaultTitle]);

  const isPlaying = status.playing;
  const currentTime = status.currentTime || 0;
  const duration = status.duration || 0;

  // Progress ratio from 0 to 1
  const progressRatio = duration > 0 ? Math.min(Math.max(currentTime / duration, 0), 1) : 0;

  const handleTogglePlay = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!player) return;

    try {
      if (isPlaying) {
        player.pause();
      } else {
        if (currentTime > 0 && currentTime >= duration - 0.1) {
          await player.seekTo(0);
        }
        player.play();
      }
    } catch (e) {
      console.warn('Playback error:', e);
    }
  };

  const handleScrub = async (ratio: number) => {
    if (!player || duration <= 0) return;
    Haptics.selectionAsync();
    try {
      await player.seekTo(ratio * duration);
    } catch (e) {
      console.warn('Scrub seek error:', e);
    }
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (player && isPlaying) player.pause();
    onSave(customTitle.trim() || undefined);
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (player && isPlaying) player.pause();
    onClose();
  };

  // Format current playback or total duration
  const activeTimeFormatted =
    isPlaying && currentTime > 0
      ? `${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}`
      : durationText;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <Pressable style={styles.backdrop} onPress={handleCancel} />

        <View style={styles.sheetContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.sheetTitle}>Review & Save Reminder</Text>
            <Pressable onPress={handleCancel} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color="#444444" />
            </Pressable>
          </View>

          {/* Interactive Audio Player Preview Bar */}
          <View style={styles.previewBar}>
            <Pressable onPress={handleTogglePlay} style={styles.playBtn} hitSlop={6}>
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={18}
                color="#FFFFFF"
              />
            </Pressable>

            {/* Tap/Scrub Waveform Track with Dynamic Progress */}
            <Pressable
              style={styles.waveformTrack}
              onPress={(evt) => {
                const { locationX } = evt.nativeEvent;
                // Estimate ratio assuming typical width around 180px
                handleScrub(Math.min(Math.max(locationX / 180, 0), 1));
              }}
            >
              <View style={styles.waveformRow}>
                {BAR_HEIGHTS.map((h, idx) => {
                  const barRatio = idx / BAR_HEIGHTS.length;
                  const isPassed = progressRatio >= barRatio;
                  return (
                    <View
                      key={idx}
                      style={[
                        styles.miniBar,
                        {
                          height: h,
                          backgroundColor: isPassed ? '#284F41' : '#B8C4BF',
                        },
                      ]}
                    />
                  );
                })}
              </View>

              {/* Real-time moving indicator scrubber head */}
              <View
                style={[
                  styles.scrubHead,
                  { left: `${Math.round(progressRatio * 100)}%` },
                ]}
              />
            </Pressable>

            <View style={styles.durationTag}>
              <View
                style={[
                  styles.statusDot,
                  isPlaying && styles.statusDotActive,
                ]}
              />
              <Text style={styles.durationText}>{activeTimeFormatted}</Text>
            </View>
          </View>

          {/* Title input */}
          <TextInput
            style={styles.textInput}
            value={customTitle}
            onChangeText={setCustomTitle}
            placeholder={defaultTitle || 'Auto AI Title (or type here)'}
            placeholderTextColor="#88928E"
          />

          <View style={styles.actionButtons}>
            <Pressable
              onPress={handleCancel}
              style={({ pressed }) => [styles.cancelBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [styles.saveBtn, pressed && styles.btnPressed]}
            >
              <Text style={styles.saveText}>Save with AI</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}