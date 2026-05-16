/**
 * app.js — Tab Navigation, Status Bar, Axiom Init
 * Midnight Grimoire v3 · Harmony Labs
 */

(function() {
  'use strict';

  // ─── Star Field ───────────────────────────────────────────────
  function buildStars() {
    const sf = document.getElementById('stars');
    if (!sf) return;
    const count = Math.floor(window.innerWidth * window.innerHeight / 8000);
    for (let i = 0; i < count; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const z = Math.random() * 2 + 0.4;
      s.style.cssText = [
        `left:${Math.random()*100}%`,
        `top:${Math.random()*100}%`,
        `width:${z}px`,
        `height:${z}px`,
        `--d:${(Math.random()*4+2).toFixed(1)}s`,
        `--dl:${(Math.random()*5).toFixed(1)}s`,
        `--lo:${(Math.random()*0.15+0.05).toFixed(2)}`,
        `--hi:${(Math.random()*0.5+0.4).toFixed(2)}`,
      ].join(';');
      sf.appendChild(s);
    }
  }

  // ─── Tab Navigation ────────────────────────────────────────────
  window.switchTab = function(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const btn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
    const panel = document.getElementById(`tab-${tab}`);
    if (btn) btn.classList.add('active');
    if (panel) panel.classList.add('active');
  };

  // ─── Axiom Init ────────────────────────────────────────────────
  const AXIOMS = [
    "Axiom of Resonance — Every story must vibrate with emotional truth",
    "Axiom of Consistency — Characters, numbers, and facts must hold across infinite context",
    "Axiom of Dignity — No narrative shall diminish the worth of any being",
    "Axiom of Sovereignty — The creator owns their story completely",
    "Axiom of Transparency — The Grimoire reveals its methods when asked",
    "Axiom of Growth — Every tale teaches, every ending opens a door",
    "Axiom of Harmony — Conflict serves resolution, not destruction",
    "Axiom of Eternity — Stories are sealed for permanent preservation",
  ];
  const axiomList = document.getElementById('axiomList');
  if (axiomList) {
    axiomList.innerHTML = AXIOMS.map((a, i) =>
      `<li><span class="anum">${i + 1}.</span>${a}</li>`
    ).join('');
  }

  // ─── Conjure Button State ─────────────────────────────────────
  function updateConjureBtn() {
    const btn = document.getElementById('conjureBtn');
    const title = document.getElementById('storyTitle')?.value.trim() || '';
    const premise = document.getElementById('storyPremise')?.value.trim() || '';
    const plots = document.getElementById('plotPoints')?.value.trim() || '';
    if (btn) {
      btn.disabled = !(title && premise && plots && window.selectedGenre && window.selectedTone);
    }
  }

  ['storyTitle', 'storyPremise', 'plotPoints'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateConjureBtn);
  });

  window.addEventListener('DOMContentLoaded', buildStars);

})();