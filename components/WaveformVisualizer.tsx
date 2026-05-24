'use client';

import { useEffect, useRef, useState } from 'react';

interface WaveformVisualizerProps {
  audioData: string;
  format: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export default function WaveformVisualizer({
  isPlaying,
  currentTime,
  duration,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const [bars] = useState(() =>
    Array.from({ length: 60 }, () => 0.2 + Math.random() * 0.8)
  );

  const progress = duration > 0 ? currentTime / duration : 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const barCount = bars.length;
      const barWidth = (width - barCount * 2) / barCount;
      const maxBarHeight = height * 0.85;
      const centerY = height / 2;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);
        const barProportion = i / barCount;
        const isPast = barProportion <= progress;

        // Animate height when playing
        let h = bars[i] * maxBarHeight;
        if (isPlaying) {
          const wave = Math.sin((frame * 0.1) + i * 0.4) * 0.15;
          h = Math.max(4, h * (1 + wave));
        }

        // Gradient color
        const gradient = ctx.createLinearGradient(x, centerY - h / 2, x, centerY + h / 2);
        if (isPast) {
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.9)');
          gradient.addColorStop(0.5, 'rgba(6, 182, 212, 1)');
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0.9)');
        } else {
          gradient.addColorStop(0, 'rgba(255,255,255,0.12)');
          gradient.addColorStop(1, 'rgba(255,255,255,0.05)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, centerY - h / 2, barWidth, h, 3);
        ctx.fill();
      }

      frame++;
      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [bars, isPlaying, progress]);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={80}
      className="waveform-canvas"
      aria-label="Audio waveform visualization"
    />
  );
}
