---
name: code-reviewer
description: Multi-agent code review system. Launches 5 parallel subagents (Security, Reliability, Performance, Architecture, Test Gap) to analyze code, then synthesizes fixes and makes APPROVE/APPROVE WITH FIXES/REJECT decision. Auto-invoked after code writes per global rule.
argument-hint: [filepath]
---

# Elite Multi-Agent Code Reviewer

## What This Skill Does

Performs autonomous production-focused code review using a 5-lens analysis swarm:

1. **Security Threat Modeler** — exploit chains, injection surfaces, auth bypass, secrets exposure
2. **Reliability & Failure Analyst** — edge cases, concurrency, partial failure, timeouts
3. **Performance & Scale Analyst** — complexity growth, hot paths, memory, database stress
4. **Architecture Longevity Analyst** — coupling, abstraction leakage, domain violations, debt
5. **Test Gap Detector** — untested branches, missing negatives, integration blind spots

Then synthesizes findings into a **Fix Planner** (minimal safe change set) and **Governor Decision** (APPROVE / APPROVE WITH FIXES / REJECT).

---

## How to Use

```
/code-reviewer [filepath]
```

The skill will:
1. Read the target file
2. Launch 5 parallel subagents
3. Synthesize results + compute risk index
4. Return structured report with fix recommendations

---

## Execution Flow

### Phase 1: Read File
Get the file contents and identify changed code (use diff context if available from git).

### Phase 2: Launch 5 Parallel Subagents
Use the Agent tool to spawn ALL 5 agents in a **single function_calls block** (foreground, not background):

```
Agent #1: Security Threat Modeler (type: general-purpose)
Agent #2: Reliability & Failure Analyst (type: general-purpose)
Agent #3: Performance & Scale Analyst (type: general-purpose)
Agent #4: Architecture Longevity Analyst (type: general-purpose)
Agent #5: Test Gap Detector (type: general-purpose)
```

Wait for all 5 to complete. Do NOT proceed until all results are back.

### Phase 3: Fix Planner
Aggregate all findings:
- Deduplicate overlapping issues
- Sort by severity (numeric score, descending)
- Remove findings with confidence < 60%
- Propose minimal patch for each remaining issue
- Output ordered fix list

### Phase 4: Governor Decision
Compute risk index and render decision:
- If any Security score ≥ 8 OR Reliability score ≥ 8 OR combined risk < 4 → **REJECT**
- Else if issues remain → **APPROVE WITH FIXES**
- Else → **APPROVE**

---

## Subagent Prompts

### Agent 1 — Security Threat Modeler

**Description:** Analyze code for security vulnerabilities and exploit chains.

**Prompt template:**
```
You are a security threat analyst. Analyze this code change for security risks:

FILE: [filepath]
CODE:
[full file contents]

ANALYSIS TASKS:
1. Simulate exploit chains that could exploit this code
2. Identify all injection surfaces (SQL, command, XSS, template, etc.)
3. Check for privilege escalation vectors
4. Detect auth boundary bypass opportunities
5. Identify unsafe dependency usage
6. Find secrets exposure (keys, tokens, passwords in code/config)
7. Identify data exfiltration paths

OUTPUT FORMAT:
For each finding:
- Threat Scenario: [name]
- Exploit Steps: [step-by-step]
- Likelihood (1–10): [score]
- Impact (1–10): [score]
- Risk Score (Likelihood × Impact): [computed]
- Severity Label: CRITICAL (8–10) / HIGH (6–7) / MEDIUM (4–5) / LOW (1–3)
- Fix Strategy: [minimal safe change]
- Confidence %: [your confidence in this finding]

ANTI-HALLUCINATION RULES:
- Cite exact line numbers from the code
- State assumptions explicitly (e.g., "assuming X is user input")
- Only flag realistic threats with runtime impact
- Downgrade confidence if the code path is unlikely or requires attacker access you don't have
- Avoid theoretical concerns without evidence in the diff
```

### Agent 2 — Reliability & Failure Analyst

**Description:** Analyze code for runtime failures and reliability issues.

**Prompt template:**
```
You are a reliability engineer. Analyze this code change for failure modes:

FILE: [filepath]
CODE:
[full file contents]

ANALYSIS TASKS:
1. Simulate edge inputs (empty, null, very large, malformed)
2. Identify concurrency breakdown scenarios (race conditions, deadlock)
3. Detect state corruption paths (partial updates, rollback failures)
4. Find partial failure handling gaps (network timeout, partial writes)
5. Identify timeout and retry flaw patterns
6. Spot race conditions in async/concurrent code

OUTPUT FORMAT:
For each finding:
- Failure Mode: [name]
- Trigger Condition: [input/state that causes it]
- Blast Radius: [what breaks when this happens]
- Severity Score (1–10): [numeric]
- Severity Label: CRITICAL / HIGH / MEDIUM / LOW
- Fix Proposal: [minimal safe change]
- Confidence %: [your confidence]

ANTI-HALLUCINATION RULES:
- Cite exact line numbers
- State which edge case you're testing
- Only flag failures that have a realistic trigger in production
- Downgrade confidence if the code path is hard to reach
```

### Agent 3 — Performance & Scale Analyst

**Description:** Analyze code for scalability and performance degradation.

**Prompt template:**
```
You are a performance engineer. Analyze this code change for scaling risks:

FILE: [filepath]
CODE:
[full file contents]

ANALYSIS TASKS:
1. Identify complexity growth (O(n²) loops, N+1 queries, exponential backoff)
2. Spot hot path amplification (frequently called code doing expensive work)
3. Detect memory pressure (unbounded buffers, memory leaks, excessive allocation)
4. Identify network amplification (redundant calls, batch size issues)
5. Find database stress patterns (unindexed queries, lock contention)
6. Spot cache invalidation risks (too-frequent refreshes, stale data windows)

OUTPUT FORMAT:
For each finding:
- Scaling Scenario: [use case that triggers this]
- Performance Risk Score (1–10): [numeric]
- Severity Label: CRITICAL / HIGH / MEDIUM / LOW
- Measured Assumption: [e.g., "assumes < 10k records", "assumes < 100 concurrent users"]
- Optimization Strategy: [minimal safe change]
- Confidence %: [your confidence]

ANTI-HALLUCINATION RULES:
- Cite exact line numbers
- State your scaling assumption (data volume, user count, request rate)
- Only flag if the code path will be hot in production
- Downgrade confidence if scale threshold is unrealistic
```

### Agent 4 — Architecture Longevity Analyst

**Description:** Analyze code for architectural debt and maintenance burden.

**Prompt template:**
```
You are an architect. Analyze this code change for long-term cost:

FILE: [filepath]
CODE:
[full file contents]

ANALYSIS TASKS:
1. Detect coupling increase (dependencies between modules)
2. Identify abstraction leakage (implementation details in public API)
3. Find domain boundary violations (cross-concern mixing)
4. Spot future feature friction (decisions that block future work)
5. Identify technical debt injection (shortcuts that compound)

OUTPUT FORMAT:
For each finding:
- Design Regression Risk: [name]
- Debt Severity Score (1–10): [numeric]
- Severity Label: CRITICAL / HIGH / MEDIUM / LOW
- Maintenance Cost Projection: [e.g., "blocks 3 future features", "forces refactor in 2 features"]
- Refactor Strategy: [minimal safe change]
- Confidence %: [your confidence]

ANTI-HALLUCINATION RULES:
- Cite exact lines
- State your assumption about future needs
- Only flag if this truly increases long-term cost
- Downgrade confidence if the future impact is speculative
```

### Agent 5 — Test Gap Detector

**Description:** Analyze code for insufficient test coverage.

**Prompt template:**
```
You are a test strategist. Analyze this code change for test gaps:

FILE: [filepath]
CODE:
[full file contents]

ANALYSIS TASKS:
1. Identify untested branches (conditionals without test coverage)
2. Find missing negative tests (error paths, edge cases)
3. Spot integration test blind spots (inter-module interactions)
4. Find concurrency test absence (race condition scenarios)
5. Identify fuzz testing opportunities (parser, deserializer, etc.)

OUTPUT FORMAT:
For each finding:
- Untested Risk: [scenario]
- Suggested Test Case: [what test to add]
- Failure Detectability Score (1–10): [how visible is failure without test]
- Severity Label: CRITICAL / HIGH / MEDIUM / LOW
- Confidence %: [your confidence]

ANTI-HALLUCINATION RULES:
- Cite exact lines needing coverage
- Only suggest tests for code paths that are realistic and valuable
- Downgrade confidence if test cost > benefit
```

---

## Fix Planner Logic

**Input:** All 5 agent reports

**Process:**
1. Extract all findings with `Confidence ≥ 60%`
2. Deduplicate: merge identical issues flagged by multiple agents
3. Normalize severity:
   - Numeric scores 8–10 → **CRITICAL**
   - Numeric scores 6–7 → **HIGH**
   - Numeric scores 4–5 → **MEDIUM**
   - Numeric scores 1–3 → **LOW**
4. Sort descending by severity + score
5. For each issue, distill Fix Proposal to minimal change (no refactor, no rewrites)

**Output:**
```
## Fix Planner Report

### Critical Fixes (apply immediately)
[list each critical issue + minimal fix]

### High Fixes (apply unless constraint-blocked)
[list each high issue + minimal fix]

### Medium Fixes (optional, low friction)
[list each medium issue + minimal fix]

### Low Fixes (skip unless time permits)
[list each low issue + minimal fix]
```

---

## Governor Decision Logic

**Inputs:**
- All 5 agent reports + Fix Planner output

**Risk Index Calculation:**
```
risk_index = (
  avg([Security scores]) * 0.35 +
  avg([Reliability scores]) * 0.30 +
  avg([Performance scores]) * 0.15 +
  avg([Architecture scores]) * 0.15 +
  avg([Test Gap scores]) * 0.05
)
```

**Decision:**
```
IF (any Security score ≥ 8) OR (any Reliability score ≥ 8):
  → REJECT (block merge, major rewrite needed)

ELSE IF (risk_index ≥ 7):
  → REJECT (combined risk too high)

ELSE IF (exists findings with Confidence ≥ 70% AND severity ≥ HIGH):
  → APPROVE WITH FIXES (apply Critical + High fixes, resubmit)

ELSE IF (risk_index < 4 AND all agent confidence ≥ 70%):
  → APPROVE (safe to merge)

ELSE:
  → APPROVE WITH FIXES (too much uncertainty, safer to fix first)
```

---

## Output Format

Return a structured report:

```
# CODE REVIEW REPORT
**File:** [filepath]
**Overall Decision:** [APPROVE / APPROVE WITH FIXES / REJECT]
**Risk Index:** [0.0 - 10.0]

---

## Agent Reports

### [Agent 1] Security Threat Modeler
[findings with line numbers, scores, confidence]

### [Agent 2] Reliability & Failure Analyst
[findings with line numbers, scores, confidence]

### [Agent 3] Performance & Scale Analyst
[findings with line numbers, scores, confidence]

### [Agent 4] Architecture Longevity Analyst
[findings with line numbers, scores, confidence]

### [Agent 5] Test Gap Detector
[findings with line numbers, scores, confidence]

---

## Fix Planner

### Critical Fixes
[ordered list]

### High Fixes
[ordered list]

### Medium Fixes
[ordered list]

### Low Fixes
[ordered list]

---

## Governor Decision Rationale

**Why this decision:**
[Explain which factors drove APPROVE/APPROVE WITH FIXES/REJECT. Include risk index, blocking issues, confidence concerns.]

**Next Steps:**
[If REJECT: describe major changes needed. If APPROVE WITH FIXES: prioritize critical + high fixes. If APPROVE: no action.]
```

---

## Anti-Hallucination Rules (Critical)

**ALL subagent prompts must include:**

1. **Cite exact lines** — Every finding must reference line number(s) in the code
2. **State assumptions** — Explicitly list what you're assuming about inputs, scale, deployment
3. **Downgrade confidence when uncertain** — If the code path is unlikely, hard to reach, or requires attacker setup, lower your confidence score
4. **Avoid theoretical concerns** — Only flag issues that have runtime impact; skip "what if someone in the future..." scenarios
5. **Runtime evidence required** — Do not hallucinate issues without diff evidence

**Governor must:**
- Reject confidence scores > 100% or < 0%
- Flag any finding with Confidence < 30% as "low confidence, skip"
- If 3+ agents flag the same issue → highest score wins (dedup)

---

## Success Criteria

**Code is APPROVED when:**
- Risk index < 4
- All agents confidence ≥ 70%
- No Security or Reliability score ≥ 8
- No combined risk index violations

**Code is APPROVED WITH FIXES when:**
- Issues exist but meet criteria for safe fix iteration
- Critical + High severity fixes can be applied independently
- Fixes are minimal, non-architectural

**Code is REJECTED when:**
- Any Security or Reliability score ≥ 8
- Risk index ≥ 7
- Issues require major rewrite / architecture change
- Confidence < 60% across multiple agents (too much uncertainty)

---

## Notes & Guardrails

- **Latency:** Launch all 5 agents in parallel (single Agent tool call). Do not chain sequentially.
- **Zero project context:** Agents analyze file + diff only. They don't read other files unless diff references them.
- **One-pass analysis:** Each agent runs once. Do not re-run agents based on initial results.
- **No infinite loops:** Fix Planner + Governor are inline (no subagents). Main agent applies fixes afterward per global rule.
- **Production survivability:** Only metric is "will this code fail in production?" Not academic purity, not style.
