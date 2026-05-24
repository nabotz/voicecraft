'use client';

import { PresetVoice } from '@/lib/types';

interface VoiceCardProps {
  voice: PresetVoice;
  isSelected: boolean;
  onSelect: (voice: PresetVoice) => void;
  onPreview: (voice: PresetVoice) => void;
  isPreviewing?: boolean;
}

const GENDER_ICONS: Record<string, string> = {
  female: '♀',
  male: '♂',
  neutral: '◈',
};

const GENDER_COLORS: Record<string, string> = {
  female: '#c084fc',
  male: '#60a5fa',
  neutral: '#34d399',
};

export default function VoiceCard({
  voice,
  isSelected,
  onSelect,
  onPreview,
  isPreviewing,
}: VoiceCardProps) {
  return (
    <div
      className={`voice-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(voice)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(voice)}
      aria-pressed={isSelected}
      aria-label={`Voice: ${voice.name}`}
    >
      {isSelected && <div className="voice-card-glow" />}

      <div className="voice-card-top">
        <div
          className="voice-avatar"
          style={{ borderColor: isSelected ? '#8b5cf6' : 'transparent' }}
        >
          <span
            className="voice-gender-icon"
            style={{ color: GENDER_COLORS[voice.gender] }}
          >
            {GENDER_ICONS[voice.gender]}
          </span>
        </div>
        <button
          className={`preview-btn ${isPreviewing ? 'previewing' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onPreview(voice);
          }}
          aria-label={`Preview ${voice.name} voice`}
          title="Preview voice"
        >
          {isPreviewing ? (
            <span className="preview-waves">
              <span /><span /><span />
            </span>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>
      </div>

      <div className="voice-card-info">
        <div className="voice-name">
          {voice.name}
          {voice.accent && (
            <span className="voice-accent">{voice.accent}</span>
          )}
        </div>
        <p className="voice-description">{voice.description}</p>
        <div className="voice-tags">
          {voice.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="voice-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {isSelected && (
        <div className="voice-selected-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="3" fill="none" />
          </svg>
          Selected
        </div>
      )}
    </div>
  );
}
