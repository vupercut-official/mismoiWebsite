# Model Chat Synthesis

**Topic:** Design a /deploy skill for Claude Code that deploys HTML proposals to Vercel
**Agents:** 5 | **Rounds:** 5
**Date:** 2026-03-21

---

### Consensus

1. **Go direct to prod, no preview step.** Preview is redundant since the proposal was reviewed during `/web-proposal`. Static HTML has near-zero failure rate.

2. **Non-interactive deploy via flags.** `--yes --name mismoi-[client] --prod` suppresses all interactive prompts that would hang Claude Code's subprocess.

3. **Auth check first.** `vercel whoami` before deploy. Fail fast with clear error rather than hanging mid-deploy.

4. **`.vercel/` belongs in `.gitignore`.** Per-proposal `.gitignore` matching existing moe-shaheen pattern. `project.json` is local cache, not source of truth.

5. **Skill is justified over a bash alias.** Earns its existence through: state management, .gitignore side effects, name derivation logic, and clean output formatting.

### Key Disagreements

**1. URL continuity: commit `project.json` vs. derive name from folder**

- Side A (systems-thinker, edge-case-finder): Commit `project.json` to guarantee project ID persistence.
- Side B (user-advocate, pragmatist): Derive name from folder every time, gitignore all `.vercel/`. Name is the source of truth.
- **Resolution:** Side B wins IF `--name` is idempotent (Vercel matches by project name within scope). Pre-ship gate: 2-minute manual test to verify.

**2. Preview step vs. no preview**

- Side A (user-advocate initially): Preview-first gives a URL to sanity-check before prod.
- Side B (pragmatist, contrarian, systems-thinker): Review happens upstream. Preview doubles deploy time for no benefit.
- **Resolution:** Side B. Print "verify before sending" as reminder instead of blocking preview step.

### Surprising Insights

- **The real risk isn't deployment -- it's URL continuity.** A client's proposal URL changing silently on redeploy is the worst failure mode. Name derivation logic must be stable across machines and sessions.

- **Log the URL somewhere persistent.** Deployed URLs live only in terminal output and get lost. Writing to `decisions/log.md` or per-project `deploy-url.txt` prevents support risk.

### Final Recommendation

Build with: auth check -> validate index.html -> derive name from folder -> deploy `--yes --name --prod` -> manage .gitignore -> print URL. Gate shipping on `--name` idempotency test. Ship v1 happy path, harden edge cases in v2.
