# job-application-toolkit

Three Claude Code skills for applying to jobs: mine job posts for what they actually want, then rewrite your LinkedIn profile and resume to match — without inventing anything.

## Skills

| Skill | What it does | Triggers on |
|---|---|---|
| `jd-keyword-miner` | Pulls keywords, skills, and exact ATS phrases out of one or more job posts and writes a keyword report | "mine this job post", "what does this role want", `/jd-keyword-miner` |
| `rewrite-linkedin-profile` | Rewrites headline, about, experience, and skills against that report | "rewrite my linkedin", "optimize my profile for this job" |
| `rewrite-resume` | Rewrites the resume section by section, with an ATS keyword and formatting pass | "tailor my resume to this job", "resume for this JD" |

Each is self-contained. They chain by invoking each other and by reading each other's saved reports.

## Install

Symlink each skill into `~/.claude/skills/` — edits to this repo are then live immediately:

```bash
ln -s ~/projects/job-application-toolkit/skills/jd-keyword-miner ~/.claude/skills/jd-keyword-miner
ln -s ~/projects/job-application-toolkit/skills/rewrite-linkedin-profile ~/.claude/skills/rewrite-linkedin-profile
ln -s ~/projects/job-application-toolkit/skills/rewrite-resume ~/.claude/skills/rewrite-resume
```

## Usage

```
/jd-keyword-miner https://linkedin.com/jobs/view/... https://linkedin.com/jobs/view/...
```
Three to five posts for similar roles beats one — the frequency counts are what tell you which requirements are real.

```
/rewrite-resume        # reuses the saved report, interviews you, then rewrites
/rewrite-linkedin-profile
```

Natural phrasing works too: "analyze these job postings for keywords", "tailor my resume to this role".

## Output

Everything lands in `~/projects/ja-toolkit-assets/<company>-<role-slug>/`:

```
stripe-senior-product-designer/
├── inputs/              # raw fetched job posts, your provided resume
├── keyword-report.md
├── linkedin-rewrite.md
└── resume-rewrite.md
```

One folder per role you go after. The keyword report is shared by both rewrite skills.

## How job posts get fetched

Logged-in Chrome (via the claude-in-chrome MCP, so it sees the full post) → WebFetch → asking you to paste the text. The skills never ask for LinkedIn credentials.

## Honesty

The rewrite skills interview you before writing anything, and won't invent experience, metrics, titles, or dates. Anything suggested but unverified is marked `[CONFIRM]` in the draft so you can see exactly what still needs your sign-off. Sharper wording, yes; inflated facts, no.

## Not included yet

DOCX/PDF resume export (the built-in `docx` and `pdf` skills can do it on request), and plugin packaging — add `.claude-plugin/plugin.json` if you want to distribute this as a plugin.
