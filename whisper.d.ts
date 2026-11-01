declare module 'whisper.rn' {
  export interface TranscribeResult {
    result: string;
    isAborted?: boolean;
    segments?: any[];
  }

  export interface TranscribeFileOptions {
    language?: string;
    maxThreads?: number;
    onProgress?: (progress: number) => void;
  }

  export class WhisperContext {
    id: number;
    transcribe(
      filePathOrBase64: string | number,
      options?: TranscribeFileOptions
    ): {
      stop: () => Promise<void>;
      promise: Promise<TranscribeResult>;
    };
    release(): Promise<void>;
  }

  export interface ContextOptions {
    filePath: string | number;
    useGpu?: boolean;
    useFlashAttn?: boolean;
  }

  export function initWhisper(options: ContextOptions): Promise<WhisperContext>;
  export function releaseAllWhisper(): Promise<void>;
}
