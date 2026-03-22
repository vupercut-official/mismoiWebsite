"""
Content Flywheel - Competitor Scraper Test Script

Tests the full pipeline locally before wiring into Make.com:
1. Call Apify to scrape a single competitor's IG reels
2. Send each reel caption to Claude for analysis
3. Print structured results (what would go into Google Sheets)

Usage:
  pip install requests anthropic
  export APIFY_TOKEN=your_apify_token
  export ANTHROPIC_API_KEY=your_anthropic_key
  python test-scraper.py

Optional args:
  python test-scraper.py --username hormozi --limit 5
"""

import os
import sys
import json
import time
import argparse
import requests

APIFY_TOKEN = os.environ.get("APIFY_TOKEN")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")

COMPETITOR_ANALYZER_PROMPT = """You are an Instagram Reels content analyst specializing in AI automation, content creation, and SMMA niches.

INPUT: You will receive the caption text of an Instagram Reel from a competitor account.

TASK: Analyze the reel's content structure and extract the following fields. Return as JSON only, no other text.

FIELDS TO EXTRACT:

1. "hook" - The scroll-stopping first line or sentence. Extract it verbatim from the caption.

2. "body_structure" - Classify into ONE of: "story", "listicle", "problem-solution", "before-after", "how-to", "myth-bust", "hot-take"

3. "cta_type" - Classify into ONE of: "follow", "comment", "save", "link_in_bio", "dm_me", "book_a_call", "none"

4. "format_tag" - Based on caption clues, classify into ONE of: "talking_head", "split_screen", "mural_board", "b_roll", "text_overlay", "screen_share", "mixed"

5. "topic" - The core topic in 3-8 words

6. "angle" - The specific perspective in 5-15 words

7. "hook_score" - Rate the hook 1-10 based on: curiosity gap, specificity, emotional trigger, pattern interrupt

OUTPUT: Return ONLY valid JSON, no markdown, no explanation:
{"hook": "...", "body_structure": "...", "cta_type": "...", "format_tag": "...", "topic": "...", "angle": "...", "hook_score": 7}"""


def check_env():
    """Verify required environment variables are set."""
    missing = []
    if not APIFY_TOKEN:
        missing.append("APIFY_TOKEN")
    if not ANTHROPIC_API_KEY:
        missing.append("ANTHROPIC_API_KEY")
    if missing:
        print(f"ERROR: Missing environment variables: {', '.join(missing)}")
        print("Set them with:")
        for var in missing:
            print(f"  export {var}=your_value_here")
        sys.exit(1)


def scrape_competitor(username, limit=5):
    """Scrape recent reels from an IG account using Apify."""
    print(f"\n[1/3] Scraping @{username} via Apify (limit: {limit} reels)...")

    actor_url = "https://api.apify.com/v2/acts/apify~instagram-scraper/runs"
    headers = {"Authorization": f"Bearer {APIFY_TOKEN}", "Content-Type": "application/json"}
    body = {
        "directUrls": [f"https://www.instagram.com/{username}/reels/"],
        "resultsLimit": limit,
        "resultsType": "posts",
        "searchType": "user"
    }

    # Start the actor run
    resp = requests.post(actor_url, headers=headers, json=body)
    if resp.status_code != 201:
        print(f"ERROR: Apify returned {resp.status_code}")
        print(resp.text[:500])
        sys.exit(1)

    run_data = resp.json().get("data", {})
    run_id = run_data.get("id")
    dataset_id = run_data.get("defaultDatasetId")
    print(f"  Run started: {run_id}")
    print(f"  Dataset: {dataset_id}")

    # Poll for completion
    status_url = f"https://api.apify.com/v2/actor-runs/{run_id}"
    for attempt in range(60):
        time.sleep(5)
        status_resp = requests.get(status_url, headers={"Authorization": f"Bearer {APIFY_TOKEN}"})
        status = status_resp.json().get("data", {}).get("status")
        if status == "SUCCEEDED":
            print(f"  Scrape complete after {(attempt + 1) * 5}s")
            break
        elif status in ("FAILED", "ABORTED", "TIMED-OUT"):
            print(f"ERROR: Apify run {status}")
            sys.exit(1)
        else:
            print(f"  Waiting... ({status})")
    else:
        print("ERROR: Apify run timed out after 5 minutes")
        sys.exit(1)

    # Fetch results
    dataset_url = f"https://api.apify.com/v2/datasets/{dataset_id}/items?format=json"
    data_resp = requests.get(dataset_url, headers={"Authorization": f"Bearer {APIFY_TOKEN}"})
    items = data_resp.json()

    reels = []
    for item in items:
        caption = item.get("caption") or item.get("text") or ""
        if not caption.strip():
            continue
        reels.append({
            "username": username,
            "reel_url": item.get("url") or item.get("shortCode", ""),
            "caption": caption,
            "views": item.get("videoViewCount") or item.get("playCount") or 0,
            "likes": item.get("likesCount") or item.get("likes") or 0,
            "comments": item.get("commentsCount") or item.get("comments") or 0,
        })

    print(f"  Got {len(reels)} reels with captions")
    return reels


def analyze_reel(caption):
    """Send a reel caption to Claude for structural analysis."""
    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    body = {
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 500,
        "temperature": 0.3,
        "messages": [
            {"role": "user", "content": f"{COMPETITOR_ANALYZER_PROMPT}\n\nCAPTION:\n{caption[:2000]}"}
        ]
    }

    resp = requests.post(url, headers=headers, json=body)
    if resp.status_code != 200:
        print(f"  Claude API error: {resp.status_code}")
        print(f"  {resp.text[:300]}")
        return None

    content = resp.json().get("content", [{}])[0].get("text", "")

    # Parse JSON from response (handle markdown code blocks)
    content = content.strip()
    if content.startswith("```"):
        content = content.split("\n", 1)[-1].rsplit("```", 1)[0].strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        print(f"  Could not parse Claude response as JSON: {content[:200]}")
        return None


def calculate_view_rate(views, username):
    """Estimate view rate. In production, you'd have follower counts from Apify."""
    # Placeholder: assume 100K followers for big accounts, 50K for mid, 20K for small
    big = ["hormozi", "imangadzhi", "codiesanchez"]
    mid = ["matthgray", "brockjohnsonofficial", "zachpogrob", "vanessalau.co"]
    if username in big:
        followers = 1000000
    elif username in mid:
        followers = 500000
    else:
        followers = 30000
    return round(views / max(followers, 1), 4) if views else 0


def main():
    parser = argparse.ArgumentParser(description="Test the competitor scraper pipeline")
    parser.add_argument("--username", default="nick_saraev", help="IG username to scrape (default: nick_saraev)")
    parser.add_argument("--limit", type=int, default=3, help="Number of reels to scrape (default: 3)")
    parser.add_argument("--skip-scrape", action="store_true", help="Skip Apify, use sample data for Claude testing")
    args = parser.parse_args()

    check_env()

    if args.skip_scrape:
        print("\n[1/3] Using sample data (--skip-scrape)")
        reels = [
            {
                "username": "sample",
                "reel_url": "https://instagram.com/reel/sample1",
                "caption": "Stop wasting time on content that doesn't convert. Here's the exact 3-step system I use to turn 1 video into 10 pieces of content that actually drive leads. Step 1: Film one long-form video (10-15 min). Step 2: Use AI to chop it into hooks, clips, and quotes. Step 3: Schedule across all platforms with one click. I went from posting 2x/week to 5x/day with LESS effort. Save this for later. Follow for more automation tips.",
                "views": 45000,
                "likes": 2100,
                "comments": 89,
            }
        ]
    else:
        reels = scrape_competitor(args.username, args.limit)

    if not reels:
        print("No reels found. Try a different username or check your Apify token.")
        sys.exit(1)

    print(f"\n[2/3] Analyzing {len(reels)} reels with Claude...")
    results = []
    for i, reel in enumerate(reels):
        print(f"  Analyzing reel {i + 1}/{len(reels)}...")
        analysis = analyze_reel(reel["caption"])
        if analysis:
            view_rate = calculate_view_rate(reel["views"], reel["username"])
            result = {
                **reel,
                **analysis,
                "view_rate": view_rate,
                "scraped_date": time.strftime("%Y-%m-%d"),
            }
            results.append(result)
            print(f"    Hook: {analysis.get('hook', 'N/A')[:60]}...")
            print(f"    Structure: {analysis.get('body_structure')} | CTA: {analysis.get('cta_type')} | Score: {analysis.get('hook_score')}")
        else:
            print(f"    Skipped (analysis failed)")

    print(f"\n[3/3] Results ({len(results)} reels analyzed)")
    print("=" * 80)

    # Print as table for quick review
    for r in results:
        print(f"\n@{r['username']} | {r['views']:,} views | view_rate: {r['view_rate']}")
        print(f"  Hook ({r.get('hook_score', '?')}/10): {r.get('hook', 'N/A')[:80]}")
        print(f"  Structure: {r.get('body_structure')} | CTA: {r.get('cta_type')} | Format: {r.get('format_tag')}")
        print(f"  Topic: {r.get('topic')} | Angle: {r.get('angle')}")
        print(f"  URL: {r.get('reel_url')}")

    # Print hooks that would go to hooks_library (score >= 7)
    top_hooks = [r for r in results if r.get("hook_score", 0) >= 7]
    if top_hooks:
        print(f"\n{'=' * 80}")
        print(f"TOP HOOKS (score >= 7) -> would go to hooks_library:")
        for h in top_hooks:
            print(f"  [{h['hook_score']}/10] {h.get('hook', 'N/A')[:80]}")

    # Save full results to JSON for inspection
    output_file = "projects/content-flywheel/test-scraper-results.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"\nFull results saved to: {output_file}")
    print("Done.")


if __name__ == "__main__":
    main()
