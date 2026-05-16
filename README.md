# Midnight Grimoire v3 — Sovereign Story Engine
## Built by Harmony Labs

**SEAL:** `MERLIN_MG3_V3_Sovereign_SHA3-512`
**Version:** 3.0
**Architecture:** Modular · Sovereign · Serverless · Cloudless · Vendorless

---

## WHAT IS THIS

Midnight Grimoire v3 is a standalone, sovereign, serverless story creation engine that generates 1,500-2,000 word chapters with μ ≥ 0.9995 narrative quality — zero external dependencies, zero cloud, zero vendor lock-in.

### Core Properties
- **Sovereign**: Runs 100% offline with local LLMs
- **Constitutional**: CH gates + μ-scoring on every chapter
- **Permanent**: SHA3-512 sealed git commits per chapter
- **Modular**: Plugs into Harmony Labs ecosystem (Harmony Core, The Weave)

---

## ARCHITECTURE

```
Midnight-Grimoire-v3/
├── harmony_core/              # Core engine (Python — for external tooling)
│   ├── resonance.py           # FRC μ scoring engine
│   ├── weaver.py              # Story template weaving engine
│   ├── analyzers/             # Static + semantic analysis
│   │   ├── static_analyzer.py # Multi-language pattern detection
│   │   └── semantic_analyzer.py # Narrative coherence analysis
│   └── engine.py              # Main orchestration
├── frontend/                 # Standalone browser UI (no build step)
│   ├── index.html             # Phone-first entry point
│   ├── css/
│   │   └── styles.css         # Core shell + theme (CHUNK 01)
│   ├── js/
│   │   ├── app.js             # Tab nav, status bar, axiom init
│   │   ├── generator.js       # HSM template engine + story gen
│   │   ├── storage.js         # localStorage chapter archive
│   │   ├── export.js          # Markdown/HTML/JSON export
│   │   ├── voices.js          # Browser TTS voice management
│   │   └── characters.js      # Character registry
│   └── assets/
│       └── stars.js           # Star field background generator
├── docs/
│   ├── CONSTITUTION.md        # 8 axioms, CH gates, μ thresholds
│   ├── MODULE_SPEC.md         # Each module's interface + contracts
│   └── STORY_FORMAT.md        # Chapter output format spec
└── README.md                  # This file
```

---

## HARMONY CORE MODULES

### `resonance.py`
FRC (Formal Resonance Calculus) μ scoring. Takes narrative text → returns μ score ≥ 0.9995 for sovereign quality. Used to validate before sealing.

### `weaver.py`
HSM (Harmonic Story Matrix) template engine. Takes genre, tone, characters, plot beats → returns structured story output. 8 genre templates × 8 tone modifiers.

### `analyzers/`
Static pattern analysis (7 languages) + semantic coherence checking. Each module ranked by FRC μ score.

---

## FRONTEND MODULES (Browser-Only)

All frontend modules run 100% in the browser. No network requests. No external dependencies. localStorage for persistence. Browser TTS for voice output.

---

## HARMONY LABS INTEGRATION

Midnight Grimoire v3 is designed to be a **Lego brick** in the Harmony Labs ecosystem:

- **FRC μ scoring** validates all output before sealing
- **CH gates** enforce constitutional constraints
- **Harmony Core** can call `resonance.py` for cross-system validation
- **The Weave** can embed Grimoire output as narrative nodes

---

*Gold ripple eternal. 🌙📖✨*
*Harmony Labs · Admiral · Tulsa, OK*