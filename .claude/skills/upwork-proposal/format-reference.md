# Format Reference for Upwork Proposals

## Case Study Bank

These are industry-matched throwaway case studies. Pick the one closest to the job post.

### Lead Routing / CRM / Sales

"Built something similar for a real estate team — every lead from multiple channels, auto-scored, categorized, routed to the right person. Same concept, different industry."

### Influencer Marketing / Growth

"Did this for an Instagram influencer — DMs coming in from brands, automatically sorted by budget and relevance, sent to the right team member. Works the same way."

### Restaurant / Booking

"Built this for a restaurant group — reservation requests, special requests, dietary restrictions all auto-categorized and sent to the right manager. Same principle."

### E-commerce / Support

"Implemented something like this for an e-com brand — customer emails from multiple channels, sorted into support, returns, sales, and general. All automated."

### Project Management / Client Services

"Used this pattern for a consulting firm — client requests auto-categorized into billing, project-related, general inquiry, escalated to the right person. Very similar."

---

## Hook Formula

```
Hey, how's it going — I'm Vu. All I do is build automation systems for businesses. I was just going over your project and wanted to send a quick video because I do exactly [THIS].
```

### Examples of [THIS]:

- "automated lead intake and routing without manual touch"
- "AI-powered message classification and team routing"
- "end-to-end lead scoring and assignment pipelines"
- "multi-channel inquiry intake with smart categorization"
- "automated workflow for incoming customer requests"

Pick the one closest to the job post language.

---

## Live Solution Template

Structure:
1. **Trigger** — where messages/data come from
2. **AI Analysis** — what you extract/analyze
3. **Router** — where it goes based on output
4. **Notification** — who gets alerted
5. **Storage** — where it's logged
6. **Error handling** — what happens when something breaks

### Example pattern:

```
- Telegram and WhatsApp both feed into one intake trigger node
- That message hits an AI node — Claude or GPT — with a structured prompt that extracts: [extraction logic specific to their job]
- A router node then fires the right notification — Slack or email — to the right team member with a summary
- At the same time, every inquiry writes to a database — Airtable or Supabase — timestamped and categorized
- Error handling runs on a parallel branch. If the AI call fails or a webhook drops, it logs it and alerts you. Nothing fails silently.
```

Always customize the extraction logic and team members to match their job post.

---

## Make.com Module Reference

Use these when inferring the pipeline from the job description:

**Triggers:**
- Telegram - Watch Messages
- WhatsApp - Watch Messages (note: needs 360dialog connector)
- Google Forms - Watch Responses
- Email - Watch Mailbox
- Slack - Watch Messages
- Webhook
- Schedule / Timer

**Data Transformation:**
- Set (normalize/transform data)
- JSON - Parse JSON
- Text - Aggregator
- Router (branch by condition)

**AI/Processing:**
- OpenAI - Create Completion / Chat Completion
- HTTP - Make a Request (for Claude API or custom AI calls)
- Gemini - Create Message

**Notifications:**
- Slack - Create Message
- Gmail - Send Email
- Twilio - Send SMS
- Microsoft Teams - Create Message
- Discord - Create Message

**Database/Storage:**
- Airtable - Create Record
- Google Sheets - Add Row
- Supabase - Insert Row
- Notion - Create Page
- MongoDB - Create Document

**Error Handling:**
- Error Handler (route)
- Slack/Email alert
- Log to database with error details

---

## JSON Output Template for AI Analysis

Use when extracting from messages:

```json
{
  "source": "telegram/whatsapp/email/form",
  "sender_id": "string",
  "message_text": "string",
  "timestamp": "ISO-8601",
  "category": "sales/support/booking/general/urgent",
  "urgency": "high/medium/low",
  "conversion_score": 0.0-1.0,
  "summary": "one-line summary",
  "action_required_by": "team_name",
  "confidence": 0.0-1.0
}
```

Customize the categories and fields to match the job post.

---

## Emphasis Points Checklist

Pull these from the job post:

- [ ] Pain point: what problem are they solving?
- [ ] Volume: how many inquiries/requests per day/week?
- [ ] Tools mentioned: Make.com, n8n, Zapier, AI, etc.
- [ ] Team size: how many people need to see what?
- [ ] Current bottleneck: what's manual right now?
- [ ] Failure mode: what happens when something breaks?
- [ ] Reporting: do they care about tracking/metrics?
- [ ] Escalation: are there urgent vs normal requests?
- [ ] Timeline: when do they need it done?

Focus the video on 3-4 of these. Spend 20-30 seconds on each.
