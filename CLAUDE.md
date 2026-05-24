# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Environment

Copy `.env.local.example` to `.env.local` and set:
- `MIMO_API_KEY` — Xiaomi MiMo API key (required for TTS generation)

## Architecture

VoiceCraft is a Next.js App Router app (single page) with a thin backend API.

**Frontend** (`app/page.tsx`) — client component that owns all app state: text input, selected voice, active tab (Standard TTS vs Voice Designer), style options, saved custom voices, and generation history. State is passed down to child components as props.

**API route** (`app/api/tts/route.ts`) — single `POST /api/tts` endpoint. Validates the request, reads `MIMO_API_KEY` server-side, and delegates to `lib/mimo-tts.ts`. Returns `{ audio: string, format: string }` where `audio` is base64-encoded.

**`lib/mimo-tts.ts`** — wraps the Xiaomi MiMo TTS API (`https://api.xiaomimimo.com/v1/chat/completions`, model `mimo-v2.5-tts`). The API uses an OpenAI-compatible chat completions interface. Two modes: preset voice (sends a `voice` field) and voice design (sends only a natural-language style prompt, no `voice` field). Style options (emotion, speed, custom prompt) are injected as text instructions into the prompt.

**`lib/presets.ts`** — static data: 8 preset voices, emotion/speed label maps, voice design examples, sample texts.

**`lib/types.ts`** — all shared TypeScript types (`TTSRequest`, `TTSResponse`, `PresetVoice`, `StyleOptions`, `GenerationEntry`, `DesignedVoice`).

**Styling** — Tailwind CSS 4 (via `@tailwindcss/postcss`) plus custom dark-theme CSS variables in `globals.css`. No separate Tailwind config file; configuration is inline in CSS.

Path alias `@/*` maps to the repo root.
