'use client';

import { useState } from 'react';
import { DesignedVoice } from '@/lib/types';
import { VOICE_DESIGN_EXAMPLES } from '@/lib/presets';

interface VoiceDesignerProps {
  onVoiceDesigned: (voice: DesignedVoice, audio: string, format: string) => void;
  savedVoices: DesignedVoice[];
  onSelectDesignedVoice: (voice: DesignedVoice) => void;
  selectedDesignedVoice: DesignedVoice | null;
}

export default function VoiceDesigner({
  onVoiceDesigned,
  savedVoices,
  onSelectDesignedVoice,
  selectedDesignedVoice,
}: VoiceDesignerProps) {
  const [description, setDescription] = useState('');
  const [previewText, setPreviewText] = useState(
    'Hello! This is my unique voice. I was designed just for you.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [voiceName, setVoiceName] = useState('');

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    setError('');

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: previewText,
          voiceDesign: description,
          format: 'wav',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Generation failed');
      }

      const data = await res.json();
      const newVoice: DesignedVoice = {
        id: Date.now().toString(),
        description,
        name: voiceName || `Voice ${savedVoices.length + 1}`,
        previewAudio: data.audio,
      };

      onVoiceDesigned(newVoice, data.audio, data.format);

      // Play preview
      const audio = new Audio(`data:audio/${data.format};base64,${data.audio}`);
      audio.play();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="voice-designer">
      <div className="designer-section">
        <label className="designer-label" htmlFor="voice-description">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Describe Your Ideal Voice
        </label>
        <textarea
          id="voice-description"
          className="designer-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the voice you want... e.g., 'A deep, warm narrator with a subtle Irish lilt'"
          rows={3}
        />
      </div>

      <div className="designer-examples">
        <span className="examples-label">Examples:</span>
        <div className="examples-list">
          {VOICE_DESIGN_EXAMPLES.map((ex) => (
            <button
              key={ex}
              className="example-chip"
              onClick={() => setDescription(ex)}
              title={ex}
            >
              {ex.length > 40 ? ex.slice(0, 40) + '…' : ex}
            </button>
          ))}
        </div>
      </div>

      <div className="designer-row">
        <div className="designer-section flex-1">
          <label className="designer-label" htmlFor="voice-name-input">
            Voice Name (optional)
          </label>
          <input
            id="voice-name-input"
            type="text"
            className="designer-input"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            placeholder="My Custom Voice"
          />
        </div>
        <div className="designer-section flex-1">
          <label className="designer-label" htmlFor="preview-text-input">
            Preview Text
          </label>
          <input
            id="preview-text-input"
            type="text"
            className="designer-input"
            value={previewText}
            onChange={(e) => setPreviewText(e.target.value)}
            placeholder="Text to preview with"
          />
        </div>
      </div>

      {error && (
        <div className="designer-error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <button
        id="design-voice-btn"
        className={`designer-generate-btn ${isGenerating ? 'loading' : ''}`}
        onClick={handleGenerate}
        disabled={isGenerating || !description.trim()}
      >
        {isGenerating ? (
          <>
            <span className="spinner" />
            Designing Voice...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Design & Preview Voice
          </>
        )}
      </button>

      {savedVoices.length > 0 && (
        <div className="saved-voices">
          <h4 className="saved-voices-title">Saved Voices (this session)</h4>
          <div className="saved-voices-list">
            {savedVoices.map((voice) => (
              <button
                key={voice.id}
                className={`saved-voice-chip ${selectedDesignedVoice?.id === voice.id ? 'active' : ''}`}
                onClick={() => onSelectDesignedVoice(voice)}
                title={voice.description}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {voice.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
