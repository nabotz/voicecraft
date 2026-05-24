'use client';

import { useState, useRef } from 'react';
import { PresetVoice } from '@/lib/types';
import { PRESET_VOICES } from '@/lib/presets';
import VoiceCard from './VoiceCard';

interface VoiceSelectorProps {
  selectedVoice: PresetVoice | null;
  onSelectVoice: (voice: PresetVoice) => void;
  isOpen: boolean;
  onClose: () => void;
}

const PREVIEW_TEXT = 'Hello! This is how I sound. I hope you enjoy working with me.';

export default function VoiceSelector({
  selectedVoice,
  onSelectVoice,
  isOpen,
  onClose,
}: VoiceSelectorProps) {
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'male' | 'female' | 'neutral'>('all');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePreview = async (voice: PresetVoice) => {
    if (previewingId === voice.id) {
      audioRef.current?.pause();
      setPreviewingId(null);
      return;
    }

    setPreviewingId(voice.id);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: PREVIEW_TEXT,
          voice: voice.name,
          style: 'natural, conversational',
          format: 'wav',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => setPreviewingId(null);
      }
    } catch {
      setPreviewingId(null);
    }
  };

  const filteredVoices = PRESET_VOICES.filter(
    (v) => filter === 'all' || v.gender === filter
  );

  if (!isOpen) return null;

  return (
    <div className="voice-selector-overlay" onClick={onClose}>
      <div
        className="voice-selector-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Voice Selector"
      >
        <div className="voice-selector-header">
          <div>
            <h2 className="voice-selector-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
              Select Voice
            </h2>
            <p className="voice-selector-subtitle">
              Choose from {PRESET_VOICES.length} preset voices
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="voice-filter-tabs">
          {(['all', 'female', 'male', 'neutral'] as const).map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="voice-grid">
          {filteredVoices.map((voice) => (
            <VoiceCard
              key={voice.id}
              voice={voice}
              isSelected={selectedVoice?.id === voice.id}
              onSelect={(v) => {
                onSelectVoice(v);
                onClose();
              }}
              onPreview={handlePreview}
              isPreviewing={previewingId === voice.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
