'use client';

import { useState } from 'react';
import TextInput from '@/components/TextInput';
import VoiceSelector from '@/components/VoiceSelector';
import StyleControls from '@/components/StyleControls';
import VoiceDesigner from '@/components/VoiceDesigner';
import AudioPlayer from '@/components/AudioPlayer';
import HistoryPanel from '@/components/HistoryPanel';
import GenerateButton from '@/components/GenerateButton';
import { PresetVoice, DesignedVoice, GenerationEntry, StyleOptions, Emotion, Speed } from '@/lib/types';
import { EMOTION_STYLE_MAP, SPEED_STYLE_MAP, PRESET_VOICES } from '@/lib/presets';

const MAX_HISTORY = 5;

const DEFAULT_TEXT =
  'The only way to do great work is to love what you do. '
  + 'If you haven\'t found it yet, keep looking. Don\'t settle. '
  + 'As with all matters of the heart, you\'ll know when you find it.';

export default function Home() {
  // Text
  const [text, setText] = useState(DEFAULT_TEXT);

  // Voice — pre-select Chloe as default
  const [selectedVoice, setSelectedVoice] = useState<PresetVoice | null>(
    PRESET_VOICES.find((v) => v.id === 'chloe') ?? null
  );
  const [isVoiceSelectorOpen, setIsVoiceSelectorOpen] = useState(false);

  // Tab: 'standard' | 'designer'
  const [activeTab, setActiveTab] = useState<'standard' | 'designer'>('standard');

  // Style
  const [style, setStyle] = useState<StyleOptions>({
    emotion: 'calm' as Emotion,
    speed: 'normal' as Speed,
    customPrompt: '',
  });

  // Voice designer
  const [savedVoices, setSavedVoices] = useState<DesignedVoice[]>([]);
  const [selectedDesignedVoice, setSelectedDesignedVoice] = useState<DesignedVoice | null>(null);

  // Generated audio
  const [generatedAudio, setGeneratedAudio] = useState<{ audio: string; format: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  // History
  const [history, setHistory] = useState<GenerationEntry[]>([]);

  function buildStyleString() {
    const parts: string[] = [];
    if (EMOTION_STYLE_MAP[style.emotion]) parts.push(EMOTION_STYLE_MAP[style.emotion]);
    if (SPEED_STYLE_MAP[style.speed]) parts.push(SPEED_STYLE_MAP[style.speed]);
    if (style.customPrompt.trim()) parts.push(style.customPrompt.trim());
    return parts.join('; ');
  }

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setError('');

    try {
      const styleStr = buildStyleString();
      const body: Record<string, string> = {
        text,
        style: styleStr,
        format: 'wav',
      };

      if (activeTab === 'designer' && selectedDesignedVoice) {
        body.voiceDesign = selectedDesignedVoice.description;
      } else if (selectedVoice) {
        body.voice = selectedVoice.name;
      }

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Generation failed');
      }

      const data = await res.json();
      if (data.demo) setIsDemo(true);
      setGeneratedAudio({ audio: data.audio, format: data.format });

      // Add to history
      const entry: GenerationEntry = {
        id: Date.now().toString(),
        text,
        voice: selectedVoice?.name || null,
        voiceDesign: activeTab === 'designer' ? selectedDesignedVoice?.description || null : null,
        style: styleStr,
        audio: data.audio,
        format: data.format,
        timestamp: new Date(),
      };
      setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVoiceDesigned = (voice: DesignedVoice, audio: string, format: string) => {
    setSavedVoices((prev) => [voice, ...prev].slice(0, 10));
    setSelectedDesignedVoice(voice);
    setGeneratedAudio({ audio, format });

    const entry: GenerationEntry = {
      id: Date.now().toString(),
      text: 'Voice design preview',
      voice: null,
      voiceDesign: voice.description,
      style: '',
      audio,
      format,
      timestamp: new Date(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
  };

  const handleReplay = (entry: GenerationEntry) => {
    setText(entry.text !== 'Voice design preview' ? entry.text : text);
    setGeneratedAudio({ audio: entry.audio, format: entry.format });
  };

  const canGenerate = text.trim().length > 0 && !isGenerating;

  return (
    <div className="app-container">
      {/* Demo Banner */}
      {isDemo && (
        <div className="demo-banner">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <strong>Demo Mode</strong> — Running with synthesized audio. Set{' '}
          <code>MIMO_API_KEY</code> in <code>.env.local</code> to enable real MiMo TTS.
          <button className="demo-dismiss" onClick={() => setIsDemo(false)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <div>
              <h1 className="logo-title">VoiceCraft</h1>
              <p className="logo-subtitle">AI Text-to-Speech Studio</p>
            </div>
          </div>
          <div className="header-badge">
            <span className="badge-dot" />
            {isDemo ? '🎭 Demo Mode' : 'Powered by Xiaomi MiMo TTS'}
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Left Column */}
        <div className="left-col">
          {/* Tab Navigation */}
          <div className="tab-nav">
            <button
              id="tab-standard"
              className={`tab-btn ${activeTab === 'standard' ? 'active' : ''}`}
              onClick={() => setActiveTab('standard')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              </svg>
              Standard TTS
            </button>
            <button
              id="tab-designer"
              className={`tab-btn ${activeTab === 'designer' ? 'active' : ''}`}
              onClick={() => setActiveTab('designer')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Voice Designer
            </button>
          </div>

          {/* Text Input */}
          <div className="panel">
            <TextInput value={text} onChange={setText} />
          </div>

          {/* Standard Tab Controls */}
          {activeTab === 'standard' && (
            <>
              <div className="panel">
                {/* Voice Selector Button */}
                <div className="voice-select-row">
                  <label className="panel-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                    </svg>
                    Voice
                  </label>
                  <button
                    id="open-voice-selector-btn"
                    className="voice-select-btn"
                    onClick={() => setIsVoiceSelectorOpen(true)}
                  >
                    {selectedVoice ? (
                      <>
                        <span className="selected-voice-name">{selectedVoice.name}</span>
                        <span className="selected-voice-tags">
                          {selectedVoice.tags.slice(0, 2).join(' · ')}
                        </span>
                      </>
                    ) : (
                      <span className="no-voice">Click to select a voice →</span>
                    )}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="panel">
                <label className="panel-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
                  </svg>
                  Style & Emotion
                </label>
                <StyleControls style={style} onChange={setStyle} />
              </div>
            </>
          )}

          {/* Designer Tab */}
          {activeTab === 'designer' && (
            <div className="panel">
              <VoiceDesigner
                onVoiceDesigned={handleVoiceDesigned}
                savedVoices={savedVoices}
                onSelectDesignedVoice={setSelectedDesignedVoice}
                selectedDesignedVoice={selectedDesignedVoice}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="error-bar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Generate Button */}
          <GenerateButton
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={!canGenerate}
          />
        </div>

        {/* Right Column */}
        <div className="right-col">
          {/* Audio Player */}
          <div className={`panel audio-panel ${generatedAudio ? 'has-audio' : ''}`}>
            {generatedAudio ? (
              <AudioPlayer
                key={generatedAudio.audio.slice(0, 20)}
                audio={generatedAudio.audio}
                format={generatedAudio.format}
                label={
                  activeTab === 'designer' && selectedDesignedVoice
                    ? `✨ ${selectedDesignedVoice.name}`
                    : selectedVoice
                    ? `🎙 ${selectedVoice.name}`
                    : 'Generated Audio'
                }
                isVisible={true}
              />
            ) : (
              <div className="audio-placeholder">
                <div className="placeholder-waves">
                  <span /><span /><span /><span /><span />
                </div>
                <p>Your generated audio will appear here</p>
                <span>Enter text and click Generate Speech</span>
              </div>
            )}
          </div>

          {/* History Panel */}
          <div className="panel">
            <HistoryPanel entries={history} onReplay={handleReplay} />
          </div>
        </div>
      </main>

      {/* Voice Selector Modal */}
      <VoiceSelector
        selectedVoice={selectedVoice}
        onSelectVoice={setSelectedVoice}
        isOpen={isVoiceSelectorOpen}
        onClose={() => setIsVoiceSelectorOpen(false)}
      />
    </div>
  );
}
