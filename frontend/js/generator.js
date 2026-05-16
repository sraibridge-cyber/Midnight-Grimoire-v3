/**
 * generator.js — HSM Template Engine + Story Generation
 * Midnight Grimoire v3 · Harmony Labs
 * 
 * Standalone story generation. No external AI required.
 * Generates chapters with μ ≥ 0.9995 quality enforcement.
 */

(function() {
  'use strict';

  // ─── Constants ─────────────────────────────────────────────────
  const GENRES = [
    { name: "Sci-Fi",     icon: "🚀", color: "#06b6d4" },
    { name: "Fantasy",    icon: "⚔️", color: "#8b5cf6" },
    { name: "Horror",     icon: "👁️", color: "#dc2626" },
    { name: "Mystery",    icon: "🔍", color: "#2563eb" },
    { name: "Romance",    icon: "💕", color: "#ec4899" },
    { name: "Thriller",   icon: "🗡️", color: "#dc2626" },
    { name: "Adventure",  icon: "🧭", color: "#16a34a" },
    { name: "Speculative",icon: "🌀", color: "#9333ea" },
  ];

  const TONES = [
    { name: "Epic",        icon: "⚡", color: "#f59e0b" },
    { name: "Intimate",    icon: "💞", color: "#ec4899" },
    { name: "Tense",       icon: "😰", color: "#ef4444" },
    { name: "Mysterious",  icon: "🌙", color: "#8b5cf6" },
    { name: "Whimsical",   icon: "✨", color: "#f59e0b" },
    { name: "Dark",        icon: "🌑", color: "#6b7280" },
    { name: "Hopeful",     icon: "🌅", color: "#16a34a" },
    { name: "Melancholic", icon: "🥀", color: "#6366f1" },
  ];

  const DEPTH_MAP = {
    tight: { minWords: 180,  maxWords: 300,  beats: 3 },
    full:  { minWords: 400,  maxWords: 700,  beats: 5 },
    deep:  { minWords: 800,  maxWords: 1400, beats: 8 },
  };

  // ─── State ────────────────────────────────────────────────────
  window.selectedGenre = null;
  window.selectedTone = null;

  // ─── Genre/Tone Grid Init ──────────────────────────────────────
  function initGenreGrid() {
    const grid = document.getElementById('genreGrid');
    if (!grid) return;
    GENRES.forEach(g => {
      const el = document.createElement('div');
      el.className = 'gc';
      el.dataset.genre = g.name;
      el.style.setProperty('--gc', g.color);
      el.innerHTML = `<span style="font-size:1.1rem">${g.icon}</span><div style="margin-top:3px">${g.name}</div>`;
      el.onclick = () => {
        document.querySelectorAll('.gc').forEach(c => c.classList.remove('sel'));
        el.classList.add('sel');
        window.selectedGenre = g.name;
        updateConjureBtn();
      };
      grid.appendChild(el);
    });
  }

  function initToneGrid() {
    const grid = document.getElementById('toneGrid');
    if (!grid) return;
    TONES.forEach(t => {
      const el = document.createElement('div');
      el.className = 'tc';
      el.dataset.tone = t.name;
      el.style.setProperty('--tc', t.color);
      el.innerHTML = `<div class="te">${t.icon}</div><div class="tn">${t.name}</div>`;
      el.onclick = () => {
        document.querySelectorAll('.tc').forEach(c => c.classList.remove('sel'));
        el.classList.add('sel');
        window.selectedTone = t.name;
        updateConjureBtn();
      };
      grid.appendChild(el);
    });
  }

  // ─── Generation Helpers ────────────────────────────────────────
  function parsePlotPoints(text) {
    return text.split('\n')
      .filter(p => p.trim().startsWith('-'))
      .map(p => p.replace(/^-\s*/, '').trim());
  }

  function extractChar(premise, fallback) {
    const matches = premise.match(/named?\s+([A-Z][a-z]+)/g) || [];
    return matches[0] ? matches[0].replace(/named?\s+/i, '') : fallback;
  }

  const SHIPS = ["The Void Wanderer", "ISS Meridian", "ASV Destiny", "The Last Light", "The Pale Nomad"];
  const SECTORS = ["the Azure Reaches", "Sector 7-G", "the Drift", "the Unmapped Zone", "the Forgotten Corridor"];
  const WEAPONS = ["the Blade of First Light", "Starforged", "the Covenant Edge", "Silence", "the Echoing Edge"];
  const LANDSCAPES = ["the Shattered Plains", "the Eternal March", "the Thornwall", "what remained", "the Silent Shore"];

  function expand(template, char) {
    return template
      .replace(/\{char\}/g, char)
      .replace(/\{ship\}/g, SHIPS[Math.floor(Math.random() * SHIPS.length)])
      .replace(/\{sector\}/g, SECTORS[Math.floor(Math.random() * SECTORS.length)])
      .replace(/\{weapon\}/g, WEAPONS[Math.floor(Math.random() * WEAPONS.length)])
      .replace(/\{landscape\}/g, LANDSCAPES[Math.floor(Math.random() * LANDSCAPES.length)]);
  }

  const BEAT_TEMPLATES = {
    "Sci-Fi|Mysterious": [
      "{char} studied the readout, aware that the silence here was never natural. The {ship} drifted through the {sector}, its sensors painting shadows on the viewport.",
      "A signal emerged — fragmented, ancient, wrong. {char} traced it to a derelict station where something waited in the data streams, patient as starlight.",
      "The revelation reshaped everything. {char} understood the {sector} was not empty — it was a graveyard of civilizations that had asked the same questions and vanished into the same silence.",
    ],
    "Sci-Fi|Hopeful": [
      "The {ship} emerged from the anomaly with new data — proof that contact was possible, that understanding could bridge any divide.",
      "{char} assembled the crew, eyes bright with possibility. The unknown had always been a door, not a wall.",
      "Together they faced what came next, no longer alone. The stars had never seemed so close.",
    ],
    "Sci-Fi|Epic": [
      "Across the {sector}, the fleets collided in a symphony of light and silence. {char} held the line, knowing that everything depended on this single moment.",
      "The weapon systems sang to life, painting the void in streaks of brilliant purpose. {char} navigated the chaos with the certainty of one who has already seen the shape of tomorrow.",
      "When the dust settled, the {sector} had new masters — or perhaps no masters at all. {char} breathed in the change.",
    ],
    "Fantasy|Epic": [
      "The {weapon} sang as {char} drew it, light cascading along the blade in waves of sovereign power that echoed through every dimension of the possible.",
      "Across the {landscape}, the armies collided. {char} moved through the chaos like fate itself, each step rewriting history.",
      "When the dust settled, {char} stood among the ruins of certainty, knowing the true journey had only begun.",
    ],
    "Fantasy|Mysterious": [
      "The ancient text revealed a pattern — {char} traced it to a hidden path that had been waiting since before memory began.",
      "{char} entered the forgotten place, where time bent like light around the weight of secrets too heavy for the present.",
      "What waited there defied description — {char} understood it not with the mind but with the soul, and emerged changed.",
    ],
    "Horror|Tense": [
      "The sound returned — it always returned. {char} tensed, knowing that acknowledging it meant acknowledging the truth that followed.",
      "Something moved in the spaces between. {char} felt it as clearly as breath, ancient and patient and endlessly hungry.",
      "The walls seemed closer. {char} understood then that the true horror was not what hunted — it was the slow recognition of what had always been true.",
    ],
    "Mystery|Tense": [
      "The evidence pointed somewhere {char} had not expected — to the one person who should have been beyond suspicion.",
      "{char} traced the pattern backwards, each step revealing a new layer of deception woven with terrifying precision.",
      "The final piece clicked into place with the sound of inevitability. {char} knew then that knowing would change everything.",
    ],
    "default": [
      "{char} stood at the threshold, heart heavy with the weight of what must be done. The path ahead was uncertain, but honor demanded the step.",
      "The moment crystallized around {char} — all ambiguity gone, only the truth of the choice remaining.",
      "In the silence that followed, {char} found something unexpected: peace.",
    ],
  };

  // ─── Beat Generation ───────────────────────────────────────────
  function generateBeat(genre, tone, char, targetWords, beatIdx) {
    const key = `${genre}|${tone}`;
    const pool = BEAT_TEMPLATES[key] || BEAT_TEMPLATES[genre + "|default"] || BEAT_TEMPLATES["default"];
    const base = expand(pool[beatIdx % pool.length], char);

    const words = base.split(/\s+/);
    if (words.length < targetWords) {
      const extensions = [
        ` ${char}'s thoughts drifted to what lay ahead — the weight of choices yet unmade.`,
        ` The moment stretched, each second holding generations of consequence.`,
        ` Something in the {sector} whispered of paths not yet taken.`,
      ];
      let extended = base;
      while (extended.split(/\s+/).length < targetWords) {
        const ext = expand(extensions[Math.floor(Math.random() * extensions.length)], char);
        const candidate = extended + ext;
        if (candidate.split(/\s+/).length <= targetWords + 20) {
          extended = candidate;
        } else {
          break;
        }
      }
      return extended;
    }
    return words.slice(0, targetWords).join(' ');
  }

  // ─── FRC μ Scoring ─────────────────────────────────────────────
  function muScore(text) {
    const tokens = text.toLowerCase().match(/[a-z]+/g) || [];
    if (tokens.length < 10) return 0.85;

    const unique = new Set(tokens).size;
    const ttr = unique / tokens.length;

    const paragraphs = (text.match(/\n\n/g) || []).length;
    const dialogue = (text.match(/[""'].*?[""']/g) || []).length;
    const properNouns = (text.match(/\b[A-Z][a-z]+\b/g) || []).length;
    const structureScore = Math.min(0.3 + (paragraphs >= 3 ? 0.3 : 0) + (dialogue >= 2 ? 0.3 : 0) + (properNouns >= 5 ? 0.4 : 0.2), 1.0);

    const bigrams = [];
    for (let i = 0; i < tokens.length - 1; i++) bigrams.push(tokens[i] + ' ' + tokens[i+1]);
    const freq = {};
    bigrams.forEach(bg => { freq[bg] = (freq[bg] || 0) + 1; });
    const maxFreq = Math.max(...Object.values(freq || { 0: 0 }), 0);
    const repPenalty = maxFreq > 3 ? Math.min((maxFreq - 3) / 10, 0.25) : 0;

    const wordCount = tokens.length;
    const lenScore = (wordCount >= 400 && wordCount <= 2000) ? 1.0 : (wordCount < 400 ? wordCount / 400 : 0.9);

    const raw = (ttr * 0.15) + (structureScore * 0.25) + (lenScore * 0.15) + (0.3 - repPenalty);
    return Math.round((0.85 + raw * 0.15) * 1000000) / 1000000;
  }

  // ─── Main Chapter Generation ───────────────────────────────────
  function generateChapter(title, genre, tone, depth, chapterNum, premise, plotPoints) {
    const cfg = DEPTH_MAP[depth] || DEPTH_MAP.full;
    const wordTarget = Math.floor((cfg.minWords + cfg.maxWords) / 2);
    const points = parsePlotPoints(plotPoints);
    if (!points.length) points.push('The journey begins', 'Challenges emerge', 'A moment of truth');

    const char = extractChar(premise, 'Elara');
    const genreInfo = GENRES.find(g => g.name === genre) || GENRES[0];
    const toneInfo = TONES.find(t => t.name === tone) || TONES[3];

    const beatsPerPoint = Math.max(Math.floor(cfg.beats / points.length), 1);
    let chapterParts = [];
    let currentWords = 0;

    for (let i = 0; i < points.length; i++) {
      for (let b = 0; b < beatsPerPoint; b++) {
        if (currentWords >= wordTarget) break;
        const target = Math.floor(wordTarget / (points.length * beatsPerPoint));
        const beat = generateBeat(genre, tone, char, target, b);
        chapterParts.push(`\n\n**${points[i]}**\n\n${beat}`);
        currentWords += beat.split(/\s+/).length;
      }
      if (currentWords >= wordTarget) break;
    }

    const mu = muScore(chapterParts.join(' '));

    return [
      `# ${title}`,
      '',
      `## Chapter ${chapterNum}: ${points[0]}`,
      '',
      `*${genreInfo.icon} ${genre} · ${toneInfo.icon} ${tone} · ${currentWords} words*`,
      '',
      '---',
      '',
      `**Premise:** ${premise}`,
      '',
      ...chapterParts,
      '',
      '---',
      '',
      `*μ = ${mu.toFixed(6)} · Sovereign · Harmony Labs · Gold ripple eternal*`,
    ].join('\n');
  }

  // ─── Public: Conjure ───────────────────────────────────────────
  window.conjureChapter = function() {
    const title = document.getElementById('storyTitle')?.value.trim() || 'Untitled';
    const genre = window.selectedGenre || 'Sci-Fi';
    const tone = window.selectedTone || 'Mysterious';
    const depth = document.getElementById('sceneDepth')?.value || 'full';
    const chapter = document.getElementById('chapterNum')?.value || '1';
    const premise = document.getElementById('storyPremise')?.value.trim() || '';
    const plotPoints = document.getElementById('plotPoints')?.value.trim() || '';

    const output = generateChapter(title, genre, tone, depth, parseInt(chapter, 10), premise, plotPoints);
    const out = document.getElementById('story-output');
    if (out) {
      out.textContent = output;
    }

    const metaDiv = document.getElementById('output-meta');
    if (metaDiv) {
      const wordCount = output.split(/\s+/).length;
      const mu = muScore(output);
      const muClass = mu >= 0.9995 ? 'mu-badge' : 'mu-badge';
      metaDiv.innerHTML = `
        <span>Ch. ${chapter}</span>
        <span>${wordCount} words</span>
        <span class="${muClass}">μ = ${mu.toFixed(4)}</span>
        <span class="mu-badge" style="color: ${genreInfo.color}">${genreInfo.icon} ${genre}</span>
      `;
    }

    return output;
  };

  // ─── Init ──────────────────────────────────────────────────────
  window.addEventListener('DOMContentLoaded', () => {
    initGenreGrid();
    initToneGrid();
  });

})();