"""Rebuild fairfax-food-influencers.csv from pipe-delimited tool-result dump."""

import csv
import sys
from pathlib import Path

OUTPUT_CSV = (
    Path(__file__).resolve().parent.parent
    / "projects"
    / "influencer-lists"
    / "fairfax-food-influencers.csv"
)


def parse_line(line: str) -> dict | None:
    """Parse one line from the pipe-delimited dump.

    Format: INDEX|USERNAME|FULL_NAME|BIO_TRUNCATED
    - INDEX    : integer, no pipes
    - USERNAME : no spaces or pipes
    - FULL_NAME: may contain pipes (e.g. "Judy | DMV Foodie | Photographer")
    - BIO      : truncated, may contain pipes

    Strategy: split on '|' with maxsplit=3.
      parts[0] = index
      parts[1] = username
      parts[2] = full_name  (may still have pipes embedded -- that's fine;
                             get_first_name in assemble-dms.py handles it)
      parts[3] = bio_truncated (ignored in output; not needed for DM assembly)
    Edge case: lines with fewer than 3 pipes get name set to empty string.
    """
    line = line.strip()
    if not line:
        return None

    # split('|', 2) keeps everything after username as one blob, then
    # rsplit('|', 1) peels off the bio (last field) to recover the full name
    # even when the name contains pipes (e.g. "Judy | DMV Foodie | Photographer")
    parts = line.split("|", 2)
    if len(parts) < 3:
        return None

    index_str = parts[0].strip()
    if not index_str.isdigit():
        return None  # skip non-data lines

    username = parts[1].strip()
    if not username:
        return None

    rest = parts[2]
    name_bio = rest.rsplit("|", 1)
    full_name = name_bio[0].strip() if len(name_bio) == 2 else rest.strip()
    # bio (name_bio[1]) is truncated and not written to CSV
    # Follower Count is 0 (placeholder; original data was lost)

    return {
        "Username": username,
        "Full Name": full_name,
        "Follower Count": 0,
        "Bio": "",
        "Profile URL": f"https://instagram.com/{username}",
    }


def main():
    source_txt = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    if not source_txt:
        print("Usage: python rebuild-csv.py <path-to-pipe-delimited-txt>", file=sys.stderr)
        sys.exit(1)
    if not source_txt.exists():
        print(f"Error: source file not found: {source_txt}", file=sys.stderr)
        sys.exit(1)

    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)

    rows = []
    with open(source_txt, "r", encoding="utf-8") as f:
        for line in f:
            row = parse_line(line)
            if row:
                rows.append(row)

    with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
        fieldnames = ["Username", "Full Name", "Follower Count", "Bio", "Profile URL"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} rows to {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
