/**
 * storage.js — localStorage Chapter Archive Management
 * Midnight Grimoire v3 · Harmony Labs
 */

(function() {
  'use strict';

  const CHAPTERS_KEY = 'mg_chapters';
  const CHARS_KEY = 'mg_chars';

  // ─── Chapters ─────────────────────────────────────────────────
  function getChapters() {
    try {
      return JSON.parse(localStorage.getItem(CHAPTERS_KEY) || '[]');
    } catch { return []; }
  }

  function saveChapter(data) {
    const archive = getChapters();
    const entry = {
      id: Date.now(),
      title: data.title || 'Untitled',
      genre: data.genre || 'Sci-Fi',
      tone: data.tone || 'Mysterious',
      chapterNum: data.chapterNum || 1,
      content: data.content || '',
      wordCount: (data.content || '').split(/\s+/).length,
      mu: data.mu || 0,
      sealed: new Date().toISOString(),
    };
    archive.unshift(entry);
    localStorage.setItem(CHAPTERS_KEY, JSON.stringify(archive.slice(0, 100)));
    return entry;
  }

  function deleteChapter(id) {
    const archive = getChapters().filter(c => c.id !== id);
    localStorage.setItem(CHAPTERS_KEY, JSON.stringify(archive));
  }

  function loadChapter(id) {
    const archive = getChapters();
    return archive.find(c => c.id === id) || null;
  }

  function clearChapters() {
    localStorage.removeItem(CHAPTERS_KEY);
  }

  // ─── Characters ───────────────────────────────────────────────
  function getChars() {
    try {
      return JSON.parse(localStorage.getItem(CHARS_KEY) || '[]');
    } catch { return []; }
  }

  function registerChar(name, role, species, desc) {
    const chars = getChars();
    if (chars.find(c => c.name.toLowerCase() === name.toLowerCase())) return null;
    const entry = {
      id: Date.now(),
      name: name.trim(),
      role: role || 'supporting',
      species: species || 'human',
      desc: desc || '',
      icon: ICONS[role] || ICONS.supporting,
    };
    chars.unshift(entry);
    localStorage.setItem(CHARS_KEY, JSON.stringify(chars.slice(0, 50)));
    return entry;
  }

  const ICONS = {
    protagonist: '⚔️',
    mentor: '🏛️',
    ally: '🤝',
    antagonist: '💀',
    supporting: '👤',
    observer: '👁️',
  };

  // ─── Public API ───────────────────────────────────────────────
  window.saveChapter = saveChapter;
  window.getChapters = getChapters;
  window.deleteChapter = deleteChapter;
  window.loadChapter = loadChapter;
  window.clearChapters = clearChapters;
  window.registerChar = registerChar;
  window.getChars = getChars;

  // ─── Update Cont Status ───────────────────────────────────────
  window.updateContStatus = function() {
    const archive = getChapters();
    const el = document.getElementById('contLabel');
    if (el) el.textContent = `${archive.length} chapter${archive.length !== 1 ? 's' : ''} archived`;
  };

})();