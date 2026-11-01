import * as FileSystem from 'expo-file-system';
import { initWhisper, WhisperContext } from 'whisper.rn';

export const WHISPER_MODEL_URL =
  'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin';

export const MODEL_FILE_NAME = 'ggml-tiny.bin';

class WhisperManager {
  private static instance: WhisperManager;
  private context: WhisperContext | null = null;
  private isInitializing = false;

  private constructor() { }

  public static getInstance(): WhisperManager {
    if (!WhisperManager.instance) {
      WhisperManager.instance = new WhisperManager();
    }
    return WhisperManager.instance;
  }

  public getModelPath(): string {
    const docPath = FileSystem.Paths.document.uri;
    return `${docPath}/${MODEL_FILE_NAME}`;
  }

  public async isModelDownloaded(): Promise<boolean> {
    const path = this.getModelPath();
    const file = new FileSystem.File(path);
    return file.exists;
  }

  public async downloadModel(onProgress?: (progress: number) => void): Promise<string> {
    const path = this.getModelPath();
    const exists = await this.isModelDownloaded();
    if (exists) return path;

    const downloadTask = new FileSystem.DownloadTask(
      WHISPER_MODEL_URL,
      new FileSystem.File(path),
      {
        onProgress: (event) => {
          if (event.totalBytes > 0 && onProgress) {
            const percent = Math.round((event.bytesWritten / event.totalBytes) * 100);
            onProgress(percent);
          }
        },
      }
    );

    await downloadTask.downloadAsync();
    return path;
  }

  public async getContext(onProgress?: (progress: number) => void): Promise<WhisperContext> {
    if (this.context) return this.context;

    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (this.context) return this.context;
    }

    this.isInitializing = true;
    try {
      const modelPath = await this.downloadModel(onProgress);
      this.context = await initWhisper({
        filePath: modelPath,
        useGpu: true,
      });
      return this.context;
    } finally {
      this.isInitializing = false;
    }
  }

  public async releaseContext(): Promise<void> {
    if (this.context) {
      await this.context.release();
      this.context = null;
    }
  }
}

export const whisperManager = WhisperManager.getInstance();