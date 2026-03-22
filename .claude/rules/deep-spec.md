# Deep Spec Workflow (Always-On)

Every complex task goes through this 5-phase pipeline before delivery. This is the default behavior.

## Phase 1: Reverse Prompting

Before touching anything, ask 5 clarifying questions that would most change your approach.

For each question:
1. State the assumption you'd make if not asked
2. Ask the question
3. Explain why the answer matters

Prioritize by impact. Check the codebase, CLAUDE.md, and decision logs first so you don't ask things already answered.

Wait for answers before proceeding. If the user skips a question, use your default assumption and note it.

## Phase 2: Prompt Contract

Using the user's answers from Phase 1, build a 4-part contract:

```
GOAL: [Quantifiable success metric]

CONSTRAINTS:
- [Hard limits - not negotiable]

FORMAT:
- [Exact output shape - files, structure]

FAILURE (any of these = not done):
- [Conditions that mean the task failed]
```

Present the contract to the user for approval before proceeding. If user requests changes, revise and re-present.

## Phase 3: Plan Mode

Enter plan mode. One agent drafts the implementation plan covering:
- What changes, where, in what order
- Files to create/modify with specific approaches
- Dependencies and sequencing
- How to verify each step

The plan must be concrete enough that another agent could execute it without asking questions.

## Phase 4: Plan Review

Spin up 1-2 sub-agents to review the plan before execution. Each reviewer independently looks for:
- Gaps or missing steps
- Risks and edge cases
- Simpler alternatives missed
- Conflicts with existing code or patterns
- Failure modes not covered by the contract

Incorporate valid feedback into the plan. Present final plan to user for approval.

## Phase 5: Execute Against Contract

Build the solution treating each contract section as a hard requirement. Before delivering, self-verify against every FAILURE condition:

```
Contract status: ALL PASS / X FAILURES

GOAL: [evidence]
CONSTRAINTS: [confirmation]
FORMAT: [confirmation]
FAILURE conditions: [each verified with how]
```

### Re-Plan on Failure

If at any point during execution something goes sideways:
- Tests fail in unexpected ways
- Approach hits a dead end
- Unexpected state or conflicts discovered
- Scope changes or new requirements surface
- Implementation diverges significantly from plan

**Stop executing. Re-enter plan mode.** Revise the plan, run it through 1-2 review agents again, then resume execution. Do not power through a broken plan.

## What Counts as "Complex"

A task is complex (and triggers the full pipeline) if any of these are true:
- Multi-file changes
- Multi-step implementation
- Architectural decisions
- Ambiguous or broad scope
- New features or systems
- Anything where the wrong approach wastes significant time

## Escape Conditions

Skip the full flow when:
- User says "just do it", "skip spec", "trivial", or similar
- Single-line fixes, typos, simple questions, quick lookups
- Follow-up tasks where questions were already answered in the current conversation
- User explicitly invokes a specific skill (e.g., `/code-reviewer`)
- Non-implementation requests (explanations, reviews, searches)

## Partial Escapes

- **"skip questions"** - Jump straight to Phase 2 (prompt contract) without asking questions
- **"skip contract"** - Ask questions (Phase 1) then go straight to Phase 3 (plan mode)
- **"skip plan"** - Run Phases 1-2, then execute directly without plan mode
