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

As a plugin (one command, updates with `/plugin update`):

```
/plugin marketplace add stalinzbb/job-application-toolkit
```

Then `/plugin install job-application-toolkit@job-application-toolkit`.

Or symlink the skills, if you'd rather hack on them locally:

```bash
git clone https://github.com/stalinzbb/job-application-toolkit
ln -s "$PWD"/job-application-toolkit/skills/* ~/.claude/skills/
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

Everything for one role lands in one folder — `$JOB_APPS_DIR` if you've set it, otherwise `~/job-applications/`:

```
~/job-applications/stripe-senior-product-designer/
├── inputs/                        # raw fetched job posts, your provided resume
├── keyword-report-2026-08-24.md   # dated per run; the newest one wins
├── linkedin-rewrite-2026-08-24.md
└── resume-rewrite-2026-08-24.md
```

Reports are never overwritten — each run adds a dated one, so the folder is a history. Re-running the miner on new posts opens the new report with a **Since last report** diff. Point the whole thing somewhere else (iCloud, Dropbox) by exporting `JOB_APPS_DIR` in your shell profile.

## How job posts get fetched

Logged-in Chrome (via the claude-in-chrome MCP, so it sees the full post) → WebFetch → asking you to paste the text. The skills never ask for LinkedIn credentials.

## Honesty

The rewrite skills interview you before writing anything, and won't invent experience, metrics, titles, or dates. Anything suggested but unverified is marked `[CONFIRM]` in the draft so you can see exactly what still needs your sign-off. Sharper wording, yes; inflated facts, no.

## Not included yet

DOCX/PDF resume export — ask for it and the built-in `docx` and `pdf` skills will handle the rewrite output.

## License

MIT.
