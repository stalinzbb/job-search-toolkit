---
name: rewrite-resume
description: Rewrites and upgrades the user's resume section by section for a specific target job, with ATS keyword coverage and formatting checks. Use when the user says "rewrite my resume", "tailor my resume to this job", "resume for this JD", or runs /rewrite-resume. For the LinkedIn profile version use rewrite-linkedin-profile; for keyword mining alone use jd-keyword-miner.
---

# Rewrite Resume

Tailor the resume to one target role. Interview first, write second — every strengthened claim has to be true.

## Output location

Everything for one target role lives in one folder:

```
$JOB_APPS_DIR/<company>-<role-slug>/
├── inputs/                        # raw job posts, the resume you provided
├── keyword-report-2026-08-24.md   # newest report wins
├── linkedin-rewrite.md
└── resume-rewrite.md
```

`JOB_APPS_DIR` is the environment variable if the user has set one, otherwise `~/job-applications`. Resolve it once with Bash — `echo "${JOB_APPS_DIR:-$HOME/job-applications}"` — and never hardcode a path. Create the folder on first run and tell the user where it went.

The newest report is whichever `keyword-report-*.md` sorts last: `ls "$DIR"/keyword-report-*.md | tail -1`.

This skill writes `resume-rewrite.md`.
Provided resumes and pasted JDs go in that folder's `inputs/`.

## Step 1 — Get the keyword report

Check `$JOB_APPS_DIR` for an existing `<slug>/keyword-report-*.md` — reports are dated; use the most recent. If one matches the target role, read it and confirm the target with the user.

No report? Ask for the job link(s) and mine them first:
- Fetch chain (never ask for LinkedIn credentials): logged-in Chrome → WebFetch → ask the user to paste the JD.
  For Chrome, load tools with `ToolSearch` query `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__computer`.
- Extract per job: title, seniority, years, hard skills, tools, soft skills, certs, exact recurring phrases, responsibilities, must-have vs nice-to-have.
- Aggregate into a keyword frequency table (keyword | count | category | where to showcase), top 10 keywords, and phrases to mirror verbatim.
- Save as `keyword-report-<YYYY-MM-DD>.md` in the role folder so the LinkedIn skill can reuse it.

## Step 2 — Ingest the current resume

- **Markdown / text** — read it directly.
- **PDF** — use the Read tool (it handles PDFs with a page range).
- **DOCX** — use the built-in `docx` skill to extract the content.
- **No resume** — offer to build one from scratch through the interview in step 3. Say so plainly; don't silently invent a starting point.

Copy whatever they provide into `inputs/` so the run is reproducible.

## Step 3 — Interview loop (do not skip)

Ask before writing:

- **Quantify** — every achievement bullet that has no number: "How much, how many, how fast, compared to what?"
- **Scope** — team size, budget, users, revenue, systems owned
- **Tools** — for each tool the JD names: production use, dabbled, or never? Ask directly.
- **Verify** — for each claim you want to sharpen: "Is this accurate, and to what degree?"
- **Missing wins** — "What did you ship that never made it onto the resume?"
- **Gaps and dates** — employment gaps, overlapping roles, contract vs full-time. Get the facts; don't paper over them.

Batch with `AskUserQuestion` where answers are choosable; plain chat for numbers and stories.

**Honesty rules — non-negotiable:**
- Never invent experience, metrics, titles, dates, or employers.
- Every claim traces to the resume, provided context, or a user answer.
- Unverified suggestions are marked `[CONFIRM]` in the draft.
- Sharper wording, yes. Inflated facts, no.

## Step 4 — Section-by-section rewrite

Each section as:

**Current** → what's there now
**Suggested** → the rewrite
**Why** → which report keywords it hits and what got stronger, in one plain line.

Cover:
1. **Summary / headline** — 2–3 lines, targeted at this role, leading with the strongest true claim.
2. **Skills section** — mirrored to the JD's own language (if they say "CI/CD pipelines", don't write "build automation"). Group by category, order by report frequency.
3. **Experience bullets** — action verb + what you did + measurable outcome + JD keyword. One idea per bullet. Cut bullets that serve no keyword and show no outcome.
4. **Projects** — keep the ones that prove a top-10 keyword; cut or shrink the rest.
5. **Education & certifications** — placement (top if recent grad, bottom otherwise), and which report-named certs are worth pursuing.

Beyond wording, give structural recommendations:
- **Reorder** — which sections move up for this specific role
- **Cut** — stale roles, obsolete tech, anything older than ~10–15 years that isn't load-bearing
- **Add** — missing sections the JD implies (publications, speaking, open source, languages)
- **Length** — one page under ~10 years experience, two pages beyond; say which applies and what to cut to get there

## Step 5 — ATS pass

- **Keyword coverage table** — top report keywords vs where they now appear. Flag every miss and say whether it's fillable honestly.
- **Formatting warnings** — call out anything that breaks resume parsers: tables, multi-column layouts, text in headers/footers, graphics and icons, text inside images, non-standard section headings, unusual fonts. Recommend a standard single-column layout with conventional headings ("Experience", "Education", "Skills").

## Step 6 — Save and report

Write `resume-rewrite.md` containing:
1. The clean final draft, ready to copy out
2. A change log — what moved, what was cut, what was added, and why

In chat print the new summary and the top 5 changes only. Point at the file for the rest.

Offer: "Want the LinkedIn profile matched to this? Run **rewrite-linkedin-profile** — it'll reuse the same report."
