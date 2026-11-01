import * as FileSystemLegacy from 'expo-file-system/legacy';
import { whisperManager } from './manager';

export interface TranscribeAudioOptions {
  onProgress?: (progress: number) => void;
  language?: string;
  contextHint?: string;
}

/**
 * Transcribes audio via Groq Whisper Cloud (whisper-large-v3-turbo).
 * Note: Whisper prompt parameter is an optional vocabulary guide, NOT a hardcoded transcript.
 * It is kept generic so any user speech (personal, gym, office, shopping, etc.) is transcribed purely from audio.
 */
async function transcribeWithCloudWhisper(
  audioUri: string,
  options?: TranscribeAudioOptions
): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!apiKey) throw new Error('Groq API Key not found');

  const uploadResult = await FileSystemLegacy.uploadAsync(
    'https://api.groq.com/openai/v1/audio/transcriptions',
    audioUri,
    {
      fieldName: 'file',
      httpMethod: 'POST',
      uploadType: FileSystemLegacy.FileSystemUploadType.MULTIPART,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      parameters: {
        model: 'whisper-large-v3-turbo',
        language: options?.language || 'ur',
        ...(options?.contextHint ? { prompt: options.contextHint } : {}),
      },
    }
  );

  if (uploadResult.status >= 200 && uploadResult.status < 300) {
    const json = JSON.parse(uploadResult.body);
    return json.text?.trim() || '';
  }

  throw new Error(`Groq Whisper error ${uploadResult.status}: ${uploadResult.body}`);
}

/**
 * High-accuracy voice transcription pipeline:
 * 1. Primary: Cloud Whisper Large V3 Turbo for natural Urdu & Roman Urdu speech.
 * 2. Fallback: Local on-device Whisper model when offline.
 */
export async function transcribeAudioFile(
  audioUri: string,
  options?: TranscribeAudioOptions
): Promise<string> {
  // 1. Try cloud Whisper for pure transcription directly from voice
  try {
    const text = await transcribeWithCloudWhisper(audioUri, options);
    if (text && text.length > 0) {
      return text;
    }
  } catch (cloudErr) {
    console.warn('Cloud Whisper STT failed/offline, attempting local fallback:', cloudErr);
  }

  // 2. Fallback to local on-device Whisper model
  try {
    const context = await whisperManager.getContext();
    const { promise } = context.transcribe(audioUri, {
      language: options?.language || 'ur',
      maxThreads: 4,
      onProgress: options?.onProgress,
    });

    const result = await promise;
    const rawText = result.result?.trim() || '';
    return rawText.replace(/\[\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\]/g, '').trim();
  } catch (localErr) {
    console.warn('Local Whisper failed:', localErr);
    throw new Error('Speech transcription failed');
  }
}