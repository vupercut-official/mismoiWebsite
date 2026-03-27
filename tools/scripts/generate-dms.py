"""
Generate personalized DM messages for influencer outreach.
Uses Gemini API to extract a personalized detail from each influencer's bio.
"""

import csv
import os
import json
import time
import re
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env")

INPUT_CSV = Path(__file__).resolve().parent.parent / "projects" / "influencer-lists" / "fairfax-food-influencers.csv"
OUTPUT_CSV = Path(__file__).resolve().parent.parent / "projects" / "influencer-lists" / "fairfax-food-influencers-with-dms.csv"

GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"

BATCH_SIZE = 20  # influencers per Gemini call

DM_TEMPLATE = """Hey {name} -- love {detail}

It'd be great to have you come to Banh Mi Ong Beo. It's a vietnamese sandwich shop my wife and I run to share the flavors we grew up with.

It's on the house, don't even want a video, just your honest feedback.

Are you free this week to stop by?"""


def get_first_name(full_name, username):
    """Extract a usable first name from the full name field."""
    if not full_name or full_name.strip() == "":
        return username
    # Remove emojis and special chars for parsing
    cleaned = re.sub(r'[^\w\s|,\-]', '', full_name).strip()
    if not cleaned:
        return username
    # Split on common separators: |, -, comma
    parts = re.split(r'[|,\-]', cleaned)
    first_part = parts[0].strip()
    if not first_part:
        return username
    # Take first word as first name
    words = first_part.split()
    return words[0] if words else username


def bio_fallback(bio, full_name):
    """Generate a personalized detail from bio keywords when Gemini fails."""
    bio_lower = (bio or "").lower()
    name_lower = (full_name or "").lower()
    combined = bio_lower + " " + name_lower

    # Check for specific content signals
    if any(w in combined for w in ["vegan", "plant-based", "plant based"]):
        return "the plant-based journey"
    if any(w in combined for w in ["bbq", "barbecue", "barbeque", "smoker"]):
        return "the BBQ game"
    if any(w in combined for w in ["bake", "baker", "bakery", "pastry", "pastries"]):
        return "the baking content"
    if any(w in combined for w in ["pizza"]):
        return "the pizza content"
    if any(w in combined for w in ["taco", "mexican", "latino", "latina"]):
        return "the Mexican food content"
    if any(w in combined for w in ["sushi", "japanese", "ramen"]):
        return "the Japanese food content"
    if any(w in combined for w in ["korean", "kimchi"]):
        return "the Korean food content"
    if any(w in combined for w in ["thai"]):
        return "the Thai food content"
    if any(w in combined for w in ["indian", "curry", "masala"]):
        return "the Indian food content"
    if any(w in combined for w in ["seafood", "crab", "oyster", "fish"]):
        return "the seafood content"
    if any(w in combined for w in ["cocktail", "wine", "bar", "mixolog"]):
        return "the drinks content"
    if any(w in combined for w in ["brunch"]):
        return "the brunch spots"
    if any(w in combined for w in ["food truck"]):
        return "the food truck hustle"
    if any(w in combined for w in ["chef", "culinary"]):
        return "the culinary work"
    if any(w in combined for w in ["review", "critic"]):
        return "the honest reviews"
    if any(w in combined for w in ["photographer", "photo", "📸"]):
        return "the food photography"
    if any(w in combined for w in ["dmv", "nova", "northern virginia", "virginia"]):
        return "the DMV food finds"
    if any(w in combined for w in ["dc", "washington", "district"]):
        return "the DC food scene coverage"
    if any(w in combined for w in ["maryland", "md "]):
        return "the Maryland food finds"
    if any(w in combined for w in ["foodie", "food blog", "food content"]):
        return "the foodie content"
    if any(w in combined for w in ["eat", "eats", "eating", "taste", "tasting"]):
        return "the food finds"
    if any(w in combined for w in ["restaurant", "dining"]):
        return "the restaurant spotlights"
    return "what you're doing"


def build_batch_prompt(influencers):
    """Build a prompt that asks Gemini to personalize for a batch of influencers."""
    lines = []
    for i, inf in enumerate(influencers):
        lines.append(f"{i+1}. Username: @{inf['username']} | Name: {inf['full_name']} | Bio: {inf['bio']}")

    joined = "\n".join(lines)

    return f"""You are writing personalized Instagram DM openers for a Vietnamese sandwich shop owner doing influencer outreach.

For each influencer below, write a SHORT compliment (2-5 words max) that references something specific from their bio or content focus. This will follow "love" in a sentence like "Hey Name -- love [your phrase]"

Rules:
- 2-5 words ONLY
- Must feel specific to THEM (not generic)
- Reference their content style, niche, vibe, or a specific thing from their bio
- Use lowercase, casual tone
- Do NOT include "your" at the start if it sounds stiff
- Good examples: "the crab cake reviews", "your DMV food finds", "the vegan journey", "the hibachi content"
- Bad examples: "your amazing content", "what you do", "your page"

Return ONLY a JSON array of objects with "index" (1-based) and "detail" fields. No markdown, no explanation.

Influencers:
{joined}"""


def fix_json(text):
    """Fix common JSON issues from Gemini output."""
    # Strip markdown fences
    text = re.sub(r'^```json\s*', '', text.strip())
    text = re.sub(r'\s*```$', '', text.strip())
    # Remove trailing commas before ] or }
    text = re.sub(r',\s*([}\]])', r'\1', text)
    # Fix single quotes to double quotes (but not inside strings)
    # Try parsing as-is first, then attempt fixes
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # Try extracting just the array portion
    match = re.search(r'\[.*\]', text, re.DOTALL)
    if match:
        array_text = match.group()
        array_text = re.sub(r',\s*([}\]])', r'\1', array_text)
        try:
            return json.loads(array_text)
        except json.JSONDecodeError:
            pass
    # Last resort: extract index/detail pairs with regex
    pairs = re.findall(r'"index"\s*:\s*(\d+)\s*,\s*"detail"\s*:\s*"([^"]*)"', text)
    if pairs:
        return [{"index": int(idx), "detail": detail} for idx, detail in pairs]
    return None


def call_gemini(prompt, retries=3):
    """Call Gemini API with retry logic."""
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 16384,
            "responseMimeType": "application/json",
        }
    }

    for attempt in range(retries):
        try:
            resp = requests.post(GEMINI_BASE_URL, json=payload, params={"key": GEMINI_API_KEY}, timeout=90)
            if resp.status_code == 429:
                wait = 2 ** (attempt + 1)
                print(f"    Rate limited, waiting {wait}s...")
                time.sleep(wait)
                continue
            resp.raise_for_status()
            text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
            result = fix_json(text)
            if result:
                return result
            raise ValueError("Could not parse Gemini response as JSON")
        except (json.JSONDecodeError, KeyError, IndexError, ValueError, requests.RequestException) as e:
            if attempt < retries - 1:
                print(f"    Retry {attempt+1}/{retries}: {e}")
                time.sleep(2)
            else:
                print(f"    Failed after {retries} attempts: {e}")
                return None
    return None


def main():
    # Read input CSV
    influencers = []
    with open(INPUT_CSV, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            influencers.append({
                "username": row["Username"],
                "full_name": row["Full Name"],
                "bio": row["Bio"],
                "follower_count": row["Follower Count"],
                "profile_url": row["Profile URL"],
                "business_account": row["Business Account"],
                "post_count": row["Post Count"],
                "discovery_location": row["Discovery Location"],
            })

    print(f"Loaded {len(influencers)} influencers from CSV")

    # Process in batches
    total_batches = (len(influencers) + BATCH_SIZE - 1) // BATCH_SIZE
    all_details = {}

    for batch_idx in range(total_batches):
        start = batch_idx * BATCH_SIZE
        end = min(start + BATCH_SIZE, len(influencers))
        batch = influencers[start:end]

        print(f"  Batch {batch_idx+1}/{total_batches} ({len(batch)} influencers)...")

        prompt = build_batch_prompt(batch)
        results = call_gemini(prompt)

        if results:
            matched = 0
            for item in results:
                idx = item.get("index")
                detail = item.get("detail", "")
                if idx is not None and 1 <= idx <= len(batch) and detail:
                    global_idx = start + idx - 1
                    all_details[global_idx] = detail
                    matched += 1
            print(f"    Matched {matched}/{len(batch)}")
            # Fill gaps with bio-based fallback
            for i in range(start, end):
                if i not in all_details:
                    all_details[i] = bio_fallback(influencers[i]["bio"], influencers[i]["full_name"])
        else:
            for i in range(start, end):
                all_details[i] = bio_fallback(influencers[i]["bio"], influencers[i]["full_name"])

        # Small delay between batches to avoid rate limits
        if batch_idx < total_batches - 1:
            time.sleep(1)

    # Build messages and write output CSV
    with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "Username", "Full Name", "Follower Count", "Profile URL",
            "First Name", "Personalized Detail", "DM Message"
        ])

        for i, inf in enumerate(influencers):
            first_name = get_first_name(inf["full_name"], inf["username"])
            detail = all_details.get(i, "the food content")

            message = DM_TEMPLATE.format(name=first_name, detail=detail)

            writer.writerow([
                inf["username"],
                inf["full_name"],
                inf["follower_count"],
                inf["profile_url"],
                first_name,
                detail,
                message,
            ])

    print(f"\nDone! {len(influencers)} personalized DMs saved to:")
    print(f"  {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
