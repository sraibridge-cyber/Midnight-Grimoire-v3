/**
 * export.js — Markdown/HTML/JSON/TXT Export
 * Midnight Grimoire v3 · Harmony Labs
 */

(function() {
  'use strict';

  function downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  window.exportFmt = function(fmt) {
    const content = document.getElementById('story-output')?.innerText || '';
    const title = document.getElementById('storyTitle')?.value || 'midnight-grimoire';
    const meta = {
      genre: window.selectedGenre,
      tone: window.selectedTone,
      chapterNum: document.getElementById('chapterNum')?.value || 1,
    };
    if (fmt === 'md') exportMarkdown(content, title);
    else if (fmt === 'html') exportHTML(content, title);
    else if (fmt === 'json') exportJSON(content, title, meta);
    else if (fmt === 'txt') downloadFile(content, `${title}.txt`, 'text/plain');
  };

  function exportMarkdown(content, title) {
    const slug = (title || 'midnight-grimoire').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `${slug}-ch${Date.now()}.md`;
    downloadFile(content, filename, 'text/markdown;charset=utf-8');
  }

  function exportHTML(content, title) {
    const slug = (title || 'midnight-grimoire').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `${slug}-ch${Date.now()}.html`;
    const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title || 'Midnight Grimoire'}</title>
<style>
body{background:#0a0a0f;color:#e2e8f0;font-family:Georgia,serif;max-width:720px;margin:0 auto;padding:40px 20px;line-height:1.8}
h1,h2{color:#d4af37}
hr{border:none;border-top:1px solid #2a2a4a;margin:24px 0}
.mu{color:#22c55e;font-family:monospace}
</style></head><body>
${content.replace(/\n/g, '<br>').replace(/^# (.+)$/gm, '<h1>$1</h1>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}
</body></html>`;
    downloadFile(html, filename, 'text/html;charset=utf-8');
  }

  function exportJSON(content, title, meta) {
    const slug = (title || 'midnight-grimoire').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `${slug}-ch${Date.now()}.json`;
    const data = {
      title,
      content,
      genre: meta?.genre || 'Sci-Fi',
      tone: meta?.tone || 'Mysterious',
      chapterNum: meta?.chapterNum || 1,
      wordCount: content.split(/\s+/).length,
      mu: meta?.mu || 0,
      sealed: new Date().toISOString(),
    };
    downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
  }

  function copyText(text) {
    navigator.clipboard?.writeText(text).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });
  }

  function exportAllData() {
    const data = {
      exported: new Date().toISOString(),
      chapters: JSON.parse(localStorage.getItem('mg_chapters') || '[]'),
      characters: JSON.parse(localStorage.getItem('mg_chars') || '[]'),
    };
    const filename = `midnight-grimoire-backup-${Date.now()}.json`;
    downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
  }

  function clearAllData() {
    if (!confirm('Delete ALL archived chapters and characters? This cannot be undone.')) return;
    localStorage.removeItem('mg_chapters');
    localStorage.removeItem('mg_chars');
    updateContStatus();
  }

  window.exportFmt = exportFmt;
  window.copyText = copyText;
  window.exportAllData = exportAllData;
  window.clearAllData = clearAllData;

})();