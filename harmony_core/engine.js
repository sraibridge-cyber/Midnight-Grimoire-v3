/**
 * engine.js — FRC μ Scoring Engine
 * Midnight Grimoire v3 · Harmony Labs
 * Standalone coherence scoring without external deps
 */

export function muScore(text) {
  if (!text || text.length < 20) return 0.998;
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = words.length;
  const sentCount = (text.match(/[.!?]+/g) || []).length;
  const avgWordsPerSentence = wordCount / Math.max(sentCount, 1);
  const sentenceLengthScore = Math.max(0, 1 - Math.abs(avgWordsPerSentence - 15) / 25);
  const uniqueWords = new Set(words.filter(w => w.length > 3)).size;
  const vocabDiversity = uniqueWords / Math.max(wordCount, 1);
  const repeatPenalty = Math.min(vocabDiversity * 0.3, 0.1);
  const paragraphCount = (text.match(/\n\n+/g) || []).length + 1;
  const paragraphScore = Math.min(paragraphCount / Math.max(wordCount / 100, 1), 1);
  const raw = (sentenceLengthScore * 0.4 + vocabDiversity * 0.4 + paragraphScore * 0.2 - repeatPenalty);
  return Math.max(0.998, Math.min(0.9999, raw + 0.998));
}

export function muDisplay(text) {
  const score = muScore(text);
  const pass = score >= 0.9995;
  const pct = Math.min(((score - 0.998) / 0.002) * 100, 100);
  return { score: score.toFixed(4), pct, pass };
}

export function sealText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'mg_' + Math.abs(hash).toString(36).slice(-8);
}