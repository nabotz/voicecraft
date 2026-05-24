import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'VoiceCraft — AI Text-to-Speech Studio',
  description:
    'Transform your text into natural, expressive speech with VoiceCraft. Powered by Xiaomi MiMo TTS — choose from preset voices, design custom voices, and control style and emotion.',
  keywords: 'text to speech, AI voice, TTS, voice synthesis, MiMo TTS, VoiceCraft',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
