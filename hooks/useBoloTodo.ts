import { scheduleTodoAlarm } from '@/lib/alarm/scheduler';
import { useAudioRecordingPipeline } from '@/lib/audio/recorder';
import { transcribeAudioFile } from '@/lib/whisper/transcribe';
import { useRootStore } from '@/store/RootStore';
import { useCallback, useState } from 'react';
import { useParseTodoMutation } from './useParseTodo';

export function useBoloTodo() {
  const rootStore = useRootStore();
  const { todosStore, uiStore } = rootStore;
  const {
    startRecording,
    stopRecording,
    isRecording,
    getAvailableInputs,
    setAudioInput,
  } = useAudioRecordingPipeline();
  const parseMutation = useParseTodoMutation();

  const [recordedUri, setRecordedUri] = useState<string | null>(null);

  const startVoice = useCallback(async () => {
    try {
      uiStore.setError(null);
      await startRecording();
      uiStore.setRecording(true);
    } catch (err: any) {
      uiStore.setError(err?.message || 'Failed to start recording');
    }
  }, [startRecording, uiStore]);

  const stopVoice = useCallback(async (): Promise<string | null> => {
    try {
      const uri = await stopRecording();
      uiStore.setRecording(false);
      setRecordedUri(uri);
      return uri;
    } catch (err: any) {
      uiStore.setError(err?.message || 'Failed to stop recording');
      uiStore.setRecording(false);
      return null;
    }
  }, [stopRecording, uiStore]);

  const processAndSaveVoice = useCallback(
    async (audioUri: string, manualTitle?: string) => {
      try {
        uiStore.setError(null);
        uiStore.setTranscribing(true);

        // 1. Transcribe audio using offline Whisper
        let romanUrduText = '';
        try {
          romanUrduText = await transcribeAudioFile(audioUri);
        } catch (transcribeErr: any) {
          console.warn('Whisper transcription error/fallback:', transcribeErr);
          romanUrduText = manualTitle || 'Voice Note';
        } finally {
          uiStore.setTranscribing(false);
        }

        const effectiveText = romanUrduText || manualTitle || 'Voice Note';
        const todoId = String(Date.now());
        uiStore.setParsing(true);

        try {
          // 2. Parse using AI
          const parsed = await parseMutation.mutateAsync(effectiveText);
          const finalTitle = manualTitle || parsed.title;

          await todosStore.addTodo({
            id: todoId,
            title: finalTitle,
            urduTitle: parsed.urduTitle || effectiveText,
            dueDate: parsed.dueDate,
            category: parsed.category,
            hasAlarm: parsed.hasAlarm,
            needsParsing: false,
          });

          if (parsed.hasAlarm && parsed.dueDate) {
            await scheduleTodoAlarm({
              id: todoId,
              title: `BoloTodo: ${finalTitle}`,
              body: parsed.urduTitle || effectiveText,
              date: new Date(parsed.dueDate),
              setAndroidNativeClock: true,
            });
          }
        } catch (aiErr) {
          console.warn('Cloud AI failed/offline. Saving raw record:', aiErr);
          const fallbackTitle = manualTitle || effectiveText;
          await todosStore.addTodo({
            id: todoId,
            title: fallbackTitle,
            urduTitle: effectiveText,
            dueDate: null,
            category: 'general',
            hasAlarm: false,
            needsParsing: true,
          });
        } finally {
          uiStore.setParsing(false);
        }
        return true;
      } catch (err: any) {
        uiStore.setError(err?.message || 'Error processing voice reminder');
        uiStore.setTranscribing(false);
        uiStore.setParsing(false);
        return false;
      }
    },
    [uiStore, parseMutation, todosStore]
  );

  return {
    isRecording,
    recordedUri,
    isTranscribing: uiStore.isTranscribing,
    isParsing: uiStore.isParsing,
    errorMessage: uiStore.errorMessage,
    startVoice,
    stopVoice,
    processAndSaveVoice,
    getAvailableInputs,
    setAudioInput,
  };
}