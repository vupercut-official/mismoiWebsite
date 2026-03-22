# Decision Log

Append-only. When a meaningful decision is made, log it here.

Format: [YYYY-MM-DD] DECISION: ... | REASONING: ... | CONTEXT: ...

---

[2026-03-11] DECISION: Created 10 website variations for Viet Fire Kitchen using exact design tokens from Sweetgreen and CAVA templates | REASONING: Provides client with diverse, pixel-perfect design options adapted to their brand (red, beige, cream, white). Sweetgreen pattern = editorial/minimal feel; CAVA pattern = bold/graphic feel. Each variation is a standalone, fully functional, mobile-first HTML file (no dependencies). | CONTEXT: Viet Fire Kitchen restaurant needs modern Vietnamese website design. Sweetgreen template emphasizes whitespace and photography; CAVA template emphasizes bold color-blocking and large typography. 5 Sweetgreen variations + 5 CAVA variations = 10 total options for client review. Files: Website Variations/ folder in project root.

[2026-03-17] DECISION: Full folder reorganization | REASONING: Workspace grew organically with scattered client work, duplicate folders (scripts/ vs tools/), bloated node_modules, and dead files. Transitioning away from restaurants so all Viet Fire Kitchen content deleted. | CONTEXT: Deleted Website Variations/, influencer-lists/, VFK photos. Merged scripts/ into tools/. Flattened proposals from projects/proposals/ to projects/. Moved cold email guides from research/ to references/cold-email/. Archived tmp/ and patentprotector files. Removed empty dirs (sops/, prompts/). Added dist/ to .gitignore.
