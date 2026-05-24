import { PresetVoice } from './types';

export const PRESET_VOICES: PresetVoice[] = [
  {
    id: 'chloe',
    name: 'Chloe',
    description: 'Warm, friendly female voice with natural cadence',
    gender: 'female',
    tags: ['warm', 'friendly', 'conversational'],
  },
  {
    id: 'ethan',
    name: 'Ethan',
    description: 'Clear, confident male voice, great for narration',
    gender: 'male',
    tags: ['confident', 'clear', 'narration'],
  },
  {
    id: 'aria',
    name: 'Aria',
    description: 'Smooth, professional female voice',
    gender: 'female',
    tags: ['professional', 'smooth', 'broadcast'],
  },
  {
    id: 'marcus',
    name: 'Marcus',
    description: 'Deep, authoritative male voice',
    gender: 'male',
    tags: ['deep', 'authoritative', 'powerful'],
  },
  {
    id: 'lily',
    name: 'Lily',
    description: 'Young, energetic female voice',
    gender: 'female',
    tags: ['energetic', 'young', 'upbeat'],
  },
  {
    id: 'james',
    name: 'James',
    description: 'Refined British male accent',
    gender: 'male',
    accent: 'British',
    tags: ['british', 'refined', 'eloquent'],
  },
  {
    id: 'sophia',
    name: 'Sophia',
    description: 'Calm, soothing female voice for meditation',
    gender: 'female',
    tags: ['calm', 'soothing', 'relaxing'],
  },
  {
    id: 'alex',
    name: 'Alex',
    description: 'Neutral, versatile voice for any content',
    gender: 'neutral',
    tags: ['neutral', 'versatile', 'clear'],
  },
];

export const SAMPLE_TEXTS = [
  {
    label: '✨ Inspirational',
    text: 'The only way to do great work is to love what you do. If you haven\'t found it yet, keep looking. Don\'t settle. As with all matters of the heart, you\'ll know when you find it.',
  },
  {
    label: '📰 News Anchor',
    text: 'Breaking news this evening: scientists have announced a major breakthrough in renewable energy technology that could transform how the world powers its cities within the next decade.',
  },
  {
    label: '📖 Storytelling',
    text: 'Once upon a time, in a land where the mountains kissed the clouds and rivers sang ancient lullabies, there lived a young adventurer who dared to dream beyond the horizon.',
  },
  {
    label: '🎭 Dramatic',
    text: 'We stand at the crossroads of history. Every choice, every action, every word spoken in this moment will echo through the centuries. What we do today shapes the world of tomorrow.',
  },
  {
    label: '😴 ASMR',
    text: 'Close your eyes and take a slow, deep breath. Feel the tension melt away from your shoulders. You are safe. You are calm. Let the gentle rhythm of your breath guide you into peaceful rest.',
  },
];

export const VOICE_DESIGN_EXAMPLES = [
  'A cheerful young woman with a slight British accent and a warm, inviting tone',
  'A deep-voiced movie trailer narrator, powerful and dramatic with rich resonance',
  'A gentle grandmother telling bedtime stories, soft and reassuring',
  'A charismatic podcast host, energetic and engaging with natural pauses',
  'A wise old professor with a measured, thoughtful cadence',
  'A friendly AI assistant, clear and articulate with a modern feel',
];

export const EMOTION_LABELS: Record<string, string> = {
  happy: '😊 Happy',
  calm: '😌 Calm',
  serious: '😐 Serious',
  excited: '🤩 Excited',
  sad: '😢 Sad',
  mysterious: '🔮 Mysterious',
};

export const EMOTION_STYLE_MAP: Record<string, string> = {
  happy: 'cheerful, warm, and uplifting tone with a gentle smile in the voice',
  calm: 'serene, measured, and tranquil delivery with steady pacing',
  serious: 'authoritative, focused, and deliberate tone without unnecessary inflection',
  excited: 'energetic, enthusiastic, and dynamic with expressive highs',
  sad: 'gentle, somber, and reflective tone with slower pacing',
  mysterious: 'hushed, intriguing, and enigmatic with subtle dramatic pauses',
};

export const SPEED_STYLE_MAP: Record<string, string> = {
  slow: 'speak slowly and deliberately, allowing each word to breathe',
  normal: 'speak at a natural, comfortable conversational pace',
  fast: 'speak at a brisk, energetic pace with clear articulation',
};
