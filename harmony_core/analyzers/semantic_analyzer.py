#!/usr/bin/env python3
"""
semantic_analyzer.py — Narrative Coherence Analysis
Harmony Labs · Midnight Grimoire v3

Analyzes narrative text for semantic coherence,
character consistency, and story arc integrity.
"""

import re
from typing import Optional


def extract_characters(text: str) -> list[dict]:
    """
    Extract character mentions from narrative text.
    Returns list of {name, count, first_line, last_line}.
    """
    pattern = r"\b([A-Z][a-z]+)\b"
    matches = re.findall(pattern, text)
    
    character_counts = {}
    lines = text.split('\n')
    for i, line in enumerate(lines):
        found = re.findall(pattern, line)
        for name in found:
            if name.lower() not in ['the', 'and', 'but', 'for', 'when', 'then', 'that', 'this', 'with', 'from']:
                if name not in character_counts:
                    character_counts[name] = {"count": 0, "first_line": i, "last_line": i}
                character_counts[name]["count"] += 1
                character_counts[name]["last_line"] = i
    
    return [
        {"name": name, **data}
        for name, data in character_counts.items()
        if data["count"] >= 2
    ]


def track_entity_consistency(text: str) -> dict:
    """
    Track whether characters are referred to consistently.
    Returns consistency score 0.0 - 1.0.
    """
    chars = extract_characters(text)
    if len(chars) <= 1:
        return {"score": 1.0, "entities": chars}
    
    # Check for same-name variations (e.g., "Kael" vs "kael")
    # A character should always use the same capitalization
    inconsistencies = 0
    for char in chars:
        name = char["name"]
        # Count variations in capitalization
        variations = set(re.findall(rf"\b{name}\b", text, re.IGNORECASE))
        if len(variations) > 1:
            inconsistencies += len(variations) - 1
    
    total_mentions = sum(c["count"] for c in chars)
    inconsistency_ratio = inconsistencies / max(total_mentions, 1)
    score = 1.0 - min(inconsistency_ratio, 1.0)
    
    return {
        "score": round(score, 4),
        "entities": chars,
        "inconsistencies": inconsistencies,
    }


def analyze_plot_coherence(plot_points: list[str], story_text: str) -> dict:
    """
    Check if story text reflects the plot points.
    Very lightweight semantic check — looks for keyword overlap.
    """
    if not plot_points or not story_text:
        return {"score": 0.0, "matches": []}
    
    story_lower = story_text.lower()
    matches = []
    
    for point in plot_points:
        # Extract key words from plot point
        words = [w.strip().lower() for w in point.split() if len(w.strip()) > 3]
        if not words:
            continue
        
        # Check how many key words appear in story
        hit_count = sum(1 for w in words if w in story_lower)
        hit_ratio = hit_count / len(words)
        
        if hit_ratio >= 0.3:
            matches.append({
                "point": point,
                "hit_ratio": round(hit_ratio, 2),
                "hits": hit_count,
                "total": len(words),
            })
    
    score = sum(m["hit_ratio"] for m in matches) / max(len(matches), 1)
    return {
        "score": round(score, 4),
        "matches": matches,
        "coverage": len(matches) / len(plot_points),
    }


def arc_integrity(text: str) -> dict:
    """
    Check story arc: does it have beginning, middle, end?
    Lightweight structural check.
    """
    sentences = re.split(r'[.!?]+\s+', text)
    if len(sentences) < 5:
        return {"score": 0.3, "arc": "fragment", "segments": {}}
    
    # Story should have dialogue, descriptive passages, and some narrative flow
    has_dialogue = bool(re.search(r'[""\'].*?[""\']', text))
    has_paragraphs = text.count('\n\n') >= 2
    
    # Count sentence types: questions, exclamations, statements
    questions = len(re.findall(r'\?$', sentences))
    exclamations = len(re.findall(r'!$', sentences))
    
    arc_score = 0.0
    if has_dialogue: arc_score += 0.25
    if has_paragraphs: arc_score += 0.25
    if questions > 0: arc_score += 0.1
    if exclamations > 0: arc_score += 0.1
    
    # Balanced structure: not too short, not too long
    word_count = len(text.split())
    if 400 <= word_count <= 2500:
        arc_score += 0.3
    elif word_count >= 200:
        arc_score += 0.15
    
    return {
        "score": round(min(arc_score, 1.0), 4),
        "arc": "complete" if arc_score > 0.7 else "incomplete",
        "has_dialogue": has_dialogue,
        "has_paragraphs": has_paragraphs,
        "word_count": word_count,
    }


def mu_score(text: str) -> float:
    """
    Compute semantic coherence μ for narrative.
    """
    entity_consistency = track_entity_consistency(text)
    arc = arc_integrity(text)
    
    entity_mu = entity_consistency["score"]
    arc_mu = arc["score"]
    
    # Weighted: entity consistency matters more
    raw = (entity_mu * 0.55) + (arc_mu * 0.45)
    
    return round(raw, 6)


if __name__ == "__main__":
    test_story = """
    Kael stood at the viewport, watching the Drift unfold before him.
    "The signal is stronger here," Mira said, her voice cutting through the silence.
    Kael nodded. He had followed the signal from the outer reaches,
    through sectors no one remembered, to this place where nothing should exist.
    Mira checked her instruments. "It's not natural. Nothing out here should pulse like this."
    The signal pulsed again, and Kael felt it in his bones — a resonance that went deeper than sound.
    He knew then: the answer was not in the data. It was in the silence between the pulses.
    """

    entities = extract_characters(test_story)
    print("Characters:", [c["name"] for c in entities])

    consistency = track_entity_consistency(test_story)
    print("Entity consistency:", consistency["score"])

    arc = arc_integrity(test_story)
    print("Arc integrity:", arc["score"])

    mu = mu_score(test_story)
    print("Semantic μ:", mu)