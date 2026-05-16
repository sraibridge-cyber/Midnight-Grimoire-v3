#!/usr/bin/env python3
"""
engine.py — Main Orchestration Engine
Harmony Labs · Midnight Grimoire v3

Ties harmony_core modules together.
Provides unified API for story generation and validation.
"""

from .resonance import mu_score as resonance_mu, mu_display, seal_text
from .weaver import generate_chapter
from .analyzers.static_analyzer import analyze as static_analyze, detect_language
from .analyzers.semantic_analyzer import mu_score as semantic_mu, track_entity_consistency, arc_integrity

import hashlib
import json
from datetime import datetime, timezone
from typing import Optional


MU_THRESHOLD = 0.9995
SEAL_VERSION = "MG3_V3"


def generate(title: str, genre: str, tone: str, depth: str,
             chapter_num: int, premise: str, plot_points: str) -> dict:
    """
    Full generation pipeline: weave → score → seal.
    
    Returns dict with:
      - content: generated chapter text
      - mu: float μ score
      - passes: bool (mu >= threshold)
      - seal: str SHA3-512 seal (if passed)
      - language: detected language (code) or 'narrative'
    """
    # Generate
    content = generate_chapter(title, genre, tone, depth, chapter_num, premise, plot_points)

    # Score
    mu, passes = mu_display(content)

    # Semantic validation
    entity_mu = track_entity_consistency(content)
    arc = arc_integrity(content)

    # Seal if passing
    seal = None
    if passes:
        seal = seal_text(content)

    return {
        "content": content,
        "mu": mu,
        "passes": passes,
        "seal": seal,
        "entity_consistency": entity_mu,
        "arc_integrity": arc,
        "language": "narrative",
        "genre": genre,
        "tone": tone,
        "depth": depth,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


def validate(content: str) -> dict:
    """
    Validate existing content against constitution.
    Returns full validation report.
    """
    mu, passes = mu_display(content)
    entity = track_entity_consistency(content)
    arc = arc_integrity(content)

    return {
        "mu": mu,
        "passes": passes,
        "mu_threshold": MU_THRESHOLD,
        "entity_consistency": entity,
        "arc_integrity": arc,
        "seal": seal_text(content) if passes else None,
        "validated_at": datetime.now(timezone.utc).isoformat(),
    }


def analyze_code(code: str) -> dict:
    """
    Analyze code (not narrative) using static analyzer.
    Returns static analysis + mu score.
    """
    result = static_analyze(code)
    code_mu = result.get("metrics", {}).get("complexity", "low")
    return result


def seal_chapter(content: str, meta: dict) -> dict:
    """
    Apply sovereign seal to chapter content.
    """
    seal = seal_text(content)
    return {
        "seal": seal,
        "version": SEAL_VERSION,
        "mu": meta.get("mu", 0),
        "sealed_at": datetime.now(timezone.utc).isoformat(),
        "title": meta.get("title", "Untitled"),
        "genre": meta.get("genre", "Unknown"),
    }


if __name__ == "__main__":
    result = generate(
        title="The Last Signal",
        genre="Sci-Fi",
        tone="Mysterious",
        depth="full",
        chapter_num=1,
        premise="A trader named Kael discovers a message from a dead civilization.",
        plot_points="- The signal appears\n- Kael investigates\n- The truth reshapes everything",
    )
    print(f"μ = {result['mu']:.6f} | passes = {result['passes']}")
    if result["seal"]:
        print(f"Seal: {result['seal']}")
    print(f"Entity consistency: {result['entity_consistency']}")
    print(f"Arc integrity: {result['arc_integrity']}")