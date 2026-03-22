---
name: deploy
description: "Use when someone asks to deploy a proposal to Vercel, push to Vercel, or make a proposal live. Triggers on 'deploy', 'push to vercel', 'make it live', or /deploy."
argument-hint: "[client-name]"
user-invocable: true
---

# Deploy Proposal to Vercel

Deploys a proposal from `projects/proposals/[client-name]/` to Vercel production. One command, one URL out.

## Step 1: Resolve the Proposal Path

Parse `$ARGUMENTS` to find the proposal:

- If argument is a full path like `projects/proposals/marcus-rivera`, use it directly
- If argument is just a client name like `marcus-rivera`, resolve to `projects/proposals/marcus-rivera/`
- Extract the client folder name (last path segment) for the Vercel project name

## Step 2: Validate

Check that `projects/proposals/[client]/index.html` exists using the Glob tool.

If missing, stop and print:
```
No index.html found at projects/proposals/[client]/. Generate one with /web-proposal first.
```

## Step 3: Auth Check

Run `npx vercel whoami` via Bash.

If it fails or returns an error, stop and print:
```
Not logged in to Vercel. Run `npx vercel login` then retry.
```

## Step 4: Derive Project Name

Project name = `mismoi-[client-folder-name]`

Example: `projects/proposals/marcus-rivera/` -> `mismoi-marcus-rivera`

Rules:
- Lowercase everything
- Replace spaces with hyphens
- Strip any date prefix patterns (e.g., `2026-03-20-client-name` -> `client-name`)

## Step 5: Deploy

Run from the proposal directory:

```bash
cd projects/proposals/[client]/ && npx vercel --yes --name [project-name] --prod
```

Capture the full output. The production URL will be in the output.

## Step 6: Manage .gitignore

Check if the proposal folder has a `.gitignore` file. If it does, check if `.vercel` is already listed. If not, append `.vercel` to the file.

If no `.gitignore` exists in the proposal folder, create one with:
```
.vercel
```

This matches the existing pattern (see `projects/proposals/moe-shaheen/.gitignore`).

## Step 7: Output

Print exactly:
```
Deploying mismoi-[client] to production...
Live: [extracted URL]
Verify the page before sending to client.
```

If deploy failed, print the raw Vercel error output. Do not wrap or interpret it.

## Notes

- Always use `--yes` to suppress interactive prompts (Claude Code can't respond to stdin)
- Always use `--prod` (proposals are static HTML, no staging needed)
- Always use `--name` to ensure stable, predictable URLs across deploys
- The Vercel CLI creates `.vercel/project.json` locally on first deploy -- this is a cache, not source of truth
- Project name (`mismoi-[client]`) is the source of truth for URL stability
