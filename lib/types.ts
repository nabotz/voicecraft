export type AudioFormat = 'wav' | 'mp3';

export type Emotion = 'happy' | 'calm' | 'serious' | 'excited' | 'sad' | 'mysterious';

export type Speed = 'slow' | 'normal' | 'fast';

export interface PresetVoice {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'neutral';
  accent?: string;
  tags: string[];
}

export interface StyleOptions {
  emotion: Emotion;
  speed: Speed;
  customPrompt: string;
}

export interface TTSRequest {
  text: string;
  voice?: string;
  style?: string;
  voiceDesign?: string;
  format?: AudioFormat;
}

export interface TTSResponse {
  audio: string;
  format: string;
}

export interface GenerationEntry {
  id: string;
  text: string;
  voice: string | null;
  voiceDesign: string | null;
  style: string;
  audio: string;
  format: string;
  timestamp: Date;
}

export interface DesignedVoice {
  id: string;
  description: string;
  name: string;
  previewAudio?: string;
}
