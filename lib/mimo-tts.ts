import { TTSRequest, TTSResponse } from './types';
import { EMOTION_STYLE_MAP, SPEED_STYLE_MAP } from './presets';

const MIMO_API_URL = 'https://api.xiaomimimo.com/v1/chat/completions';
const MIMO_MODEL = 'mimo-v2.5-tts';

function buildStyleInstruction(
  emotion?: string,
  speed?: string,
  customPrompt?: string
): string {
  const parts: string[] = [];

  if (emotion && EMOTION_STYLE_MAP[emotion]) {
    parts.push(EMOTION_STYLE_MAP[emotion]);
  }
  if (speed && SPEED_STYLE_MAP[speed]) {
    parts.push(SPEED_STYLE_MAP[speed]);
  }
  if (customPrompt?.trim()) {
    parts.push(customPrompt.trim());
  }

  return parts.join('; ');
}

export async function generateSpeech(
  request: TTSRequest,
  apiKey: string
): Promise<TTSResponse> {
  const { text, voice, style, voiceDesign, format = 'wav' } = request;

  let userContent: string;

  if (voiceDesign) {
    // Voice design mode: no voice field, description is the user message
    userContent = voiceDesign;
  } else if (style) {
    userContent = `Style instruction: ${style}`;
  } else {
    userContent = 'Speak naturally and clearly';
  }

  const audioConfig: Record<string, string> = { format };
  if (!voiceDesign && voice) {
    // Map voice id to proper name (capitalize first letter)
    audioConfig.voice = voice.charAt(0).toUpperCase() + voice.slice(1);
  }

  const payload = {
    model: MIMO_MODEL,
    messages: [
      { role: 'user', content: userContent },
      { role: 'assistant', content: text },
    ],
    audio: audioConfig,
  };

  const response = await fetch(MIMO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MiMo API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  // Extract base64 audio from response
  const audioData =
    data?.choices?.[0]?.message?.audio?.data ||
    data?.choices?.[0]?.message?.content;

  if (!audioData) {
    throw new Error('No audio data in response: ' + JSON.stringify(data));
  }

  return {
    audio: audioData,
    format,
  };
}

export { buildStyleInstruction };
