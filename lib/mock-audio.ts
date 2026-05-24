/**
 * Generates a dummy WAV audio file as base64 string.
 * Produces a pleasant 2-second chord (root + fifth) so it sounds musical.
 */
export function generateDummyWav(durationSeconds = 2): string {
  const sampleRate = 22050;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = Math.floor(sampleRate * durationSeconds);

  // PCM samples — a layered tone: 220Hz + 330Hz + 440Hz (A minor chord feel)
  const frequencies = [220, 330, 440, 660];
  const amplitudes  = [0.35, 0.25, 0.25, 0.15];

  const pcmData = new Int16Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Envelope: quick attack, slow fade out
    const env = Math.min(1, t * 8) * Math.pow(1 - t / durationSeconds, 0.6);
    let sample = 0;
    for (let f = 0; f < frequencies.length; f++) {
      sample += amplitudes[f] * Math.sin(2 * Math.PI * frequencies[f] * t);
    }
    pcmData[i] = Math.max(-32768, Math.min(32767, Math.round(sample * env * 32767)));
  }

  // Build WAV header
  const dataSize   = numSamples * numChannels * (bitsPerSample / 8);
  const byteRate   = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const buffer     = new ArrayBuffer(44 + dataSize);
  const view       = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);          // subchunk1 size
  view.setUint16(20, 1, true);           // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM data
  const pcmBytes = new Uint8Array(buffer, 44);
  const pcmUint8  = new Uint8Array(pcmData.buffer);
  pcmBytes.set(pcmUint8);

  // Convert to base64
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

/**
 * Simulated delay — makes the demo feel like it's actually processing.
 */
export function simulateLatency(ms = 1200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
