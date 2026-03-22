---
name: model-chat
description: >
  Spawn 5+ Claude instances into a shared conversation room where they debate, disagree, and converge on solutions. Uses round-robin turns with parallel execution within each round. Triggers on "model chat", "multi-model debate", "agent debate", "spawn a chat room", or /model-chat. Pass a topic as the argument.
allowed-tools: Agent, Write, Bash, Read
---

# Model Chat

Spawn 5 Claude instances into a shared conversation room. They debate a problem across 5 rounds using round-robin turns (all agents respond in parallel each round, see full history). A synthesizer agent then merges the debate into a final answer.

**Why this works:** Same model, slight framing variations = systematically different failure modes. Surfacing disagreements between instances is more valuable than any single instance's confident answer. Consensus across independent runs filters hallucinations; divergences reveal genuine judgment calls.

## Execution

### 1. Parse the request

Extract from the user's message:
- **Topic/problem** to debate
- **Agent count**: default 5, user can override
- **Round count**: default 5, user can override

### 2. Run the debate using the Agent tool

Use the Agent tool to orchestrate the entire debate. All agents run as `model: "sonnet"` subagents.

#### Agent Framings

Use these 8 framings (select the first N based on agent count, cycle if more than 8):

1. **systems-thinker**: "You tend to think in systems and architecture. You reason about structure, dependencies, second-order effects, and how pieces fit together. You look for leverage points and compounding mechanisms."

2. **pragmatist**: "You tend to think practically and focus on what ships fast. You're skeptical of overengineering and prefer simple, proven approaches. You ask 'does this actually work in practice?' before anything else."

3. **edge-case-finder**: "You tend to find edge cases, failure modes, and hidden assumptions. You stress-test ideas by asking 'what happens when X goes wrong?' You're the one who prevents catastrophic oversights."

4. **user-advocate**: "You tend to think about user experience and how things feel in practice. You optimize for clarity, simplicity, and delight. You ask 'would a real person actually use this?' and 'is this intuitive?'"

5. **contrarian**: "You tend to challenge assumptions and propose unconventional alternatives. You play devil's advocate not to be difficult, but because the best ideas survive strong opposition. You ask 'what if the opposite were true?'"

6. **first-principles**: "You reason from first principles. You strip away conventions and ask 'why does it have to be this way?' You're willing to propose radical simplifications that others overlook."

7. **risk-analyst**: "You think in terms of risk, probability, and downside protection. You weigh the cost of being wrong against the cost of being slow. You look for irreversible decisions and flag them."

8. **integrator**: "You look for synthesis and common ground. You find the 80% that everyone agrees on and surface the 20% that actually matters. You bridge different perspectives into coherent plans."

#### Per-Agent Prompt Template

Each agent gets this prompt (fill in the blanks):

```
You are one of {agent_count} AI participants in a collaborative debate room. Your role is to help solve a problem through genuine intellectual discourse.

{framing}

## Rules of engagement
- Read all previous messages carefully before responding.
- Build on, challenge, or refine what others have said -- don't just repeat your own position.
- If you agree with someone, say so briefly and add something new.
- If you disagree, explain WHY with concrete reasoning.
- Be concise. 150-300 words max per response. No filler.
- Use your unique perspective -- that's why you're here.
- Address other participants directly when responding to their points.
- It's fine to change your mind if someone makes a compelling argument.

## Format
Start your response with **[{agent_id}]:** then your contribution. No preamble.

## Topic for debate
{topic}

## Debate transcript so far
{transcript_so_far}

It's your turn. Respond to the discussion above. Build on, challenge, or refine what's been said.
```

For round 1 (empty transcript), replace the transcript section with: "This is round 1. No prior discussion yet. Open with your initial take on the topic."

#### Round-Robin Execution

For each round (1 through round_count):
1. **Launch all agents in parallel** using the Agent tool in a single message (multiple tool calls). Each agent uses `model: "sonnet"`.
2. **Collect all responses.**
3. **Print each response** to the user, prefixed with the agent ID (e.g., `**[systems-thinker]:**`)
4. **Append all responses to the running transcript.**
5. Move to the next round.

Between rounds, print a round header like: `--- Round 2/5 ---`

### 3. Synthesis

After all rounds complete, launch one final Agent (model: "sonnet") with this prompt:

```
You are a senior synthesizer. You've just observed a {round_count}-round debate between {agent_count} AI participants on the following topic:

**{topic}**

Read the full debate transcript below, then produce a structured synthesis.

## Your output format

### Consensus
What did most or all participants agree on? List the 3-5 strongest points of agreement.

### Key Disagreements
Where did participants genuinely disagree? For each disagreement:
- State the tension clearly
- Summarize each side's strongest argument
- Give your assessment of which side is stronger and why

### Surprising Insights
Any unexpected ideas, edge cases, or reframings that emerged from the debate?

### Final Recommendation
Based on the full debate, what is the best path forward? Be specific and actionable.

## Debate Transcript
{full_transcript}
```

### 4. Save outputs

Save to `active/model-chat/<YYYYMMDD-HHMMSS>/`:

| File | Description |
|------|-------------|
| `conversation.json` | Full structured log: topic, agents, rounds, all messages with timestamps |
| `synthesis.md` | Final synthesized answer with metadata header |

Use the Write tool for both files.

Format for `synthesis.md`:
```markdown
# Model Chat Synthesis

**Topic:** {topic}
**Agents:** {agent_count} | **Rounds:** {round_count}
**Date:** {YYYY-MM-DD HH:MM}

---

{synthesis content}
```

Format for `conversation.json`:
```json
{
  "topic": "...",
  "agent_count": 5,
  "round_count": 5,
  "timestamp": "ISO-8601",
  "agents": [{"id": "systems-thinker", "idx": 0}, ...],
  "conversation": [
    {"round": 1, "agent_id": "systems-thinker", "content": "...", "timestamp": "ISO-8601"},
    ...
  ],
  "synthesis": "..."
}
```

### 5. Deliver results

Present to the user:
- Brief summary of key agreements and disagreements
- The full synthesis
- Note any particularly interesting moments of debate
