'use client';

import { useEffect, useRef, useState } from 'react';
import WaveformVisualizer from './WaveformVisualizer';

interface AudioPlayerProps {
  audio: string;
  format: string;
  label?: string;
  isVisible: boolean;
}

function formatTime(s: number) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({ audio, format, label, isVisible }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const src = `data:audio/${format};base64,${audio}`;

  useEffect(() => {
    const el = new Audio(src);
    audioRef.current = el;

    el.addEventListener('timeupdate', () => setCurrentTime(el.currentTime));
    el.addEventListener('loadedmetadata', () => setDuration(el.duration));
    el.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      el.pause();
      el.src = '';
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
    } else {
      el.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = parseFloat(e.target.value);
    setCurrentTime(el.currentTime);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `voicecraft-${Date.now()}.${format}`;
    link.click();
  };

  const handleRestart = () => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    setCurrentTime(0);
  };

  if (!isVisible) return null;

  return (
    <div className="audio-player" role="region" aria-label="Audio Player">
      <div className="player-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
        {label || 'Generated Audio'}
      </div>

      <WaveformVisualizer
        audioData={audio}
        format={format}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
      />

      <div className="player-timeline">
        <span className="time-label">{formatTime(currentTime)}</span>
        <input
          id="audio-seek"
          type="range"
          className="seek-bar"
          min={0}
          max={duration || 100}
          step={0.01}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek"
        />
        <span className="time-label">{formatTime(duration)}</span>
      </div>

      <div className="player-controls">
        <div className="player-buttons">
          <button
            id="audio-restart-btn"
            className="ctrl-btn"
            onClick={handleRestart}
            aria-label="Restart"
            title="Restart"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.86" />
            </svg>
          </button>

          <button
            id="audio-play-btn"
            className="play-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
          </button>

          <button
            id="audio-download-btn"
            className="ctrl-btn"
            onClick={handleDownload}
            aria-label="Download"
            title="Download audio"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>

        <div className="volume-control">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
          <input
            id="volume-slider"
            type="range"
            className="volume-slider"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
