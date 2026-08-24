---
name: rewrite-linkedin-profile
description: Rewrites the user's LinkedIn profile section by section (headline, about, experience, skills) to match a target job, using keywords mined from that job's posting. Use when the user says "rewrite my linkedin", "optimize my profile for this job", "tailor my linkedin to this role", or runs /rewrite-linkedin-profile. For the resume version use rewrite-resume; for keyword mining alone use jd-keyword-miner.
---

# Rewrite LinkedIn Profile

Rewrite the profile against a specific target role. Nothing gets written until the interview step is done — the whole value here is that every claim is true.

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

This skill writes `linkedin-rewrite.md`.

## Step 1 — Get the keyword report

Check `$JOB_APPS_DIR` for an existing `<slug>/keyword-report-*.md` — reports are dated; use the most recent. If one matches the target role, read it and confirm with the user: "Using the report for `<slug>` — right target?"

No report? Ask for the job link(s) and mine them first:
- Fetch chain (never ask for LinkedIn credentials): logged-in Chrome → WebFetch → ask the user to paste the JD.
  For Chrome, load tools with `ToolSearch` query `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__computer`.
- Extract per job: title, seniority, years, hard skills, tools, soft skills, certs, exact recurring phrases, responsibilities, must-have vs nice-to-have.
- Aggregate across jobs into a keyword frequency table (keyword | count | category | where to showcase), top 10 keywords, and the exact phrases to mirror.
- Save it as `keyword-report-<YYYY-MM-DD>.md` in the role folder so the resume skill can reuse it.

## Step 2 — Get the current profile

In order of preference:
1. Fetch the user's own LinkedIn profile via logged-in Chrome (same tool set as above) — navigate to their profile URL, `get_page_text`, expand "see more" on About and Experience.
2. Accept pasted sections.
3. Fall back to their resume or whatever context they give.

If you only have partial sections, rewrite what you have and list what's missing.

## Step 3 — Interview loop (do not skip)

This is the centerpiece. Before writing a single line, ask the questions that turn vague profile text into verifiable claims:

- **Metrics** — "Your About says you 'improved onboarding'. By how much, over what period, measured how?"
- **Scope** — team size, budget, user count, revenue touched, number of stakeholders
- **Tools** — for every tool the JD wants: used it in production, tried it, or never touched it? Ask directly.
- **Verification** — for each punchy claim you want to write: "Is this accurate, and to what degree?"
- **Forgotten wins** — "What did you ship in the last two years that isn't on the profile?"

Batch questions with `AskUserQuestion` where the answers are choosable; use plain chat for open numbers and stories. Ask in one or two rounds, not twenty single questions.

**Honesty rules — non-negotiable:**
- Never invent experience, metrics, titles, dates, or employers.
- Every new claim traces to the user's resume, their provided context, or an answer they gave.
- Any suggestion you couldn't verify goes in marked `[CONFIRM]` so it's obvious what still needs their sign-off.
- Stronger wording is fine; stronger facts are not.

## Step 4 — Section-by-section rewrite

Each section in this format:

**Current** → what's there now (or "empty")
**Rewritten** → the new text
**Why** → which report keywords it now hits, in one plain line. No jargon.

Cover, in order:
1. **Headline** — 220 character limit. Lead with the role target, not "Passionate about…". Give 2–3 options.
2. **About** — first two lines matter most (that's all that shows before "see more"). Keyword-dense but readable aloud.
3. **Experience** — per role, bullet by bullet. Action verb + what you did + measurable outcome + a JD keyword.
4. **Skills** — an ordered list of what to pin. The top 3 pinned skills show on the profile; make them the top report keywords the user actually has.
5. **Licenses & certifications** — what to add, and which report-named certs are worth getting.
6. **Featured & recommendations** — what work to feature, and who to ask for a recommendation mentioning which keyword.
7. **Profile extras checklist** — banner image, open-to-work settings (recruiters-only vs public), custom URL, location matching the JD's market, headline visibility.

## Step 5 — Keyword coverage check

Table: top report keywords vs where they now appear in the rewritten profile. Flag every miss explicitly, and for each miss say whether it's a gap to fill honestly or a keyword the user genuinely can't claim.

## Step 6 — Save and report

Write `linkedin-rewrite.md`. In chat, print the headline options, the new About, and the top changes — not the whole document. Point at the file for the rest.

Offer: "Want the resume tailored the same way? Run **rewrite-resume** — it'll reuse this report."
