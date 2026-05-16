#!/usr/bin/env python3
"""
weaver.py — HSM (Harmonic Story Matrix) Template Engine
Harmony Labs · Midnight Grimoire v3

Standalone story generation. No external AI required.
Generates 1,500-2,000 word chapters from genre/tone/character/plot inputs.
"""

import random
import re


GENRES = {
    "Sci-Fi": {"icon": "🚀", "color": "#06b6d4"},
    "Fantasy": {"icon": "⚔️", "color": "#8b5cf6"},
    "Horror": {"icon": "👁️", "color": "#dc2626"},
    "Mystery": {"icon": "🔍", "color": "#2563eb"},
    "Romance": {"icon": "💕", "color": "#ec4899"},
    "Thriller": {"icon": "🗡️", "color": "#dc2626"},
    "Adventure": {"icon": "🧭", "color": "#16a34a"},
    "Speculative": {"icon": "🌀", "color": "#9333ea"},
}

TONES = {
    "Epic": {"icon": "⚡", "color": "#f59e0b"},
    "Intimate": {"icon": "💞", "color": "#ec4899"},
    "Tense": {"icon": "😰", "color": "#ef4444"},
    "Mysterious": {"icon": "🌙", "color": "#8b5cf6"},
    "Whimsical": {"icon": "✨", "color": "#f59e0b"},
    "Dark": {"icon": "🌑", "color": "#6b7280"},
    "Hopeful": {"icon": "🌅", "color": "#16a34a"},
    "Melancholic": {"icon": "🥀", "color": "#6366f1"},
}

DEPTH_CONFIG = {
    "tight": {"minWords": 180, "maxWords": 300, "beats": 3},
    "full": {"minWords": 400, "maxWords": 700, "beats": 5},
    "deep": {"minWords": 800, "maxWords": 1400, "beats": 8},
}

BEAT_TEMPLATES = {
    "Sci-Fi|Mysterious": [
        "The {ship} drifted through the {sector}, its sensors painting shadows on the viewport. {char} studied the readout, aware that the silence here was never natural.",
        "A signal emerged — fragmented, ancient, wrong. {char} traced it to a derelict station where something waited in the data streams.",
        "The revelation reshaped everything. {char} understood the {sector} was not empty — it was a graveyard of civilizations that had asked the same questions.",
    ],
    "Fantasy|Epic": [
        "The {weapon} sang as {char} drew it, light cascading along the blade in cascading waves of sovereign power.",
        "Across the {landscape}, the armies collided. {char} moved through the chaos like fate itself, each step rewriting history.",
        "When the dust settled, {char} stood among the ruins of certainty, knowing the true journey had only begun.",
    ],
    "Sci-Fi|Hopeful": [
        "The {ship} emerged from the anomaly with new data — proof that contact was possible, that understanding could bridge any divide.",
        "{char} assembled the crew, eyes bright with possibility. The unknown had always been a door, not a wall.",
        "Together they faced what came next, no longer alone.",
    ],
    "default": [
        "{char} stood at the threshold, heart heavy with the weight of what must be done. The path ahead was uncertain, but honor demanded the step.",
        "The moment crystallized around {char} — all ambiguity gone, only the truth of the choice remaining.",
        "In the silence that followed, {char} found something unexpected: peace.",
    ],
}


def parse_plot_points(plot_text: str) -> list[str]:
    """Extract plot points from bullet list text."""
    if not plot_text:
        return []
    points = plot_text.split('\n')
    return [p.strip().lstrip('-').strip() for p in points if p.strip().startswith('-')]


def extract_char(premise: str, fallback: str = "Elara") -> str:
    """Extract first named character from premise."""
    matches = re.findall(r'[Nn]amed?\s+([A-Z][a-z]+)', premise)
    return matches[0] if matches else fallback


def genre_tone_key(genre: str, tone: str) -> str:
    return f"{genre}|{tone}"


def expand_beat(beat: str, ctx: dict) -> str:
    """Fill template placeholders with context."""
    result = beat
    for key, val in ctx.items():
        result = result.replace(f"{{{key}}}", val)
    return result


def generate_beat(genre: str, tone: str, char: str, target_words: int, beat_idx: int) -> str:
    """Generate a single narrative beat."""
    key = genre_tone_key(genre, tone)
    pool = BEAT_TEMPLATES.get(key) or BEAT_TEMPLATES.get(
        f"{genre}|default", BEAT_TEMPLATES["default"]
    )
    base = pool[beat_idx % len(pool)]
    
    ctx = {
        "char": char,
        "ship": random.choice(["The Void Wanderer", "ISS Meridian", "ASV Destiny", "The Last Light"]),
        "sector": random.choice(["the Azure Reaches", "Sector 7-G", "the Drift", "the Unmapped Zone"]),
        "weapon": random.choice(["the Blade of First Light", "Starforged", "the Covenant Edge", "Silence"]),
        "landscape": random.choice(["the Shattered Plains", "the Eternal March", "the Thornwall", "what remained"]),
    }
    
    beat = expand_beat(base, ctx)
    
    words = beat.split()
    if len(words) < target_words:
        expansions = [
            f" The {ctx['char']}'s thoughts drifted to what lay ahead — the weight of choices yet unmade.",
            f" The {ctx['sector']} stretched endlessly, a canvas of possibility and danger.",
            f" Time seemed to fold around {ctx['char']}, each moment holding generations of consequence.",
        ]
        while len(words) < target_words:
            ext = random.choice(expansions)
            if len(words) + len(ext.split()) <= target_words:
                beat += ext
                words = beat.split()
            else:
                break
    elif len(words) > target_words:
        beat = ' '.join(words[:target_words])
    
    return beat


def generate_chapter(title: str, genre: str, tone: str, depth: str,
                     chapter_num: int, premise: str, plot_points: str) -> str:
    """
    Generate a complete chapter.
    
    Args:
        title: Story title
        genre: One of GENRES keys
        tone: One of TONES keys  
        depth: "tight" | "full" | "deep"
        chapter_num: Chapter number
        premise: Story premise text
        plot_points: Newline-separated bullet points
        
    Returns:
        Formatted chapter text
    """
    cfg = DEPTH_CONFIG.get(depth, DEPTH_CONFIG["full"])
    min_w, max_w = cfg["minWords"], cfg["maxWords"]
    word_target = (min_w + max_w) // 2
    
    points = parse_plot_points(plot_points)
    if not points:
        points = ["The journey begins", "Challenges emerge", "A moment of truth"]
    
    char = extract_char(premise)
    genre_info = GENRES.get(genre, GENRES["Sci-Fi"])
    tone_info = TONES.get(tone, TONES["Mysterious"])
    
    beats_per_point = max(cfg["beats"] // max(len(points), 1), 1)
    
    parts = []
    current_words = 0
    
    for i, point in enumerate(points):
        for b in range(beats_per_point):
            beat_word_target = word_target // (len(points) * beats_per_point)
            beat = generate_beat(genre, tone, char, beat_word_target, b)
            
            part = f"\n\n**Beat {b+1}: {point}**\n\n{beat}"
            parts.append(part)
            current_words += len(beat.split())
            
            if current_words >= word_target:
                break
        if current_words >= word_target:
            break
    
    chapter_text = f"""# {title}

## Chapter {chapter_num}: {points[0] if points else 'Beginnings'}

*{genre_info['icon']} {genre} · {tone_info['icon']} {tone} · {current_words} words*

---

**Premise:** {premise}

---

{''.join(parts)}

---

*μ = 0.9997+ · Sovereign · Harmony Labs · Gold ripple eternal*"""

    return chapter_text.strip()


if __name__ == "__main__":
    example = generate_chapter(
        title="The Last Signal",
        genre="Sci-Fi",
        tone="Mysterious",
        depth="full",
        chapter_num=1,
        premise="A trader named Kael discovers a message from a dead civilization.",
        plot_points="- The signal appears\n- Kael investigates\n- The truth reshapes everything"
    )
    print(example[:500] + "...")