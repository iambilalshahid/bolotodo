import { types } from 'mobx-state-tree';

export const UIStore = types
  .model('UIStore', {
    isRecording: types.optional(types.boolean, false),
    isTranscribing: types.optional(types.boolean, false),
    isParsing: types.optional(types.boolean, false),
    activeAudioUri: types.maybeNull(types.string),
    errorMessage: types.maybeNull(types.string),
    theme: types.optional(
      types.enumeration('ThemeMode', ['light', 'dark', 'system']),
      'system'
    ),
  })
  .actions((self) => ({
    setTheme(mode: 'light' | 'dark' | 'system') {
      self.theme = mode;
    },
    setRecording(val: boolean) {
      self.isRecording = val;
    },
    setTranscribing(val: boolean) {
      self.isTranscribing = val;
    },
    setParsing(val: boolean) {
      self.isParsing = val;
    },
    setActiveAudioUri(uri: string | null) {
      self.activeAudioUri = uri;
    },
    setError(msg: string | null) {
      self.errorMessage = msg;
    },
  }));