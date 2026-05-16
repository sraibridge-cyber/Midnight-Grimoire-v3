/**
 * voices.js — Browser TTS Voice Management
 * Midnight Grimoire v3 · Harmony Labs
 */

(function() {
  'use strict';

  window.initBrowserVoices = function() {
    const sel = document.getElementById('browserVoice');
    if (!sel) return;

    const populate = () => {
      const voices = speechSynthesis.getVoices();
      sel.innerHTML = '';
      voices.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = `${v.name} (${v.lang})`;
        sel.appendChild(opt);
      });
    };

    if (speechSynthesis.getVoices().length) {
      populate();
    } else {
      speechSynthesis.onvoiceschanged = populate;
    }
  };

  window.speakText = function(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const sel = document.getElementById('browserVoice');
    if (sel?.value) {
      const match = speechSynthesis.getVoices().find(v => v.name === sel.value);
      if (match) utter.voice = match;
    }
    utter.rate = 0.9;
    utter.pitch = 1.0;
    window.speechSynthesis.speak(utter);
  };

  window.stopSpeech = function() {
    window.speechSynthesis?.cancel();
  };

})();