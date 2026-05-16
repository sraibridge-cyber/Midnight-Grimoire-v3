#!/usr/bin/env python3
"""
static_analyzer.py — Multi-language Static Pattern Detection
Harmony Labs · Midnight Grimoire v3

Analyzes source code patterns across 7+ languages.
Returns pattern matches ranked by FRC μ score.
"""

import re
from typing import Optional


LANGUAGE_SIGNATURES = {
    "Python": {
        "keywords": [r"\bdef\b", r"\bclass\b", r"\bimport\b", r"\bif\b", r"\bfor\b", r"\breturn\b", r"\bwith\b"],
        "patterns": {
            "function_def": r"def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(",
            "class_def": r"class\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*[:\(]",
            "import_statement": r"(?:from\s+\S+\s+)?import\s+\S+",
            "async_function": r"async\s+def",
            "decorator": r"@\w+",
        },
    },
    "JavaScript": {
        "keywords": [r"\bfunction\b", r"\bclass\b", r"\bconst\b", r"\bvar\b", r"\blet\b", r"\breturn\b", r"\basync\b", r"\bawait\b"],
        "patterns": {
            "function_decl": r"(?:async\s+)?function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(",
            "arrow_function": r"(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?\(",
            "class_decl": r"class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)",
            "template_literal": r"`[^`]*\{[^}]+\}[^`]*`",
            "destructuring": r"\{[^}]*\]\s*=\s*[^;]+",
        },
    },
    "TypeScript": {
        "keywords": [r"\binterface\b", r"\btype\b", r"\bnamespace\b", r"\bas\b", r"\bimplements\b", r"\breadonly\b"],
        "patterns": {
            "interface_def": r"interface\s+([a-zA-Z_][a-zA-Z0-9_]*)",
            "type_alias": r"type\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=",
            "generic_type": r"<[a-zA-Z_][a-zA-Z0-9_,\s|]*>",
            "enum_def": r"enum\s+([a-zA-Z_][a-zA-Z0-9_]*)",
        },
    },
    "C": {
        "keywords": [r"\bint\b", r"\bchar\b", r"\bvoid\b", r"\breturn\b", r"\bstruct\b", r"\bif\b", r"\bfor\b"],
        "patterns": {
            "function_def": r"(?:void|int|char|float|double)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(",
            "include": r"#include\s*[<\"][^>\"]+[>\"]",
            "struct_def": r"struct\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\{",
            "typedef": r"typedef\s+(?:struct\s+)?(?:[a-zA-Z_][a-zA-Z0-9_]*\s+)?\*?\s*([a-zA-Z_][a-zA-Z0-9_]*)",
        },
    },
    "Rust": {
        "keywords": [r"\bfn\b", r"\bpub\b", r"\bimpl\b", r"\bstruct\b", r"\benum\b", r"\blet\b", r"\bmatch\b", r"\breturn\b"],
        "patterns": {
            "fn_def": r"fn\s+([a-zA-Z_][a-zA-Z0-9_]*)",
            "struct_def": r"struct\s+([a-zA-Z_][a-zA-Z0-9_]*)",
            "impl_block": r"impl\s+(?:[a-zA-Z_][a-zA-Z0-9_]*)",
            "trait_def": r"trait\s+([a-zA-Z_][a-zA-Z0-9_]*)",
        },
    },
    "HTML": {
        "keywords": [r"<html", r"<head", r"<body", r"<div", r"<span", r"<script", r"<style"],
        "patterns": {
            "tag_open": r"<([a-zA-Z][a-zA-Z0-9]*)\b",
            "attribute": r"\s([a-zA-Z-]+)=",
            "self_closing": r"<([a-zA-Z][a-zA-Z0-9]*)[^>]*/>",
        },
    },
    "CSS": {
        "keywords": [r"\{", r"\}", r":", r";", r"@media", r"@keyframes", r"@import"],
        "patterns": {
            "selector": r"([#.][a-zA-Z_-][a-zA-Z0-9_-]*)\s*\{",
            "property": r"\s*([a-zA-Z-]+)\s*:",
            "at_rule": r"@([a-zA-Z-]+)",
            "variable": r"--([a-zA-Z-][a-zA-Z0-9-]*)",
        },
    },
}


def detect_language(code: str) -> Optional[str]:
    """Detect primary language of code snippet."""
    scores = {}
    for lang, sig in LANGUAGE_SIGNATURES.items():
        score = 0
        for kw in sig.get("keywords", []):
            if re.search(kw, code):
                score += 1
        for pat in sig.get("patterns", {}).values():
            if re.search(pat, code):
                score += 2
        scores[lang] = score
    if not scores or max(scores.values()) == 0:
        return None
    return max(scores, key=scores.get)


def analyze(code: str) -> dict:
    """
    Perform static analysis on code snippet.
    Returns dict with language, patterns found, complexity metrics.
    """
    lang = detect_language(code)
    if not lang:
        return {"language": "unknown", "patterns": [], "metrics": {}}

    sig = LANGUAGE_SIGNATURES[lang]
    patterns_found = []

    for name, pat in sig.get("patterns", {}).items():
        matches = re.findall(pat, code)
        if matches:
            patterns_found.append({
                "pattern": name,
                "count": len(matches),
                "examples": list(matches[:3]),
            })

    # Complexity metrics
    lines = [l for l in code.split('\n') if l.strip() and not l.strip().startswith('//')]
    char_count = len(code)
    avg_line_len = char_count / max(len(lines), 1)

    complexity = "low"
    if char_count > 5000 or avg_line_len > 120:
        complexity = "high"
    elif char_count > 1000:
        complexity = "medium"

    return {
        "language": lang,
        "patterns": patterns_found,
        "metrics": {
            "total_chars": char_count,
            "total_lines": len(lines),
            "avg_line_length": round(avg_line_len, 1),
            "complexity": complexity,
        },
    }


def score_analyzer(code: str) -> float:
    """
    Score analyzer quality.
    Returns μ-style score [0.0, 1.0].
    Higher = more structurally sound.
    """
    lang = detect_language(code)
    if not lang:
        return 0.0

    sig = LANGUAGE_SIGNATURES[lang]
    score = 0.0

    # Language keyword coverage
    kw_matches = sum(1 for kw in sig.get("keywords", []) if re.search(kw, code))
    kw_coverage = kw_matches / len(sig.get("keywords", [1]))
    score += kw_coverage * 0.30

    # Pattern richness
    pattern_matches = sum(1 for p in sig.get("patterns", {}).values() if re.search(p, code))
    pattern_richness = pattern_matches / max(len(sig.get("patterns", {})), 1)
    score += pattern_richness * 0.35

    # Structural health: reasonable line lengths, no absurdly long lines
    lines = code.split('\n')
    long_lines = sum(1 for l in lines if len(l) > 200)
    structural_health = 1.0 - (long_lines / max(len(lines), 1)) * 2
    score += max(structural_health, 0) * 0.20

    # Density: code with actual content vs noise
    non_empty = sum(1 for l in lines if l.strip())
    density = non_empty / max(len(lines), 1)
    score += density * 0.15

    return round(score, 6)


if __name__ == "__main__":
    test_code = """
    def resonance_score(text: str) -> float:
        tokens = tokenize(text)
        if not tokens:
            return 0.0
        unique = len(set(tokens))
        ttr = unique / len(tokens)
        return round(ttr, 6)

    class StoryEngine:
        def __init__(self, genre: str):
            self.genre = genre
            self.mu_threshold = 0.9995

        async def generate(self, prompt: str) -> str:
            result = await self.weave(prompt)
            return result
    """

    result = analyze(test_code)
    print(f"Language: {result['language']}")
    print(f"Patterns: {[p['pattern'] for p in result['patterns']]}")
    print(f"Mu: {score_analyzer(test_code):.4f}")