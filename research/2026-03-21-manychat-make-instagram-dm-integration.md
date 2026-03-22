# ManyChat + Make.com: Reading Instagram DMs — What's Actually Possible

**Topic:** Can Make.com read Instagram DM conversations through ManyChat's native integration or API?
**Date:** 2026-03-21
**Confidence:** High

---

## 1. EXECUTIVE SUMMARY

Make.com has a native ManyChat module. It can receive Instagram DM data in real-time (subscriber ID, username, and the single most recent message text via `last_input_text`) but only at the moment a user triggers a specific flow inside ManyChat. There is no way to pull DM history, poll for new conversations, or read messages outside of a ManyChat-triggered webhook event.

The ManyChat API has no endpoint for retrieving conversation history. This is a documented, long-standing gap confirmed by ManyChat community staff. The only workaround is to capture and forward each message to an external system (e.g., Make.com via webhook) as the conversation happens, effectively building your own message log in real-time. Retroactive read access to DMs does not exist through any current official path.

---

## 2. KEY TECHNICAL FINDINGS

- **[Tier 2 — Make.com Apps Documentation]** ManyChat has a native module in Make.com. It is NOT a polling trigger. The "Watch Incoming Data" trigger fires only when a ManyChat flow explicitly calls a Make webhook. Make does not independently watch for new DMs.

- **[Tier 2 — Make.com Apps Documentation]** Available Make modules are: Watch Incoming Data (trigger), Get Subscriber's Info, Send a Text, Send a Text with Image/File, Send a Flow, Send Messages (batch), Manage Tags, Perform an Action, Set a Custom Field, Find Subscribers by Custom Field. No "read conversation" or "list messages" module exists.

- **[Tier 1 — ManyChat Dynamic Block Docs / Official GitHub]** The webhook payload ManyChat sends includes: `id`, `first_name`, `last_name`, `name`, `gender`, `profile_pic`, `locale`, `language`, `timezone`, `live_chat_url`, `last_input_text`, `last_growth_tool`, `subscribed`, `last_interaction`, `last_seen`, `custom_fields`. The `last_input_text` field holds the subscriber's single most recent message text. No message history array is included.

- **[Tier 2 — ManyChat Community, confirmed by community expert Gustavo Boregio]** The ManyChat API has no endpoint to retrieve full conversation history. The Swagger docs at `api.manychat.com` expose subscriber profile endpoints and send-action endpoints only. A feature request for conversation retrieval (posted June 2025, 15 upvotes) remains open with no official response.

- **[Tier 2 — ManyChat Community / Make Community]** A working pattern used in production: ManyChat flow captures the incoming DM, calls a Make webhook with `last_input_text` + subscriber ID, Make processes it (e.g., sends to an LLM), Make calls ManyChat API back to deliver the response. This is how AI chatbot integrations are built today.

---

## 3. COMPETING APPROACHES

**Approach A: Native Make.com ManyChat module**
- Trade-offs: Easiest setup, no custom HTTP calls, limited to the fixed subscriber data payload
- Best for: Simple automations (tag subscriber, log to sheet, send to CRM)
- Risk: The "Watch Incoming Data" trigger requires a user to hit a specific button/flow step inside ManyChat — it does not fire on every DM automatically unless every entry point in your bot is wired to it

**Approach B: ManyChat Flow + External Request to Make webhook**
- Trade-offs: Slightly more setup inside ManyChat flow builder, but gives you full control over what data you pass (including `last_input_text` and custom fields)
- Best for: AI reply systems, logging all messages to a database, complex multi-step processing
- Risk: You must add the webhook call to every relevant flow step; messages outside a flow (e.g., a DM that doesn't trigger any automation) will not fire the webhook

**Approach C: ManyChat API via Make HTTP module**
- Trade-offs: More flexible, can take actions on any subscriber by ID, no UI dependency
- Best for: Sending messages, updating custom fields, finding subscribers by field value
- Risk: Still cannot read messages or conversation history — the API is write/update-oriented for messaging

---

## 4. PERFORMANCE / SCALABILITY REALITY

- ManyChat enforces a **200 DM/hour rate limit** on Instagram before automation stops responding.
- Instagram's 24-hour messaging window means automated replies only work within 24 hours of the last user interaction. After that, outbound messages are blocked unless the user re-engages or you use a paid message tag.
- The webhook delivery from ManyChat to Make is near real-time (1-8 seconds per the Instagram Messenger API webhook spec).
- No official published data on Make.com module throughput for ManyChat at high volume. At scale, the bottleneck would be Instagram's API limits, not Make's execution engine.
- ManyChat Pro account is required to access the API token needed to connect to Make.

---

## 5. IMPLEMENTATION RISKS

**What can go wrong:**
- If a user sends a DM that does not match any ManyChat keyword trigger or flow, the message is never forwarded to Make. You have a blind spot for unmatched messages unless you set up a "Default Reply" flow that also fires the webhook.
- `last_input_text` only captures the most recent text. If a user sends multiple messages before the bot responds, only the last one is captured per webhook fire.
- Multiline Instagram messages (using Shift+Enter) have a reported bug where they do not trigger ManyChat webhooks — confirmed in the ManyChat community forum.
- Make.com scenario execution is billed per operation. A high-volume DM system generates real cost at scale.
- ManyChat requires continuous Pro subscription. If the account lapses, the Make connection breaks.

**Transition risks:**
- Building a full conversation history store requires capturing every message at flow time. If you deploy this after your bot already has active conversations, all prior history is lost — no backfill is possible.

---

## 6. WHERE RESEARCH IS UNCERTAIN

- The exact Swagger endpoint list at `api.manychat.com` could not be fully rendered (Swagger UI loads dynamically). The finding that no conversation-read endpoint exists is confirmed by community expert statements and feature request evidence, not direct endpoint enumeration. Low risk of being wrong given multiple corroborating sources.
- It is unclear whether ManyChat's "Default Reply" flow reliably fires for every unmatched Instagram DM or whether there are edge cases (e.g., sticker messages, voice notes, reels shares) where no trigger fires at all. The troubleshooting docs suggest some message types are unsupported.
- The `CHATICMEDIA` workaround mentioned in one community post was not researched. It may offer additional capability, but there is no corroborating evidence of what it actually does.

---

## 7. ACTIONABLE RECOMMENDATION

**To read/capture Instagram DMs in Make.com via ManyChat:**

Use the ManyChat Flow + External Request approach (Approach B). Specifically:

1. In every ManyChat flow entry point (keyword triggers, Default Reply, Story Reply, etc.), add an "External Request" action that posts to a Make webhook. Include `{{last_input_text}}`, `{{user_id}}`, `{{first_name}}`, and any relevant custom fields in the payload.
2. In Make, use a custom webhook (not the native ManyChat "Watch Incoming Data" module) to receive this payload — it gives you more control over the data structure.
3. Process in Make (AI, logging, routing), then respond by calling the ManyChat API via Make's HTTP module with the subscriber ID and your reply.
4. Store each message + response in a Google Sheet or Airtable if you need conversation history, because ManyChat will not store it retrievably for you.

Do NOT expect to read DMs retroactively or poll for new conversations. The architecture is event-driven only: ManyChat pushes to Make when a user hits a flow, not the other way around.

---

## 8. CONFIDENCE LEVEL

**High**

Multiple corroborating Tier 1-2 sources (Make's official app docs, ManyChat's official dynamic block docs on GitHub, confirmed community expert statements, active feature request with staff non-response). The one uncertain area (exact Swagger endpoint list) is a minor gap because the absence of a conversation-read endpoint is confirmed by independent community evidence rather than relying solely on the inaccessible Swagger UI.
