"""
Find 250+ Instagram food influencers within 10 miles of Fairfax, VA.

Uses Apify scrapers to:
1. Discover usernames via hyperlocal food hashtags
2. Enrich profiles with follower counts and bios
3. Filter by follower count (1,000+) and food content
4. Export to CSV

Usage:
    python scripts/find-influencers.py --token YOUR_APIFY_TOKEN

Cost: ~$1-2 per full run
Runtime: ~15-20 minutes
"""

import argparse
import csv
import re
import sys
import time
from pathlib import Path
from dotenv import load_dotenv
import os

from apify_client import ApifyClient

# --- Configuration ---

HASHTAGS = [
    # Reviewer/blogger specific
    "foodreview", "foodreviewer", "foodcritic", "restaurantreview",
    "foodblogger", "foodvlog", "foodtour", "tastetest",
    # DMV/NOVA reviewer specific
    "dmvfoodreviewer", "novafoodreviewer", "dmvfoodblogger", "dcfoodblogger",
    "dmvfoodcritic", "novafoodblogger", "vafoodblogger",
    # Local food discovery
    "fairfaxfoodie", "novafoodie", "fairfaxeats", "dmvfoodie",
    "novaeats", "dmveats", "dcfoodie", "dmvfoodscene",
    "northernvafoodie", "vafoodie", "tysonsfood", "arlingtonfoodie",
    "fallschurchfood", "dmvfood", "novafood",
]

RESULTS_PER_HASHTAG = 100

MIN_FOLLOWERS = 1000
MAX_FOLLOWERS = 500000  # Filter out massive accounts (likely not local)

FOOD_KEYWORDS = [
    # Reviewer/critic signals (strong)
    "food review", "restaurant review", "food blogger", "food critic",
    "food vlog", "mukbang", "taste test", "honest review",
    "food tour", "where to eat", "best eats", "must try",
    "food spot", "hidden gem", "food rating", "food recommendation",
    "food content creator", "foodstagram", "food photography",
    "foodporn", "foodblog", "food lover",
    # Broader food person signals
    "foodie", "eats", "food", "eating", "brunch", "bites",
    "dining", "delicious", "yummy", "tasty",
    # Local reviewer signals
    "dmv eats", "nova eats", "fairfax eats", "dmv foodie",
    "dmv food", "nova food", "va foodie", "dc foodie",
]

# Keywords that indicate a restaurant/business, NOT a reviewer
EXCLUDE_KEYWORDS = [
    "order now", "order online", "book a table", "reservations",
    "open daily", "hours:", "mon-", "tue-", "wed-", "thu-", "fri-",
    "sat-", "sun-", "am-", "pm-", "call us", "dine-in", "takeout",
    "delivery", "catering", "menu at", "visit us", "come visit",
    "our restaurant", "our kitchen", "our cafe", "our bakery",
    "est.", "established", "family-owned", "locally owned",
    "franchise", "locations in", "now open", "grand opening",
    "hiring", "we're hiring", "join our team",
]

OUTPUT_DIR = Path(__file__).parent.parent / "projects" / "influencer-lists"
OUTPUT_FILE = OUTPUT_DIR / "fairfax-food-influencers.csv"

# Batch size for profile scraping (process N usernames at a time)
PROFILE_BATCH_SIZE = 30


_FOOD_PATTERN = re.compile(
    r'\b(' + '|'.join(re.escape(kw) for kw in FOOD_KEYWORDS) + r')\b',
    re.IGNORECASE,
)

_EXCLUDE_PATTERN = re.compile(
    r'(' + '|'.join(re.escape(kw) for kw in EXCLUDE_KEYWORDS) + r')',
    re.IGNORECASE,
)


def is_food_reviewer(bio, captions=None):
    """Check if an account is a food reviewer (not a restaurant/business)."""
    text = (bio or "")
    if captions:
        text += " " + " ".join(c for c in captions if c)

    # Must match food keywords
    if not _FOOD_PATTERN.search(text):
        return False

    # Must NOT match restaurant/business keywords
    if _EXCLUDE_PATTERN.search(text):
        return False

    return True


def discover_usernames(client):
    """Phase 1: Scrape hashtags to discover unique usernames."""
    print(f"\n[Phase 1] Scraping {len(HASHTAGS)} hashtags ({RESULTS_PER_HASHTAG} results each)...")
    print(f"  Hashtags: {', '.join(HASHTAGS[:6])}... +{len(HASHTAGS) - 6} more")

    usernames = {}  # username -> {locationName, caption} for context

    run_input = {
        "hashtags": HASHTAGS,
        "resultsLimit": RESULTS_PER_HASHTAG,
    }

    run = client.actor("apify/instagram-hashtag-scraper").call(run_input=run_input)
    dataset_items = client.dataset(run["defaultDatasetId"]).list_items().items

    print(f"  Raw posts scraped: {len(dataset_items)}")

    for item in dataset_items:
        username = item.get("ownerUsername")
        if not username:
            continue
        if username not in usernames:
            usernames[username] = {
                "locationName": item.get("locationName", ""),
                "caption": item.get("caption", ""),
            }

    print(f"  Unique usernames discovered: {len(usernames)}")
    return usernames


def enrich_profiles(client, usernames_dict):
    """Phase 2: Pull full profile data for each unique username."""
    usernames = list(usernames_dict.keys())
    total = len(usernames)
    print(f"\n[Phase 2] Enriching {total} profiles in batches of {PROFILE_BATCH_SIZE}...")

    profiles = []
    failed_batches = 0

    for i in range(0, total, PROFILE_BATCH_SIZE):
        batch = usernames[i:i + PROFILE_BATCH_SIZE]
        batch_num = (i // PROFILE_BATCH_SIZE) + 1
        total_batches = (total + PROFILE_BATCH_SIZE - 1) // PROFILE_BATCH_SIZE
        print(f"  Batch {batch_num}/{total_batches} ({len(batch)} profiles)...")

        run_input = {
            "usernames": batch,
        }

        try:
            run = client.actor("apify/instagram-profile-scraper").call(run_input=run_input)
            items = client.dataset(run["defaultDatasetId"]).list_items().items

            for item in items:
                username = item.get("username", "")
                discovery_data = usernames_dict.get(username, {})
                profiles.append({
                    "username": username,
                    "fullName": item.get("fullName", ""),
                    "followersCount": item.get("followersCount", 0) or 0,
                    "biography": item.get("biography", ""),
                    "isBusinessAccount": item.get("isBusinessAccount", False),
                    "isVerified": item.get("isVerified", False),
                    "postsCount": item.get("postsCount", 0) or 0,
                    "discoveryCaption": discovery_data.get("caption", ""),
                    "discoveryLocation": discovery_data.get("locationName", ""),
                })
        except Exception as e:
            failed_batches += 1
            print(f"    Warning: Batch {batch_num} failed: {e}")
            if batch_num == 1:
                print("    First batch failed. Check your Apify token and connectivity.")
                raise
            continue

        # Brief pause between batches
        if i + PROFILE_BATCH_SIZE < total:
            time.sleep(2)

    print(f"  Profiles enriched: {len(profiles)}")
    return profiles


def filter_profiles(profiles):
    """Phase 3: Filter by follower count and food content."""
    print(f"\n[Phase 3] Filtering {len(profiles)} profiles...")

    qualified = []
    rejected_followers = 0
    rejected_not_food = 0
    rejected_business = 0

    for p in profiles:
        followers = p.get("followersCount", 0) or 0

        # Follower filter
        if followers < MIN_FOLLOWERS or followers > MAX_FOLLOWERS:
            rejected_followers += 1
            continue

        # Food reviewer filter (must be food-related AND not a business)
        bio = p.get("biography", "")
        captions = [p.get("discoveryCaption", "")]
        text = (bio or "")
        if captions:
            text += " " + " ".join(c for c in captions if c)

        if not _FOOD_PATTERN.search(text):
            rejected_not_food += 1
            continue

        if _EXCLUDE_PATTERN.search(text):
            rejected_business += 1
            continue

        qualified.append(p)

    print(f"  Rejected (followers out of range): {rejected_followers}")
    print(f"  Rejected (not food-related): {rejected_not_food}")
    print(f"  Rejected (restaurant/business): {rejected_business}")
    print(f"  Qualified influencers: {len(qualified)}")

    # Sort by follower count descending
    qualified.sort(key=lambda x: x.get("followersCount", 0), reverse=True)
    return qualified


def export_csv(profiles):
    """Phase 4: Write qualified profiles to CSV."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    fieldnames = [
        "Username",
        "Full Name",
        "Follower Count",
        "Bio",
        "Profile URL",
        "Business Account",
        "Post Count",
        "Discovery Location",
    ]

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for p in profiles:
            writer.writerow({
                "Username": p["username"],
                "Full Name": p["fullName"],
                "Follower Count": p["followersCount"],
                "Bio": (p.get("biography") or "").replace("\n", " "),
                "Profile URL": f"https://instagram.com/{p['username']}",
                "Business Account": "Yes" if p.get("isBusinessAccount") else "No",
                "Post Count": p.get("postsCount", 0),
                "Discovery Location": p.get("discoveryLocation", ""),
            })

    print(f"\n[Done] CSV saved to: {OUTPUT_FILE}")
    print(f"  Total influencers: {len(profiles)}")


def main():
    # Load .env from project root
    env_path = Path(__file__).parent.parent / ".env"
    load_dotenv(env_path)

    parser = argparse.ArgumentParser(description="Find food influencers near Fairfax, VA")
    parser.add_argument("--token", default=None, help="Apify API token (or set APIFY_API_TOKEN in .env)")
    args = parser.parse_args()

    token = args.token or os.environ.get("APIFY_API_TOKEN")
    if not token:
        print("Error: No Apify token. Set APIFY_API_TOKEN in .env or pass --token.")
        sys.exit(1)

    client = ApifyClient(token)

    print("=" * 60)
    print("Instagram Food Influencer Finder - Fairfax, VA (10mi radius)")
    print("=" * 60)

    # Phase 1: Discover
    usernames = discover_usernames(client)

    if not usernames:
        print("\nNo usernames found. Check your Apify token and try again.")
        sys.exit(1)

    # Phase 2: Enrich
    profiles = enrich_profiles(client, usernames)

    # Phase 3: Filter
    qualified = filter_profiles(profiles)

    # Phase 4: Export
    if qualified:
        export_csv(qualified)
    else:
        print("\nNo qualifying influencers found. Try adjusting filters.")
        sys.exit(1)

    # Summary
    print(f"\n{'=' * 60}")
    print("Summary:")
    print(f"  Hashtags scraped: {len(HASHTAGS)}")
    print(f"  Unique usernames: {len(usernames)}")
    print(f"  Profiles enriched: {len(profiles)}")
    print(f"  Qualified (CSV): {len(qualified)}")
    print(f"  Output: {OUTPUT_FILE}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
