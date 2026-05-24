# Claude Code Prompt — VoiceCraft: AI Text-to-Speech Studio

## Overview

Build a **single-page web app** called **VoiceCraft** that lets users type or paste text, pick a voice, adjust style/emotion, and generate speech audio using the **Xiaomi MiMo TTS API**. The app also features a Voice Designer where users describe a voice in natural language and MiMo generates it.

This is a lightweight, polished tool. No database, no auth. Everything runs client-side except the API calls which go through a Next.js API route to keep the key safe.

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Audio:** Native HTML5 `<audio>` element + Web Audio API for waveform visualization
- **LLM/TTS:** Xiaomi MiMo TTS API (OpenAI-compatible)
- **State:** React hooks only (useState, useRef)

---

## MiMo TTS API Reference

### Standard TTS
```typescript
// POST https://api.xiaomimimo.com/v1/chat/completions
{
  model: "mimo-v2.5-tts",
  messages: [
    { role: "user", content: "Style instruction: warm, friendly, slightly upbeat tone" },
    { role: "assistant", content: "The actual text to speak goes here" }
  ],
  audio: {
    format: "wav",  // or "mp3"
    voice: "Chloe"  // preset voice name
  }
}
// Response contains base64 audio in the message
```

### Voice Design (create voice from description)
```typescript
// POST https://api.xiaomimimo.com/v1/chat/completions
{
  model: "mimo-v2.5-tts",
  messages: [
    { role: "user", content: "Design a voice that sounds like a wise old storyteller with a deep, gravelly warmth" },
    { role: "assistant", content: "Text to speak with the designed voice" }
  ],
  audio: {
    format: "wav"
    // no voice field = voice design mode
  }
}
```

---

## Features

### 1. Text Input
- Large textarea for inputting text to be spoken
- Character counter
- Preset text samples (famous quotes, news anchors, storytelling excerpts) as quick-fill buttons

### 2. Voice Selector
- Grid of preset voice cards with names
- Each card shows a play button for a short preview phrase
- Visual indicator for currently selected voice

### 3. Style Controls
- **Emotion slider or selector:** Happy, Calm, Serious, Excited, Sad, Mysterious
- **Speed:** Slow / Normal / Fast (translates to style instruction)
- **Custom style prompt:** free text field for detailed style instruction (e.g., "whispering, ASMR-like, with gentle pauses")
- These get assembled into the `user` message as style instructions

### 4. Voice Designer Tab
- Textarea: "Describe your ideal voice..."
- Example prompts: "A cheerful young woman with a slight British accent", "A deep-voiced narrator like in movie trailers", "A gentle grandma telling bedtime stories"
- Generate button → calls MiMo with the description, plays the result
- Save designed voice to session for reuse

### 5. Audio Player
- Custom styled audio player (not default browser)
- Play / Pause / Seek / Download buttons
- Simple waveform visualization using canvas or CSS
- Loading animation while generating

### 6. History Panel
- Last 5 generations stored in React state
- Each entry shows: text snippet, voice used, timestamp, play button
- Click to replay any previous generation

---

## API Routes

```
POST /api/tts
Body: {
  text: string,
  voice?: string,        // preset voice name, omit for voice design
  style?: string,        // style instruction
  voiceDesign?: string,  // natural language voice description
  format?: "wav" | "mp3"
}
Response: {
  audio: string,  // base64 encoded audio
  format: string
}
```

The API route assembles the messages array based on whether it's a standard TTS call or a voice design call, sends to MiMo, extracts the base64 audio from the response, and returns it.

---

## UI/UX Requirements

- **Design direction:** Music studio / audio workstation aesthetic. Dark, sleek, with glowing accent elements like a mixing console.
- **Typography:** Use a distinctive sans-serif for headings (e.g., Outfit, Satoshi, or Syne). Monospace for the text input area to give it a "script" feel.
- **Color palette:** Very dark background (#0a0a0f), subtle purple/violet glow accents (#8b5cf6), waveform in cyan (#06b6d4). Cards with subtle glass-morphism.
- **Layout:** Single page, no routing needed. Top: text input + controls. Bottom: audio player + history. Voice selector as a slide-out panel or modal.
- **Micro-interactions:**
  - Pulsing glow on the generate button while processing
  - Waveform animation while audio plays
  - Voice cards have subtle hover glow effect
  - Smooth fade-in for generated audio player
- **Responsive:** Works on mobile but optimized for desktop.

---

## File Structure

```
voicecraft/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       └── tts/
│           └── route.ts
├── components/
│   ├── TextInput.tsx
│   ├── VoiceSelector.tsx
│   ├── VoiceCard.tsx
│   ├── StyleControls.tsx
│   ├── VoiceDesigner.tsx
│   ├── AudioPlayer.tsx
│   ├── WaveformVisualizer.tsx
│   ├── HistoryPanel.tsx
│   └── GenerateButton.tsx
├── lib/
│   ├── mimo-tts.ts
│   ├── types.ts
│   └── presets.ts      // preset voices, sample texts
├── .env.local.example
├── package.json
└── README.md
```

---

## README

- Title: "VoiceCraft — AI Text-to-Speech Studio powered by Xiaomi MiMo TTS"
- Features list
- Setup: clone, `npm install`, set `MIMO_API_KEY` in `.env.local`, `npm run dev`
- MiMo TTS capabilities highlighted
- "Powered by Xiaomi MiMo API"
- License: MIT

---

## Build Order

1. Setup Next.js project
2. Build `lib/mimo-tts.ts` with TTS API call logic
3. Build API route `/api/tts`
4. Build TextInput + GenerateButton (test with hardcoded voice)
5. Build AudioPlayer with download
6. Build VoiceSelector with preset cards
7. Build StyleControls
8. Build VoiceDesigner tab
9. Build HistoryPanel
10. Add WaveformVisualizer
11. Polish UI: animations, glow effects, responsive
12. Write README
