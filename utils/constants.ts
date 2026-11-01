export const APP_CONFIG = {
  appName: 'BoloTodo',
  version: '1.0.0',
  defaultAudioSampleRate: 16000,
  defaultAudioChannels: 1,
} as const;

export const QUERY_KEYS = {
  todos: ['todos'] as const,
  parseTodo: ['todos', 'parse'] as const,
  whisperModel: ['whisper', 'model'] as const,
} as const;
