# Make.com Build Guide - Content Flywheel (Optimized)

Step-by-step instructions for building all 6 Make.com scenarios. Follow in order.

**Optimization notes:** This guide uses batched API calls, inline parsing, and a shared data endpoint to minimize Make.com operations. ~53 modules total, ~104-129 ops/week. S7 costs 0 ops when you haven't added any new URLs or ideas.

---

## Prerequisites

Before starting, you need:
- [X] Google Sheet created (import 9 CSVs from `csv-templates/`)
- [X] Brand profile tab filled in (replace all [FILL IN] fields)
- [X] Apps Script data endpoint deployed (see `scripts/data-endpoint.gs`)
- [X] Apify account + API token (apify.com > Settings > Integrations)
- [X] Anthropic API key (console.anthropic.com > API Keys)
- [X] Make.com account (free tier works to start)

### Deploy the Data Endpoint

1. Open your Google Sheet > Extensions > Apps Script
2. Paste the contents of `scripts/data-endpoint.gs`
3. Replace `1wHnwjGwV36f_JVPIcnWx7uQWk6kiKNauqNqXZGfFKpw` with your sheet's ID (from the URL)
4. Go to Project Settings > Script Properties > Add property: `API_TOKEN` = any random string (API_TOKEN=vuperiscool123)
5. Deploy > New deployment > Web app > Execute as me > Anyone with link
6. Copy the deployment URL
7. Save the URL and token in Make.com variables as `DATA_ENDPOINT_URL` and `DATA_ENDPOINT_TOKEN`

---

## Scenario 1: Competitor Scraper

**Schedule:** Weekly, Sunday 3:00 AM EST
**Modules:** 10
**Estimated build time:** 45 min

### Module 1: Schedule Trigger
1. Create new scenario
2. Add trigger: "Schedule"
3. Set: Run scenario every 1 week, on Sunday, at 3:00 AM
4. Timezone: America/New_York (EST)

### Module 2: Google Sheets - Search Rows
1. Add module: Google Sheets > Search Rows
2. Connection: Connect your Google account
3. Spreadsheet: Select your flywheel database
4. Sheet: `config`
5. Filter: Column A (field_name) = `competitor_usernames`
6. This returns one row. Map `Column B` (value) to use next

### Module 3: Iterator (usernames)
1. Add module: Flow Control > Iterator
2. Array: `{{split(2.value; ", ")}}`
3. This splits the comma-separated usernames and loops through each

### Module 4: HTTP - Apify Scrape (synchronous)
1. Add module: HTTP > Make a Request
2. URL: `https://api.apify.com/v2/acts/apify~instagram-scraper/runs?waitForFinish=300`
3. Method: POST
4. Headers:
   - `Authorization`: `Bearer {{APIFY_TOKEN}}`
   - `Content-Type`: `application/json`
5. Body type: Raw
6. Request content:
```json
{
  "directUrls": ["https://www.instagram.com/{{3.value}}/reels/"],
  "resultsLimit": 20,
  "resultsType": "posts",
  "searchType": "user"
}
```
7. Parse response: Yes

### Module 5: HTTP - Fetch Dataset
1. Add module: HTTP > Make a Request
2. URL: `https://api.apify.com/v2/datasets/{{4.data.defaultDatasetId}}/items?format=json`
3. Method: GET
4. Headers: `Authorization`: `Bearer {{APIFY_TOKEN}}`
5. Parse response: Yes

### Module 6: Text Aggregator (batch captions)
1. Add module: Tools > Text Aggregator
2. Group by: Module 3 (Iterator - usernames) -- this groups all reels per username
3. Row separator: two newlines
4. Template: `CAPTION {{5.__IMTINDEX__}}: {{5.caption}}`
5. Filter before this module: `{{5.caption}}` is not empty AND `{{length(5.caption)}}` greater than 10

This collects all captions from one username into a single text block for batched analysis.

### Module 7: HTTP - Claude API (Batched Analysis)
1. Add module: HTTP > Make a Request
2. URL: `https://api.anthropic.com/v1/messages`
3. Method: POST
4. Headers:
   - `x-api-key`: `{{ANTHROPIC_API_KEY}}`
   - `anthropic-version`: `2023-06-01`
   - `content-type`: `application/json`
5. Body: See `api-configs.md` > "Batched Competitor Analyzer Call"
6. Replace `{{aggregated_captions}}` with the output of Module 6
7. Parse response: Yes

This sends ALL captions for one username in a single call (instead of 1 call per reel).

### Module 8: Iterator (parsed results)
1. Add module: Flow Control > Iterator
2. Array: `{{parseJSON(7.data.content[].text)}}`

If Claude wraps output in markdown backticks, use: `{{parseJSON(replace(replace(7.data.content[].text; "```json"; ""); "```"; ""))}}`

### Module 9: Google Sheets - Add Row (competitor_reels)
1. Add module: Google Sheets > Add a Row
2. Sheet: `competitor_reels`
3. Field mapping:
   - username: `{{3.value}}`
   - reel_url: (map from dataset if available, or leave blank)
   - caption: (from dataset array, matched by index)
   - hook: `{{8.hook}}`
   - body_structure: `{{8.body_structure}}`
   - cta_type: `{{8.cta_type}}`
   - format_tag: `{{8.format_tag}}`
   - topic: `{{8.topic}}`
   - angle: `{{8.angle}}`
   - hook_score: `{{8.hook_score}}`
   - views: (from dataset if available)
   - likes: (from dataset if available)
   - comments: (from dataset if available)
   - view_rate: (calculate if views available)
   - scraped_date: `{{formatDate(now; "YYYY-MM-DD")}}`

### Module 10: Google Sheets - Add Row (hooks_library) + Filter
1. Add a filter before this module: `{{8.hook_score}}` greater than or equal to 7
2. Add module: Google Sheets > Add a Row
3. Sheet: `hooks_library`
4. Field mapping:
   - hook_text: `{{8.hook}}`
   - source: `competitor`
   - topic: `{{8.topic}}`
   - format: `{{8.format_tag}}`
   - niche: (leave blank)
   - best_view_rate: (from dataset if available)
   - times_used_by_us: `0`
   - avg_performance_when_used: (leave blank)
   - score: `{{8.hook_score}}`

### Test it
1. Set the Iterator (Module 3) to process only 1 username for testing
2. Run the scenario manually
3. Check: `competitor_reels` tab should have new rows
4. Check: `hooks_library` tab should have hooks with score >= 7
5. Once working, restore the full iterator and enable the schedule

### Operations math
- Before: 13 usernames x 20 reels x 1 Claude call = 260 Claude calls + 260 sheet writes = ~800 ops
- After: 13 usernames x 1 Claude call = 13 Claude calls + ~260 sheet writes = ~40 ops

---

## Scenario 2: Daily Script Generator

**Schedule:** Daily, 7:00 AM EST
**Modules:** 8
**Estimated build time:** 30 min

### Module 1: Schedule Trigger
1. Daily at 7:00 AM, America/New_York

### Module 2: HTTP - Data Endpoint
1. Add module: HTTP > Make a Request
2. URL: `{{DATA_ENDPOINT_URL}}?token={{DATA_ENDPOINT_TOKEN}}`
3. Method: GET
4. Parse response: Yes

This single call replaces 6 separate Google Sheets reads. Returns config, brand_profile, top_hooks (20), customer_intel (5), competitor_reels (last 7 days, top 10), own_content (top 10).

### Module 3: JSON - Parse Endpoint Response
1. Add module: JSON > Parse JSON
2. JSON string: `{{2.data}}`
3. Data structure: Create from the sample JSON in `data-endpoint.gs` comments

### Module 4: Text Aggregator
1. Add module: Tools > Text Aggregator
2. Assemble the mega-prompt by combining all data from Module 3:
```
You are a viral Instagram Reels scriptwriter for the AI automation niche.

BRAND VOICE: {{3.data.config.brand_voice}}

BRAND PROFILE:
{{3.data.brand_profile.who_i_am}}
Offer: {{3.data.brand_profile.my_offer}}
ICP: {{3.data.brand_profile.my_icp}}
Voice: {{3.data.brand_profile.my_voice}}
Story: {{3.data.brand_profile.my_story}}
Differentiator: {{3.data.brand_profile.my_differentiator}}

TOP PERFORMING HOOKS THIS MONTH:
{{join(map(3.data.top_hooks; "hook_text"; " (score: "; "score"; ")"); newline)}}

CUSTOMER LANGUAGE:
{{join(map(3.data.customer_intel; "pain_point"; " - "; "language_used"; ""); newline)}}

COMPETITOR ANGLES WORKING NOW:
{{join(map(3.data.competitor_reels; "hook"; " | "; "topic"; " | "; "angle"; ""); newline)}}

MY TOP PERFORMERS (sorted by engagement score):
{{join(map(3.data.own_content; "hook_used"; " | "; "topic"; " | views: "; "views"; " | engagement: "; "engagement_score"; ""); newline)}}

Engagement score = weighted combo of likes, comments, shares (views excluded -- they measure reach, not quality). Higher = more proven.

Use 2-3 of today's 5 scripts to riff on proven hooks/formats from top-engagement content. Use the remaining 2-3 to test new angles from competitor data or content ideas. In each script's why_this_works field, note whether it's a "proven_riff" or "new_test" so we can track hit rates.

CONTENT PILLARS:
1. {{3.data.config.pillar_1}}
2. {{3.data.config.pillar_2}}
3. {{3.data.config.pillar_3}}
4. {{3.data.config.pillar_4}}
5. {{3.data.config.pillar_5}}

CONTENT IDEAS FROM VU:
{{join(map(3.data.content_ideas; "raw_idea"; " [priority: "; "priority"; ", topic: "; "topic_hint"; "]"); newline)}}

Consider these ideas as inspiration. Use them if they fit today's mix, skip if not. High priority ideas should get more weight. If you use an idea, set source_inspiration to "idea: [the raw idea text]" so we can track it.

RECENT HOOKS (do not duplicate):
{{join(map(3.data.recent_scripts; "hook"; ""); newline)}}

FUNNEL MIX: {{3.data.config.tof_ratio}} TOF, {{3.data.config.mof_ratio}} MOF

TASK: Generate 5 Instagram Reel scripts. For each script return a JSON object with:
- hook (the opening line)
- body (the full script, 30-60 seconds spoken)
- cta (call to action)
- format (talking_head, b_roll, screen_share, etc.)
- topic
- funnel_position (tof, mof, or bof)
- source_inspiration (what inspired this script: a competitor hook, a content idea from Vu, a top performer, etc. Be specific.)
- why_this_works (1 sentence)

Return a JSON array of 5 objects. No markdown, no explanation.
```

### Module 5: HTTP - Claude API (Generate Scripts)
1. URL: `https://api.anthropic.com/v1/messages`
2. Model: `claude-sonnet-4-6`
3. Temperature: 0.8
4. Max tokens: 4000
5. Message content: output from Text Aggregator

### Module 6: Iterator (scripts)
1. Array: `{{parseJSON(5.data.content[].text)}}`
2. If backticks: `{{parseJSON(replace(replace(5.data.content[].text; "```json"; ""); "```"; ""))}}`

### Module 7: Google Sheets - Add Row (scripts_generated)
1. Sheet: `scripts_generated`
2. Map all fields from the parsed script
3. Set `script_id`: `{{formatDate(now; "YYYY-MM-DD")}}-{{6.__IMTINDEX__}}`
4. Set `status`: `generated`

### Module 8: Google Sheets - Mark Ideas Used
1. Add module: Google Sheets > Search Rows
2. Sheet: `video_inbox`
3. Filter: Column B (source_type) = `content_idea` AND Column F (status) = `processed`
4. For each result: Update Row -- set Column F (status) to `used`

This marks content ideas as consumed after each script generation run, so they don't keep appearing in the prompt.

### Module 9: Gmail - Send Email
1. Add module: Gmail > Send an Email
2. To: your email
3. Subject: `Content Flywheel: 5 new scripts for {{formatDate(now; "MMM DD")}}`
4. Body (HTML): Summary of all 5 scripts with hooks, formats, topics, and CTAs

### Operations math
- Before: 6 Sheets reads + Claude + parse + iterate + write + email = ~14 ops/day
- After: 1 HTTP endpoint + parse + aggregator + Claude + iterate + write + email + idea update = ~10 ops/day

---

## Scenario 3: Auto Performance Tracker

**Schedule:** Daily, 10:00 PM EST
**Modules:** ~7
**Estimated build time:** 30 min

This scenario automatically pulls metrics from Instagram for your posted reels 7 days after posting. No manual form needed. One scrape per reel, one week after you post it.

### Module 1: Schedule Trigger
1. Create new scenario
2. Add trigger: "Schedule"
3. Set: Run scenario every 1 day at 10:00 PM
4. Timezone: America/New_York (EST)

### Module 2: Google Sheets - Search Rows (reels needing day-7 metrics)
1. Add module: Google Sheets > Search Rows
2. Sheet: `own_content`
3. Filter: Column P (engagement_score) is empty AND Column B (post_date) is between 7-10 days ago

In Make.com filter terms:
- `engagement_score` does not exist
- AND `post_date` >= `{{formatDate(addDays(now; -10); "YYYY-MM-DD")}}`
- AND `post_date` <= `{{formatDate(addDays(now; -7); "YYYY-MM-DD")}}`

The 7-10 day range gives a 3-day grace period so missed runs catch up.

### Module 3: Iterator
1. Add module: Flow Control > Iterator
2. Array: output from Module 2

### Module 4: HTTP - Apify Scrape (single URL)
1. Add module: HTTP > Make a Request
2. URL: `https://api.apify.com/v2/acts/apify~instagram-scraper/runs?waitForFinish=300`
3. Method: POST
4. Headers:
   - `Authorization`: `Bearer {{APIFY_TOKEN}}`
   - `Content-Type`: `application/json`
5. Body type: Raw
6. Request content:
```json
{
  "directUrls": ["{{3.reel_url}}"],
  "resultsLimit": 1,
  "resultsType": "posts"
}
```
7. Parse response: Yes

### Module 5: HTTP - Fetch Dataset
1. Add module: HTTP > Make a Request
2. URL: `https://api.apify.com/v2/datasets/{{4.data.defaultDatasetId}}/items?format=json`
3. Method: GET
4. Headers: `Authorization`: `Bearer {{APIFY_TOKEN}}`
5. Parse response: Yes

### Module 6: Google Sheets - Update Row (day 7 metrics)
1. Sheet: `own_content`
2. Search column: A (reel_url)
3. Search value: `{{3.reel_url}}`
4. Update columns:
   - Column H (views): `{{5.viewsCount}}`
   - Column I (likes): `{{5.likesCount}}`
   - Column J (comments): `{{5.commentsCount}}`
   - Column K (shares): `{{5.sharesCount}}`
   - Column L (follower_delta): (leave blank, manual fill if needed)
   - Column M (calls_booked_attributed): (leave blank, manual fill if needed)
   - Column N (engagement_score): `{{(5.likesCount * 2) + (5.commentsCount * 5) + (5.sharesCount * 10)}}`

### Calculate engagement_score

```
engagement_score = (likes * 2) + (comments * 5) + (shares * 10)
```

**Weight rationale:** Shares signal strongest intent (someone wants to spread it). Comments show conversation. Likes are passive. Views are excluded because they measure reach, not resonance. Raw views are still visible in the views column.

### Module 7: Google Sheets - Search Rows (get hooks for matching)
1. Add module: Google Sheets > Search Rows
2. Sheet: `hooks_library`
3. Sort: score descending
4. Limit: 20

This grabs the top 20 hooks from the library for Claude to match against.

### Module 8: HTTP - Claude API (fuzzy match hook)
1. Add module: HTTP > Make a Request
2. URL: `https://api.anthropic.com/v1/messages`
3. Method: POST
4. Headers:
   - `x-api-key`: `{{ANTHROPIC_API_KEY}}`
   - `anthropic-version`: `2023-06-01`
   - `content-type`: `application/json`
5. Body:
```json
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 200,
  "temperature": 0,
  "messages": [
    {
      "role": "user",
      "content": "Given this hook I used in my reel:\n\"{{3.hook_used}}\"\n\nFind the closest match from this list of hooks:\n{{join(map(7; \"hook_text\"; \"\"); newline)}}\n\nReturn ONLY a JSON object with:\n- matched_hook_text: the exact text of the closest matching hook from the list (or null if no reasonable match)\n- confidence: high, medium, low, or none\n\nNo markdown, no explanation."
    }
  ]
}
```
6. Parse response: Yes

Cost: ~$0.001 per call. Uses Haiku for speed and cost.

### Module 9: Google Sheets - Update Row (hooks_library feedback)
1. Parse Claude's response: `{{parseJSON(8.data.content[].text)}}`
2. Add a filter: `confidence` is `high` or `medium`
3. Google Sheets > Search Rows: `hooks_library` where `hook_text` = `{{parsed.matched_hook_text}}`
4. Google Sheets > Update Row:
   - `avg_performance_when_used`: `{{((search_result.avg_performance_when_used * search_result.times_used_by_us) + 6.engagement_score) / (search_result.times_used_by_us + 1)}}`
   - `times_used_by_us`: `{{search_result.times_used_by_us + 1}}`
   - `best_view_rate`: `{{if(5.viewsCount > search_result.best_view_rate; 5.viewsCount; search_result.best_view_rate)}}` (only updates if current views beat the previous best)

This closes the feedback loop. Claude fuzzy-matches your hook variation back to the original hook in the library. Hooks that produce high-engagement content rise. Hooks that underperform sink.

### Test it
1. Add a row to `own_content` with a real reel URL and `post_date` = 7 days ago
2. Fill in `hook_used` with a variation of a hook from your hooks_library
3. Run the scenario manually
4. Check: day-7 metrics + engagement_score should be populated
5. Check: Claude should have matched your hook to the closest library hook
6. Check: hooks_library should have updated `avg_performance_when_used` and `times_used_by_us`

### Operations math
- 0 ops when no reels need tracking
- Per reel: ~5 ops (Apify + fetch + sheet update + Claude match + hooks update)
- Typical day (1 reel): ~5 ops
- If scenario misses a day, it catches up next run (range-based filters)

---

## Scenario 4: Doubling Down Engine

**Schedule:** Weekly, Monday 8:00 AM EST
**Modules:** 5
**Estimated build time:** 20 min

### Module 1: Schedule Trigger
1. Weekly, Monday, 8:00 AM

### Module 2: HTTP - Data Endpoint
1. Add module: HTTP > Make a Request
2. URL: `{{DATA_ENDPOINT_URL}}?token={{DATA_ENDPOINT_TOKEN}}`
3. Method: GET
4. Parse response: Yes

Returns everything in one call: weekly_winner (winner + original script), competitor_reels, brand_profile.

### Module 3: JSON - Parse Endpoint Response
1. Add module: JSON > Parse JSON
2. JSON string: `{{2.data}}`

### Module 4: HTTP - Claude API (or built-in Claude module)
1. Model: `claude-sonnet-4-6`, temperature: 0.85
2. Prompt:
```
You are a content strategist doubling down on a proven winner.

WINNING CONTENT:
Hook: {{3.data.weekly_winner.winner.hook_used}}
Format: {{3.data.weekly_winner.winner.format}}
Topic: {{3.data.weekly_winner.winner.topic}}
Funnel position: {{3.data.weekly_winner.winner.funnel_position}}
Views: {{3.data.weekly_winner.winner.views}} | Likes: {{3.data.weekly_winner.winner.likes}} | Comments: {{3.data.weekly_winner.winner.comments}} | Shares: {{3.data.weekly_winner.winner.shares}}
Engagement score: {{3.data.weekly_winner.winner.engagement_score}}

ORIGINAL SCRIPT:
Hook: {{3.data.weekly_winner.original_script.hook}}
Body: {{3.data.weekly_winner.original_script.body}}
CTA: {{3.data.weekly_winner.original_script.cta}}

COMPETITOR ANGLES (reference only, for V3):
{{join(map(3.data.competitor_reels; "hook"; " | "; "topic"; " | "; "angle"; ""); newline)}}

BRAND VOICE:
{{3.data.brand_profile.my_voice}}
Phrases to use: {{3.data.brand_profile.phrases_to_use}}
Phrases to avoid: {{3.data.brand_profile.phrases_to_avoid}}

---

STEP 1 -- WIN REASON HYPOTHESIS
Before writing anything, write 2 sentences explaining WHY this content won. Look at the engagement breakdown. High shares = reach/utility content people forward. High comments = conversation/debate trigger. High likes = passive approval. Name the winning mechanism.

STEP 2 -- GENERATE 3 VARIATIONS
Using your hypothesis, generate 3 variations. Each must change at least 2 elements from the original (hook type, format, CTA, narrative structure).

V1 -- Low Risk:
Tighten the original. Keep format and topic. Sharpen hook and body based on the win reason.
CTA: direct (follow, save, or share ask)

V2 -- Medium Risk:
Same topic, different angle or format. Push the winning mechanism harder.
CTA: engagement-focused (question, debate prompt, or "comment X if you agree")

V3 -- High Risk / Controlled Experiment:
Push into adjacent territory or flip the format. Reference competitor angles if useful. Test a bold hypothesis.
CTA: conversion-focused (link in bio, DM me, or join waitlist)

Return a JSON array of 3 objects. Each object:
- risk_level (low, medium, high)
- win_hypothesis (from step 1, same for all 3)
- hook
- body (30-60 seconds spoken)
- cta
- format
- topic
- funnel_position
- source_inspiration (the winning script_id: {{3.data.weekly_winner.winner.script_id}})
- what_changed (1 sentence explaining what's different and why)

No markdown, no explanation. JSON array only.
```

### Module 5: Iterator + Add Rows
1. Iterator array: `{{parseJSON(4.data.content[].text)}}`
2. After iterator: Google Sheets > Add Row to `scripts_generated`
3. Field mapping:
   - script_id: `{{formatDate(now; "YYYYMMDD-HHmmss")}}`
   - hook: `{{5.hook}}`
   - body: `{{5.body}}`
   - cta: `{{5.cta}}`
   - format: `{{5.format}}`
   - topic: `{{5.topic}}`
   - funnel_position: `{{5.funnel_position}}`
   - source_inspiration: `{{5.source_inspiration}}`
   - status: `generated`

---

## Scenario 5: Monthly Optimizer

**Schedule:** Monthly, 1st at 6:00 AM EST
**Modules:** 7
**Estimated build time:** 30 min

### Module 1: Schedule Trigger
1. Monthly, 1st of month, 6:00 AM EST

### Module 2: HTTP - Data Endpoint
1. URL: `{{DATA_ENDPOINT_URL}}?token={{DATA_ENDPOINT_TOKEN}}`
2. Method: GET
3. Parse response: Yes

Returns own_content, hooks_library, brand_profile, competitor_reels in one call.

### Module 3: JSON - Parse Endpoint Response
1. JSON string: `{{2.data}}`

### Module 4: HTTP - Claude API (or built-in Claude module)
1. Model: `claude-sonnet-4-6`, temperature: 0.6
2. Prompt:
```
You are a content performance analyst reviewing one month of Instagram Reels data.

BRAND CONTEXT:
{{3.data.brand_profile.who_i_am}}
Offer: {{3.data.brand_profile.my_offer}}
ICP: {{3.data.brand_profile.my_icp}}

MY CONTENT THIS MONTH (sorted by engagement score):
{{toString(1.data.data.own_content)}}

TOP HOOKS IN LIBRARY (by score):
{{toString(1.data.data.top_hooks)}}

COMPETITOR TRENDS THIS MONTH:
{{toString(1.data.data.competitor_reels)}}

---

Analyze the month and produce a structured report with these sections:

1. TOP PERFORMERS
Identify the top 3 reels by engagement score. For each:
- What was the hook?
- Why did it work? (look at the engagement breakdown -- shares-heavy vs comments-heavy tells different stories)
- What pattern does it share with other top performers?

2. PATTERNS THAT WORK
Identify 3-5 repeating patterns across top performers:
- Hook types that consistently score (question, stat, controversy, how-to, etc.)
- Formats that win (talking_head, screen_share, b_roll, etc.)
- Topics that resonate
- Funnel positions that drive engagement

3. PATTERNS THAT FLOP
Identify what didn't work:
- Hooks or formats that underperformed
- Topics the audience ignored
- Any content that got views but no engagement (algorithm push, no resonance)

4. HOOKS LIBRARY AUDIT
Review the hooks library usage data:
- Which hooks have been used and performed well? (high avg_performance_when_used)
- Which high-score hooks haven't been used yet? (times_used_by_us = 0)
- Recommend 5 unused hooks to prioritize next month

5. COMPETITOR GAP ANALYSIS
Compare your top performers against competitor trends:
- What angles are competitors hitting that you're not?
- What are you doing that competitors aren't? (your edge)
- One competitor angle worth testing next month

6. NEXT MONTH RECOMMENDATIONS
Based on all analysis:
- 3 content themes to double down on
- 2 experiments to run (new format, new hook type, new topic)
- 1 thing to stop doing
- Suggested funnel mix adjustment (more TOF, more MOF, or keep current)

7. MONTHLY OUTLIERS (JSON)
Return the top 10 reels as a JSON array for the monthly_outliers tab. Each object:
- month (YYYY-MM format for previous month)
- reel_url
- views
- engagement_score
- hook
- format
- topic
- why_it_worked (1 sentence)
- pattern_tags (comma-separated: e.g. "question_hook, talking_head, AI_tools")

Format the report sections 1-6 as plain text. Section 7 as a JSON array wrapped in ```json``` tags.
```

### Module 5: Parse Outliers JSON
1. Extract the JSON array from Claude's response (between the ```json``` tags)
2. Parse JSON: `{{parseJSON(extracted_json)}}`

### Module 6: Iterator + Add Rows (monthly_outliers)
1. Iterator array: output from Module 5
2. Google Sheets > Add Row to `monthly_outliers`
3. Map all fields from the parsed JSON

### Module 7: Gmail - Send Monthly Report
1. Add module: Gmail > Send an Email
2. To: your email
3. Subject: `Content Report: {{formatDate(addMonths(now; -1); "MMMM YYYY")}}`
4. Body (HTML): Full text from Claude's response (sections 1-6)

---

## Scenario 6: Customer Intelligence

**Trigger:** Google Forms submission
**Modules:** 4
**Estimated build time:** 15 min

1. Google Forms trigger (new post-call notes)
2. Claude API with customer-intel-extractor prompt (Haiku, temp 0.3)
3. JSON Parse: `{{parseJSON(2.data.content[].text)}}`
4. Append to customer_intelligence tab

---

## Scenario 7: Video Inbox Processor

**Schedule:** Every 6 hours
**Modules:** 10
**Estimated build time:** 30 min

This scenario processes video URLs and content ideas that you manually add to the `video_inbox` tab. Videos get scraped and graded (hook extraction, scoring). Content ideas just get marked as processed so the daily script generator can pick them up.

### Module 1: Schedule Trigger
1. Create new scenario
2. Add trigger: "Schedule"
3. Set: Run scenario every 6 hours
4. Timezone: America/New_York (EST)

### Module 2: Google Sheets - Search Rows (video URLs)
1. Add module: Google Sheets > Search Rows
2. Spreadsheet: Select your flywheel database
3. Sheet: `video_inbox`
4. Filter: Column F (status) = `pending` AND Column B (source_type) is not `content_idea`
5. Limit: 20 rows per run

### Module 3: Iterator (video URLs)
1. Add module: Flow Control > Iterator
2. Array: output from Module 2
3. Add a filter before this module: `{{length(2)}}` greater than 0

### Module 4: HTTP - Apify Scrape (single URL)
1. Add module: HTTP > Make a Request
2. URL: `https://api.apify.com/v2/acts/apify~instagram-scraper/runs?waitForFinish=300`
3. Method: POST
4. Headers:
   - `Authorization`: `Bearer {{APIFY_TOKEN}}`
   - `Content-Type`: `application/json`
5. Body type: Raw
6. Request content:
```json
{
  "directUrls": ["{{3.url}}"],
  "resultsLimit": 1,
  "resultsType": "posts"
}
```
7. Parse response: Yes

### Module 5: HTTP - Fetch Dataset
1. Add module: HTTP > Make a Request
2. URL: `https://api.apify.com/v2/datasets/{{4.data.defaultDatasetId}}/items?format=json`
3. Method: GET
4. Headers: `Authorization`: `Bearer {{APIFY_TOKEN}}`
5. Parse response: Yes

### Module 6: HTTP - Claude API (Analyze)
1. Add module: HTTP > Make a Request
2. URL: `https://api.anthropic.com/v1/messages`
3. Method: POST
4. Headers:
   - `x-api-key`: `{{ANTHROPIC_API_KEY}}`
   - `anthropic-version`: `2023-06-01`
   - `content-type`: `application/json`
5. Body: Same batched analyzer prompt from Scenario 1, but with a single caption
6. Model: `claude-haiku-4-5-20251001`
7. Parse response: Yes

### Module 7: Google Sheets - Add Row (competitor_reels)
1. Add module: Google Sheets > Add a Row
2. Sheet: `competitor_reels`
3. Field mapping:
   - username: (extract from URL or leave as `manual_add`)
   - reel_url: `{{3.url}}`
   - caption: `{{5.caption}}`
   - hook: `{{parseJSON(6.data.content[].text).hook}}`
   - body_structure: `{{parseJSON(6.data.content[].text).body_structure}}`
   - cta_type: `{{parseJSON(6.data.content[].text).cta_type}}`
   - format_tag: `{{parseJSON(6.data.content[].text).format_tag}}`
   - topic: `{{parseJSON(6.data.content[].text).topic}}`
   - angle: `{{parseJSON(6.data.content[].text).angle}}`
   - hook_score: `{{parseJSON(6.data.content[].text).hook_score}}`
   - views: (from dataset)
   - likes: (from dataset)
   - comments: (from dataset)
   - view_rate: (calculate if views available)
   - scraped_date: `{{formatDate(now; "YYYY-MM-DD")}}`

### Module 8: Google Sheets - Add Row (hooks_library) + Filter
1. Add a filter before this module: `{{parseJSON(6.data.content[].text).hook_score}}` >= 7
2. Add module: Google Sheets > Add a Row
3. Sheet: `hooks_library`
4. Field mapping:
   - hook_text: `{{parseJSON(6.data.content[].text).hook}}`
   - source: `{{3.source_type}}`
   - topic: `{{parseJSON(6.data.content[].text).topic}}`
   - format: `{{parseJSON(6.data.content[].text).format_tag}}`
   - score: `{{parseJSON(6.data.content[].text).hook_score}}`

### Module 9: Google Sheets - Update Row (mark processed)
1. Add module: Google Sheets > Update a Row
2. Sheet: `video_inbox`
3. Row: `{{3.__IMTINDEX__}}` (the current row being processed)
4. Set Column F (status): `processed`
5. Set Column G (processed_date): `{{formatDate(now; "YYYY-MM-DD")}}`

### Module 10: Google Sheets - Process Content Ideas
1. Add a second route from Module 1 (before the iterator)
2. Add module: Google Sheets > Search Rows
3. Sheet: `video_inbox`
4. Filter: Column F (status) = `pending` AND Column B (source_type) = `content_idea`
5. For each result, update status to `processed`

This runs in parallel with the video URL processing. Content ideas don't need Apify or Claude -- they just need to be marked as available for the daily script generator.

### Test it
1. Paste 2 Instagram reel URLs into `video_inbox` with source_type `inspiration`, status `pending`
2. Paste 1 content idea with source_type `content_idea`, raw_idea filled in, status `pending`
3. Run the scenario manually
4. Check: `competitor_reels` should have 2 new rows from your URLs
5. Check: `hooks_library` should have new entries if hook_score >= 7
6. Check: `video_inbox` status should be `processed` for all 3 rows
7. Check: Content idea should show up in the next Scenario 2 run via the data endpoint

### Operations math
- 0 ops when no pending rows (search returns empty, scenario stops)
- Per video URL: ~5 ops (Apify + fetch + Claude + 2 sheet writes)
- Per content idea: ~1 op (status update only)
- Typical week (5-10 URLs): ~25-50 ops

---

## Scenario 2 Prompt Additions

Add this section to the Scenario 2 mega-prompt. Insert after COMPETITOR ANGLES and before the TASK section:

```
PROVEN PATTERNS (data-driven rules from my last 30 days):
{{1.data.text.pattern_rules}}

These are hard rules based on MY performance data. Follow them unless you have a specific creative reason to break one. When you break a rule, note it in why_this_works.
```

---

## Post-Build Checklist

- [ ] Apps Script data endpoint deployed and returning JSON
- [ ] Scenario 1 (competitor scraper) runs and populates competitor_reels + hooks_library
- [ ] Scenario 2 (daily scripts) generates 5 scripts and emails you
- [ ] Scenario 3 (auto performance tracker) scrapes metrics from Instagram at day 1, 3, 7
- [ ] Scenario 4 (doubling down) generates variations of the top performer
- [ ] Scenario 5 (monthly optimizer) produces a monthly report
- [ ] Scenario 6 (customer intel) extracts insights from call notes
- [ ] Scenario 7 (video inbox) scrapes manual URLs and marks content ideas as processed
- [ ] `video_inbox` tab exists with correct columns
- [ ] Data endpoint returns `pattern_rules` in payload
- [ ] Scenario 2 prompt includes pattern rules section
- [ ] Data endpoint returns `content_ideas` and `recent_scripts` in payload
- [ ] All scenarios have error handling enabled (Make.com > Scenario settings > Error handling)
- [ ] Brand profile tab is filled in (no more [FILL IN] placeholders)
- [ ] At least 1 competitor scrape has run successfully
- [ ] First batch of 5 scripts generated and reviewed

---

## Module Count Summary

| Scenario | Modules | Ops/run |
|----------|---------|---------|
| S1: Competitor Scraper | 10 | ~40 |
| S2: Daily Script Generator | 9 | ~10 |
| S3: Auto Performance Tracker | ~10 | ~5 |
| S4: Doubling Down | 5 | ~4 |
| S5: Monthly Optimizer | 7 | ~5 |
| S6: Customer Intel | 4 | ~4 |
| S7: Video Inbox Processor | 10 | ~25-50 |
| **Total** | **55** | **~104-129/week** |

---

## Daily Workflow (after setup)

1. **Morning:** Check email for 5 new scripts (auto-generated at 7am)
2. **Pick 1:** Choose the best script, mark status as "selected" in Google Sheets
3. **Film:** Record the reel (~30 min)
4. **Post:** Upload to Instagram
5. **After calls:** Fill out the customer intel form (~3 min)
6. **Anytime:** Paste video links or content ideas into `video_inbox` tab (processed every 6 hours)
7. **Everything else:** Runs on autopilot (competitor scraping, video grading, performance tracking, doubling down, monthly analysis, trending research, audience comment tracking)
