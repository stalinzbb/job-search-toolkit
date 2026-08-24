#!/usr/bin/env node
// Copies the three skills into ~/.claude/skills/ (override with CLAUDE_SKILLS_DIR).
import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const src = join(dirname(fileURLToPath(import.meta.url)), "skills");
const dest = process.env.CLAUDE_SKILLS_DIR || join(homedir(), ".claude", "skills");
const force = process.argv.includes("--force");

mkdirSync(dest, { recursive: true });
for (const name of readdirSync(src)) {
  const target = join(dest, name);
  if (existsSync(target) && !force) {
    console.log(`skip  ${name} — already at ${target} (use --force to overwrite)`);
    continue;
  }
  cpSync(join(src, name), target, { recursive: true, force: true });
  console.log(`added ${name}`);
}
console.log(`\nInstalled to ${dest}. Restart Claude Code, then try /jd-keyword-miner.`);
