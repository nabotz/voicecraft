import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech } from '@/lib/mimo-tts';
import { generateDummyWav, simulateLatency } from '@/lib/mock-audio';
import { TTSRequest } from '@/lib/types';

const IS_DEMO =
  !process.env.MIMO_API_KEY || process.env.MIMO_API_KEY === 'demo';

export async function POST(request: NextRequest) {
  try {
    const body: TTSRequest = await request.json();

    if (!body.text || body.text.trim() === '') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (body.text.length > 5000) {
      return NextResponse.json(
        { error: 'Text too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    // ── DEMO MODE: return synthesized dummy audio ──────────────
    if (IS_DEMO) {
      // Scale duration with text length for a more realistic feel
      const words = body.text.trim().split(/\s+/).length;
      const durationSec = Math.min(8, Math.max(1.5, words * 0.35));

      await simulateLatency(900 + Math.random() * 600);

      const audioBase64 = generateDummyWav(durationSec);
      return NextResponse.json({
        audio: audioBase64,
        format: 'wav',
        demo: true,
      });
    }

    // ── REAL MODE ──────────────────────────────────────────────
    const result = await generateSpeech(body, process.env.MIMO_API_KEY!);
    return NextResponse.json(result);
  } catch (error) {
    console.error('TTS API error:', error);
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
