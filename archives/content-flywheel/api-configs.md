# API Configurations for Make.com HTTP Modules

Copy-paste these into Make.com HTTP "Make a Request" modules.

---

## Apify - Instagram Scraper

### Start a Scrape Run

**Module:** HTTP > Make a Request

| Field | Value |
|-------|-------|
| URL | `https://api.apify.com/v2/acts/apify~instagram-scraper/runs` |
| Method | POST |
| Headers | `Authorization: Bearer {{APIFY_TOKEN}}` |
| Headers | `Content-Type: application/json` |
| Body type | Raw |
| Content type | JSON (application/json) |

**Body:**
```json
{
  "directUrls": ["https://www.instagram.com/{{username}}/reels/"],
  "resultsLimit": 20,
  "resultsType": "posts",
  "searchType": "user"
}
```

**Response fields you need:**
- `data.id` (the run ID, for polling)
- `data.defaultDatasetId` (where results will be stored)

---

### Poll for Completion

**Module:** HTTP > Make a Request (inside a Repeater + Sleep loop, or use Apify webhook)

| Field | Value |
|-------|-------|
| URL | `https://api.apify.com/v2/actor-runs/{{run_id}}` |
| Method | GET |
| Headers | `Authorization: Bearer {{APIFY_TOKEN}}` |

**Check:** `data.status` should equal `SUCCEEDED`

**Alternative (simpler):** Use the synchronous endpoint instead. Add `?waitForFinish=300` to the start URL:
```
https://api.apify.com/v2/acts/apify~instagram-scraper/runs?waitForFinish=300
```
This waits up to 300 seconds for the run to finish. The response includes the full run data including `defaultDatasetId`. No polling needed.

---

### Fetch Scrape Results

**Module:** HTTP > Make a Request

| Field | Value |
|-------|-------|
| URL | `https://api.apify.com/v2/datasets/{{defaultDatasetId}}/items?format=json` |
| Method | GET |
| Headers | `Authorization: Bearer {{APIFY_TOKEN}}` |

**Response:** Array of post objects. Key fields per item:
- `caption` or `text` - the reel's caption text
- `url` or `shortCode` - link to the reel
- `videoViewCount` or `playCount` - view count
- `likesCount` or `likes` - like count
- `commentsCount` or `comments` - comment count
- `ownerUsername` - the account username

Note: Apify field names vary slightly between scraper versions. Map whichever fields are present.

---

## Claude API - Anthropic

### Competitor Analyzer Call

**Module:** HTTP > Make a Request

| Field | Value |
|-------|-------|
| URL | `https://api.anthropic.com/v1/messages` |
| Method | POST |
| Headers | `x-api-key: {{ANTHROPIC_API_KEY}}` |
| Headers | `anthropic-version: 2023-06-01` |
| Headers | `content-type: application/json` |
| Body type | Raw |
| Content type | JSON (application/json) |

**Body:**
```json
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 500,
  "temperature": 0.3,
  "messages": [
    {
      "role": "user",
      "content": "You are an Instagram Reels content analyst specializing in AI automation, content creation, and SMMA niches.\n\nINPUT: You will receive the caption text of an Instagram Reel from a competitor account.\n\nTASK: Analyze the reel's content structure and extract the following fields. Return as JSON only, no other text.\n\nFIELDS TO EXTRACT:\n\n1. \"hook\" - The scroll-stopping first line or sentence. Extract it verbatim from the caption.\n\n2. \"body_structure\" - Classify into ONE of: \"story\", \"listicle\", \"problem-solution\", \"before-after\", \"how-to\", \"myth-bust\", \"hot-take\"\n\n3. \"cta_type\" - Classify into ONE of: \"follow\", \"comment\", \"save\", \"link_in_bio\", \"dm_me\", \"book_a_call\", \"none\"\n\n4. \"format_tag\" - Based on caption clues, classify into ONE of: \"talking_head\", \"split_screen\", \"mural_board\", \"b_roll\", \"text_overlay\", \"screen_share\", \"mixed\"\n\n5. \"topic\" - The core topic in 3-8 words\n\n6. \"angle\" - The specific perspective in 5-15 words\n\n7. \"hook_score\" - Rate the hook 1-10 based on: curiosity gap, specificity, emotional trigger, pattern interrupt\n\nOUTPUT: Return ONLY valid JSON, no markdown, no explanation:\n{\"hook\": \"...\", \"body_structure\": \"...\", \"cta_type\": \"...\", \"format_tag\": \"...\", \"topic\": \"...\", \"angle\": \"...\", \"hook_score\": 7}\n\nCAPTION:\n{{caption}}"
    }
  ]
}
```

**Response:** Parse `content[0].text` as JSON to get the analysis fields.

**Cost:** ~$0.001-0.003 per reel (Haiku is very cheap)

---

### Batched Competitor Analyzer Call (Optimized)

Use this instead of the single-reel version above. Sends all captions from one username in a single API call.

**Module:** HTTP > Make a Request

| Field | Value |
|-------|-------|
| URL | `https://api.anthropic.com/v1/messages` |
| Method | POST |
| Headers | `x-api-key: {{ANTHROPIC_API_KEY}}` |
| Headers | `anthropic-version: 2023-06-01` |
| Headers | `content-type: application/json` |
| Body type | Raw |
| Content type | JSON (application/json) |

**Body:**
```json
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 8000,
  "temperature": 0.3,
  "messages": [
    {
      "role": "user",
      "content": "You are an Instagram Reels content analyst specializing in AI automation, content creation, and SMMA niches.\n\nINPUT: You will receive multiple Instagram Reel captions, numbered. Analyze each one independently.\n\nTASK: For each caption, extract the following fields. Return a JSON array with one object per caption.\n\nFIELDS TO EXTRACT PER CAPTION:\n1. \"index\" - The caption number (1, 2, 3...)\n2. \"hook\" - The scroll-stopping first line. Extract verbatim.\n3. \"body_structure\" - ONE of: \"story\", \"listicle\", \"problem-solution\", \"before-after\", \"how-to\", \"myth-bust\", \"hot-take\"\n4. \"cta_type\" - ONE of: \"follow\", \"comment\", \"save\", \"link_in_bio\", \"dm_me\", \"book_a_call\", \"none\"\n5. \"format_tag\" - ONE of: \"talking_head\", \"split_screen\", \"mural_board\", \"b_roll\", \"text_overlay\", \"screen_share\", \"mixed\"\n6. \"topic\" - Core topic in 3-8 words\n7. \"angle\" - Specific perspective in 5-15 words\n8. \"hook_score\" - Rate 1-10 based on: curiosity gap, specificity, emotional trigger, pattern interrupt\n\nOUTPUT: Return ONLY a valid JSON array, no markdown, no explanation:\n[{\"index\": 1, \"hook\": \"...\", \"body_structure\": \"...\", \"cta_type\": \"...\", \"format_tag\": \"...\", \"topic\": \"...\", \"angle\": \"...\", \"hook_score\": 7}, ...]\n\nCAPTIONS:\n{{aggregated_captions}}"
    }
  ]
}
```

**How to build `{{aggregated_captions}}`:** Use a Text Aggregator module before this call. For each reel from the dataset, concatenate as:
```
CAPTION 1: {{caption_text_1}}

CAPTION 2: {{caption_text_2}}

...
```

**Response:** Parse `content[0].text` as a JSON array. Each element maps to one reel.

**Cost:** ~$0.01-0.03 per username batch (20 captions in one call vs 20 separate calls). ~95% fewer API operations.

---

### Daily Script Generator Call

**Module:** HTTP > Make a Request

| Field | Value |
|-------|-------|
| URL | `https://api.anthropic.com/v1/messages` |
| Method | POST |
| Headers | `x-api-key: {{ANTHROPIC_API_KEY}}` |
| Headers | `anthropic-version: 2023-06-01` |
| Headers | `content-type: application/json` |

**Body:**
```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 4000,
  "temperature": 0.8,
  "messages": [
    {
      "role": "user",
      "content": "{{assembled_mega_prompt_with_all_data}}"
    }
  ]
}
```

Note: Use Sonnet for script generation (better creative output). Use Haiku for analysis tasks (cheaper, fast enough).

**Response:** Parse `content[0].text`. The prompt asks for 5 JSON script objects. You may need to wrap the output in `[...]` if Claude returns them individually.

**Cost:** ~$0.01-0.03 per daily run (Sonnet is pricier but you only call it once/day)

---

### Doubling Down Call

Same endpoint and headers as above. Use the doubling-down prompt from the Notion doc Section 4. Model: `claude-sonnet-4-6`, temperature: `0.85`.

### Monthly Optimizer Call

Same endpoint and headers. Use the monthly-optimizer prompt. Model: `claude-sonnet-4-6`, temperature: `0.6` (more analytical, less creative).

### Customer Intel Extractor Call

Same endpoint and headers. Use the customer-intel-extractor prompt. Model: `claude-haiku-4-5-20251001` (simple extraction task, Haiku is sufficient), temperature: `0.3`.

---

## Google Sheets - Make.com Native Module

Use Make.com's built-in Google Sheets modules (not HTTP). They handle auth automatically.

### Read Config
- Module: Google Sheets > Search Rows
- Spreadsheet: your flywheel database
- Sheet: `config`
- No filter needed (read all rows)

### Append to competitor_reels
- Module: Google Sheets > Add a Row
- Sheet: `competitor_reels`
- Map each field from the Claude API response to the corresponding column

### Read hooks_library (sorted by score)
- Module: Google Sheets > Search Rows
- Sheet: `hooks_library`
- Sort by: Column I (score), descending
- Limit: 20

### Update own_content
- Module: Google Sheets > Update a Row
- Sheet: `own_content`
- Find by: script_id column (Column C)
- Update the appropriate views_dayX column based on measurement_day

---

## Make.com Variables to Set

In your Make.com scenario settings, create these variables (or use a Data Store):

| Variable | Where to get it |
|----------|----------------|
| `APIFY_TOKEN` | apify.com > Settings > Integrations > API Token |
| `ANTHROPIC_API_KEY` | console.anthropic.com > API Keys |
| `SPREADSHEET_ID` | The long ID in your Google Sheet URL |

---

## Model Selection Guide

| Task | Model | Why |
|------|-------|-----|
| Competitor reel analysis | `claude-haiku-4-5-20251001` | Simple extraction, cheap, fast |
| Daily script generation | `claude-sonnet-4-6` | Creative writing needs better model |
| Doubling down variations | `claude-sonnet-4-6` | Creative variations need quality |
| Monthly pattern analysis | `claude-sonnet-4-6` | Complex analysis across many data points |
| Customer intel extraction | `claude-haiku-4-5-20251001` | Simple extraction from text |

**Monthly API cost estimate at full volume:**
- 100 reels/week analyzed with Haiku: ~$0.50/month
- 5 scripts/day generated with Sonnet: ~$3-5/month
- Weekly doubling down with Sonnet: ~$0.50/month
- Monthly optimizer with Sonnet: ~$0.10/month
- Customer intel (10 entries/month) with Haiku: ~$0.05/month
- **Total: ~$4-6/month in API costs**
