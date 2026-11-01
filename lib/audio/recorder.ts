import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  type RecordingOptions,
} from 'expo-audio';
import { useCallback, useState } from 'react';

// Whisper requires 16,000 Hz, 16-bit Mono WAV format
export const WHISPER_RECORDING_OPTIONS: RecordingOptions = {
  extension: '.wav',
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 256000,
  android: {
    extension: '.wav',
    outputFormat: 'default',
    audioEncoder: 'default',
  },
  ios: {
    extension: '.wav',
    outputFormat: 'lpcm',
    audioQuality: 127,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 256000,
  },
};

export function useAudioRecordingPipeline() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);

  const recorder = useAudioRecorder(WHISPER_RECORDING_OPTIONS, (status) => {
    if (status && typeof (status as any).isRecording === 'boolean') {
      setIsRecording((status as any).isRecording);
    }
  });

  const startRecording = useCallback(async () => {
    const perm = await getRecordingPermissionsAsync();
    if (!perm.granted) {
      const req = await requestRecordingPermissionsAsync();
      if (!req.granted) {
        throw new Error('Microphone permission not granted');
      }
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });

    await recorder.prepareToRecordAsync();
    recorder.record();
    setIsRecording(true);
  }, [recorder]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    await recorder.stop();
    setIsRecording(false);
    const uri = recorder.uri;
    setRecordingUri(uri);

    // Switch back to playback mode so recorded audio is loud & clear on speaker
    try {
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
        shouldRouteThroughEarpiece: false,
      });
    } catch (e) {
      console.warn('Failed to reset playback mode:', e);
    }

    return uri;
  }, [recorder]);

  const getAvailableInputs = useCallback(() => {
    try {
      return recorder.getAvailableInputs();
    } catch {
      return [];
    }
  }, [recorder]);

  const setAudioInput = useCallback(
    (uid: string) => {
      try {
        recorder.setInput(uid);
      } catch (err) {
        console.warn('Failed to set audio input device:', err);
      }
    },
    [recorder]
  );

  return {
    isRecording,
    recordingUri,
    startRecording,
    stopRecording,
    getAvailableInputs,
    setAudioInput,
  };
}