---
name: web-proposal
description: "Generate a single-file HTML proposal page for any client from a sales call transcript. Uses the mismoi.com design system (cream/moss zen aesthetic). Clone-and-replace template. Triggers on 'web proposal', 'proposal page', 'client proposal', 'generate proposal', or /web-proposal."
argument-hint: [paste sales call transcript]
user-invocable: true
---

# Web Proposal Generator

Generates a single-file HTML proposal from a sales call transcript. Same mismoi.com design every time. Only the content changes. No build step, no React, no npm.

## Step 1: Parse the Sales Call

Read the provided sales call transcript. Extract:

- **Client name** (full name)
- **Company / business** and what they do
- **Niche / industry**
- **3 pain points** (map to Problem cards with red cost tags)
- **3 solution layers** (what you're building, 3 bullets max per card)
- **Key metrics** (4 stats for the summary card)
- **Timeline** (4 steps: connect, build, test, optimize)
- **FAQ topics** (6 questions the client would have)
- **Urgency signal** (what they lose by waiting)

Present a summary of what you extracted before proceeding.

## Step 2: Ask for Gaps

Ask the user ONLY for:

- **Setup price** (one-time fee)
- **Monthly price** (retainer)
- **Stripe payment link** (or use `https://stripe.com/PLACEHOLDER`)

Do NOT ask about:
- Design, colors, fonts, animations (always the same)
- Section structure (always the same 10 sections)
- Guarantee wording (generate from context)
- Solution framing (extract from transcript)
- Hero headline (generate from context)

## Step 3: Generate the Proposal

1. Read `.claude/skills/web-proposal/template.md`
2. Replace ALL `REPLACE_` placeholders with client content
3. Write to `projects/proposals/[client-name-lowercase]/index.html`
4. Open in browser to verify

### Placeholder Reference

**Global:**
- `REPLACE_CLIENT_NAME` -- full name
- `REPLACE_MONTH_YEAR` -- e.g. "March 2026"
- `REPLACE_STRIPE_LINK` -- Stripe URL or placeholder
- `REPLACE_PAGE_TITLE` -- e.g. "Lead Qualification System"
- `REPLACE_META_DESCRIPTION` -- short description for meta tag

**Hero:**
- `REPLACE_HERO_HEADLINE` -- first line (e.g. "Your Leads,")
- `REPLACE_HERO_DRAMA` -- italic serif line (e.g. "Never Missed.")
- `REPLACE_HERO_BODY` -- 2-3 sentence summary of the system
- `REPLACE_HERO_CTA` -- primary button text (e.g. "See the System")

**Summary:**
- `REPLACE_SUMMARY_HEADING` -- e.g. "200 leads a month.<br />Two people. Zero systems."
- `REPLACE_SUMMARY_GREETING` -- e.g. "Hey Mohammad,"
- `REPLACE_SUMMARY_P1`, `REPLACE_SUMMARY_P2`, `REPLACE_SUMMARY_P3` -- 3 paragraphs
- `REPLACE_STAT_1_VALUE`, `REPLACE_STAT_1_LABEL` (through STAT_4) -- 4 stats, last one uses moss color

**Problem (dark section, 3 cards):**
- `REPLACE_PROBLEM_HEADING` -- e.g. "Three things costing you<br />members right now."
- `REPLACE_PROBLEM_1_NUM` -- "01", `REPLACE_PROBLEM_1_TAG` -- red tag (e.g. "~$2-3K/mo lost")
- `REPLACE_PROBLEM_1_TITLE`, `REPLACE_PROBLEM_1_BODY` (through PROBLEM_3)

**Solution (3 cards, 3 bullets max each):**
- `REPLACE_SOLUTION_HEADING` -- e.g. "Three layers. Fully automated."
- `REPLACE_SOLUTION_INTRO` -- subtitle paragraph
- `REPLACE_SOLUTION_1_TAG` -- green tag (e.g. "+100% lead capture")
- `REPLACE_SOLUTION_1_TITLE`, `REPLACE_SOLUTION_1_SUBTITLE` -- flow description
- `REPLACE_SOLUTION_1_BULLET_1`, `_BULLET_2`, `_BULLET_3` (through SOLUTION_3)

**Timeline (4 step cards):**
- `REPLACE_TIMELINE_HEADING`
- `REPLACE_STEP_1_TITLE`, `REPLACE_STEP_1_BODY` (through STEP_4)

**Investment (2 pricing cards + guarantee):**
- `REPLACE_SETUP_PRICE` -- e.g. "$750"
- `REPLACE_SETUP_ITEM_1` through `REPLACE_SETUP_ITEM_8` -- 8 line items
- `REPLACE_MONTHLY_PRICE` -- e.g. "$197"
- `REPLACE_MONTHLY_ITEM_1` through `REPLACE_MONTHLY_ITEM_6` -- 6 line items
- `REPLACE_API_COST_NOTE` -- e.g. "API costs are client-side: ~$10-16/month..."
- `REPLACE_GUARANTEE_TEXT` -- full guarantee statement

**FAQ (6 cards in 2-column grid):**
- `REPLACE_FAQ_1_Q`, `REPLACE_FAQ_1_A` (through FAQ_6)

**CTA (dark card):**
- `REPLACE_CTA_HEADING` -- e.g. "Ready to stop<br />losing leads?"
- `REPLACE_NEXT_STEP_1` through `REPLACE_NEXT_STEP_6`
- `REPLACE_URGENCY_TEXT` -- why waiting costs money

### Rules

- Every `REPLACE_` value must be filled. Grep for `REPLACE_` after generating -- if any remain, fix immediately.
- Solution cards: exactly 3 bullet points per card. No more.
- Problem cards: red tags should quantify the loss (dollars, percentages, time).
- Solution tags: green tags should quantify the gain.
- Stats: last stat (STAT_4) renders in moss green as the accent stat.
- FAQ cards stretch to match row height (h-full on card-shell and card-core).
- All section paddings are `py-[160px] md:py-[288px]`.

### Output

Single file at `projects/proposals/[client-name-lowercase]/index.html`. No build step. Opens directly in browser.

## Notes

- Design is the mismoi.com zen aesthetic: cream background, moss green accents, charcoal text, Outfit + Noto Serif JP fonts
- All animations are CSS + vanilla JS (IntersectionObserver for fade-up, canvas dot grid in hero)
- Tailwind CSS loaded via CDN (no build step)
- Footer always includes Mismoi branding
- To deploy: run `/deploy [client-name]` after generating
