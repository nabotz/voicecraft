'use client';

import { Emotion, Speed, StyleOptions } from '@/lib/types';
import { EMOTION_LABELS } from '@/lib/presets';

interface StyleControlsProps {
  style: StyleOptions;
  onChange: (style: StyleOptions) => void;
}

const EMOTIONS: Emotion[] = ['happy', 'calm', 'serious', 'excited', 'sad', 'mysterious'];
const SPEEDS: { value: Speed; label: string; icon: string }[] = [
  { value: 'slow', label: 'Slow', icon: '🐢' },
  { value: 'normal', label: 'Normal', icon: '🎵' },
  { value: 'fast', label: 'Fast', icon: '⚡' },
];

export default function StyleControls({ style, onChange }: StyleControlsProps) {
  return (
    <div className="style-controls">
      <div className="style-section">
        <label className="style-section-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
          Emotion
        </label>
        <div className="emotion-grid">
          {EMOTIONS.map((emotion) => (
            <button
              key={emotion}
              id={`emotion-${emotion}`}
              className={`emotion-btn ${style.emotion === emotion ? 'active' : ''}`}
              onClick={() => onChange({ ...style, emotion })}
              aria-pressed={style.emotion === emotion}
            >
              {EMOTION_LABELS[emotion]}
            </button>
          ))}
        </div>
      </div>

      <div className="style-section">
        <label className="style-section-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Speed
        </label>
        <div className="speed-selector">
          {SPEEDS.map(({ value, label, icon }) => (
            <button
              key={value}
              id={`speed-${value}`}
              className={`speed-btn ${style.speed === value ? 'active' : ''}`}
              onClick={() => onChange({ ...style, speed: value })}
              aria-pressed={style.speed === value}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="style-section">
        <label className="style-section-label" htmlFor="custom-style-input">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Custom Style Prompt
        </label>
        <input
          id="custom-style-input"
          type="text"
          className="custom-style-input"
          value={style.customPrompt}
          onChange={(e) => onChange({ ...style, customPrompt: e.target.value })}
          placeholder="e.g., whispering ASMR-like, with gentle pauses..."
        />
      </div>
    </div>
  );
}
