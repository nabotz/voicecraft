'use client';

import { GenerationEntry } from '@/lib/types';
import { useRef } from 'react';

interface HistoryPanelProps {
  entries: GenerationEntry[];
  onReplay: (entry: GenerationEntry) => void;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export default function HistoryPanel({ entries, onReplay }: HistoryPanelProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = (entry: GenerationEntry) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(`data:audio/${entry.format};base64,${entry.audio}`);
    audioRef.current = audio;
    audio.play();
    onReplay(entry);
  };

  if (entries.length === 0) {
    return (
      <div className="history-panel empty">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <p>Your generation history will appear here</p>
      </div>
    );
  }

  return (
    <div className="history-panel">
      <div className="history-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Recent Generations
        <span className="history-count">{entries.length}</span>
      </div>
      <div className="history-list">
        {entries.map((entry) => (
          <div key={entry.id} className="history-entry">
            <div className="history-entry-info">
              <p className="history-text">
                {entry.text.length > 60
                  ? entry.text.slice(0, 60) + '…'
                  : entry.text}
              </p>
              <div className="history-meta">
                <span className="history-voice">
                  {entry.voiceDesign
                    ? '✨ Designed'
                    : entry.voice || 'Unknown'}
                </span>
                <span className="history-time">{timeAgo(entry.timestamp)}</span>
              </div>
            </div>
            <div className="history-actions">
              <button
                className="history-play-btn"
                onClick={() => handlePlay(entry)}
                aria-label="Replay"
                title="Replay"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
              <button
                className="history-load-btn"
                onClick={() => onReplay(entry)}
                aria-label="Load into editor"
                title="Load into editor"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
