# VoiceCraft — AI Text-to-Speech Studio

> Powered by **Xiaomi MiMo TTS API**

A sleek, dark-themed AI text-to-speech studio built with Next.js 14. Transform any text into natural, expressive speech with full control over voice, emotion, speed, and style — or design an entirely custom voice using natural language.

---

## ✨ Features

- **8 Preset Voices** — Choose from Chloe, Ethan, Aria, Marcus, Lily, James, Sophia, and Alex
- **Voice Preview** — Preview each voice before selecting
- **Style Controls** — Set emotion (Happy, Calm, Serious, Excited, Sad, Mysterious) and speed
- **Custom Style Prompts** — Fine-tune delivery with free-text instructions
- **Voice Designer** — Describe any voice in natural language and MiMo generates it
- **Custom Audio Player** — Waveform visualization, seek, volume, and download
- **Generation History** — Last 5 generations with replay and reload
- **Responsive Design** — Optimized for desktop, works on mobile

## 🚀 Setup

### 1. Clone the repository
```bash
git clone <repo-url>
cd voicecraft
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API Key
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and set your MiMo API key:
```
MIMO_API_KEY=your_actual_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                        USER (Browser)                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    app/page.tsx  (state owner)               │
│                                                              │
│  Tab 1: Standard TTS          Tab 2: Voice Designer          │
│  ┌────────────────────┐       ┌──────────────────────────┐  │
│  │ TextInput          │       │ VoiceDesigner            │  │
│  │ VoiceSelector      │       │ (natural language desc.) │  │
│  │ StyleControls      │       └──────────────────────────┘  │
│  │ (emotion/speed/    │                                      │
│  │  custom prompt)    │                                      │
│  └────────────────────┘                                      │
│                                                              │
│  GenerateButton ──── onClick triggers POST /api/tts          │
│                                                              │
│  Right column:                                               │
│  ┌────────────────────┐                                      │
│  │ AudioPlayer        │  ◄── receives base64 audio           │
│  │ WaveformVisualizer │                                      │
│  │ HistoryPanel       │  ◄── last 5 generations              │
│  └────────────────────┘                                      │
└─────────────────────┬───────────────────────────────────────┘
                      │ fetch POST /api/tts
                      │ { text, voice|voiceDesign, style, format }
                      ▼
┌─────────────────────────────────────────────────────────────┐
│               app/api/tts/route.ts  (server)                 │
│                                                              │
│  1. Validate input (text required, max 5000 chars)           │
│  2. Read MIMO_API_KEY from env                               │
│  3. Call generateSpeech() from lib/mimo-tts.ts               │
│  4. Return { audio: base64, format: "wav"|"mp3" }            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  lib/mimo-tts.ts                              │
│                                                              │
│  Mode A — Preset Voice:                                      │
│  { voice: "chloe", style prompt injected as text }           │
│                                                              │
│  Mode B — Voice Designer:                                    │
│  { no voice field, full natural-language style prompt }      │
│                                                              │
│  → POST https://api.xiaomimimo.com/v1/chat/completions       │
│    model: mimo-v2.5-tts  (OpenAI-compatible interface)       │
└─────────────────────┬───────────────────────────────────────┘
                      │ binary audio data
                      ▼
              encode to base64
                      │
                      └──────────────────► AudioPlayer plays it
                                           HistoryPanel stores it
```

---

## 🎙️ MiMo TTS API

VoiceCraft uses the **Xiaomi MiMo TTS API** (`mimo-v2.5-tts` model), which is OpenAI-compatible.

- **Standard TTS**: Select a preset voice + style instructions → speech
- **Voice Design Mode**: Describe a voice in natural language → MiMo creates it
- Supports `wav` and `mp3` output formats
- API key is kept server-side via Next.js API routes

## 🛠️ Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + Custom CSS design system
- **HTML5 Audio API** + Canvas for waveform visualization
- **Outfit** (Google Fonts) for typography

## 📄 License

MIT
