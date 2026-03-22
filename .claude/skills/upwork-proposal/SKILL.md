---
name: upwork-proposal
description: Generate a video proposal script, Make.com workflow, and personalized CV text for an Upwork job. Paste the job description and get strategic brainstorm ideas + script + Make.com nodes + application message instantly.
argument-hint: [Upwork job description]
---

# Upwork Video Proposal Skill

## What This Skill Does

Takes a raw Upwork job description and outputs five things:

1. **Strategic Brainstorm** — 2-3 ways to solve their problem, each framed as either "saves time" or "gets more clients"
2. **Emphasis Points** — key details/pain points to highlight during the video
3. **Video Proposal Script** — hook, case study, live solution, and close using Vu's proven format
4. **Make.com Pipeline** — complete node layout (Scenario 1 + Scenario 2) ready to build
5. **CV Text** — personalized three-paragraph application message ready to paste

Output is copy-paste ready for recording, building, or applying.

---

## How to Use

> /upwork-proposal [paste the full job description here]

---

## Output Template

### Section 0: Strategic Brainstorm

Before writing the proposal, brainstorm 2-3 distinct ways to solve their core problem. Frame each around either saving time or getting more clients.

**What to do:**
1. Read the job description and identify the core business problem
2. Generate 2-3 automation angles that solve it
3. For each idea:
   - Tag it as either `[saves time]` or `[gets more clients]`
   - Write 1-2 sentences explaining the mechanism and outcome
   - Be specific — show you understand their business
4. Lead with the strongest idea in your Live Solution script

**Example format:**
> Idea 1 [gets more clients]: Auto-follow-up sequences triggered by missed leads — instead of dropping contacts, every new prospect gets a personalized drip that keeps you top of mind until they're ready to buy.
>
> Idea 2 [saves time]: Automated listing report generation — pull MLS data, format into a PDF, and email to clients weekly without touching it.
>
> Idea 3 [saves time]: AI-generated property descriptions — paste raw specs, get polished listing copy in seconds.

**Why this matters:**
- Shows you understand their business beyond the job post
- Frames value in their language (time/clients)
- Gives you 2-3 angles to choose from when recording the video
- Makes the proposal feel strategic, not generic

---

### Section 1: Key Details to Emphasize

Extract these directly from the job post and list what to focus on during the video:
- Core problem they mention (what keeps them up at night)
- Specific tools they mention (Make.com, n8n, AI, databases, etc.)
- Red flags or constraints (budget, timeline, skill requirements)
- Numbers (volume, frequency, team size)
- Pain points mentioned explicitly ("lost leads", "manual work", "time-consuming")

### Section 2: Video Proposal Script

**Hook:**
> Hey, how's it going — I'm Vu. All I do is build automation systems for businesses. I was just going over your project and wanted to send a quick video because I do exactly [THIS].

- Replace [THIS] with one sentence distilling their core need

**Case Study (throwaway):**
- 1-2 sentences max
- Sound casual, like this is something you've done a hundred times
- Match their industry or use case if possible

**Live Solution (the meat):**
- Bullet-by-bullet walkthrough of exactly what you'd build
- Reference Make.com modules by name
- Use their language from the job post
- Show how you'd solve their specific pain points

**Close:**
> So that's how I'd approach this. My goal with a first project is always to over-deliver — I want you to see the results and immediately fall in love with the system. I prefer long-term partnerships, because it lets me actually learn your business and build systems that compound over time. So if this resonates, shoot me a message with a few times you're available this week and we'll hop on a quick call to map it out.

### Section 3: Make.com Pipeline Nodes

Read the job description and infer the workflow. Output the Make.com nodes needed to solve their specific problem.

**What to do:**
1. Identify the input source(s) — where does the data come from?
2. Identify the processing — what needs to happen to that data?
3. Identify the output — where does it go? Who needs to know?
4. Number each node sequentially and describe what it does

**Example format:**
> 1. [Trigger name] — [what triggers this workflow]
> 2. [Node type] — [what it does]
> 3. [Node type] — [what it does]
> ...etc

**Notes:**
- Only include nodes that are actually needed for this specific job
- Flag any tricky connectors (e.g., WhatsApp needing 360dialog, custom APIs, etc.)
- Include error handling if the job description mentions reliability/failsafe
- Be specific about module names and what each node extracts/processes

### Section 4: CV Text (Personalized Upwork Application Message)

Output a three-paragraph message that Vu can copy-paste directly into the Upwork application.

**Paragraph 1:**
> Hi—confident that I'm the best fit for [XYZ Thing]. Just recorded a 2min video for you on how I'd do it: [LINK]

- Extract [XYZ Thing] from the job description — their core need or what they asked you to build
- [LINK] is a placeholder — Vu will replace with the actual video link

**Paragraph 2:**
> I scaled a service-based brand from scratch to $18K/month in recurring revenue within 6 months, almost entirely through automation. Comfortable with both code and no-code to make it happen.

**Paragraph 3:**
> A little bit about me: I'm an AI developer focused on automation systems that move the needle on revenue and growth. I'm new to Upwork, but I've worked with real businesses across multiple industries and I'm looking to build out my profile with practical work experience. If you'd like specific examples of what I've built, just shout.

**What to do:**
- Output all three paragraphs as a single copy-paste block
- Only customize paragraph 1 with [XYZ Thing] extracted from the job description
- Paragraphs 2 and 3 stay exactly as-is (they're Vu's credibility statements)

---

## Notes

- **Brainstorm ideas** — always tag as `[saves time]` or `[gets more clients]`. Be specific, not generic. Pick the strongest idea for the Live Solution section.
- **Emphasis points** should come directly from the job post — no generic advice
- **Case studies** should match their industry or use case (real estate, restaurants, influencers, etc.) or show similar automation work
- **Script** is always the same structure; customize the details. Lean on the strongest brainstorm idea as your core pitch.
- **Make.com nodes** scale with complexity — simple workflows = 6-7 nodes, complex = 10-12
- **CV Text** paragraphs 2 and 3 are always identical; only customize paragraph 1 with [XYZ Thing] from the job post
- Don't invent tools they didn't mention; stick to what's in the job post
